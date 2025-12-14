import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Download, X } from 'lucide-react';

interface MermaidDiagramProps {
    chart: string;
    title?: string;
    className?: string;
    onNodeClick?: (nodeId: string) => void;
    animationDelay?: number;
}

const MermaidDiagram = ({ chart, title, className = '', onNodeClick, animationDelay = 0 }: MermaidDiagramProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fullscreenRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!containerRef.current) return;

            try {
                const isDark = document.documentElement.classList.contains('dark');
                
                mermaid.initialize({
                    startOnLoad: false,
                    theme: isDark ? 'dark' : 'default',
                    securityLevel: 'loose',
                    flowchart: {
                        useMaxWidth: true,
                        htmlLabels: true,
                        curve: 'basis',
                    },
                });

                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
                setError(null);
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError('Erreur de rendu du diagramme');
            }
        };

        renderDiagram();
    }, [chart]);

    // Handle click events on nodes
    useEffect(() => {
        if (!containerRef.current || !onNodeClick) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const node = target.closest('.node');
            if (node) {
                const nodeId = node.id?.replace('flowchart-', '').split('-')[0];
                if (nodeId) {
                    onNodeClick(nodeId);
                }
            }
        };

        const container = containerRef.current;
        container.addEventListener('click', handleClick);
        return () => container.removeEventListener('click', handleClick);
    }, [onNodeClick, svg]);

    // Keyboard navigation in fullscreen
    useEffect(() => {
        if (!isFullscreen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    setIsFullscreen(false);
                    break;
                case '+':
                case '=':
                    setZoom(z => Math.min(z + 0.25, 3));
                    break;
                case '-':
                    setZoom(z => Math.max(z - 0.25, 0.5));
                    break;
                case '0':
                    setZoom(1);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    // Export as PNG
    const exportAsPNG = useCallback(() => {
        if (!svg) return;
        
        const svgElement = containerRef.current?.querySelector('svg');
        if (!svgElement) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            ctx?.scale(2, 2);
            ctx?.drawImage(img, 0, 0);
            
            const link = document.createElement('a');
            link.download = `${title || 'diagramme'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            URL.revokeObjectURL(url);
        };

        img.src = url;
    }, [svg, title]);

    if (error) {
        return (
            <Card className={`border-destructive ${className}`}>
                <CardContent className="p-4 text-destructive text-center">
                    {error}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: animationDelay }}
            >
                <Card className={className}>
                    {title && (
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">{title}</CardTitle>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={exportAsPNG}
                                    title="Exporter en PNG"
                                    className="h-8 w-8"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsFullscreen(true)}
                                    title="Plein écran (Echap pour fermer)"
                                    className="h-8 w-8"
                                >
                                    <Maximize2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                    )}
                    <CardContent className="p-4 overflow-x-auto">
                        <div
                            ref={containerRef}
                            className={`flex justify-center ${onNodeClick ? 'cursor-pointer [&_.node]:hover:opacity-80 [&_.node]:transition-opacity' : ''}`}
                            dangerouslySetInnerHTML={{ __html: svg }}
                        />
                    </CardContent>
                </Card>
            </motion.div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        ref={fullscreenRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-bold">{title || 'Diagramme'}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground mr-4">
                                    Utilisez +/- pour zoomer, 0 pour réinitialiser, Echap pour fermer
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium w-16 text-center">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setZoom(z => Math.min(z + 0.25, 3))}
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={exportAsPNG}
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsFullscreen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Diagram */}
                        <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                            <motion.div
                                animate={{ scale: zoom }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className={`${onNodeClick ? 'cursor-pointer [&_.node]:hover:opacity-80 [&_.node]:transition-opacity' : ''}`}
                                dangerouslySetInnerHTML={{ __html: svg }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MermaidDiagram;