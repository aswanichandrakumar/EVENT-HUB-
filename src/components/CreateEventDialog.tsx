import React, { useState } from "react";
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

export interface CreateEventDialogProps {
  children: React.ReactNode;
  onCreated?: () => void;
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

const DEFAULT_FORM: EventFormData = {
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
};

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({ children, onCreated }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<EventFormData>(DEFAULT_FORM);

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
      const { error } = await supabase.from("events").insert([
        {
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
        },
      ]);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Event created successfully");
      setOpen(false);
      setForm(DEFAULT_FORM);
      onCreated?.();
    } catch (err) {
      toast.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>Fill in the details for your new event.</DialogDescription>
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
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;


