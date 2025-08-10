import { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Mail, 
  Download,
  Home,
  Share2,
  MessageCircle
} from 'lucide-react';

interface RegistrationData {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventType: string;
  fullName: string;
  email: string;
  ticketType: string;
}

const RegistrationSuccess = () => {
  const location = useLocation();
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);

  useEffect(() => {
    if (location.state && location.state.registrationData) {
      setRegistrationData(location.state.registrationData);
    }
  }, [location.state]);

  // If no registration data, redirect to home
  if (!registrationData) {
    return <Navigate to="/" replace />;
  }

  const handleShare = async () => {
    const shareData = {
      title: `I'm attending ${registrationData.eventTitle}!`,
      text: `Just registered for ${registrationData.eventTitle} on ${registrationData.eventDate}. Join me!`,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Sharing failed or was canceled');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Success Hero */}
      <section className="py-20 animated-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-8 md:p-12">
            <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <Badge className="mb-4 bg-success/10 text-success border-success/20">
              Registration Successful
            </Badge>
            
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              You're All Set!
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Thank you, {registrationData.fullName}! Your registration for{' '}
              <span className="text-primary font-semibold">
                {registrationData.eventTitle}
              </span>{' '}
              has been confirmed.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="gradient">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Events
                </Link>
              </Button>
              
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share with Friends
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Confirmation */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Event Information */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Event Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Date</p>
                    <p className="text-muted-foreground">{registrationData.eventDate}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Time</p>
                    <p className="text-muted-foreground">{registrationData.eventTime}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-muted-foreground">{registrationData.eventLocation}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <Badge className="mb-2">
                  {registrationData.eventType}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Ticket Type: {registrationData.ticketType === 'free' ? 'Free' : 'Paid'}
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                What's Next?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Confirmation Email</p>
                    <p className="text-muted-foreground text-sm">
                      Check your inbox at {registrationData.email} for your confirmation email with event details.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Download className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Event Materials</p>
                    <p className="text-muted-foreground text-sm">
                      Access pre-event materials and updates via the confirmation email.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Event Reminders</p>
                    <p className="text-muted-foreground text-sm">
                      We'll send you reminders 24 hours before the event starts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-muted-foreground">
                  Questions? Contact us at{' '}
                  <Link to="/contact" className="text-primary hover:underline">
                    support@eventhub.com
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Actions */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Discover More Events
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Don't miss out on other exciting events happening soon
          </p>
          <Button asChild variant="outline" size="lg">
            <Link to="/">
              Browse All Events
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default RegistrationSuccess;