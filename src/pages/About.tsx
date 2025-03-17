
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="zen-container">
          <h1 className="text-3xl font-bold mb-8 gradient-text">About ZenMind</h1>
          
          <div className="space-y-8 max-w-3xl">
            <div className="zen-card">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                At ZenMind, we believe that meditation should be accessible to everyone. 
                Our mission is to provide a simple, intuitive tool that helps people build 
                a consistent meditation practice, track their progress, and experience the 
                transformative benefits of mindfulness.
              </p>
            </div>
            
            <div className="zen-card">
              <h2 className="text-2xl font-semibold mb-4">The Benefits of Meditation</h2>
              <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                <li>Reduced stress and anxiety</li>
                <li>Improved focus and concentration</li>
                <li>Better sleep quality</li>
                <li>Enhanced self-awareness</li>
                <li>Increased emotional well-being</li>
                <li>Lower blood pressure</li>
                <li>Greater resilience to challenges</li>
              </ul>
            </div>
            
            <div className="zen-card">
              <h2 className="text-2xl font-semibold mb-4">How to Use ZenMind</h2>
              <ol className="space-y-2 text-muted-foreground list-decimal pl-5">
                <li>Create an account or sign in</li>
                <li>Schedule your meditation sessions</li>
                <li>Receive reminders before each session</li>
                <li>Complete your sessions and mark them as done</li>
                <li>Track your progress and view insights on your dashboard</li>
                <li>Adjust your practice as needed</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
