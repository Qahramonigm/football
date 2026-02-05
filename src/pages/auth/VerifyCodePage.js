import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';

const VerifyCodePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!phoneNumber) {
    navigate('/login');
    return null;
  }

  const handleVerify = (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast.error(t('error'));
      return;
    }

    setLoading(true);
    
    // Simulate verification (test mode: accept any 6-digit code)
    setTimeout(() => {
      setLoading(false);
      toast.success(t('success'));
      navigate('/register', { state: { phoneNumber, verified: true } });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md" data-testid="verify-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('verifyCode')}</CardTitle>
          <CardDescription>
            {t('enterSmsCode')}
            <br />
            <span className="font-semibold">{phoneNumber}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                data-testid="otp-input"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Test rejim: Istalgan 6 ta raqam kiriting
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading || code.length !== 6}
              data-testid="verify-button"
            >
              {loading ? t('loading') : t('verify')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate('/login')}
              data-testid="back-button"
            >
              {t('back')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyCodePage;
