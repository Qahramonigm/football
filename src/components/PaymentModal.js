import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CreditCard, Smartphone } from 'lucide-react';

const PaymentModal = ({ open, onClose, amount, onSuccess }) => {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState('click');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      if (!cardData.number || !cardData.expiry || !cardData.cvv) {
        toast.error(t('error'));
        return;
      }
    }

    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast.success(t('success'));
      onSuccess();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="payment-modal">
        <DialogHeader>
          <DialogTitle>{t('paymentMethod')}</DialogTitle>
          <DialogDescription>
            {t('totalPrice')}: <span className="font-bold text-green-600">{amount.toLocaleString()} {t('som')}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePayment} className="space-y-6 py-4">
          {/* Payment Method Selection */}
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <RadioGroupItem value="click" id="click" data-testid="payment-click" />
              <Label htmlFor="click" className="flex items-center gap-2 cursor-pointer flex-1">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold">Click</div>
                  <div className="text-sm text-muted-foreground">Mobil to'lov</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <RadioGroupItem value="payme" id="payme" data-testid="payment-payme" />
              <Label htmlFor="payme" className="flex items-center gap-2 cursor-pointer flex-1">
                <Smartphone className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-semibold">Payme</div>
                  <div className="text-sm text-muted-foreground">Mobil to'lov</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <RadioGroupItem value="card" id="card" data-testid="payment-card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                <CreditCard className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-semibold">{t('other')}</div>
                  <div className="text-sm text-muted-foreground">Bank kartasi</div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {/* Card Details (shown when 'other' is selected) */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">{t('cardNumber')}</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  maxLength={19}
                  data-testid="card-number-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">{t('expiryDate')}</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    maxLength={5}
                    data-testid="card-expiry-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">{t('cvv')}</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    maxLength={3}
                    type="password"
                    data-testid="card-cvv-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading}
            data-testid="pay-button"
          >
            {loading ? t('loading') : `${t('payNow')} - ${amount.toLocaleString()} ${t('som')}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
