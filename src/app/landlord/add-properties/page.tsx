'use client';

import { useState, useRef } from 'react';

import { Plus, Upload, Image, X } from 'lucide-react';
import { toast } from "sonner";

import LandlordNavbar from "@/components/layout/LandlordNavbar";
import LandlordSidebar from "@/components/layout/LandlordSidebar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppSelector } from "@/store/hooks";
import type { PropertyType, PropertyStatus } from '@/types/property.types';


export default function AddPropertyPage() {
  const { userData } = useAppSelector(state => state.auth);
  const displayName = userData?.fullName?.split(' ')[0] || 'Landlord';
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'APARTMENT' as PropertyType,
    status: 'AVAILABLE' as PropertyStatus,
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: [] as string[],
    images: [] as File[],
  });
  
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: File[] = [];
    const newPreviews: string[] = [];

    files.forEach((file) => {
      if (file.type.startsWith('image/') && file.size < 5 * 1024 * 1024) { // 5MB limit
        newImages.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);

      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('location', formData.location);
    submitData.append('propertyType', formData.propertyType);
    submitData.append('status', formData.status);
    submitData.append('bedrooms', formData.bedrooms);
    submitData.append('bathrooms', formData.bathrooms);
    submitData.append('area', formData.area);
    submitData.append('amenities', JSON.stringify(formData.amenities));

   
    formData.images.forEach((image) => {
      submitData.append('images', image);
    });

    try {
      const response = await fetch('/api/landlord/properties', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        toast.success('Property added successfully!');
        setFormData({
          title: '',
          description: '',
          price: '',
          location: '',
          propertyType: 'APARTMENT',
          status: 'AVAILABLE',
          bedrooms: '',
          bathrooms: '',
          area: '',
          amenities: [],
          images: [],
        });
        setImagePreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        toast.error('Failed to add property.');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <LandlordNavbar />
      <LandlordSidebar />

      <main className="pl-64 pt-16 min-h-screen overflow-y-auto">
        <div className="p-6 md:p-8 lg:p-10 max-w-6xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Plus className="text-emerald-600" size={28} />
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                      Add New Property
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                      Hey {displayName}, list your property for rent
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="px-6">
                Save Draft
              </Button>
            </div>
          </header>

          <Card className="border-0 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl">Property Details</CardTitle>
                <CardDescription className="text-slate-600">
                  Fill in the details to list your property for tenants
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Basic Info Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Property Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Cozy 2BHK Apartment in Prime Location"
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="Angamali, Kerala, India"
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type *</Label>
                      <select
                        id="propertyType"
                        value={formData.propertyType}
                        onChange={(e) => setFormData({...formData, propertyType: e.target.value as PropertyType})}
                        className="w-full h-12 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="VILLA">Villa</option>
                        <option value="INDEPENDENT_HOUSE">Independent House</option>
                        <option value="ROOM">PG/Room</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as PropertyStatus})}
                        className="w-full h-12 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="RENTED">Rented</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Size & Price */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input id="bedrooms" type="number" min="0" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} placeholder="2" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input id="bathrooms" type="number" min="0" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} placeholder="2" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sqft)</Label>
                    <Input id="area" type="number" min="0" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} placeholder="1000" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Rent (₹/month) *</Label>
                    <Input id="price" type="number" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="15000" required className="h-12" />
                  </div>
                </div>

                {/* IMAGE UPLOAD SECTION */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Image className="text-emerald-600" size={20} />
                    Property Images (Max 5MB each)
                  </Label>
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-emerald-400 transition-colors bg-slate-50 hover:bg-emerald-50">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-emerald-600 hover:bg-emerald-700 border-0"
                      >
                        <Upload className="mr-2" size={20} />
                        Upload Images
                      </Button>
                      <p className="text-sm text-slate-500 mt-2">PNG, JPG up to 5MB each. Multiple images supported.</p>
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group bg-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <img src={preview} alt="Preview" className="w-full h-32 object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X size={16} className="text-slate-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-vertical"
                    placeholder="Describe your property in detail - location advantages, amenities, nearby schools, transportation, etc..."
                  />
                </div>

                {/* EMERALD GREEN CHECKBOXES */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      'Parking', 'Lift', 'Gym', 'Pool', 'Garden', 
                      'Security 24x7', 'Power Backup', 'Water Supply',
                      'AC', 'Furnished', 'WiFi', 'Laundry'
                    ].map((amenity) => (
                      <label key={amenity} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-all group">
                        <input
                          type="checkbox"
                          value={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFormData(prev => ({
                              ...prev,
                              amenities: checked 
                                ? [...prev.amenities, amenity]
                                : prev.amenities.filter(a => a !== amenity)
                            }));
                          }}
                          className="w-5 h-5 rounded border-slate-300 
                                     accent-emerald-600
                                     focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 
                                     focus:ring-offset-white focus:outline-none
                                     transition-all duration-200 hover:scale-110"
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.amenities.map((amenity) => (
                        <span key={amenity} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button type="submit" className="flex-1 h-12 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding Property...
                      </>
                    ) : (
                      'Publish Property'
                    )}
                  </Button>
                  <Button type="button" variant="outline" className="flex-1 h-12">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
