'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Save, ChevronLeft, Loader2, LogOut, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        let currentProfile = data;

        // Auto-create profile if missing
        if (!currentProfile) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Aura User'
            })
            .select()
            .single();
          
          if (!insertError && newProfile) {
            currentProfile = newProfile;
          }
        }
        
        setProfile({ ...currentProfile, email: user.email });
        setFullName(currentProfile?.full_name || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', profile.id);
      
      if (error) throw error;
      setSuccess("Profile settings updated successfully!");
      setProfile({ ...profile, full_name: fullName });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      // 1. Upload to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get public url
      const publicUrl = supabase.storage.from('user-photos').getPublicUrl(filePath).data.publicUrl;

      // 3. Update database profiles table
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (dbError) throw dbError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setSuccess("Avatar updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error uploading avatar image.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteData = async () => {
    const confirmed = window.confirm(
      "WARNING: Deleting all your styling reports and profiles settings cannot be undone. Are you sure you want to proceed?"
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete from tables where user_id matches
      await Promise.all([
        supabase.from('style_reports').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('user_id', user.id)
      ]);

      alert("Your style analytics data has been deleted. Logging you out.");
      await supabase.auth.signOut();
      router.push('/');
    } catch (err: any) {
      console.error(err);
      alert("Error deleting user account data: " + err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b]">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary animate-spin mb-4" />
        <p className="text-white/60 font-medium">Fetching profile settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] py-12 px-6 text-white">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-10">Your Profile</h1>

        <div className="card-premium space-y-10 border-white/10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-premium p-1 shadow-premium">
                <div className="w-full h-full rounded-full bg-[#09090b] flex items-center justify-center overflow-hidden">
                  {uploadingAvatar ? (
                    <Loader2 className="animate-spin text-primary" size={32} />
                  ) : profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={52} className="text-white/20" />
                  )}
                </div>
              </div>
              <label className="absolute bottom-0 right-0 p-2.5 rounded-full bg-primary text-white border-4 border-[#09090b] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md">
                <Camera size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={uploadingAvatar} />
              </label>
            </div>
            <p className="mt-4 text-xs text-white/40">Manage your styling identity picture</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm font-medium"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Email Address</label>
              <div className="relative opacity-60">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="email" 
                  value={profile?.email || ''} 
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 cursor-not-allowed text-sm font-medium"
                />
              </div>
              <p className="mt-2 text-[10px] text-white/20">Email is linked to account auth and cannot be changed.</p>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm font-medium">{success}</p>}

            <button 
              type="submit"
              disabled={saving}
              className="btn-premium w-full py-4 mt-4 font-semibold text-sm flex items-center justify-center disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : (
                <span className="flex items-center">
                  <Save size={18} className="mr-2" /> Save Profile Settings
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="mt-12 p-6 border border-red-500/20 rounded-2xl bg-red-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-red-500 font-bold mb-1 flex items-center gap-1.5 text-sm">
              <Trash2 size={16} /> Danger Zone
            </h3>
            <p className="text-white/40 text-xs leading-relaxed max-w-md">
              Deleting your account settings deletes all your saved style reports, photos, and preferences history forever.
            </p>
          </div>
          <button 
            onClick={handleDeleteData}
            disabled={saving}
            className="text-red-500 text-xs font-semibold hover:underline bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition-all cursor-pointer"
          >
            Delete Styling Data
          </button>
        </div>
      </div>
    </div>
  );
}
