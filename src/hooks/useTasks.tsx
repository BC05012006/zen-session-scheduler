
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/utils/types';
import { toast } from "sonner";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";

interface TasksContextType {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  filterTasks: (status?: string, searchTerm?: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', searchTerm: '' });

  useEffect(() => {
    const fetchTasks = async () => {
      if (!isAuthenticated || !user) {
        setTasks([]);
        setFilteredTasks([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedTasks: Task[] = data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || undefined,
          status: task.status as TaskStatus,
          dueDate: task.due_date ? new Date(task.due_date).toISOString() : undefined,
          priority: task.priority as TaskPriority,
          userId: task.user_id,
          createdAt: new Date(task.created_at).toISOString(),
          updatedAt: new Date(task.updated_at).toISOString()
        }));
        
        setTasks(formattedTasks);
        setFilteredTasks(formattedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [isAuthenticated, user]);

  const addTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to add a task');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          due_date: taskData.dueDate,
          priority: taskData.priority
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        status: data.status as TaskStatus,
        dueDate: data.due_date ? new Date(data.due_date).toISOString() : undefined,
        priority: data.priority as TaskPriority,
        userId: data.user_id,
        createdAt: new Date(data.created_at).toISOString(),
        updatedAt: new Date(data.updated_at).toISOString()
      };
      
      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      
      filterTasks(filter.status, filter.searchTerm, updatedTasks);
      
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to update a task');
      return;
    }

    try {
      const dbData: any = {};
      if (taskData.title) dbData.title = taskData.title;
      if (taskData.description !== undefined) dbData.description = taskData.description;
      if (taskData.status) dbData.status = taskData.status;
      if (taskData.dueDate !== undefined) dbData.due_date = taskData.dueDate;
      if (taskData.priority) dbData.priority = taskData.priority;
      
      const { error } = await supabase
        .from('tasks')
        .update(dbData)
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, ...taskData } : task
      );
      
      setTasks(updatedTasks);
      
      filterTasks(filter.status, filter.searchTerm, updatedTasks);
      
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to delete a task');
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      const updatedTasks = tasks.filter(task => task.id !== id);
      
      setTasks(updatedTasks);
      
      filterTasks(filter.status, filter.searchTerm, updatedTasks);
      
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const filterTasks = (status?: string, searchTerm?: string, tasksList = tasks) => {
    setFilter({ 
      status: status || filter.status, 
      searchTerm: searchTerm !== undefined ? searchTerm : filter.searchTerm 
    });
    
    let filtered = [...tasksList];
    
    if (status) {
      filtered = filtered.filter(task => task.status === status);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(term) || 
        task.description?.toLowerCase().includes(term)
      );
    }
    
    setFilteredTasks(filtered);
  };

  return (
    <TasksContext.Provider value={{
      tasks,
      filteredTasks,
      isLoading,
      addTask,
      updateTask,
      deleteTask,
      filterTasks
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};

export default useTasks;
