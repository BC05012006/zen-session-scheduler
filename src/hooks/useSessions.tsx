
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MeditationSession, SessionMetrics, ChartData } from '@/utils/types';
import { toast } from "sonner";
import { format } from 'date-fns';

interface SessionsContextType {
  sessions: MeditationSession[];
  filteredSessions: MeditationSession[];
  metrics: SessionMetrics;
  chartData: ChartData[];
  isLoading: boolean;
  addSession: (session: Omit<MeditationSession, 'id' | 'userId' | 'status'>) => void;
  editSession: (id: string, session: Partial<MeditationSession>) => void;
  deleteSession: (id: string) => void;
  filterSessions: (status?: string, searchTerm?: string) => void;
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined);

// Mock data
const generateMockSessions = (): MeditationSession[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return [
    {
      id: '1',
      title: 'Morning Mindfulness',
      duration: 15,
      date: format(yesterday, 'yyyy-MM-dd'),
      time: '08:00',
      status: 'completed',
      userId: '1',
      notes: 'Focused on breathing techniques'
    },
    {
      id: '2',
      title: 'Midday Reset',
      duration: 10,
      date: format(today, 'yyyy-MM-dd'),
      time: '13:30',
      status: 'completed',
      userId: '1'
    },
    {
      id: '3',
      title: 'Evening Relaxation',
      duration: 20,
      date: format(today, 'yyyy-MM-dd'),
      time: '21:00',
      status: 'pending',
      userId: '1',
      notes: 'Prepare by dimming lights and using essential oils'
    },
    {
      id: '4',
      title: 'Visualization Practice',
      duration: 25,
      date: format(tomorrow, 'yyyy-MM-dd'),
      time: '10:15',
      status: 'pending',
      userId: '1'
    }
  ];
};

export const SessionsProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<MeditationSession[]>([]);
  const [metrics, setMetrics] = useState<SessionMetrics>({ total: 0, completed: 0, pending: 0 });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', searchTerm: '' });

  useEffect(() => {
    // Load saved sessions or use mock data
    const savedSessions = localStorage.getItem('meditation-sessions');
    const initialSessions = savedSessions ? JSON.parse(savedSessions) : generateMockSessions();
    
    setSessions(initialSessions);
    setFilteredSessions(initialSessions);
    updateMetrics(initialSessions);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever sessions change
    if (sessions.length > 0) {
      localStorage.setItem('meditation-sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const updateMetrics = (sessionsList: MeditationSession[]) => {
    const completed = sessionsList.filter(s => s.status === 'completed').length;
    const pending = sessionsList.filter(s => s.status === 'pending').length;
    const total = sessionsList.length;
    
    setMetrics({ total, completed, pending });
    
    // Update chart data
    setChartData([
      { name: 'Completed', value: completed, color: '#9b87f5' },
      { name: 'Pending', value: pending, color: '#D3E4FD' },
    ]);
  };

  const addSession = (sessionData: Omit<MeditationSession, 'id' | 'userId' | 'status'>) => {
    const newSession: MeditationSession = {
      ...sessionData,
      id: Date.now().toString(),
      userId: '1', // In a real app, this would come from auth
      status: 'pending'
    };
    
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    
    // Apply current filter to updated sessions
    filterSessions(filter.status, filter.searchTerm, updatedSessions);
    
    updateMetrics(updatedSessions);
    toast.success('Meditation session scheduled');
    
    // In a real app, here's where we'd send email notifications
    console.log('Email notification sent for new session:', newSession.title);
  };

  const editSession = (id: string, sessionData: Partial<MeditationSession>) => {
    const updatedSessions = sessions.map(session => 
      session.id === id ? { ...session, ...sessionData } : session
    );
    
    setSessions(updatedSessions);
    
    // Apply current filter to updated sessions
    filterSessions(filter.status, filter.searchTerm, updatedSessions);
    
    updateMetrics(updatedSessions);
    toast.success('Meditation session updated');
  };

  const deleteSession = (id: string) => {
    const updatedSessions = sessions.filter(session => session.id !== id);
    
    setSessions(updatedSessions);
    
    // Apply current filter to updated sessions
    filterSessions(filter.status, filter.searchTerm, updatedSessions);
    
    updateMetrics(updatedSessions);
    toast.success('Meditation session deleted');
  };

  const filterSessions = (status?: string, searchTerm?: string, sessionsList = sessions) => {
    // Store the current filter
    setFilter({ 
      status: status || filter.status, 
      searchTerm: searchTerm !== undefined ? searchTerm : filter.searchTerm 
    });
    
    let filtered = [...sessionsList];
    
    // Filter by status if provided
    if (status) {
      filtered = filtered.filter(session => session.status === status);
    }
    
    // Filter by search term if provided
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
