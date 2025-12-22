import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Clock,
  Video,
  MapPin,
  User,
  ExternalLink
} from 'lucide-react';

const calendarProviders = [
  { id: 'google', name: 'Google Calendar', icon: '📅', connected: true },
  { id: 'outlook', name: 'Outlook Calendar', icon: '📆', connected: false },
  { id: 'apple', name: 'Apple Calendar', icon: '🍎', connected: false },
];

const upcomingInterviews = [
  {
    id: 1,
    candidateName: 'Priya Sharma',
    jobTitle: 'Senior Software Engineer',
    date: '2024-01-15',
    time: '10:00 AM',
    duration: '45 min',
    type: 'Video Call',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'confirmed'
  },
  {
    id: 2,
    candidateName: 'Rahul Verma',
    jobTitle: 'Senior Software Engineer',
    date: '2024-01-15',
    time: '2:00 PM',
    duration: '45 min',
    type: 'Video Call',
    meetingLink: 'https://meet.google.com/xyz-abcd-efg',
    status: 'confirmed'
  },
  {
    id: 3,
    candidateName: 'Ananya Patel',
    jobTitle: 'Senior Software Engineer',
    date: '2024-01-16',
    time: '11:00 AM',
    duration: '45 min',
    type: 'In-Person',
    location: 'Office - Conference Room A',
    status: 'pending'
  },
];

const CalendarSync = () => {
  const { toast } = useToast();
  const [connectedCalendars, setConnectedCalendars] = useState(calendarProviders);

  const handleConnect = (providerId: string) => {
    setConnectedCalendars(prev =>
      prev.map(cal =>
        cal.id === providerId ? { ...cal, connected: true } : cal
      )
    );
    toast({
      title: 'Calendar Connected',
      description: `Successfully connected to ${calendarProviders.find(c => c.id === providerId)?.name}`,
    });
  };

  const handleDisconnect = (providerId: string) => {
    setConnectedCalendars(prev =>
      prev.map(cal =>
        cal.id === providerId ? { ...cal, connected: false } : cal
      )
    );
    toast({
      title: 'Calendar Disconnected',
      description: `Disconnected from ${calendarProviders.find(c => c.id === providerId)?.name}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold mb-2">Calendar Sync</h1>
          <p className="text-muted-foreground">
            Manage interview schedules and sync with your calendar
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Integrations */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
              <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Calendar Integrations
              </h2>
              
              <div className="space-y-3">
                {connectedCalendars.map((provider) => (
                  <div
                    key={provider.id}
                    className="p-4 rounded-xl border border-border/50 bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{provider.name}</p>
                          {provider.connected && (
                            <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 mt-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Connected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {provider.connected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleDisconnect(provider.id)}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={() => handleConnect(provider.id)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <strong>Auto-sync enabled:</strong> Interview schedules will automatically sync with your connected calendars
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Upcoming Interviews
                </h2>
                <Badge variant="secondary">
                  {upcomingInterviews.length} scheduled
                </Badge>
              </div>

              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="p-5 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold">
                          {interview.candidateName[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold">{interview.candidateName}</h3>
                          <p className="text-sm text-muted-foreground">{interview.jobTitle}</p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          interview.status === 'confirmed'
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-orange-500/10 text-orange-600'
                        }
                      >
                        {interview.status === 'confirmed' ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Confirmed
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span>{interview.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{interview.time} ({interview.duration})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm mb-4">
                      {interview.type === 'Video Call' ? (
                        <>
                          <Video className="w-4 h-4 text-muted-foreground" />
                          <span>{interview.type}</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{interview.location}</span>
                        </>
                      )}
                    </div>

                    {interview.meetingLink && (
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Join Meeting
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarSync;
