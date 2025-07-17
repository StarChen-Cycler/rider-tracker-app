# Rider Tracker App Structure Details

This document provides a detailed description of each file in the `rider-tracker-app` and how it is utilized by other files. This is used for later optimization of the code structure and relations.

## Root Files

### `package.json`

*   **Purpose**: Defines the project's metadata, dependencies, and scripts.
*   **Key Dependencies**: `@nuxt/eslint`, `@nuxt/icon`, `@nuxt/image`, `@nuxtjs/tailwindcss`, `@supabase/supabase-js`, `@vueuse/nuxt`, `nuxt`.
*   **Scripts**: Includes commands for development (`dev`), building (`build`), and previewing (`preview`) the application.
*   **Usage**: This file is the entry point for `pnpm` to install dependencies and run project scripts.

### `nuxt.config.ts`

*   **Purpose**: Configures the Nuxt.js application.
*   **Key Configurations**:
    *   **Modules**: Enables Nuxt modules like `@nuxtjs/tailwindcss`, `@nuxt/icon`, and `@vueuse/nuxt`.
    *   **App Metadata**: Sets the global `<head>` tags, including title, meta descriptions, and favicon.
    *   **CSS**: Imports global stylesheets like `~/assets/css/main.css`.
    *   **Runtime Config**: Manages public environment variables for services like Supabase and Amap.
    *   **Dev Server**: Configures the development server, including enabling HTTPS.
*   **Usage**: This file is read by Nuxt at startup to configure the entire application.

### `app.vue`

*   **Purpose**: The main Vue component that serves as the entry point for the application's UI.
*   **Structure**: It contains `<NuxtLayout>` and `<NuxtPage>` components, which are responsible for rendering the appropriate layout and page based on the current route.
*   **Usage**: This component is the root of the Vue application tree.

### `README.md`

*   **Purpose**: Provides a comprehensive overview of the project.
*   **Contents**: Includes information about features, the technology stack, prerequisites, setup instructions, environment variable configuration, and instructions for setting up a production environment with Nginx and HTTPS.
*   **Usage**: Serves as the primary documentation for developers.

### `.gitignore`

*   **Purpose**: Specifies which files and directories should be ignored by Git.
*   **Usage**: Prevents committing generated files (`.nuxt`, `.output`, `dist`), dependencies (`node_modules`), and environment files (`.env`) to version control.

### `tsconfig.json`

*   **Purpose**: Configures TypeScript for the project.
*   **Usage**: It extends the default Nuxt TypeScript configuration, ensuring type safety and proper module resolution.

## Directories

### `assets`

*   **Purpose**: Stores static assets that are processed by the build tool (Vite/Webpack).
*   **Contents**:
    *   `css/main.css`: Contains global styles and Tailwind CSS configurations. It defines base styles, custom components, and utility classes.
    *   `svg/arrow.svg`: An SVG icon used for the direction marker on the map.
*   **Usage**: The CSS file is imported in `nuxt.config.ts` to be applied globally. The SVG is used in composables like `useGlobalMap.ts`.

### `components`

*   **Purpose**: Contains reusable Vue components.
*   **Structure**:
    *   `map/AmapContainer.vue`: A key component that wraps the Amap (高德地图) instance. It handles map initialization, loading/error states, and user interaction controls like locating the user and centering the map.
    *   `ui/AppButton.vue`: A general-purpose button component with different variants (primary, secondary, etc.), sizes, and loading states.
    *   `ui/LoadingSpinner.vue`: A simple loading spinner component.
*   **Usage**: These components are used throughout the `pages` and `layouts` to build the user interface.

### `composables`

*   **Purpose**: Stores reusable Vue Composition API functions (composables) to encapsulate and manage stateful logic.
*   **Key Composables**:
    *   `useAmap.ts`: Manages the Amap script loading and provides basic location tracking functionality using the browser's Geolocation API.
    *   `useAmapOverlays.ts`: Provides functions to create and manage map overlays like polylines, circles, and markers.
    *   `useGlobalMap.ts`: Manages a global, persistent map instance and related state (e.g., user's location, heading) that can be shared across different pages and components.
    *   `usePolylineDemo.ts`: Contains logic for demonstrating polyline drawing and editing features on the map.
    *   `useSupabase.ts`: Initializes the Supabase client and provides composables (`useAuth`, `useRides`, `useRoutePoints`) for interacting with the Supabase backend for authentication, and database operations.
*   **Usage**: These composables are imported into components and pages to add specific functionality, such as map interactions or data fetching.

### `database/` Directory

The `database` directory contains the SQL schema for the application's database, managed by Supabase.

-   **`schema.sql`**: This is a critical file that defines the entire database structure. It includes:
    -   **Table Definitions**: Creates the `profiles`, `rides`, and `route_points` tables with appropriate columns, types, and constraints.
    -   **Relationships**: Establishes foreign key relationships between tables (e.g., `rides.user_id` references `auth.users(id)`).
    -   **Indexes**: Adds indexes on frequently queried columns (`user_id`, `created_at`, `status`, `ride_id`) to improve query performance.
    -   **Row-Level Security (RLS)**: Enables RLS and defines policies to ensure that users can only access and modify their own data. This is a key security feature of the Supabase integration.
    -   **Database Functions & Triggers**: Includes a PostgreSQL function (`handle_new_user`) and a trigger (`on_auth_user_created`) that automatically creates a new user profile in the `profiles` table whenever a new user signs up via Supabase Auth.

### `layouts/` Directory

This directory defines the main UI structures that wrap around the pages.

-   **`default.vue`**: A standard layout that includes a main content area (`<slot />`) and a mobile navigation bar at the bottom. It is not the primary layout used in the app.
-   **`map-layout.vue`**: This is the core layout of the application. It features:
    -   A global map container (`AmapContainer.vue`) that is always present in the background.
    -   The page content (`<slot />`) is overlaid on top of the map.
    -   It includes fixed-position UI elements like a "locate user" button.
    -   It handles the initialization of the AMap instance and makes it globally available through the `useGlobalMap` composable.
    -   It contains the same mobile navigation component as `default.vue`.

### `middleware/` Directory

Middleware runs before a page or layout is rendered.

-   **`default-layout.global.ts`**: A global route middleware that automatically sets the layout for every page to `map-layout`. This ensures a consistent user experience with the map always being active in the background, unless a page explicitly overrides its layout.

### `pages/` Directory

This directory contains the application's views and routes. The file-based routing is a core feature of Nuxt.

-   **`index.vue`**: The homepage (`/`). It serves as a welcome screen, providing links to start tracking or view past rides. It also displays the real-time status of the GPS location service from `useGlobalMap`.
-   **`track.vue`**: The main tracking page (`/track`). This is where the user records their rides. Its key features include:
    -   Starting, pausing, resuming, and stopping a ride.
    -   Displaying real-time stats like elapsed time, distance, and current speed.
    -   Allowing the user to select the vehicle type (`bicycle` or `motorbike`).
    -   Interacting with the `useRouteTracking` composable to record GPS points and with `useGlobalMap` to manage map state and orientation tracking.
-   **`rides.vue`**: The page for viewing past rides (`/rides`). It lists all recorded rides with summary statistics (total rides, distance, duration). It includes filtering options and uses mock data for demonstration purposes.
-   **`profile.vue`**: The user profile page (`/profile`). It displays user information, stats, and provides menu options for editing the profile, managing preferences, and signing out. It interacts with the `useAuth` composable for authentication state.

### `plugins/` Directory

Nuxt plugins are used to add framework or community modules or to run code at the start of the application.

-   **`global-map.ts`**: This plugin initializes the `useGlobalMapProvider`, which creates the global state for the map. This ensures that the map instance and related reactive data (like `currentLocation`) are available as a singleton across the entire application via the `useGlobalMap` composable.
-   **`map-layout.ts`**: This plugin appears to be redundant or for debugging, as the `default-layout.global.ts` middleware is what effectively enforces the `map-layout`.