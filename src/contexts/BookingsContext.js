import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

const BookingsContext = createContext(null);

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    try {
      const raw = localStorage.getItem('bookings');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      // convert date strings back to Date objects if needed
      return parsed.map((b) => ({
        ...b,
        date: b.date ? new Date(b.date) : b.date,
      }));
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    } catch (e) {
      // ignore
    }
  }, [bookings]);

  const addBooking = (booking) => {
    setBookings((prev) => [booking, ...prev]);
  };

  const loadBookingsForUser = async (userId) => {
    // Try to fetch from mock API (keeps ability to swap to real backend)
    try {
      const remote = await apiClient.getBookingsForUser(userId);
      if (remote && remote.length) {
        setBookings(remote);
        return;
      }
    } catch (e) {
      // ignore and fallback to local
    }
    // otherwise leave local bookings as-is (persisted in localStorage)
  };

  return (
    <BookingsContext.Provider value={{ bookings, addBooking, loadBookingsForUser }}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error('useBookings must be used within BookingsProvider');
  return ctx;
};

export default BookingsContext;
