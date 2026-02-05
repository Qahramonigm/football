import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { CheckCircle, XCircle, ChevronLeft } from 'lucide-react';

const VerifyBookingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const CORRECT_CODE = '123';

  const handleVerify = (e) => {
    e.preventDefault();
    if (code.length !== 3) {
      toast.error('3 raqamli kodni kiriting');
      return;
    }

    if (attempts <= 0) {
      toast.error('Urinishlar tugadi!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code === CORRECT_CODE) {
        setVerificationResult('correct');
        toast.success(t('codeCorrect'));
      } else {
        setVerificationResult('incorrect');
        setAttempts(prev => prev - 1);
        toast.error(t('codeIncorrect'));
        if (attempts - 1 <= 0) {
          toast.error("Urinishlar tugadi! Iltimos, foydalanuvchi bilan bog'laning.");
        }
      }

      setTimeout(() => {
        setCode('');
        setVerificationResult(null);
      }, 1600);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/owner/dashboard')}
          className="mb-4"
          data-testid="back-button"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Button>

        <Card className="max-w-md mx-auto" data-testid="verify-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('verifyBooking')}</CardTitle>
            <CardDescription>{t('enterVerificationCode')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-center block">{t('verificationCode')}</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={3} value={code} onChange={setCode} data-testid="verification-code-input">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="text-2xl h-16 w-16" />
                      <InputOTPSlot index={1} className="text-2xl h-16 w-16" />
                      <InputOTPSlot index={2} className="text-2xl h-16 w-16" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {verificationResult && (
                <div
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    verificationResult === 'correct'
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}
                  data-testid="verification-result"
                >
                  {verificationResult === 'correct' ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-200">{t('codeCorrect')}</p>
                        <p className="text-sm text-green-700 dark:text-green-300">Foydalanuvchi kirishga ruxsat berildi</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-600" />
                      <div>
                        <p className="font-semibold text-red-800 dark:text-red-200">{t('codeIncorrect')}</p>
                        <p className="text-sm text-red-700 dark:text-red-300">Iltimos, qayta urinib ko'ring</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-muted-foreground">{t('attemptsLeft')}: <span className="font-bold text-lg">{attempts}</span></p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-800 dark:text-blue-200">📝 Test rejim: To'g'ri kod = <strong>123</strong></p>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading || code.length !== 3 || attempts <= 0} data-testid="check-code-button">
                {loading ? t('loading') : t('checkCode')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyBookingPage;

