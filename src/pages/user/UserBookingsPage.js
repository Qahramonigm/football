import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/contexts/BookingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Rating from '@/components/Rating';
import { ChevronLeft, Calendar, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const UserBookingsPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all'); // all, upcoming, completed, cancelled

  const { bookings, loadBookingsForUser } = useBookings();

  useEffect(() => {
    if (user) loadBookingsForUser(user.id);
  }, [user, loadBookingsForUser]);

  const filteredBookings = bookings.filter((b) =>
    filterStatus === 'all' || b.status === filterStatus
  );

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-800' },
      upcoming: { label: 'Kutilmoqda', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Bajarildi', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Bekor qilindi', color: 'bg-red-100 text-red-800' },
    };
    return config[status] || { label: status || 'Noma\'lum', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t('myBookings')}</h1>
            <p className="text-muted-foreground mt-1">
              Sizning bronlaringizni ko'ring va boshqaring
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['all', 'upcoming', 'completed', 'cancelled'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {status === 'all' && t('all')}
              {status === 'upcoming' && 'Kutilmoqda'}
              {status === 'completed' && 'Bajarildi'}
              {status === 'cancelled' && 'Bekor qilindi'}
            </Button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                {filterStatus === 'all' 
                  ? 'Sizda hozir bronlar yo\'q'
                  : 'Bu holatda bronlar yo\'q'}
              </p>
              <Button onClick={() => navigate('/')}>
                🔍 Yangi polya qidirish
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const status = getStatusBadge(booking.status);
              return (
                <Card
                  key={booking.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-40 h-40 flex-shrink-0">
                      <img
                        src={booking.image || (booking.field && booking.field.images && booking.field.images[0]) || '/placeholder-field.jpg'}
                        alt={booking.fieldName || 'Field image'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <CardContent className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-1">
                              {booking.fieldName}
                            </h3>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">{booking.location}</span>
                            </div>
                          </div>
                          <Badge className={status.color}>
                            {status.label}
                          </Badge>
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              📅 Sana
                            </p>
                            <p className="font-semibold">
                              {booking.date ? format(new Date(booking.date), 'dd MMM') : '-'}
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
                            <p className="font-semibold text-green-600">
                              {booking.totalPrice.toLocaleString()} {t('som')}
                            </p>
                          </div>
                        </div>

                        {/* Verification Code for upcoming */}
                        {booking.status === 'upcoming' && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-4">
                            <p className="text-xs text-muted-foreground mb-1">
                              Tasdiqlash kodi:
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {booking.verificationCode}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        {booking.status === 'completed' && !booking.hasReview && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/fields/${booking.fieldId}/review`)}
                          >
                            ⭐ Sharh qoldirish
                          </Button>
                        )}
                        {booking.status === 'completed' && booking.hasReview && (
                          <div className="flex items-center gap-2">
                            <Rating value={booking.rating} size="sm" showValue={false} />
                            <span className="text-sm text-muted-foreground">
                              Sharh qoldirilgan
                            </span>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/fields/${booking.fieldId}`)}
                        >
                          Polyani ko'rish
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookingsPage;
