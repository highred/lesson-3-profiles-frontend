
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, supabaseInitializationError } from './supabaseClient';
import { Profile } from './types';
import Auth from './components/Auth';
import Layout from './components/Layout';
import SetupGuide from './components/SetupGuide';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    } else {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      if (session && supabase) {
        setLoading(true);
        const { user } = session;
        const { data, error } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single();

        if (!ignore) {
          if (error) {
            console.warn(error);
          } else if (data) {
            setProfile(data);
          }
        }
        setLoading(false);
      } else {
        setProfile(null);
      }
    }
    
    getProfile();

    return () => {
      ignore = true;
    }
  }, [session]);

  const renderContent = () => {
    if (supabaseInitializationError) {
      return (
        <div className="text-center p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-md max-w-2xl mx-auto">
            <p className="font-bold text-yellow-300">Demo Disabled</p>
            <p className="text-yellow-200">{supabaseInitializationError}</p>
        </div>
      );
    }
    if (!session) {
        return <Auth />;
    }
    if (loading) {
        return <div className="text-center">Loading user profile...</div>;
    }
    if (!profile) {
        return <div className="text-center text-yellow-300">Could not load user profile. It may not have been created yet. Please wait a moment and refresh.</div>
    }
    return <Layout key={session.user.id} session={session} profile={profile} />
  }

  return (
    <div className="min-h-screen bg-base-100 text-content font-sans antialiased">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Equipment Reservation System
          </h1>
        </header>

        <section className="mt-8 bg-base-200 p-4 sm:p-8 rounded-xl shadow-lg border border-base-300">
            {renderContent()}
        </section>
        
        {session && <SetupGuide />}

        <footer className="text-center mt-16 text-gray-500">
            <p>Built with React, TypeScript, Supabase, and Tailwind CSS.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;