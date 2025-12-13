-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'deputy', 'president', 'questeur', 'secretary', 'vp', 'substitute', 'citizen');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create organizations table
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'other',
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizations are viewable by everyone"
ON public.organizations
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage organizations"
ON public.organizations
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create requests table
CREATE TABLE public.requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    priority TEXT NOT NULL DEFAULT 'normal',
    assigned_to UUID REFERENCES auth.users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own requests"
ON public.requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests"
ON public.requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests"
ON public.requests
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests"
ON public.requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all requests"
ON public.requests
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create login_attempts table for security tracking
CREATE TABLE public.login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    success BOOLEAN NOT NULL DEFAULT false,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view login attempts"
ON public.login_attempts
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert login attempts"
ON public.login_attempts
FOR INSERT
WITH CHECK (true);

-- Add trigger for updated_at on new tables
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically assign default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'user');
    RETURN new;
END;
$$;

-- Trigger to assign default role on user creation
CREATE TRIGGER on_auth_user_created_role
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();