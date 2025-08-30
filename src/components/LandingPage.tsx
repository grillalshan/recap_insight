import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Bot, 
  Calendar, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const features = [
    {
      icon: Calendar,
      title: "Daily Work Logging",
      description: "Easily capture your daily tasks, achievements, and progress in a clean, intuitive interface."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Summaries",
      description: "Generate professional weekly reports automatically using advanced GPT technology."
    },
    {
      icon: FileText,
      title: "Professional Reports",
      description: "Create polished summaries perfect for sharing with managers and stakeholders."
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Turn hours of manual reporting into minutes of automated summary generation."
    },
    {
      icon: Target,
      title: "Track Progress",
      description: "Visualize your accomplishments and maintain momentum week after week."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get your weekly summary in seconds with our lightning-fast AI processing."
    }
  ];

  const benefits = [
    "Never forget important accomplishments",
    "Impress managers with detailed reports", 
    "Save hours on status updates",
    "Build a record of your contributions",
    "Identify patterns in your productivity"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-primary/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-primary/20">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Recap.ai
              </h1>
            </div>

            {/* Hero Content */}
            <h2 className="text-3xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Transform Daily Tasks Into
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Professional Reports
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              The AI-powered productivity tool that helps employees log daily work and generate 
              impressive weekly summaries in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onGetStarted}
                size="lg" 
                variant="hero"
                className="text-lg px-8 py-4 h-auto font-semibold"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-4 h-auto font-semibold"
              >
                See How It Works
              </Button>
            </div>

            <p className="text-muted-foreground text-sm mt-4">
              No signup required • Powered by OpenAI GPT
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything You Need for Better Reporting
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your workflow with powerful features designed for modern professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 h-full bg-card shadow-card hover:shadow-md transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-muted-foreground">
              From daily logging to professional reports in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Log Daily Work",
                description: "Record your tasks, achievements, and progress each day with our intuitive interface.",
                icon: Calendar
              },
              {
                step: "02", 
                title: "Review Your Week",
                description: "View all your logged activities organized by week with easy navigation.",
                icon: FileText
              },
              {
                step: "03",
                title: "Generate AI Summary", 
                description: "Click one button to create a professional weekly report using advanced AI.",
                icon: Sparkles
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Why Professionals Choose Recap.ai
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of productive professionals who have transformed their reporting workflow
            </p>
            
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="text-lg text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button 
                onClick={onGetStarted}
                size="lg" 
                variant="hero"
                className="text-lg px-8 py-4 h-auto font-semibold"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Card className="p-8 bg-card shadow-elegant border">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full" />
                  <div className="w-3 h-3 bg-warning rounded-full" />
                  <div className="w-3 h-3 bg-destructive rounded-full" />
                </div>
                
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded-md w-3/4" />
                  <div className="h-4 bg-muted rounded-md w-full" />
                  <div className="h-4 bg-muted rounded-md w-2/3" />
                  <div className="h-8 bg-gradient-primary rounded-md w-1/2" />
                  <div className="h-4 bg-muted rounded-md w-5/6" />
                  <div className="h-4 bg-muted rounded-md w-3/4" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Start logging your daily work and generating professional summaries today.
          </p>
          
          <Button 
            onClick={onGetStarted}
            size="lg" 
            variant="secondary"
            className="text-lg px-12 py-4 h-auto font-semibold"
          >
            Get Started Now - It's Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-primary-foreground/70 text-sm mt-6">
            No credit card required • Start in seconds
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;