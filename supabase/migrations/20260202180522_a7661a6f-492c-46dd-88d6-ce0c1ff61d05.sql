-- =============================================
-- ARCHON Data Model: Objects & Sessions
-- Prepared for SaaS (tenant_id) but single-user now
-- =============================================

-- Create enum for object status
CREATE TYPE public.object_status AS ENUM ('draft', 'active', 'archived');

-- Create enum for session status
CREATE TYPE public.session_status AS ENUM ('created', 'processing', 'completed', 'failed');

-- Create enum for time horizon
CREATE TYPE public.time_horizon AS ENUM ('curto', 'medio', 'longo');

-- Create enum for action priority
CREATE TYPE public.action_priority AS ENUM ('alta', 'media', 'baixa');

-- Create enum for action status
CREATE TYPE public.action_status AS ENUM ('pending', 'in_progress', 'done', 'skipped');

-- =============================================
-- OBJECTS TABLE (Objeto em Análise)
-- =============================================
CREATE TABLE public.objects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid, -- Fixed for single-tenant, ready for SaaS
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  context TEXT, -- Current situation/context
  objective TEXT, -- Current main objective
  horizon time_horizon NOT NULL DEFAULT 'medio',
  status object_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.objects ENABLE ROW LEVEL SECURITY;

-- Policies: Only owner can access their objects
CREATE POLICY "Owner can view own objects"
  ON public.objects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owner can create objects"
  ON public.objects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update own objects"
  ON public.objects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete own objects"
  ON public.objects FOR DELETE
  USING (auth.uid() = user_id);

-- Index for active object lookup
CREATE INDEX idx_objects_active ON public.objects (user_id, status) WHERE status = 'active';

-- =============================================
-- SESSIONS TABLE (Análise do Conselho)
-- =============================================
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  object_id UUID NOT NULL REFERENCES public.objects(id) ON DELETE CASCADE,
  question TEXT NOT NULL, -- User's question/input
  horizon time_horizon NOT NULL,
  status session_status NOT NULL DEFAULT 'created',
  
  -- Structured response from ARCHON
  archon_sintese TEXT,
  akira_estrategia TEXT,
  maya_conteudo TEXT,
  chen_dados TEXT,
  yuki_psicologia TEXT,
  
  -- Metadata
  processing_time_ms INTEGER,
  model_used TEXT,
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Owner can view own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owner can create sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update own sessions"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete own sessions"
  ON public.sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_sessions_object ON public.sessions (object_id, created_at DESC);
CREATE INDEX idx_sessions_user ON public.sessions (user_id, created_at DESC);

-- =============================================
-- PLAN_ACTIONS TABLE (Plano de Ação)
-- =============================================
CREATE TABLE public.plan_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  action_text TEXT NOT NULL,
  priority action_priority NOT NULL DEFAULT 'media',
  status action_status NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.plan_actions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Owner can view own actions"
  ON public.plan_actions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owner can create actions"
  ON public.plan_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update own actions"
  ON public.plan_actions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete own actions"
  ON public.plan_actions FOR DELETE
  USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_plan_actions_session ON public.plan_actions (session_id);
CREATE INDEX idx_plan_actions_status ON public.plan_actions (user_id, status) WHERE status != 'done';

-- =============================================
-- TRIGGER: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_objects_updated_at
  BEFORE UPDATE ON public.objects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plan_actions_updated_at
  BEFORE UPDATE ON public.plan_actions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- FUNCTION: Ensure only one active object per user
-- =============================================
CREATE OR REPLACE FUNCTION public.ensure_single_active_object()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting status to 'active', deactivate all other objects for this user
  IF NEW.status = 'active' THEN
    UPDATE public.objects 
    SET status = 'archived' 
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND status = 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER ensure_single_active_object_trigger
  BEFORE INSERT OR UPDATE OF status ON public.objects
  FOR EACH ROW EXECUTE FUNCTION public.ensure_single_active_object();