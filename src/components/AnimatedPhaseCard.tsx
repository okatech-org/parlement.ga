import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowDown, LucideIcon } from 'lucide-react';

interface PhaseStep {
    phase: string;
    title: string;
    duration: string;
    icon: LucideIcon;
    color: string;
    description: string;
    details: string[];
}

interface AnimatedPhaseCardProps {
    step: PhaseStep;
    index: number;
    isLast: boolean;
    variant?: 'default' | 'assembly' | 'senate';
}

const AnimatedPhaseCard = ({ step, index, isLast, variant = 'default' }: AnimatedPhaseCardProps) => {
    const Icon = step.icon;

    const checkColor = variant === 'assembly' ? 'text-emerald-500' : 'text-green-500';
    const textColor = variant === 'assembly' ? 'text-gray-600 dark:text-gray-400' : 'text-muted-foreground';
    const detailTextColor = variant === 'assembly' ? 'text-gray-700 dark:text-gray-300' : '';
    const arrowBg = variant === 'assembly' ? 'bg-gray-50 dark:bg-gray-800' : 'bg-muted/30';
    const arrowColor = variant === 'assembly' ? 'text-gray-400' : 'text-muted-foreground';

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100
            }}
        >
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row">
                    <motion.div
                        className={`${step.color} p-6 md:w-64 flex flex-col justify-center items-center text-white`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                    >
                        <Badge className="mb-2 bg-white/20 text-white border-0">
                            {step.phase}
                        </Badge>
                        <motion.div
                            initial={{ rotate: -180, opacity: 0 }}
                            whileInView={{ rotate: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                        >
                            <Icon className="h-10 w-10 mb-2" />
                        </motion.div>
                        <h3 className="font-bold text-center">{step.title}</h3>
                        <span className="text-sm opacity-80">{step.duration}</span>
                    </motion.div>
                    <div className="p-6 flex-1">
                        <p className={`${textColor} mb-4`}>{step.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(Array.isArray(step.details) ? step.details : []).map((detail, idx) => (
                                <motion.div
                                    key={idx}
                                    className="flex items-center gap-2 text-sm"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 + 0.4 + idx * 0.05 }}
                                >
                                    <CheckCircle className={`h-4 w-4 ${checkColor} flex-shrink-0`} />
                                    <span className={detailTextColor}>{detail}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
                {!isLast && (
                    <motion.div
                        className={`flex justify-center py-2 ${arrowBg}`}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                    >
                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ArrowDown className={`h-5 w-5 ${arrowColor}`} />
                        </motion.div>
                    </motion.div>
                )}
            </Card>
        </motion.div>
    );
};

export default AnimatedPhaseCard;