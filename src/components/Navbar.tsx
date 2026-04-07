import { Link, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-4xl flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>InterviewPrep AI</span>
        </Link>
        {isDashboard && (
          <span className="text-sm text-muted-foreground">Dashboard</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
