import { useState } from "react";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BrandResult {
  brandNames: string[];
  tagline: string;
  missionStatement: string;
  brandVoice: string;
  colorSuggestions: string[];
  elevatorPitch: string;
}

const BrandGenerator = () => {
  const [input, setInput] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BrandResult | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error("Please enter a brand idea or keyword");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-brand", {
        body: { brandIdea: input.trim(), industry: industry.trim() },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate brand. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            <span className="gradient-text">AI Brand Generator</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Enter your idea and let AI create a complete brand identity for you.
          </p>
        </div>

        {/* Input Section */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Your Brand Idea / Keywords
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. eco-friendly coffee, tech startup, fitness app..."
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Industry (optional)
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Food & Beverage, Technology, Health..."
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                maxLength={100}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full gradient-bg text-primary-foreground py-4 rounded-xl font-display font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating your brand...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Brand Identity
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Brand Names */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Brand Name Suggestions
              </h2>
              <div className="flex flex-wrap gap-3">
                {result.brandNames.map((name, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-foreground font-display font-semibold text-lg"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Tagline */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-display font-bold mb-3">Tagline</h2>
              <p className="text-2xl font-display gradient-accent-text font-semibold italic">
                "{result.tagline}"
              </p>
            </div>

            {/* Mission & Voice */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-display font-bold mb-3">Mission Statement</h2>
                <p className="text-muted-foreground leading-relaxed">{result.missionStatement}</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-display font-bold mb-3">Brand Voice</h2>
                <p className="text-muted-foreground leading-relaxed">{result.brandVoice}</p>
              </div>
            </div>

            {/* Color Suggestions */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-display font-bold mb-4">Color Palette</h2>
              <div className="flex flex-wrap gap-4">
                {result.colorSuggestions.map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className="w-16 h-16 rounded-xl border border-border shadow-lg"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-muted-foreground font-mono">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Elevator Pitch */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-display font-bold mb-3">Elevator Pitch</h2>
              <p className="text-foreground leading-relaxed text-lg">{result.elevatorPitch}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandGenerator;
