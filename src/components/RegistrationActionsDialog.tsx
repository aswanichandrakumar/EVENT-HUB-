import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Mail, 
  MoreHorizontal, 
  User, 
  Calendar, 
  MapPin,
  Phone,
  Send,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

export interface RegistrationActionsDialogProps {
  children?: React.ReactNode;
  registration: any;
  onAction?: (action: string, data?: any) => void;
  onClose?: () => void;
}

const RegistrationActionsDialog: React.FC<RegistrationActionsDialogProps> = ({ 
  children, 
  registration, 
  onAction,
  onClose
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'view' | 'email' | 'actions'>('view');
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    emailType: 'confirmation'
  });

  const handleEmailSend = () => {
    // Simulate sending email
    onAction?.('sendEmail', emailData);
    setOpen(false);
  };

  const handleStatusChange = (newStatus: string) => {
    onAction?.('changeStatus', { status: newStatus, registrationId: registration.id });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Open dialog when registration is selected
  useEffect(() => {
    if (registration) {
      setOpen(true);
    }
  }, [registration]);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen && onClose) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Registration Details
          </DialogTitle>
          <DialogDescription>
            Manage registration and send communications.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b">
          <Button
            variant={activeTab === 'view' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('view')}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button
            variant={activeTab === 'email' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('email')}
            className="flex-1"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button
            variant={activeTab === 'actions' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('actions')}
            className="flex-1"
          >
            <MoreHorizontal className="w-4 h-4 mr-2" />
            Actions
          </Button>
        </div>

        {/* View Tab */}
        {activeTab === 'view' && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Attendee Name</Label>
                <div className="text-foreground font-medium">{registration.full_name}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <div className="text-foreground">{registration.email}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                <div className="text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {registration.phone || 'Not provided'}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Event Type</Label>
                <div className="text-foreground">{registration.event_type}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Ticket Type</Label>
                <Badge className={registration.ticket_type === 'paid' ? 'bg-primary/20 text-primary' : 'bg-green-100 text-green-800'}>
                  {registration.ticket_type}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <Badge className={
                  registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {registration.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Registration Date</Label>
                <div className="text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(registration.created_at)}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                <div className="text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatDate(registration.updated_at)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="emailType">Email Type</Label>
              <Select
                value={emailData.emailType}
                onValueChange={(value) => setEmailData(prev => ({ ...prev, emailType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select email type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmation">Registration Confirmation</SelectItem>
                  <SelectItem value="reminder">Event Reminder</SelectItem>
                  <SelectItem value="update">Event Update</SelectItem>
                  <SelectItem value="custom">Custom Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Email message content"
                value={emailData.message}
                onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                rows={6}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <strong>Recipient:</strong> {registration.email}
            </div>
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Change Status</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('confirmed')}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('pending')}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-yellow-600" />
                  Mark Pending
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('cancelled')}
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  Cancel
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Actions</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAction?.('export', registration)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Export Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAction?.('duplicate', registration)}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Duplicate
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {activeTab === 'email' && (
            <Button onClick={handleEmailSend} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Email
            </Button>
          )}
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationActionsDialog;
