'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MapPin, Calendar, Beaker } from 'lucide-react';

interface BatchInfoProps {
  batchId: string;
  producerName: string;
  producerLocation: string;
  harvestDate: string;
  batchType: string;
  weight: string;
  verified: boolean;
  verificationHash: string;
  description: string;
}

export function BatchInfo({
  batchId,
  producerName,
  producerLocation,
  harvestDate,
  batchType,
  weight,
  verified,
  verificationHash,
  description,
}: BatchInfoProps) {
  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{batchType}</h2>
              <p className="text-muted-foreground">Batch ID: {batchId}</p>
            </div>
            {verified && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 gap-1.5 flex items-center">
                <CheckCircle className="w-4 h-4" />
                Verified
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Producer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Producer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              🍯
            </div>
            <div>
              <p className="font-semibold text-foreground">{producerName}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {producerLocation}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Batch Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4" />
                Harvest Date
              </p>
              <p className="font-semibold">{harvestDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                <Beaker className="w-4 h-4" />
                Total Weight
              </p>
              <p className="font-semibold">{weight}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Description</p>
            <p className="text-sm leading-relaxed">{description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Verification Info */}
      <Card className="border-green-200 dark:border-green-900/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            Cryptographic Verification
          </CardTitle>
          <CardDescription>HMAC-SHA256 Integrity Hash</CardDescription>
        </CardHeader>
        <CardContent>
          <code className="text-xs bg-muted p-3 rounded-lg block break-all font-mono text-muted-foreground">
            {verificationHash}
          </code>
          <p className="text-xs text-muted-foreground mt-3">
            This hash cryptographically verifies the authenticity and integrity of this honey batch. 
            It cannot be forged or modified without invalidating the signature.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
