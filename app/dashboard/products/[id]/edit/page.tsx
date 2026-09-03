'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Link as LinkIcon, 
  Sparkles,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { getProductById, updateProduct } from '@/lib/actions/product-actions';
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
  },
  {
    name: 'Artisan Hexagon Glass',
    url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=600',
  },
  {
    name: 'Eco Honey Bottle',
    url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600',
  }
];

function EditProductForm() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    unit: '',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getProductById(id);
        if (product) {
          setFormData({
            name: product.name,
            price: product.price.toString(),
            stock: product.stock.toString(),
            description: product.description,
            unit: product.unit,
            imageUrl: product.imageUrl || '',
            isActive: product.isActive,
          });
        } else {
          toast.error('Product not found');
          router.push('/dashboard/products');
        }
      } catch {
        toast.error('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id, router]);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Please select an image smaller than 5MB.');
      return;
    }

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
        setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
        toast.success('Image processed and attached');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const selectPreset = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    toast.success('Preset image selected');
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    toast.info('Image removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProduct(id, {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        unit: formData.unit,
        imageUrl: formData.imageUrl,
        isActive: formData.isActive,
      });

      toast.success('Product updated successfully!');
      router.push('/dashboard/products');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link href="/dashboard/products" className="flex items-center gap-2 text-primary hover:underline font-medium text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update your marketplace listing details and product visuals</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Modify the information and image for your marketplace listing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Product Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Pure Wildflower Honey"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Price (GH₵)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Unit</Label>
                <Input
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g. 500g Jar"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Stock (Units)</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="e.g. 100"
                required
              />
            </div>

            {/* Product Image Section */}
            <div className="space-y-4 p-5 bg-muted/20 border border-border/60 rounded-2xl">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Product Visual / Image
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-xs text-muted-foreground hover:text-primary h-7 px-2 gap-1"
                >
                  <LinkIcon className="w-3 h-3" />
                  {showUrlInput ? 'Hide URL field' : 'Use direct URL'}
                </Button>
              </div>

              {/* Upload Dropzone / Image Preview Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-colors min-h-[220px] relative overflow-hidden group ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border/80 bg-muted/10 hover:bg-muted/20'
                }`}
              >
                {formData.imageUrl ? (
                  <>
                    <img
                      src={formData.imageUrl}
                      alt="Product preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                      <label className="cursor-pointer text-white font-medium flex items-center gap-1.5 bg-stone-900/90 px-3.5 py-2 rounded-xl text-xs hover:bg-stone-900 shadow-md">
                        <Upload className="w-3.5 h-3.5" /> Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="rounded-xl text-xs h-8 px-3 gap-1.5 shadow-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-2.5 p-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Drag & drop or browse image</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Supports PNG, JPG, WEBP up to 5MB</p>
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium px-4 py-2 rounded-xl shadow-sm transition-all">
                      <Upload className="w-3.5 h-3.5" /> Browse Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Direct URL input fallback */}
              {showUrlInput && (
                <div className="space-y-1.5 pt-2 animate-in fade-in duration-200">
                  <Label className="text-xs text-muted-foreground">Direct Image URL</Label>
                  <Input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="text-xs h-9"
                  />
                </div>
              )}

              {/* Quick Presets */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Quick Presets:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {honeyPresets.map((preset, idx) => {
                    const isSelected = formData.imageUrl === preset.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectPreset(preset.url)}
                        className={`text-[11px] border rounded-lg px-2.5 py-1 transition-all flex items-center gap-1 font-medium ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-card hover:border-primary/50 text-foreground'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-primary" />}
                        {preset.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Product Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your honey..."
                className="min-h-32"
                required
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 gap-2 font-medium"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProductForm />
    </Suspense>
  );
}
