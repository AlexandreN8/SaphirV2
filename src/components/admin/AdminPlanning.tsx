import { useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Clock, CheckCircle, X, Mail, Phone, 
  Wrench, DollarSign,
  ChevronLeft, ChevronRight, Trash2, Ban, CalendarDays, Save, Calendar as CalendarIcon
} from 'lucide-react';
import { toast } from "sonner";

// Heures pour l'affichage de la grille principale
const GRID_HOURS = [9, 9.5, 10, 10.5, 11, 11.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5];

const AdminPlanning = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [selectedResa, setSelectedResa] = useState<any | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'pending' | 'upcoming'>('pending');
  
  // --- STATES POUR LE MODAL DE REPROGRAMMATION ---
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleMonth, setRescheduleMonth] = useState(new Date());
  const [rescheduleDate, setRescheduleDate] = useState<Date | null>(null);
  const [rescheduleTime, setRescheduleTime] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    const { data } = await supabase.from('reservations').select('*').neq('status', 'cancelled');
    if (data) setReservations(data);
    setLoading(false);
  };

  useEffect(() => { fetchReservations(); }, []);


  // Créneaux horaires sélectionnables (9h-11h30 et 14h-17h30)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 9; h < 12; h += 0.5) slots.push(`${Math.floor(h).toString().padStart(2, '0')}:${h % 1 === 0 ? '00' : '30'}`);
    for (let h = 14; h < 18; h += 0.5) slots.push(`${Math.floor(h).toString().padStart(2, '0')}:${h % 1 === 0 ? '00' : '30'}`);
    return slots;
  }, []);

  // Calcul de la date de fin (Weekend & Nuit exclus)
  const calculateEndDate = (startDate: Date, durationHours: number) => {
    let end = new Date(startDate);
    let remaining = durationHours;
    
    while (remaining > 0) {
      end.setMinutes(end.getMinutes() + 30);
      const h = end.getHours() + end.getMinutes() / 60;
      const day = end.getDay();

      // Week-end
      if (day === 6 || day === 0) {
        end.setDate(end.getDate() + (day === 6 ? 2 : 1));
        end.setHours(9, 0, 0, 0);
        continue;
      }
      // Pause Midi (12h-14h)
      if (h > 12 && h < 14) {
        end.setHours(14, 0, 0, 0);
        continue;
      }
      // Soir (>18h)
      if (h > 18 || (h === 18 && end.getMinutes() > 0)) {
        end.setDate(end.getDate() + 1);
        end.setHours(9, 0, 0, 0);
        // Check si le lendemain est un weekend
        const nextDay = end.getDay();
        if (nextDay === 6 || nextDay === 0) {
            end.setDate(end.getDate() + (nextDay === 6 ? 2 : 1));
        }
        continue;
      }
      remaining -= 0.5;
    }
    return end;
  };

  // Vérifie si un créneau [start, end] est libre (en ignorant la résa qu'on est en train de modifier)
  const isRangeAvailable = (start: Date, end: Date, ignoreResaId: string) => {
    for (const res of reservations) {
      if (res.id === ignoreResaId) continue; // On s'ignore soi-même
      if (res.status === 'cancelled') continue;

      const resStart = new Date(res.start_at);
      const resEnd = new Date(res.end_at);
      
      if (start < resEnd && end > resStart) return false;
    }
    return true;
  };

  // Vérifie si un jour a au moins un créneau libre
  const isDayAvailable = (date: Date) => {
    if (!selectedResa) return false;
    const today = new Date(); today.setHours(0,0,0,0);
    
    // Pas de réservation le passé, ni le weekend
    if (date < today || date.getDay() === 0 || date.getDay() === 6) return false;

    // On teste tous les slots de la journée
    const slotsToCheck = [];
    for (let h = 9; h < 12; h += 0.5) slotsToCheck.push(h);
    for (let h = 14; h < 18; h += 0.5) slotsToCheck.push(h);

    return slotsToCheck.some(h => {
      const simStart = new Date(date);
      simStart.setHours(Math.floor(h), (h % 1) * 60, 0, 0);
      const simEnd = calculateEndDate(simStart, selectedResa.duration_hours);
      return isRangeAvailable(simStart, simEnd, selectedResa.id);
    });
  };

  // --- LOGIQUE D'AFFICHAGE DU PLANNING PRINCIPAL ---
  const weekDays = useMemo(() => {
    const start = new Date(viewDate);
    if (isMobile) return [new Date(start)];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [viewDate, isMobile]);

  const pendingList = useMemo(() => 
    reservations.filter(r => r.status === 'pending').sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
  , [reservations]);

  const upcomingList = useMemo(() => 
    reservations.filter(r => r.status === 'confirmed' && new Date(r.end_at) >= new Date()).sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
  , [reservations]);

  const getResaForSlot = (day: Date, hour: number) => {
    const slotTime = new Date(day);
    slotTime.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
    return reservations.find(res => {
      const start = new Date(res.start_at);
      const end = new Date(res.end_at);
      return slotTime >= start && slotTime < end;
    });
  };

  const isVisualStart = (day: Date, hour: number, res: any) => {
    const resStart = new Date(res.start_at);
    if (resStart.getDate() === day.getDate() && resStart.getHours() === Math.floor(hour) && resStart.getMinutes() === (hour % 1) * 60) return true;
    if ((hour === 9 || hour === 14) && resStart < day) return true; 
    if ((hour === 9 || hour === 14) && resStart.getTime() < new Date(day).setHours(hour, 0, 0, 0)) return true;
    return false;
  };

  const isVisualEnd = (day: Date, hour: number, res: any) => {
    const resEnd = new Date(res.end_at);
    const slotTime = new Date(day);
    slotTime.setHours(Math.floor(hour), (hour % 1) * 60 + 30, 0, 0); 
    if (resEnd.getTime() === slotTime.getTime()) return true;
    if (hour === 11.5 || hour === 17.5) return true;
    return false;
  };

  // --- ACTIONS ---
  const updateStatus = async (id: string, newStatus: string) => {
    const currentResa = reservations.find(r => r.id === id);
    if (!currentResa) return;
    const oldStatus = currentResa.status;

    const { error: dbError } = await supabase.from('reservations').update({ status: newStatus }).eq('id', id);
    
    if (!dbError) {
      if (newStatus === 'cancelled') {
        setReservations(prev => prev.filter(r => r.id !== id)); 
        setSelectedResa(null);
      } else {
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        if (selectedResa?.id === id) setSelectedResa({ ...selectedResa, status: newStatus });
      }
      toast.success(newStatus === 'confirmed' ? "Confirmé & Mail envoyé" : "Annulé & Mail envoyé");

      supabase.functions.invoke('manage-reservation', {
        body: { type: 'update_status', record: currentResa, old_status: oldStatus, new_status: newStatus }
      });
    } else {
        toast.error("Erreur DB");
    }
  };

// --- SAVE RESCHEDULE (Avec Auto-Confirmation) ---
  const handleRescheduleSubmit = async () => {
    if (!selectedResa || !rescheduleDate || !rescheduleTime) return;

    const oldDate = selectedResa.start_at;
    
    // Calcul date début
    const newStart = new Date(rescheduleDate);
    const [h, m] = rescheduleTime.split(':').map(Number);
    newStart.setHours(h, m, 0, 0);

    // Calcul date fin automatique
    const newEnd = calculateEndDate(newStart, selectedResa.duration_hours);

    // --- MISE A JOUR DB ---
    const { error } = await supabase.from('reservations').update({
        start_at: newStart.toISOString(),
        end_at: newEnd.toISOString(),
        status: 'confirmed' // <--- On force le statut confirmé
    }).eq('id', selectedResa.id);

    if (!error) {
        toast.success("RDV déplacé et confirmé !");
        
        // Mise à jour locale 
        const updatedResa = { 
            ...selectedResa, 
            start_at: newStart.toISOString(), 
            end_at: newEnd.toISOString(),
            status: 'confirmed' 
        };

        setReservations(prev => prev.map(r => r.id === selectedResa.id ? updatedResa : r));
        setSelectedResa(updatedResa);
        setShowRescheduleModal(false);

        // Envoi Mail 
        supabase.functions.invoke('manage-reservation', {
            body: { 
                type: 'reschedule', 
                record: updatedResa, 
                old_date: oldDate,
                new_date: newStart.toISOString()
            }
        });
    } else {
        toast.error("Erreur lors du déplacement");
    }
  };

  const deleteReservation = async (id: string) => {
    if (!confirm("Voulez-vous supprimer DÉFINITIVEMENT cette demande ?")) return;
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    if (!error) {
      setReservations(prev => prev.filter(r => r.id !== id));
      setSelectedResa(null);
      toast.success("Demande supprimée");
    }
  };

  const togglePayment = async (id: string, current: string) => {
    const newStatus = current === 'paid' ? 'unpaid' : 'paid';
    const { error } = await supabase.from('reservations').update({ payment_status: newStatus }).eq('id', id);
    if (!error) {
      setReservations(prev => prev.map(r => r.id === id ? { ...r, payment_status: newStatus } : r));
      if (selectedResa?.id === id) setSelectedResa({ ...selectedResa, payment_status: newStatus });
      toast.success(newStatus === 'paid' ? "Encaissé" : "Annulé");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-primary font-black uppercase animate-pulse">Chargement...</div>;

  return (
    <div className="h-screen bg-[#050505] text-white p-2 md:p-6 font-sans flex flex-col lg:flex-row gap-6 overflow-hidden">
      
      {/* SIDEBAR LIST */}
      <div className="hidden lg:flex flex-col w-80 shrink-0 h-full bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-4 shadow-2xl">
        <div className="flex bg-black/40 p-1 rounded-xl mb-4 shrink-0">
          <button onClick={() => setSidebarTab('pending')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-lg transition-all ${sidebarTab === 'pending' ? 'bg-primary text-black' : 'text-gray-500 hover:text-white'}`}>Attentes ({pendingList.length})</button>
          <button onClick={() => setSidebarTab('upcoming')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-lg transition-all ${sidebarTab === 'upcoming' ? 'bg-emerald-500 text-black' : 'text-gray-500 hover:text-white'}`}>Futurs</button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
          {(sidebarTab === 'pending' ? pendingList : upcomingList).map(r => (
            <div key={r.id} onClick={() => { setViewDate(new Date(r.start_at)); setSelectedResa(r); }} className={`p-4 rounded-2xl border cursor-pointer transition-all ${sidebarTab === 'pending' ? 'bg-primary/5 border-primary/20 hover:border-primary' : 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500'}`}>
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[9px] font-black uppercase ${sidebarTab === 'pending' ? 'text-primary' : 'text-emerald-500'}`}>{new Date(r.start_at).toLocaleDateString(undefined, {day:'numeric', month:'short'})}</span>
                {r.payment_status === 'paid' && <DollarSign className="w-3 h-3 text-emerald-500" />}
              </div>
              <p className="font-bold text-sm truncate">{r.client_name}</p>
              <p className="text-[10px] text-gray-500 truncate">{r.service_name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PLANNING PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full gap-4">
        <div className="flex items-center justify-between bg-[#0f0f0f] border border-white/10 p-4 rounded-[2rem] shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
              <button onClick={() => { const d = new Date(viewDate); d.setDate(d.getDate() - 7); setViewDate(d); }} className="p-2 hover:bg-white/10 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => { const d = new Date(viewDate); d.setDate(d.getDate() + 7); setViewDate(d); }} className="p-2 hover:bg-white/10 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter hidden sm:block">{weekDays[0].toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
          </div>
          <button onClick={() => setViewDate(new Date())} className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest">Aujourd'hui</button>
        </div>

        <div className="flex-1 bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-inner relative">
          <div className="flex border-b border-white/10 bg-black/20 shrink-0">
            <div className="w-16 border-r border-white/10 flex items-center justify-center bg-black/40"><Clock className="w-5 h-5 text-gray-600" /></div>
            {weekDays.map((day, i) => (
              <div key={i} className={`flex-1 py-4 text-center border-r border-white/10 last:border-0 ${day.toDateString() === new Date().toDateString() ? 'bg-primary/5' : ''}`}>
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</p>
                <p className={`text-2xl font-black ${day.toDateString() === new Date().toDateString() ? 'text-primary' : 'text-white'}`}>{day.getDate()}</p>
              </div>
            ))}
          </div>

          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
            {GRID_HOURS.map((hour, index) => {
              const isGap = index > 0 && hour - GRID_HOURS[index - 1] > 0.5;
              return (
                <div key={hour} className={`flex min-h-[3.5rem] border-b border-white/[0.03] ${isGap ? 'mt-4 border-t border-white/10' : ''}`}> 
                  <div className="w-16 border-r border-white/10 flex items-start justify-center pt-2 text-[10px] font-bold text-gray-600 bg-black/40 shrink-0">
                    {hour % 1 === 0 ? `${hour}:00` : ''}
                  </div>
                  {weekDays.map((day, i) => {
                    const res = getResaForSlot(day, hour);
                    if (!res) return <div key={i} className="flex-1 border-r border-white/[0.03] last:border-0 hover:bg-white/[0.01]" />;
                    
                    const isStart = isVisualStart(day, hour, res);
                    const isEnd = isVisualEnd(day, hour, res);
                    const isConfirmed = res.status === 'confirmed';

                    return (
                      <div key={i} onClick={() => setSelectedResa(res)} className={`flex-1 border-r border-white/10 last:border-0 cursor-pointer relative group min-w-0 overflow-hidden ${isConfirmed ? 'bg-[#121212] hover:bg-[#1a1a1a]' : 'bg-primary/10 hover:bg-primary/20'}`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isConfirmed ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-primary shadow-[0_0_10px_#d4af37]'} ${isStart ? 'rounded-tl-full' : ''} ${isEnd ? 'rounded-bl-full' : ''}`} />
                        {isStart && (
                          <div className="pl-3 pt-2 pr-1 relative z-10 animate-in fade-in slide-in-from-left-2 duration-300 w-full">
                            <div className="flex items-center gap-2 mb-0.5">
                               <p className={`text-[9px] font-black uppercase tracking-widest truncate ${isConfirmed ? 'text-emerald-500' : 'text-primary'}`}>{res.service_name}</p>
                               {res.payment_status === 'paid' && <DollarSign className="w-3 h-3 text-emerald-500 shrink-0" />}
                            </div>
                            <p className="text-xs font-black text-white uppercase truncate">{res.client_name}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DRAWER DETAILS */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#0c0c0c] border-l border-white/10 z-50 transform transition-transform duration-300 p-8 shadow-2xl overflow-y-auto ${selectedResa ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedResa && (
          <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${selectedResa.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                {selectedResa.status === 'confirmed' ? 'Confirmé' : 'En Attente'}
              </span>
              <button onClick={() => setSelectedResa(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><X className="w-5 h-5" /></button>
            </div>

            <div>
              <h2 className="text-3xl font-black uppercase leading-none mb-1">{selectedResa.client_name}</h2>
              
              {/* --- BOUTON OUVERTURE MODAL --- */}
              <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Horaire Actuel</span>
                    <p className="text-sm font-bold text-white">
                        {new Date(selectedResa.start_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {new Date(selectedResa.start_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <button 
                    onClick={() => {
                        setRescheduleMonth(new Date(selectedResa.start_at)); 
                        setRescheduleDate(null);
                        setRescheduleTime(null);
                        setShowRescheduleModal(true);
                    }} 
                    className="px-3 py-2 bg-primary/20 text-primary text-xs font-bold uppercase rounded-lg hover:bg-primary hover:text-black transition-all flex items-center gap-2"
                >
                    <CalendarDays className="w-4 h-4" /> Modifier
                </button>
              </div>

              <div className="flex gap-2 mt-4">
                <a href={`tel:${selectedResa.client_phone}`} className="flex-1 py-3 bg-white/5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-white hover:text-black transition-colors"><Phone className="w-4 h-4" /> Appeler</a>
                <a href={`mailto:${selectedResa.client_email}`} className="flex-1 py-3 bg-white/5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-white hover:text-black transition-colors"><Mail className="w-4 h-4" /> Email</a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <Wrench className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-widest">Prestation</span>
                </div>
                <p className="text-xl font-bold">{selectedResa.service_name}</p>
                <div className="flex gap-2 flex-wrap mt-3">
                  {selectedResa.service_details?.detailing_options?.map((opt: string) => (
                    <span key={opt} className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-gray-400 font-bold uppercase">{opt}</span>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-[2rem] border transition-all ${selectedResa.payment_status === 'paid' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Facturation</span>
                  {selectedResa.payment_status === 'paid' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <DollarSign className="w-5 h-5 text-gray-500" />}
                </div>
                <p className={`text-3xl font-black ${selectedResa.payment_status === 'paid' ? 'text-emerald-500' : 'text-white'}`}>{selectedResa.total_price}€</p>
                {selectedResa.status === 'confirmed' && (
                  <button onClick={() => togglePayment(selectedResa.id, selectedResa.payment_status)} className="mt-4 w-full py-3 rounded-xl border border-white/10 text-xs font-bold uppercase hover:bg-white hover:text-black transition-all">
                    {selectedResa.payment_status === 'paid' ? 'Marquer Non Payé' : 'Marquer Payé'}
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-3">
              {selectedResa.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(selectedResa.id, 'confirmed')} className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:brightness-110 flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4"/> Valider le chantier</button>
                  <button onClick={() => { if(confirm('Refuser la demande ?')) updateStatus(selectedResa.id, 'cancelled'); }} className="w-full py-4 bg-red-500/10 text-red-500 font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"><Ban className="w-4 h-4"/> Refuser la demande</button>
                </>
              )}
              {selectedResa.status === 'confirmed' && (
                <>
                  <button onClick={() => updateStatus(selectedResa.id, 'pending')} className="w-full py-4 bg-primary/10 text-primary font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2"><Clock className="w-4 h-4"/> Repasser en attente</button>
                  <button onClick={() => { if(confirm('Annuler le RDV ?')) updateStatus(selectedResa.id, 'cancelled'); }} className="w-full py-4 bg-white/5 text-gray-500 font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"><Ban className="w-4 h-4"/> Annuler le RDV</button>
                </>
              )}
              <button onClick={() => deleteReservation(selectedResa.id)} className="w-full py-3 text-[10px] text-gray-600 font-bold uppercase hover:text-red-500 transition-colors flex items-center justify-center gap-2"><Trash2 className="w-3 h-3"/> Supprimer de l'historique</button>
            </div>
          </div>
        )}
      </div>
      
      {/* --- MODAL REPROGRAMMATION --- */}
      {showRescheduleModal && selectedResa && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#121212] border border-white/10 w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#0f0f0f]">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase">Reprogrammer le RDV</h3>
                        <p className="text-sm text-gray-500">Choisissez un nouveau créneau pour {selectedResa.client_name}</p>
                    </div>
                    <button onClick={() => setShowRescheduleModal(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* GAUCHE : CALENDRIER */}
                    <div className="flex-1 border-r border-white/10 p-6 flex flex-col overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-lg font-bold capitalize text-white pl-2">{new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(rescheduleMonth)}</span>
                            <div className="flex gap-2">
                                <button onClick={() => { const d = new Date(rescheduleMonth); d.setMonth(d.getMonth() - 1); setRescheduleMonth(d); }} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white"><ChevronLeft className="w-4 h-4"/></button>
                                <button onClick={() => { const d = new Date(rescheduleMonth); d.setMonth(d.getMonth() + 1); setRescheduleMonth(d); }} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white"><ChevronRight className="w-4 h-4"/></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold text-gray-500 py-2">{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <div key={i}>{d}</div>)}</div>
                        <div className="grid grid-cols-7 gap-1 sm:gap-2 content-start">
                            {(() => {
                                const year = rescheduleMonth.getFullYear();
                                const month = rescheduleMonth.getMonth();
                                const firstDay = new Date(year, month, 1).getDay();
                                const daysInMonth = new Date(year, month + 1, 0).getDate();
                                const startDay = firstDay === 0 ? 6 : firstDay - 1;
                                const days = [];
                                for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="w-full aspect-square" />);
                                for (let d = 1; d <= daysInMonth; d++) {
                                    const dateObj = new Date(year, month, d);
                                    const isSelected = rescheduleDate?.toDateString() === dateObj.toDateString();
                                    const isAvailable = isDayAvailable(dateObj); // Utilise la fonction importée du client
                                    days.push(
                                        <button key={d} disabled={!isAvailable} onClick={() => { setRescheduleDate(dateObj); setRescheduleTime(null); }} className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${isSelected ? 'bg-primary text-white shadow-glow' : !isAvailable ? 'text-gray-700 cursor-not-allowed opacity-50 bg-white/[0.01]' : 'text-gray-300 hover:bg-white/10 bg-white/[0.02]'}`}>
                                            {d}
                                        </button>
                                    );
                                }
                                return days;
                            })()}
                        </div>
                    </div>

                    {/* DROITE : CRÉNEAUX */}
                    <div className="w-full md:w-80 p-6 flex flex-col bg-[#0a0a0a]">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                            {rescheduleDate ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(rescheduleDate) : 'Sélectionnez une date'}
                        </h3>
                        
                        <div className="flex-1 overflow-y-auto mb-4">
                            {rescheduleDate ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {timeSlots.map((time) => {
                                        const [h, m] = time.split(':').map(Number);
                                        const slotStart = new Date(rescheduleDate); slotStart.setHours(h, m, 0, 0);
                                        const slotEnd = calculateEndDate(slotStart, selectedResa.duration_hours);
                                        const isAvailable = isRangeAvailable(slotStart, slotEnd, selectedResa.id);
                                        
                                        return (
                                            <button key={time} disabled={!isAvailable} onClick={() => setRescheduleTime(time)} className={`py-2 rounded-lg text-xs font-bold border transition-all ${rescheduleTime === time ? 'bg-primary border-primary text-black' : isAvailable ? 'bg-white/5 border-white/10 text-white hover:border-primary/50' : 'opacity-20 cursor-not-allowed border-red-900/50 text-red-900'}`}>
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : <div className="h-full flex items-center justify-center text-gray-700 text-sm">Calendrier vide</div>}
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/10">
                            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Durée prestation</span><span>{selectedResa.duration_hours}h</span></div>
                            <div className="flex justify-between text-sm text-white font-bold"><span>Nouveau tarif</span><span>Inchangé</span></div>
                        </div>

                        <button 
                            onClick={handleRescheduleSubmit} 
                            disabled={!rescheduleDate || !rescheduleTime} 
                            className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4"/> Valider
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {selectedResa && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSelectedResa(null)} />}
    </div>
  );
};

export default AdminPlanning;