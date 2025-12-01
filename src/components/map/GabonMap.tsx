import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

type Doleance = {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  statut: string;
  priorite: string;
  latitude: number;
  longitude: number;
  region: string;
  ville: string | null;
  date_creation: string;
};

const getCategoryColor = (categorie: string): string => {
  const colors: Record<string, string> = {
    infrastructure: '#3b82f6',
    sante: '#ef4444',
    education: '#8b5cf6',
    securite: '#f59e0b',
    environnement: '#10b981',
    economie: '#06b6d4',
  };
  return colors[categorie] || '#6b7280';
};

const getPriorityIcon = (priorite: string): string => {
  const icons: Record<string, string> = {
    basse: '●',
    moyenne: '●●',
    haute: '●●●',
    urgente: '🔴',
  };
  return icons[priorite] || '●';
};

const GabonMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doleances, setDoleances] = useState<Doleance[]>([]);

  useEffect(() => {
    const loadDoleances = async () => {
      const { data, error } = await supabase
        .from('doleances')
        .select('*')
        .order('date_creation', { ascending: false });

      if (error) {
        console.error('Erreur chargement doléances:', error);
        return;
      }

      setDoleances(data || []);
    };

    loadDoleances();
  }, []);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        // Récupérer le token Mapbox depuis l'edge function
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) throw error;
        if (!data?.token) throw new Error('Token Mapbox non disponible');

        mapboxgl.accessToken = data.token;

        // Initialiser la carte centrée sur le Gabon
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [11.6094, -0.8037], // Centre du Gabon
          zoom: 6,
          pitch: 30,
        });

        // Ajouter les contrôles de navigation
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        map.current.on('load', () => {
          setLoading(false);
          
          // Ajouter une couche pour mettre en évidence les circonscriptions
          map.current?.addSource('gabon-bounds', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [8.5, 3.5],
                  [14.5, 3.5],
                  [14.5, -4],
                  [8.5, -4],
                  [8.5, 3.5]
                ]]
              },
              properties: {}
            }
          });

          map.current?.addLayer({
            id: 'gabon-bounds-layer',
            type: 'line',
            source: 'gabon-bounds',
            paint: {
              'line-color': '#4F46E5',
              'line-width': 2,
              'line-opacity': 0.6
            }
          });

          // Ajouter les marqueurs pour chaque doléance
          doleances.forEach((doleance) => {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundColor = getCategoryColor(doleance.categorie);
            el.style.width = '32px';
            el.style.height = '32px';
            el.style.borderRadius = '50%';
            el.style.border = '3px solid white';
            el.style.cursor = 'pointer';
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.fontSize = '16px';
            el.style.fontWeight = 'bold';
            el.textContent = getPriorityIcon(doleance.priorite);

            const popupContent = `
              <div style="padding: 12px; min-width: 250px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                  <h3 style="font-weight: 600; font-size: 16px; margin: 0;">${doleance.titre}</h3>
                  <span style="background: ${getCategoryColor(doleance.categorie)}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px;">${doleance.categorie}</span>
                </div>
                <p style="color: #64748b; font-size: 14px; margin: 8px 0;">${doleance.description}</p>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;">
                  <span style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    <strong>Statut:</strong> ${doleance.statut.replace('_', ' ')}
                  </span>
                  <span style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    <strong>Priorité:</strong> ${doleance.priorite}
                  </span>
                </div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
                  <p style="font-size: 12px; color: #64748b; margin: 0;">
                    📍 ${doleance.ville || doleance.region}
                  </p>
                  <p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0 0;">
                    ${new Date(doleance.date_creation).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            `;

            new mapboxgl.Marker(el)
              .setLngLat([doleance.longitude, doleance.latitude])
              .setPopup(
                new mapboxgl.Popup({ offset: 25, closeButton: false })
                  .setHTML(popupContent)
              )
              .addTo(map.current!);
          });
        });

      } catch (err) {
        console.error('Erreur initialisation carte:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la carte');
        setLoading(false);
      }
    };

    if (doleances.length > 0) {
      initializeMap();
    }

    return () => {
      map.current?.remove();
    };
  }, [doleances]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
        <div className="text-center p-6">
          <p className="text-destructive font-semibold mb-2">Erreur de chargement</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
    </div>
  );
};

export default GabonMap;
