import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useJobs } from '@/contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Zap, 
  Phone, 
  Save,
  Filter,
  Plus,
  XCircle
} from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings } = useJobs();
  const { toast } = useToast();
  const [collegeInput, setCollegeInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');

  const handleAddCollege = () => {
    if (collegeInput.trim() && !settings.filteringCriteria.deniedColleges.includes(collegeInput.trim())) {
      updateSettings({
        filteringCriteria: {
          ...settings.filteringCriteria,
          deniedColleges: [...settings.filteringCriteria.deniedColleges, collegeInput.trim()]
        }
      });
      setCollegeInput('');
    }
  };

  const handleAddCompany = () => {
    if (companyInput.trim() && !settings.filteringCriteria.deniedCompanies.includes(companyInput.trim())) {
      updateSettings({
        filteringCriteria: {
          ...settings.filteringCriteria,
          deniedCompanies: [...settings.filteringCriteria.deniedCompanies, companyInput.trim()]
        }
      });
      setCompanyInput('');
    }
  };

  const handleRemoveCollege = (college: string) => {
    updateSettings({
      filteringCriteria: {
        ...settings.filteringCriteria,
        deniedColleges: settings.filteringCriteria.deniedColleges.filter(c => c !== college)
      }
    });
  };

  const handleRemoveCompany = (company: string) => {
    updateSettings({
      filteringCriteria: {
        ...settings.filteringCriteria,
        deniedCompanies: settings.filteringCriteria.deniedCompanies.filter(c => c !== company)
      }
    });
  };

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated.',
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your AI hiring preferences
          </p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* AI Score Threshold */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">AIScore Rejection Threshold</h3>
                <p className="text-sm text-muted-foreground">
                  Candidates below this score will be automatically rejected
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Minimum AIScore</Label>
                <span className="text-2xl font-display font-bold text-primary">
                  {settings.aiScoreThreshold}
                </span>
              </div>
              <Slider
                value={[settings.aiScoreThreshold]}
                onValueChange={(value) => updateSettings({ aiScoreThreshold: value[0] })}
                min={0}
                max={100}
                step={5}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0 (Accept all)</span>
                <span>100 (Very strict)</span>
              </div>
            </div>
          </div>

          {/* Filtering Criteria */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Filter className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">Filtering Criteria</h3>
                <p className="text-sm text-muted-foreground">
                  Company-wide filters applied to all job postings
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Denied Colleges */}
              <div className="space-y-3">
                <Label>Denied Colleges</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter college name"
                    value={collegeInput}
                    onChange={(e) => setCollegeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCollege())}
                    className="h-12"
                  />
                  <Button type="button" variant="secondary" onClick={handleAddCollege}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {settings.filteringCriteria.deniedColleges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.filteringCriteria.deniedColleges.map((college) => (
                      <Badge 
                        key={college} 
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/10"
                        onClick={() => handleRemoveCollege(college)}
                      >
                        {college}
                        <XCircle className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Denied Companies */}
              <div className="space-y-3">
                <Label>Denied Companies</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter company name"
                    value={companyInput}
                    onChange={(e) => setCompanyInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompany())}
                    className="h-12"
                  />
                  <Button type="button" variant="secondary" onClick={handleAddCompany}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {settings.filteringCriteria.deniedCompanies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.filteringCriteria.deniedCompanies.map((company) => (
                      <Badge 
                        key={company} 
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/10"
                        onClick={() => handleRemoveCompany(company)}
                      >
                        {company}
                        <XCircle className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Calling Agent */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-lg">AI Calling Agent</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically call candidates who don't respond to emails
                </p>
              </div>
              <Switch
                checked={settings.enableCallingAgent}
                onCheckedChange={(checked) => updateSettings({ enableCallingAgent: checked })}
              />
            </div>

            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Max Call Attempts</p>
                  <p className="text-xs text-muted-foreground">Per candidate</p>
                </div>
                <span className="text-lg font-display font-bold text-muted-foreground">
                  {settings.maxCallAttempts}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This setting is fixed and cannot be changed
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-subtle rounded-2xl p-6 border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg mb-2">AI Agent Behavior</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• AI agents source candidates from LinkedIn, Naukri, Indeed, and internal database</li>
                  <li>• Candidates are automatically screened against job requirements</li>
                  <li>• Tests and interviews are scheduled and evaluated automatically</li>
                  <li>• You receive a final shortlist of 3× the required hires</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full"
            onClick={handleSave}
          >
            <Save className="w-5 h-5 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
