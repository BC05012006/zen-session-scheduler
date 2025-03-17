
import { useNavigate } from "react-router-dom";
import { MeditationSession } from "@/utils/types";
import { useSessions } from "@/hooks/useSessions";
import { Button } from "@/components/ui/button";
import { SessionForm } from "./SessionForm";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Clock, Trash2, Edit2, CheckCircle2, Timer } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SessionCardProps {
  session: MeditationSession;
}

export function SessionCard({ session }: SessionCardProps) {
  const { deleteSession, editSession } = useSessions();
  const navigate = useNavigate();
  
  const formattedDate = (() => {
    try {
      return format(parseISO(session.date), "EEE, MMMM do");
    } catch (error) {
      return session.date;
    }
  })();
  
  const handleComplete = () => {
    editSession(session.id, { status: 'completed' });
  };
  
  const navigateToTimer = () => {
    navigate(`/session/${session.id}`);
  };
  
  return (
    <Card 
      className={`border-l-4 ${session.status === 'completed' ? 'border-l-green-500' : session.status === 'in-progress' ? 'border-l-yellow-500' : 'border-l-meditation-purple'} hover:shadow-md transition-shadow cursor-pointer`}
      onClick={navigateToTimer}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium flex items-center">
              {session.title}
              {session.status === 'in-progress' && (
                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">In Progress</span>
              )}
            </h3>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              <span>{session.duration} minutes</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <span>{formattedDate} at {session.time}</span>
            </div>
          </div>
          
          <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={(e) => {
                e.stopPropagation();
                navigateToTimer();
              }}
              title="Open timer"
            >
              <Timer className="h-4 w-4" />
            </Button>
            
            {session.status === 'pending' && (
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
                title="Mark as completed"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
            {session.status === 'completed' && (
              <div className="h-8 w-8 flex items-center justify-center text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            )}
            <SessionForm 
              session={session} 
              mode="edit" 
              trigger={
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8" 
                  title="Edit session"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              } 
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8" 
                  title="Delete session"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Meditation Session</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{session.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteSession(session.id)} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {session.notes && (
          <p className="mt-3 text-sm text-muted-foreground">{session.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
