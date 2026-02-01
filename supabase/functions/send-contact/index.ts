import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TURNSTILE_SECRET_KEY = Deno.env.get("TURNSTILE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// --- CONFIGURATION EMAILS ---
const SENDER_EMAIL = "Saphir Detailing <contact@saphirdetailing.fr>";
const ADMIN_EMAIL = "contact@saphirdetailing.fr"; 

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

// --- GÉNÉRATEUR DE TEMPLATE HTML ---
const generateEmailHtml = (title: string, content: string, isClient: boolean = false) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Arial', sans-serif; color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #333; border-radius: 12px; overflow: hidden;">
    
    <div style="background: linear-gradient(90deg, #000000 0%, #1e3a8a 100%); padding: 30px 20px; text-align: center;">
      <div style="display: inline-block;">
        
        <img src="${LOGO_URL}" alt="Saphir Logo" width="50" height="50" style="vertical-align: middle; margin-right: 15px; display: inline-block;" />
        
        <div style="display: inline-block; vertical-align: middle; text-align: left;">
          <h1 style="margin: 0; font-size: 24px; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1;">SAPHIR DETAILING</h1>
          <p style="margin: 5px 0 0; color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Automotive Care Excellence</p>
        </div>

      </div>
    </div>

    <div style="padding: 40px 30px;">
      <h2 style="color: #3b82f6; margin-top: 0; font-size: 20px;">${title}</h2>
      <div style="color: #e2e8f0; line-height: 1.6; font-size: 15px;">
        ${content}
      </div>
      
      ${isClient ? `
        <div style="margin-top: 30px; padding: 15px; background-color: #1e1e1e; border-left: 4px solid #3b82f6; border-radius: 4px;">
           <p style="margin: 0; font-size: 14px; color: #94a3b8;">Notre équipe vous répondra sous 24h ouvrées.</p>
        </div>
      ` : ''}
    </div>

    <div style="background-color: #000000; padding: 20px; text-align: center; border-top: 1px solid #333;">
      <p style="margin: 0; color: #64748b; font-size: 12px;">
        295 route d'Aulus, 09140 Oust<br>
        06 68 84 06 27 • contact@saphirdetailing.fr
      </p>
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
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { name, email, phone, subject, message, token, confirm_email } = await req.json();

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
      return new Response(JSON.stringify({ error: "Échec de la vérification de sécurité." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 3. RATE LIMITING
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { data: lastMessages } = await supabase
        .from("contact_messages")
        .select("created_at")
        .eq("ip", ip)
        .order("created_at", { ascending: false })
        .limit(1);

    if (lastMessages && lastMessages.length > 0) {
        const diffSeconds = (new Date().getTime() - new Date(lastMessages[0].created_at).getTime()) / 1000;
        if (diffSeconds < 60) {
            return new Response(JSON.stringify({ error: "Veuillez patienter 1 minute." }), {
                status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }
    }

    // 4. DB INSERT
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([{ name, email, phone, subject, message, ip }]);

    if (dbError) throw dbError;

    // 5. ENVOI EMAILS
    
    // A. Email ADMIN
    const emailAdmin = fetch("https://api.resend.com/emails", {
      method: "POST", 
      headers: { 
        "Authorization": `Bearer ${RESEND_API_KEY}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `🔔 Nouveau Message : ${subject}`,
        html: generateEmailHtml(
            `Nouveau contact de ${name}`,
            `<p><strong>Sujet :</strong> ${subject}</p>
             <p><strong>Email :</strong> <a href="mailto:${email}" style="color:#3b82f6;">${email}</a></p>
             <p><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</p>
             <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
             <p style="white-space: pre-wrap;">${message}</p>`
        )
      }),
    });

    // B. Email CLIENT
    const emailClient = fetch("https://api.resend.com/emails", {
      method: "POST", 
      headers: { 
        "Authorization": `Bearer ${RESEND_API_KEY}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: [email],
        subject: "Confirmation de réception - Saphir Detailing",
        html: generateEmailHtml(
            `Bonjour ${name},`,
            `<p>Nous avons bien reçu votre demande concernant "<strong>${subject}</strong>".</p>
             <p>Merci de votre confiance.</p>`,
            true
        )
      }),
    });

    await Promise.all([emailAdmin, emailClient]);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});