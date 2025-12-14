import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DonutChartData {
    label: string;
    value: number;
    color: string;
}

interface InteractiveDonutChartProps {
    data: DonutChartData[];
    size?: number;
    thickness?: number;
    className?: string;
    centerLabel?: string;
    centerValue?: string | number;
    showLegend?: boolean;
}

/**
 * Graphique en anneau (donut chart) interactif
 * Avec survol pour afficher les détails
 */
const InteractiveDonutChart = ({
    data,
    size = 200,
    thickness = 40,
    className,
    centerLabel,
    centerValue,
    showLegend = true,
}: InteractiveDonutChartProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const centerX = size / 2;
    const centerY = size / 2;

    // Calcul des segments
    let cumulativePercent = 0;
    const segments = data.map((item, index) => {
        const percent = (item.value / total) * 100;
        const dashLength = (percent / 100) * circumference;
        const dashOffset = circumference - (cumulativePercent / 100) * circumference;
        cumulativePercent += percent;

        return {
            ...item,
            percent,
            dashLength,
            dashOffset,
            index,
        };
    });

    const hoveredItem = hoveredIndex !== null ? segments[hoveredIndex] : null;

    return (
        <div className={cn("flex flex-col items-center gap-4", className)}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="transform -rotate-90"
                >
                    {/* Fond gris */}
                    <circle
                        cx={centerX}
                        cy={centerY}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={thickness}
                        className="text-muted/20"
                    />

                    {/* Segments */}
                    {segments.map((segment) => (
                        <motion.circle
                            key={segment.index}
                            cx={centerX}
                            cy={centerY}
                            r={radius}
                            fill="none"
                            stroke={segment.color}
                            strokeWidth={
                                hoveredIndex === segment.index ? thickness + 8 : thickness
                            }
                            strokeDasharray={`${segment.dashLength} ${circumference}`}
                            strokeDashoffset={segment.dashOffset}
                            strokeLinecap="round"
                            className="cursor-pointer transition-all duration-200"
                            style={{
                                filter:
                                    hoveredIndex === segment.index
                                        ? "brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                                        : "none",
                                opacity:
                                    hoveredIndex !== null && hoveredIndex !== segment.index
                                        ? 0.5
                                        : 1,
                            }}
                            onMouseEnter={() => setHoveredIndex(segment.index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: segment.dashOffset }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: segment.index * 0.1 }}
                        />
                    ))}
                </svg>

                {/* Centre */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    {hoveredItem ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-2"
                        >
                            <p className="text-2xl font-bold text-foreground">
                                {hoveredItem.value.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {hoveredItem.label}
                            </p>
                            <p className="text-sm font-medium" style={{ color: hoveredItem.color }}>
                                {hoveredItem.percent.toFixed(1)}%
                            </p>
                        </motion.div>
                    ) : (
                        <div>
                            {centerValue && (
                                <p className="text-2xl font-bold text-foreground">
                                    {centerValue}
                                </p>
                            )}
                            {centerLabel && (
                                <p className="text-xs text-muted-foreground">{centerLabel}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Légende */}
            {showLegend && (
                <div className="flex flex-wrap justify-center gap-3">
                    {segments.map((segment) => (
                        <motion.div
                            key={segment.index}
                            className={cn(
                                "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-all",
                                hoveredIndex === segment.index && "bg-muted"
                            )}
                            onMouseEnter={() => setHoveredIndex(segment.index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: segment.color }}
                            />
                            <span className="text-sm text-muted-foreground">
                                {segment.label}
                            </span>
                            <span className="text-sm font-medium">
                                {segment.percent.toFixed(0)}%
                            </span>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InteractiveDonutChart;
