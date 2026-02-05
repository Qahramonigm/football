import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import client from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PaymentModal from '@/components/PaymentModal';
import { toast } from 'sonner';
import { Upload, ChevronLeft } from 'lucide-react';
import { useRef } from 'react';

const AddFieldPage = () => {
  const { t } = useLanguage();
  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import client from '@/lib/apiClient';
  import { Button } from '@/ui/button';
  import { Input } from '@/ui/input';
  import { Textarea } from '@/ui/textarea';
  import PaymentModal from '@/components/PaymentModal';
  import { toast } from 'sonner';

  const AddFieldPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [pricePerHour, setPricePerHour] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const handleFileChange = (e) => {
      const files = Array.from(e.target.files || []);
      const readers = files.map((file) => {
        return new Promise((res) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then((results) => setUploadedFiles(results));
    };

    const handlePaymentSuccess = async () => {
      const image = uploadedFiles[0] || '';
      const payload = { name, description, location, address, pricePerHour: Number(pricePerHour || 0), image };
      try {
        const newField = await client.createOwnerField('owner1', payload);
        toast.success('Field created');
        navigate('/owner/fields');
      } catch (err) {
        toast.error('Failed to create field');
      }
    };

    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Field</h2>
        <div className="grid grid-cols-1 gap-4 max-w-lg">
          <label>
            <div className="text-sm mb-1">Field Name</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>
            <div className="text-sm mb-1">Description</div>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <label>
            <div className="text-sm mb-1">Location</div>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>

          <label>
            <div className="text-sm mb-1">Address</div>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>

          <label>
            <div className="text-sm mb-1">Price per hour</div>
            <Input value={pricePerHour} onChange={(e) => setPricePerHour(e.target.value)} type="number" />
          </label>

          <label>
            <div className="text-sm mb-1">Images</div>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
            <div className="mt-2 flex gap-2">
              {uploadedFiles.map((f, i) => (
                <img key={i} src={f} alt={`upload-${i}`} className="w-24 h-24 object-cover" />
              ))}
            </div>
          </label>

          <div className="pt-4">
            <Button onClick={() => setIsPaymentOpen(true)}>Create Field</Button>
          </div>
        </div>

        <PaymentModal open={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} onSuccess={handlePaymentSuccess} amount={5000} />
      </div>
    );
  };

  export default AddFieldPage;
                  onChange={handleChange}
                  placeholder="Green Arena"
                  data-testid="field-name-input"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t('fieldDescription')}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Polya haqida ma'lumot..."
                  rows={4}
                  data-testid="field-description-input"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">{t('location')} *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Toshkent, Chilonzor tumani"
                  data-testid="field-location-input"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">{t('address')}</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Ko'cha nomi va uy raqami"
                  data-testid="field-address-input"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="pricePerHour">{t('pricePerHour')} (so'm) *</Label>
                <Input
                  id="pricePerHour"
                  name="pricePerHour"
                  type="number"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  placeholder="100000"
                  data-testid="field-price-input"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>{t('uploadPhotos')}</Label>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current && fileInputRef.current.click()}
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Rasmlarni yuklash uchun bosing yoki sudrab olib keling
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {uploadedFiles.length > 0 ? `${uploadedFiles.length} fayl tanlandi` : 'Hozircha hech rasm tanlanmadi'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      const results = [];
                      for (const f of files) {
                        const dataUrl = await new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.onload = (ev) => resolve(ev.target.result);
                          reader.readAsDataURL(f);
                        });
                        results.push({ name: f.name, url: dataUrl });
                      }
                      setUploadedFiles(results);
                    }}
                    data-testid="field-photo-input"
                  />
                </div>
              </div>

              {/* Fee Notice */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                  ⚠️ {t('addFieldFee')}
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Polya qo'shish uchun bir martalik to'lov
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
                data-testid="submit-field-button"
              >
                {loading ? t('loading') : t('submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        amount={50000}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default AddFieldPage;
