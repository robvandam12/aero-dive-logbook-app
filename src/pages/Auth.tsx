
import { supabase } from '@/integrations/supabase/client';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useEffect } from 'react';

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 ocean-pattern">
      <div className="w-full max-w-md p-8 space-y-8 glass rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">Aerocam</h1>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={['google', 'github']}
          redirectTo={`${window.location.origin}/dashboard`}
        />
      </div>
    </div>
  );
};

export default Auth;
