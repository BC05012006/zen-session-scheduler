
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="zen-container text-center">
            <div className="w-16 h-16 mx-auto mb-8 animate-breathe bg-meditation-purple rounded-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Find Your Inner Peace
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-muted-foreground">
              Schedule and track your meditation sessions with our easy-to-use timer.
              Cultivate mindfulness and build a consistent practice.
            </p>
            
            <Button 
              onClick={handleGetStarted} 
              size="lg" 
              className="bg-meditation-purple hover:bg-meditation-dark-purple text-white"
            >
              Get Started
            </Button>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="zen-container">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
              Enhance Your Meditation Practice
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="w-12 h-12 bg-meditation-soft-blue rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-meditation-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Time Your Sessions</h3>
                <p className="text-muted-foreground">
                  Set custom timers for your meditation sessions and track your progress over time.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="w-12 h-12 bg-meditation-soft-green rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-meditation-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Schedule Sessions</h3>
                <p className="text-muted-foreground">
                  Plan your meditation practice in advance with our easy scheduling system.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="w-12 h-12 bg-meditation-soft-peach rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-meditation-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                <p className="text-muted-foreground">
                  View insights and analytics to see how your meditation practice evolves.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-meditation-purple/10 to-meditation-dark-purple/10">
          <div className="zen-container text-center">
            <h2 className="text-3xl font-bold mb-6 gradient-text">
              Begin Your Meditation Journey Today
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
              Join thousands of meditators who have transformed their practice with ZenMind.
            </p>
            <Button 
              onClick={handleGetStarted} 
              size="lg"
              className="bg-meditation-purple hover:bg-meditation-dark-purple text-white"
            >
              Start Now
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
