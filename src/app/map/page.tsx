'use client';

import { Calendar, Lightbulb, MapPin, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Map, MapMarker } from '../../components/map';
import { fetchProjectsClient } from '../../lib/supabase/queries.client';
import { Project } from '../../types/project';

// Mock coordinates for projects in Zurich area (until lat/lng are added to DB)
const mockCoordinates: { [key: string]: { lat: number; lng: number } } = {
    0: { lat: 47.3769, lng: 8.5417 }, // Zurich City Center
    1: { lat: 47.3750, lng: 8.5500 }, // Lake area
    2: { lat: 47.3800, lng: 8.5300 }, // West district
    3: { lat: 47.3700, lng: 8.5600 }, // East district
    4: { lat: 47.3850, lng: 8.5200 }, // North district
    5: { lat: 47.3650, lng: 8.5450 }, // South district
    6: { lat: 47.3720, lng: 8.5380 }, // Central-South
    7: { lat: 47.3820, lng: 8.5480 }, // Central-North
};

// Category colors and icons
const categoryConfig: { [key: string]: { color: string; icon: string } } = {
    Environment: { color: '#10b981', icon: '🌱' },
    Mobility: { color: '#3b82f6', icon: '🚇' },
    Culture: { color: '#8b5cf6', icon: '🎭' },
    'Public Health': { color: '#ef4444', icon: '🏥' },
    Economy: { color: '#f59e0b', icon: '💼' },
};

export default function MapPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true);
            const fetchedProjects = await fetchProjectsClient();
            // Add mock coordinates to projects
            const projectsWithCoords = fetchedProjects.map((project, index) => ({
                ...project,
                latitude: mockCoordinates[index % 8]?.lat || 47.3769,
                longitude: mockCoordinates[index % 8]?.lng || 8.5417,
            }));
            setProjects(projectsWithCoords);
            setLoading(false);
        };
        loadProjects();
    }, []);

    // Convert projects to map markers
    const markers: MapMarker[] = projects.map((project) => ({
        id: project.reference,
        longitude: project.longitude!,
        latitude: project.latitude!,
        title: project.title,
        description: project.short_description,
        color: categoryConfig[project.category]?.color || '#3b82f6',
        icon: categoryConfig[project.category]?.icon || '📍',
    }));

    const handleMarkerClick = (marker: MapMarker) => {
        const project = projects.find((p) => p.reference === marker.id);
        if (project) {
            setSelectedProject(project);
        }
    };

    const handleCloseCard = () => {
        setSelectedProject(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen relative">
            <div className="flex-1 relative">
                <Map
                    markers={markers}
                    onMarkerClick={handleMarkerClick}
                    selectedMarkerId={selectedProject?.reference || null}
                />
            </div>

            {/* Bottom centered card */}
            {selectedProject && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-slide-up">
                        <div className="flex">
                            {/* Project Image */}
                            <div className="relative w-48 h-48 flex-shrink-0">
                                <Image
                                    src={selectedProject.image}
                                    alt={selectedProject.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-black/30 backdrop-blur-lg text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                                        {selectedProject.category}
                                    </span>
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="flex-1 p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-900 pr-8">
                                        {selectedProject.title}
                                    </h3>
                                    <button
                                        onClick={handleCloseCard}
                                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {selectedProject.short_description}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Lightbulb className="w-4 h-4" />
                                        <span>{selectedProject.idea_count || 0} ideas</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {new Date(selectedProject.deadline).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        <span>Zurich</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/projects/${selectedProject.reference}`}
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    View Project
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

