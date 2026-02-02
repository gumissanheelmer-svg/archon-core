import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  runSecurityChecks,
  validatePayload,
  auditLog,
  getSecurityHeaders,
} from "../_shared/security.ts";

// Rate limit config: 5 attempts per 10 minutes, with progressive blocking
const RATE_LIMIT_CONFIG = {
  maxRequests: 5,
  windowMs: 10 * 60 * 1000, // 10 minutes
  blockDurationMs: 5 * 60 * 1000, // 5 minutes base block
};

serve(async (req) => {
  const headers = getSecurityHeaders(req.headers.get('origin') || undefined);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método não permitido" }),
      { status: 405, headers }
    );
  }

  const startTime = Date.now();

  try {
    // Run security checks (IP allowlist + rate limiting)
    const securityCheck = await runSecurityChecks(req, 'auth/login', RATE_LIMIT_CONFIG);
    if (!securityCheck.passed) {
      return securityCheck.response!;
    }

    // Parse and validate body
    let body: { email?: string; password?: string };
    try {
      body = await req.json();
    } catch {
      auditLog('login_failed', { reason: 'invalid_json', ip: securityCheck.ip.substring(0, 8) + '***' });
      return new Response(
        JSON.stringify({ error: "Credenciais inválidas", success: false }),
        { status: 401, headers }
      );
    }

    // Validate payload structure
    const payloadCheck = validatePayload(body, 256); // Email/password max 256 chars
    if (!payloadCheck.allowed) {
      auditLog('login_failed', { reason: 'payload_validation', ip: securityCheck.ip.substring(0, 8) + '***' });
      return new Response(
        JSON.stringify({ error: "Credenciais inválidas", success: false }),
        { status: 401, headers }
      );
    }

    const { email, password } = body;

    // Validate required fields
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      auditLog('login_failed', { reason: 'missing_fields', ip: securityCheck.ip.substring(0, 8) + '***' });
      return new Response(
        JSON.stringify({ error: "Credenciais inválidas", success: false }),
        { status: 401, headers }
      );
    }

    // Get authorized email from secrets
    const authorizedEmail = Deno.env.get("ARCHON_AUTHORIZED_EMAIL");
    
    if (!authorizedEmail) {
      console.error("ARCHON_AUTHORIZED_EMAIL not configured");
      return new Response(
        JSON.stringify({ error: "Sistema não configurado", success: false }),
        { status: 500, headers }
      );
    }

    // Validate email matches authorized user (case-insensitive, trimmed)
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedAuthorized = authorizedEmail.toLowerCase().trim();
    
    if (normalizedEmail !== normalizedAuthorized) {
      auditLog('login_failed', { 
        reason: 'unauthorized_email', 
        ip: securityCheck.ip.substring(0, 8) + '***',
        duration_ms: Date.now() - startTime
      });
      // Generic error - don't reveal if email exists or not
      return new Response(
        JSON.stringify({ error: "Credenciais inválidas", success: false }),
        { status: 401, headers }
      );
    }

    // Create Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Attempt to sign in with Supabase Auth (password is verified by Supabase with bcrypt)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.session) {
      auditLog('login_failed', { 
        reason: 'invalid_credentials', 
        ip: securityCheck.ip.substring(0, 8) + '***',
        duration_ms: Date.now() - startTime
      });
      // Generic error - don't reveal details
      return new Response(
        JSON.stringify({ error: "Credenciais inválidas", success: false }),
        { status: 401, headers }
      );
    }

    // Success - log and return session
    auditLog('login_success', { 
      ip: securityCheck.ip.substring(0, 8) + '***',
      duration_ms: Date.now() - startTime
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
          user: {
            id: data.user?.id,
            email: data.user?.email,
          }
        }
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error("Auth validation error:", error);
    auditLog('login_error', { 
      error: error instanceof Error ? error.message : 'unknown',
    });
    return new Response(
      JSON.stringify({ error: "Credenciais inválidas", success: false }),
      { status: 401, headers }
    );
  }
});
