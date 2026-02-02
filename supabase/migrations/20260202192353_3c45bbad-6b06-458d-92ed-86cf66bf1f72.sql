-- Enum para categorias de memória
CREATE TYPE public.memory_category AS ENUM ('identity', 'rules', 'learnings', 'preferences', 'context');

-- Enum para status de memória
CREATE TYPE public.memory_status AS ENUM ('active', 'superseded', 'deleted');

-- Tabela de memória estratégica
CREATE TABLE public.memory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
  user_id UUID NOT NULL,
  category public.memory_category NOT NULL DEFAULT 'context',
  content TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  version INTEGER NOT NULL DEFAULT 1,
  status public.memory_status NOT NULL DEFAULT 'active',
  superseded_by UUID REFERENCES public.memory_items(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memory_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Owner only
CREATE POLICY "Owner can view own memory"
ON public.memory_items
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Owner can create memory"
ON public.memory_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update own memory"
ON public.memory_items
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete own memory"
ON public.memory_items
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_memory_items_updated_at
BEFORE UPDATE ON public.memory_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index para queries frequentes
CREATE INDEX idx_memory_items_user_status ON public.memory_items(user_id, status);
CREATE INDEX idx_memory_items_category ON public.memory_items(user_id, category) WHERE status = 'active';