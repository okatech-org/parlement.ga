import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MermaidDiagramProps {
    chart: string;
    title?: string;
    className?: string;
    onNodeClick?: (nodeId: string) => void;
}

const MermaidDiagram = ({ chart, title, className = '', onNodeClick }: MermaidDiagramProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!containerRef.current) return;

            try {
                // Check if dark mode is active
                const isDark = document.documentElement.classList.contains('dark');
                
                // Initialize mermaid with theme
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
        <Card className={className}>
            {title && (
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{title}</CardTitle>
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
    );
};

export default MermaidDiagram;
