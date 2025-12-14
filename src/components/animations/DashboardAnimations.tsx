import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedDashboardCardProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    hover?: boolean;
}

/**
 * Carte de dashboard avec animation d'entrée fluide
 */
export const AnimatedDashboardCard = ({
    children,
    delay = 0,
    className,
    hover = true
}: AnimatedDashboardCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
            duration: 0.4,
            delay,
            ease: [0.25, 0.1, 0.25, 1]
        }}
        whileHover={hover ? {
            y: -4,
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)"
        } : undefined}
        className={cn("transition-shadow", className)}
    >
        {children}
    </motion.div>
);

interface AnimatedStatProps {
    value: number | string;
    label: string;
    icon?: ReactNode;
    trend?: { value: number; positive: boolean };
    delay?: number;
    className?: string;
}

/**
 * Statistique animée avec compteur
 */
export const AnimatedStat = ({
    value,
    label,
    icon,
    trend,
    delay = 0,
    className
}: AnimatedStatProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay }}
        className={cn("text-center", className)}
    >
        {icon && (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.1, type: "spring", stiffness: 200 }}
                className="mb-2"
            >
                {icon}
            </motion.div>
        )}
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2 }}
            className="text-3xl font-bold"
        >
            {value}
        </motion.div>
        <p className="text-sm text-muted-foreground">{label}</p>
        {trend && (
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.3 }}
                className={cn(
                    "text-xs font-medium",
                    trend.positive ? "text-green-500" : "text-red-500"
                )}
            >
                {trend.positive ? "+" : ""}{trend.value}%
            </motion.span>
        )}
    </motion.div>
);

interface AnimatedChartContainerProps {
    children: ReactNode;
    title?: string;
    delay?: number;
    className?: string;
}

/**
 * Container pour graphiques avec animation d'apparition
 */
export const AnimatedChartContainer = ({
    children,
    title,
    delay = 0,
    className
}: AnimatedChartContainerProps) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
            duration: 0.5,
            delay,
            ease: [0.25, 0.1, 0.25, 1]
        }}
        className={className}
    >
        {title && (
            <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.1 }}
                className="text-lg font-semibold mb-4"
            >
                {title}
            </motion.h3>
        )}
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.4 }}
        >
            {children}
        </motion.div>
    </motion.div>
);

interface AnimatedProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    color?: string;
    delay?: number;
    showValue?: boolean;
}

/**
 * Barre de progression animée
 */
export const AnimatedProgressBar = ({
    value,
    max = 100,
    label,
    color = "bg-primary",
    delay = 0,
    showValue = true
}: AnimatedProgressBarProps) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className="space-y-2">
            {(label || showValue) && (
                <div className="flex justify-between text-sm">
                    {label && <span className="text-muted-foreground">{label}</span>}
                    {showValue && <span className="font-medium">{value}/{max}</span>}
                </div>
            )}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                        duration: 0.8,
                        delay,
                        ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className={cn("h-full rounded-full", color)}
                />
            </div>
        </div>
    );
};

interface StaggeredListProps {
    children: ReactNode[];
    staggerDelay?: number;
    className?: string;
}

/**
 * Liste avec apparition décalée des éléments
 */
export const StaggeredList = ({
    children,
    staggerDelay = 0.1,
    className
}: StaggeredListProps) => (
    <motion.div
        initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: staggerDelay,
                },
            },
        }}
        className={className}
    >
        {children.map((child, index) => (
            <motion.div
                key={index}
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.3 }
                    },
                }}
            >
                {child}
            </motion.div>
        ))}
    </motion.div>
);

interface CountUpProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

/**
 * Compteur animé
 */
export const CountUp = ({
    end,
    duration = 1,
    prefix = "",
    suffix = "",
    className
}: CountUpProps) => {
    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={className}
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {prefix}
            </motion.span>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {end.toLocaleString()}
            </motion.span>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: duration }}
            >
                {suffix}
            </motion.span>
        </motion.span>
    );
};

export default {
    AnimatedDashboardCard,
    AnimatedStat,
    AnimatedChartContainer,
    AnimatedProgressBar,
    StaggeredList,
    CountUp,
};
