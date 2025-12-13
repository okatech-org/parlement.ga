-- Create conversation tags table
CREATE TABLE public.conversation_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'primary',
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, user_id)
);

-- Create junction table for session-tag relationships
CREATE TABLE public.conversation_session_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.conversation_sessions(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.conversation_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, tag_id)
);

-- Create favorite responses table
CREATE TABLE public.favorite_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message_id TEXT NOT NULL,
  session_id UUID REFERENCES public.conversation_sessions(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  title TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_session_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversation_tags
CREATE POLICY "Users can create their own tags"
ON public.conversation_tags FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tags"
ON public.conversation_tags FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
ON public.conversation_tags FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
ON public.conversation_tags FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for conversation_session_tags
CREATE POLICY "Users can tag their own sessions"
ON public.conversation_session_tags FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM conversation_sessions cs
  WHERE cs.id = session_id AND cs.user_id = auth.uid()
));

CREATE POLICY "Users can view tags on their sessions"
ON public.conversation_session_tags FOR SELECT
USING (EXISTS (
  SELECT 1 FROM conversation_sessions cs
  WHERE cs.id = session_id AND cs.user_id = auth.uid()
));

CREATE POLICY "Users can remove tags from their sessions"
ON public.conversation_session_tags FOR DELETE
USING (EXISTS (
  SELECT 1 FROM conversation_sessions cs
  WHERE cs.id = session_id AND cs.user_id = auth.uid()
));

-- RLS Policies for favorite_responses
CREATE POLICY "Users can save favorites"
ON public.favorite_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their favorites"
ON public.favorite_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their favorites"
ON public.favorite_responses FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their favorites"
ON public.favorite_responses FOR DELETE
USING (auth.uid() = user_id);