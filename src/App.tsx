import React, { Suspense } from "react";
import RoomList from "./components/RoomList";
export default function App() {
  return (
    <div className="app ">
      <header className="">
        <h1 className="">Unravel — Rooms Listing</h1>
        <p className="">Responsive, Infinite Scroll, Optimized Media by Alaa Mekki</p>
      </header>
      <main className="">
        <Suspense fallback={<div>Loading...</div>}>
          <RoomList />
        </Suspense>
      </main>
    </div>
  );
}
