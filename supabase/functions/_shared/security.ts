// Security utilities for ARCHON edge functions
// Provides IP allowlist, rate limiting, and audit logging

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface SecurityCheckResult {
  allowed: boolean;
  reason?: string;
  statusCode?: number;
}

// In-memory rate limit store (resets on cold start - acceptable for personal use)
const rateLimitStore = new Map<string, { count: number; resetAt: number; blockedUntil?: number }>();

// CIDR matching utility
function ipMatchesCIDR(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split('/');
  const mask = bits ? parseInt(bits, 10) : 32;
  
  const ipParts = ip.split('.').map(Number);
  const rangeParts = range.split('.').map(Number);
  
  if (ipParts.length !== 4 || rangeParts.length !== 4) return false;
  
  const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const rangeNum = (rangeParts[0] << 24) | (rangeParts[1] << 16) | (rangeParts[2] << 8) | rangeParts[3];
  const maskNum = ~((1 << (32 - mask)) - 1);
  
  return (ipNum & maskNum) === (rangeNum & maskNum);
}

// Extract client IP from request
export function getClientIP(req: Request): string {
  // Check standard headers (Cloudflare, proxies)
  const cfIP = req.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;
  
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) return realIP;
  
  return 'unknown';
}

// Check IP allowlist
export function checkIPAllowlist(ip: string): SecurityCheckResult {
  const enabled = Deno.env.get('SECURITY_IP_ALLOWLIST_ENABLED');
  
  // If not enabled, allow all
  if (enabled?.toLowerCase() !== 'true') {
    return { allowed: true };
  }
  
  const allowlist = Deno.env.get('SECURITY_IP_ALLOWLIST');
  if (!allowlist) {
    // If enabled but no list configured, block for safety
    console.warn('[SECURITY] IP allowlist enabled but no IPs configured');
    return { allowed: false, reason: 'ip_not_allowed', statusCode: 403 };
  }
  
  const allowedCIDRs = allowlist.split(',').map(s => s.trim()).filter(Boolean);
  
  for (const cidr of allowedCIDRs) {
    if (ipMatchesCIDR(ip, cidr)) {
      return { allowed: true };
    }
  }
  
  // Log blocked attempt (without revealing the blocklist)
  console.warn(`[SECURITY] IP blocked: ${ip.substring(0, 8)}*** at ${new Date().toISOString()}`);
  
  return { allowed: false, reason: 'ip_not_allowed', statusCode: 403 };
}

// Rate limiting check
export function checkRateLimit(
  identifier: string,
  route: string,
  config: RateLimitConfig
): SecurityCheckResult {
  const key = `${route}:${identifier}`;
  const now = Date.now();
  
  let entry = rateLimitStore.get(key);
  
  // Check if blocked
  if (entry?.blockedUntil && now < entry.blockedUntil) {
    const remainingMs = entry.blockedUntil - now;
    console.warn(`[RATE_LIMIT] Blocked: ${key.substring(0, 20)}*** until ${new Date(entry.blockedUntil).toISOString()}`);
    return { 
      allowed: false, 
      reason: `rate_limited:${Math.ceil(remainingMs / 1000)}s`, 
      statusCode: 429 
    };
  }
  
  // Reset if window expired
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + config.windowMs };
    rateLimitStore.set(key, entry);
  }
  
  entry.count++;
  
  if (entry.count > config.maxRequests) {
    // Apply progressive blocking for auth routes
    if (route.includes('auth') && config.blockDurationMs) {
      const blockMultiplier = Math.min(entry.count - config.maxRequests, 5);
      entry.blockedUntil = now + (config.blockDurationMs * blockMultiplier);
    }
    
    console.warn(`[RATE_LIMIT] Exceeded: ${key.substring(0, 20)}*** count=${entry.count}`);
    return { allowed: false, reason: 'rate_limit_exceeded', statusCode: 429 };
  }
  
  return { allowed: true };
}

// Validate payload size and structure
export function validatePayload(
  body: unknown,
  maxFieldLength: number = 4000
): SecurityCheckResult {
  if (!body || typeof body !== 'object') {
    return { allowed: false, reason: 'invalid_payload', statusCode: 400 };
  }
  
  const checkValue = (value: unknown, path: string): string | null => {
    if (typeof value === 'string' && value.length > maxFieldLength) {
      return `Field ${path} exceeds maximum length of ${maxFieldLength} characters`;
    }
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const err = checkValue(value[i], `${path}[${i}]`);
        if (err) return err;
      }
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const [k, v] of Object.entries(value)) {
        const err = checkValue(v, `${path}.${k}`);
        if (err) return err;
      }
    }
    return null;
  };
  
  const error = checkValue(body, 'root');
  if (error) {
    return { allowed: false, reason: error, statusCode: 400 };
  }
  
  return { allowed: true };
}

// Audit logging (minimal, no sensitive data)
export function auditLog(
  event: string,
  metadata: Record<string, unknown>
): void {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ...metadata,
  };
  
  // Remove any sensitive fields that might have been passed
  delete (entry as Record<string, unknown>).password;
  delete (entry as Record<string, unknown>).token;
  delete (entry as Record<string, unknown>).api_key;
  delete (entry as Record<string, unknown>).apiKey;
  delete (entry as Record<string, unknown>).secret;
  
  console.log(`[AUDIT] ${JSON.stringify(entry)}`);
}

// Security headers
export function getSecurityHeaders(origin?: string): Record<string, string> {
  const allowedOriginEnv = Deno.env.get('ARCHON_ALLOWED_ORIGIN') || '*';

  const isLovableOrigin = (value: string) => {
    try {
      const url = new URL(value);
      // Only allow https origins from the Lovable platform domains.
      return (
        url.protocol === 'https:' &&
        (url.hostname.endsWith('.lovable.app') || url.hostname.endsWith('.lovableproject.com'))
      );
    } catch {
      return false;
    }
  };

  let allowOrigin = '*';
  if (origin) {
    if (isLovableOrigin(origin)) {
      // Allow the current preview/published origin to avoid CORS preflight failures.
      allowOrigin = origin;
    } else if (allowedOriginEnv === '*') {
      allowOrigin = '*';
    } else {
      const allowed = allowedOriginEnv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      allowOrigin = allowed.includes(origin) ? origin : 'null';
    }
  } else {
    // Non-browser clients may not send Origin.
    allowOrigin = allowedOriginEnv === '*' ? '*' : allowedOriginEnv.split(',')[0] || '*';
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Content-Type': 'application/json',
  };
}

// Full security check pipeline
export async function runSecurityChecks(
  req: Request,
  route: string,
  rateLimitConfig: RateLimitConfig
): Promise<{ passed: boolean; response?: Response; ip: string }> {
  const ip = getClientIP(req);
  const headers = getSecurityHeaders(req.headers.get('origin') || undefined);
  
  // 1. IP Allowlist check
  const ipCheck = checkIPAllowlist(ip);
  if (!ipCheck.allowed) {
    auditLog('ip_blocked', { ip: ip.substring(0, 8) + '***', route });
    return {
      passed: false,
      ip,
      response: new Response(
        JSON.stringify({ error: 'Acesso não autorizado' }),
        { status: ipCheck.statusCode || 403, headers }
      ),
    };
  }
  
  // 2. Rate limit check
  const rateCheck = checkRateLimit(ip, route, rateLimitConfig);
  if (!rateCheck.allowed) {
    auditLog('rate_limited', { ip: ip.substring(0, 8) + '***', route });
    return {
      passed: false,
      ip,
      response: new Response(
        JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente mais tarde.' }),
        { status: rateCheck.statusCode || 429, headers }
      ),
    };
  }
  
  return { passed: true, ip };
}

// Sanitize output to prevent XSS
export function sanitizeOutput(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
