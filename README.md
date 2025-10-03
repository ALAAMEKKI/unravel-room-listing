# Unravel WebApp Challenge – Room Listing App

## Overview

Uses original sample.json in src/api/sample.json.
Renders all rooms in rooms_by_serial_no with their variants, properties, and prices.

This project is a **responsive room listing web application** built using **React JS**. It demonstrates efficient media handling (images & videos), infinite scrolling, and lazy loading for performance optimization.

> **Note:** The UI focuses primarily on media display for each room. While functional, it is kept minimal and could be further refined for enhanced visual appeal.

---

## Features

- **Room Listing Component**

  - Displays a list of rooms with details such as name, price, description, images, and videos.
  - Each room's media prioritizes videos first; if no videos are available, images are shown.

- **Media Optimization**

  - **Videos**: Only load and autoplay when visible on the viewport; pause when scrolled out.
  - **Images**: Lazy-loaded using `loading="lazy"` with responsive sizing (`srcset`) and skeleton placeholders.

- **Skeleton Loading**

  - While media is loading, a skeleton placeholder maintains layout consistency and improves perceived performance.

- **Infinite Scrolling**

  - Automatically fetches and displays additional room data as the user scrolls.
  - Efficiently handles large datasets (tested with 100+ room entries).

- **Error Handling**

  - Displays user-friendly messages if fetching data fails.

- **Responsive Design**
  - Fully responsive for desktop and mobile screens.
  - Media heights and layout adapt for different screen sizes using CSS media queries.

---

## Project Setup

Run:

1. npm install or pnpm install
2. npm run dev or pnpm run dev

## Architecture

React Components

RoomContainer: Main component for each room, handles media display and variants.

VariantCard: Displays details for each room variant.

LazyImage & LazyVideo: Custom components for lazy-loading media with skeletons and IntersectionObserver for viewport visibility.

State Management (Redux Toolkit)

roomsSlice manages room data, paging, and loading states.

createAsyncThunk used for asynchronous fetching of room pages.

Infinite scrolling state (page, hasMore, status) is managed globally via Redux.

Enables scalable state management for large datasets.

Performance Optimizations

Lazy loading: Images and videos are loaded only when near the viewport.

IntersectionObserver: Ensures videos autoplay/pause based on visibility.

Memoization: React.memo and useMemo reduce unnecessary re-renders.

Skeletons: Maintain layout while media is loading to avoid reflows.

Efficient Infinite Scroll: Only fetches the next page when the sentinel element is visible.

Responsive Layout

Media containers use max-width and height constraints with CSS media queries.

Adjusts heights for tablets and mobile screens to optimize user experience.

## Limitations & Future Improvements

UI is minimal and focused on media presentation. Can be improved with:

Better typography, spacing, and styling for room and variant details.

Smooth transitions and slider animations for multiple images per room.

Advanced filtering or sorting for room listings.

Current data fetching is simulated with static JSON, could integrate a backend API for real-world usage.

Additional performance optimizations, such as debouncing scroll events for infinite scrolling, could be implemented.
