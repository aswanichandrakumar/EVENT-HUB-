import { Link } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, Monitor, Bot, Video, Users, Calendar, LineChart, MailCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* Illustration Section (second scroll) */}
      <section className="mt-10 md:mt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">
              Register Today – Be Part of Something Extraordinary
            </h2>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              Unlock exclusive experiences, connect with inspiring people, and create memories that last a lifetime. Don’t just attend—be at the heart of the action!
            </p>
          </div>
          <img
            src="https://godreamcast.com/blog/wp-content/uploads/2024/08/Event-Registration-Analytics-Key-Metrics-Every-Organizer-Track.jpg"
            alt="Event registration analytics illustration"
            className="w-full rounded-3xl shadow-card border border-border/40"
            loading="lazy"
          />
        </div>
      </section>

      {/* Features grid (moved from hero) */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-4">
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="h-10 w-10 rounded-md bg-gradient-primary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Registration</h3>
            <p className="text-muted-foreground text-sm">Quick and secure event registration with instant confirmations</p>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="h-10 w-10 rounded-md bg-gradient-primary flex items-center justify-center">
                <LineChart className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Analytics</h3>
            <p className="text-muted-foreground text-sm">Comprehensive dashboard with real-time registration tracking</p>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="h-10 w-10 rounded-md bg-gradient-primary flex items-center justify-center">
                <MailCheck className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Automated Emails</h3>
            <p className="text-muted-foreground text-sm">Automatic confirmations, reminders, and follow-ups</p>
          </div>
        </div>
      </section>

      {/* Event types section */}
      <section className="py-20 bg-[#3b2f86] text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-lg md:text-xl opacity-90">Event Check-in and Badging Solutions</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold">Events of All Sizes, All Types</h2>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { label: 'Virtual Events', Icon: Monitor },
              { label: 'Hybrid events', Icon: Bot },
              { label: 'Webinars', Icon: Video },
              { label: 'In-Person Events', Icon: Users },
            ].map(({ label, Icon }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="p-[3px] rounded-full bg-gradient-primary">
                  <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-white flex items-center justify-center">
                    <Icon className="w-10 h-10 md:w-12 md:h-12 text-[#3b2f86]" />
                  </div>
                </div>
                <div className="mt-4 text-lg font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Centered image section removed as requested */}
      {/* CTA Section */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Host Your Event?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful event organizers using EventHub to manage their registrations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/admin/login">
                <Button
                  variant="gradient"
                  size="lg"
                  className="inline-flex items-center cursor-pointer"
                  type="button"
                >
                  Start Your Event
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;