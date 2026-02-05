import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { adPackages } from '@/data/mockData';
import client from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PaymentModal from '@/components/PaymentModal';
import { toast } from 'sonner';
import { ChevronLeft, Zap, TrendingUp, Star } from 'lucide-react';

const PromoteFieldPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedField, setSelectedField] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [userFields, setUserFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFields = async () => {
      try {
        const fields = await client.getOwnerFields('owner1');
        setUserFields(fields);
      } catch (err) {
        console.error('Error loading fields:', err);
        setUserFields([]);
      } finally {
        setLoading(false);
      }
    };
    loadFields();
  }, []);

  const handleSelectPackage = (pkg) => {
    if (!selectedField) {
      toast.error('Avval polyani tanlang');
      return;
    }
    setSelectedPackage(pkg);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false);
    toast.success('Reklama paketi muvaffaqiyatli sotib olindi!');
    setTimeout(() => {
      navigate('/owner/fields');
    }, 1500);
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

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('promoteField')}</h1>
            <p className="text-muted-foreground">
              O'z polyangizni reklamada ko'rsating va ko'proq mijozlar jalb qiling
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Polyani tanlang</CardTitle>
              <CardDescription>Qaysi polyani reklama qilmoqchisiz?</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Yuklanmoqda...</p>
              ) : userFields.length === 0 ? (
                <p className="text-muted-foreground">
                  Hech qanday polya topilmadi. Avval{' '}
                  <button
                    onClick={() => navigate('/owner/add-field')}
                    className="text-green-600 hover:underline font-semibold"
                  >
                    polya qo'shing
                  </button>
                </p>
              ) : (
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger data-testid="field-selector">
                    <SelectValue placeholder="Polya tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {userFields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-1">Ko'proq ko'rinish</h3>
                <p className="text-sm text-muted-foreground">Reklamali polyalar birinchi o'rinda</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Tezkor natija</h3>
                <p className="text-sm text-muted-foreground">Darhol ko'proq mijozlar</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Yuqori reyting</h3>
                <p className="text-sm text-muted-foreground">Ishonchli ko'rinish</p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">{t('selectPackage')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`relative hover:shadow-xl transition-shadow ${
                    pkg.isPro ? 'border-2 border-yellow-400' : ''
                  }`}
                  data-testid={`package-${pkg.id}`}
                >
                  {pkg.isPro && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900">
                      ⭐ PRO
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{pkg.duration}</CardTitle>
                    <div className="text-3xl font-bold text-green-600 mt-2">
                      {pkg.price.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground ml-1">{t('som')}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        {pkg.days} kun reklama
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        Birinchi o'rinda
                      </p>
                      {pkg.isPro && (
                        <p className="flex items-center gap-2">
                          <span className="text-yellow-600">⭐</span>
                          Pro belgi
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleSelectPackage(pkg)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      data-testid={`buy-package-${pkg.id}`}
                    >
                      {t('purchase')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedPackage && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          amount={selectedPackage.price}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PromoteFieldPage;