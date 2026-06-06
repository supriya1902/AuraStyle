'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Download, 
  Share2, 
  Palette, 
  Shirt, 
  Scissors, 
  Star, 
  Check, 
  Copy, 
  Info,
  Calendar,
  Sparkles,
  Heart
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchReport = async () => {
      if (id === 'sample') {
        setReport({
          photo_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
          occasion: "Daily",
          vibe: "Minimal",
          budget: "Medium",
          comfort_preference: "Loose",
          created_at: new Date().toISOString(),
          report_json: {
            styleIdentity: "Soft Minimal + Elegant Casual",
            summary: "Your style direction works best with clean silhouettes, soft colors, comfortable fits, and simple accessories.",
            scores: {
              styleMatch: 92,
              colorHarmony: 88,
              occasionFit: 90
            },
            colorPalette: [
              { name: "Creamy Ivory", hex: "#F8F3E7" },
              { name: "Midnight Navy", hex: "#1F2A44" },
              { name: "Muted Olive", hex: "#6B705C" },
              { name: "Dusty Rose", hex: "#C9A0A0" },
              { name: "Rich Charcoal", hex: "#2E2E2E" }
            ],
            outfits: [
              {
                title: "Clean Daily Look",
                top: "Oversized white linen shirt",
                bottom: "Straight-leg vintage blue jeans",
                footwear: "Clean white leather sneakers",
                accessories: "Small gold hoops and organic cotton tote bag",
                whyItWorks: "This outfit feels simple, comfortable, and polished for everyday wear. The natural draping of the linen adds effortless texture."
              },
              {
                title: "Sophisticated Comfort",
                top: "Relaxed rib-knit mock-neck top",
                bottom: "Tailored wide-leg trousers in charcoal",
                footwear: "Pointed-toe leather flats",
                accessories: "Minimalist silver chain necklace and sleek leather watch",
                whyItWorks: "Balances professional structure with high-end fabric ease, keeping you comfortable yet elegant."
              },
              {
                title: "Layered Smart Casual",
                top: "Quality cotton T-shirt layered under a soft knit cardigan",
                bottom: "Relaxed chinos in khaki or sand",
                footwear: "Classic leather loafers",
                accessories: "Silk neck scarf and neutral crossbody bag",
                whyItWorks: "A perfect transition look. The cardigan provides soft layering while the loafers add an elegant, tailored grounding."
              }
            ],
            hairstyles: [
              "Soft open waves",
              "Claw clip messy bun",
              "Sleek low ponytail"
            ],
            accessories: [
              "Small gold hoops",
              "Minimal silver chain",
              "Neutral leather tote bag",
              "Simple watch"
            ]
          }
        });
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }

        const { data, error } = await supabase
          .from('style_reports')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error || !data) {
          console.error(error);
          router.push('/dashboard');
        } else {
          setReport(data);
        }
      } catch (err) {
        console.error(err);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReport();
  }, [id, router]);

  const copyColorToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b]">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary animate-spin mb-4" />
        <p className="text-white/60 font-medium">Fetching your Style Report...</p>
      </div>
    );
  }

  if (!report || !report.report_json) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b]">
        <p className="text-white/60 mb-4">Report not found.</p>
        <Link href="/dashboard" className="btn-premium">Back to Dashboard</Link>
      </div>
    );
  }

  const data = report.report_json;

  return (
    <div className="min-h-screen bg-[#09090b] pb-24 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-lg border-b border-white/5 bg-[#09090b]/80 px-6 py-4 print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
            <ChevronLeft size={18} /> Back to Dashboard
          </Link>
          <div className="flex gap-2">
            <button 
              onClick={handleDownload}
              title="Print style report"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={handleShare}
              title="Copy share link"
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
            >
              <Share2 size={18} />
              <AnimatePresence>
                {shareToast && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 whitespace-nowrap bg-gradient-premium text-xs text-white px-3 py-1.5 rounded-lg shadow-premium font-medium z-40"
                  >
                    Link copied!
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        {/* Profile Card & Identity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 w-fit px-3 py-1 rounded-full">
              <Sparkles size={12} className="animate-pulse" /> AI Stylist Final Verdict
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none">
              <span className="text-gradient">{data.styleIdentity}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl border-l-2 border-primary/30 pl-4 italic">
              "{data.summary}"
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-white/40">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Calendar size={14} /> {new Date(report.created_at).toLocaleDateString()}
              </div>
              <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-wide">
                Vibe: <span className="text-white/80 font-medium">{report.vibe}</span>
              </div>
              <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-wide">
                Occasion: <span className="text-white/80 font-medium">{report.occasion}</span>
              </div>
              <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-wide">
                Fit: <span className="text-white/80 font-medium">{report.comfort_preference}</span>
              </div>
            </div>
          </div>

          <div className="relative group mx-auto lg:mx-0 w-full max-w-[280px]">
            <div className="absolute inset-0 bg-gradient-premium rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity -z-10" />
            <div className="card-premium p-1.5 overflow-hidden rounded-3xl">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                <img 
                  src={report.photo_url} 
                  alt="Style Source Photo" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-3 left-3 bg-[#09090b]/80 border border-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] tracking-wider uppercase text-white/80 font-semibold">
                  Aura Analyzed
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scores Section */}
        <section className="mb-16">
          <h2 className="text-lg font-semibold text-white/40 uppercase tracking-widest mb-6">AI Styling Compatibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScoreCard 
              label="Style Match" 
              score={data.scores?.styleMatch || 90} 
              color="text-primary" 
              delay={0.1}
            />
            <ScoreCard 
              label="Color Harmony" 
              score={data.scores?.colorHarmony || 88} 
              color="text-secondary" 
              delay={0.2}
            />
            <ScoreCard 
              label="Occasion Fit" 
              score={data.scores?.occasionFit || 90} 
              color="text-accent-violet" 
              delay={0.3}
            />
          </div>
        </section>

        {/* Palette & Extras Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Color Palette */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Palette className="text-primary" size={18} />
              </div>
              <h2 className="text-2xl font-bold">Recommended Color Palette</h2>
            </div>
            
            <p className="text-sm text-white/40">
              Click any color card to copy the hex code to your clipboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.colorPalette?.map((color: any, idx: number) => (
                <div 
                  key={idx}
                  onClick={() => copyColorToClipboard(color.hex)}
                  className="card-premium p-3 flex items-center justify-between cursor-pointer active:scale-98 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl border border-white/10 shadow-inner group-hover:scale-105 transition-transform" 
                      style={{ backgroundColor: color.hex }} 
                    />
                    <div>
                      <p className="font-semibold group-hover:text-primary transition-colors text-sm">{color.name}</p>
                      <p className="text-xs text-white/40 font-mono tracking-wider uppercase">{color.hex}</p>
                    </div>
                  </div>
                  <div className="text-white/20 group-hover:text-white/60 transition-colors mr-2">
                    {copiedColor === color.hex ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hairstyles & Accessories */}
          <div className="space-y-10">
            {/* Hairstyles */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20">
                  <Scissors className="text-secondary" size={18} />
                </div>
                <h2 className="text-xl font-bold">Hairstyle Suggestions</h2>
              </div>
              <ul className="space-y-3">
                {data.hairstyles?.map((style: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-xl p-3.5 text-sm text-white/80">
                    <span className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-1.5" />
                    <span>{style}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Accessories */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Star className="text-primary" size={18} />
                </div>
                <h2 className="text-xl font-bold">Key Accessories</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.accessories?.map((acc: string, idx: number) => (
                  <span 
                    key={idx} 
                    className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white/70 hover:border-primary/45 transition-colors cursor-default"
                  >
                    {acc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Outfit Recommendations */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-t border-white/5 pt-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center shadow-premium">
              <Shirt className="text-white" size={20} />
            </div>
            <h2 className="text-3xl font-bold">Curated Outfit Blueprints</h2>
          </div>

          <div className="space-y-6">
            {data.outfits?.map((outfit: any, idx: number) => (
              <div 
                key={idx} 
                className="card-premium grid grid-cols-1 md:grid-cols-5 gap-8 p-8 border-white/10 hover:border-white/20 transition-all"
              >
                <div className="md:col-span-3 space-y-5">
                  <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">Blueprint {idx + 1}</span>
                  <h3 className="text-2xl font-bold text-gradient leading-none">{outfit.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Top wear</span>
                      <span className="text-white/90 font-medium">{outfit.top}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Bottom wear</span>
                      <span className="text-white/90 font-medium">{outfit.bottom}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Footwear</span>
                      <span className="text-white/90 font-medium">{outfit.footwear}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Key accessory</span>
                      <span className="text-white/90 font-medium">{outfit.accessories}</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 bg-gradient-to-br from-white/[0.03] to-transparent p-6 rounded-2xl border border-white/10 flex flex-col justify-center h-full">
                  <h4 className="text-xs font-semibold mb-2.5 uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Info size={14} /> Styling Logic
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed italic font-light">
                    "{outfit.whyItWorks}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ScoreCard({ label, score, color, delay }: { label: string, score: number, color: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card-premium text-center flex flex-col justify-between items-center h-40"
    >
      <div className="w-full">
        <div className={`text-5xl font-extrabold mb-1 tracking-tight ${color}`}>{score}%</div>
        <div className="text-xs text-white/40 font-semibold uppercase tracking-widest">{label}</div>
      </div>
      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full bg-gradient-premium rounded-full"
        />
      </div>
    </motion.div>
  );
}
