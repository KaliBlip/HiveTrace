# AI-Powered Honey Image Analysis Integration Guide

## Overview

HiveTrace now features AI-powered honey image analysis for admin approval workflow. This integration uses Hugging Face's Inference API to analyze honey images for authenticity and quality detection.

## Features

### 1. Multi-Model Analysis
- **Food Classification**: Uses `Nav772/vit-food-classifier` to identify if images contain food items
- **Spoilage Detection**: Uses `Xyphitos/fridgeai-spoilage` to detect quality deterioration
- **Combined Analysis**: Merges results from multiple models for comprehensive assessment

### 2. Real-Time Admin Interface
- Step-by-step AI analysis visualization
- Authenticity and quality scoring
- Detailed issue detection
- Visual quality metrics
- Auto-approval/rejection based on AI confidence

### 3. Fraud Detection Integration
- Automatic fraud alert creation for low authenticity scores
- Integration with existing fraud detection system
- Admin review workflow for AI-flagged batches

## Setup Instructions

### Step 1: Install Dependencies

```bash
pnpm add @huggingface/inference
```

### Step 2: Get Hugging Face API Token

1. Visit [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create a new token (free tier available)
3. Copy the token (starts with `hf_...`)

### Step 3: Configure Environment Variables

Add to your `.env.local` file:

```env
# AI Analysis (Hugging Face)
HUGGINGFACE_API_TOKEN=hf_your_actual_token_here

# Enable AI Analysis
NEXT_PUBLIC_ENABLE_AI_ANALYSIS=true
```

### Step 4: Update Database Schema (Optional)

If you want to store AI analysis results, add these fields to your `HoneyBatch` model in `prisma/schema.prisma`:

```prisma
model HoneyBatch {
  // ... existing fields
  
  // AI Analysis fields (optional)
  aiAnalysisScore Float?
  aiAnalysisDetails String? // JSON string
  aiAnalyzedAt DateTime?
  aiClassification String?
}
```

Then run:
```bash
pnpm db:push
```

## Usage

### For Admins

1. Navigate to `/admin/batches`
2. Click on a pending batch
3. Go to the "Overview" tab
4. Click "Start AI Analysis" (if images are available)
5. Watch the step-by-step analysis progress
6. Review AI analysis results in the "AI Analysis" tab
7. Approve or reject based on AI recommendations

### API Integration

The AI analysis can be triggered programmatically:

```typescript
import { analyzeBatchWithAI } from '@/lib/actions/admin-actions';

// Analyze a batch
const analysisResult = await analyzeBatchWithAI(batchId);

console.log(analysisResult.authenticityScore); // 0-100
console.log(analysisResult.qualityScore); // 0-100
console.log(analysisResult.detectedIssues); // Array of issues
```

## AI Analysis Results

### Scoring System

- **Authenticity Score (0-100)**: Higher scores indicate more likely authentic honey
  - > 70: Good authenticity
  - 50-70: Moderate authenticity
  - < 50: Potential issues (requires manual review)
  - < 30: High likelihood of fraud

- **Quality Score (0-100)**: Overall visual quality assessment
  - Based on food classification confidence
  - Visual quality indicators
  - Spoilage detection results

### Detailed Analysis

The AI provides detailed metrics:

```typescript
{
  qualityScore: 85,
  authenticityScore: 80,
  detectedIssues: [],
  classification: "food_related",
  confidence: 0.85,
  detailedAnalysis: {
    foodClassification: "honey_jam",
    spoilageScore: 15,
    visualQuality: 85,
    textureAnalysis: "Smooth consistency with uniform appearance",
    colorAnalysis: "Natural honey coloration consistent with declared type"
  }
}
```

## Approval Workflow

### Automatic Approval

Batches with authenticity scores > 70% can be automatically approved:

```typescript
import { approveBatchWithAIAnalysis } from '@/lib/actions/admin-actions';

await approveBatchWithAIAnalysis(batchId, analysisResult);
```

### Manual Review

Batches with scores 50-70% require manual admin review. Batches < 50% are flagged for fraud investigation.

### Fraud Alerts

Low authenticity scores automatically create fraud alerts:

```typescript
// Automatically created when authenticityScore < 50
{
  type: 'AI_SUSPICIOUS_IMAGE',
  severity: 'HIGH' | 'MEDIUM',
  description: 'AI analysis detected potential issues...',
  evidence: JSON.stringify(analysisResult)
}
```

## Model Details

### Food Classification Model
- **Model**: `Nav772/vit-food-classifier`
- **Architecture**: Vision Transformer (ViT)
- **Training**: Food101 dataset subset
- **Purpose**: Identifies food items in images

### Spoilage Detection Model
- **Model**: `Xyphitos/fridgeai-spoilage`
- **Architecture**: MobileNetV3-Small
- **Training**: Fresh and Rotten Fruits Dataset
- **Purpose**: Detects food quality deterioration

## Fallback Mechanism

If the Hugging Face API is unavailable or fails, the system falls back to manual review mode:

```typescript
import { generateFallbackAnalysis } from '@/lib/honey-analysis';

const fallback = generateFallbackAnalysis();
// Returns moderate scores with manual review recommendation
```

## Performance Considerations

- **API Latency**: Typical analysis takes 3-5 seconds
- **Rate Limits**: Free tier has rate limits (implement caching for production)
- **Image Size**: Optimize images before upload (recommended < 5MB)
- **Concurrent Requests**: Limit concurrent analyses to avoid rate limiting

## Troubleshooting

### API Token Issues

If you see authentication errors:
1. Verify your Hugging Face token is correct
2. Check that the token has necessary permissions
3. Ensure the token hasn't expired

### Image Analysis Failures

If analysis fails:
1. Check that images are accessible (not broken URLs)
2. Verify image format is supported (JPG, PNG)
3. Check image size isn't too large
4. Review browser console for specific error messages

### Rate Limiting

If you hit rate limits:
1. Implement request queuing
2. Add caching for repeated analyses
3. Consider upgrading to paid Hugging Face tier
4. Use fallback analysis for non-critical batches

## Future Enhancements

### Potential Improvements

1. **Custom Honey Model**: Train a model specifically for honey authenticity
2. **Real-time Analysis**: Use client-side TensorFlow.js for immediate feedback
3. **Multi-Spectral Analysis**: Integrate hyperspectral imaging data
4. **Blockchain Verification**: Store AI analysis results on blockchain
5. **Confidence Learning**: Improve models based on admin feedback

### Advanced Features

- **Batch Analysis**: Analyze multiple batches simultaneously
- **Historical Tracking**: Track AI analysis trends over time
- **Producer Profiling**: Build authenticity profiles per producer
- **Anomaly Detection**: Identify unusual patterns in producer submissions

## Security Considerations

- **API Token Security**: Never commit Hugging Face tokens to repository
- **Image Privacy**: Ensure image URLs are secure and temporary
- **Result Validation**: Always validate AI results before auto-approval
- **Audit Trail**: Log all AI analyses for compliance and debugging

## Cost Analysis

### Hugging Face Free Tier
- **Cost**: Free
- **Rate Limits**: Limited requests per minute
- **Usage**: Suitable for development and low-volume production

### Paid Tier (if needed)
- **Cost**: ~$0.10 per 1,000 API calls
- **Benefits**: Higher rate limits, priority processing
- **Recommendation**: Upgrade for high-volume production use

## Support

For issues with:
- **Hugging Face API**: Check [Hugging Face Docs](https://huggingface.co/docs/api-inference)
- **Integration**: Review this guide and code comments
- **Model Performance**: Consult model documentation on Hugging Face Hub

## Conclusion

This AI integration provides a sophisticated layer of automated quality control while maintaining human oversight for critical decisions. The system is designed to be:
- **Accurate**: Using state-of-the-art computer vision models
- **Reliable**: With fallback mechanisms for resilience
- **Transparent**: Providing detailed analysis for admin review
- **Scalable**: Ready for production deployment with proper configuration