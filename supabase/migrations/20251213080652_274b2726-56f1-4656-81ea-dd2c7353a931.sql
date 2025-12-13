-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create conversation_sessions table
CREATE TABLE public.conversation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Conversation iAsted',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on conversation_sessions
ALTER TABLE public.conversation_sessions ENABLE ROW LEVEL SECURITY;

-- Conversation sessions policies
CREATE POLICY "Users can view their own sessions" 
ON public.conversation_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
ON public.conversation_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON public.conversation_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" 
ON public.conversation_sessions FOR DELETE USING (auth.uid() = user_id);

-- Create conversation_messages table
CREATE TABLE public.conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.conversation_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on conversation_messages
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- Conversation messages policies (join with sessions to check ownership)
CREATE POLICY "Users can view their own messages" 
ON public.conversation_messages FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_sessions 
        WHERE id = conversation_messages.session_id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can create messages in their sessions" 
ON public.conversation_messages FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.conversation_sessions 
        WHERE id = conversation_messages.session_id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete their own messages" 
ON public.conversation_messages FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_sessions 
        WHERE id = conversation_messages.session_id 
        AND user_id = auth.uid()
    )
);

-- Create documents table
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size BIGINT,
    storage_path TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "Users can view their own documents" 
ON public.documents FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents" 
ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" 
ON public.documents FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" 
ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversation_sessions_updated_at
BEFORE UPDATE ON public.conversation_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name)
    VALUES (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
    RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();