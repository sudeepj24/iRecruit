import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Clock, 
  Plus,
  ArrowRight,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { jobs } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalCandidates = jobs.reduce((acc, job) => acc + job.candidates.length, 0);
  const shortlistedCandidates = jobs.reduce((acc, job) => 
    acc + job.candidates.filter(c => c.status === 'completed').length, 0
  );

  const stats = [
    { 
      label: 'Active Jobs', 
      value: activeJobs, 
      icon: Briefcase, 
      color: 'bg-primary/10 text-primary' 
    },
    { 
      label: 'Total Candidates', 
      value: totalCandidates, 
      icon: Users, 
      color: 'bg-accent/10 text-accent' 
    },
    { 
      label: 'Shortlisted', 
      value: shortlistedCandidates, 
      icon: TrendingUp, 
      color: 'bg-success/10 text-success' 
    },
    { 
      label: 'Avg. Time to Hire', 
      value: '5 days', 
      icon: Clock, 
      color: 'bg-warning/10 text-warning' 
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome back, {user?.companyName || 'there'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your hiring pipeline
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-display font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Create Job Card */}
          <div className="bg-gradient-hero rounded-2xl p-8 text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <Plus className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Create New Job</h3>
              <p className="text-primary-foreground/80 mb-6">
                Post a new position and let AI find the perfect candidates for you
              </p>
              <Button 
                variant="glass"
                className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/20"
                onClick={() => navigate('/create-job')}
              >
                Create Job
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* AI Status Card */}
          <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                <Zap className="w-7 h-7 text-accent" />
              </div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                AI Active
              </span>
            </div>
            <h3 className="text-2xl font-display font-bold mb-2">AI Hiring Agents</h3>
            <p className="text-muted-foreground mb-6">
              Your AI agents are actively sourcing and screening candidates
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">Sourcing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                <span className="text-muted-foreground">Screening</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                <span className="text-muted-foreground">Evaluating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-display font-semibold">Recent Jobs</h3>
            {jobs.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')}>
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
          
          {jobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-semibold mb-2">No jobs yet</h4>
              <p className="text-muted-foreground text-sm mb-6">
                Create your first job posting to start the AI hiring process
              </p>
              <Button onClick={() => navigate('/create-job')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Job
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {jobs.slice(0, 5).map((job) => {
                const candidatesByStatus = {
                  sourced: job.candidates.filter(c => c.status === 'sourced').length,
                  shortlisted: job.candidates.filter(c => c.status === 'shortlisted').length,
                  completed: job.candidates.filter(c => c.status === 'completed').length,
                };
                
                return (
                  <div 
                    key={job.id}
                    className="p-6 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/job/${job.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold mb-1">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {job.hiresRequired} hires needed • Target: {job.targetShortlist} candidates
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{job.candidates.length} sourced</p>
                          <p className="text-xs text-muted-foreground">{candidatesByStatus.completed} ready</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'active' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {job.status === 'active' ? 'AI Hiring Active' : job.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
