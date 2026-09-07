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
    phoneNumber: (user as any)?.phoneNumber || '',
    businessName: '',
    location: '',
    description: '',
    certifications: '',
    apiarySize: '',
    payoutMethod: 'MOMO',
    accountName: '',
    bankName: '',
    accountNumber: '',
    momoProvider: 'MTN',
    momoNumber: '',
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
            phoneNumber: producer.phoneNumber || producer.user?.phoneNumber || prev.phoneNumber || '',
            businessName: producer.businessName,
            location: producer.location,
            description: producer.description || '',
            certifications: producer.certifications || '',
            apiarySize: producer.apiarySize?.toString() || '',
            payoutMethod: producer.payoutMethod || 'MOMO',
            accountName: producer.accountName || producer.user?.name || '',
            bankName: producer.bankName || '',
            accountNumber: producer.accountNumber || '',
            momoProvider: producer.momoProvider || 'MTN',
            momoNumber: producer.momoNumber || producer.phoneNumber || '',
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
        phoneNumber: formData.phoneNumber,
      });
      await updateProducerProfile({
        businessName: formData.businessName,
        location: formData.location,
        phoneNumber: formData.phoneNumber,
        description: formData.description,
        certifications: formData.certifications,
        apiarySize: formData.apiarySize ? parseInt(formData.apiarySize, 10) : undefined,
        payoutMethod: formData.payoutMethod,
        accountName: formData.accountName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        momoProvider: formData.momoProvider,
        momoNumber: formData.momoNumber,
      });
      await update();
      toast.success('Settings and payout details updated successfully');
    } catch {
      toast.error('Failed to update settings');
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
        <p className="text-muted-foreground">Manage your producer account, payout settlement, and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your business and apiary details</CardDescription>
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
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+233 24 123 4567"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">Used for SMS verification, batch notifications, and producer vetting.</p>
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-8 font-bold"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Profile Details'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Payout & Banking / MoMo Settlement Card */}
          <Card className="border-border/80 bg-card/80 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading text-xl">Payout & Settlement Account</CardTitle>
                  <CardDescription>
                    Where your net product revenue (95% after 5% platform fee) will be disbursed
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Payout Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, payoutMethod: 'MOMO' })}
                    className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-sm font-semibold transition-all ${
                      formData.payoutMethod === 'MOMO'
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                        : 'border-border/70 hover:bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    <span>📱</span> Mobile Money (MoMo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, payoutMethod: 'BANK' })}
                    className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-sm font-semibold transition-all ${
                      formData.payoutMethod === 'BANK'
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                        : 'border-border/70 hover:bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    <span>🏦</span> Bank Account
                  </button>
                </div>
              </div>

              {formData.payoutMethod === 'MOMO' ? (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="momoProvider">Mobile Money Provider</Label>
                    <select
                      id="momoProvider"
                      value={formData.momoProvider}
                      onChange={(e) => setFormData({ ...formData, momoProvider: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="MTN">MTN Mobile Money</option>
                      <option value="TELECEL">Telecel Cash (Vodafone)</option>
                      <option value="AT">AT Money (AirtelTigo)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="momoNumber">MoMo Phone Number</Label>
                    <Input
                      id="momoNumber"
                      type="tel"
                      placeholder="e.g. 024 123 4567"
                      value={formData.momoNumber}
                      onChange={(e) => setFormData({ ...formData, momoNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="momoAccountName">Registered Account Name</Label>
                    <Input
                      id="momoAccountName"
                      placeholder="e.g. Kwame Mensah Apiaries"
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    />
                    <p className="text-[11px] text-muted-foreground">The full name registered on your Mobile Money SIM.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="e.g. GCB Bank, Ecobank, Stanbic Bank"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="e.g. 1029384756102"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankAccountName">Account Name</Label>
                    <Input
                      id="bankAccountName"
                      placeholder="e.g. Kwame Mensah Honey Enterprise"
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-8 font-bold"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Payout Information'
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
