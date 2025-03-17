
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashNav } from "@/components/dashboard/DashNav";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { ChartDisplay } from "@/components/dashboard/ChartDisplay";
import { SessionsList } from "@/components/dashboard/SessionsList";
import { Footer } from "@/components/layout/Footer";

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-meditation-purple"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <DashNav />
      
      <main className="flex-1 py-8 px-4">
        <div className="zen-container">
          <h1 className="text-3xl font-bold mb-8 gradient-text">Your Meditation Dashboard</h1>
          
          <div className="space-y-8">
            <DashboardMetrics />
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <ChartDisplay />
              </div>
              <div className="md:col-span-2">
                <SessionsList />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
