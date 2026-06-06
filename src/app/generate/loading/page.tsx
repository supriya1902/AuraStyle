'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { analyzePhoto, getStyleRecommendations, generateFinalReport } from '@/lib/agents';
import { supabase } from '@/lib/supabase';

const STEPS = [
  "Analyzing photo metadata...",
  "Scanning clothing silhouettes...",
  "Evaluating color harmony...",
  "Consulting style recommendation agent...",
  "Structuring final report..."
];

function LoadingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id');

  useEffect(() => {
    const processAI = async () => {
      if (!reportId) return;

      try {
        // Step-by-step UI animation
        for (let i = 0; i < STEPS.length; i++) {
          setCurrentStep(i);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // Fetch the draft report data
        const { data: reportData, error: fetchError } = await supabase
          .from('style_reports')
          .select('*')
          .eq('id', reportId)
          .single();
        
        if (fetchError) throw fetchError;

        // Run AI Agents (Mocked)
        const analysis = await analyzePhoto(reportData.photo_url);
        const recommendations = await getStyleRecommendations(analysis, {
          vibe: reportData.vibe,
          comfort: reportData.comfort_preference,
          occasion: reportData.occasion,
          budget: reportData.budget
        });
        const finalReport = await generateFinalReport(recommendations);

        // Update database with final JSON
        const { error: updateError } = await supabase
          .from('style_reports')
          .update({ report_json: finalReport })
          .eq('id', reportId);
        
        if (updateError) throw updateError;

        // Update latest style identity in profile
        await supabase
          .from('profiles')
          .update({ latest_style_identity: finalReport.styleIdentity })
          .eq('user_id', reportData.user_id);

        setCompleted(true);
        setTimeout(() => {
          router.push(`/report/${reportId}`);
        }, 1000);
      } catch (err) {
        console.error("AI Processing Error:", err);
        alert("Something went wrong during analysis. Redirecting to dashboard.");
        router.push('/dashboard');
      }
    };

    processAI();
  }, [reportId, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-12">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-2 border-dashed border-primary/30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {completed ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle2 size={48} className="text-green-500" />
            </motion.div>
          ) : (
            <Sparkles size={40} className="text-primary animate-pulse" />
          )}
        </div>
      </div>

      <div className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          {completed ? 'Analysis Complete!' : 'AI Stylists at Work'}
        </h2>
        
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white/60 font-medium"
            >
              {STEPS[currentStep]}
            </motion.p>
          </AnimatePresence>

          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              className="h-full bg-gradient-premium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoadingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#09090b]">
        <div className="relative mb-12">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-primary/30 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={40} className="text-primary animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Initialising AI Stylist...</h2>
      </div>
    }>
      <LoadingContent />
    </Suspense>
  );
}
