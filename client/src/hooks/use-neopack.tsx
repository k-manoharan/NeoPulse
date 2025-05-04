import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export interface Book {
  id: number;
  title: string;
  author: string;
  isDetected: boolean;
  detail?: string;
}

export interface Suggestion {
  id: number;
  type: string;
  title: string;
  description: string;
}

export interface Activity {
  day: string;
  weight: number;
  usage: number;
}

interface NeopackContextType {
  battery: {
    percentage: number;
    lastUpdated: Date;
  };
  weight: {
    value: number;
    percentage: number;
    lastUpdated: Date;
  };
  detectedBooks: Book[];
  missingBooks: Book[];
  suggestions: Suggestion[];
  activityData: Activity[];
  refreshData: () => void;
}

const NeopackContext = createContext<NeopackContextType | undefined>(undefined);

export function NeopackProvider({ children }: { children: ReactNode }) {
  const { data: neopackData, refetch } = useQuery({
    queryKey: ["/api/neopack/status"],
    staleTime: 60000, // 1 minute
  });

  // Simulate battery depletion over time
  const [battery, setBattery] = useState({
    percentage: 85,
    lastUpdated: new Date(),
  });

  useEffect(() => {
    if (neopackData?.battery) {
      setBattery(neopackData.battery);
    }
  }, [neopackData]);

  // Load weight data
  const [weight, setWeight] = useState({
    value: 3.1,
    percentage: 62,
    lastUpdated: new Date(),
  });

  useEffect(() => {
    if (neopackData?.weight) {
      setWeight(neopackData.weight);
    }
  }, [neopackData]);

  // Load books data
  const { data: booksData, refetch: refetchBooks } = useQuery({
    queryKey: ["/api/neopack/books"],
    staleTime: 60000, // 1 minute
  });

  const detectedBooks = booksData?.detected || [];
  const missingBooks = booksData?.missing || [];

  // Load suggestions
  const { data: suggestionsData, refetch: refetchSuggestions } = useQuery({
    queryKey: ["/api/neopack/suggestions"],
    staleTime: 300000, // 5 minutes
  });

  const suggestions = suggestionsData || [];

  // Load activity data
  const { data: activityData, refetch: refetchActivity } = useQuery({
    queryKey: ["/api/neopack/activity"],
    staleTime: 3600000, // 1 hour
  });

  const refreshData = () => {
    refetch();
    refetchBooks();
    refetchSuggestions();
    refetchActivity();
  };

  const value = {
    battery,
    weight,
    detectedBooks,
    missingBooks,
    suggestions,
    activityData: activityData || [],
    refreshData,
  };

  return (
    <NeopackContext.Provider value={value}>
      {children}
    </NeopackContext.Provider>
  );
}

export function useNeopack() {
  const context = useContext(NeopackContext);
  if (context === undefined) {
    throw new Error("useNeopack must be used within a NeopackProvider");
  }
  return context;
}
