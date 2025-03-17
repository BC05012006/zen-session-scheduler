
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Home, User, Info, MessageSquare, History, LogOut } from "lucide-react";

export function DashNav() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4 mr-2" /> },
    { path: "/dashboard", label: "Dashboard", icon: <History className="w-4 h-4 mr-2" /> },
    { path: "/about", label: "About", icon: <Info className="w-4 h-4 mr-2" /> },
    { path: "/contact", label: "Contact", icon: <MessageSquare className="w-4 h-4 mr-2" /> },
  ];
  
  return (
    <div className="bg-card border-b border-border py-2">
      <div className="zen-container">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center"
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {user?.email || "User"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="flex items-center">
                  <History className="w-4 h-4 mr-2" />
                  My Sessions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="flex items-center text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
