import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { Send, Bell } from "lucide-react";

interface AnnouncementCreatorProps {
  campgroundId: string;
  followerCount: number;
}

export function AnnouncementCreator({ campgroundId, followerCount }: AnnouncementCreatorProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sendNotification, setSendNotification] = useState(false);

  const { data: announcements } = useQuery({
    queryKey: ["/api/announcements", campgroundId],
    queryFn: async () => {
      const response = await fetch(`/api/announcements/${campgroundId}?limit=5`);
      if (!response.ok) throw new Error("Failed to fetch announcements");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/announcements", {
        campgroundId,
        title,
        message,
        sendNotification,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements", campgroundId] });
      setTitle("");
      setMessage("");
      setSendNotification(false);
      toast({
        title: "Success",
        description: sendNotification 
          ? `Announcement created and ${followerCount} ${followerCount === 1 ? 'follower' : 'followers'} notified!`
          : "Announcement created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg" data-testid="text-create-announcement-title">Create Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="announcement-title" data-testid="label-announcement-title">Title</Label>
              <Input
                id="announcement-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Special event or update..."
                data-testid="input-announcement-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="announcement-message" data-testid="label-announcement-message">Message</Label>
              <Textarea
                id="announcement-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share details about your announcement..."
                rows={4}
                data-testid="input-announcement-message"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="send-notification"
                checked={sendNotification}
                onCheckedChange={(checked) => setSendNotification(checked as boolean)}
                data-testid="checkbox-send-notification"
              />
              <Label 
                htmlFor="send-notification" 
                className="text-sm cursor-pointer flex items-center gap-2"
                data-testid="label-send-notification"
              >
                <Bell className="h-4 w-4" />
                Send push notification to {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
              </Label>
            </div>

            <Button 
              type="submit" 
              disabled={createMutation.isPending} 
              className="gap-2 w-full"
              data-testid="button-create-announcement"
            >
              {createMutation.isPending ? (
                "Creating..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Create Announcement
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {announcements && announcements.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground" data-testid="text-recent-announcements">Recent Announcements</h3>
          {announcements.map((announcement: any) => (
            <Card key={announcement.id} data-testid={`card-announcement-${announcement.id}`}>
              <CardContent className="pt-4">
                <div className="space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground" data-testid={`text-announcement-title-${announcement.id}`}>
                      {announcement.title}
                    </h4>
                    {announcement.sendNotification && (
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid={`text-announcement-message-${announcement.id}`}>
                    {announcement.message}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`text-announcement-date-${announcement.id}`}>
                    {format(new Date(announcement.createdAt), "PPp")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
