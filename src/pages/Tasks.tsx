
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashNav } from "@/components/dashboard/DashNav";
import { Footer } from "@/components/layout/Footer";
import { TasksList } from "@/components/tasks/TasksList";

const Tasks = () => {
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
          <h1 className="text-3xl font-bold mb-8 gradient-text">Your Tasks</h1>
          
          <div className="space-y-8">
            <TasksList />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Tasks;
