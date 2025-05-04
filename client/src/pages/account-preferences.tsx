import { useState } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ChevronLeft, 
  Settings2, 
  Save, 
  Globe, 
  Bell, 
  Volume2, 
  Monitor, 
  Moon, 
  Sun,
  Laptop,
  Languages
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function AccountPreferences() {
  const [displayName, setDisplayName] = useState("Alex J.");
  const [bio, setBio] = useState("Student at Stanford University. Passionate about physics and technology.");
  const [language, setLanguage] = useState("english");
  const [timeZone, setTimeZone] = useState("America/Los_Angeles");
  const [theme, setTheme] = useState("system");
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  
  const { toast } = useToast();
  
  const mockUser = {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
  };
  
  const savePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your account preferences have been updated successfully."
    });
  };
  
  return (
    <MainLayout user={mockUser}>
      <div className="container py-6">
        <div className="mb-6">
          <Link href="/settings" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold flex items-center">
            <Settings2 className="h-6 w-6 mr-2 text-primary" />
            Account Preferences
          </h1>
          <p className="text-muted-foreground">Customize your NeoPulse experience</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings2 className="h-5 w-5 mr-2 text-primary" />
                Profile Settings
              </CardTitle>
              <CardDescription>Manage how your profile appears to others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input 
                  id="display-name" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">This is how your name will appear in the app.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Tell us a little about yourself. This will be visible in your public profile.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                Regional Settings
              </CardTitle>
              <CardDescription>Customize language and time zone settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="chinese">Chinese (Simplified)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select value={timeZone} onValueChange={setTimeZone}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    <SelectItem value="Asia/Shanghai">Shanghai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <RadioGroup defaultValue="mdy">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mdy" id="mdy" />
                    <Label htmlFor="mdy">MM/DD/YYYY</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dmy" id="dmy" />
                    <Label htmlFor="dmy">DD/MM/YYYY</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ymd" id="ymd" />
                    <Label htmlFor="ymd">YYYY-MM-DD</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch 
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound-effects">Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for notifications and actions</p>
                  </div>
                  <Switch 
                    id="sound-effects"
                    checked={soundEffects}
                    onCheckedChange={setSoundEffects}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="low-power">Low Power Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce animations and background activity</p>
                  </div>
                  <Switch 
                    id="low-power"
                    checked={lowPowerMode}
                    onCheckedChange={setLowPowerMode}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2 text-primary" />
                Display Settings
              </CardTitle>
              <CardDescription>Customize appearance and theme settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button"
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-10 w-10" />
                    <span>Light</span>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-10 w-10" />
                    <span>Dark</span>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant={theme === "system" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => setTheme("system")}
                  >
                    <Laptop className="h-10 w-10" />
                    <span>System</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Font Size</Label>
                <div className="flex items-center">
                  <span className="text-xs mr-2">A</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    defaultValue="3"
                    className="flex-grow h-2 bg-primary/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                  />
                  <span className="text-lg ml-2">A</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="primary-language">Primary Language</Label>
                <Select defaultValue="english">
                  <SelectTrigger id="primary-language" className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="chinese">Chinese (Simplified)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={savePreferences}>
            <Save className="h-4 w-4 mr-2" />
            Save All Preferences
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}