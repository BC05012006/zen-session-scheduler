
import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border py-6 mt-auto">
      <div className="zen-container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-meditation-purple flex items-center justify-center text-white font-bold">
              Z
            </div>
            <h2 className="ml-2 text-lg font-semibold gradient-text">ZenMind</h2>
          </div>
          
          <nav className="flex gap-6 mb-4 md:mb-0">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
          
          <div className="text-sm text-muted-foreground">
            © {year} ZenMind. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
