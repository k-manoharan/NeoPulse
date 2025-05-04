import { useState } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { ArrowUpRight, ArrowDownRight, BarChart2, LineChart as LineChartIcon, Weight, Battery, AreaChart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("week");
  const [chartType, setChartType] = useState("bar");
  
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['/api/neopack/activity'],
    queryFn: async () => {
      const res = await fetch('/api/neopack/activity');
      if (!res.ok) throw new Error('Failed to fetch activity data');
      return res.json();
    }
  });

  const mockUser = {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
  };

  // Stats calculations
  const averageWeight = activityData
    ? (activityData.reduce((acc: number, curr: any) => acc + parseFloat(curr.weight), 0) / activityData.length).toFixed(1)
    : 0;
  
  const averageUsage = activityData
    ? (activityData.reduce((acc: number, curr: any) => acc + parseFloat(curr.usage), 0) / activityData.length).toFixed(1)
    : 0;
  
  const weightTrend = activityData && activityData.length > 1
    ? parseFloat(activityData[activityData.length - 1].weight) > parseFloat(activityData[0].weight)
    : false;
  
  const usageTrend = activityData && activityData.length > 1
    ? parseFloat(activityData[activityData.length - 1].usage) > parseFloat(activityData[0].usage)
    : false;

  // Generate mock data for other metrics
  const batteryDrainRate = Array(7).fill(0).map((_, i) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
    rate: 8 + Math.random() * 4
  }));

  const bookFrequency = [
    { name: "Advanced Physics", count: 5 },
    { name: "Calculus II", count: 4 },
    { name: "Programming 101", count: 3 },
    { name: "History of Science", count: 2 },
    { name: "Literary Analysis", count: 1 }
  ];

  return (
    <MainLayout user={mockUser}>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Track your NeoPack usage patterns and optimize your backpack</p>
          </div>
          
          <div className="flex gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex bg-muted rounded-md">
              <Button
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-r-none"
                onClick={() => setChartType('bar')}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Bar
              </Button>
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-l-none"
                onClick={() => setChartType('line')}
              >
                <LineChartIcon className="h-4 w-4 mr-2" />
                Line
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Average Weight" 
            value={`${averageWeight} kg`} 
            change={weightTrend ? "+0.3 kg" : "-0.2 kg"} 
            trend={weightTrend ? "up" : "down"} 
            description="Past 7 days" 
            icon={<Weight className="h-4 w-4" />}
          />
          
          <StatCard 
            title="Average Usage" 
            value={`${averageUsage} hrs`} 
            change={usageTrend ? "+1.2 hrs" : "-0.8 hrs"} 
            trend={usageTrend ? "up" : "down"} 
            description="Past 7 days" 
            icon={<Calendar className="h-4 w-4" />}
          />
          
          <StatCard 
            title="Battery Efficiency" 
            value="85%" 
            change="+3%" 
            trend="up" 
            description="vs. last month" 
            icon={<Battery className="h-4 w-4" />}
          />
          
          <StatCard 
            title="Books Rotated" 
            value="12" 
            change="+4" 
            trend="up" 
            description="Past 14 days" 
            icon={<AreaChart className="h-4 w-4" />}
          />
        </div>
        
        <Tabs defaultValue="usage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="usage">Usage & Weight</TabsTrigger>
            <TabsTrigger value="battery">Battery Analysis</TabsTrigger>
            <TabsTrigger value="books">Book Frequency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weight & Usage Analysis</CardTitle>
                <CardDescription>Track how your backpack weight relates to daily usage</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : activityData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' ? (
                      <BarChart data={activityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="weight" name="Weight (kg)" fill="hsl(var(--chart-1))" />
                        <Bar yAxisId="right" dataKey="usage" name="Usage (hours)" fill="hsl(var(--chart-2))" />
                      </BarChart>
                    ) : (
                      <LineChart data={activityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="weight" name="Weight (kg)" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="usage" name="Usage (hours)" stroke="hsl(var(--chart-2))" />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p>No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Insights</CardTitle>
                  <CardDescription>What your data tells us</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">Weight</Badge>
                      <span>Your backpack is lightest on weekends (2.5 kg average) and heaviest on Wednesdays (4.2 kg average).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">Usage</Badge>
                      <span>Usage patterns show you carry your NeoPack for longer periods on Mondays and Thursdays.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">Pattern</Badge>
                      <span>There's a correlation between weight and usage time - heavier load on days with more usage.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Optimize your NeoPack usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Badge className="bg-accent text-accent-foreground mt-0.5">Tip</Badge>
                      <span>Consider removing unnecessary items on Wednesdays to reduce the weight by up to 15%.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="bg-accent text-accent-foreground mt-0.5">Tip</Badge>
                      <span>Your usage patterns suggest you'd benefit from a full charge on Sunday nights and Thursday mornings.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="bg-accent text-accent-foreground mt-0.5">Tip</Badge>
                      <span>Based on your schedule, consider keeping the 'History of Science' book at home when not needed.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="battery">
            <Card>
              <CardHeader>
                <CardTitle>Battery Drain Analysis</CardTitle>
                <CardDescription>How your battery performs throughout the week</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={batteryDrainRate} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="rate" name="Drain Rate (%/hour)" fill="hsl(var(--chart-3))" />
                    </BarChart>
                  ) : (
                    <LineChart data={batteryDrainRate} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="rate" name="Drain Rate (%/hour)" stroke="hsl(var(--chart-3))" activeDot={{ r: 8 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="books">
            <Card>
              <CardHeader>
                <CardTitle>Book Frequency Analysis</CardTitle>
                <CardDescription>Which books you carry most frequently</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookFrequency} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Days in backpack (last week)" fill="hsl(var(--chart-4))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function StatCard({ title, value, change, trend, description, icon }: { 
  title: string; 
  value: string; 
  change: string; 
  trend: "up" | "down"; 
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm flex items-center gap-1">
            {icon} {title}
          </span>
          <Badge variant="outline" className={`flex items-center ${trend === "up" ? "text-success border-success" : "text-destructive border-destructive"}`}>
            {trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {change}
          </Badge>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      </CardContent>
    </Card>
  );
}