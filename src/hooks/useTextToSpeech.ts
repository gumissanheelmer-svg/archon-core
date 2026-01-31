import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

type SpecialistType = "archon" | "akira" | "maya" | "chen" | "yuki";

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(null);
  }, []);

  const speak = useCallback(async (text: string, specialist: SpecialistType, id: string) => {
    // If already playing this one, stop it
    if (isPlaying === id) {
      stop();
      return;
    }

    // Stop any current playback
    stop();

    setIsLoading(id);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, specialist }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(null);
        URL.revokeObjectURL(audioUrl);
        toast.error("Erro ao reproduzir áudio");
      };

      setIsLoading(null);
      setIsPlaying(id);
      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setIsLoading(null);
      toast.error("Falha na síntese de voz");
    }
  }, [isPlaying, stop]);

  return { speak, stop, isPlaying, isLoading };
};
