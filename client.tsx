import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Server availability flag
let serverAvailable = true;
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

// Helper function to check server health
export const checkServerHealth = async (): Promise<boolean> => {
  const now = Date.now();
  
  // Skip if we checked recently
  if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
    return serverAvailable;
  }
  
  lastHealthCheck = now;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for health check
    
    const response = await fetch(`${supabaseUrl}/functions/v1/make-server-4c32bbd6/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    clearTimeout(timeoutId);
    serverAvailable = response.ok;
    
    if (!serverAvailable) {
      console.warn('Server health check failed:', response.status, response.statusText);
    }
    
    return serverAvailable;
  } catch (error) {
    console.warn('Server health check error:', error.message);
    serverAvailable = false;
    return false;
  }
};

// Helper function to make authenticated requests to our server
export const makeServerRequest = async (endpoint: string, options: RequestInit = {}) => {
  // Check server health first
  const isHealthy = await checkServerHealth();
  
  if (!isHealthy) {
    console.warn(`Server not available, skipping request to: ${endpoint}`);
    throw new Error(`Server not available: ${endpoint}`);
  }

  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token || publicAnonKey;

  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/make-server-4c32bbd6${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Server request failed: ${errorText}`);
      
      // Mark server as unavailable if we get 5xx errors
      if (response.status >= 500) {
        serverAvailable = false;
        lastHealthCheck = 0; // Force health check on next request
      }
      
      throw new Error(`Server request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error(`Server request timed out: ${endpoint}`);
      serverAvailable = false; // Mark as unavailable on timeout
      lastHealthCheck = 0; // Force health check on next request
      throw new Error(`Request timeout: ${endpoint}`);
    }
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error(`Network error for ${endpoint}:`, error.message);
      serverAvailable = false;
      lastHealthCheck = 0;
      throw new Error(`Network error: ${endpoint}`);
    }
    
    throw error;
  }
};