import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  type: string;
  price: 'Free' | number;
  image: string;
}

const EventCard = ({
  id,
  title,
  description,
  date,
  time,
  location,
  capacity,
  registered,
  type,
  price,
  image
}: EventCardProps) => {
  const availableSpots = capacity - registered;
  const isAlmostFull = availableSpots <= 10;
  const isFull = availableSpots <= 0;

  const getTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'College Fest':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Corporate Training':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Webinar':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'Sports':
        return 'bg-gradient-to-r from-orange-500 to-red-500';
      default:
        return 'bg-gradient-primary';
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden hover:shadow-card transition-all duration-300 transform hover:scale-105 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Event Type Badge */}
        <div className="absolute top-4 left-4">
          <Badge className={`${getTypeColor(type)} text-white border-0`}>
            {type}
          </Badge>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-900">
            {price === 'Free' ? 'Free' : `₹${price}`}
          </Badge>
        </div>

        {/* Availability Status */}
        {isFull ? (
          <div className="absolute bottom-4 left-4">
            <Badge variant="destructive">
              Sold Out
            </Badge>
          </div>
        ) : isAlmostFull ? (
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-warning text-warning-foreground">
              Almost Full
            </Badge>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            {date}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2 text-primary" />
            {time}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            {location}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2 text-primary" />
            {registered}/{capacity} registered
          </div>
        </div>

        {/* Registration Button */}
        <Link to={`/register/${id}`}>
          <Button 
            variant={isFull ? "secondary" : "gradient"} 
            className="w-full"
            disabled={isFull}
          >
            {isFull ? 'Event Full' : 'Register Now'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;