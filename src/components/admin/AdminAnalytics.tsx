import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, Activity, Users, MousePointer2, Globe, Wallet, AlertCircle, Clock
} from 'lucide-react';

const AdminAnalytics = () => {
  const [activeView, setActiveView] = useState<'finance' | 'traffic'>('finance');
  
  // States Data
  const [financeData, setFinanceData] = useState<any[]>([]);
  const [packData, setPackData] = useState<any[]>([]);
  
  // Traffic Data
  const [trafficData, setTrafficData] = useState<any>({ 
    pages: [], 
    devices: [],
    dailyVisits: [], 
    hourlyTraffic: [] 
  });
  
  const [kpi, setKpi] = useState({ 
    forecastRevenue: 0, 
    actualRevenue: 0, 
    pendingRevenue: 0,  
    visitors: 0,
    pageViews: 0,
    conversionRate: 0 
  });
  
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const processData = async () => {
      // 1. DATA FINANCE
      const { data: resas } = await supabase
        .from('reservations')
        .select('total_price, start_at, service_name, status, payment_status')
        .neq('status', 'cancelled')
        .order('start_at', { ascending: true });

      // 2. DATA TRAFFIC
      const { data: logs } = await supabase
        .from('traffic_logs')
        .select('*');

      if (resas && logs) {
        
        // --- TRAITEMENT FINANCE  ---
        const monthlyStats: { [key: number]: { forecast: number, actual: number } } = {};
        const packStats: { [key: string]: number } = {};
        let totalForecast = 0;
        let totalActual = 0;

        for (let i = 0; i < 12; i++) monthlyStats[i] = { forecast: 0, actual: 0 };

        resas.forEach(r => {
          const date = new Date(r.start_at);
          if (date.getFullYear() === currentYear && r.status === 'confirmed') {
            const month = date.getMonth();
            const price = Number(r.total_price) || 0;
            monthlyStats[month].forecast += price;
            totalForecast += price;
            if (r.payment_status === 'paid') {
              monthlyStats[month].actual += price;
              totalActual += price;
            }
            packStats[r.service_name] = (packStats[r.service_name] || 0) + 1;
          }
        });

        const chartData = Object.keys(monthlyStats).map(key => {
          const monthIndex = Number(key);
          const date = new Date(currentYear, monthIndex, 1);
          return {
            name: date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(),
            previsionnel: monthlyStats[monthIndex].forecast,
            encaisse: monthlyStats[monthIndex].actual,
          };
        });

        const barData = Object.keys(packStats)
          .map(key => ({ name: key, value: packStats[key] }))
          .sort((a, b) => b.value - a.value);

        // --- TRAITEMENT TRAFFIC AVANCÉ ---
        
        // 1. Visiteurs Uniques & Total
        const uniqueVisitors = new Set(logs.map(l => l.session_id)).size;
        const totalPageViews = logs.length;

        // 2. Visites par Jour (Daily Visits) - 7 derniers jours
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const dailyCounts = last7Days.map(dateStr => {
            const count = logs.filter(l => l.created_at.startsWith(dateStr)).length;
            return {
                date: new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
                visits: count
            };
        });

        // 3. Trafic par Heure
        const hourCounts = new Array(24).fill(0);
        logs.forEach(l => {
            const hour = new Date(l.created_at).getHours();
            hourCounts[hour]++;
        });
        const hourlyData = hourCounts.map((count, hour) => ({
            hour: `${hour}h`,
            visits: count
        }));

        // 4. Top Pages
        const pageCounts: { [key: string]: number } = {};
        logs.forEach(l => { pageCounts[l.path] = (pageCounts[l.path] || 0) + 1; });
        const topPages = Object.entries(pageCounts)
          .map(([path, views]) => ({ name: path === '/' ? 'Accueil' : path.replace('/', ''), path, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        // 5. Devices
        const deviceCounts = { Mobile: 0, Desktop: 0 };
        logs.forEach(l => { 
          if(l.device_type === 'Mobile') deviceCounts.Mobile++;
          else deviceCounts.Desktop++;
        });
        const deviceChart = [
          { name: 'Mobile', value: deviceCounts.Mobile },
          { name: 'Desktop', value: deviceCounts.Desktop }
        ];

        // Conversion
        const confirmedResasCount = resas.filter(r => r.status === 'confirmed').length;
        const conversion = uniqueVisitors > 0 ? (confirmedResasCount / uniqueVisitors) * 100 : 0;

        setFinanceData(chartData);
        setPackData(barData);
        setTrafficData({ pages: topPages, devices: deviceChart, dailyVisits: dailyCounts, hourlyTraffic: hourlyData });
        
        setKpi({
          forecastRevenue: totalForecast,
          actualRevenue: totalActual,
          pendingRevenue: totalForecast - totalActual,
          visitors: uniqueVisitors,
          pageViews: totalPageViews,
          conversionRate: conversion
        });
      }
      setLoading(false);
    };

    processData();
  }, [currentYear]);

  if (loading) return <div className="h-96 flex items-center justify-center text-primary font-bold uppercase tracking-widest animate-pulse">Chargement des données...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* NAVIGATION */}
      <div className="flex bg-[#0f0f0f] border border-white/5 rounded-2xl p-1 w-fit">
        <button onClick={() => setActiveView('finance')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'finance' ? 'bg-primary text-black shadow-glow' : 'text-gray-500 hover:text-white'}`}>Finance</button>
        <button onClick={() => setActiveView('traffic')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'traffic' ? 'bg-white text-black shadow-glow' : 'text-gray-500 hover:text-white'}`}>Trafic (Live)</button>
      </div>

      {/* VUE FINANCE */}
      {activeView === 'finance' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard icon={Wallet} label="Total Encaissé" value={`${kpi.actualRevenue}€`} sub="Sur le compte" color="text-emerald-500" borderColor="border-emerald-500/20" bg="bg-emerald-500/5" />
            <KPICard icon={Activity} label="Total Prévisionnel" value={`${kpi.forecastRevenue}€`} sub="Devis confirmés" color="text-primary" />
            <KPICard icon={AlertCircle} label="Reste à percevoir" value={`${kpi.pendingRevenue}€`} sub="En attente" color="text-white" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#0f0f0f] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20"><TrendingUp className="w-5 h-5 text-primary" /></div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">Flux de Trésorerie</h3>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financeData}>
                    <defs>
                      <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d4af37" stopOpacity={0.2}/><stop offset="95%" stopColor="#d4af37" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="name" stroke="#444" tick={{fill: '#666', fontSize: 10}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#444" tick={{fill: '#666', fontSize: 10}} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #222', borderRadius: '12px' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="previsionnel" stroke="#d4af37" strokeWidth={2} fill="url(#colorPrev)" strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="encaisse" stroke="#10b981" strokeWidth={4} fill="url(#colorActual)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10"><Users className="w-5 h-5 text-gray-400" /></div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">Top Services</h3>
              </div>
              <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={packData} layout="vertical" margin={{ left: 0, right: 20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={90} tick={{fill: '#888', fontSize: 9, fontWeight: 700}} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} />
                      <Bar dataKey="value" barSize={16} radius={[0, 4, 4, 0]}>
                        {packData.map((entry, index) => (<Cell key={`cell-${index}`} fill={index === 0 ? '#d4af37' : '#333'} />))}
                      </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VUE TRAFFIC RÉELLE */}
      {activeView === 'traffic' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard icon={Users} label="Visiteurs Uniques" value={kpi.visitors} sub="Depuis le début" highlight />
            <KPICard icon={MousePointer2} label="Taux de conversion" value={`${kpi.conversionRate.toFixed(1)}%`} sub="Visite → Réservation" />
            <KPICard icon={Activity} label="Pages Vues" value={kpi.pageViews} sub="Total chargements" />
            <KPICard icon={Globe} label="Pages / Visiteur" value={kpi.visitors > 0 ? (kpi.pageViews / kpi.visitors).toFixed(1) : '0'} sub="Moyenne engagement" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* GRAPHIQUE VISITES 7 DERNIERS JOURS  */}
            <div className="lg:col-span-2 bg-[#0f0f0f] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20"><Activity className="w-5 h-5 text-blue-500" /></div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">Activité (7 jours)</h3>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trafficData.dailyVisits}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="date" stroke="#444" tick={{fill: '#666', fontSize: 10}} tickLine={false} axisLine={false} />
                            <YAxis stroke="#444" tick={{fill: '#666', fontSize: 10}} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #222' }} />
                            <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill:'#050505', strokeWidth: 2}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* HEURES DE POINTE  */}
            <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20"><Clock className="w-5 h-5 text-purple-500" /></div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">Heures de pointe</h3>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trafficData.hourlyTraffic}>
                            <XAxis dataKey="hour" stroke="#444" tick={{fill: '#666', fontSize: 8}} tickLine={false} axisLine={false} interval={2} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                            <Bar dataKey="visits" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* TOP PAGES TABLE */}
            <div className="lg:col-span-2 bg-[#0f0f0f] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">Pages les plus vues</h3>
              </div>
              <div className="space-y-4">
                {trafficData.pages.length > 0 ? trafficData.pages.map((page: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-gray-600">0{i+1}</span>
                      <div>
                        <p className="text-sm font-bold text-white capitalize">{page.name}</p>
                        <p className="text-[10px] text-gray-600 font-mono">{page.path}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{page.views}</p>
                      <div className="h-1 w-16 bg-white/10 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-white" style={{ width: `${(page.views / trafficData.pages[0].views) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                )) : <p className="text-gray-500 italic text-sm">En attente de trafic...</p>}
              </div>
            </div>

            {/* DEVICES */}
            <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">Appareils</h3>
              </div>
              <div className="flex items-center justify-center h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trafficData.devices} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#666" fontSize={10} width={60} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                    <Bar dataKey="value" barSize={30} radius={[0, 10, 10, 0]}>
                       <Cell fill="#fff" />
                       <Cell fill="#333" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KPICard = ({ icon: Icon, label, value, sub, color, borderColor, bg, highlight }: any) => (
  <div className={`p-8 rounded-[2.5rem] border relative overflow-hidden group ${bg || 'bg-[#0f0f0f]'} ${borderColor || 'border-white/5'} ${highlight ? 'ring-1 ring-primary/50' : ''}`}>
    {highlight && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />}
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className={`p-3 rounded-2xl border transition-colors bg-white/5 border-white/10 ${color ? '' : 'text-gray-400'}`}>
        <Icon className={`w-6 h-6 ${color || ''}`} />
      </div>
    </div>
    <div className="relative z-10">
      <p className={`text-4xl font-black tracking-tighter ${color || 'text-white'}`}>{value}</p>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-2">{label}</p>
      <p className="text-[9px] text-gray-600 mt-1 font-medium">{sub}</p>
    </div>
  </div>
);

export default AdminAnalytics;