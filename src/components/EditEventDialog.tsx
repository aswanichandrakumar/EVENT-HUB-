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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit, Save } from "lucide-react";
import { Event } from "@/data/events";

export interface EditEventDialogProps {
  children?: React.ReactNode;
  event: Event;
  onUpdated?: () => void;
  onClose?: () => void;
}

interface EventFormData {
  title: string;
  description: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  price: string;
  capacity: number;
  image?: string;
  features?: string;
}

const EditEventDialog: React.FC<EditEventDialogProps> = ({ children, event, onUpdated, onClose }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<EventFormData>({
    title: "",
    description: "",
    eventType: "College Fest",
    date: "",
    time: "",
    location: "",
    price: "Free",
    capacity: 100,
    image: "",
    features: "",
  });

  // Update form when event changes and open dialog
  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        eventType: event.type || "College Fest",
        date: event.date || "",
        time: event.time || "",
        location: event.location || "",
        price: event.price?.toString() || "Free",
        capacity: event.capacity || 100,
        image: event.image || "",
        features: event.features?.join(", ") || "",
      });
      setOpen(true);
    }
  }, [event]);

  const updateField = (key: keyof EventFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time || !form.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("events")
        .update({
          title: form.title,
          description: form.description || null,
          event_type: form.eventType,
          date: form.date,
          time: form.time,
          location: form.location,
          price: form.price,
          capacity: Number(form.capacity) || 100,
          image: form.image || null,
          features: form.features
            ? form.features
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean)
            : null,
        })
        .eq("id", event.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Event updated successfully");
      setOpen(false);
      onUpdated?.();
    } catch (err) {
      toast.error("Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Edit className="w-5 h-5" />
            Edit Event
          </DialogTitle>
          <DialogDescription>
            Update the details for your event.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., College Fest 2025"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type *</Label>
              <Select
                value={form.eventType}
                onValueChange={(v) => updateField("eventType", v)}
              >
                <SelectTrigger id="eventType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="College Fest">College Fest</SelectItem>
                  <SelectItem value="Corporate Training">Corporate Training</SelectItem>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Main Auditorium"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                placeholder="Free or e.g., 1500 (₹)"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => updateField("capacity", Number(e.target.value))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                placeholder="https://..."
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief summary about the event"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input
                id="features"
                placeholder="Networking, Food, Workshops"
                value={form.features}
                onChange={(e) => updateField("features", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Updating..." : "Update Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
