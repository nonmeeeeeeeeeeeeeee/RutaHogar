import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const testerTypes = new Set(["Usuario", "Ejecutivo", "Banco", "Inmobiliaria", "Otro"]);

type FeedbackPayload = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  tester_type?: string | null;
  first_impression?: string | null;
  confusing_part?: string | null;
  improvement_suggestion?: string | null;
  clarity_rating?: number | string | null;
};

function cleanText(value: unknown, maxLength = 4000) {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizePhone(value: unknown) {
  const raw = cleanText(value, 20);
  if (!raw) return null;

  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith("569") ? digits.slice(3) : digits.startsWith("9") ? digits.slice(1) : digits;

  if (/^\d{8}$/.test(local)) return `+569${local}`;
  throw new Error("Teléfono inválido. Usa un número chileno +56 9 con 8 dígitos.");
}

function normalizePayload(payload: FeedbackPayload) {
  const name = cleanText(payload.name, 160) || null;
  const email = cleanText(payload.email, 254) || null;
  const phone = normalizePhone(payload.phone);
  const tester_type = cleanText(payload.tester_type, 40) || "Otro";
  const first_impression = cleanText(payload.first_impression) || null;
  const confusing_part = cleanText(payload.confusing_part) || null;
  const improvement_suggestion = cleanText(payload.improvement_suggestion) || null;
  const clarity_rating = Number(payload.clarity_rating);

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Correo inválido.");
  }

  if (!testerTypes.has(tester_type)) {
    throw new Error("Perfil de tester inválido.");
  }

  if (!Number.isInteger(clarity_rating) || clarity_rating < 1 || clarity_rating > 5) {
    throw new Error("La nota de claridad debe estar entre 1 y 5.");
  }

  if (!first_impression && !confusing_part && !improvement_suggestion) {
    throw new Error("Debes enviar al menos un comentario.");
  }

  return {
    name,
    email,
    phone,
    tester_type,
    first_impression,
    confusing_part,
    improvement_suggestion,
    clarity_rating,
  };
}

async function insertFeedback(feedback: ReturnType<typeof normalizePayload>) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Faltan variables de entorno de Supabase.");
  }

  const row = {
    name: feedback.name,
    email: feedback.email,
    tester_type: feedback.tester_type,
    first_impression: feedback.first_impression,
    confusing_part: feedback.confusing_part,
    improvement_suggestion: feedback.improvement_suggestion,
    clarity_rating: feedback.clarity_rating,
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Error al insertar feedback:", details);
    throw new Error("No se pudo guardar el feedback.");
  }
}

async function sendFeedbackEmail(feedback: ReturnType<typeof normalizePayload>, createdAt: string) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const toEmail = Deno.env.get("FEEDBACK_TO_EMAIL");
  const fromEmail = Deno.env.get("FEEDBACK_FROM_EMAIL") || "ScoreLeads <onboarding@resend.dev>";

  if (!resendApiKey || !toEmail) {
    throw new Error("Faltan RESEND_API_KEY o FEEDBACK_TO_EMAIL.");
  }

  const subject = feedback.name
    ? `Nuevo feedback de ${feedback.name} - ScoreLeads`
    : "Nuevo feedback anónimo - ScoreLeads";
  const displayName = feedback.name || "Anónimo";
  const contactEmail = feedback.email || "No informado";
  const contactPhone = feedback.phone || "No informado";
  const createdAtLabel = new Date(createdAt).toLocaleString("es-CL", { timeZone: "America/Santiago" });

  const html = `
    <h2>Nuevo feedback recibido</h2>
    <table style="border-collapse:collapse;width:100%;max-width:680px;">
      <tr><td style="padding:8px;font-weight:bold;">Nombre</td><td style="padding:8px;">${escapeHtml(displayName)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Perfil tester</td><td style="padding:8px;">${escapeHtml(feedback.tester_type)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Nota claridad</td><td style="padding:8px;">${feedback.clarity_rating}/5</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Fecha</td><td style="padding:8px;">${escapeHtml(createdAtLabel)}</td></tr>
    </table>

    <h3>Comentarios</h3>
    <p><strong>Primera impresión:</strong><br>${escapeHtml(feedback.first_impression || "No informado")}</p>
    <p><strong>Parte confusa o difícil:</strong><br>${escapeHtml(feedback.confusing_part || "No informado")}</p>
    <p><strong>Sugerencia de mejora:</strong><br>${escapeHtml(feedback.improvement_suggestion || "No informado")}</p>

    <h3>Contacto</h3>
    <table style="border-collapse:collapse;width:100%;max-width:680px;">
      <tr><td style="padding:8px;font-weight:bold;">Nombre</td><td style="padding:8px;">${escapeHtml(displayName)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Correo</td><td style="padding:8px;">${escapeHtml(contactEmail)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Teléfono</td><td style="padding:8px;">${escapeHtml(contactPhone)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Perfil</td><td style="padding:8px;">${escapeHtml(feedback.tester_type)}</td></tr>
    </table>
  `;

  const text = [
    `Nombre: ${displayName}`,
    `Perfil tester: ${feedback.tester_type}`,
    `Nota claridad: ${feedback.clarity_rating}/5`,
    `Fecha: ${createdAtLabel}`,
    "",
    "Primera impresión:",
    feedback.first_impression || "No informado",
    "",
    "Parte confusa o difícil:",
    feedback.confusing_part || "No informado",
    "",
    "Sugerencia de mejora:",
    feedback.improvement_suggestion || "No informado",
    "",
    "Contacto:",
    `Nombre: ${displayName}`,
    `Correo: ${contactEmail}`,
    `Teléfono: ${contactPhone}`,
    `Perfil: ${feedback.tester_type}`,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Error al enviar email de feedback:", details);
    throw new Error("Feedback guardado, pero no se pudo enviar el correo.");
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Método no permitido." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const feedback = normalizePayload(await req.json());
    const createdAt = new Date().toISOString();

    await insertFeedback(feedback);

    try {
      await sendFeedbackEmail(feedback, createdAt);
      return new Response(
        JSON.stringify({ success: true, email_sent: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } catch (emailError) {
      console.error("Feedback guardado sin correo:", emailError.message);
      return new Response(
        JSON.stringify({
          success: true,
          email_sent: false,
          warning: "Feedback guardado, pero no se pudo enviar el correo.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    console.error("Error en submit-feedback:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
