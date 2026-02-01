import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase'; 
import { toast } from "sonner"; 
import { Turnstile } from '@marsidev/react-turnstile'; 
import SeoHead from '@/components/SeoHead';

// --- CONSTANTES DE VALIDATION  ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

const Contact = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [token, setToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState(""); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // --- HELPER FUNCTIONS ---
  const isEmailValid = (email: string) => emailRegex.test(email);
  const isPhoneValid = (phone: string) => phoneRegex.test(phone);

  // Validation globale du formulaire
  const isFormValid = 
    formData.name.length >= 2 &&
    isEmailValid(formData.email) &&
    (formData.phone === '' || isPhoneValid(formData.phone)) &&
    formData.subject !== '' &&
    formData.message.length >= 10; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Veuillez valider la sécurité anti-robot.");
      return;
    }

    if (!isFormValid) {
        toast.error("Veuillez vérifier les champs en rouge.");
        return;
    }

    setFormStatus('loading');

    const { error } = await supabase.functions.invoke('send-contact', {
      body: { 
        ...formData, 
        token, 
        confirm_email: honeypot 
      },
    });

    if (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      setFormStatus('idle');
      return;
    }

    setFormStatus('success');
    toast.success("Message envoyé et sécurisé ! Nous vous répondrons sous 24h.");
    
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setHoneypot("");
    
    setTimeout(() => setFormStatus('idle'), 5000);
  };

  const contactDetails = [
    {
      icon: MapPin,
      title: "Notre Atelier",
      content: "231 route d'Aulus, Oust 09140",
      action: "Y aller",
      link: "#"
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: "06 68 84 06 27",
      action: "Appeler",
      link: "tel:+33668840627"
    },
    {
      icon: Mail,
      title: "Email",
      content: "contact@saphirdetailing.fr",
      action: "Écrire",
      link: "mailto:contact@saphirdetailing.fr"
    },
    {
      icon: Clock,
      title: "Horaires",
      content: "Lundi au Vendredi:\n9h-12h - 14h-18h",
      link: null
    }
  ];

  return (
    <>
      <SeoHead 
        title="Contacter Saphir Detailing à Oust (09)"
        description="Prenez rendez-vous pour un devis gratuit. Notre atelier est situé à Oust en Ariège. Téléphone, Horaires et formulaire de contact."
        canonicalUrl="https://www.saphirdetailing.fr/contact"
      />
      <div className="bg-[#050505] min-h-screen relative overflow-x-hidden">
        
        {/* BACKGROUND */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full mix-blend-screen opacity-40" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 blur-[100px] rounded-full mix-blend-screen opacity-40" />
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"
            style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)' }}
          />
        </div>

        <section className="pt-32 pb-16 relative z-10">
          <div className="container px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6 backdrop-blur-md">
                <MessageSquare className="w-3 h-3" />
                <span>Nous sommes à votre écoute</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white tracking-tight">
                Parlons de votre <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-gray-400">
                  Projet
                </span>
              </h1>
              
              <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
                Une question technique, un devis sur-mesure ou une simple prise d'information ? 
                Notre équipe vous répond sous 24h.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pb-20 relative z-10">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              
              {/* GAUCHE : INFOS & MAP */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-8 h-full"
              >
                <div className="grid sm:grid-cols-2 gap-4 shrink-0">
                  {contactDetails.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="group bg-[#121212] border border-white/10 p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:bg-[#181818]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors text-gray-400">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display font-bold text-white text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 h-10 whitespace-pre-line">{item.content}</p>
                      
                      {item.link && (
                        <a href={item.link} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                          {item.action} <ArrowRight className="w-3 h-3 ml-2" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                <div className="relative w-full flex-1 min-h-[300px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2924.0872474178877!2d1.219938877292707!3d42.87100260266707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12af35448575ad3b%3A0x34281868e7c37bad!2s231%20Rte%20d&#39;Aulus%2C%2009140%20Oust!5e0!3m2!1sfr!2sfr!4v1769980030595!5m2!1sfr!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }} 
                    allowFullScreen
                    loading="lazy"
                    title="Localisation Atelier"
                    className="absolute inset-0"
                  />
                </div>
              </motion.div>

              {/* DROITE : FORMULAIRE */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8">
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Envoyer un message</h2>
                    <p className="text-gray-400 text-sm">Remplissez le formulaire ci-dessous, nous vous recontactons très vite.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between gap-6">
                    
                    {/* HONEYPOT */}
                    <div className="absolute opacity-0 -z-50 select-none pointer-events-none h-0 w-0 overflow-hidden">
                        <label htmlFor="confirm_email">Ne pas remplir ce champ si vous êtes humain</label>
                        <input
                            type="text"
                            name="confirm_email"
                            id="confirm_email"
                            tabIndex={-1}
                            autoComplete="off"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2 relative">
                        <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                          Nom complet <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Jean Dupont"
                          // STYLE DYNAMIQUE
                          className={`w-full px-4 py-3 bg-white/[0.07] border rounded-xl focus:outline-none transition-all
                            ${formData.name.length > 0 && formData.name.length < 2 
                                ? 'border-red-500 focus:border-red-500' 
                                : formData.name.length >= 2
                                    ? 'border-green-500/50 focus:border-green-500' 
                                    : 'border-white/20 focus:border-primary' 
                            }`}
                        />
                      </div>

                      <div className="space-y-2 relative">
                        <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                          Email <span className="text-primary">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jean@exemple.fr"
                          className={`w-full px-4 py-3 bg-white/[0.07] border rounded-xl focus:outline-none transition-all
                            ${formData.email && !isEmailValid(formData.email)
                                ? 'border-red-500 focus:border-red-500' 
                                : formData.email && isEmailValid(formData.email)
                                    ? 'border-green-500/50 focus:border-green-500'
                                    : 'border-white/20 focus:border-primary'
                            }`}
                        />
                        {formData.email && !isEmailValid(formData.email) && (
                           <span className="text-[10px] text-red-400 absolute right-3 top-9">Format invalide</span>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2 relative">
                        <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                          Téléphone <span className="text-gray-600 lowercase font-normal italic">(Optionnel)</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="06 12 34 56 78"
                          className={`w-full px-4 py-3 bg-white/[0.07] border rounded-xl focus:outline-none transition-all
                            ${formData.phone && !isPhoneValid(formData.phone)
                                ? 'border-red-500 focus:border-red-500' 
                                : formData.phone && isPhoneValid(formData.phone)
                                    ? 'border-green-500/50 focus:border-green-500'
                                    : 'border-white/20 focus:border-primary'
                            }`}
                        />
                        {formData.phone && !isPhoneValid(formData.phone) && (
                           <span className="text-[10px] text-red-400 absolute right-3 top-9">Format invalide</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                          Sujet <span className="text-primary">*</span>
                        </label>
                        <select
                          id="subject"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className={`w-full px-4 py-3 bg-white/[0.07] border rounded-xl focus:outline-none transition-all [&>option]:text-black
                            ${formData.subject ? 'border-green-500/50 focus:border-green-500' : 'border-white/20 focus:border-primary'}
                          `}
                        >
                          <option value="" disabled>Sélectionnez...</option>
                          <option value="devis">Demande de devis</option>
                          <option value="info">Information prestation</option>
                          <option value="rdv">Prise de rendez-vous</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 flex flex-col flex-1 min-h-[150px]">
                      <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                        Votre message <span className="text-primary">*</span>
                      </label>
                      <textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={`w-full h-full p-4 bg-white/[0.07] border rounded-xl focus:outline-none transition-all resize-none
                            ${formData.message.length > 0 && formData.message.length < 10
                                ? 'border-red-500 focus:border-red-500'
                                : formData.message.length >= 10
                                    ? 'border-green-500/50 focus:border-green-500'
                                    : 'border-white/20 focus:border-primary'
                            }`}
                        placeholder="Décrivez votre projet detailing..."
                      />
                    </div>

                    <div className="w-full flex justify-center ">
                        <Turnstile 
                            siteKey="0x4AAAAAACWcVeXiRR2a7qKa" 
                            onSuccess={(token) => setToken(token)}
                            theme="dark"
                        />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === 'loading' || formStatus === 'success' || !token || !isFormValid}
                      className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                        ${isFormValid 
                            ? 'bg-gradient-to-r from-white to-gray-200 text-black hover:scale-[1.02]' 
                            : 'bg-white/10 text-gray-500'
                        }`}
                    >
                      {formStatus === 'success' ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>Message envoyé avec succès</span>
                        </>
                      ) : formStatus === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Envoi sécurisé...</span>
                        </>
                      ) : (
                        <>
                          <span>Envoyer la demande</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;