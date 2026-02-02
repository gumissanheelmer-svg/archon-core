import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// Authorized email - validated on both client and server
const AUTHORIZED_EMAIL = "gumissanheelmer@gmail.com";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Validate that the authenticated user is authorized
        if (session?.user?.email?.toLowerCase() !== AUTHORIZED_EMAIL.toLowerCase()) {
          // Unauthorized user - sign them out
          if (session) {
            await supabase.auth.signOut();
          }
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Validate that the authenticated user is authorized
      if (session?.user?.email?.toLowerCase() !== AUTHORIZED_EMAIL.toLowerCase()) {
        // Unauthorized user
        setSession(null);
        setUser(null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      // Client-side validation - only authorized email can attempt login
      if (email.toLowerCase().trim() !== AUTHORIZED_EMAIL.toLowerCase()) {
        return { error: "Credenciais inválidas" };
      }

      // Attempt to sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        // Generic error - don't reveal details
        return { error: "Credenciais inválidas" };
      }

      // Double-check the authenticated user is authorized
      if (data.user?.email?.toLowerCase() !== AUTHORIZED_EMAIL.toLowerCase()) {
        await supabase.auth.signOut();
        return { error: "Credenciais inválidas" };
      }

      return { error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: "Erro de conexão" };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!session && user?.email?.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
