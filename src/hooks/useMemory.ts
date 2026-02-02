import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export type MemoryCategory = "identity" | "rules" | "learnings" | "preferences" | "context";
export type MemoryStatus = "active" | "superseded" | "deleted";

export interface MemoryItem {
  id: string;
  category: MemoryCategory;
  content: string;
  priority: number;
  version: number;
  status: MemoryStatus;
  superseded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMemoryInput {
  category: MemoryCategory;
  content: string;
  priority?: number;
}

export interface UpdateMemoryInput {
  category?: MemoryCategory;
  content?: string;
  priority?: number;
}

// Category labels for UI
export const MEMORY_CATEGORY_LABELS: Record<MemoryCategory, string> = {
  identity: "Identidade do Projeto",
  rules: "Regras de Execução",
  learnings: "Aprendizados",
  preferences: "Preferências",
  context: "Contexto",
};

export const useMemory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all active memory items
  const fetchMemory = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("memory_items")
        .select("*")
        .eq("status", "active")
        .order("category")
        .order("priority", { ascending: false })
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setItems((data || []) as MemoryItem[]);
    } catch (error) {
      console.error("Error fetching memory:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a memória estratégica.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchMemory();
  }, [fetchMemory]);

  // Create a new memory item
  const createMemory = async (input: CreateMemoryInput): Promise<MemoryItem | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("memory_items")
        .insert({
          user_id: user.id,
          category: input.category,
          content: input.content,
          priority: input.priority || 1,
        })
        .select()
        .single();

      if (error) throw error;

      const newItem = data as MemoryItem;
      await fetchMemory();
      return newItem;
    } catch (error) {
      console.error("Error creating memory:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o item de memória.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update a memory item (creates new version if content changes)
  const updateMemory = async (
    id: string,
    input: UpdateMemoryInput,
    createVersion = false
  ): Promise<MemoryItem | null> => {
    if (!user) return null;

    try {
      if (createVersion && input.content) {
        // Get the current item
        const currentItem = items.find((item) => item.id === id);
        if (!currentItem) throw new Error("Item não encontrado");

        // Mark current as superseded and create new version
        const { data: newItem, error: createError } = await supabase
          .from("memory_items")
          .insert({
            user_id: user.id,
            category: input.category || currentItem.category,
            content: input.content,
            priority: input.priority ?? currentItem.priority,
            version: currentItem.version + 1,
          })
          .select()
          .single();

        if (createError) throw createError;

        // Update old item to superseded
        await supabase
          .from("memory_items")
          .update({
            status: "superseded" as MemoryStatus,
            superseded_by: newItem.id,
          })
          .eq("id", id);

        await fetchMemory();
        return newItem as MemoryItem;
      } else {
        // Simple update without versioning
        const { data, error } = await supabase
          .from("memory_items")
          .update(input)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        await fetchMemory();
        return data as MemoryItem;
      }
    } catch (error) {
      console.error("Error updating memory:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item de memória.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Soft delete a memory item (mark as deleted)
  const deleteMemory = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("memory_items")
        .update({ status: "deleted" as MemoryStatus })
        .eq("id", id);

      if (error) throw error;

      await fetchMemory();
      return true;
    } catch (error) {
      console.error("Error deleting memory:", error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar o item de memória.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get memory brief for ARCHON context (compacted bullet points)
  const getMemoryBrief = useCallback((): string => {
    if (items.length === 0) return "";

    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<MemoryCategory, MemoryItem[]>);

    const lines: string[] = [];

    // Order: identity first, then rules, preferences, learnings, context
    const categoryOrder: MemoryCategory[] = ["identity", "rules", "preferences", "learnings", "context"];

    for (const category of categoryOrder) {
      const categoryItems = grouped[category];
      if (categoryItems && categoryItems.length > 0) {
        lines.push(`## ${MEMORY_CATEGORY_LABELS[category]}`);
        // Take top items by priority (max 5 per category)
        const topItems = categoryItems.slice(0, 5);
        topItems.forEach((item) => {
          lines.push(`- ${item.content}`);
        });
        lines.push("");
      }
    }

    return lines.join("\n").trim();
  }, [items]);

  // Get items by category
  const getItemsByCategory = useCallback(
    (category: MemoryCategory): MemoryItem[] => {
      return items.filter((item) => item.category === category);
    },
    [items]
  );

  return {
    items,
    loading,
    createMemory,
    updateMemory,
    deleteMemory,
    getMemoryBrief,
    getItemsByCategory,
    refreshMemory: fetchMemory,
  };
};
