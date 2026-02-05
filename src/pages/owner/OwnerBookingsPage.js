import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ChevronLeft, CheckCircle, Clock, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const OwnerBookingsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Mock bookings data (stateful for UI interactions)
  const [mockBookings, setMockBookings] = useState([
    {
      id: '1',
      userId: 'user1',
      userName: 'Ahmed Karimov',
      userPhone: '+998 91 234 5678',
      fieldId: '1',
      fieldName: 'Green Arena',
      location: 'Chilonzor, Toshkent',
      date: new Date(2026, 1, 10),
      time: '18:00',
      duration: 2,
      totalPrice: 200000,
      status: 'pending',
      verificationCode: '123456',
      isVerified: false,
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Farah Yusupova',
      userPhone: '+998 92 345 6789',
      fieldId: '2',
      fieldName: 'Champion Field',
      location: 'Mirzo Ulug\'bek, Toshkent',
      date: new Date(2026, 1, 8),
      time: '16:00',
      duration: 1,
      totalPrice: 120000,
      status: 'verified',
      verificationCode: '654321',
      isVerified: true,
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Rustam Hodjaev',
      userPhone: '+998 93 456 7890',
      fieldId: '1',
      fieldName: 'Green Arena',
      location: 'Chilonzor, Toshkent',
      date: new Date(2026, 1, 5),
      time: '10:00',
      duration: 3,
      totalPrice: 300000,
      status: 'completed',
      verificationCode: '789012',
      isVerified: true,
    },
  ]);

  let filteredBookings = mockBookings.filter(b =>
    filterStatus === 'all' || b.status === filterStatus
  );

  // Sort
  if (sortBy === 'date-desc') {
    filteredBookings.sort((a, b) => b.date - a.date);
  } else if (sortBy === 'date-asc') {
    filteredBookings.sort((a, b) => a.date - b.date);
  } else if (sortBy === 'price-high') {
    filteredBookings.sort((a, b) => b.totalPrice - a.totalPrice);
  } else if (sortBy === 'price-low') {
    filteredBookings.sort((a, b) => a.totalPrice - b.totalPrice);
  }

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Tasdiqlash kutilmoqda', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      verified: { label: 'Tasdiqlandy', color: 'bg-blue-100 text-blue-800', icon: '✓' },
      completed: { label: 'Bajarildi', color: 'bg-green-100 text-green-800', icon: '✓' },
    };
    return config[status] || config.pending;
  };

  const handleVerify = (bookingId) => {
    setMockBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'verified', isVerified: true } : b));
    toast.success('Bron tasdiqlandi!');
  };

  const stats = {
    total: mockBookings.length,
    pending: mockBookings.filter(b => b.status === 'pending').length,
    verified: mockBookings.filter(b => b.status === 'verified').length,
    completed: mockBookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/owner/dashboard')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t('myBookings')}</h1>
            <p className="text-muted-foreground mt-1">
              Barcha mijozlar bronlarini boshqaring
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-muted-foreground mt-2">Jami bronlar</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-muted-foreground mt-2">Kutilmoqda</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.verified}</p>
              <p className="text-sm text-muted-foreground mt-2">Tasdiqlandy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-muted-foreground mt-2">Bajarildi</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha</SelectItem>
                    <SelectItem value="pending">Kutilmoqda</SelectItem>
                    <SelectItem value="verified">Tasdiqlandy</SelectItem>
                    <SelectItem value="completed">Bajarildi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Tartiblash</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Yangi sana avval</SelectItem>
                    <SelectItem value="date-asc">Eski sana avval</SelectItem>
                    <SelectItem value="price-high">Qimmat birinchi</SelectItem>
                    <SelectItem value="price-low">Arzon birinchi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-lg text-muted-foreground">
                  Bu holatda bronlar yo'q
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const statusConfig = getStatusBadge(booking.status);
              return (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">
                            {booking.fieldName}
                          </h3>
                          <Badge className={statusConfig.color}>
                            {statusConfig.icon} {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {booking.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {booking.totalPrice.toLocaleString()} so'm
                        </p>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          <User className="inline h-3 w-3 mr-1" />
                          Foydalanuvchi
                        </p>
                        <p className="font-semibold">{booking.userName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          📞 Telefon
                        </p>
                        <p className="font-semibold">{booking.userPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          📅 Bron kodi
                        </p>
                        <p className="font-bold text-blue-600 text-lg">
                          {booking.verificationCode}
                        </p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          📅 Sana
                        </p>
                        <p className="font-semibold">
                          {format(booking.date, 'dd MMM yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          🕐 Vaqt
                        </p>
                        <p className="font-semibold">{booking.time}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          ⏱️ Davom
                        </p>
                        <p className="font-semibold">{booking.duration} soat</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          💰 Jami
                        </p>
                        <p className="font-semibold">
                          {booking.totalPrice.toLocaleString()} so'm
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleVerify(booking.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Tasdiqlash
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate('/owner/verify-booking')}
                      >
                        🔍 Kodni tekshirish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerBookingsPage;
