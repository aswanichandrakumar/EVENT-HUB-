import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-conference.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="EventHub - Modern Event Registration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 animated-gradient opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                EventHub
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Your all-in-one platform for hassle-free event registrations. 
              Simple for attendees, powerful for organizers.
            </p>
          </div>

          {/* Features grid moved to second section on Home */}

          {/* Call to Action */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events">
                <Button
                  variant="hero"
                  size="lg"
                  className="transform hover:scale-105"
                >
                  Explore Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            <p className="text-gray-400 text-sm">
              Join thousands of successful events • Free to get started
            </p>
          </div>

          {/* Illustration moved to Home page (second section) */}
        </div>
      </div>

      {/* Removed scroll indicator */}
    </section>
  );
};

export default HeroSection;