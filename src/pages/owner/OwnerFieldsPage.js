import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import client from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Rating from '@/components/Rating';
import { toast } from 'sonner';
import { ChevronLeft, Edit2, Trash2, Plus, Eye } from 'lucide-react';

const OwnerFieldsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [mockFields, setMockFields] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch fields from client on mount and whenever navigating back
  useEffect(() => {
    const fetchFields = async () => {
      setLoading(true);
      try {
        const fields = await client.getOwnerFields('owner1');
        setMockFields(fields);
      } catch (err) {
        console.error('Error fetching fields:', err);
        setMockFields([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  const filteredFields = mockFields.filter(field =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (fieldId) => {
    try {
      await client.deleteOwnerField('owner1', fieldId);
      setMockFields(prev => prev.filter(f => f.id !== fieldId));
      toast.success("Polya muvaffaqiyatli o'chirildi");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error("O'chirishda xatolik");
      setDeleteConfirm(null);
    }
  };

  const handlePromote = (fieldId) => {
    navigate(`/owner/promote/${fieldId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/owner/dashboard')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{t('myFields')}</h1>
              <p className="text-muted-foreground mt-1">
                Barcha polyalaringizni boshqaring
              </p>
            </div>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => navigate('/owner/add-field')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Yangi polya
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Input
              placeholder="Polya nomini yoki joylashuvini qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Fields Grid */}
        <div className="grid gap-6">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-lg text-muted-foreground">Yuklanmoqda...</p>
              </CardContent>
            </Card>
          ) : filteredFields.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  Polyalar topilmadi
                </p>
                <Button onClick={() => navigate('/owner/add-field')}>
                  Birinchi polyani qo'shish
              </CardContent>
            </Card>
          ) : (
              <Card key={field.id} className="overflow-hidden">
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-48 h-48 flex-shrink-0">
                    <img
                      src={field.image}
                      alt={field.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <CardContent className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl font-bold">{field.name}</h3>
                          {field.isPromoted && (
                            <Badge className="bg-yellow-400 text-yellow-900">
                              🔥 Reklamali
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {field.location} • {field.address}
                        </p>
                      </div>
                      <div className="text-3xl font-bold text-green-600">
                        {(field.pricePerHour || 0).toLocaleString()}
                        <span className="text-sm text-muted-foreground block mt-1">
                          so'm/soat
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Reyting
                        </p>
                        <div className="flex items-center gap-1">
                          <Rating value={field.rating} size="sm" showValue={false} />
                          <span className="font-semibold">{field.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {field.reviewCount} sharhlar
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Bronlar
                        </p>
                        <p className="text-2xl font-bold">{field.bookings}</p>
                        <p className="text-xs text-muted-foreground">jami</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Daromad
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {((field.earnings || 0) / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(field.earnings || 0).toLocaleString()} so'm
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Reyting
                        </p>
                        <p className="text-xl font-bold">
                          {(field.reviewCount / 10).toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          reputatsiya
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/fields/${field.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ko'rish
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/owner/edit-field/${field.id}`)}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Tahrirlash
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/owner/promote/${field.id}`)}
                      >
                        🔥 Reklama
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm(field.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        O'chirish
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Polyani o'chirasizmi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu amalni bekor qilib bo'lmaydi. Polya va uning barcha ma'lumotlari o'chilib ketadi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Ha, o'chirish
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OwnerFieldsPage;
