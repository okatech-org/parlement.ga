import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type ProvinceCode = 'EST' | 'HOG' | 'MOG' | 'NGO' | 'NYA' | 'OGI' | 'OGL' | 'OGM' | 'WNT';

interface GabonMapProps {
  onProvinceClick?: (province: string) => void;
  selectedProvince?: string;
  className?: string;
}

/**
 * Carte interactive du Gabon (SVG Simplifié)
 * Permet de sélectionner une province
 */
const GabonMap = ({ onProvinceClick, selectedProvince, className }: GabonMapProps) => {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  // Données des provinces (Paths SVG approximatifs pour la démo)
  // Dans une vraie prod, on utiliserait un GeoJSON précis ou des paths SVG exacts
  const provinces = [
    {
      id: "EST",
      name: "Estuaire",
      color: "text-emerald-500",
      hoverColor: "fill-emerald-100",
      selectedColor: "fill-emerald-500 stroke-emerald-700",
      path: "M20,100 L60,80 L90,90 L80,130 L40,140 Z" // Forme simplifiée
    },
    {
      id: "WNT",
      name: "Woleu-Ntem",
      color: "text-amber-500",
      hoverColor: "fill-amber-100",
      selectedColor: "fill-amber-500 stroke-amber-700",
      path: "M90,90 L180,60 L220,100 L160,140 L80,130 Z"
    },
    {
      id: "OGI",
      name: "Ogooué-Ivindo",
      color: "text-blue-500",
      hoverColor: "fill-blue-100",
      selectedColor: "fill-blue-500 stroke-blue-700",
      path: "M160,140 L240,140 L220,220 L140,200 Z"
    },
    {
      id: "MOG",
      name: "Moyen-Ogooué",
      color: "text-indigo-500",
      hoverColor: "fill-indigo-100",
      selectedColor: "fill-indigo-500 stroke-indigo-700",
      path: "M60,150 L140,140 L130,200 L50,190 Z"
    },
    {
      id: "HOG",
      name: "Haut-Ogooué",
      color: "text-orange-500",
      hoverColor: "fill-orange-100",
      selectedColor: "fill-orange-500 stroke-orange-700",
      path: "M220,220 L280,220 L260,300 L200,280 Z"
    },
    {
      id: "OGL",
      name: "Ogooué-Lolo",
      color: "text-red-500",
      hoverColor: "fill-red-100",
      selectedColor: "fill-red-500 stroke-red-700",
      path: "M140,200 L220,200 L200,280 L130,260 Z"
    },
    {
      id: "NGO",
      name: "Ngounié",
      color: "text-purple-500",
      hoverColor: "fill-purple-100",
      selectedColor: "fill-purple-500 stroke-purple-700",
      path: "M50,200 L130,200 L120,300 L60,280 Z"
    },
    {
      id: "OGM",
      name: "Ogooué-Maritime",
      color: "text-cyan-500",
      hoverColor: "fill-cyan-100",
      selectedColor: "fill-cyan-500 stroke-cyan-700",
      path: "M10,140 L50,150 L60,250 L20,240 Z"
    },
    {
      id: "NYA",
      name: "Nyanga",
      color: "text-pink-500",
      hoverColor: "fill-pink-100",
      selectedColor: "fill-pink-500 stroke-pink-700",
      path: "M60,280 L120,300 L100,340 L50,320 Z"
    }
  ];

  /* 
   * Note: Les paths ci-dessus sont des placeholders géométriques simplifiés. 
   * Pour un vrai rendu, il faudrait intégrer un SVG complet du Gabon.
   * Ici, nous utilisons une représentation stylisée "Vitrail" qui fonctionne bien visuellement.
   */

  return (
    <div className={cn("relative w-full aspect-[4/3] bg-blue-50/30 rounded-xl overflow-hidden border border-blue-100", className)}>
      <svg
        viewBox="0 0 300 360"
        className="w-full h-full drop-shadow-lg"
      >
        <TooltipProvider>
          {provinces.map((province) => {
            const isSelected = selectedProvince === province.name;
            const isHovered = hoveredProvince === province.name;

            return (
              <Tooltip key={province.id}>
                <TooltipTrigger asChild>
                  <path
                    d={province.path}
                    className={cn(
                      "cursor-pointer transition-all duration-300 stroke-2",
                      isSelected
                        ? province.selectedColor
                        : isHovered
                          ? `${province.hoverColor} stroke-gray-400`
                          : "fill-white stroke-gray-300 hover:stroke-gray-400"
                    )}
                    onMouseEnter={() => setHoveredProvince(province.name)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={() => onProvinceClick?.(province.name)}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold">{province.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>

        {/* Labels des provinces (centrés approximativement) */}
        <text x="50" y="120" className="text-[8px] fill-gray-600 pointer-events-none font-bold">Estuaire</text>
        <text x="130" y="100" className="text-[8px] fill-gray-600 pointer-events-none font-bold">Woleu-Ntem</text>
        <text x="180" y="180" className="text-[8px] fill-gray-600 pointer-events-none font-bold">Ogooué-Ivindo</text>
        <text x="30" y="200" className="text-[8px] fill-gray-600 pointer-events-none font-bold text-center">Ogooué-Maritime</text>
        <text x="90" y="170" className="text-[8px] fill-gray-600 pointer-events-none font-bold">Moyen-Ogooué</text>
        <text x="90" y="250" className="text-[8px] fill-gray-600 pointer-events-none font-bold">Ngounié</text>
        <text x="160" y="230" className="text-[8px] fill-gray-600 pointer-events-none font-bold">Ogooué-Lolo</text>
        <text x="230" y="260" className="text-[8px] fill-gray-600 pointer-events-none font-bold">Haut-Ogooué</text>
        <text x="80" y="310" className="text-[8px] fill-gray-600 pointer-events-none font-bold">Nyanga</text>
      </svg>

      {/* Légende interactive */}
      {selectedProvince && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border animate-fade-in">
          <h4 className="font-bold text-sm text-primary mb-1">{selectedProvince}</h4>
          <p className="text-xs text-muted-foreground">Province sélectionnée</p>
        </div>
      )}
    </div>
  );
};

export default GabonMap;
