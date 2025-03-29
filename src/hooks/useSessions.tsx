import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MeditationSession, SessionMetrics, ChartData, SessionStatus } from '@/utils/types';
import { toast } from "sonner";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";

interface SessionsContextType {
  sessions: MeditationSession[];
  filteredSessions: MeditationSession[];
  metrics: SessionMetrics;
  chartData: ChartData[];
  isLoading: boolean;
  addSession: (session: Omit<MeditationSession, 'id' | 'userId' | 'status'>) => Promise<void>;
  editSession: (id: string, session: Partial<MeditationSession>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  filterSessions: (status?: string, searchTerm?: string) => void;
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined);

export const SessionsProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<MeditationSession[]>([]);
  const [metrics, setMetrics] = useState<SessionMetrics>({ total: 0, completed: 0, pending: 0 });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', searchTerm: '' });

  useEffect(() => {
    const fetchSessions = async () => {
      if (!isAuthenticated || !user) {
        setSessions([]);
        setFilteredSessions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('meditation_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedSessions: MeditationSession[] = data.map(session => ({
          id: session.id,
          title: session.title,
          duration: session.duration,
          date: session.date,
          time: session.time,
          status: session.status as SessionStatus,
          userId: session.user_id,
          notes: session.notes || undefined,
          elapsedTime: session.elapsed_time
        }));
        
        setSessions(formattedSessions);
        setFilteredSessions(formattedSessions);
        updateMetrics(formattedSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast.error('Failed to load meditation sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [isAuthenticated, user]);

  const updateMetrics = (sessionsList: MeditationSession[]) => {
    const completed = sessionsList.filter(s => s.status === 'completed').length;
    const pending = sessionsList.filter(s => s.status === 'pending').length;
    const inProgress = sessionsList.filter(s => s.status === 'in-progress').length;
    const total = sessionsList.length;
    
    setMetrics({ total, completed, pending });
    
    setChartData([
      { name: 'Completed', value: completed, color: '#9b87f5' },
      { name: 'Pending', value: pending, color: '#D3E4FD' },
      { name: 'In Progress', value: inProgress, color: '#ffd166' }
    ]);
  };

  const addSession = async (sessionData: Omit<MeditationSession, 'id' | 'userId' | 'status'>) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to add a session');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .insert({
          user_id: user.id,
          title: sessionData.title,
          duration: sessionData.duration,
          date: sessionData.date,
          time: sessionData.time,
          status: 'pending' as SessionStatus,
          notes: sessionData.notes,
          elapsed_time: 0
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newSession: MeditationSession = {
        id: data.id,
        title: data.title,
        duration: data.duration,
        date: data.date,
        time: data.time,
        status: data.status as SessionStatus,
        userId: data.user_id,
        notes: data.notes || undefined,
        elapsedTime: data.elapsed_time
      };
      
      const updatedSessions = [...sessions, newSession];
      setSessions(updatedSessions);
      
      filterSessions(filter.status, filter.searchTerm, updatedSessions);
      
      updateMetrics(updatedSessions);
      toast.success('Meditation session scheduled');
    } catch (error) {
      console.error('Error adding session:', error);
      toast.error('Failed to schedule meditation session');
    }
  };

  const editSession = async (id: string, sessionData: Partial<MeditationSession>) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to edit a session');
      return;
    }

    try {
      const dbData: any = {};
      if (sessionData.title) dbData.title = sessionData.title;
      if (sessionData.duration) dbData.duration = sessionData.duration;
      if (sessionData.date) dbData.date = sessionData.date;
      if (sessionData.time) dbData.time = sessionData.time;
      if (sessionData.status) dbData.status = sessionData.status;
      if (sessionData.notes !== undefined) dbData.notes = sessionData.notes;
      if (sessionData.elapsedTime !== undefined) dbData.elapsed_time = sessionData.elapsedTime;
      
      const { error } = await supabase
        .from('meditation_sessions')
        .update(dbData)
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      const updatedSessions = sessions.map(session => 
        session.id === id ? { ...session, ...sessionData } : session
      );
      
      setSessions(updatedSessions);
      
      filterSessions(filter.status, filter.searchTerm, updatedSessions);
      
      updateMetrics(updatedSessions);
      toast.success('Meditation session updated');
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Failed to update meditation session');
    }
  };

  const deleteSession = async (id: string) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to delete a session');
      return;
    }

    try {
      const { error } = await supabase
        .from('meditation_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      const updatedSessions = sessions.filter(session => session.id !== id);
      
      setSessions(updatedSessions);
      
      filterSessions(filter.status, filter.searchTerm, updatedSessions);
      
      updateMetrics(updatedSessions);
      toast.success('Meditation session deleted');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete meditation session');
    }
  };

  const filterSessions = (status?: string, searchTerm?: string, sessionsList = sessions) => {
    setFilter({ 
      status: status || filter.status, 
      searchTerm: searchTerm !== undefined ? searchTerm : filter.searchTerm 
    });
    
    let filtered = [...sessionsList];
    
    if (status) {
      filtered = filtered.filter(session => session.status === status);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(term) || 
        session.notes?.toLowerCase().includes(term)
      );
    }
    
    setFilteredSessions(filtered);
  };

  return (
    <SessionsContext.Provider value={{
      sessions,
      filteredSessions,
      metrics,
      chartData,
      isLoading,
      addSession,
      editSession,
      deleteSession,
      filterSessions
    }}>
      {children}
    </SessionsContext.Provider>
  );
};

export const useSessions = () => {
  const context = useContext(SessionsContext);
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionsProvider');
  }
  return context;
};

export default useSessions;
