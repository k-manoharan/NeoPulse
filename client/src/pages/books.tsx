import { useState } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookOpenIcon, PlusIcon, SearchIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  isDetected: boolean;
  detail?: string;
}

export default function Books() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: booksData, isLoading } = useQuery({
    queryKey: ["/api/neopack/books"],
    staleTime: 60000,
  });
  
  const mockUser = {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
  };
  
  const filteredDetected = booksData?.detected?.filter((book: Book) => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const filteredMissing = booksData?.missing?.filter((book: Book) => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  return (
    <MainLayout user={mockUser}>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Books</h1>
            <p className="text-muted-foreground">Manage the books tracked by your NeoPack</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search books..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </div>
        </div>
        
        <Tabs 
          defaultValue="all" 
          className="space-y-6"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="all">All Books</TabsTrigger>
            <TabsTrigger value="detected">Detected</TabsTrigger>
            <TabsTrigger value="missing">Missing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...filteredDetected, ...filteredMissing].map((book: Book) => (
                  <BookCard key={book.id} book={book} />
                ))}
                
                {filteredDetected.length === 0 && filteredMissing.length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <BookOpenIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h3 className="text-lg font-medium">No books found</h3>
                    <p className="text-muted-foreground">Try a different search term or add new books.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="detected">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDetected.map((book: Book) => (
                  <BookCard key={book.id} book={book} />
                ))}
                
                {filteredDetected.length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <BookOpenIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h3 className="text-lg font-medium">No detected books found</h3>
                    <p className="text-muted-foreground">Your NeoPack hasn't detected any books matching your search.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="missing">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMissing.map((book: Book) => (
                  <BookCard key={book.id} book={book} />
                ))}
                
                {filteredMissing.length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <BookOpenIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h3 className="text-lg font-medium">No missing books found</h3>
                    <p className="text-muted-foreground">You have all your required books in your NeoPack.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex-grow">
            <CardTitle>{book.title}</CardTitle>
            <CardDescription>{book.author}</CardDescription>
          </div>
          <div className="flex-shrink-0">
            {book.isDetected ? (
              <Badge className="bg-success hover:bg-success text-success-foreground flex items-center gap-1">
                <CheckCircleIcon className="h-3 w-3" /> Detected
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1">
                <XCircleIcon className="h-3 w-3" /> Missing
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="h-20 w-16 bg-primary/10 rounded flex items-center justify-center">
            <BookOpenIcon className="h-10 w-10 text-primary" />
          </div>
          <div>
            {book.detail && (
              <p className="text-sm mb-2">{book.detail}</p>
            )}
            <div className="flex gap-2 text-xs">
              <Badge variant="outline">Required</Badge>
              {book.isDetected ? (
                <span className="text-success flex items-center gap-1">
                  <CheckCircleIcon className="h-3 w-3" /> In your NeoPack
                </span>
              ) : (
                <span className="text-destructive flex items-center gap-1">
                  <XCircleIcon className="h-3 w-3" /> Not detected
                </span>
              )}
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <Button variant="outline" size="sm">Details</Button>
          {!book.isDetected && (
            <Button size="sm">
              Mark as Detected
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}