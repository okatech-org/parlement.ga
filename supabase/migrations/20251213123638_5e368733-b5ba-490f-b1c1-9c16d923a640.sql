-- Ajouter le rôle SENATOR à l'enum app_role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'senator';