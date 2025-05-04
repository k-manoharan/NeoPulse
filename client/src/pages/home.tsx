import { useEffect } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layouts/main-layout";
import StatusSection from "@/components/sections/status-section";
import EssentialsSection from "@/components/sections/essentials-section";
import MissingBooksSection from "@/components/sections/missing-books-section";
import SuggestionsSection from "@/components/sections/suggestions-section";
import ActivitySection from "@/components/sections/activity-section";
import { NeopackProvider } from "@/hooks/use-neopack";

export default function Home() {
  // Set page title
  useEffect(() => {
    document.title = "NeoPulse | Smart Backpack Companion";
  }, []);

  // Mock user data (in a real app, this would come from authentication)
  const user = {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
  };

  return (
    <NeopackProvider>
      <MainLayout user={user}>
        <motion.div
          className="space-y-6"
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
          }}
        >
          <StatusSection />
          <EssentialsSection />
          <MissingBooksSection />
          <SuggestionsSection />
          <ActivitySection />
        </motion.div>
      </MainLayout>
    </NeopackProvider>
  );
}
