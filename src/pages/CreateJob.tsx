import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useJobs } from '@/contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Users, Calendar, Zap, FileText, MessageSquare } from 'lucide-react';

const CreateJob = () => {
  const navigate = useNavigate();
  const { createJob } = useJobs();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    experienceRange: '',
    skills: '',
    hiresRequired: '',
    startDate: '',
    endDate: '',
    testInstructions: '',
    interviewInstructions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const job = createJob({
      title: formData.title,
      experienceRange: formData.experienceRange,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      hiresRequired: Number(formData.hiresRequired) || 1,
      startDate: formData.startDate,
      endDate: formData.endDate,
      testInstructions: formData.testInstructions,
      interviewInstructions: formData.interviewInstructions,
    });

    toast({
      title: 'AI Hiring Process Started!',
      description: `Target: ${job.targetShortlist} candidates (3× of ${job.hiresRequired} hires)`,
    });

    navigate(`/job/${job.id}`);
    setIsLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            AI-Powered Hiring
          </div>
          <h1 className="text-3xl font-display font-bold mb-2">Create New Job</h1>
          <p className="text-muted-foreground">
            Define the role and let AI find and screen candidates for you
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Job Details
            </h2>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Range</Label>
                  <Input
                    id="experience"
                    placeholder="e.g., 2-5 years"
                    value={formData.experienceRange}
                    onChange={(e) => setFormData(prev => ({ ...prev, experienceRange: e.target.value }))}
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hires">Hires Required</Label>
                  <Input
                    id="hires"
                    type="number"
                    min="1"
                    value={formData.hiresRequired}
                    onChange={(e) => setFormData(prev => ({ ...prev, hiresRequired: e.target.value }))}
                    className="h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills</Label>
                <Input
                  id="skills"
                  placeholder="e.g., React, Node.js, TypeScript (comma-separated)"
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>
            </div>
          </div>

          {/* Time Window */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Sourcing Time Window
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>
            </div>
          </div>

          {/* AI Assessment Configuration */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              AI Assessment Configuration
            </h2>
            
            <div className="space-y-6">
              {/* Test Instructions */}
              <div className="space-y-2">
                <Label htmlFor="testInstructions" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Technical Assessment Guidelines
                </Label>
                <textarea
                  id="testInstructions"
                  placeholder="e.g., Focus on React hooks, include algorithm questions, time limit 60 minutes..."
                  value={formData.testInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, testInstructions: e.target.value }))}
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground">
                  Specify any custom requirements, question types, or constraints for the technical test
                </p>
              </div>

              {/* Interview Instructions */}
              <div className="space-y-2">
                <Label htmlFor="interviewInstructions" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  AI Interview Focus Areas
                </Label>
                <textarea
                  id="interviewInstructions"
                  placeholder="e.g., Emphasize problem-solving approach, ask about past projects, assess cultural fit..."
                  value={formData.interviewInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, interviewInstructions: e.target.value }))}
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground">
                  Guide the AI interviewer on key topics, behavioral questions, and evaluation criteria
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              AI Targeting Preview
            </h3>
            <p className="text-muted-foreground text-sm">
              The AI will source candidates and deliver a shortlist of{' '}
              <span className="font-semibold text-primary">{(Number(formData.hiresRequired) || 1) * 3} candidates</span>{' '}
              (3× of {Number(formData.hiresRequired) || 1} hires required) with detailed evaluation reports.
            </p>
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            variant="hero" 
            size="xl" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Starting AI Process...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Start AI Hiring Process
              </>
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateJob;
