import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export type ObjectStatus = "draft" | "active" | "archived";
export type TimeHorizon = "curto" | "medio" | "longo";

export interface AnalysisObject {
  id: string;
  name: string;
  description: string | null;
  context: string | null;
  objective: string | null;
  horizon: TimeHorizon;
  status: ObjectStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateObjectInput {
  name: string;
  description?: string;
  context?: string;
  objective?: string;
  horizon?: TimeHorizon;
  status?: ObjectStatus;
}

export interface UpdateObjectInput {
  name?: string;
  description?: string;
  context?: string;
  objective?: string;
  horizon?: TimeHorizon;
  status?: ObjectStatus;
}

export const useObjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [objects, setObjects] = useState<AnalysisObject[]>([]);
  const [activeObject, setActiveObject] = useState<AnalysisObject | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all objects
  const fetchObjects = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("objects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      
      // Cast the data to match our interface
      const typedData = (data || []) as AnalysisObject[];
      setObjects(typedData);
      
      // Find and set active object
      const active = typedData.find((obj) => obj.status === "active");
      setActiveObject(active || null);
    } catch (error) {
      console.error("Error fetching objects:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os objetos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchObjects();
  }, [fetchObjects]);

  // Create a new object
  const createObject = async (input: CreateObjectInput): Promise<AnalysisObject | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("objects")
        .insert({
          user_id: user.id,
          name: input.name,
          description: input.description || null,
          context: input.context || null,
          objective: input.objective || null,
          horizon: input.horizon || "medio",
          status: input.status || "draft",
        })
        .select()
        .single();

      if (error) throw error;

      const newObject = data as AnalysisObject;
      await fetchObjects(); // Refresh list
      return newObject;
    } catch (error) {
      console.error("Error creating object:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o objeto.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update an object
  const updateObject = async (id: string, input: UpdateObjectInput): Promise<AnalysisObject | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("objects")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const updatedObject = data as AnalysisObject;
      await fetchObjects(); // Refresh list
      return updatedObject;
    } catch (error) {
      console.error("Error updating object:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o objeto.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Set an object as active (archives others automatically via trigger)
  const setObjectActive = async (id: string): Promise<boolean> => {
    const result = await updateObject(id, { status: "active" });
    return result !== null;
  };

  // Archive an object
  const archiveObject = async (id: string): Promise<boolean> => {
    const result = await updateObject(id, { status: "archived" });
    return result !== null;
  };

  // Delete an object
  const deleteObject = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("objects")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await fetchObjects(); // Refresh list
      return true;
    } catch (error) {
      console.error("Error deleting object:", error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar o objeto.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    objects,
    activeObject,
    loading,
    createObject,
    updateObject,
    setObjectActive,
    archiveObject,
    deleteObject,
    refreshObjects: fetchObjects,
  };
};
