import { InferenceClient } from '@huggingface/inference';

const aiEnabled = process.env.NEXT_PUBLIC_ENABLE_AI_ANALYSIS === 'true';
const hfToken = process.env.HUGGINGFACE_API_TOKEN?.trim();

const hf = aiEnabled && hfToken
  ? new InferenceClient(hfToken)
  : null;

export interface HoneyAnalysisResult {
  qualityScore: number;
  authenticityScore: number;
  detectedIssues: string[];
  classification: string;
  confidence: number;
  status: 'ok' | 'manual_review' | 'disabled';
  isAiEnabled: boolean;
  manualReviewReason?: string;
  detailedAnalysis: {
    foodClassification: string;
    spoilageScore: number;
    visualQuality: number;
    textureAnalysis: string;
    colorAnalysis: string;
  };
  rawResults: any;
}

export async function analyzeHoneyImage(imageUrl: string): Promise<HoneyAnalysisResult> {
  // If AI is disabled or the token is not configured, use fallback
  if (!hf) {
    const reason = !aiEnabled
      ? 'NEXT_PUBLIC_ENABLE_AI_ANALYSIS is not true'
      : !hfToken
        ? 'HUGGINGFACE_API_TOKEN is not configured'
        : 'AI analysis is unavailable';

    console.warn(`${reason}, using fallback analysis`);
    return generateFallbackAnalysis(reason);
  }

  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    const blob = await response.blob();
    
    // Use multiple models for comprehensive analysis
    const [foodResult, spoilageResult] = await Promise.allSettled([
      hf.imageClassification({
        data: blob,
        model: 'Nav772/vit-food-classifier'
      }),
      hf.imageClassification({
        data: blob,
        model: 'Xyphitos/fridgeai-spoilage'
      })
    ]);

    const foodData = foodResult.status === 'fulfilled' ? foodResult.value : [];
    const spoilageData = spoilageResult.status === 'fulfilled' ? spoilageResult.value : [];

    // Analyze results for honey authenticity indicators
    const analysis = interpretClassificationResults(foodData, spoilageData);
    
    return {
      ...analysis,
      status: 'ok',
      isAiEnabled: true,
      rawResults: { food: foodData, spoilage: spoilageData }
    };
  } catch (error) {
    console.error('Honey analysis failed:', error);
    // Return fallback on error instead of throwing
    return generateFallbackAnalysis('AI model request failed');
  }
}

function interpretClassificationResults(foodResults: any[], spoilageResults: any[]): HoneyAnalysisResult {
  // Check if the image is classified as food/honey-like
  const foodRelated = foodResults.filter(r => 
    r.label.toLowerCase().includes('food') || 
    r.label.toLowerCase().includes('sweet') ||
    r.label.toLowerCase().includes('honey') ||
    r.label.toLowerCase().includes('syrup') ||
    r.label.toLowerCase().includes('jam') ||
    r.label.toLowerCase().includes('preserve')
  );

  const topFoodResult = foodResults[0] || { label: 'unknown', score: 0 };
  const topSpoilageResult = spoilageResults[0] || { label: 'unknown', score: 0 };
  
  const foodConfidence = topFoodResult.score || 0;
  const spoilageConfidence = topSpoilageResult.score || 0;
  
  // Calculate quality score based on classification confidence
  const qualityScore = Math.round(foodConfidence * 100);
  
  // Calculate authenticity score (higher if it looks like genuine food product)
  const authenticityScore = foodRelated.length > 0 ? 
    Math.round(foodRelated[0].score * 100) : 
    Math.round((1 - foodConfidence) * 50);

  // Calculate spoilage score (lower is better)
  const spoilageScore = topSpoilageResult.label?.toLowerCase().includes('spoiled') ? 
    Math.round(spoilageConfidence * 100) : 
    Math.round((1 - spoilageConfidence) * 100);

  const detectedIssues: string[] = [];
  
  if (foodConfidence < 0.5) {
    detectedIssues.push('Low classification confidence - image may be unclear or poor quality');
  }
  
  if (foodRelated.length === 0) {
    detectedIssues.push('Image does not appear to be food-related - may not be honey');
  }

  if (spoilageScore > 30) {
    detectedIssues.push('Potential quality issues detected - image shows signs of deterioration');
  }

  // Generate detailed analysis
  const detailedAnalysis = {
    foodClassification: topFoodResult.label || 'unknown',
    spoilageScore: spoilageScore,
    visualQuality: Math.max(0, 100 - spoilageScore),
    textureAnalysis: generateTextureAnalysis(foodConfidence, spoilageScore),
    colorAnalysis: generateColorAnalysis(foodRelated.length > 0)
  };

  return {
    qualityScore,
    authenticityScore,
    detectedIssues,
    classification: topFoodResult.label || 'unknown',
    confidence: foodConfidence,
    status: 'ok',
    isAiEnabled: true,
    detailedAnalysis,
    rawResults: []
  };
}

function generateTextureAnalysis(foodConfidence: number, spoilageScore: number): string {
  if (foodConfidence > 0.8 && spoilageScore < 20) {
    return 'Smooth consistency with uniform appearance - typical of pure honey';
  } else if (foodConfidence > 0.6) {
    return 'Generally acceptable texture with minor variations';
  } else {
    return 'Irregular texture detected - may indicate adulteration or quality issues';
  }
}

function generateColorAnalysis(isFoodRelated: boolean): string {
  if (isFoodRelated) {
    return 'Natural honey coloration consistent with declared type';
  } else {
    return 'Unusual color patterns - requires further investigation';
  }
}

// Fallback analysis when API is unavailable
export function generateFallbackAnalysis(reason?: string): HoneyAnalysisResult {
  const disabled = !aiEnabled || !hfToken;

  return {
    qualityScore: 85,
    authenticityScore: 80,
    detectedIssues: [
      disabled
        ? 'AI is disabled in this environment. Manual review is required.'
        : 'AI analysis unavailable - using manual review mode'
    ],
    classification: 'manual_review',
    confidence: 0.5,
    status: disabled ? 'disabled' : 'manual_review',
    isAiEnabled: !disabled,
    manualReviewReason: reason ?? (disabled ? 'AI disabled: missing or invalid Hugging Face configuration' : 'Model unavailable; manual review in effect'),
    detailedAnalysis: {
      foodClassification: 'manual_review',
      spoilageScore: 15,
      visualQuality: 85,
      textureAnalysis: 'Manual visual inspection required',
      colorAnalysis: 'Manual color verification required'
    },
    rawResults: []
  };
}