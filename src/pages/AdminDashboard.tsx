import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Download,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  UserPlus,
  Mail,
  Settings,
  LogOut,
  Trash2,
  Edit,
  Plus
} from 'lucide-react';
import CreateEventDialog from '@/components/CreateEventDialog';
import SettingsDialog from '@/components/SettingsDialog';
import EditEventDialog from '@/components/EditEventDialog';
import RegistrationActionsDialog from '@/components/RegistrationActionsDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { mapSupabaseEventToEvent, type Event } from '@/data/events';

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  event_type: string;
  ticket_type: 'free' | 'paid';
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    activeEvents: 0,
    revenue: 0
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    checkAuth();
    fetchRegistrations();
    fetchEvents();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/admin/login');
      return;
    }
    
    setUser(session.user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const fetchRegistrations = async () => {
    try {
      console.log('🔍 Fetching registrations from database...');
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching registrations:', error);
        toast.error('Failed to load registrations');
        return;
      }

      console.log('📊 Registrations fetched:', data);
      console.log('📊 Number of registrations:', data?.length || 0);
      
      setRegistrations((data || []) as Registration[]);
      
      // Calculate stats from real data
      const totalRegistrations = data?.length || 0;
      const paidRegistrations = data?.filter(r => r.ticket_type === 'paid').length || 0;
      const eventTypes = new Set(data?.map(r => r.event_type) || []).size;
      
      setDashboardStats(prev => ({
        ...prev,
        totalRegistrations,
        revenue: paidRegistrations * 50 // Assuming ₹50 per paid ticket
      }));
    } catch (error) {
      console.error('❌ Error fetching registrations:', error);
      toast.error('An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
        return;
      }

      const fetchedEvents = (data || []).map(mapSupabaseEventToEvent);
      setEvents(fetchedEvents);
      
      // Update dashboard stats
      setDashboardStats(prev => ({
        ...prev,
        totalEvents: fetchedEvents.length,
        activeEvents: fetchedEvents.length
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('An error occurred while loading events');
    } finally {
      setEventsLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    // Use a more modern confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this event? This action cannot be undone.');
    if (!isConfirmed) {
      return;
    }

    try {
      // Show loading state
      toast.loading('Deleting event...');
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        toast.dismiss();
        toast.error(`Failed to delete event: ${error.message}`);
        return;
      }

      toast.dismiss();
      toast.success('Event deleted successfully');
      fetchEvents(); // Refresh events list
      fetchRegistrations(); // Refresh stats
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.dismiss();
      toast.error('An unexpected error occurred while deleting the event');
    }
  };

  const deleteRegistration = async (registrationId: string) => {
    // Use a more modern confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this registration? This action cannot be undone.');
    if (!isConfirmed) {
      return;
    }

    try {
      // Show loading state
      toast.loading('Deleting registration...');
      
      console.log('Attempting to delete registration:', registrationId);
      
      // Try direct delete without select first
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', registrationId);

      console.log('Delete response:', { error });

      if (error) {
        console.error('Error deleting registration:', error);
        toast.dismiss();
        toast.error(`Failed to delete registration: ${error.message}`);
        
        // Show more detailed error info
        if (error.code === '42501') {
          toast.error('Permission denied. Check RLS policies.');
        } else if (error.code === '23503') {
          toast.error('Cannot delete: Registration is referenced by other data.');
        }
        return;
      }

      toast.dismiss();
      toast.success('Registration deleted successfully');
      fetchRegistrations(); // Refresh registrations list
    } catch (error) {
      console.error('Error deleting registration:', error);
      toast.dismiss();
      toast.error('An unexpected error occurred while deleting the registration');
    }
  };

  const handleEventUpdated = () => {
    fetchEvents(); // Refresh the events list
    setSelectedEvent(null);
    toast.success('Event updated successfully');
  };

  const handleEventDialogClose = () => {
    setSelectedEvent(null);
  };

  const handleRegistrationAction = (action: string, data?: any) => {
    console.log('Registration action:', action, data);
    // Handle different registration actions here
    toast.success(`Registration ${action} completed`);
  };

  const handleRegistrationDialogClose = () => {
    setSelectedRegistration(null);
  };

  // Delete all registrations
  const deleteAllRegistrations = async () => {
    const isConfirmed = window.confirm(
      '⚠️ WARNING: This will delete ALL registrations permanently!\n\n' +
      'Are you absolutely sure you want to delete all registration data? ' +
      'This action cannot be undone.'
    );
    
    if (!isConfirmed) {
      return;
    }

    try {
      toast.loading('Deleting all registrations...');
      
      console.log('🗑️ Attempting to delete all registrations...');
      
      // Try different delete approaches
      console.log('🗑️ Attempting to delete all registrations...');
      
      // Method 1: Delete all with simple query
      const { error } = await supabase
        .from('registrations')
        .delete()
        .gte('id', '00000000-0000-0000-0000-000000000000'); // Delete all with valid UUIDs
      
      console.log('🗑️ Delete all response:', { error });

      if (error) {
        console.error('❌ Error deleting all registrations:', error);
        toast.dismiss();
        
        if (error.code === '42501') {
          toast.error('Permission denied. Need to add DELETE policies in Supabase.');
          
          // Try alternative approach - delete one by one
          console.log('🔄 Trying alternative delete approach...');
          const deletePromises = registrations.map(reg => 
            supabase.from('registrations').delete().eq('id', reg.id)
          );
          
          const results = await Promise.all(deletePromises);
          const errors = results.filter(r => r.error);
          
          if (errors.length > 0) {
            console.error('❌ Alternative delete also failed:', errors);
            toast.error(`Failed to delete: ${errors[0].error?.message}`);
            return;
          } else {
            toast.success('All registrations deleted successfully (alternative method)!');
            fetchRegistrations();
            return;
          }
        } else {
          toast.error(`Failed to delete all registrations: ${error.message}`);
        }
        return;
      }

      toast.dismiss();
      toast.success('All registrations deleted successfully!');
      fetchRegistrations(); // Refresh the list
    } catch (error) {
      console.error('❌ Error deleting all registrations:', error);
      toast.dismiss();
      toast.error('An unexpected error occurred while deleting all registrations');
    }
  };

  // Test function to check database permissions
  const testDatabasePermissions = async () => {
    try {
      console.log('=== DATABASE PERMISSION TEST ===');
      
      // Test SELECT
      const { data: selectData, error: selectError } = await supabase
        .from('registrations')
        .select('*')
        .limit(1);
      console.log('✅ SELECT test:', { success: !selectError, error: selectError?.message });
      
      // Test DELETE on a real registration
      if (registrations.length > 0) {
        const testId = registrations[0].id;
        console.log('🔍 Testing DELETE on registration ID:', testId);
        
        const { error: deleteError } = await supabase
          .from('registrations')
          .delete()
          .eq('id', testId);
        
        console.log('❌ DELETE test:', { success: !deleteError, error: deleteError?.message, code: deleteError?.code });
        
        if (deleteError) {
          if (deleteError.code === '42501') {
            console.log('🚨 ISSUE: Permission denied - RLS policies missing!');
            toast.error('Permission denied. Need to add DELETE policies in Supabase.');
          } else if (deleteError.code === '23503') {
            console.log('🚨 ISSUE: Foreign key constraint - cannot delete referenced data');
            toast.error('Cannot delete: Registration is referenced by other data.');
          } else {
            console.log('🚨 ISSUE: Unknown error code:', deleteError.code);
            toast.error(`Delete failed: ${deleteError.message}`);
          }
        } else {
          console.log('✅ DELETE test: SUCCESS!');
          toast.success('Delete test successful!');
          fetchRegistrations(); // Refresh to show the deletion
        }
      }
      
    } catch (error) {
      console.error('❌ Permission test error:', error);
      toast.error('Permission test failed');
    }
  };

  const debugDatabase = async () => {
    console.log('🔍 DEBUG: Checking database connection...');
    
    try {
      // Check if we can connect to the database
      const { data, error } = await supabase
        .from('registrations')
        .select('*');
      
      console.log('🔍 DEBUG: Database response:', { data, error });
      console.log('🔍 DEBUG: Number of records:', data?.length || 0);
      
      if (data && data.length > 0) {
        console.log('🔍 DEBUG: First record:', data[0]);
      }
      
      toast.info(`Database has ${data?.length || 0} registrations. Check console for details.`);
    } catch (error) {
      console.error('❌ DEBUG: Database error:', error);
      toast.error('Database connection failed');
    }
  };

  const filteredRegistrations = registrations.filter(registration =>
    registration.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.event_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(eventSearchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    if (registrations.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Prepare data for export
    const exportData = registrations.map(registration => ({
      'Registration ID': registration.id,
      'Full Name': registration.full_name,
      'Email': registration.email,
      'Phone': registration.phone || 'N/A',
      'Event Type': registration.event_type,
      'Ticket Type': registration.ticket_type,
      'Status': registration.status,
      'Registration Date': new Date(registration.created_at).toLocaleString(),
      'Last Updated': new Date(registration.updated_at).toLocaleString()
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 38 }, // Registration ID
      { wch: 20 }, // Full Name
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 20 }, // Event Type
      { wch: 12 }, // Ticket Type
      { wch: 12 }, // Status
      { wch: 20 }, // Registration Date
      { wch: 20 }  // Last Updated
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `EventHub_Registrations_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
    
    toast.success(`Data exported successfully as ${filename}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTicketTypeColor = (type: string) => {
    return type === 'paid' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground';
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-background-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your events and track registrations
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <SettingsDialog>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </SettingsDialog>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <CreateEventDialog onCreated={() => {
                fetchEvents();
                fetchRegistrations();
              }}>
                <Button variant="gradient">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </CreateEventDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Events
                </CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {dashboardStats.totalEvents}
                </div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Registrations
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {dashboardStats.totalRegistrations.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Events
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {dashboardStats.activeEvents}
                </div>
                <p className="text-xs text-muted-foreground">
                  Registration open
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Revenue
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ₹{dashboardStats.revenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Events Management */}
          <Card className="glass-card border-white/10 mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-xl font-semibold text-foreground mb-4 md:mb-0">
                  Events Management
                </CardTitle>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search events..."
                      value={eventSearchTerm}
                      onChange={(e) => setEventSearchTerm(e.target.value)}
                      className="pl-10 glass-card border-white/10 min-w-[200px]"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <CreateEventDialog onCreated={fetchEvents}>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Event
                      </Button>
                    </CreateEventDialog>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Event
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Date & Time
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Location
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Capacity
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsLoading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          Loading events...
                        </td>
                      </tr>
                    ) : filteredEvents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          {eventSearchTerm ? 'No events found matching your search.' : 'No events created yet.'}
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((event) => (
                        <tr key={event.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {event.image ? (
                                  <img 
                                    src={event.image} 
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-primary" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-foreground max-w-[200px] truncate">
                                  {event.title}
                                </div>
                                <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                                  {event.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {event.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-foreground">
                              <div>{event.date}</div>
                              <div className="text-muted-foreground">{event.time}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-foreground max-w-[150px] truncate">
                              {event.location}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-foreground">
                              {event.registered}/{event.capacity}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate(`/register/${event.id}`)}
                                title="View Event"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedEvent(event)}
                                title="Edit Event"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteEvent(event.id)}
                                title="Delete Event"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredEvents.length} of {events.length} events
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={fetchEvents}>
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Registrations */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-xl font-semibold text-foreground mb-4 md:mb-0">
                  Recent Registrations
                </CardTitle>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search registrations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 glass-card border-white/10 min-w-[200px]"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToExcel}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={testDatabasePermissions}>
                      Test Permissions
                    </Button>
                    <Button variant="outline" size="sm" onClick={debugDatabase}>
                      Debug DB
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={deleteAllRegistrations}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Attendee
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Event
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Registered
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          Loading registrations...
                        </td>
                      </tr>
                    ) : filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          {searchTerm ? 'No registrations found matching your search.' : 'No registrations yet.'}
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((registration) => (
                        <tr key={registration.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-foreground">
                                {registration.full_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {registration.email}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-foreground max-w-[200px] truncate">
                              {registration.event_type}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-muted-foreground">
                              {new Date(registration.created_at).toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getTicketTypeColor(registration.ticket_type)}>
                              {registration.ticket_type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(registration.status)}>
                              {registration.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedRegistration(registration)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedRegistration(registration)}
                                title="Send Email"
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedRegistration(registration)}
                                title="More Actions"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteRegistration(registration.id)}
                                title="Delete Registration"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredRegistrations.length} of {registrations.length} registrations
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={fetchRegistrations}>
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Event Dialog */}
      {selectedEvent && (
        <EditEventDialog
          event={selectedEvent}
          onUpdated={handleEventUpdated}
          onClose={handleEventDialogClose}
        />
      )}

      {/* Registration Actions Dialog */}
      {selectedRegistration && (
        <RegistrationActionsDialog
          registration={selectedRegistration}
          onAction={handleRegistrationAction}
          onClose={handleRegistrationDialogClose}
        />
      )}
    </div>
  );
};

export default AdminDashboard;