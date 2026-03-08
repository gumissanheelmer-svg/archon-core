import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export type PlatformType = "instagram" | "tiktok" | "facebook" | "whatsapp" | "website";

export interface Connection {
  id: string;
  platform: PlatformType;
  display_name: string;
  identifier: string;
  metadata: Record<string, any>;
  status: string;
  last_analyzed_at: string | null;
  created_at: string;
}

export interface CampaignResult {
  id: string;
  connection_id: string | null;
  campaign_name: string;
  platform: string;
  metrics: Record<string, any>;
  result: string;
  learnings: string[] | null;
  created_at: string;
}

export const PLATFORM_INFO: Record<PlatformType, { label: string; emoji: string; placeholder: string }> = {
  instagram: { label: "Instagram", emoji: "📸", placeholder: "@usuario ou URL do perfil" },
  tiktok: { label: "TikTok", emoji: "🎵", placeholder: "@usuario ou URL do perfil" },
  facebook: { label: "Facebook", emoji: "📘", placeholder: "URL da página ou perfil" },
  whatsapp: { label: "WhatsApp", emoji: "💬", placeholder: "Número com DDD (ex: +5511999999999)" },
  website: { label: "Website", emoji: "🌐", placeholder: "URL do site (ex: https://agendasmart.com)" },
};

export const useConnections = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    if (!user) { setConnections([]); setLoading(false); return; }
    try {
      const { data, error } = await (supabase as any).from("connections").select("*").eq("status", "active").order("created_at", { ascending: false });
      if (error) throw error;
      setConnections(data || []);
    } catch (e) {
      console.warn("Error fetching connections:", e);
      setConnections([]);
    } finally { setLoading(false); }
  }, [user]);

  const fetchCampaigns = useCallback(async () => {
    if (!user) { setCampaigns([]); return; }
    try {
      const { data, error } = await (supabase as any).from("campaign_results").select("*").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      setCampaigns(data || []);
    } catch (e) {
      console.warn("Error fetching campaigns:", e);
      setCampaigns([]);
    }
  }, [user]);

  useEffect(() => { fetchConnections(); fetchCampaigns(); }, [fetchConnections, fetchCampaigns]);

  const addConnection = async (platform: PlatformType, displayName: string, identifier: string, metadata?: Record<string, any>) => {
    if (!user) return null;
    try {
      const { data, error } = await (supabase as any).from("connections").insert({
        user_id: user.id, platform, display_name: displayName, identifier, metadata: metadata || {},
      }).select().single();
      if (error) throw error;
      await fetchConnections();
      toast({ title: "Conexão adicionada", description: `${PLATFORM_INFO[platform].label} conectado com sucesso.` });
      return data;
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível adicionar a conexão.", variant: "destructive" });
      return null;
    }
  };

  const removeConnection = async (id: string) => {
    if (!user) return false;
    try {
      const { error } = await (supabase as any).from("connections").update({ status: "inactive" }).eq("id", id);
      if (error) throw error;
      await fetchConnections();
      toast({ title: "Conexão removida" });
      return true;
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível remover.", variant: "destructive" });
      return false;
    }
  };

  const addCampaignResult = async (
    campaignName: string, platform: string, metrics: Record<string, any>,
    result: string, learnings?: string[], connectionId?: string
  ) => {
    if (!user) return null;
    try {
      const { data, error } = await (supabase as any).from("campaign_results").insert({
        user_id: user.id, campaign_name: campaignName, platform, metrics,
        result, learnings: learnings || [], connection_id: connectionId || null,
      }).select().single();
      if (error) throw error;
      await fetchCampaigns();
      return data;
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível registar resultado.", variant: "destructive" });
      return null;
    }
  };

  return { connections, campaigns, loading, addConnection, removeConnection, addCampaignResult, refresh: fetchConnections };
};
