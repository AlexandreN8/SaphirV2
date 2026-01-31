import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Mail, Trash2, Phone, Send, 
  CheckCheck, ChevronLeft, Inbox, Clock, UserCircle
} from 'lucide-react';
import { toast } from "sonner";

const AdminMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDetailView, setIsDetailView] = useState(false);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
      if (data && data.length > 0 && window.innerWidth >= 1024) setSelectedMsg(data[0]);
    } catch (err: any) {
      console.error("Erreur Fetch:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true }) 
        .eq('id', id);

      if (error) throw error;

      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
      if (selectedMsg?.id === id) setSelectedMsg({ ...selectedMsg, is_read: true });
      toast.success("Message marqué comme lu");
    } catch (err: any) {
      toast.error("Erreur de mise à jour");
    }
  };

  const deletePermanently = async (id: string) => {
    if (!window.confirm("Supprimer ce message définitivement ?")) return;
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const remaining = messages.filter(m => m.id !== id);
      setMessages(remaining);
      setSelectedMsg(remaining.length > 0 ? remaining[0] : null);
      setIsDetailView(false);
      toast.success("Message supprimé");
    } catch (err: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center text-primary font-black uppercase tracking-[0.3em]">Synchro Flux...</div>;

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-0 bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      
      {/* --- LISTE GAUCHE --- */}
      <div className={`${isDetailView ? 'hidden' : 'flex'} lg:flex w-full lg:w-[380px] flex-col border-r border-white/5 bg-black/40`}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <Inbox className="w-5 h-5 text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Inbox</h3>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2">
          {messages.map((msg) => {
            const isSelected = selectedMsg?.id === msg.id;
            const unread = !msg.is_read;
            return (
              <button
                key={msg.id}
                onClick={() => { setSelectedMsg(msg); setIsDetailView(true); }}
                className={`relative w-full p-5 rounded-3xl text-left transition-all duration-300 border
                  ${isSelected ? 'bg-white/[0.08] border-primary/40' : 'bg-[#0a0a0a] border-white/[0.05]'}
                  ${unread ? 'opacity-100 ring-1 ring-primary/20' : 'opacity-70 hover:opacity-100'} 
                `}
              >
                <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                {unread && (
                  <div className="absolute top-5 right-5 h-2 w-2 rounded-full bg-gradient-to-tr from-primary to-white shadow-[0_0_10px_#fff] animate-pulse" />
                )}
                <p className="text-[8px] font-black text-gray-500 uppercase mb-1">{new Date(msg.created_at).toLocaleDateString()}</p>
                <h4 className={`text-sm font-black uppercase truncate ${unread ? 'text-white' : 'text-gray-300'}`}>{msg.name}</h4>
                <p className="text-[10px] text-gray-500 truncate">{msg.subject || 'Saphir_Request'}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- LECTEUR DROITE --- */}
      <div className={`${isDetailView ? 'flex' : 'hidden'} lg:flex flex-1 flex-col bg-[#080808] relative`}>
        {selectedMsg ? (
          <>
            <div className="p-4 md:p-8 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-4 min-w-0">
                <button onClick={() => setIsDetailView(false)} className="lg:hidden p-1 text-white shrink-0"><ChevronLeft className="w-6 h-6" /></button>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white/5 border border-white/10 items-center justify-center text-primary shrink-0"><UserCircle className="w-7 h-7" /></div>
                  <div className="truncate text-left">
                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter truncate">{selectedMsg.name}</h3>
                    <p className="text-[9px] text-gray-600 font-bold uppercase truncate italic">Reçu le {new Date(selectedMsg.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-white/10 ml-2 shrink-0">
                <button 
                  onClick={() => handleMarkAsRead(selectedMsg.id)}
                  disabled={selectedMsg.is_read}
                  className={`p-2.5 rounded-lg transition-all ${selectedMsg.is_read ? 'text-gray-800 bg-white/5 opacity-40 cursor-not-allowed' : 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black'}`}
                  title="Marquer lu"
                >
                  <CheckCheck className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => deletePermanently(selectedMsg.id)}
                  className="p-2.5 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 custom-scrollbar">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <ContactPill icon={Mail} label="Email" value={selectedMsg.email} link={`mailto:${selectedMsg.email}`} />
                  {selectedMsg.phone && <ContactPill icon={Phone} label="Mobile" value={selectedMsg.phone} link={`tel:${selectedMsg.phone}`} />}
               </div>
               <div className="relative bg-[#0d0d0d] border border-white/[0.05] p-6 md:p-10 rounded-[2rem] shadow-2xl text-left">
                  <div className="flex items-center gap-3 mb-6"><Clock className="w-4 h-4 text-primary" /><span className="text-[10px] font-black uppercase text-gray-500">Corps du message</span></div>
                  <div className="text-gray-200 text-lg md:text-xl leading-relaxed italic whitespace-pre-wrap font-sans">"{selectedMsg.message}"</div>
               </div>
            </div>

            <div className="p-6 md:p-10 border-t border-white/5">
              <a href={`mailto:${selectedMsg.email}?subject=RE: ${selectedMsg.subject || 'Saphir Detailing'}`} className="w-full flex items-center justify-center gap-4 py-6 bg-white text-black font-black rounded-3xl hover:bg-primary transition-all uppercase text-[11px] tracking-widest shadow-glow">Ouvrir la réponse mail <Send className="w-4 h-4" /></a>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-800 font-black text-[10px] uppercase tracking-[1em]">En attente de transmission</div>
        )}
      </div>
    </div>
  );
};

const ContactPill = ({ icon: Icon, label, value, link }: any) => (
  <a href={link} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group overflow-hidden">
    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-gray-500 group-hover:text-primary shrink-0 transition-colors"><Icon className="w-5 h-5" /></div>
    <div className="truncate text-left"><p className="text-[8px] font-black uppercase text-gray-600 tracking-widest mb-0.5">{label}</p><p className="text-xs font-bold text-gray-300 truncate">{value}</p></div>
  </a>
);

export default AdminMessages;