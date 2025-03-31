
import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { TaskStatus } from "@/utils/types";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, ListFilter } from "lucide-react";

export function TasksList() {
  const { filteredTasks, filterTasks } = useTasks();
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleStatusChange = (value: string) => {
    if (value === "all") {
      filterTasks("", searchTerm);
    } else {
      const status = value as TaskStatus;
      filterTasks(status, searchTerm);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterTasks(undefined, searchTerm);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full sm:max-w-xs">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
        
        <div className="flex w-full sm:w-auto gap-2">
          <Select onValueChange={handleStatusChange} defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
          
          <TaskForm mode="add" />
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <p className="text-muted-foreground mb-4">No tasks found</p>
          <TaskForm
            mode="add"
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create your first task
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
