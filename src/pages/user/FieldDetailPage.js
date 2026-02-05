import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { mockFields } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Rating from '@/components/Rating';
import BookingModal from '@/components/BookingModal';
import { MapPin, ChevronLeft, Phone, Mail } from 'lucide-react';

const FieldDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const lang = useLanguage();
  const t = lang.t;
  const { isAuthenticated, user } = useAuth();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  
  const fieldId = params.id;
  const field = mockFields.find(item => item.id === fieldId);

  if (!field) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Polya topilmadi</h1>
          <Button onClick={() => navigate('/fields')}>Ortga qaytish</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
          data-testid="back-button"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-96 rounded-xl overflow-hidden" data-testid="field-image">
              <img
                src={field.images[0]}
                alt={field.name}
                className="w-full h-full object-cover"
              />
              {field.isPromoted && (
                <Badge className="absolute top-4 right-4 bg-yellow-400 text-yellow-900">
                  ⭐ {t('featuredFields')}
                </Badge>
              )}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2" data-testid="field-name">{field.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="h-5 w-5" />
                      <span>{field.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{field.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600" data-testid="field-price">
                      {field.pricePerHour.toLocaleString()} {t('som')}
                    </div>
                    <div className="text-sm text-muted-foreground">{t('hourly')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <Rating value={field.rating} size="lg" />
                    <p className="text-sm text-muted-foreground mt-1">
                      {field.reviewCount} {t('reviews')}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Tavsif</h3>
                  <p className="text-muted-foreground">{field.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Imkoniyatlar</h3>
                  <div className="flex flex-wrap gap-2">
                    {field.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {field.pricePerHour.toLocaleString()} {t('som')}
                  </div>
                  <div className="text-sm text-muted-foreground">{t('hourly')}</div>
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                  onClick={() => isAuthenticated ? setBookingModalOpen(true) : navigate('/login')}
                  data-testid="book-now-button"
                >
                  {t('bookNow')}
                </Button>
                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>✅ {t('bookNow')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>✅ {t('verificationCode')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>✅ {t('success')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        field={field}
      />
    </div>
  );
};

export default FieldDetailPage;
