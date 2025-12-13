import React from "react";
import { TrendingUp, LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    color?: string;
    theme?: any; // Keeping theme prop for compatibility with prompt, though we use global CSS vars
}

export const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => {
    return (
        <div className="neu-raised p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Icon size={20} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-success text-sm font-medium">
                        <TrendingUp size={14} />
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        </div>
    );
};

interface SectionCardProps {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    theme?: any;
}

export const SectionCard = ({ title, children, action }: SectionCardProps) => {
    return (
        <div className="neu-card p-6 rounded-2xl border border-white/50 dark:border-white/10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                {action}
            </div>
            {children}
        </div>
    );
};
