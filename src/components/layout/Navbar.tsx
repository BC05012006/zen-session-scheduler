
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-border">
      <div className="zen-container py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-meditation-purple flex items-center justify-center text-white font-bold">
            Z
          </div>
          <h1 className="text-xl font-semibold gradient-text">ZenMind</h1>
        </Link>
        
        <div className="flex items-center space-x-4">
          <ModeToggle />
          
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
