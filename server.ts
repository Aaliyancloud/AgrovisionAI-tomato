import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support large base64 image uploads from mobile and high-res cameras
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: isProduction ? 'production' : 'development',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

/**
 * Real Gemini 3.8 Flash Multimodal Vision AI Endpoint:
 * Performs strict, multi-stage leaf pathology inspection:
 * 1. Gatekeeper: Is this a plant leaf? (Strictly rejects humans, clothing, rooms, animals)
 * 2. Species Verification: Is this a tomato leaf (Solanum lycopersicum) vs mango/neem/other?
 * 3. Pathology Analysis: Accurate tomato disease classification with symptoms and organic treatments.
 */
app.post('/api/analyze-leaf', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Image data is required in base64 format.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        fallbackRequired: true
      });
    }

    // Extract raw base64 data and mime type
    let mimeType = 'image/jpeg';
    let cleanBase64 = imageBase64;

    const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches) {
      mimeType = matches[1];
      cleanBase64 = matches[2];
    }

    const ai = new GoogleGenAI();

    const prompt = `You are the lead botanical computer-vision pathologist for AgroVision AI.
Analyze this image with extreme scientific precision. Follow these strict rules:

1. FIRST GATEKEEPER - LEAF VERIFICATION:
Determine if this image actually contains a botanical plant leaf.
If the image shows a human person, clothing (e.g. white shirt, fabric), skin, facial features, a room, furniture, an animal, or a non-plant object, you MUST immediately declare:
- is_plant_leaf: false
- non_plant_reason: Clearly describe what you see (e.g. "Human skin and white clothing", "Indoor furniture", "Non-botanical object").
- is_tomato_leaf: false
- disease_id: "none"
- disease_name: "Non-Plant Detected"
NEVER diagnose a human, clothing, or non-plant object with plant diseases like Late Blight or Early Blight.

2. SECOND GATEKEEPER - SPECIES IDENTIFICATION:
If it IS a plant leaf, identify if it belongs to a tomato plant (Solanum lycopersicum).
- If it is Mango (Mangifera indica): set is_tomato_leaf: false, plant_species: "Mango Leaf", species_scientific: "Mangifera indica".
- If it is Neem (Azadirachta indica): set is_tomato_leaf: false, plant_species: "Neem Leaf", species_scientific: "Azadirachta indica".
- If it is another non-tomato plant: set is_tomato_leaf: false, plant_species: name of plant.
- If it IS a Tomato leaf: set is_tomato_leaf: true, plant_species: "Tomato Leaf", species_scientific: "Solanum lycopersicum".

3. THIRD STAGE - PATHOLOGY CLASSIFICATION (Only if is_tomato_leaf is true):
Classify into one of these tomato conditions:
- "healthy" (Vigorous, emerald green foliage, optimal cellular turgor)
- "early_blight" (Alternaria solani - concentric dark brown target rings with yellow halo)
- "late_blight" (Phytophthora infestans - large water-soaked dark greenish-gray to brown necrosis)
- "bacterial_spot" (Xanthomonas - small angular dark brown scabs, shot-hole tears)
- "septoria_leaf_spot" (Septoria lycopersici - small circular spots with ash-gray center & dark border)
- "yellow_leaf_curl" (TYLCV virus - upward cup-shaped leaf curling, bright yellow interveinal chlorosis)
- "leaf_mold" (Passalora fulva - yellow patches above, velvety olive-green mold below)
- "mosaic_virus" (ToMV - mottled dark and light green mosaic distortion)

Return ONLY valid JSON matching this exact structure:
{
  "is_plant_leaf": boolean,
  "non_plant_reason": string or null,
  "is_tomato_leaf": boolean,
  "plant_species": string,
  "species_scientific": string,
  "disease_id": "healthy" | "early_blight" | "late_blight" | "bacterial_spot" | "septoria_leaf_spot" | "yellow_leaf_curl" | "leaf_mold" | "mosaic_virus" | "none",
  "disease_name": string,
  "pathogen_type": "Fungal" | "Bacterial" | "Viral" | "Healthy" | "None",
  "confidence": number between 75 and 99,
  "severity": "None" | "Mild" | "Moderate" | "Severe",
  "lesion_coverage_percent": number,
  "primary_symptoms": string[],
  "organic_treatment": string[],
  "chemical_treatment": string[],
  "cultural_prevention": string[],
  "lesion_boxes": [
    { "x": number, "y": number, "width": number, "height": number, "label": string, "confidence": number }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: cleanBase64
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '{}';
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Clean up markdown block wrapping if present
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      data: parsedData,
      source: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('Error during Gemini leaf analysis:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process leaf with Gemini vision model',
      fallbackRequired: true
    });
  }
});

// Mount Vite middleware in development or serve static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 AgroVision AI server active at http://0.0.0.0:${PORT} [${isProduction ? 'PROD' : 'DEV'}]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting AgroVision server:', err);
  process.exit(1);
});
