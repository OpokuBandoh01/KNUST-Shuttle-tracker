# Mapbox Setup Guide

## Environment Variables

Create a `.env.local` file in your project root and add your Mapbox access token:

```env
# Mapbox Access Token
# Get your access token from https://account.mapbox.com/access-tokens/
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

## Getting a Mapbox Access Token

1. Go to [Mapbox Account](https://account.mapbox.com/access-tokens/)
2. Sign up or log in to your Mapbox account
3. Create a new access token or use the default public token
4. Copy the token and paste it in your `.env.local` file

## Features Implemented

### Map Component (`components/mapbox-map.tsx`)
- Interactive Mapbox GL JS map
- Centered on KNUST campus coordinates
- Navigation controls (zoom, rotate, pitch)
- Fullscreen control
- Geolocation control
- Custom attribution

### Map Utilities (`lib/mapbox-utils.ts`)
- Shuttle marker management
- Stand marker management
- Route line drawing
- Interactive popups
- Click and hover handlers

### Map Page (`app/map/page.tsx`)
- Integrated Mapbox map
- Sample shuttle and stand markers
- Interactive overlays
- Responsive design

## Map Styles Available

You can change the map style in `components/mapbox-map.tsx`:

```typescript
// Available styles:
"mapbox://styles/mapbox/streets-v12"     // Default streets
"mapbox://styles/mapbox/outdoors-v12"    // Outdoor/terrain
"mapbox://styles/mapbox/light-v11"       // Light theme
"mapbox://styles/mapbox/dark-v11"        // Dark theme
"mapbox://styles/mapbox/satellite-v9"    // Satellite
"mapbox://styles/mapbox/satellite-streets-v12" // Satellite with labels
```

## Next Steps

1. Add your Mapbox access token to `.env.local`
2. Test the map functionality
3. Replace mock data with real shuttle tracking data
4. Add real-time updates for shuttle positions
5. Implement route visualization
6. Add custom map styling for KNUST branding

## Troubleshooting

- If the map doesn't load, check that your access token is correct
- Make sure the token has the necessary permissions (public scopes)
- Check the browser console for any error messages
- Verify that the environment variable is properly set 