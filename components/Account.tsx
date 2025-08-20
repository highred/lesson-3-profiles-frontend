
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';
import Avatar from './Avatar';

interface AccountProps {
  session: Session;
  onBack: () => void;
}

const Account: React.FC<AccountProps> = ({ session, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      if (!supabase) return;
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      alert(error.message);
    } else {
        alert('Profile updated successfully!');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto">
       <button
        onClick={onBack}
        className="text-brand-primary hover:underline font-semibold mb-6"
       >
        &larr; Back to Dashboard
       </button>
      <form onSubmit={updateProfile} className="space-y-4">
        <Avatar
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url);
          }}
        />
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
          <input id="email" type="text" value={session.user.email} disabled className="w-full bg-base-300 text-gray-500 px-4 py-3 rounded-md cursor-not-allowed" />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">Username</label>
          <input
            id="username"
            type="text"
            required
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-base-300 text-white placeholder-gray-500 px-4 py-3 rounded-md border-2 border-base-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition"
          />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-400 mb-1">Website</label>
          <input
            id="website"
            type="url"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full bg-base-300 text-white placeholder-gray-500 px-4 py-3 rounded-md border-2 border-base-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition"
          />
        </div>

        <div>
          <button className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-md transition disabled:bg-gray-500" type="submit" disabled={loading}>
            {loading ? 'Saving ...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Account;