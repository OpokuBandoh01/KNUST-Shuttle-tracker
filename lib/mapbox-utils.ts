import mapboxgl from "mapbox-gl"

export interface ShuttleMarker {
  id: number
  name: string
  coordinates: [number, number] // [lng, lat]
  route: string
  direction: "outbound" | "return"
  estimatedArrival?: string
}

export interface StandMarker {
  id: number
  name: string
  coordinates: [number, number] // [lng, lat]
  shuttles?: ShuttleMarker[]
}

export const addShuttleMarkers = (map: mapboxgl.Map, shuttles: ShuttleMarker[]) => {
  // Remove existing shuttle markers
  if (map.getSource("shuttles")) {
    map.removeLayer("shuttle-markers")
    map.removeSource("shuttles")
  }

  // Add shuttle markers as a GeoJSON source
  map.addSource("shuttles", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: shuttles.map(shuttle => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: shuttle.coordinates,
        },
        properties: {
          id: shuttle.id,
          name: shuttle.name,
          route: shuttle.route,
          direction: shuttle.direction,
          estimatedArrival: shuttle.estimatedArrival,
        },
      })),
    },
  })

  // Add shuttle marker layer
  map.addLayer({
    id: "shuttle-markers",
    type: "circle",
    source: "shuttles",
    paint: {
      "circle-radius": 8,
      "circle-color": "#3b82f6", // Blue for shuttles
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  })

  // Add shuttle labels
  map.addLayer({
    id: "shuttle-labels",
    type: "symbol",
    source: "shuttles",
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Regular"],
      "text-size": 12,
      "text-offset": [0, 1.5],
    },
    paint: {
      "text-color": "#1f2937",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1,
    },
  })
}

export const addStandMarkers = (map: mapboxgl.Map, stands: StandMarker[]) => {
  // Remove existing stand markers
  if (map.getSource("stands")) {
    map.removeLayer("stand-markers")
    map.removeLayer("stand-labels")
    map.removeSource("stands")
  }

  // Add stand markers as a GeoJSON source
  map.addSource("stands", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: stands.map(stand => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: stand.coordinates,
        },
        properties: {
          id: stand.id,
          name: stand.name,
        },
      })),
    },
  })

  // Add stand marker layer with better visibility
  map.addLayer({
    id: "stand-markers",
    type: "circle",
    source: "stands",
    paint: {
      "circle-radius": 8,
      "circle-color": "#10b981", // Green for stands
      "circle-stroke-width": 3,
      "circle-stroke-color": "#ffffff",
      "circle-opacity": 0.9,
    },
  })

  // Add stand labels with better positioning
  map.addLayer({
    id: "stand-labels",
    type: "symbol",
    source: "stands",
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Regular"],
      "text-size": 12,
      "text-offset": [0, -2],
      "text-anchor": "top",
    },
    paint: {
      "text-color": "#1f2937",
      "text-halo-color": "#ffffff",
      "text-halo-width": 2,
    },
  })
}

export const addRouteLine = (map: mapboxgl.Map, routeCoordinates: [number, number][]) => {
  // Remove existing route line
  if (map.getSource("route")) {
    map.removeLayer("route-line")
    map.removeSource("route")
  }

  // Add route line
  map.addSource("route", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: routeCoordinates,
      },
      properties: {}
    },
  })

  map.addLayer({
    id: "route-line",
    type: "line",
    source: "route",
    paint: {
      "line-color": "#3b82f6",
      "line-width": 3,
      "line-opacity": 0.8,
    },
  })
}

export const createPopup = (content: string, theme: string = 'light') => {
  const popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: false,
    maxWidth: "300px",
    className: theme === 'dark' ? 'dark-popup' : 'light-popup'
  }).setHTML(content)
  
  return popup
}

export const addClickHandlers = (
  map: mapboxgl.Map,
  shuttles: ShuttleMarker[],
  stands: StandMarker[],
  theme: string = 'light'
) => {
  // Handle shuttle marker clicks
  map.on("click", "shuttle-markers", (e) => {
    if (!e.features?.[0]) return

    const feature = e.features[0]
    const properties = feature.properties

    if (!properties) return

    const popup = createPopup(`
      <div class="p-2">
        <h3 class="font-semibold text-lg">${properties.name}</h3>
        <p class="text-sm text-gray-600">Route: ${properties.route}</p>
        <p class="text-sm text-gray-600">Direction: ${properties.direction}</p>
        ${properties.estimatedArrival ? `<p class="text-sm text-gray-600">ETA: ${properties.estimatedArrival}</p>` : ""}
      </div>
    `, theme)

    if (feature.geometry.type === "Point") {
      const coordinates = feature.geometry.coordinates as [number, number]
      popup.setLngLat(coordinates).addTo(map)
    }
  })

  // Handle stand marker clicks
  map.on("click", "stand-markers", (e) => {
    if (!e.features?.[0]) return

    const feature = e.features[0]
    const properties = feature.properties

    if (!properties) return

    const popup = createPopup(`
      <div class="p-3">
        <h3 class="font-semibold text-lg mb-2">${properties.name}</h3>
        <div class="space-y-2 text-sm">
          <p class="text-gray-600">📍 Shuttle Stand Location</p>
          <p class="text-gray-600">🚌 Set alerts for this location</p>
          <p class="text-gray-600">⏰ Get notified when shuttles arrive</p>
        </div>
        <div class="mt-3 pt-2 border-t border-gray-200">
          <p class="text-xs text-gray-500">
            <strong>Coordinates:</strong><br>
            ${feature.geometry.type === "Point" ? 
              `${(feature.geometry.coordinates as [number, number])[1].toFixed(6)}, ${(feature.geometry.coordinates as [number, number])[0].toFixed(6)}` : 
              "N/A"}
          </p>
        </div>
      </div>
    `, theme)

    if (feature.geometry.type === "Point") {
      const coordinates = feature.geometry.coordinates as [number, number]
      popup.setLngLat(coordinates).addTo(map)
    }
  })

  // Change cursor on hover
  map.on("mouseenter", "shuttle-markers", () => {
    map.getCanvas().style.cursor = "pointer"
  })

  map.on("mouseleave", "shuttle-markers", () => {
    map.getCanvas().style.cursor = ""
  })

  map.on("mouseenter", "stand-markers", () => {
    map.getCanvas().style.cursor = "pointer"
  })

  map.on("mouseleave", "stand-markers", () => {
    map.getCanvas().style.cursor = ""
  })
} 