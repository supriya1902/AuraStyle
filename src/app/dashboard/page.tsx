'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  LayoutDashboard, 
  History, 
  User, 
  LogOut, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  HelpCircle,
  Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }

        // Fetch reports for current user, and fetch profile
        const [reportsRes, profileRes] = await Promise.all([
          supabase.from('style_reports').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
        ]);

        let userProfile = profileRes.data;
        
        // Auto-create profile if missing
        if (!userProfile) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Aura User'
            })
            .select()
            .single();
          
          if (!insertError && newProfile) {
            userProfile = newProfile;
          }
        }

        setReports(reportsRes.data || []);
        setProfile(userProfile);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b]">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary animate-spin mb-4" />
        <p className="text-white/60 font-medium">Loading your Style Hub...</p>
      </div>
    );
  }

  const latestIdentity = profile?.latest_style_identity || reports[0]?.report_json?.styleIdentity || 'Pending AI Run';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#09090b] text-white">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 border-r border-white/5 p-6 flex-col shrink-0 bg-[#09090b]">
        <div className="text-2xl font-bold tracking-tighter text-gradient mb-12">
          AuraStyle AI
        </div>
        
        <nav className="space-y-2 flex-1">
          <SidebarLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <SidebarLink href="/profile" icon={<User size={18} />} label="Profile Settings" />
        </nav>

        <div className="border-t border-white/5 pt-6 mt-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-white/40 hover:text-white transition-all w-full p-3 rounded-xl hover:bg-white/5 text-sm font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#09090b]">
        <div className="text-xl font-bold tracking-tighter text-gradient">
          AuraStyle AI
        </div>
        <div className="flex gap-4">
          <Link href="/profile" className="p-2 text-white/60 hover:text-white">
            <User size={20} />
          </Link>
          <button onClick={handleLogout} className="p-2 text-white/40 hover:text-white">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Welcome Banner */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Stylist'}!
            </h1>
            <p className="text-white/40 text-sm">
              Discover and organize your tailored styling reports.
            </p>
          </div>
          <Link href="/generate" className="btn-premium py-3 px-6 text-sm font-semibold flex items-center gap-2 shadow-premium shrink-0">
            <Plus size={18} /> New Style Analysis
          </Link>
        </header>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <StatCard 
            label="Total Reports" 
            value={reports.length.toString()} 
            icon={<Layers className="text-primary" size={16} />}
            subtext="Saved styling runs"
          />
          <StatCard 
            label="Style Identity" 
            value={latestIdentity} 
            icon={<Sparkles className="text-secondary" size={16} />}
            subtext="AI Style profile verdict"
          />
          <StatCard 
            label="Style Aura Status" 
            value={reports.length > 0 ? "Synced" : "Awaiting Scan"} 
            icon={<TrendingUp className="text-accent-violet" size={16} />}
            subtext="Database status"
          />
        </section>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Saved Reports Grid */}
          <div className="flex-1 space-y-6">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <History size={18} className="text-white/50" /> Recent Styling Reports
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {reports.map((report, idx) => (
                <Link key={report.id} href={`/report/${report.id}`}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="card-premium p-0 overflow-hidden group border-white/10 hover:border-primary/30 flex flex-col justify-between h-80"
                  >
                    <div className="h-44 relative overflow-hidden bg-white/5">
                      <img 
                        src={report.photo_url} 
                        alt="Style Source Photo" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-[#09090b]/80 border border-white/10 text-[9px] uppercase tracking-wider text-primary font-bold">
                          {report.occasion}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-[#09090b]/80 border border-white/10 text-[9px] uppercase tracking-wider text-secondary font-bold">
                          {report.vibe}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-1 leading-snug group-hover:text-primary transition-colors line-clamp-1">
                          {report.report_json?.styleIdentity || 'AI Analysis Running...'}
                        </h3>
                        <p className="text-xs text-white/50 line-clamp-2">
                          {report.report_json?.summary || 'Wait while the report completes.'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-white/40 border-t border-white/5 pt-3 mt-3">
                        <span>{new Date(report.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 font-semibold text-primary group-hover:underline">
                          View Report <Eye size={12} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}

              {reports.length === 0 && (
                <div className="col-span-full py-20 px-6 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <Sparkles className="text-white/30" size={28} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">No Reports Generated Yet</h3>
                  <p className="text-white/40 text-sm max-w-sm mx-auto mb-8">
                    Ready to find your style archetype? Upload a photo and let our AI agents analyze your profile.
                  </p>
                  <Link href="/generate" className="btn-premium px-8 py-3 text-sm font-semibold">
                    Start Your First Analysis
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Styling Tips Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <HelpCircle size={18} className="text-white/50" /> Stylist Secrets
            </h2>
            
            <div className="card-premium p-5 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Sparkles size={16} /> The Rule of Thirds
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Divide your body outfit into thirds rather than halves. A 1/3 top (tucked shirt) and 2/3 bottom (high-waisted pants) creates a longer, more flattering optical profile than equal halves.
              </p>
            </div>

            <div className="card-premium p-5 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent space-y-3">
              <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                <Layers size={16} /> Mix Your Textures
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Monochrome outfits look exceptionally premium when you mix textures. Pair a matte cotton tee with satin pants or a knit cardigan with leather boots.
              </p>
            </div>

            <div className="card-premium p-5 border-accent-violet/20 bg-gradient-to-br from-accent-violet/5 to-transparent space-y-3">
              <div className="flex items-center gap-2 text-accent-violet font-bold text-sm">
                <TrendingUp size={16} /> Color Sandwiching
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Match your footwear color with your top layer color, and use a different color for your pants. This sandwich effect creates a visually balanced, cohesive appearance.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 p-3.5 rounded-xl transition-all font-medium text-sm border ${
        active 
          ? 'bg-gradient-premium border-transparent text-white shadow-premium' 
          : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon} <span>{label}</span>
    </Link>
  );
}

function StatCard({ label, value, icon, subtext }: { label: string, value: string, icon: React.ReactNode, subtext: string }) {
  return (
    <div className="card-premium p-6 flex flex-col justify-between h-36 border-white/10 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{label}</span>
        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-xl md:text-2xl font-extrabold truncate text-white leading-none mb-1">{value}</p>
        <p className="text-[10px] text-white/30">{subtext}</p>
      </div>
    </div>
  );
}
