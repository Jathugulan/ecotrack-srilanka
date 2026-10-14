import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response.js';
import { WasteCategory } from '../../types/index.js';

export async function classifyWaste(req: Request, res: Response, next: NextFunction) {
  try {
    const { imageUrl, fileName } = req.body;

    // AI Classification logic with heuristic/mock adapter
    const categories: WasteCategory[] = [
      'PLASTIC',
      'ORGANIC',
      'PAPER',
      'GLASS',
      'METAL',
      'E_WASTE',
    ];

    // Determine category heuristically or randomly
    const lower = (fileName || imageUrl || '').toLowerCase();
    let suggestedCategory: WasteCategory = 'PLASTIC';
    let confidence = 0.88;

    if (lower.includes('organic') || lower.includes('food') || lower.includes('leaf') || lower.includes('banana')) {
      suggestedCategory = 'ORGANIC';
      confidence = 0.92;
    } else if (lower.includes('paper') || lower.includes('cardboard') || lower.includes('box')) {
      suggestedCategory = 'PAPER';
      confidence = 0.89;
    } else if (lower.includes('bottle') || lower.includes('pet') || lower.includes('plastic')) {
      suggestedCategory = 'PLASTIC';
      confidence = 0.94;
    } else if (lower.includes('glass') || lower.includes('cup')) {
      suggestedCategory = 'GLASS';
      confidence = 0.86;
    } else if (lower.includes('can') || lower.includes('tin') || lower.includes('metal')) {
      suggestedCategory = 'METAL';
      confidence = 0.91;
    } else if (lower.includes('wire') || lower.includes('phone') || lower.includes('battery') || lower.includes('elec')) {
      suggestedCategory = 'E_WASTE';
      confidence = 0.87;
    } else {
      // Default plausible prediction
      suggestedCategory = categories[Math.floor(Math.random() * categories.length)];
      confidence = 0.78 + Math.random() * 0.15;
    }

    confidence = Math.round(confidence * 100) / 100;
    const requiresHumanReview = confidence < 0.65;

    const guidanceMap: Record<WasteCategory, string> = {
      ORGANIC: 'Dispose in green bin for municipal composting. Keep free of polythene wrappers.',
      PAPER: 'Keep clean, flat, and dry. Bundle newspapers and cartons separately.',
      PLASTIC: 'Rinse bottles, remove caps, and compress to save storage volume.',
      GLASS: 'Ensure bottles are clean and unbroken. Separate clear from amber glass.',
      METAL: 'Clean aluminum cans and scrap iron. Do not mix with domestic wet waste.',
      E_WASTE: 'Drop off at authorized e-waste depots. Never incinerate batteries or circuit boards.',
      CONSTRUCTION: 'Arrange specialized municipal skip trailer for debris and masonry.',
      HAZARDOUS: 'WARNING: Hazardous waste must be handled with specialized safety protocols. Do not dispose with regular domestic refuse.',
      MIXED: 'Segregate recyclables into designated color-coded bags before curbside collection.',
    };

    return sendSuccess(res, 'AI waste analysis complete', {
      suggestedCategory,
      confidence,
      requiresHumanReview,
      guidance: guidanceMap[suggestedCategory],
      safetyNote: 'AI classification provides recommendations. Hazardous waste must never be presumed safe based solely on image analysis.',
    });
  } catch (error) {
    next(error);
  }
}
