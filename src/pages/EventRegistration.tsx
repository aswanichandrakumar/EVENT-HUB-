import { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { getEventById, mapSupabaseEventToEvent, type Event } from '@/data/events';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CreditCard, 
  UserCheck,
  ArrowLeft,
  Shield,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EventRegistration = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const localEvent = eventId ? getEventById(eventId) : null;
  const [event, setEvent] = useState<Event | null>(localEvent ?? null);
  const [isLoadingEvent, setIsLoadingEvent] = useState<boolean>(!localEvent);
  
  // If not found in local mock data, try to fetch from Supabase
  useEffect(() => {
    const fetchEvent = async () => {
      if (event || !eventId) return;
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .maybeSingle();
      if (!error && data) {
        setEvent(mapSupabaseEventToEvent(data));
      }
      setIsLoadingEvent(false);
    };
    fetchEvent();
  }, [event, eventId]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    ticketType: event?.price === 'Free' ? 'free' : 'paid',
    specialRequests: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center text-muted-foreground">
        Loading event...
      </div>
    );
  }
  
  if (!event) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive"
      });
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Error", 
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('registrations')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            event_type: event?.type || 'Unknown',
            ticket_type: formData.ticketType === 'paid' ? 'paid' : 'free',
            status: 'confirmed'
          }
        ]);

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "Registration Failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Registration Successful!",
        description: "You've been registered for the event. Check your email for confirmation.",
      });

      // Navigate to success page with registration data
      navigate('/registration-success', {
        state: {
          registrationData: {
            eventTitle: event.title,
            eventDate: event.date,
            eventTime: event.time,
            eventLocation: event.location,
            eventType: event.type,
            fullName: formData.fullName,
            email: formData.email,
            ticketType: formData.ticketType
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const availableSpots = event.capacity - event.registered;
  const isAlmostFull = availableSpots <= 10;
  const isFull = availableSpots <= 0;

  return (
    <div className="min-h-screen pt-16">
      {/* Back Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
      </div>

      {/* Event Header */}
      <section className="py-8 bg-background-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Event Image */}
              <div className="md:col-span-1">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 md:h-full object-cover rounded-lg"
                />
              </div>

              {/* Event Details */}
              <div className="md:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="mb-2">
                      {event.type}
                    </Badge>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                      {event.title}
                    </h1>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {event.price === 'Free' ? 'Free' : `₹${event.price}`}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  {event.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    {availableSpots} spots left
                  </div>
                </div>

                {/* Availability Status */}
                {isFull ? (
                  <Badge variant="destructive" className="mb-4">
                    Event Full - Registration Closed
                  </Badge>
                ) : isAlmostFull ? (
                  <Badge className="bg-warning text-warning-foreground mb-4">
                    Almost Full - Register Soon!
                  </Badge>
                ) : (
                  <Badge className="bg-success text-success-foreground mb-4">
                    Registration Open
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      {!isFull && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Registration Form */}
              <div className="md:col-span-2">
                <div className="glass-card p-6 md:p-8">
                  <div className="flex items-center mb-6">
                    <UserCheck className="w-6 h-6 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-foreground">
                      Register for Event
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        Personal Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName" className="text-foreground">
                            Full Name *
                          </Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                            required
                            className="mt-1 glass-card border-white/10"
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-foreground">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                            className="mt-1 glass-card border-white/10"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-foreground">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          required
                          className="mt-1 glass-card border-white/10"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    {/* Ticket Type */}
                    {event.price !== 'Free' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">
                          Ticket Type
                        </h3>
                        <RadioGroup 
                          value={formData.ticketType} 
                          onValueChange={(value) => handleChange('ticketType', value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paid" id="paid" />
                            <Label htmlFor="paid" className="text-foreground">
                              Standard Ticket - ₹{event.price}
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                    {/* Special Requests */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        Additional Information
                      </h3>
                      
                      <div>
                        <Label htmlFor="specialRequests" className="text-foreground">
                          Special Requests or Dietary Restrictions
                        </Label>
                        <Textarea
                          id="specialRequests"
                          value={formData.specialRequests}
                          onChange={(e) => handleChange('specialRequests', e.target.value)}
                          rows={3}
                          className="mt-1 glass-card border-white/10 resize-none"
                          placeholder="Any special requirements or requests..."
                        />
                      </div>
                    </div>

                    {/* Agreements */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => handleChange('agreeToTerms', checked)}
                          required
                        />
                        <Label htmlFor="terms" className="text-sm text-foreground leading-relaxed">
                          I agree to the{' '}
                          <Link to="/terms" className="text-primary hover:underline">
                            Terms and Conditions
                          </Link>
                          {' '}and{' '}
                          <Link to="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                          {' '}*
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="newsletter"
                          checked={formData.subscribeNewsletter}
                          onCheckedChange={(checked) => handleChange('subscribeNewsletter', checked)}
                        />
                        <Label htmlFor="newsletter" className="text-sm text-foreground leading-relaxed">
                          Subscribe to our newsletter for event updates and announcements
                        </Label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      variant="gradient" 
                      className="w-full"
                      disabled={isSubmitting || !formData.agreeToTerms}
                    >
                      {isSubmitting ? (
                        'Processing Registration...'
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" />
                          {event.price === 'Free' ? 'Complete Registration' : `Pay & Register - ₹${event.price}`}
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="md:col-span-1 space-y-6">
                {/* Security Info */}
                <div className="glass-card p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="w-5 h-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Secure Registration
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• SSL encrypted data transmission</li>
                    <li>• Instant email confirmation</li>
                    <li>• Secure payment processing</li>
                    <li>• GDPR compliant data handling</li>
                  </ul>
                </div>

                {/* What to Expect */}
                <div className="glass-card p-6">
                  <div className="flex items-center mb-4">
                    <Mail className="w-5 h-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold text-foreground">
                      What Happens Next?
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Instant confirmation email</li>
                    <li>• Event reminder 24 hours before</li>
                    <li>• Access to event materials</li>
                    <li>• QR code for check-in</li>
                  </ul>
                </div>

                {/* Event Features */}
                {event.features && (
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      What's Included
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {event.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default EventRegistration;