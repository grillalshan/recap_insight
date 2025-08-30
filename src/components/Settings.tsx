import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Save, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AppSettings } from '@/types';
import { saveSettings, getSettings } from '@/utils/storage';

const Settings = () => {
  const [settings, setSettings] = useState<AppSettings>({ openaiApiKey: '' });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = getSettings();
    setSettings(savedSettings);
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      saveSettings(settings);
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setSettings(prev => ({ ...prev, openaiApiKey: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your Recap.ai preferences and API settings
        </p>
      </div>

      {/* API Configuration */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Key className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">OpenAI API Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Required for generating weekly summaries
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="sk-..."
                value={settings.openaiApiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never shared
            </p>
          </div>

          <div className="flex justify-between items-center">
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Get your API key from OpenAI
              <ExternalLink className="w-3 h-3" />
            </a>
            
            <Button
              onClick={handleSaveSettings}
              disabled={isLoading}
              variant="hero"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Usage Information */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <SettingsIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Usage Information</h2>
        </div>

        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground mb-2">API Key Security</h3>
            <p>
              Your OpenAI API key is stored locally in your browser and is never sent to our servers. 
              It's only used to communicate directly with OpenAI's API from your browser.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium text-foreground mb-2">API Usage & Costs</h3>
            <p>
              Weekly summaries use OpenAI's GPT-3.5-turbo model. Typical costs are very low 
              (usually under $0.01 per summary). You can monitor your usage on the OpenAI platform.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium text-foreground mb-2">Data Storage</h3>
            <p>
              All your daily logs and summaries are stored locally in your browser. 
              No data is sent to external servers except when generating summaries via OpenAI's API.
            </p>
          </div>
        </div>
      </Card>

      {/* Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">API Status</h3>
            <p className="text-sm text-muted-foreground">
              {settings.openaiApiKey 
                ? "API key configured - ready to generate summaries" 
                : "API key required for summary generation"}
            </p>
          </div>
          <div className={`w-3 h-3 rounded-full ${
            settings.openaiApiKey ? 'bg-accent' : 'bg-warning'
          }`} />
        </div>
      </Card>
    </div>
  );
};

export default Settings;