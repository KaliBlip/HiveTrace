'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/hooks/use-auth';
import { updateProfile, changePassword } from '@/lib/actions/user-actions';
import {
  getProducerProfileForSettings,
  updateProducerProfile,
} from '@/lib/actions/producer-actions';
import { Camera, Loader2, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, update } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    image: user?.image || '',
    businessName: '',
    location: '',
    description: '',
    certifications: '',
    apiarySize: '',
  });

  const [producerMeta, setProducerMeta] = useState({
    verified: false,
    batchCount: 0,
    trustScore: 100,
    createdAt: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const producer = await getProducerProfileForSettings();
        if (producer) {
          setFormData((prev) => ({
            ...prev,
            businessName: producer.businessName,
            location: producer.location,
            description: producer.description || '',
            certifications: producer.certifications || '',
            apiarySize: producer.apiarySize?.toString() || '',
          }));
          setProducerMeta({
            verified: producer.verified,
            batchCount: producer._count.batches,
            trustScore: producer.ratings?.trustScore ?? 100,
            createdAt: producer.createdAt.toISOString(),
          });
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        image: formData.image,
      });
      await updateProducerProfile({
        businessName: formData.businessName,
        location: formData.location,
        description: formData.description,
        certifications: formData.certifications,
        apiarySize: formData.apiarySize ? parseInt(formData.apiarySize, 10) : undefined,
      });
      await update();
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your producer account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                  {formData.image ? (
                    <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-10 h-10 text-primary/40" />
                  )}
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <h3 className="font-bold text-lg">Profile Photo</h3>
                  <p className="text-sm text-muted-foreground">Paste an image URL for your producer profile.</p>
                  <Input
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="text-xs h-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Your Name</Label>
                <Input
                  id="ownerName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business / Apiary Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Eastern Region, Ghana"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Input
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  placeholder="e.g. Organic, Fair Trade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiarySize">Apiary Size (hectares)</Label>
                <Input
                  id="apiarySize"
                  type="number"
                  value={formData.apiarySize}
                  onChange={(e) => setFormData({ ...formData, apiarySize: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Description</Label>
                <Textarea
                  id="bio"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 font-bold"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {passwordSuccess && (
                <div className="bg-green-100 text-green-700 px-4 py-3 rounded-md text-sm">
                  Password updated successfully.
                </div>
              )}
              {passwordError && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                  {passwordError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                />
              </div>
              <Button
                variant="outline"
                disabled={isChangingPassword}
                onClick={async () => {
                  setPasswordError('');
                  setPasswordSuccess(false);
                  setIsChangingPassword(true);
                  try {
                    await changePassword(passwordData);
                    setPasswordSuccess(true);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  } catch (err: unknown) {
                    setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
                  } finally {
                    setIsChangingPassword(false);
                  }
                }}
              >
                {isChangingPassword ? 'Updating...' : 'Change Password'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`font-medium ${producerMeta.verified ? 'text-green-600' : 'text-amber-600'}`}
                >
                  {producerMeta.verified ? 'Verified' : 'Pending Approval'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {producerMeta.createdAt
                    ? new Date(producerMeta.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Batches</span>
                <span className="font-medium">{producerMeta.batchCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trust Score</span>
                <span className="font-medium">{producerMeta.trustScore}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
