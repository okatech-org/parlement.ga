-- Create table for storing message feedback
CREATE TABLE public.message_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id TEXT NOT NULL,
  session_id UUID REFERENCES public.conversation_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_type TEXT CHECK (feedback_type IN ('helpful', 'not_helpful', 'accurate', 'inaccurate', 'other')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.message_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can create feedback for their messages"
ON public.message_feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
ON public.message_feedback
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
ON public.message_feedback
FOR UPDATE
USING (auth.uid() = user_id);

-- Enable realtime for feedback aggregation
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_feedback;