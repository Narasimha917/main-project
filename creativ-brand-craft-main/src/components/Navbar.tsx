import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between glass-card rounded-2xl px-6 py-3">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">BrandForge</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/auth")}
            className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/generate")}
            className="gradient-bg text-primary-foreground px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
