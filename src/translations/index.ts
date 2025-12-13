import { fr } from './fr';
import { en } from './en';
import { es } from './es';
import { ar } from './ar';
import { pt } from './pt';

export const translations = {
    fr,
    en,
    es,
    ar,
    pt
};

export type Language = 'fr' | 'en' | 'es' | 'ar' | 'pt';
export type TranslationKey = string; // In a real app, we would use a recursive keyof type
