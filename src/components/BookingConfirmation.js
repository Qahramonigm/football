import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const BookingConfirmation = ({ bookingData, onClose }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bookingData.verificationCode);
    toast.success('Kod nusxalandi!');
  };

  return (
    <div className="space-y-6 py-4" data-testid="booking-confirmation">
      {/* Success Icon */}
      <div className="flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">{t('bookingConfirmed')}</h3>
        <p className="text-muted-foreground">Sizning broningiz muvaffaqiyatli amalga oshirildi!</p>
      </div>

      {/* Verification Code */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-500">
        <CardContent className="p-6 text-center">
          <div className="text-sm font-semibold text-muted-foreground mb-2">
            {t('verificationCode')}
          </div>
          <div className="text-5xl font-bold text-green-600 mb-3 tracking-wider" data-testid="verification-code">
            {bookingData.verificationCode}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            className="mt-2"
            data-testid="copy-code-button"
          >
            <Copy className="h-4 w-4 mr-2" />
            Nusxalash
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            {t('saveThisCode')}
          </p>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Polya:</span>
            <span className="font-semibold">{bookingData.field.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sana:</span>
            <span className="font-semibold">{format(bookingData.date, 'dd MMMM yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vaqt:</span>
            <span className="font-semibold">{bookingData.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Davomiyligi:</span>
            <span className="font-semibold">{bookingData.duration} {t('hours')}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="font-semibold">Jami to'lov:</span>
            <span className="text-xl font-bold text-green-600">
              {bookingData.totalPrice.toLocaleString()} {t('som')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Close Button */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => navigate('/my-bookings')}
          className="w-full bg-white border hover:bg-gray-50"
          data-testid="view-bookings-button"
        >
          {t('viewMyBookings') || 'Mening bronlarim'}
        </Button>
        <Button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700"
          data-testid="close-confirmation-button"
        >
          Yopish
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
