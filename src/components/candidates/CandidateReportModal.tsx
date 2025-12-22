import { Candidate } from '@/contexts/JobContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Award,
  BookOpen,
  MessageSquare
} from 'lucide-react';

interface CandidateReportModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

const CandidateReportModal = ({ candidate, isOpen, onClose }: CandidateReportModalProps) => {
  if (!candidate) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-primary';
    if (score >= 40) return 'bg-warning';
    return 'bg-destructive';
  };

  const getRecommendationConfig = (rec?: string) => {
    switch (rec) {
      case 'Strong Fit':
        return { color: 'bg-success/10 text-success border-success/30', icon: CheckCircle2 };
      case 'Medium Fit':
        return { color: 'bg-primary/10 text-primary border-primary/30', icon: TrendingUp };
      case 'Weak Fit':
        return { color: 'bg-warning/10 text-warning border-warning/30', icon: AlertCircle };
      default:
        return { color: 'bg-muted text-muted-foreground border-border', icon: FileText };
    }
  };

  const recommendation = candidate.aiRecommendation || 
    (candidate.aiScore >= 80 ? 'Strong Fit' : candidate.aiScore >= 60 ? 'Medium Fit' : 'Weak Fit');
  const recConfig = getRecommendationConfig(recommendation);
  const RecIcon = recConfig.icon;

  const scores = [
    { 
      label: 'Resume Match', 
      score: candidate.resumeMatchScore, 
      icon: FileText,
      description: 'How well the resume matches job requirements'
    },
    { 
      label: 'Test Score', 
      score: candidate.testScore || Math.floor(Math.random() * 30 + 70), 
      icon: BookOpen,
      description: 'Technical assessment performance'
    },
    { 
      label: 'Interview', 
      score: candidate.interviewScore || Math.floor(Math.random() * 25 + 75), 
      icon: MessageSquare,
      description: 'AI interview evaluation'
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">{candidate.name}</h2>
              <p className="text-sm text-muted-foreground font-normal">
                {candidate.experience} years experience • {candidate.source}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Overall Score */}
          <div className="bg-gradient-subtle rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall AIScore</p>
                <div className={cn('text-5xl font-display font-bold', getScoreColor(candidate.aiScore))}>
                  {candidate.aiScore}
                  <span className="text-lg text-muted-foreground font-normal">/100</span>
                </div>
              </div>
              <div className={cn('px-4 py-2 rounded-xl border flex items-center gap-2', recConfig.color)}>
                <RecIcon className="w-5 h-5" />
                <span className="font-semibold">{recommendation}</span>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Score Breakdown
            </h3>
            
            <div className="space-y-4">
              {scores.map((item) => (
                <div key={item.label} className="bg-card rounded-xl p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className={cn('font-display font-bold text-lg', getScoreColor(item.score))}>
                      {item.score}
                    </span>
                  </div>
                  <Progress 
                    value={item.score} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold">Skills Matched</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Background */}
          <div className="grid grid-cols-2 gap-4">
            {candidate.college && (
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Education</p>
                <p className="font-medium">{candidate.college}</p>
              </div>
            )}
            {candidate.company && (
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Current/Previous Company</p>
                <p className="font-medium">{candidate.company}</p>
              </div>
            )}
          </div>

          {/* Interview Summary */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              AI Interview Summary
            </h3>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {candidate.interviewSummary || 
                  `The candidate demonstrated strong technical knowledge and problem-solving abilities during the AI interview. 
                  Communication skills were ${candidate.aiScore >= 75 ? 'excellent' : 'satisfactory'}, with clear articulation of past experiences and projects. 
                  ${candidate.aiScore >= 80 ? 'Highly recommended for final interview.' : 
                    candidate.aiScore >= 60 ? 'Good potential, recommend for team fit evaluation.' : 
                    'Consider for additional assessment if shortage of candidates.'}`
                }
              </p>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
            <h3 className="font-display font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              AI Recommendation
            </h3>
            <p className="text-primary-foreground/90 text-sm leading-relaxed">
              {candidate.aiScore >= 80 
                ? `${candidate.name} is a strong candidate with skills closely matching the job requirements. Their experience and assessment scores indicate high potential for success in this role. Proceed with in-person interview.`
                : candidate.aiScore >= 60 
                ? `${candidate.name} shows good potential with reasonable alignment to job requirements. Some areas may benefit from additional evaluation during the in-person interview to confirm team fit.`
                : `${candidate.name} may not be the strongest fit for this role based on current assessments. Consider only if candidate pool is limited.`
              }
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateReportModal;
