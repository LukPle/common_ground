'use client';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';

export interface MapMarker {
    id: string;
    longitude: number;
    latitude: number;
    title?: string;
    description?: string;
    color?: string;
    icon?: string; // Emoji or single character
    onClick?: () => void;
}

interface MapProps {
    initialCenter?: [number, number];
    initialZoom?: number;
    markers?: MapMarker[];
    onMarkerClick?: (marker: MapMarker) => void;
    selectedMarkerId?: string | null;
}

export const Map = ({
    initialCenter = [8.5417, 47.3769], // Default to Zurich, Switzerland
    initialZoom = 12,
    markers = [],
    onMarkerClick,
    selectedMarkerId
}: MapProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize map
    useEffect(() => {
        if (map.current) return; // Initialize map only once

        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

        if (!accessToken) {
            setError('Mapbox API key is not configured');
            setIsLoading(false);
            return;
        }

        mapboxgl.accessToken = accessToken;

        if (!mapContainer.current) return;

        try {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: initialCenter,
                zoom: initialZoom
            });

            // Add navigation controls
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

            // Add geolocate control
            map.current.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true,
                    showUserHeading: true
                }),
                'top-right'
            );

            map.current.on('load', () => {
                setIsLoading(false);
            });

            map.current.on('error', (e) => {
                console.error('Mapbox error:', e);
                setError('Failed to load map');
                setIsLoading(false);
            });
        } catch (err) {
            console.error('Error initializing map:', err);
            setError('Failed to initialize map');
            setIsLoading(false);
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [initialCenter, initialZoom]);

    // Handle markers
    useEffect(() => {
        if (!map.current || isLoading) return;

        // Remove existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        markers.forEach((markerData) => {
            if (!map.current) return;

            const isSelected = markerData.id === selectedMarkerId;

            // Create custom marker element
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.width = isSelected ? '50px' : '40px';
            el.style.height = isSelected ? '50px' : '40px';
            el.style.cursor = 'pointer';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.transition = 'all 0.3s ease';
            el.style.zIndex = isSelected ? '1000' : '1';

            // Use custom icon or default pin
            if (markerData.icon) {
                // Custom emoji/icon
                const size = isSelected ? 50 : 40;
                const iconSize = isSelected ? 24 : 20;
                const borderWidth = isSelected ? 4 : 3;
                const shadowStrength = isSelected ? '0 4px 16px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)';

                el.innerHTML = `
                    <div style="
                        background-color: ${markerData.color || '#3b82f6'};
                        width: ${size}px;
                        height: ${size}px;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        border: ${borderWidth}px solid white;
                        box-shadow: ${shadowStrength};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                    ">
                        <span style="
                            transform: rotate(45deg);
                            font-size: ${iconSize}px;
                        ">${markerData.icon}</span>
                    </div>
                `;
            } else {
                // Default pin style
                const size = isSelected ? 38 : 30;
                const borderWidth = isSelected ? 4 : 3;
                const shadowStrength = isSelected ? '0 4px 16px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)';

                el.innerHTML = `
                    <div style="
                        background-color: ${markerData.color || '#3b82f6'};
                        width: ${size}px;
                        height: ${size}px;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        border: ${borderWidth}px solid white;
                        box-shadow: ${shadowStrength};
                        transition: all 0.3s ease;
                    "></div>
                `;
            }

            // Create popup if title or description exists
            let popup;
            if (markerData.title || markerData.description) {
                popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                    <div style="padding: 8px;">
                        ${markerData.title ? `<h3 style="font-weight: bold; margin-bottom: 4px;">${markerData.title}</h3>` : ''}
                        ${markerData.description ? `<p style="font-size: 14px; color: #666;">${markerData.description}</p>` : ''}
                    </div>
                `);
            }

            // Create marker
            const marker = new mapboxgl.Marker(el)
                .setLngLat([markerData.longitude, markerData.latitude]);

            if (popup) {
                marker.setPopup(popup);
            }

            marker.addTo(map.current);

            // Add click handler
            el.addEventListener('click', () => {
                if (markerData.onClick) {
                    markerData.onClick();
                }
                if (onMarkerClick) {
                    onMarkerClick(markerData);
                }
            });

            markersRef.current.push(marker);
        });

        // Fit bounds to show all markers if there are any
        if (markers.length > 0 && !selectedMarkerId) {
            const bounds = new mapboxgl.LngLatBounds();
            markers.forEach(marker => {
                bounds.extend([marker.longitude, marker.latitude]);
            });
            map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
        }
    }, [markers, isLoading, onMarkerClick, selectedMarkerId]);

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Please check your Mapbox API key configuration
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading map...</p>
                    </div>
                </div>
            )}
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
};

