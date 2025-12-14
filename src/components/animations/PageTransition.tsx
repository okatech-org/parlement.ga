import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
    children: ReactNode;
    mode?: "fade" | "slide" | "scale" | "slideUp";
}

/**
 * Composant d'animation de transition entre les pages
 * Enveloppe le contenu de la page pour ajouter des animations fluides
 */
const PageTransition = ({ children, mode = "fade" }: PageTransitionProps) => {
    const location = useLocation();

    const variants = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        slide: {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
        },
        slideUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
        },
        scale: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 1.05 },
        },
    };

    const selectedVariant = variants[mode];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={selectedVariant.initial}
                animate={selectedVariant.animate}
                exit={selectedVariant.exit}
                transition={{
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1]
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

/**
 * Animation pour les cartes au chargement
 */
export const AnimatedCard = ({
    children,
    delay = 0,
    className = ""
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
            duration: 0.4,
            delay,
            ease: [0.25, 0.1, 0.25, 1]
        }}
        className={className}
    >
        {children}
    </motion.div>
);

/**
 * Animation de stagger pour les listes
 */
export const AnimatedList = ({
    children,
    staggerDelay = 0.1,
    className = ""
}: {
    children: ReactNode[];
    staggerDelay?: number;
    className?: string;
}) => (
    <motion.div
        className={className}
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
    >
        {children.map((child, index) => (
            <motion.div
                key={index}
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3 }}
            >
                {child}
            </motion.div>
        ))}
    </motion.div>
);

/**
 * Animation de pulse pour les badges/alertes
 */
export const PulseAnimation = ({ children }: { children: ReactNode }) => (
    <motion.div
        animate={{
            scale: [1, 1.02, 1],
            opacity: [1, 0.8, 1]
        }}
        transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    >
        {children}
    </motion.div>
);

/**
 * Animation de changement de rôle
 */
export const RoleChangeAnimation = ({
    children,
    role
}: {
    children: ReactNode;
    role: string;
}) => (
    <AnimatePresence mode="wait">
        <motion.div
            key={role}
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    </AnimatePresence>
);

/**
 * Animation de compteur numérique
 */
export const AnimatedCounter = ({
    value,
    duration = 1
}: {
    value: number;
    duration?: number;
}) => (
    <motion.span
        key={value}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        {value}
    </motion.span>
);

export default PageTransition;
