import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Search, 
  Mail, 
  Phone, 
  FileText, 
  MessageSquare, 
  Users, 
  CheckCircle,
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react';

interface AIProcessModalProps {
  isOpen: boolean;
  onComplete: () => void;
  jobTitle: string;
  targetCandidates: number;
}

const processSteps = [
  {
    id: 'posting',
    title: 'Job Portal Distribution',
    description: 'Posting job on LinkedIn, Naukri, Indeed, and internal database',
    icon: Search,
    duration: 2000,
    details: ['LinkedIn Jobs', 'Naukri.com', 'Indeed.com', 'Internal Database']
  },
  {
    id: 'sourcing',
    title: 'AI Candidate Sourcing',
    description: 'Scraping platforms and building candidate pool',
    icon: Bot,
    duration: 3000,
    details: ['LinkedIn Scraping', 'Naukri Database', 'Resume Parsing', 'Skill Matching']
  },
  {
    id: 'filtering',
    title: 'Smart Filtering & Screening',
    description: 'Applying company filters and AI-based screening',
    icon: Users,
    duration: 2500,
    details: ['College Filter', 'Company Filter', 'Experience Match', 'Skill Assessment']
  },
  {
    id: 'outreach',
    title: 'Automated Email Outreach',
    description: 'Sending personalized emails to potential candidates',
    icon: Mail,
    duration: 2000,
    details: ['Email Templates', 'Personalization', 'Interest Tracking', 'Response Monitoring']
  },
  {
    id: 'testing',
    title: 'Technical Assessment',
    description: 'Automated test scheduling and evaluation',
    icon: FileText,
    duration: 3500,
    details: ['Test Generation', 'Auto Scheduling', 'AI Evaluation', 'Score Calculation']
  },
  {
    id: 'calling',
    title: 'AI Calling Agent',
    description: 'Following up with non-responsive candidates',
    icon: Phone,
    duration: 2000,
    details: ['Call Scheduling', 'Voice AI', 'Interest Confirmation', 'Status Updates']
  },
  {
    id: 'interview',
    title: 'AI Interview Process',
    description: 'Conducting automated interviews and evaluation',
    icon: MessageSquare,
    duration: 4000,
    details: ['Interview Scheduling', 'AI Interviewer', 'Behavioral Analysis', 'Performance Scoring']
  },
  {
    id: 'shortlist',
    title: 'Final Shortlisting',
    description: 'Generating final candidate reports and recommendations',
    icon: CheckCircle,
    duration: 1500,
    details: ['AI Scoring', 'Report Generation', 'Ranking Algorithm', 'Final Selection']
  }
];

const AIProcessModal = ({ isOpen, onComplete, jobTitle, targetCandidates }: AIProcessModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && !isProcessing) {
      setIsProcessing(true);
      setCurrentStep(0);
      setCompletedSteps([]);
      runSimulation();
    }
  }, [isOpen]);

  const runSimulation = async () => {
    for (let i = 0; i < processSteps.length; i++) {
      setCurrentStep(i);
      
      // Auto-scroll to current step
      if (stepRefs.current[i] && scrollContainerRef.current) {
        stepRefs.current[i]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, processSteps[i].duration));
      setCompletedSteps(prev => [...prev, processSteps[i].id]);
    }
    
    // Final completion delay then auto-close
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onComplete();
  };

  const handleComplete = () => {
    onComplete();
  };

  if (!isOpen) return null;

  const isCompleted = completedSteps.length === processSteps.length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border/50 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-gradient-hero text-primary-foreground">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">AI Hiring Process</h2>
              <p className="text-primary-foreground/80 text-sm">Automating 80% of recruitment tasks</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
              Job: {jobTitle}
            </Badge>
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
              Target: {targetCandidates} candidates
            </Badge>
          </div>
        </div>

        {/* Process Steps */}
        <div ref={scrollContainerRef} className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index && isProcessing;
              const isCompleted = completedSteps.includes(step.id);
              const isPending = index > currentStep;

              return (
                <div
                  key={step.id}
                  ref={el => stepRefs.current[index] = el}
                  className={`relative p-4 rounded-xl border transition-all duration-500 ${
                    isActive 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : isCompleted 
                        ? 'border-green-500/30 bg-green-500/5' 
                        : 'border-border/50 bg-muted/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isActive ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{step.title}</h3>
                        {isActive && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Processing...
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                      
                      {(isActive || isCompleted) && (
                        <div className="flex flex-wrap gap-2">
                          {step.details.map((detail, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {detail}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {index < processSteps.length - 1 && (
                      <ArrowRight className={`w-5 h-5 transition-colors ${
                        isCompleted ? 'text-green-500' : 'text-muted-foreground'
                      }`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-border/50 bg-card/95 backdrop-blur-sm">
          {isCompleted ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Process Complete!</h3>
              <p className="text-muted-foreground text-sm mb-6">
                AI has successfully processed {targetCandidates} candidates and generated detailed reports.
                Ready for your final review and interviews.
              </p>
              <Button onClick={handleComplete} variant="hero" size="lg" className="w-full">
                <Users className="w-5 h-5 mr-2" />
                View Candidate Pool
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                AI agents are working on your recruitment process...
              </p>
              <div className="mt-3 bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / processSteps.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Step {currentStep + 1} of {processSteps.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIProcessModal;