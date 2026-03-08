
-- Connections table for storing platform connections (manual input)
CREATE TABLE public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'facebook', 'whatsapp', 'website')),
  display_name TEXT NOT NULL,
  identifier TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  last_analyzed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Campaign results table for continuous improvement loop
CREATE TABLE public.campaign_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
  user_id UUID NOT NULL,
  connection_id UUID REFERENCES public.connections(id) ON DELETE SET NULL,
  campaign_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  result TEXT NOT NULL DEFAULT 'pending' CHECK (result IN ('success', 'partial', 'failure', 'pending')),
  learnings TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for connections
CREATE POLICY "Owner can view own connections" ON public.connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owner can create connections" ON public.connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update own connections" ON public.connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete own connections" ON public.connections FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for campaign_results
CREATE POLICY "Owner can view own results" ON public.campaign_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owner can create results" ON public.campaign_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update own results" ON public.campaign_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete own results" ON public.campaign_results FOR DELETE USING (auth.uid() = user_id);
