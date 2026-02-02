import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export type AuthFailureReason =
  | "missing_bearer"
  | "invalid_token"
  | "unauthorized_email"
  | "misconfigured";

export type RequireAuthResult =
  | {
      ok: true;
      authHeader: string;
      token: string;
      user: { id: string; email: string | null };
    }
  | {
      ok: false;
      reason: AuthFailureReason;
      response: Response;
    };

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export async function requireAuth(
  req: Request,
  headers: Record<string, string>,
  options?: { authorizedEmail?: string }
): Promise<RequireAuthResult> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      ok: false,
      reason: "missing_bearer",
      response: new Response(JSON.stringify({ error: "Autenticação necessária" }), {
        status: 401,
        headers,
      }),
    };
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return {
      ok: false,
      reason: "missing_bearer",
      response: new Response(JSON.stringify({ error: "Autenticação necessária" }), {
        status: 401,
        headers,
      }),
    };
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      ok: false,
      reason: "misconfigured",
      response: new Response(JSON.stringify({ error: "Sistema não configurado" }), {
        status: 500,
        headers,
      }),
    };
  }

  // Validate JWT explicitly (verify_jwt=false in config).
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return {
      ok: false,
      reason: "invalid_token",
      response: new Response(JSON.stringify({ error: "Autenticação inválida" }), {
        status: 401,
        headers,
      }),
    };
  }

  const userEmail = data.user.email ?? null;
  const authorizedEmail = options?.authorizedEmail;
  if (authorizedEmail && userEmail) {
    if (normalizeEmail(userEmail) !== normalizeEmail(authorizedEmail)) {
      return {
        ok: false,
        reason: "unauthorized_email",
        response: new Response(JSON.stringify({ error: "Acesso negado" }), {
          status: 403,
          headers,
        }),
      };
    }
  }

  return {
    ok: true,
    authHeader,
    token,
    user: { id: data.user.id, email: userEmail },
  };
}
