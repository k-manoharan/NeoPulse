import { useState } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CalendarIcon, 
  ClockIcon, 
  BookOpenIcon, 
  PlusIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon
} from "lucide-react";
import { format, addDays, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay } from "date-fns";

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState("day");
  
  const mockUser = {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
  };
  
  // Sample schedule data
  const scheduleItems = [
    {
      id: 1,
      title: "Mathematics Lecture",
      time: "09:00 - 10:30",
      location: "Hall B, Building 3",
      requiredBooks: ["Advanced Calculus", "Mathematical Analysis"]
    },
    {
      id: 2,
      title: "Physics Lab",
      time: "11:00 - 13:00",
      location: "Science Lab, Building 2",
      requiredBooks: ["Advanced Physics"]
    },
    {
      id: 3,
      title: "Literature Seminar",
      time: "15:30 - 17:00",
      location: "Room 102, Humanities Building",
      requiredBooks: ["Literary Analysis"]
    }
  ];
  
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 })
  });
  
  const navigateCalendar = (direction: 'prev' | 'next') => {
    if (activeView === 'day') {
      const days = direction === 'prev' ? -1 : 1;
      setSelectedDate(prevDate => addDays(prevDate, days));
    } else {
      const days = direction === 'prev' ? -7 : 7;
      setSelectedDate(prevDate => addDays(prevDate, days));
    }
  };
  
  return (
    <MainLayout user={mockUser}>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Schedule</h1>
            <p className="text-muted-foreground">Manage your classes and book requirements</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateCalendar('prev')}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" className="min-w-[140px]">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {format(selectedDate, 'MMMM d, yyyy')}
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => navigateCalendar('next')}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs 
              value={activeView} 
              onValueChange={setActiveView}
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-2 w-full max-w-xs">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
              </TabsList>
              
              <TabsContent value="day">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                    <CardDescription>Your schedule for today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {scheduleItems.length > 0 ? (
                      <div className="space-y-4">
                        {scheduleItems.map(item => (
                          <div key={item.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium">{item.title}</h3>
                              <Badge variant="outline" className="font-normal">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {item.time}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground flex items-center mb-3">
                              <MapPinIcon className="h-3 w-3 mr-1" />
                              {item.location}
                            </p>
                            
                            <Separator className="my-3" />
                            
                            <div>
                              <p className="text-sm font-medium mb-2">Required Books:</p>
                              <div className="flex flex-wrap gap-2">
                                {item.requiredBooks.map(book => (
                                  <Badge key={book} className="flex gap-1 items-center">
                                    <BookOpenIcon className="h-3 w-3" />
                                    {book}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <h3 className="text-lg font-medium">No events scheduled</h3>
                        <p className="text-muted-foreground">You don't have any events scheduled for this day.</p>
                        <Button className="mt-4">
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add Event
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="week">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Week of {format(weekDays[0], 'MMMM d')} - {format(weekDays[6], 'MMMM d, yyyy')}
                    </CardTitle>
                    <CardDescription>Your weekly schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {weekDays.map(day => (
                        <div 
                          key={day.toString()} 
                          className={`text-center p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                            isSameDay(day, selectedDate) ? 'bg-primary/10 font-medium' : ''
                          }`}
                          onClick={() => setSelectedDate(day)}
                        >
                          <div className="text-xs text-muted-foreground">{format(day, 'eee')}</div>
                          <div className="text-sm">{format(day, 'd')}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-6">
                      {weekDays.map(day => (
                        <div key={day.toString()}>
                          <h3 className={`text-sm font-medium mb-2 pb-1 border-b ${
                            isSameDay(day, selectedDate) ? 'text-primary border-primary' : 'border-muted-foreground/20'
                          }`}>
                            {format(day, 'EEEE, MMMM d')}
                          </h3>
                          
                          {isSameDay(day, selectedDate) ? (
                            <div className="space-y-2">
                              {scheduleItems.map(item => (
                                <div key={item.id} className="border rounded-lg p-3 hover:border-primary transition-colors">
                                  <div className="flex justify-between mb-1">
                                    <h4 className="font-medium">{item.title}</h4>
                                    <span className="text-xs text-muted-foreground">{item.time}</span>
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <MapPinIcon className="h-3 w-3 mr-1" />
                                    {item.location}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground text-center py-3">
                              Click to view events
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view your schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
                
                <h3 className="font-medium mt-6 mb-3">Required Books Today</h3>
                <div className="space-y-2">
                  {Array.from(
                    new Set(
                      scheduleItems.flatMap(item => item.requiredBooks)
                    )
                  ).map(book => (
                    <div key={book} className="flex justify-between items-center p-2 text-sm border rounded-md">
                      <div className="flex items-center">
                        <BookOpenIcon className="h-4 w-4 mr-2 text-primary" />
                        {book}
                      </div>
                      <Badge className="bg-success hover:bg-success text-success-foreground">
                        Packed
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}