import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This function creates the initial authorized user
// Should only be run once during initial setup
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authorizedEmail = Deno.env.get("ARCHON_AUTHORIZED_EMAIL");
    const initialPassword = Deno.env.get("ARCHON_INITIAL_PASSWORD");
    
    if (!authorizedEmail || !initialPassword) {
      return new Response(
        JSON.stringify({ 
          error: "Secrets not configured",
          success: false 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(
      u => u.email?.toLowerCase() === authorizedEmail.toLowerCase()
    );

    if (userExists) {
      return new Response(
        JSON.stringify({ 
          message: "User already exists",
          success: true 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create the authorized user with password (hashed by Supabase)
    const { data, error } = await supabase.auth.admin.createUser({
      email: authorizedEmail.toLowerCase().trim(),
      password: initialPassword,
      email_confirm: true, // Auto-confirm email
    });

    if (error) {
      console.error("Error creating user:", error);
      return new Response(
        JSON.stringify({ 
          error: error.message,
          success: false 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: "Authorized user created successfully",
        success: true,
        userId: data.user?.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Setup error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Setup failed",
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
