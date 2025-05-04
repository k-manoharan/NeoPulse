import { useState } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Shield, 
  KeyRound, 
  Smartphone, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  UserCheck,
  History,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Security() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState(90);
  
  const { toast } = useToast();
  
  const mockUser = {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
  };
  
  const loginHistory = [
    { id: 1, date: "May 3, 2025", time: "09:35 AM", device: "iPhone 15 Pro", location: "San Francisco, CA" },
    { id: 2, date: "May 1, 2025", time: "04:22 PM", device: "MacBook Pro", location: "San Francisco, CA" },
    { id: 3, date: "Apr 28, 2025", time: "10:15 AM", device: "Chrome on Windows", location: "San Jose, CA" }
  ];
  
  const savePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure your passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password updated",
      description: "Your password has been successfully updated."
    });
    
    // Reset fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const saveSecuritySettings = () => {
    toast({
      title: "Security settings saved",
      description: "Your security preferences have been updated."
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
            <Shield className="h-6 w-6 mr-2 text-primary" />
            Security Settings
          </h1>
          <p className="text-muted-foreground">Manage your account security and privacy settings</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <KeyRound className="h-5 w-5 mr-2 text-primary" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 relative">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input 
                    id="current-password" 
                    type={showPassword ? "text" : "password"} 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type={showPassword ? "text" : "password"} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {newPassword && (
                  <div className="mt-2">
                    <div className="text-xs">Password strength:</div>
                    <div className="h-1 w-full bg-gray-200 rounded-full mt-1">
                      <div 
                        className={`h-1 rounded-full ${
                          newPassword.length > 12 ? "bg-success w-full" : 
                          newPassword.length > 8 ? "bg-yellow-500 w-3/4" : 
                          "bg-destructive w-1/2"
                        }`}
                      ></div>
                    </div>
                    <ul className="text-xs mt-2 space-y-1 text-muted-foreground">
                      <li className={newPassword.length >= 8 ? "text-success" : ""}>
                        ✓ At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(newPassword) ? "text-success" : ""}>
                        ✓ At least one uppercase letter
                      </li>
                      <li className={/[0-9]/.test(newPassword) ? "text-success" : ""}>
                        ✓ At least one number
                      </li>
                      <li className={/[^A-Za-z0-9]/.test(newPassword) ? "text-success" : ""}>
                        ✓ At least one special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePassword} className="ml-auto">
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Account Security
              </CardTitle>
              <CardDescription>Configure additional security settings for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Authentication</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require a verification code when logging in</p>
                  </div>
                  <Switch 
                    id="two-factor" 
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
                
                {twoFactorEnabled && (
                  <Button variant="outline" size="sm" className="w-full">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Set Up Two-Factor Authentication
                  </Button>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="biometric">Biometric Authentication</Label>
                    <p className="text-sm text-muted-foreground">Use fingerprint or face recognition on supported devices</p>
                  </div>
                  <Switch 
                    id="biometric" 
                    checked={biometricEnabled}
                    onCheckedChange={setBiometricEnabled}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Privacy & Data</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="location-tracking">Location Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track location of your NeoPack if lost</p>
                  </div>
                  <Switch 
                    id="location-tracking" 
                    checked={locationTrackingEnabled}
                    onCheckedChange={setLocationTrackingEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="password-expiry">Password Expiry</Label>
                    <p className="text-sm text-muted-foreground">Require a password change every {passwordExpiry} days</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPasswordExpiry(Math.max(0, passwordExpiry - 30))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{passwordExpiry}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPasswordExpiry(passwordExpiry + 30)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSecuritySettings} className="ml-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2 text-primary" />
                Recent Login Activity
              </CardTitle>
              <CardDescription>Review recent logins to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loginHistory.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{item.device}</div>
                        <div className="text-sm text-muted-foreground">{item.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{item.date} at {item.time}</div>
                      {item.id === 1 && <Badge className="mt-1">Current Session</Badge>}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline">
                  <Lock className="h-4 w-4 mr-2" />
                  Sign Out All Devices
                </Button>
                <Button variant="outline">View Full History</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}