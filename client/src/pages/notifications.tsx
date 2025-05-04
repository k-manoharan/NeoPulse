import { useState } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, BookOpen, Clock, Battery, Cloud, BellOff, Trash2, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "book",
      title: "Missing Book Alert",
      message: "You're missing 'Literary Analysis' for today's Literature Seminar at 3:30 PM.",
      time: "10 minutes ago",
      read: false
    },
    {
      id: 2,
      type: "battery",
      title: "Low Battery Warning",
      message: "Your NeoPack battery is at 20%. Connect the charger to ensure it lasts all day.",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      type: "weather",
      title: "Weather Alert",
      message: "Rain expected this afternoon. Consider taking your waterproof NeoPack cover.",
      time: "3 hours ago",
      read: true
    },
    {
      id: 4,
      type: "book",
      title: "Book Detected",
      message: "Successfully detected 'Advanced Physics' in your NeoPack.",
      time: "Yesterday",
      read: true
    },
    {
      id: 5,
      type: "schedule",
      title: "Schedule Reminder",
      message: "You have a Physics Lab tomorrow at 9:00 AM. Don't forget your Advanced Physics book.",
      time: "Yesterday",
      read: true
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    bookAlerts: true,
    batteryAlerts: true,
    weightAlerts: true,
    weatherAlerts: true,
    scheduleReminders: true
  });

  const toggleNotificationSetting = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case "book": return <BookOpen className="h-6 w-6 text-primary" />;
      case "battery": return <Battery className="h-6 w-6 text-warning" />;
      case "weather": return <Cloud className="h-6 w-6 text-accent" />;
      case "schedule": return <Clock className="h-6 w-6 text-success" />;
      default: return <Bell className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const mockUser = {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <MainLayout user={mockUser}>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your NeoPack alerts</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Recent Notifications</h2>
            
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BellOff className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                  <h3 className="text-lg font-medium">No Notifications</h3>
                  <p className="text-muted-foreground text-center mt-1 max-w-sm">
                    You don't have any notifications right now. They'll appear here when your NeoPack has updates for you.
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map(notification => (
                <Card 
                  key={notification.id} 
                  className={notification.read ? 'bg-card' : 'bg-primary/5 border-primary/30'}
                >
                  <CardContent className="p-0">
                    <div className="p-4 flex gap-4">
                      <div className="flex-shrink-0 flex items-start pt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold ${!notification.read ? 'text-primary' : ''}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="mt-1 text-sm">{notification.message}</p>
                        <div className="flex justify-end mt-2 gap-2">
                          {!notification.read && (
                            <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                              Mark as read
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteNotification(notification.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <Label htmlFor="book-alerts">Book alerts</Label>
                  </div>
                  <Switch
                    id="book-alerts"
                    checked={notificationSettings.bookAlerts}
                    onCheckedChange={() => toggleNotificationSetting('bookAlerts')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Battery className="h-4 w-4 text-warning" />
                    <Label htmlFor="battery-alerts">Battery alerts</Label>
                  </div>
                  <Switch
                    id="battery-alerts"
                    checked={notificationSettings.batteryAlerts}
                    onCheckedChange={() => toggleNotificationSetting('batteryAlerts')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cloud className="h-4 w-4 text-accent" />
                    <Label htmlFor="weather-alerts">Weather alerts</Label>
                  </div>
                  <Switch
                    id="weather-alerts"
                    checked={notificationSettings.weatherAlerts}
                    onCheckedChange={() => toggleNotificationSetting('weatherAlerts')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-success" />
                    <Label htmlFor="schedule-reminders">Schedule reminders</Label>
                  </div>
                  <Switch
                    id="schedule-reminders"
                    checked={notificationSettings.scheduleReminders}
                    onCheckedChange={() => toggleNotificationSetting('scheduleReminders')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}