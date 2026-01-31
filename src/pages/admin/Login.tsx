import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import SeoHead from '@/components/SeoHead';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Identifiants incorrects ou accès refusé.");
      setLoading(false);
    } else {
      // Redirection vers le dashboard après succès
      navigate('/admin/dashboard');
    }
  };

  return (
    <>
        <SeoHead 
            title="Connexion Administration - Saphir"
            description="Accès sécurisé à l'espace administrateur."
        />
        <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden px-4">
        {/* Background  */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen opacity-30" />

        <div className="w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 md:p-12 relative z-10 shadow-2xl">
            <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Espace Administration</h1>
            <p className="text-gray-500 mt-2 text-sm">Connectez-vous pour gérer votre activité</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-4 py-3 bg-white/[0.07] border border-white/20 rounded-xl focus:outline-none focus:border-primary text-white transition-all"
                placeholder="admin@prestige.com"
                />
            </div>
            <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Mot de passe</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-4 py-3 bg-white/[0.07] border border-white/20 rounded-xl focus:outline-none focus:border-primary text-white transition-all"
                placeholder="••••••••"
                />
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-black bg-white hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mt-4"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Accéder <ArrowRight className="w-5 h-5" /></>}
            </button>
            </form>
        </div>
        </div>
    </>
  );
};

export default Login;