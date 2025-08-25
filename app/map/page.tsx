"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, Info, Layers } from "lucide-react"
import { ShuttleInfoModal } from "@/components/shuttle-info-modal"
import { AlertSetupModal } from "@/components/alert-setup-modal"
import MapboxMap from "@/components/mapbox-map"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import mapboxgl from "mapbox-gl"
import { addShuttleMarkers, addStandMarkers, addClickHandlers, ShuttleMarker, StandMarker } from "@/lib/mapbox-utils"


export default function MapPage() {
  const router = useRouter()
  const { user, isAuthenticated, isStudent, isGuest, isLoading } = useAuth()
  const { theme } = useTheme()
  const [selectedZone, setSelectedZone] = useState("all")
  const [showShuttleInfo, setShowShuttleInfo] = useState(false)
  const [showAlertSetup, setShowAlertSetup] = useState(false)
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v12")

  // Add theme-aware popup styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .dark-popup .mapboxgl-popup-content {
        background-color: #1f2937 !important;
        color: #f9fafb !important;
        border: 1px solid #374151 !important;
      }
      .dark-popup .mapboxgl-popup-close-button {
        color: #f9fafb !important;
      }
      .light-popup .mapboxgl-popup-content {
        background-color: #ffffff !important;
        color: #111827 !important;
        border: 1px solid #e5e7eb !important;
      }
      .light-popup .mapboxgl-popup-close-button {
        color: #111827 !important;
      }
      .dark-popup-content strong {
        color: #e5e7eb !important;
      }
      .light-popup-content strong {
        color: #374151 !important;
      }
      /* Theme-aware text colors for popup content */
      .dark-popup .mapboxgl-popup-content p {
        color: #d1d5db !important;
      }
      .dark-popup .mapboxgl-popup-content .text-gray-600 {
        color: #9ca3af !important;
      }
      .dark-popup .mapboxgl-popup-content .text-gray-500 {
        color: #6b7280 !important;
      }
      .light-popup .mapboxgl-popup-content p {
        color: #374151 !important;
      }
      .light-popup .mapboxgl-popup-content .text-gray-600 {
        color: #4b5563 !important;
      }
      .light-popup .mapboxgl-popup-content .text-gray-500 {
        color: #6b7280 !important;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Mock shuttle data - TODO: Replace with real-time data
  const shuttles: ShuttleMarker[] = [
    {
      id: 1,
      name: "Shuttle A1",
      route: "Brunei-KSB",
      coordinates: [-1.5712, 6.6748], // [lng, lat] for Mapbox
      direction: "outbound",
      estimatedArrival: "2 mins",
    },
    {
      id: 2,
      name: "Shuttle A2",
      route: "Brunei-KSB",
      coordinates: [-1.5708, 6.6742], // [lng, lat] for Mapbox
      direction: "return",
      estimatedArrival: "8 mins",
    },
  ]

  // Updated shuttle stands with correct coordinates from the user
  const stands: StandMarker[] = [
    { id: 1, name: "Brunei Shuttle Stand", coordinates: [-1.5741569247718803, 6.670451257881111] },
    { id: 2, name: "Library Stand", coordinates: [-1.5729111810775949, 6.675101077287604] },
    { id: 3, name: "Pharmacy Stand", coordinates: [-1.5675642904636324, 6.6745561299185265] },
    { id: 4, name: "KSB Shuttle Stand", coordinates: [-1.5671778190814123, 6.6693171991574305] },
    { id: 5, name: "Casley Hayford Shuttle Stand", coordinates: [-1.5678886480177467, 6.675218965849067] },
  ]

  // Re-apply click handlers when theme changes
  useEffect(() => {
    if (mapInstance && shuttles.length > 0 && stands.length > 0) {
      // Remove existing click handlers by re-adding the map
      // This is a simpler approach than trying to remove specific listeners
      addClickHandlers(mapInstance, shuttles, stands, theme)
    }
  }, [theme, mapInstance, shuttles, stands])

  const handleMapLoad = useCallback((map: mapboxgl.Map) => {
    setMapInstance(map)

    // Wait for the map to load before adding markers
    map.on("load", () => {
      // Add shuttle markers
      addShuttleMarkers(map, shuttles)
      
      // Add stand markers
      addStandMarkers(map, stands)
      
      // Add click handlers for markers with current theme
      addClickHandlers(map, shuttles, stands, theme)
      
      console.log("Map loaded successfully with markers:", map)
    })
  }, [shuttles, stands, theme])

  const filteredShuttles = shuttles

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show loading while not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <main className="flex-1 overflow-hidden relative">
        {/* Mapbox Container */}
        <div className="relative w-full h-full">
          <MapboxMap className="w-full h-full" onMapLoad={handleMapLoad} mapStyle={mapStyle} />

          {/* Map Legend */}
          <div className={`absolute top-4 left-4 z-20 rounded-lg shadow-lg p-3 max-w-xs ${
            theme === 'dark' 
              ? 'bg-gray-800 bg-opacity-95 text-gray-100 border border-gray-700' 
              : 'bg-white bg-opacity-95 text-gray-900 border border-gray-200'
          }`}>
            <h3 className="font-semibold text-sm mb-2">Map Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                <span>Active Shuttles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                <span>Shuttle Stands</span>
              </div>
              <div className={`text-xs mt-2 pt-2 border-t ${
                theme === 'dark' 
                  ? 'text-gray-300 border-gray-600' 
                  : 'text-gray-500 border-gray-200'
              }`}>
                <p>• Click markers for details</p>
                <p>• Set alerts at stands</p>
                <p>• Track shuttle locations</p>
              </div>
            </div>
          </div>

          {/* Map Controls - Only show when no modal is open */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            <div className="relative group">
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-full shadow-lg"
                onClick={() => {
                  // Cycle through map styles
                  const styles = [
                    "mapbox://styles/mapbox/streets-v12",
                    "mapbox://styles/mapbox/outdoors-v12",
                    "mapbox://styles/mapbox/light-v11",
                    "mapbox://styles/mapbox/dark-v11",
                    "mapbox://styles/mapbox/satellite-v9",
                    "mapbox://styles/mapbox/satellite-streets-v12"
                  ]
                  const currentIndex = styles.indexOf(mapStyle)
                  const nextIndex = (currentIndex + 1) % styles.length
                  setMapStyle(styles[nextIndex])
                }}
              >
                <Layers className="h-4 w-4" />
                <span className="sr-only">Switch map view</span>
              </Button>
              {/* Tooltip */}
              <div className={`absolute bottom-full right-0 mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap ${
                theme === 'dark' 
                  ? 'text-white bg-gray-800 border border-gray-700' 
                  : 'text-white bg-gray-900'
              }`}>
                {mapStyle.includes('satellite') ? 'Satellite' : mapStyle.includes('dark') ? 'Dark' : mapStyle.includes('light') ? 'Light' : mapStyle.includes('outdoors') ? 'Outdoors' : 'Streets'}
                <div className={`absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                  theme === 'dark' 
                    ? 'border-t-gray-800' 
                    : 'border-t-gray-900'
                }`}></div>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full shadow-lg"
              onClick={() => {
                // Show map information
                if (mapInstance) {
                  const popup = new mapboxgl.Popup({
                    closeButton: true,
                    closeOnClick: false,
                    maxWidth: "300px",
                    className: theme === 'dark' ? 'dark-popup' : 'light-popup'
                  }).setHTML(`
                    <div class="p-4 ${theme === 'dark' ? 'dark-popup-content' : 'light-popup-content'}">
                      <h3 class="font-semibold text-lg mb-2">KNUST Shuttle Tracker</h3>
                      <div class="space-y-2 text-sm">
                        <p><strong>Current View:</strong> ${mapStyle.includes('satellite') ? 'Satellite' : mapStyle.includes('dark') ? 'Dark' : mapStyle.includes('light') ? 'Light' : mapStyle.includes('outdoors') ? 'Outdoors' : 'Streets'}</p>
                        <p><strong>Zoom Level:</strong> ${mapInstance.getZoom().toFixed(1)}</p>
                        <p><strong>Center:</strong> ${mapInstance.getCenter().lng.toFixed(4)}, ${mapInstance.getCenter().lat.toFixed(4)}</p>
                        <p><strong>Shuttle Stands:</strong> ${stands.length}</p>
                        <p><strong>Active Shuttles:</strong> ${shuttles.length}</p>
                      </div>
                      <div class="mt-3 text-xs text-gray-500">
                        <p>• Blue markers: Active shuttles</p>
                        <p>• Green markers: Shuttle stands</p>
                        <p>• Click markers for more info</p>
                      </div>
                    </div>
                  `)
                  
                  popup.setLngLat(mapInstance.getCenter()).addTo(mapInstance)
                }
              }}
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">Map information</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Shuttle Info Modal */}
      <ShuttleInfoModal
        isOpen={showShuttleInfo}
        onClose={() => setShowShuttleInfo(false)}
        shuttle={{
          id: 1,
          name: "Shuttle A1",
          route: "Brunei-KSB",
          nextStop: "KSB Stand",
          estimatedArrival: "2 mins",
          capacity: "Medium",
          lastUpdated: "Just now",
        }}
      />

      {/* Alert Setup Modal */}
      <AlertSetupModal
        isOpen={showAlertSetup}
        onClose={() => setShowAlertSetup(false)}
        stand={{
          id: 1,
          name: "Brunei Stand",
          shuttles: [
            { id: 1, name: "Shuttle A1", estimatedArrival: "2 mins" },
            { id: 2, name: "Shuttle A2", estimatedArrival: "8 mins" },
          ],
        }}
      />
    </div>
  )
}
