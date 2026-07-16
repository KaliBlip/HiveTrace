'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2, CheckCircle2, Image as ImageIcon, Upload, DollarSign, Video, MapPin, AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { createBatch } from '@/lib/actions/batch-actions';
import { toast } from 'sonner';

const honeyPresets = [
  {
    name: 'Wildflower Jar',
    url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600',
  },
  {
    name: 'Clover Premium Jar',
    url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=600',
  },
  {
    name: 'Raw Honeycomb',
    url: 'https://images.unsplash.com/photo-1471194402929-fec211408757?q=80&w=600',
  }
];

const packagingPresets = [
  {
    name: 'Craft Box',
    url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600',
  },
  {
    name: 'Eco Honey Label',
    url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600',
  },
  {
    name: 'Artisan Hexagon Glass',
    url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=600',
  }
];

export default function NewBatchPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    batchCode: '',
    honeyType: '',
    quantity: '',
    harvestDate: new Date().toISOString().split('T')[0],
    description: '',
    honeyImage: '',
    packagingImage: '',
    honeyVideo: '',
    price: '',
  });

  // Location state
  const [locationStatus, setLocationStatus] = useState<'prompt' | 'fetching' | 'success' | 'denied' | 'error'>('prompt');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [townName, setTownName] = useState<string>('');

  useEffect(() => {
    setFormData((prev) => {
      if (prev.batchCode) return prev;
      return {
        ...prev,
        batchCode: `HT-${new Date().getFullYear()}-${Math.random()
          .toString(36)
          .substring(2, 5)
          .toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      };
    });
  }, []);

  const fetchIPLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('IP geolocation failed');
      const data = await res.json();
      if (data.latitude && data.longitude) {
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        const town = data.city || data.region || 'Unknown Area';
        setTownName(town);
        setLocationStatus('success');
        toast.success('Location resolved via IP address.');
        return true;
      }
    } catch (err) {
      console.error('IP Geolocation fallback failed:', err);
    }
    return false;
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      fetchIPLocation().then((success) => {
        if (!success) {
          setLocationStatus('error');
          toast.error('Geolocation is not supported by your browser.');
        }
      });
      return;
    }
    setLocationStatus('fetching');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        // Reverse geocode to get town name
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const town = addr.town || addr.city || addr.village || addr.suburb || addr.county || addr.state || 'Unknown Area';
          setTownName(town);
        } catch {
          setTownName(`${lat.toFixed(4)}°, ${lng.toFixed(4)}°`);
        }
        setLocationStatus('success');
        toast.success('Location verified successfully.');
      },
      async (err) => {
        console.warn('Browser geolocation failed, attempting IP-based fallback...', err);
        const success = await fetchIPLocation();
        if (!success) {
          if (err.code === err.PERMISSION_DENIED) {
            setLocationStatus('denied');
            toast.error('Location access denied. Please allow location to register a batch.');
          } else {
            setLocationStatus('error');
            toast.error('Could not retrieve your location. Please try again.');
          }
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Request location on mount
  useEffect(() => {
    fetchLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'honeyImage' | 'packagingImage' | 'honeyVideo') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File is too large. Please select a ${field === 'honeyVideo' ? 'video' : 'image'} smaller than 10MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (field: 'honeyImage' | 'packagingImage', url: string) => {
    setFormData(prev => ({ ...prev, [field]: url }));
    toast.success('Preset image selected');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locationStatus !== 'success' || !latitude || !longitude) {
      toast.error('Device location is required to register a batch.');
      return;
    }
    setIsSubmitting(true);

    try {
      await createBatch({
        batchCode: formData.batchCode,
        honeyType: formData.honeyType,
        quantity: parseFloat(formData.quantity),
        harvestDate: new Date(formData.harvestDate),
        description: formData.description,
        honeyImage: formData.honeyImage || undefined,
        packagingImage: formData.packagingImage || undefined,
        honeyVideo: formData.honeyVideo || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        latitude,
        longitude,
        registrationLocation: townName || undefined,
      });

      toast.success('Batch registered successfully! Awaiting admin quality verification.');
      router.push('/dashboard/batches');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link href="/dashboard/batches" className="inline-flex items-center gap-3 text-stone-500 hover:text-primary font-bold group transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Batches
        </Link>

        <div className="space-y-4">
          <h1 className="text-5xl font-heading font-bold tracking-tighter uppercase italic">
            New Honey <span className="text-primary not-italic tracking-tight">Batch</span>
          </h1>
          <p className="text-stone-500 font-normal text-xl leading-relaxed">
            Register a new batch of honey, upload images and video verification. It will go to the Admin queue for quality verification.
          </p>
        </div>

        <div className="bg-card rounded-[40px] border border-border/50 overflow-hidden shadow-2xl">
          <div className="p-10 bg-primary/5 border-b border-border/50 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Save className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold uppercase tracking-tight">Batch Asset Upload & Details</h2>
              <p className="text-stone-500 font-normal">Upload product assets and enter verification parameters</p>
            </div>
          </div>
          
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Location Verification Banner */}
              {locationStatus === 'success' && (
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Location Verified</p>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70">Registering from <span className="font-semibold">{townName}</span></p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                </div>
              )}
              {locationStatus === 'fetching' && (
                <div className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center gap-4">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin shrink-0" />
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Fetching device location...</p>
                </div>
              )}
              {(locationStatus === 'denied' || locationStatus === 'error') && (
                <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-600 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-700 dark:text-red-400">
                      {locationStatus === 'denied' ? 'Location Access Denied' : 'Location Error'}
                    </p>
                    <p className="text-xs text-red-600/80 dark:text-red-400/70">
                      Device location is mandatory to register a new honey batch. Please allow location access in your browser settings.
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={fetchLocation} className="shrink-0 gap-1.5 text-xs border-red-300 text-red-600 hover:bg-red-50">
                    <RefreshCw className="w-3.5 h-3.5" /> Retry
                  </Button>
                </div>
              )}
              {locationStatus === 'prompt' && (
                <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-4">
                  <Loader2 className="w-5 h-5 text-amber-500 animate-spin shrink-0" />
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Waiting for location permission...</p>
                </div>
              )}

              {/* Media Uploads Section (At the Top) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-wider text-stone-600">Step 1: Batch Assets (Images & Video)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-muted/20 border border-border/30 rounded-3xl">
                  {/* Honey Image */}
                  <div className="space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Honey Product Image</Label>
                    <div className="border border-dashed border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 bg-muted/10 hover:bg-muted/20 transition-colors min-h-[180px] relative overflow-hidden group">
                      {formData.honeyImage ? (
                        <>
                          <img src={formData.honeyImage} alt="Honey preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <label className="cursor-pointer text-white font-bold flex items-center gap-2 bg-stone-900/80 px-3 py-1.5 rounded-xl text-xs hover:bg-stone-900">
                              <Upload className="w-3.5 h-3.5" /> Change
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'honeyImage')} />
                            </label>
                          </div>
                        </>
                      ) : (
                        <div className="text-center space-y-2">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto text-primary">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <p className="text-[10px] text-stone-500">Upload honey jar photo</p>
                          <label className="cursor-pointer inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors">
                            <Upload className="w-3 h-3" /> Upload File
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'honeyImage')} />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Honey Presets */}
                    <div className="space-y-1.5">
                      <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest ml-1">Quick Presets:</p>
                      <div className="flex flex-wrap gap-1">
                        {honeyPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectPreset('honeyImage', preset.url)}
                            className="text-[9px] border border-border rounded-lg px-2 py-1 bg-card hover:border-primary/50 transition-colors font-medium text-stone-600"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Packaging Image */}
                  <div className="space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Packaging & Label Image</Label>
                    <div className="border border-dashed border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 bg-muted/10 hover:bg-muted/20 transition-colors min-h-[180px] relative overflow-hidden group">
                      {formData.packagingImage ? (
                        <>
                          <img src={formData.packagingImage} alt="Packaging preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <label className="cursor-pointer text-white font-bold flex items-center gap-2 bg-stone-900/80 px-3 py-1.5 rounded-xl text-xs hover:bg-stone-900">
                              <Upload className="w-3.5 h-3.5" /> Change
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'packagingImage')} />
                            </label>
                          </div>
                        </>
                      ) : (
                        <div className="text-center space-y-2">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto text-primary">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <p className="text-[10px] text-stone-500">Upload packaging labels</p>
                          <label className="cursor-pointer inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors">
                            <Upload className="w-3 h-3" /> Upload File
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'packagingImage')} />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Packaging Presets */}
                    <div className="space-y-1.5">
                      <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest ml-1">Quick Presets:</p>
                      <div className="flex flex-wrap gap-1">
                        {packagingPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectPreset('packagingImage', preset.url)}
                            className="text-[9px] border border-border rounded-lg px-2 py-1 bg-card hover:border-primary/50 transition-colors font-medium text-stone-600"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Honey Video */}
                  <div className="space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Short Batch Video</Label>
                    <div className="border border-dashed border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 bg-muted/10 hover:bg-muted/20 transition-colors min-h-[180px] relative overflow-hidden group">
                      {formData.honeyVideo ? (
                        <>
                          <video src={formData.honeyVideo} controls className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
                            <label className="cursor-pointer text-white font-bold flex items-center gap-2 bg-stone-900/80 px-3 py-1.5 rounded-xl text-xs hover:bg-stone-900">
                              <Upload className="w-3.5 h-3.5" /> Change
                              <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'honeyVideo')} />
                            </label>
                          </div>
                        </>
                      ) : (
                        <div className="text-center space-y-2">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto text-primary">
                            <Video className="w-5 h-5" />
                          </div>
                          <p className="text-[10px] text-stone-500">Upload a verification video</p>
                          <label className="cursor-pointer inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors">
                            <Upload className="w-3 h-3" /> Upload Video
                            <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'honeyVideo')} />
                          </label>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest ml-1">Video Limits:</p>
                      <p className="text-[9px] text-stone-500 ml-1 italic leading-tight">Short production/apiary video, max 10MB (.mp4, .webm)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Form Details */}
              <div className="space-y-8 pt-4 border-t border-border/30">
                <h3 className="text-lg font-bold uppercase tracking-wider text-stone-600">Step 2: Batch Information & Pricing</h3>
                
                {/* Core Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <Label htmlFor="batchCode" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Batch Code</Label>
                    <Input 
                      id="batchCode" 
                      value={formData.batchCode} 
                      className="h-16 font-mono bg-muted/30 border-border/50 rounded-2xl text-lg focus:ring-primary"
                      readOnly 
                    />
                    <p className="text-[10px] text-stone-400 font-normal italic ml-1">Auto-generated for cryptographic uniqueness</p>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="honeyType" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Honey Type</Label>
                    <Input 
                      id="honeyType" 
                      placeholder="e.g. Wildflower, Clover"
                      value={formData.honeyType} 
                      onChange={(e) => setFormData({...formData, honeyType: e.target.value})}
                      className="h-16 bg-card border-border/50 rounded-2xl text-lg font-normal focus:ring-primary"
                      required 
                    />
                  </div>
                </div>

                {/* Quantity, Date, & Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="quantity" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Quantity (kg)</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      step="0.1"
                      placeholder="0.0"
                      value={formData.quantity} 
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="h-16 bg-card border-border/50 rounded-2xl text-lg font-normal focus:ring-primary"
                      required 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="harvestDate" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Harvest Date</Label>
                    <Input 
                      id="harvestDate" 
                      type="date"
                      value={formData.harvestDate} 
                      onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                      className="h-16 bg-card border-border/50 rounded-2xl text-lg font-normal focus:ring-primary"
                      required 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="price" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Proposed Price (GH₵)</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">GH₵</span>
                      <Input 
                      id="price" 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="h-16 pl-16 bg-card border-border/50 rounded-2xl text-lg font-normal focus:ring-primary"
                      required 
                    />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Batch Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the harvest conditions, apiary location, etc."
                    className="min-h-[120px] bg-card border-border/50 rounded-3xl text-lg font-normal p-6 focus:ring-primary"
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              {/* Info Banner */}
              <div className="p-8 bg-[#1c1917] rounded-3xl border border-white/5 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="flex items-center gap-3 text-primary relative z-10">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-heading font-bold text-lg uppercase tracking-tight">Quality Inspection Queue</span>
                </div>
                <p className="text-sm text-stone-400 font-normal leading-relaxed relative z-10">
                  Upon submission, this batch is queued for admin review. The admin will verify labeling integrity and quality metrics using the platform's verification tool. If approved, a Blockchain transaction and QR code will be generated.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 text-xl rounded-2xl font-bold gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                disabled={isSubmitting || locationStatus !== 'success'}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Registering Batch...
                  </>
                ) : (
                  <>
                    Submit Batch for Quality Review
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
