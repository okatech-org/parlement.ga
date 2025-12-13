-- Enable realtime for conversation tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_messages;

-- Add full replica identity for complete row data in realtime
ALTER TABLE public.conversation_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.conversation_messages REPLICA IDENTITY FULL;