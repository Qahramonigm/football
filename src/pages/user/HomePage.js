import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockFields } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Rating from '@/components/Rating';
import { Search, MapPin, Zap } from 'lucide-react';

const HomePage = () => {
  const lang = useLanguage();
  const t = lang.t;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [priceFilter, setPriceFilter] = useState('all');
  
  const filteredFields = useMemo(() => {
    let filtered = mockFields.filter(field => {
      const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          field.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPrice = priceFilter === 'all' ||
        (priceFilter === 'cheap' && field.pricePerHour <= 80000) ||
        (priceFilter === 'medium' && field.pricePerHour > 80000 && field.pricePerHour <= 150000) ||
        (priceFilter === 'expensive' && field.pricePerHour > 150000);
      
      return matchesSearch && matchesPrice;
    });

    // Sort
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.pricePerHour - a.pricePerHour);
    } else if (sortBy === 'reviews') {
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return filtered;
  }, [searchQuery, sortBy, priceFilter]);

  const topFields = mockFields
    .filter(item => item.promotionLevel === 'banner')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
  
  const featuredFields = mockFields.filter(item => item.isPromoted && item.promotionLevel === 'featured');
  const allFields = filteredFields.length > 0 ? filteredFields : mockFields.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Futbol Maydonlarini Bron Qiling
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Eng yaxshi polyalarni toping va onlayn bron qiling
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder={t('searchFields')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
              data-testid="search-input"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t('topFields')}</h2>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            ⭐ Top 6
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {topFields.map((field) => (
            <Link key={field.id} to={`/fields/${field.id}`} data-testid="banner-field">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-green-400/50">
                <div className="relative h-48">
                  <img src={field.images[0]} alt={field.name} className="w-full h-full object-cover" />
                  <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                    ⭐ {field.rating}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{field.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{field.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Rating value={field.rating} size="sm" />
                    <span className="font-bold text-green-600">
                      {field.pricePerHour.toLocaleString()} {t('som')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {featuredFields.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm">
              🔥 {t('featuredFields')}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFields.map((field) => (
              <Link key={field.id} to={`/fields/${field.id}`} data-testid="featured-field">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-yellow-400/50">
                  <div className="relative h-48">
                    <img src={field.images[0]} alt={field.name} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900">
                      ⭐ {t('featuredFields')}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{field.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{field.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Rating value={field.rating} size="sm" />
                      <span className="font-bold text-green-600">
                        {field.pricePerHour.toLocaleString()} {t('som')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-8 bg-white/50 dark:bg-gray-800/30 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">🔍 {t('filter') || 'Filter'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('sortBy') || 'Sort by'}
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">⭐ {t('highestRated') || 'Highest Rated'}</SelectItem>
                <SelectItem value="reviews">{t('mostReviewed') || 'Most Reviewed'}</SelectItem>
                <SelectItem value="price-low">💰 {t('lowestPrice') || 'Lowest Price'}</SelectItem>
                <SelectItem value="price-high">💎 {t('highestPrice') || 'Highest Price'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('priceRange') || 'Price Range'}
            </label>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allPrices') || 'All Prices'}</SelectItem>
                <SelectItem value="cheap">💵 {t('cheap') || 'Cheap (≤80K)'}</SelectItem>
                <SelectItem value="medium">💴 {t('medium') || 'Medium (80K-150K)'}</SelectItem>
                <SelectItem value="expensive">💎 {t('expensive') || 'Expensive (>150K)'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('found') || 'Found'}: {filteredFields.length} {t('fields') || 'Fields'}
            </label>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSortBy('rating');
                setPriceFilter('all');
              }}
              className="w-full"
            >
              🔄 {t('reset') || 'Reset'}
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t('fields')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allFields.map((field) => (
            <Link key={field.id} to={`/fields/${field.id}`} data-testid="field-card">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img src={field.images[0]} alt={field.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{field.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{field.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Rating value={field.rating} size="sm" />
                    <span className="font-bold text-green-600">
                      {field.pricePerHour.toLocaleString()} {t('som')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
