import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TURNSTILE_SECRET_KEY = Deno.env.get("TURNSTILE_SECRET_KEY");

// --- CONFIGURATION ---
const SENDER_EMAIL = "Saphir Detailing <contact@saphirdetailing.fr>";
const ADMIN_EMAIL = "contact@saphirdetailing.fr";
const SITE_URL = "https://saphirdetailing.fr";
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

const generateEmailHtml = (title: string, content: string, isClient: boolean = false) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#050505;font-family:Arial,sans-serif;color:#ffffff;">
  <div style="max-width:600px;margin:0 auto;background-color:#121212;border:1px solid #333;border-radius:12px;overflow:hidden;">
    <div style="background:linear-gradient(90deg, #000000 0%, #1e3a8a 100%);padding:30px 20px;text-align:center;">
      <div style="display:inline-block;">
        <img src="${LOGO_URL}" alt="Logo" width="50" height="50" style="vertical-align:middle;margin-right:15px;" />
        <div style="display:inline-block;vertical-align:middle;text-align:left;">
          <h1 style="margin:0;font-size:24px;color:#ffffff;letter-spacing:2px;text-transform:uppercase;line-height:1;">SAPHIR DETAILING</h1>
          <p style="margin:5px 0 0;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Demande de Devis</p>
        </div>
      </div>
    </div>
    <div style="padding:40px 30px;">
      <h2 style="color:#3b82f6;margin-top:0;font-size:20px;">${title}</h2>
      <div style="color:#e2e8f0;line-height:1.6;font-size:15px;">${content}</div>
      ${isClient ? `
        <div style="margin-top:30px;padding:15px;background-color:#1e1e1e;border-left:4px solid #3b82f6;border-radius:4px;">
          <p style="margin:0;font-size:14px;color:#94a3b8;">Nous vous contactons rapidement pour convenir d'un créneau. Besoin d'une réponse immédiate ? Appelez-nous au 06 68 84 06 27.</p>
        </div>
      ` : ''}
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
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const {
      name,
      email,
      phone,
      vehicle_label,
      service_name,
      detailing_options,
      mechanic_options,
      total_price,
      is_sur_devis,
      notes,
      token,
      confirm_email, 
    } = await req.json();

    // 1. HONEYPOT
    if (confirm_email) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const ip = req.headers.get('cf-connecting-ip') || 'Unknown';

    // 2. TURNSTILE 
    const turnstileVerify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
    });
    const turnstileOutcome = await turnstileVerify.json();

    if (!turnstileOutcome.success) {
      console.error("Échec vérification Turnstile:", turnstileOutcome);
      return new Response(JSON.stringify({ error: "Échec de la vérification de sécurité." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!name || !email || !phone) {
      return new Response(JSON.stringify({ error: "Champs obligatoires manquants." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // --- CONSTRUCTION DU RÉCAPITULATIF ---
    const optionsListHtml = [
      ...(detailing_options || []).map((o: string) => `<li>${o}</li>`),
      ...(mechanic_options || []).map((o: string) => `<li>${o}</li>`),
    ].join('');

    const priceLabel = is_sur_devis ? 'Sur devis' : `${total_price}€ (estimatif)`;

    const recapHtml = `
      <div style="background:#1e1e1e; padding:15px; border-radius:8px; margin-bottom:20px; border:1px solid #333;">
        <p style="margin:5px 0;"><strong>Véhicule :</strong> ${vehicle_label || 'Non spécifié'}</p>
        <p style="margin:5px 0;"><strong>Formule :</strong> ${service_name || 'Non spécifiée'}</p>
        ${optionsListHtml ? `<p style="margin:10px 0 4px;"><strong>Options :</strong></p><ul style="margin:0; padding-left:20px;">${optionsListHtml}</ul>` : ''}
        <p style="margin:10px 0 0; color:#3b82f6;"><strong>Prix estimé :</strong> ${priceLabel}</p>
        ${notes ? `<p style="margin:10px 0 0;"><strong>Notes du client :</strong> ${notes}</p>` : ''}
      </div>
    `;

    // A. Email ADMIN
    const emailAdminPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `💬 Nouvelle demande de devis : ${name}`,
        html: generateEmailHtml(
          `Nouvelle demande de devis`,
          `<p><strong>Client :</strong> ${name}</p>
           <p><strong>Email :</strong> <a href="mailto:${email}" style="color:#3b82f6;">${email}</a></p>
           <p><strong>Téléphone :</strong> <a href="tel:${phone}" style="color:#3b82f6;">${phone}</a></p>
           <hr style="border:0;border-top:1px solid #333;margin:20px 0;">
           ${recapHtml}`
        )
      }),
    });

    // B. Email CLIENT
    const emailClientPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: [email],
        subject: "Votre demande de devis - Saphir Detailing",
        html: generateEmailHtml(
          `Bonjour ${name.split(' ')[0]},`,
          `<p>Nous avons bien reçu votre demande. Voici le récapitulatif :</p>${recapHtml}`,
          true
        )
      }),
    });

    const [adminRes, clientRes] = await Promise.all([emailAdminPromise, emailClientPromise]);
    const [adminBody, clientBody] = await Promise.all([
      adminRes.json().catch(() => null),
      clientRes.json().catch(() => null),
    ]);

    if (!adminRes.ok) {
      console.error("Échec envoi email ADMIN (Resend):", adminRes.status, adminBody);
      return new Response(JSON.stringify({
        error: "L'email de notification n'a pas pu être envoyé.",
        details: adminBody,
      }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (!clientRes.ok) {
      console.error("Échec envoi email CLIENT (Resend):", clientRes.status, clientBody);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Erreur inattendue dans send-quote-request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});