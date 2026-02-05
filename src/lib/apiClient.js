import axios from 'axios';
import { mockFields, adPackages, timeSlots, generateVerificationCode } from '@/data/mockData';

const BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const simulateNetwork = (result, ms = 400) =>
  new Promise((res) => setTimeout(() => res(result), ms));

const STORAGE_KEY = 'owner_fields_v1';

function loadOwnerFieldsFromStorage(ownerId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw || '{}');
    return all[ownerId] || [];
  } catch (err) {
    console.warn('Failed to read owner fields from storage', err);
    return [];
  }
}

function saveOwnerFieldsToStorage(ownerId, fields) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[ownerId] = fields;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.warn('Failed to save owner fields to storage', err);
  }
}

const client = {
  async getFields() {
    return simulateNetwork(mockFields);
  },

  async getField(id) {
    const field = mockFields.find((f) => f.id === id);
    return simulateNetwork(field || null);
  },

  async searchFields(query = '') {
    const q = query.trim().toLowerCase();
    const results = mockFields.filter(
      (f) => f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q)
    );
    return simulateNetwork(results);
  },

  async getAdPackages() {
    return simulateNetwork(adPackages);
  },

  async getTimeSlots() {
    return simulateNetwork(timeSlots);
  },

  async createBooking({ fieldId, userId, date, time, duration }) {
    const field = mockFields.find((f) => f.id === fieldId);
    const totalPrice = field ? field.pricePerHour * duration : 0;
    const verificationCode = generateVerificationCode();

    const parsedDate = new Date(date);
    const now = new Date();
    const status = parsedDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate()) ? 'upcoming' : 'completed';

    const booking = {
      id: String(Math.floor(Math.random() * 1000000)),
      fieldId,
      fieldName: field?.name || 'Field',
      location: field?.location || '',
      image: field?.image || (field?.images && field.images[0]) || null,
      userId,
      date: parsedDate,
      time,
      duration,
      totalPrice,
      verificationCode,
      status,
    };

    return simulateNetwork(booking, 800);
  },

  async getBookingsForUser(userId) {
    return simulateNetwork([]);
  },

  _ownerFields: {},

  async getOwnerFields(ownerId) {
    if (process.env.REACT_APP_USE_REAL_BACKEND === 'true') {
      return axios.get(`${BASE}/api/owner/${ownerId}/fields`).then(r => r.data);
    }

    if (!client._ownerFields[ownerId]) {
      client._ownerFields[ownerId] = loadOwnerFieldsFromStorage(ownerId) || [];
    }
    return simulateNetwork([...client._ownerFields[ownerId]]);
  },

  async createOwnerField(ownerId, fieldData) {
    if (process.env.REACT_APP_USE_REAL_BACKEND === 'true') {
      return axios.post(`${BASE}/api/owner/${ownerId}/fields`, fieldData).then(r => r.data);
    }

    if (!client._ownerFields[ownerId]) {
      client._ownerFields[ownerId] = loadOwnerFieldsFromStorage(ownerId) || [];
    }

    const newField = {
      name: fieldData.name || 'Unnamed field',
      description: fieldData.description || '',
      location: fieldData.location || '',
      address: fieldData.address || '',
      pricePerHour: Number(fieldData.pricePerHour) || 0,
      id: String(Math.floor(Math.random() * 1000000)),
      ownerId,
      rating: fieldData.rating || 0,
      reviewCount: fieldData.reviewCount || 0,
      image: fieldData.image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80',
      bookings: fieldData.bookings || 0,
      earnings: fieldData.earnings || 0,
      isPromoted: fieldData.isPromoted || false,
      createdAt: new Date().toISOString(),
    };

    client._ownerFields[ownerId].push(newField);
    saveOwnerFieldsToStorage(ownerId, client._ownerFields[ownerId]);
    return simulateNetwork(newField, 600);
  },

  async updateOwnerField(ownerId, fieldId, fieldData) {
    if (process.env.REACT_APP_USE_REAL_BACKEND === 'true') {
      return axios.put(`${BASE}/api/owner/${ownerId}/fields/${fieldId}`, fieldData).then(r => r.data);
    }

    if (!client._ownerFields[ownerId]) {
      client._ownerFields[ownerId] = loadOwnerFieldsFromStorage(ownerId) || [];
    }
    const idx = client._ownerFields[ownerId].findIndex(f => f.id === fieldId);
    if (idx === -1) return simulateNetwork(null);
    client._ownerFields[ownerId][idx] = { ...client._ownerFields[ownerId][idx], ...fieldData };
    saveOwnerFieldsToStorage(ownerId, client._ownerFields[ownerId]);
    return simulateNetwork(client._ownerFields[ownerId][idx], 400);
  },

  async deleteOwnerField(ownerId, fieldId) {
    if (process.env.REACT_APP_USE_REAL_BACKEND === 'true') {
      return axios.delete(`${BASE}/api/owner/${ownerId}/fields/${fieldId}`).then(r => r.data);
    }

    if (!client._ownerFields[ownerId]) {
      client._ownerFields[ownerId] = loadOwnerFieldsFromStorage(ownerId) || [];
    }
    const idx = client._ownerFields[ownerId].findIndex(f => f.id === fieldId);
    if (idx === -1) return simulateNetwork({ ok: false });
    client._ownerFields[ownerId].splice(idx, 1);
    saveOwnerFieldsToStorage(ownerId, client._ownerFields[ownerId]);
    return simulateNetwork({ ok: true });
  },

  async getOwnerBookings(ownerId, filters = {}) {
    if (process.env.REACT_APP_USE_REAL_BACKEND === 'true') {
      const params = new URLSearchParams(filters);
      return axios.get(`${BASE}/api/owner/${ownerId}/bookings?${params}`).then(r => r.data);
    }

    if (!client._ownerBookings) {
      client._ownerBookings = [
        {
          id: 'b1', userId: 'u1', userName: 'Ahmed Karimov', userPhone: '+998912345678',
          fieldId: mockFields[0]?.id || '1', fieldName: mockFields[0]?.name || 'Field',
          location: mockFields[0]?.location || '', date: new Date(), time: '18:00', duration: 2,
          totalPrice: (mockFields[0]?.pricePerHour || 100000) * 2, status: 'pending', verificationCode: '123456', isVerified: false
        }
      ];
    }

    let list = client._ownerBookings;
    if (filters.status) list = list.filter(b => b.status === filters.status);
    return simulateNetwork(list, 300);
  },

  async verifyBooking(ownerId, bookingId, verificationCode) {
    if (process.env.REACT_APP_USE_REAL_BACKEND === 'true') {
      return axios.post(`${BASE}/api/owner/${ownerId}/bookings/${bookingId}/verify`, { verificationCode }).then(r => r.data);
    }

    const bookings = client._ownerBookings || [];
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) return simulateNetwork({ ok: false });
    bookings[idx].isVerified = true;
    bookings[idx].status = 'verified';
    return simulateNetwork({ ok: true, booking: bookings[idx] }, 300);
  },

  async getOwnerStats(ownerId) {
    if (process.env.REACT_APP_USE_REAL_BACKEND === 'true') {
      return axios.get(`${BASE}/api/owner/${ownerId}/stats`).then(r => r.data);
    }

    const fields = mockFields.filter(f => !ownerId || f.ownerId === ownerId);
    const bookings = client._ownerBookings || [];
    const totalBookings = bookings.length;
    const earnings = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
    return simulateNetwork({ totalFields: fields.length, totalBookings, earnings }, 200);
  },

  async promoteField(ownerId, fieldId, promotionData) {
    if (process.env.REACT_APP_USE_REAL_BACKEND === 'true') {
      return axios.post(`${BASE}/api/owner/${ownerId}/fields/${fieldId}/promote`, promotionData).then(r => r.data);
    }

    const idx = mockFields.findIndex(f => f.id === fieldId);
    if (idx === -1) return simulateNetwork({ ok: false });
    mockFields[idx].isPromoted = true;
    return simulateNetwork({ ok: true, field: mockFields[idx] }, 400);
  },

  useRealBackend() {
    return {
      getFields: () => axios.get(`${BASE}/api/fields`).then(r => r.data),
      getField: (id) => axios.get(`${BASE}/api/fields/${id}`).then(r => r.data),
      createBooking: (payload) => axios.post(`${BASE}/api/bookings`, payload).then(r => r.data),
    };
  }
};

export default client;
