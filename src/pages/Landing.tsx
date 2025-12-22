import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Zap, Users, BarChart3, Clock, CheckCircle2, ArrowRight, Bot, FileSearch, Phone, ClipboardCheck } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const steps = [
    { icon: ClipboardCheck, title: 'Post Job', description: 'Define role requirements and preferences once' },
    { icon: FileSearch, title: 'AI Sources & Screens', description: 'Automated candidate sourcing from multiple platforms' },
    { icon: Phone, title: 'Automated Outreach', description: 'AI handles tests, interviews, and follow-ups' },
    { icon: Users, title: 'Final Shortlist', description: 'Receive 3× qualified candidates with AI reports' },
  ];

  const benefits = [
    { icon: Clock, title: '80% Less Manual Effort', description: 'Automate repetitive screening and outreach tasks' },
    { icon: Zap, title: 'Faster Time to Hire', description: 'Reduce hiring cycle from weeks to days' },
    { icon: BarChart3, title: 'Data-Driven Shortlisting', description: 'AI scoring ensures objective candidate evaluation' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">iRecruit</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="default" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-slide-up">
            <Zap className="w-4 h-4" />
            AI-Powered Recruitment Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Automate <span className="text-gradient">80%</span> of Your Hiring with AI
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            From job posting to final shortlist — fully automated. Get 3× qualified candidates with detailed AI evaluation reports.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" onClick={() => navigate('/signup')}>
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => navigate('/login')}>
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[
              { value: '80%', label: 'Time Saved' },
              { value: 'AI', label: 'based Reports' },
              { value: '95%', label: 'Accuracy' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-gradient">{stat.value}</div>
                <div className="text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 bg-gradient-subtle">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Four simple steps to transform your hiring process</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div 
                key={step.title}
                className="relative bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why Choose iRecruit?</h2>
            <p className="text-muted-foreground text-lg">Built for modern HR teams who value efficiency</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.title}
                className="bg-card rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20 animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 shadow-glow">
                  <benefit.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 px-6 bg-gradient-subtle">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card rounded-3xl p-10 shadow-lg">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">Everything You Need</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Multi-platform candidate sourcing',
                'AI-powered resume screening',
                'Automated test administration',
                'Virtual interview scheduling',
                'AI calling agent for follow-ups',
                'Comprehensive evaluation reports',
                'Customizable rejection criteria',
                'Real-time pipeline tracking',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Start Hiring <span className="text-gradient">Smarter</span> Today
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join hundreds of companies automating their recruitment with AI. No credit card required.
          </p>
          <Button variant="hero" size="xl" onClick={() => navigate('/signup')}>
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-hero flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">iRecruit</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 iRecruit. AI-Powered Recruitment Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
