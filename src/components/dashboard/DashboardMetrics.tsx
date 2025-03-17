
import { useSessions } from "@/hooks/useSessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Calendar } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
  color: string;
}

function MetricCard({ title, value, icon, description, onClick, color }: MetricCardProps) {
  return (
    <Card 
      className="hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-full p-2 ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardMetrics() {
  const { metrics, filterSessions } = useSessions();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard 
        title="Total Sessions" 
        value={metrics.total} 
        icon={<Clock className="h-4 w-4 text-white" />} 
        description="All meditation sessions"
        onClick={() => filterSessions('')}
        color="bg-meditation-purple"
      />
      <MetricCard 
        title="Completed Sessions" 
        value={metrics.completed} 
        icon={<CheckCircle className="h-4 w-4 text-white" />} 
        description="Your meditation achievements"
        onClick={() => filterSessions('completed')}
        color="bg-green-500"
      />
      <MetricCard 
        title="Pending Sessions" 
        value={metrics.pending} 
        icon={<Calendar className="h-4 w-4 text-white" />} 
        description="Upcoming meditations"
        onClick={() => filterSessions('pending')}
        color="bg-blue-500"
      />
    </div>
  );
}
