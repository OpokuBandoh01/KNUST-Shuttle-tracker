 "use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapboxMapProps {
  className?: string
  onMapLoad?: (map: mapboxgl.Map) => void
  mapStyle?: string // <-- Add this line
}

export default function MapboxMap({ className = "h-full w-full", onMapLoad, mapStyle = "mapbox://styles/mapbox/streets-v12" }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const onMapLoadRef = useRef(onMapLoad)

  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string

    const knustCenter = {
      lng: -1.57199,
      lat: 6.67518,
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle, // <-- Use the prop here
      center: [knustCenter.lng, knustCenter.lat],
      zoom: 16,
      attributionControl: false,
    })

    map.addControl(new mapboxgl.NavigationControl(), "top-right")
    map.addControl(new mapboxgl.FullscreenControl(), "top-right")
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    )
    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      }),
      "bottom-left"
    )

    mapInstanceRef.current = map

    if (onMapLoadRef.current) {
      onMapLoadRef.current(map)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }
    }
  }, [mapStyle]) // <-- Add mapStyle as a dependency

  useEffect(() => {
    onMapLoadRef.current = onMapLoad
  }, [onMapLoad])

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
} 