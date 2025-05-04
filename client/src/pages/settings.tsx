import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link as WouterLink } from "wouter";
import { 
  Save, 
  Upload, 
  RefreshCw, 
  BellRing, 
  Shield, 
  Battery, 
  Menu, 
  AlarmClock, 
  Settings2, 
  Link as LinkIcon, 
  UserIcon, 
  LogOut, 
  Calendar 
} from "lucide-react";

export default function Settings() {
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.j@example.com",
    phone: "+1 (555) 123-4567",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
    marketing: false
  });

  const [settings, setSettings] = useState({
    lowBatteryThreshold: 20,
    weightAlertThreshold: 70,
    autoSyncSchedule: true,
    autoConnectMode: true,
    nightMode: true,
    locationTracking: false,
    dataBackup: true,
    cloudSync: true
  });

  const { toast } = useToast();

  const handleProfileChange = (field: keyof typeof profileData, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleNotificationChange = (field: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [field]: !notifications[field]
    });
  };

  const handleSettingChange = (field: keyof typeof settings, value: any) => {
    setSettings({
      ...settings,
      [field]: typeof value === "boolean" ? value : Number(value)
    });
  };

  const saveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully."
    });
  };

  return (
    <MainLayout user={profileData}>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="neopack">NeoPack</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileData.name} 
                      onChange={(e) => handleProfileChange("name", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileData.email} 
                      onChange={(e) => handleProfileChange("email", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={profileData.phone} 
                      onChange={(e) => handleProfileChange("phone", e.target.value)} 
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={saveChanges}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Upload a new profile picture</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24 border-2 border-muted">
                    <AvatarImage src={profileData.image} alt={profileData.name} />
                    <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Picture
                  </Button>
                </CardContent>
                <Separator />
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <WouterLink href="/security">
                    <Button variant="outline" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Settings
                    </Button>
                  </WouterLink>
                  <WouterLink href="/account-preferences">
                    <Button variant="outline" className="w-full">
                      <Settings2 className="h-4 w-4 mr-2" />
                      Account Preferences
                    </Button>
                  </WouterLink>
                  <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <BellRing className="h-4 w-4" /> Alerts & Notifications
                  </h3>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={notifications.email}
                      onCheckedChange={() => handleNotificationChange("email")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={notifications.push}
                      onCheckedChange={() => handleNotificationChange("push")}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <AlarmClock className="h-4 w-4" /> Summary & Digests
                  </h3>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-digest">Weekly Activity Digest</Label>
                      <p className="text-sm text-muted-foreground">Receive a weekly summary of your NeoPack activity</p>
                    </div>
                    <Switch 
                      id="weekly-digest" 
                      checked={notifications.weekly}
                      onCheckedChange={() => handleNotificationChange("weekly")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing">Marketing Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive news about new features and products</p>
                    </div>
                    <Switch 
                      id="marketing" 
                      checked={notifications.marketing}
                      onCheckedChange={() => handleNotificationChange("marketing")}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveChanges} className="ml-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="neopack">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Device Settings</CardTitle>
                  <CardDescription>Configure your NeoPack device settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="battery-threshold">Low Battery Alert Threshold ({settings.lowBatteryThreshold}%)</Label>
                      <Badge variant="outline">
                        <Battery className="h-3 w-3 mr-1" />
                        Battery
                      </Badge>
                    </div>
                    <Slider
                      id="battery-threshold"
                      min={5}
                      max={50}
                      step={5}
                      value={[settings.lowBatteryThreshold]}
                      onValueChange={(value) => handleSettingChange("lowBatteryThreshold", value[0])}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You'll be notified when your NeoPack battery reaches this percentage
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="weight-threshold">Weight Alert Threshold ({settings.weightAlertThreshold}%)</Label>
                      <Badge variant="outline">Weight</Badge>
                    </div>
                    <Slider
                      id="weight-threshold"
                      min={50}
                      max={90}
                      step={5}
                      value={[settings.weightAlertThreshold]}
                      onValueChange={(value) => handleSettingChange("weightAlertThreshold", value[0])}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You'll be notified when your NeoPack exceeds this percentage of recommended weight
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-sync">Auto-Sync Schedule</Label>
                        <p className="text-sm text-muted-foreground">Automatically sync with calendar events</p>
                      </div>
                      <Switch 
                        id="auto-sync" 
                        checked={settings.autoSyncSchedule}
                        onCheckedChange={(value) => handleSettingChange("autoSyncSchedule", value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-connect">Auto-Connect Mode</Label>
                        <p className="text-sm text-muted-foreground">Automatically connect to NeoPack when in range</p>
                      </div>
                      <Switch 
                        id="auto-connect" 
                        checked={settings.autoConnectMode}
                        onCheckedChange={(value) => handleSettingChange("autoConnectMode", value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Configure advanced features and connectivity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Battery className="h-4 w-4" /> Power Management
                    </h3>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="night-mode">Night Mode</Label>
                        <p className="text-sm text-muted-foreground">Reduce power consumption during inactive hours</p>
                      </div>
                      <Switch 
                        id="night-mode" 
                        checked={settings.nightMode}
                        onCheckedChange={(value) => handleSettingChange("nightMode", value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Menu className="h-4 w-4" /> Privacy & Data
                    </h3>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="location-tracking">Location Tracking</Label>
                        <p className="text-sm text-muted-foreground">Allow NeoPack to track its location</p>
                      </div>
                      <Switch 
                        id="location-tracking" 
                        checked={settings.locationTracking}
                        onCheckedChange={(value) => handleSettingChange("locationTracking", value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="data-backup">Data Backup</Label>
                        <p className="text-sm text-muted-foreground">Regularly backup your NeoPack data</p>
                      </div>
                      <Switch 
                        id="data-backup" 
                        checked={settings.dataBackup}
                        onCheckedChange={(value) => handleSettingChange("dataBackup", value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="cloud-sync">Cloud Sync</Label>
                        <p className="text-sm text-muted-foreground">Keep your data synced across devices</p>
                      </div>
                      <Switch 
                        id="cloud-sync" 
                        checked={settings.cloudSync}
                        onCheckedChange={(value) => handleSettingChange("cloudSync", value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button onClick={saveChanges}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Connected Services</CardTitle>
                  <CardDescription>Manage integrations with external services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Google Calendar</h3>
                          <p className="text-sm text-muted-foreground">Connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <UserIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Microsoft 365</h3>
                          <p className="text-sm text-muted-foreground">Connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-md opacity-50">
                      <div className="flex items-center gap-4">
                        <div className="bg-muted p-2 rounded-full">
                          <RefreshCw className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">Weather API</h3>
                          <p className="text-sm text-muted-foreground">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-md opacity-50">
                      <div className="flex items-center gap-4">
                        <div className="bg-muted p-2 rounded-full">
                          <Menu className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">Canvas LMS</h3>
                          <p className="text-sm text-muted-foreground">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}