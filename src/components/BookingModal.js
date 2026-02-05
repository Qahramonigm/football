import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { timeSlots, generateVerificationCode } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PaymentModal from './PaymentModal';
import BookingConfirmation from './BookingConfirmation';
import { CalendarIcon, Clock, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import apiClient from '@/lib/apiClient';
import { useBookings } from '@/contexts/BookingsContext';

const BookingModal = ({ open, onClose, field }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: booking details, 2: payment, 3: confirmation
  const [bookingData, setBookingData] = useState({
    date: null,
    time: '',
    duration: 1,
  });
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);

  const handleDateSelect = (date) => {
    setBookingData({ ...bookingData, date });
  };

  const handleContinue = () => {
    if (!bookingData.date || !bookingData.time) {
      return;
    }
    setPaymentModalOpen(true);
  };

  const { addBooking } = useBookings();

  const handlePaymentSuccess = async () => {
    setPaymentModalOpen(false);
    try {
      const created = await apiClient.createBooking({
        fieldId: field.id,
        userId: user?.id || 'guest',
        date: bookingData.date,
        time: bookingData.time,
        duration: bookingData.duration,
      });
      setVerificationCode(created.verificationCode);
      addBooking(created);
      toast.success(t('bookingSaved') || 'Bron saqlandi');
      setStep(3);
    } catch (e) {
      const code = generateVerificationCode();
      setVerificationCode(code);
      setStep(3);
    }
  };

  const handleClose = () => {
    setStep(1);
    setBookingData({ date: null, time: '', duration: 1 });
    setVerificationCode(null);
    onClose();
  };

  const totalPrice = field.pricePerHour * bookingData.duration;

  return (
    <>
      <Dialog open={open && !paymentModalOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="booking-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {step === 3 ? t('bookingConfirmed') : t('bookNow')}
            </DialogTitle>
            <DialogDescription>
              {field.name} - {field.location}
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-6 py-4">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {t('selectDate')}
                </Label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={bookingData.date}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                    data-testid="date-picker"
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('selectTime')}
                </Label>
                <Select
                  value={bookingData.time}
                  onValueChange={(value) => setBookingData({ ...bookingData, time: value })}
                >
                  <SelectTrigger data-testid="time-selector">
                    <SelectValue placeholder={t('selectTime')} />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration Selection */}
              <div className="space-y-2">
                <Label>{t('duration')}</Label>
                <Select
                  value={bookingData.duration.toString()}
                  onValueChange={(value) => setBookingData({ ...bookingData, duration: parseInt(value) })}
                >
                  <SelectTrigger data-testid="duration-selector">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((hours) => (
                      <SelectItem key={hours} value={hours.toString()}>
                        {hours} {t('hours')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">
                    {field.pricePerHour.toLocaleString()} × {bookingData.duration} {t('hours')}
                  </span>
                  <span className="font-semibold">{totalPrice.toLocaleString()} {t('som')}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{t('totalPrice')}:</span>
                  <span className="text-green-600">{totalPrice.toLocaleString()} {t('som')}</span>
                </div>
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!bookingData.date || !bookingData.time}
                data-testid="continue-booking-button"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {t('confirmBooking')}
              </Button>
            </div>
          )}

          {step === 3 && (
            <BookingConfirmation
              bookingData={{
                ...bookingData,
                field,
                totalPrice,
                verificationCode,
              }}
              onClose={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        amount={totalPrice}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default BookingModal;
