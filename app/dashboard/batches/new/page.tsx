'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2, CheckCircle2, Image as ImageIcon, Upload, MapPin, AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { createBatch } from '@/lib/actions/batch-actions';
import { toast } from 'sonner';
import { VideoRecorder } from '@/components/dashboard/video-recorder';
import { FormSteps, StepNavigation } from '@/components/dashboard/batch-form-steps';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    batchCode: '',
    honeyType: '',
    quantity: '',
    price: '',
    description: '',
    honeyVideo: '',
    harvestDate: new Date().toISOString().split('T')[0],
    honeyImage: '',
    packagingImage: '',
  });

  const formSteps = [
    { id: 1, title: 'Location', description: 'Verify your apiary location' },
    { id: 2, title: 'Images', description: 'Upload product and packaging images' },
    { id: 3, title: 'Record Video', description: 'Record 30-second verification video' },
    { id: 4, title: 'Details', description: 'Enter basic batch information' },
    { id: 5, title: 'Review', description: 'Review and submit your batch' },
  ];

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'honeyImage' | 'packagingImage') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File is too large. Please select an image smaller than 5MB.`);
        return;
      }
      // Compress image before storing
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 800;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setFormData(prev => ({ ...prev, [field]: compressedDataUrl }));
          toast.success('Image compressed and uploaded');
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (field: 'honeyImage' | 'packagingImage', url: string) => {
    setFormData(prev => ({ ...prev, [field]: url }));
    toast.success('Preset image selected');
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called', {
      locationStatus,
      latitude,
      longitude,
      honeyVideo: formData.honeyVideo ? 'present' : 'missing',
      honeyType: formData.honeyType,
      quantity: formData.quantity,
    });

    if (locationStatus !== 'success' || !latitude || !longitude) {
      toast.error('Device location is required to register a batch.');
      console.error('Location validation failed', { locationStatus, latitude, longitude });
      return;
    }
    if (!formData.honeyVideo) {
      toast.error('Video recording is required to register a batch. Please record a 30-second video of your batch.');
      console.error('Video validation failed');
      return;
    }
    if (!formData.honeyType || !formData.quantity || !formData.price || !formData.description) {
      toast.error('Please fill in all required batch details (Honey Type, Quantity, Price, Description).');
      console.error('Required fields missing', { honeyType: formData.honeyType, quantity: formData.quantity, price: formData.price, description: formData.description });
      return;
    }
    
    setIsSubmitting(true);

    try {
      console.log('Calling createBatch with:', {
        batchCode: formData.batchCode,
        honeyType: formData.honeyType,
        quantity: parseFloat(formData.quantity),
        honeyVideo: formData.honeyVideo ? 'present' : 'missing',
        latitude,
        longitude,
        registrationLocation: townName || undefined,
      });
      
      await createBatch({
        batchCode: formData.batchCode,
        honeyType: formData.honeyType,
        quantity: parseFloat(formData.quantity),
        price: formData.price ? parseFloat(formData.price) : undefined,
        description: formData.description || undefined,
        harvestDate: new Date(formData.harvestDate),
        honeyImage: formData.honeyImage || undefined,
        packagingImage: formData.packagingImage || undefined,
        honeyVideo: formData.honeyVideo || undefined,
        latitude,
        longitude,
        registrationLocation: townName || undefined,
      });

      toast.success('Batch registered successfully! Awaiting admin quality verification.');
      router.push('/dashboard/batches');
    } catch (error) {
      console.error('createBatch error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0:
        return locationStatus === 'success';
      case 1:
        return true; // Images are optional
      case 2:
        return formData.honeyVideo !== '';
      case 3:
        return formData.honeyType !== '' && formData.quantity !== '' && formData.price !== '' && formData.description !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleRecordingComplete = () => {
    // User confirmed the recording - advance to next step
    if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-3 py-5 sm:p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12">
        <Link href="/dashboard/batches" className="inline-flex items-center gap-3 text-stone-500 hover:text-primary font-bold group transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Batches
        </Link>

        <div className="space-y-4">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tighter uppercase italic">
            New Honey <span className="text-primary not-italic tracking-tight">Batch</span>
          </h1>
          <p className="text-stone-500 font-normal text-sm sm:text-base lg:text-xl leading-relaxed">
            Register a new batch of honey, upload images and video verification. It will go to the Admin queue for quality verification.
          </p>
        </div>

        <div className="bg-card rounded-2xl sm:rounded-3xl lg:rounded-[40px] border border-border/50 overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-6 lg:p-10 bg-primary/5 border-b border-border/50 flex items-center gap-4 sm:gap-6">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <Save className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-heading font-bold uppercase tracking-tight">Create New Batch</h2>
              <p className="text-stone-500 font-normal text-xs sm:text-sm">Follow the steps to register your honey batch</p>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-10">
            <FormSteps 
              currentStep={currentStep} 
              steps={formSteps} 
              onStepChange={setCurrentStep} 
            />
            
            <div className="space-y-8">
              {/* Step 1: Location Verification */}
              {currentStep === 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 sm:p-6 lg:p-8 bg-muted/20 border border-border/30 rounded-2xl sm:rounded-3xl">
                    <h3 className="text-xl font-bold mb-4">Location Verification</h3>
                    <p className="text-muted-foreground mb-6">We need to verify your apiary location to ensure batch authenticity.</p>
                    
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
                      <div className="p-4 sm:p-5 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-600 shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-red-700 dark:text-red-400">
                              {locationStatus === 'denied' ? 'Location Access Denied' : 'Location Error'}
                            </p>
                            <p className="text-xs text-red-600/80 dark:text-red-400/70">
                              Device location is mandatory to register a new honey batch. Please allow location access in your browser settings.
                            </p>
                          </div>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={fetchLocation} className="shrink-0 gap-1.5 text-xs border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto">
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
                  </div>
                </div>
              )}

              {/* Step 2: Image Uploads */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-6 bg-muted/20 border border-border/30 rounded-2xl sm:rounded-3xl">
                    {/* Honey Image */}
                    <div className="space-y-4">
                      <Label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Honey Product Image</Label>
                      <div className="border border-dashed border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 bg-muted/10 hover:bg-muted/20 transition-colors min-h-[200px] relative overflow-hidden group">
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
                      <div className="border border-dashed border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 bg-muted/10 hover:bg-muted/20 transition-colors min-h-[200px] relative overflow-hidden group">
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
                  </div>
                </div>
              )}

              {/* Step 3: Video Recording (Full Screen via Portal) */}
              {currentStep === 2 && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black" style={{ height: '100dvh' }}>
                  {/* Header */}
                  <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/80 to-transparent">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="absolute left-4 top-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span className="text-sm font-semibold">Back</span>
                    </button>
                    <h3 className="text-white text-xl font-bold text-center">Record Verification Video</h3>
                    <p className="text-white/70 text-sm text-center mt-1">Auto-ends at 30 seconds</p>
                  </div>
                  
                  {/* Video Recorder */}
                  <div className="absolute inset-0">
                    <VideoRecorder 
                      onVideoRecorded={(videoUrl) => setFormData(prev => ({ ...prev, honeyVideo: videoUrl }))}
                      onRecordingComplete={handleRecordingComplete}
                      fullScreen={true}
                    />
                  </div>
                </div>,
                document.body
              )}

              {/* Step 4: Batch Details */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 sm:p-6 lg:p-8 bg-muted/20 border border-border/30 rounded-2xl sm:rounded-3xl space-y-6 sm:space-y-8">
                    {/* Core Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
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

                    {/* Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <Label htmlFor="price" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Price (₦)</Label>
                        <Input 
                          id="price" 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          value={formData.price} 
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="h-16 bg-card border-border/50 rounded-2xl text-lg font-normal focus:ring-primary"
                          required 
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <Label htmlFor="description" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Description</Label>
                      <textarea
                        id="description"
                        placeholder="Describe your honey batch, harvest season, processing method, etc."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full h-32 bg-card border-border/50 rounded-2xl text-lg font-normal focus:ring-primary p-4 resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 sm:p-6 lg:p-8 bg-muted/20 border border-border/30 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6">
                    <h3 className="text-xl font-bold mb-4">Review Your Batch</h3>
                    
                    {/* Location Summary */}
                    <div className="p-4 bg-card border border-border/50 rounded-2xl">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Location</p>
                      <p className="font-semibold">{townName}</p>
                      <p className="text-sm text-muted-foreground">{latitude?.toFixed(4)}°, {longitude?.toFixed(4)}°</p>
                    </div>

                    {/* Batch Info Summary */}
                    <div className="p-4 bg-card border border-border/50 rounded-2xl">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Batch Information</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Code:</span>
                          <span className="ml-2 font-mono font-semibold">{formData.batchCode}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <span className="ml-2 font-semibold">{formData.honeyType}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>
                          <span className="ml-2 font-semibold">{formData.quantity} kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Media Summary */}
                    <div className="p-4 bg-card border border-border/50 rounded-2xl">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Media Assets</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className={`w-3 h-3 rounded-full ${formData.honeyImage ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>Honey Image: {formData.honeyImage ? 'Uploaded' : 'Missing'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-2">
                        <div className={`w-3 h-3 rounded-full ${formData.packagingImage ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>Packaging Image: {formData.packagingImage ? 'Uploaded' : 'Missing'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-2">
                        <div className={`w-3 h-3 rounded-full ${formData.honeyVideo ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>Verification Video: {formData.honeyVideo ? 'Recorded (30 seconds)' : 'Missing'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-2">
                        <div className={`w-3 h-3 rounded-full ${formData.price ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>Price: {formData.price ? `₦${formData.price}` : 'Missing'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-2">
                        <div className={`w-3 h-3 rounded-full ${formData.description ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>Description: {formData.description ? 'Added' : 'Missing'}</span>
                      </div>
                    </div>

                    {/* Info Banner */}
                    <div className="p-6 bg-[#1c1917] rounded-2xl border border-white/5 space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                      <div className="flex items-center gap-3 text-primary relative z-10">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-heading font-bold uppercase tracking-tight">Quality Inspection Queue</span>
                      </div>
                      <p className="text-sm text-stone-400 font-normal leading-relaxed relative z-10">
                        Upon submission, this batch is queued for admin review. The admin will verify labeling integrity and quality metrics using the platform's verification tool. If approved, a Blockchain transaction and QR code will be generated.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step Navigation — hidden during video step since it's full-screen */}
              {currentStep !== 2 && (
                <StepNavigation
                  currentStep={currentStep}
                  totalSteps={formSteps.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  canProceed={canProceedToNext()}
                  submitLabel="Submit Batch for Review"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
