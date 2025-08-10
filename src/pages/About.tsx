import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Shield, 
  Zap, 
  BarChart3, 
  Mail,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Registration',
      description: 'Simple, intuitive forms that make event registration a breeze for attendees.'
    },
    {
      icon: Mail,
      title: 'Automated Communications',
      description: 'Instant confirmations, timely reminders, and follow-up emails sent automatically.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security ensures your data and payments are always protected.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Comprehensive reports and real-time analytics to track your event performance.'
    },
    {
      icon: Users,
      title: 'Capacity Management',
      description: 'Smart capacity controls with automatic registration closing when events are full.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance ensures smooth registration experience even during peak times.'
    }
  ];

  const benefits = [
    'Instant email confirmations for peace of mind',
    'Mobile-responsive design works on any device',
    'Customizable registration forms for any event type',
    'Real-time registration tracking and analytics',
    'Automated reminder system reduces no-shows',
    'Export data to Excel/CSV for easy reporting',
    'Professional dashboard for complete event control',
    '24/7 reliable hosting with 99.9% uptime'
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 animated-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            About EventHub
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Simplifying Event Registration{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              For Everyone
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            At EventHub, we make it simple for attendees to register, receive instant confirmations, 
            and stay informed with timely reminders. For event organizers, our secure admin dashboard 
            offers complete control over registrations, capacity management, and detailed analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gradient" size="lg">
              Start Your Event
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're hosting a college fest, corporate training, webinar, or sports event, 
              EventHub ensures a smooth, professional, and engaging registration experience. 
              We believe that event management should be powerful yet simple, giving organizers 
              the tools they need while keeping the experience delightful for attendees.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose EventHub?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage successful events, from registration to analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass-card p-6 hover:shadow-glow transition-all duration-300 group"
              >
                <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Built for Success
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                EventHub combines powerful features with an intuitive interface, 
                making event management accessible to everyone while providing 
                enterprise-level capabilities.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Join Our Community
                </h3>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                    <div className="text-muted-foreground">Events Hosted</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                    <div className="text-muted-foreground">Registrations</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">500+</div>
                    <div className="text-muted-foreground">Organizers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                    <div className="text-muted-foreground">Uptime</div>
                  </div>
                </div>

                <Button variant="gradient" className="w-full">
                  Get Started Today
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Elevate Your Events?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful event organizers who trust EventHub 
            for their registration management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gradient" size="lg">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;