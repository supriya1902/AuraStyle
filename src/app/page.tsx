'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Camera, Palette, Shirt, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] -z-10" />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="text-2xl font-bold tracking-tighter text-gradient">
          AuraStyle AI
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/auth" className="hover:text-white transition-colors">Login</Link>
          <Link href="/auth" className="btn-premium py-2 px-5 text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center pt-20 pb-32 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6">
            <Sparkles size={14} /> AI-Powered Personal Styling
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Elevate Your Style with <br />
            <span className="text-gradient">Agentic Intelligence</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload a photo and let our AI agents analyze your vibe, colors, and preferences to build your perfect digital style profile.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/auth" className="btn-premium text-lg px-8 py-4 w-full sm:w-auto">
              Start Free Analysis <ArrowRight className="ml-2 inline" size={20} />
            </Link>
            <Link href="/report/sample" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 font-medium hover:bg-white/10 transition-all w-full sm:w-auto">
              View Sample Report
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left">
          <FeatureCard 
            icon={<Camera className="text-primary" />}
            title="Photo Analysis"
            description="Our AI understands your current style, colors, and presentation without judgment."
          />
          <FeatureCard 
            icon={<Palette className="text-secondary" />}
            title="Color Harmony"
            description="Get a curated palette that complements your features and existing wardrobe."
          />
          <FeatureCard 
            icon={<Shirt className="text-primary" />}
            title="Curated Outfits"
            description="Receive 3-5 complete outfit ideas tailored to your occasion and comfort."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 md:px-12 text-center text-white/40 text-sm">
        <p>© 2026 AuraStyle AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card-premium"
    >
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
