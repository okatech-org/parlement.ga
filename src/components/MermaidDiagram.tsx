import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MermaidDiagramProps {
    chart: string;
    title?: string;
    className?: string;
}

const MermaidDiagram = ({ chart, title, className = '' }: MermaidDiagramProps) => {
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
                    className="flex justify-center"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            </CardContent>
        </Card>
    );
};

export default MermaidDiagram;
