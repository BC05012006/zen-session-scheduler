
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSessions } from "@/hooks/useSessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DashNav } from "@/components/dashboard/DashNav";
import { Footer } from "@/components/layout/Footer";
import { Play, Pause, Timer, ArrowLeft, CheckCircle } from "lucide-react";
import { formatTime } from "@/utils/formatTime";

const SessionTimer = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { sessions, editSession } = useSessions();
  
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const session = sessions.find(s => s.id === sessionId);
  const targetTime = session ? session.duration * 60 : 0; // convert minutes to seconds
  
  useEffect(() => {
    // Initialize elapsed time from session if available
    if (session && session.elapsedTime) {
      setElapsedTime(session.elapsedTime);
    }
    
    // Update session status to in-progress when timer page is opened
    if (session && session.status === 'pending') {
      editSession(session.id, { status: 'in-progress' });
    }
  }, [session]);
  
  useEffect(() => {
    let interval: number;
    
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          
          // Save progress to the session every 5 seconds
          if (newTime % 5 === 0 && session) {
            editSession(session.id, { elapsedTime: newTime });
          }
          
          // Auto-complete session if elapsed time reaches target
          if (newTime >= targetTime && session) {
            setIsRunning(false);
            editSession(session.id, { 
              status: 'completed', 
              elapsedTime: newTime 
            });
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, session, targetTime, editSession]);
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  
  const completeSession = () => {
    if (session) {
      editSession(session.id, { 
        status: 'completed',
        elapsedTime
      });
      navigate("/dashboard");
    }
  };
  
  const goBack = () => {
    // Save current progress before navigating away
    if (session) {
      editSession(session.id, { elapsedTime });
    }
    navigate("/dashboard");
  };
  
  if (!session) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashNav />
        <main className="flex-1 flex items-center justify-center">
          <p>Session not found. <Button variant="link" onClick={() => navigate("/dashboard")}>Return to Dashboard</Button></p>
        </main>
        <Footer />
      </div>
    );
  }
  
  const progress = Math.min((elapsedTime / targetTime) * 100, 100);
  
  return (
    <div className="flex flex-col min-h-screen">
      <DashNav />
      
      <main className="flex-1 py-8 px-4">
        <div className="zen-container max-w-xl mx-auto">
          <Button variant="ghost" onClick={goBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-0">
              <CardTitle className="text-2xl gradient-text">{session.title}</CardTitle>
              <p className="text-muted-foreground">{session.duration} minute session</p>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center pt-8 pb-8">
              <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                {/* Circular progress indicator */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle 
                    className="text-gray-200 stroke-current" 
                    strokeWidth="4" 
                    fill="transparent" 
                    r="42" 
                    cx="50" 
                    cy="50" 
                  />
                  <circle 
                    className="text-meditation-purple stroke-current" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    fill="transparent" 
                    r="42" 
                    cx="50" 
                    cy="50" 
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
                    style={{ transition: "stroke-dashoffset 0.5s" }}
                  />
                </svg>
                
                <div className="absolute flex flex-col items-center">
                  <Timer className="w-10 h-10 text-meditation-purple mb-2" />
                  <div className="text-4xl font-bold">{formatTime(elapsedTime)}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Target: {formatTime(targetTime)}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className="w-36"
                >
                  {isRunning ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      {elapsedTime === 0 ? "Start" : "Resume"}
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={completeSession}
                  variant="outline"
                  size="lg"
                  className="w-36"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete
                </Button>
              </div>
            </CardContent>
            
            {session.notes && (
              <CardFooter className="flex flex-col items-start">
                <h3 className="text-sm font-medium mb-1">Notes:</h3>
                <p className="text-sm text-muted-foreground">{session.notes}</p>
              </CardFooter>
            )}
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SessionTimer;
