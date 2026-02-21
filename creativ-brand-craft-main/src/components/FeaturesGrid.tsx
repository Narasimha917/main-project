import { Sparkles, Zap, PenTool, BarChart3, MessageSquare, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Sparkles,
    title: "Brand Name Generation",
    description: "AI crafts unique, memorable brand names tailored to your industry and vision.",
    path: "/features/brand-names",
  },
  {
    icon: Palette,
    title: "Logo Concepts",
    description: "Get AI-generated logo ideas and visual identity direction instantly.",
    path: "/features/logo-concepts",
  },
  {
    icon: PenTool,
    title: "Content Automation",
    description: "Generate taglines, bios, mission statements, and marketing copy effortlessly.",
    path: "/features/content-automation",
  },
  {
    icon: BarChart3,
    title: "Sentiment Analysis",
    description: "Understand how your brand is perceived with AI-powered sentiment insights.",
    path: "/features/sentiment-analysis",
  },
  {
    icon: MessageSquare,
    title: "Branding Assistant",
    description: "Chat with an AI branding expert for personalized strategy and guidance.",
    path: "/features/branding-assistant",
  },
  {
    icon: Zap,
    title: "Instant Workflow",
    description: "From idea to full brand kit in minutes — not weeks. All AI-driven.",
    path: "/features/instant-workflow",
  },
];

const FeaturesGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Everything You Need to <span className="gradient-text">Build a Brand</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powered by cutting-edge generative AI to automate every step of your branding journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <button
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group text-left cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4 group-hover:glow-effect transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
