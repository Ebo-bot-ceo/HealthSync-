import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { OAuthSetupGuide } from './auth/OAuthSetupGuide';

export const OAuthSetupPage = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <OAuthSetupGuide />
      </div>
    </div>
  );
};