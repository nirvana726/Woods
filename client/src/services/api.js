const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Helper function for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("Using token in headers:", token);
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};


// --------------------------
// ROOM API FUNCTIONS
// --------------------------

export async function getAllRooms() {
  const res = await fetch(`${API_BASE_URL}/rooms`);
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return res.json(); // expected: { rooms: [...] }
}

export async function getRoomBySlug(slug) {
  const res = await fetch(`${API_BASE_URL}/rooms/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch room");
  return res.json(); // expected: single room object
}

// --------------------------
// ACTIVITY API FUNCTIONS
// --------------------------

export async function getAllActivities() {
  const res = await fetch(`${API_BASE_URL}/activities`);
  if (!res.ok) throw new Error("Failed to fetch activities");
  return res.json(); // expected: { activities: [...] }
}

export async function getActivityBySlug(slug) {
  const res = await fetch(`${API_BASE_URL}/activities/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch activity");
  return res.json(); // expected: single activity object
}

// --------------------------
// BOOKING API FUNCTIONS
// --------------------------

export const createBooking = async (bookingData) => {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData)
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create booking");
  }
  return res.json();
};

export const fetchBookings = async () => {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch bookings");
  }
  return res.json();
};

export const fetchBookingById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch booking");
  }
  return res.json();
};

export const updateBookingStatus = async (id, status) => {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update booking status");
  }
  return res.json();
};

export const updateBooking = async (id, bookingData) => {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData)
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update booking");
  }
  return res.json();
};

export const deleteBooking = async (id) => {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete booking");
  }
  return res.json();
};