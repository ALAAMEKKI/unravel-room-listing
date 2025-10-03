import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sample from "../api/sample.json";

/**
 * Utility: Flatten the JSON sample and optionally duplicate items
 * so we can simulate large datasets for infinite scrolling.
 */
function flattenSampleAndDuplicate(count = 100) {
  const hotel = (sample as any).hotel_details || {};
  const rbs = (sample as any).rooms_by_serial_no || [];
  let out: any[] = [];

  // Flatten structure: hotel -> serial_no -> rooms
  rbs.forEach((serial: any, si: number) => {
    (serial.rooms || []).forEach((room: any, ri: number) => {
      out.push({ id: `${hotel.item_id}-s${si}-r${ri}`, hotel, room });
    });
  });

  // Duplicate items if we need to reach "count" for testing
  if (out.length && out.length < count) {
    const dup: any[] = [];
    let idx = 0;
    while (dup.length + out.length < count) {
      const base = out[idx % out.length];
      const clone = JSON.parse(JSON.stringify(base));
      clone.id = `${base.id}-dup-${idx}`;
      dup.push(clone);
      idx++;
    }
    out = out.concat(dup);
  } else if (out.length === 0 && hotel) {
    // fallback: if no rooms found
    out.push({ id: hotel.item_id, hotel, room: {} });
  }

  return out;
}

// Flattened + duplicated dataset (~120 items for testing infinite scroll)
const ALL = flattenSampleAndDuplicate(120);

/**
 * Async thunk: Fetch a page of rooms (simulated paginated API).
 * - Adds artificial delay (250ms) to mimic network request.
 */
export const fetchRoomsPage = createAsyncThunk(
  "rooms/fetchPage",
  async ({ page = 1, pageSize = 8 }: { page?: number; pageSize?: number }) => {
    await new Promise((r) => setTimeout(r, 250)); // simulate latency

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = ALL.slice(start, end);

    return {
      items,
      page,
      hasMore: end < ALL.length, // check if more data exists
    };
  }
);

/**
 * Rooms Slice: Manages infinite-scroll room data
 */
const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    items: [] as any[],      // currently loaded rooms
    page: 0,                 // current page index
    pageSize: 8,             // how many per page
    hasMore: true,           // are more pages available?
    status: "idle",          // loading | succeeded | failed
    error: null as string | null,
  },
  reducers: {
    reset: (s) => {
      // Reset to initial state
      s.items = [];
      s.page = 0;
      s.hasMore = true;
      s.status = "idle";
      s.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomsPage.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchRoomsPage.fulfilled, (s, action) => {
        s.status = "succeeded";
        s.items = [...s.items, ...action.payload.items]; // append results
        s.page = action.payload.page;
        s.hasMore = action.payload.hasMore;
      })
      .addCase(fetchRoomsPage.rejected, (s, action) => {
        s.status = "failed";
        s.error = action.error.message ?? "Failed to fetch";
      });
  },
});

// Actions & Reducer
export const { reset } = roomsSlice.actions;
export default roomsSlice.reducer;
