import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DollarSign, Calendar, TrendingUp, Plus } from 'lucide-react';
import client from '@/lib/apiClient';

const OwnerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState([
    {
      title: t('totalEarnings'),
      value: '0',
      suffix: t('som'),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: t('activeBookings'),
      value: '0',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: t('myFields'),
      value: '0',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const fields = await client.getOwnerFields('owner1');
        const bookings = await client.getOwnerBookings('owner1');
        const totalEarnings = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        
        setStats([
          {
            title: t('totalEarnings'),
            value: totalEarnings.toLocaleString(),
            suffix: t('som'),
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900',
          },
          {
            title: t('activeBookings'),
            value: String(bookings.length),
            icon: Calendar,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900',
          },
          {
            title: t('myFields'),
            value: String(fields.length),
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900',
          },
        ]);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      }
    };

    loadStats();
  }, [t]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" data-testid="dashboard-title">{t('dashboard')}</h1>
            <p className="text-muted-foreground mt-1">
              Xush kelibsiz, {user?.firstName}!
            </p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700" data-testid="add-field-button">
            <Link to="/owner/add-field">
              <Plus className="mr-2 h-4 w-4" />
              {t('addField')}
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} data-testid={`stat-card-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stat.value} {stat.suffix}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="verify-booking-card">
            <Link to="/owner/verify-booking">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="font-semibold">{t('verifyBooking')}</h3>
                <p className="text-sm text-muted-foreground mt-1">Kod tekshirish</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="my-fields-card">
            <Link to="/owner/fields">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚽</span>
                </div>
                <h3 className="font-semibold">{t('myFields')}</h3>
                <p className="text-sm text-muted-foreground mt-1">Polyalarni boshqarish</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="promote-card">
            <Link to="/owner/promote">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔥</span>
                </div>
                <h3 className="font-semibold">{t('promoteField')}</h3>
                <p className="text-sm text-muted-foreground mt-1">Reklama paketlari</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="bookings-card">
            <Link to="/owner/bookings">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="font-semibold">{t('myBookings')}</h3>
                <p className="text-sm text-muted-foreground mt-1">Bronlar ro'yxati</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('statistics')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">Bugun</p>
                  <p className="text-sm text-muted-foreground">3 ta yangi bron</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">300,000 so'm</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">Bu hafta</p>
                  <p className="text-sm text-muted-foreground">18 ta bron</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">1,800,000 so'm</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerDashboard;
