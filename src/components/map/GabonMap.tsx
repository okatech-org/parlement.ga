import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const GabonMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          center: [11.6094, -0.8037], // Libreville, Gabon
          zoom: 6,
          pitch: 45,
        });

        // Ajouter les contrôles de navigation
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        // Ajouter un marqueur pour Libreville
        new mapboxgl.Marker({ color: '#1a1f2c' })
          .setLngLat([9.4544, 0.4162])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              '<div class="p-2"><h3 class="font-semibold">Libreville</h3><p class="text-sm">Capitale du Gabon</p></div>'
            )
          )
          .addTo(map.current);

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
        });

      } catch (err) {
        console.error('Erreur initialisation carte:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la carte');
        setLoading(false);
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, []);

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
