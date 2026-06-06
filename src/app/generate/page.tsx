'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, Upload, ChevronRight, Info, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const OCCASIONS = ['Daily', 'College', 'Office', 'Party', 'Wedding/Event'];
const VIBES = ['Minimal', 'Cute', 'Classy', 'Bold', 'Streetwear', 'Elegant'];
const BUDGETS = ['Low', 'Medium', 'Premium'];
const COMFORT = ['Loose', 'Fitted', 'Oversized', 'Traditional', 'Western', 'Mix'];

export default function GeneratePage() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      }
    };
    checkUser();
  }, [router]);

  const [formData, setFormData] = useState({
    occasion: '',
    vibe: '',
    budget: '',
    comfort: ''
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!photo || !formData.occasion || !formData.vibe || !formData.budget || !formData.comfort) return;
    
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      // 1. Upload photo to Supabase Storage
      const fileName = `${user.id}/${Date.now()}-${photo.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, photo);
      
      if (uploadError) throw uploadError;

      const photoUrl = supabase.storage.from('user-photos').getPublicUrl(fileName).data.publicUrl;

      // 2. Store draft report entry
      const { data: reportData, error: reportError } = await supabase
        .from('style_reports')
        .insert({
          user_id: user.id,
          photo_url: photoUrl,
          occasion: formData.occasion,
          vibe: formData.vibe,
          budget: formData.budget,
          comfort_preference: formData.comfort,
          report_json: {} // Placeholder, will be filled in loading screen logic or backend
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // 3. Redirect to loading screen with report ID
      router.push(`/generate/loading?id=${reportData.id}`);
    } catch (err) {
      console.error(err);
      alert("Error generating report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 max-w-2xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Create Your Style Profile</h1>
        <p className="text-white/50">Follow the steps to get your personalized AI style report.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-12">
        {[1, 2].map((s) => (
          <div 
            key={s} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-gradient-premium' : 'bg-white/10'}`} 
          />
        ))}
      </div>

      {step === 1 ? (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="card-premium flex flex-col items-center text-center p-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
              <Camera size={32} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Upload Your Photo</h2>
            <p className="text-white/40 text-sm mb-8">
              A clear photo showing your current style helps our AI understand your vibe.
            </p>

            <label className="btn-premium cursor-pointer py-4 px-8 w-full sm:w-auto">
              <Upload size={20} className="mr-2" />
              {photo ? 'Change Photo' : 'Select Photo'}
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
            </label>

            {preview && (
              <div className="mt-8 relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-primary/30">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="mt-8 flex items-start gap-2 p-4 bg-white/5 rounded-xl border border-white/10 text-left">
              <Info size={18} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-white/50 leading-relaxed">
                <span className="font-semibold text-white/70 block mb-1">Privacy Note</span>
                Your photo is used only to create your style report. We do not store biometric data or share your images with third parties.
              </p>
            </div>
          </div>

          <button 
            disabled={!photo}
            onClick={() => setStep(2)}
            className="btn-premium w-full py-4 disabled:opacity-50"
          >
            Next Step <ChevronRight size={20} className="ml-2" />
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="card-premium space-y-8">
            <FormSection 
              label="What's the occasion?" 
              options={OCCASIONS} 
              value={formData.occasion} 
              onChange={(v) => setFormData({...formData, occasion: v})} 
            />
            <FormSection 
              label="What's your preferred vibe?" 
              options={VIBES} 
              value={formData.vibe} 
              onChange={(v) => setFormData({...formData, vibe: v})} 
            />
            <FormSection 
              label="What's your styling budget?" 
              options={BUDGETS} 
              value={formData.budget} 
              onChange={(v) => setFormData({...formData, budget: v})} 
            />
            <FormSection 
              label="Comfort preference?" 
              options={COMFORT} 
              value={formData.comfort} 
              onChange={(v) => setFormData({...formData, comfort: v})} 
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setStep(1)}
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 font-medium hover:bg-white/10 transition-all flex-1"
            >
              Back
            </button>
            <button 
              disabled={loading || !formData.occasion || !formData.vibe || !formData.budget || !formData.comfort}
              onClick={handleSubmit}
              className="btn-premium flex-[2] py-4 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Generate My Style Report'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function FormSection({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-white/50 mb-4">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-4 py-2 rounded-lg text-sm transition-all border ${
              value === opt 
                ? 'bg-primary/20 border-primary text-white' 
                : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
