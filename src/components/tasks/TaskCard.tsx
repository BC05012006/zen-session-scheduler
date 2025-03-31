
import { Task } from "@/utils/types";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./TaskForm";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Clock, Flag, Trash2, Edit2 } from "lucide-react";
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

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useTasks();
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-l-green-500';
      case 'in-progress': return 'border-l-yellow-500';
      case 'pending': return 'border-l-meditation-purple';
      default: return 'border-l-gray-500';
    }
  };
  
  const handleComplete = () => {
    updateTask(task.id, { status: 'completed' });
  };
  
  const handleInProgress = () => {
    updateTask(task.id, { status: 'in-progress' });
  };
  
  return (
    <Card 
      className={`border-l-4 ${getStatusColor(task.status)} hover:shadow-md transition-shadow`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium">{task.title}</h3>
            
            {task.description && (
              <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="flex items-center text-xs">
                <span className={`px-2 py-0.5 rounded-full ${
                  task.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : task.status === 'in-progress' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {task.status === 'in-progress' ? 'In Progress' : 
                    task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>
              
              {task.dueDate && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{format(parseISO(task.dueDate), "MMM d, yyyy h:mm a")}</span>
                </div>
              )}
              
              <div className="flex items-center text-xs">
                <Flag className={`w-3 h-3 mr-1 ${getPriorityColor(task.priority)}`} />
                <span className={getPriorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1 ml-4">
            {task.status !== 'completed' && (
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleComplete}
                title="Mark as completed"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
            
            {task.status === 'pending' && (
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleInProgress}
                title="Mark as in progress"
              >
                <Clock className="h-4 w-4" />
              </Button>
            )}
            
            <TaskForm 
              task={task} 
              mode="edit" 
              trigger={
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8" 
                  title="Edit task"
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
                  title="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{task.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteTask(task.id)} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
