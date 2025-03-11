# QuickElevation

A fast, simple web application that provides elevation data for any location. Search for a location or use your current position to get precise elevation information in both meters and feet.

## Features

- Search for locations by name or address using TomTom API
- Get elevation data using Open Elevation API
- Use your device's geolocation to find elevation at your current position
- Clean, responsive UI built with React, TypeScript, and TailwindCSS

## Technologies

- React 18 with TypeScript
- Vite for fast development and building
- TanStack Query for data fetching
- TailwindCSS for styling
- Radix UI for accessible components
- Vitest for testing

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your TomTom API key:
   ```
   VITE_TOMTOM_API_KEY=your_tomtom_api_key
   ```
4. Start the development server: `npm run dev`
5. Open your browser to http://localhost:5173

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code