import AdminMessages from '@/components/admin/AdminMessages';
import AdminPlanning from '@/components/admin/AdminPlanning';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, LayoutDashboard, MessageSquare, Calendar, 
  BarChart3, Image as Clock, 
  TrendingUp, Wallet, ArrowUpRight, Home,
  ChevronLeft, ChevronRight, Menu 
} from 'lucide-react';
import SeoHead from '@/components/SeoHead';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('accueil');
  
  // --- STATES UI ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // --- STATES DATA ---
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [nextChantierTime, setNextChantierTime] = useState<string>("");
  const [stats, setStats] = useState({ 
    pending: 0, 
    unreadMessages: 0, 
    totalMessages: 0,
    confirmedCount: 0,
    totalRevenue: 0, 
    actualRevenue: 0 
  });

  const fetchDashboardData = async () => {
    const { data: msgData } = await supabase.from('contact_messages').select('is_read').eq('is_deleted', false);
    const unread = msgData?.filter(m => !m.is_read).length || 0;

    const { data: resas } = await supabase.from('reservations').select('status, total_price, start_at, client_name, service_name, payment_status').neq('status', 'cancelled');

    if (resas) {
      const now = new Date();
      const pending = resas.filter(r => r.status === 'pending');
      const confirmed = resas.filter(r => r.status === 'confirmed');
      const totalRev = confirmed.reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0);
      const actualRev = confirmed.filter(r => r.payment_status === 'paid').reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0);
      const sortedUpcoming = resas.filter(r => r.status === 'confirmed' && new Date(r.start_at) >= now).sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());

      if (sortedUpcoming.length > 0) {
        const diff = new Date(sortedUpcoming[0].start_at).getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        setNextChantierTime(days > 0 ? `Dans ${days} jour${days > 1 ? 's' : ''}` : hours > 0 ? `Dans ${hours} heure${hours > 1 ? 's' : ''}` : "Imminent");
      }

      setStats({
        pending: pending.length,
        unreadMessages: unread,
        totalMessages: msgData?.length || 0,
        confirmedCount: confirmed.length,
        totalRevenue: totalRev,
        actualRevenue: actualRev
      });
      setUpcoming(sortedUpcoming.slice(0, 5));
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'accueil', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: stats.unreadMessages },
    { id: 'planning', label: 'Planning', icon: Calendar, badge: stats.pending },
    { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
  ];

  return (
    <>
        <SeoHead title="Tableau de Bord - Saphir Admin" description="Gestion des réservations." />  
        
        <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans overflow-hidden">
        
        {/* SIDEBAR */}
        <aside 
            className={`
                fixed inset-y-0 left-0 z-50 bg-[#0f0f0f] border-r border-white/5 transform transition-all duration-300 ease-in-out
                md:relative md:translate-x-0 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isCollapsed ? 'md:w-20' : 'md:w-72'} 
                w-72 flex flex-col justify-between
            `}
        >
            <div className="flex flex-col h-full p-4">
                
                {/* --- HEADER SIDEBAR --- */}
                <div className={`flex items-center mb-10 pb-6 border-b border-white/5 ${isCollapsed ? 'flex-col gap-4 justify-center' : 'justify-between'}`}>
                    
                    {/* Logo */}
                    <div 
                        className={`flex items-center gap-3 cursor-pointer ${isCollapsed ? 'justify-center' : ''}`} 
                        onClick={() => navigate('/')}
                        title="Aller sur le site public"
                    >
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-black text-lg shrink-0 hover:scale-105 transition-transform">
                            <Home className="w-5 h-5" />
                        </div>
                        {!isCollapsed && (
                            <span className="font-black tracking-tighter text-xl uppercase animate-in fade-in duration-300">Saphir</span>
                        )}
                    </div>

                    {/* BOUTON TOGGLE */}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)} 
                        className="hidden md:flex p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title={isCollapsed ? "Agrandir le menu" : "Réduire le menu"}
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                {/* MENU ITEMS */}
                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <button 
                            key={item.id} 
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} 
                            className={`
                                w-full flex items-center px-3 py-3.5 rounded-2xl transition-all group relative
                                ${activeTab === item.id ? 'bg-primary text-black font-black shadow-glow' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                ${isCollapsed ? 'justify-center' : 'justify-between'}
                            `}
                            title={isCollapsed ? item.label : ''}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-5 h-5 ${isCollapsed ? '' : ''}`} />
                                {!isCollapsed && (
                                    <span className="text-[10px] font-black uppercase tracking-widest animate-in fade-in">{item.label}</span>
                                )}
                            </div>
                            
                            {/* BADGE */}
                            {item.badge > 0 && (
                                isCollapsed ? (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-[#0f0f0f]" />
                                ) : (
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${activeTab === item.id ? 'bg-black text-white' : 'bg-primary text-black'}`}>
                                        {item.badge}
                                    </span>
                                )
                            )}
                        </button>
                    ))}
                </nav>

                {/* FOOTER ACTIONS (DÉCONNEXION SEULE) */}
                <div className="mt-auto pt-4 border-t border-white/5">
                    <button 
                        onClick={handleLogout} 
                        className={`
                            flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 font-bold text-[10px] uppercase tracking-[0.2em] transition-all rounded-xl w-full
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                        title="Déconnexion"
                    >
                        <LogOut className="w-5 h-5 shrink-0" /> 
                        {!isCollapsed && <span className="animate-in fade-in">Déconnexion</span>}
                    </button>
                </div>
            </div>
        </aside>

        {/* OVERLAY MOBILE */}
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-10 overflow-y-auto h-screen w-full relative custom-scrollbar">
            
            {/* HEADER MOBILE (VISIBLE UNIQUEMENT SI SIDEBAR FERMÉE) */}
            <div className="md:hidden mb-8 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-30 py-4 border-b border-white/5">
                 <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-black">S</span>
                    <span className="font-black text-lg uppercase tracking-tighter">Admin</span>
                 </div>
                 <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                    <Menu className="w-6 h-6" />
                 </button>
            </div>

            {/* --- CONTENU DES ONGLETS --- */}
            
            {activeTab === 'accueil' && (
            <div className="space-y-8 animate-in fade-in duration-700 pb-20">
                
                {/* TOP STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20"><Calendar className="w-6 h-6 text-primary" /></div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400/80">Flux Planning</h3>
                    </div>
                    <div className="flex items-end justify-between">
                    <div>
                        <p className="text-5xl font-black text-primary leading-none tracking-tighter">{stats.pending}</p>
                        <p className="text-[10px] font-bold uppercase text-gray-500 mt-4 tracking-[0.15em]">À confirmer</p>
                    </div>
                    <div className="text-right">
                        <p className="text-5xl font-black text-white leading-none tracking-tighter">{stats.confirmedCount}</p>
                        <p className="text-[10px] font-bold uppercase text-gray-500 mt-4 tracking-[0.15em]">Confirmés</p>
                    </div>
                    </div>
                </div>

                <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10"><MessageSquare className="w-6 h-6 text-gray-400" /></div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400/80">Centre Messages</h3>
                    </div>
                    <div className="flex items-end justify-between">
                    <div>
                        <p className="text-5xl font-black text-primary leading-none tracking-tighter">{stats.unreadMessages}</p>
                        <p className="text-[10px] font-bold uppercase text-gray-500 mt-4 tracking-[0.15em]">Nouveaux</p>
                    </div>
                    <div className="text-right">
                        <p className="text-5xl font-black text-white leading-none tracking-tighter">{stats.totalMessages}</p>
                        <p className="text-[10px] font-bold uppercase text-gray-500 mt-4 tracking-[0.15em]">Traités</p>
                    </div>
                    </div>
                </div>

                <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Clock className="w-6 h-6 text-emerald-500" /></div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400/80">Prochain départ</h3>
                    </div>
                    <div>
                    <p className="text-3xl font-black text-white uppercase tracking-tight leading-none truncate">{nextChantierTime || "Libre"}</p>
                    <p className="text-[10px] font-bold uppercase text-gray-500 mt-6 tracking-[0.15em] italic">Statut opérationnel</p>
                    </div>
                </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* LISTE PROCHAINS CHANTIERS */}
                <div className="xl:col-span-2 bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3"><TrendingUp className="w-5 h-5 text-primary" /> Planning imminent</h3>
                    <button onClick={() => setActiveTab('planning')} className="text-[10px] font-black uppercase text-primary hover:underline tracking-widest">Voir tout le planning</button>
                    </div>
                    <div className="space-y-4">
                    {upcoming.length > 0 ? upcoming.map((resa, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/5 rounded-[1.5rem] hover:bg-white/[0.04] transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="text-center bg-black px-4 py-3 rounded-2xl border border-white/10 min-w-[80px]">
                            <p className="text-[9px] font-black text-primary uppercase mb-1">{new Date(resa.start_at).toLocaleDateString('fr-FR', { weekday: 'short' })}</p>
                            <p className="text-2xl font-black leading-none text-white">{new Date(resa.start_at).getDate()}</p>
                            </div>
                            <div className="min-w-0">
                            <p className="font-black text-white uppercase text-sm group-hover:text-primary transition-colors truncate">{resa.client_name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">{resa.service_name}</p>
                            </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                            <p className="text-sm font-black text-white">{new Date(resa.start_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className={`text-[10px] font-black px-2 py-0.5 rounded-md inline-block uppercase mt-1 ${resa.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/10 text-gray-500'}`}>
                            {resa.total_price}€ {resa.payment_status === 'paid' && '✓'}
                            </p>
                        </div>
                        </div>
                    )) : <p className="text-center text-gray-600 py-10 italic">Aucun chantier prévu prochainement.</p>}
                    </div>
                </div>

                {/* PERFORMANCES FINANCIÈRES */}
                <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 space-y-8">
                    <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Performance</h3>
                    <Wallet className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="space-y-6">
                    <div>
                        <p className="text-4xl font-black text-white tracking-tighter leading-none">{stats.actualRevenue}€</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase mt-2 tracking-widest">CA Réalisé (Payé)</p>
                    </div>
                    <div className="h-px bg-white/10 w-full" />
                    <div>
                        <div className="flex items-center justify-between mb-2">
                        <p className="text-2xl font-black text-primary tracking-tighter leading-none">{stats.totalRevenue}€</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">CA Prévisionnel</p>
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden mb-2 shadow-inner">
                        <div className="h-full bg-primary shadow-glow transition-all duration-1000" style={{ width: `${stats.totalRevenue > 0 ? Math.min((stats.actualRevenue / stats.totalRevenue) * 100, 100) : 0}%` }}></div>
                        </div>
                        <p className="text-[9px] font-black text-primary uppercase text-right tracking-[0.2em]">Recouvrement : {stats.totalRevenue > 0 ? Math.round((stats.actualRevenue / stats.totalRevenue) * 100) : 0}%</p>
                    </div>
                    </div>
                </div>

                </div>
            </div>
            )}

            {activeTab === 'messages' && <AdminMessages />}
            {activeTab === 'planning' && <AdminPlanning />}
            {activeTab === 'analytics' && <AdminAnalytics />}
        </main>
        </div>
    </>
  );
};

export default Dashboard;