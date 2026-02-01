import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// --- CONFIGURATION ---
const SENDER_EMAIL = "Saphir Detailing <contact@saphirdetailing.fr>";
const ADMIN_EMAIL = "contact@saphirdetailing.fr"; 
const SITE_URL = "https://saphirdetailing.fr";
const DASHBOARD_URL = "https://saphirdetailing.fr/admin/dashboard"; 
const LOGO_URL = "https://rfmebohbwdwjjktlaniq.supabase.co/storage/v1/object/public/public-bucket/logo.png";

// --- GESTION CORS SÉCURISÉE ---
const allowedOrigins = [
  "http://localhost:5173",           
  "http://127.0.0.1:5173",           
  "https://saphirdetailing.fr",      
  "https://www.saphirdetailing.fr"  
];

const getCorsHeaders = (origin: string) => {
  const allowOrigin = allowedOrigins.includes(origin) ? origin : "https://saphirdetailing.fr";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Non définie';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  }).replace(':', 'h');
};

const generateEmailHtml = (title: string, content: string, actionButton: { text: string, url: string } | null = null, isClient: boolean = false) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#050505;font-family:sans-serif;color:#ffffff;">
  <div style="max-width:600px;margin:0 auto;background-color:#121212;border:1px solid #333;border-radius:12px;overflow:hidden;">
    <div style="background:linear-gradient(90deg, #000000 0%, #1e3a8a 100%);padding:30px 20px;text-align:center;">
       <div style="display: inline-block;">
        ${LOGO_URL ? `<img src="${LOGO_URL}" alt="Logo" width="50" height="50" style="vertical-align:middle;margin-right:15px;" />` : ''}
        <div style="display:inline-block;vertical-align:middle;text-align:left;">
          <h1 style="margin:0;font-size:24px;color:#ffffff;letter-spacing:2px;text-transform:uppercase;line-height:1;">SAPHIR DETAILING</h1>
          <p style="margin:5px 0 0;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Reservation Center</p>
        </div>
      </div>
    </div>
    <div style="padding:40px 30px;">
      <h2 style="color:#3b82f6;margin-top:0;">${title}</h2>
      <div style="color:#e2e8f0;line-height:1.6;">${content}</div>
      ${actionButton ? `<div style="text-align:center; margin-top:30px;"><a href="${actionButton.url}" style="background-color:#3b82f6; color:#ffffff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; display:inline-block;">${actionButton.text}</a></div>` : ''}
      ${isClient ? `<div style="margin-top:30px;padding:15px;background-color:#1e1e1e;border-left:4px solid #3b82f6;border-radius:4px;"><p style="margin:0;font-size:14px;color:#94a3b8;">Saphir Detailing - L'excellence automobile.</p></div>` : ''}
    </div>
    <div style="background-color:#000000;padding:20px;text-align:center;border-top:1px solid #333;">
      <p style="margin:0;color:#64748b;font-size:12px;">295 route d'Aulus, 09140 Oust • 06 68 84 06 27</p>
      <p style="margin:5px 0 0;"><a href="${SITE_URL}" style="color:#3b82f6;text-decoration:none;font-size:12px;">saphirdetailing.fr</a></p>
    </div>
  </div>
</body>
</html>
`;

serve(async (req: Request) => {
  // 1. DÉTECTION ORIGINE & CALCUL HEADERS
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);

  // 2. GESTION PREFLIGHT (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, record, old_status, new_status, old_date, new_date } = await req.json();

    // 1. NOUVELLE RÉSERVATION (Création)
    if (type === 'create') {
      const detailsHtml = `
        <div style="background:#1e1e1e; padding:15px; border-radius:8px; margin-bottom:20px; border:1px solid #333;">
            <p style="margin:5px 0;"><strong>Véhicule :</strong> ${record.vehicle_info?.label || 'Non spécifié'}</p>
            <p style="margin:5px 0;"><strong>Formule :</strong> ${record.service_name}</p>
            <p style="margin:5px 0;"><strong>Début :</strong> ${formatDate(record.start_at)}</p>
            <p style="margin:5px 0; color:#3b82f6;"><strong>Prix est. :</strong> ${record.total_price > 0 ? record.total_price + '€' : 'Sur Devis'}</p>
        </div>
      `;
      // Admin
      await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: SENDER_EMAIL, to: [ADMIN_EMAIL],
          subject: `📅 Nouvelle demande : ${record.client_name}`,
          html: generateEmailHtml(`Nouvelle demande`, `<p>Une nouvelle demande a été déposée.</p>${detailsHtml}<p><strong>Client :</strong> ${record.client_name} (<a href="mailto:${record.client_email}" style="color:#3b82f6;">${record.client_email}</a>)</p>`, { text: "Gérer sur le Dashboard", url: DASHBOARD_URL })
        }),
      });
      // Client
      await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: SENDER_EMAIL, to: [record.client_email],
          subject: "Votre demande de réservation - Saphir Detailing",
          html: generateEmailHtml(`Bonjour ${record.client_name.split(' ')[0]},`, `<p>Nous avons bien reçu votre demande pour votre <strong>${record.vehicle_info?.label || 'véhicule'}</strong>.</p>${detailsHtml}<p>Nous vérifions la disponibilité et revenons vers vous.</p>`, null, true)
        }),
      });
    }

    // 2. MISE À JOUR DE STATUT (Confirmation / Annulation / Refus)
    if (type === 'update_status') {
        
        // A. CONFIRMATION
        if (new_status === 'confirmed') {
            await fetch("https://api.resend.com/emails", {
                method: "POST", headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    from: SENDER_EMAIL, to: [record.client_email],
                    subject: "✅ Réservation Confirmée - Saphir Detailing",
                    html: generateEmailHtml(`Rendez-vous Confirmé`, `<p>Bonjour ${record.client_name.split(' ')[0]},</p><p>Votre réservation pour le <strong>${formatDate(record.start_at)}</strong> a été validée par l'atelier.</p><div style="background:#1e1e1e; padding:15px; border-radius:8px; margin:20px 0; border-left:4px solid #10b981;"><p style="margin:0; font-weight:bold; color:#10b981;">Créneau verrouillé</p><p style="margin:5px 0 0; font-size:14px; color:#94a3b8;">Prestation : ${record.service_name}</p></div><p>Nous vous attendons à l'atelier au : 295 route d'Aulus, 09140 Oust.</p>`, { text: "Itinéraire GPS", url: "https://www.google.com/maps/dir//295+Rte+d'Aulus,+09140+Oust" }, true)
                }),
            });
        }
        
        // B. ANNULATION / REFUS
        if (new_status === 'cancelled') {
            const isRefusal = old_status === 'pending';
            
            const subject = isRefusal ? "Concernant votre demande de réservation" : "🚫 Annulation de votre rendez-vous";
            const title = isRefusal ? "Mise à jour de votre demande" : "Rendez-vous Annulé";
            const message = isRefusal 
                ? `<p>Bonjour ${record.client_name.split(' ')[0]},</p><p>Nous ne sommes malheureusement pas en mesure de valider votre demande pour le <strong>${formatDate(record.start_at)}</strong> (créneau indisponible ou contrainte technique).</p><p>Nous vous invitons à consulter nos autres disponibilités.</p>`
                : `<p>Bonjour ${record.client_name.split(' ')[0]},</p><p>Nous vous informons que votre rendez-vous du <strong>${formatDate(record.start_at)}</strong> a été annulé.</p><p>Vous pouvez reprogrammer une intervention via notre site.</p>`;

            await fetch("https://api.resend.com/emails", {
                method: "POST", headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    from: SENDER_EMAIL, to: [record.client_email],
                    subject: subject,
                    html: generateEmailHtml(title, message, { text: "Réserver à nouveau", url: `${SITE_URL}/reservation` }, true)
                }),
            });
        }
    }

    // 3. REPROGRAMMATION (Confirmation automatique)
    if (type === 'reschedule') {
        await fetch("https://api.resend.com/emails", {
            method: "POST", headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from: SENDER_EMAIL, to: [record.client_email],
                subject: "📅 Changement d'horaire - Saphir Detailing",
                html: generateEmailHtml(
                    `Nouvel horaire confirmé`,
                    `<p>Bonjour ${record.client_name.split(' ')[0]},</p>
                     <p>Suite à notre échange ou modifications de planning, votre rendez-vous a été déplacé et <strong>automatiquement confirmé</strong>.</p>
                     
                     <div style="display:flex; justify-content:space-between; align-items:center; background:#1e1e1e; padding:15px; border-radius:8px; margin:20px 0;">
                        <div style="text-align:center; width:45%; opacity:0.5;">
                            <p style="font-size:10px; text-transform:uppercase;">Avant</p>
                            <p style="text-decoration:line-through; font-size:12px;">${formatDate(old_date)}</p>
                        </div>
                        <div style="font-size:20px;">➝</div>
                        <div style="text-align:center; width:45%;">
                            <p style="font-size:10px; color:#10b981; text-transform:uppercase;">Nouveau</p>
                            <p style="color:#10b981; font-weight:bold; font-size:13px;">${formatDate(new_date)}</p>
                        </div>
                     </div>
                     <p>Le créneau est verrouillé, nous vous attendons à cette nouvelle date.</p>`,
                     { text: "Nous contacter", url: "mailto:contact@saphirdetailing.fr" }, true
                )
            }),
        });
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});