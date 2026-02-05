import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '@/lib/apiClient';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { toast } from 'sonner';

const EditFieldPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    let mounted = true;
    client.getOwnerFields('owner1').then((fields) => {
      if (!mounted) return;
      const f = (fields || []).find((x) => x.id === id);
      setField(f || null);
      if (f) {
        setName(f.name || '');
        setLocation(f.location || '');
        setPricePerHour(f.pricePerHour || '');
        setDescription(f.description || '');
        setImage(f.image || '');
      }
      setLoading(false);
    });
    return () => (mounted = false);
  }, [id]);

  const handleSave = async () => {
    try {
      await client.updateOwnerField('owner1', id, { name, location, pricePerHour: Number(pricePerHour || 0), description, image });
      toast.success('Saved');
      navigate('/owner/fields');
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (!field) return <div className="p-6">Field not found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Field</h2>
      <div className="grid grid-cols-1 gap-4 max-w-lg">
        <label>
          <div className="text-sm mb-1">Name</div>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          <div className="text-sm mb-1">Location</div>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>

        <label>
          <div className="text-sm mb-1">Price per hour</div>
          <Input value={pricePerHour} onChange={(e) => setPricePerHour(e.target.value)} type="number" />
        </label>

        <label>
          <div className="text-sm mb-1">Description</div>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <label>
          <div className="text-sm mb-1">Image (data URL)</div>
          <Input value={image} onChange={(e) => setImage(e.target.value)} />
        </label>

        <div className="pt-4">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default EditFieldPage;
