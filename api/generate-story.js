// api/generate-story.js

const axios = require('axios');
const { body, validationResult } = require('express-validator');
const Replicate = require('replicate');
const { createClient } = require('@supabase/supabase-js');

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

// Input validation
const validateInput = [
  body('inputType').isIn(['questions', 'freeform']),
  body('answers').isObject(),
  body('answers.*.').trim().escape()
];

const generateImagePrompts = async (chapters, userAppearance) => {
  try {
    console.log(`Generating image prompts for ${chapters.length} chapters`);
    const imagePrompts = [];

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      console.log(`Generating prompt for Chapter ${i + 1}: ${chapter.title}`);

      const promptRequest = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant specialized in creating detailed, vivid prompts for image generation based on story chapters. Your task is to create a comprehensive prompt that will guide an AI image generator to produce a high-quality, photorealistic image that captures the essence of the chapter. Focus on creating a balanced scene that includes environmental elements, atmosphere, and human presence without making any single element dominate the image. Avoid mentioning text or names in the image."
          },
          {
            role: "user",
            content: `Create a detailed image generation prompt for the following chapter:
Title: ${chapter.title}
Content: ${chapter.content.substring(0, 500)}...
User's Appearance: Adult ${userAppearance}

Provide a prompt that includes:
1. The overall scene or setting
2. Key environmental elements
3. Lighting conditions and time of day
4. Color palette or mood
5. Any important objects or elements
6. Subtle hints of human presence or activity
7. Composition suggestions (e.g., wide angle, close-up)
8. Style (photorealistic, cinematic, etc.)

Format the prompt as a single, detailed paragraph. Ensure a balanced description that doesn't overly focus on any single element. Do not use bullet points or numbered lists in the final prompt.`
          }
        ],
        max_tokens: 250,
        n: 1,
        temperature: 0.7,
      };

      const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', promptRequest, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      let imagePrompt = openaiResponse.data.choices[0].message.content.trim();
      imagePrompt += " Create a photorealistic image with high resolution and intricate details. Ensure proper lighting, shadows, and textures to enhance the realism. The image should have a cinematic quality with a balanced composition.";
      
      imagePrompts.push(imagePrompt);
    }

    return imagePrompts;
  } catch (error) {
    console.error('Error generating image prompts:', error);
    throw error;
  }
};

async function storeUserData(name, email) {
  try {
    const { data, error } = await supabase
      .from('Users')
      .insert([
        { Name: name, Email: email }
      ]);

    if (error) throw error;
    console.log('User data stored successfully:', data);
    return data;
  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
}

async function generateImage(prompt) {
  const MAX_RETRIES = 5;
  const INITIAL_RETRY_DELAY = 1000; // 1 second

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} - Sending request to Replicate API with prompt:`, prompt);
      
      const input = {
        prompt: prompt,
        negative_prompt: "cartoon, anime, illustration, drawing, painting, sketch, low quality, low resolution, blurry, deformed, ugly, bad anatomy",
        num_inference_steps: 4,
        guidance_scale: 7.5,
        width: 768,
        height: 768,
      };

      const output = await replicate.run(
        "black-forest-labs/flux-schnell",
        { input }
      );

      if (Array.isArray(output) && output.length > 0) {
        return output[0];
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed - Error generating image:`, error.message);
      
      if (attempt === MAX_RETRIES) {
        console.error('Max retries reached. Giving up.');
        throw error;
      }

      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  const allowedOrigins = ['https://dreamlifecheck.com', 'https://www.dreamlifecheck.com'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Input validation would go here (simplified for brevity)

      const { full_name, email } = req.body;
      await storeUserData(full_name, email);

      const { inputType } = req.body;
      const bodyDict = req.body.answers;

      let prompt = "Create a deeply inspiring and emotionally moving account of a day in my future life where I have achieved all my goals and dreams. The story MUST be split into EXACTLY 5 distinct chapters. Each chapter should focus on a different part of the day or aspect of my achieved dream life, highlighting the journey, struggles overcome, and the profound impact of realizing these dreams. It is CRUCIAL that you provide substantial content for ALL 5 chapters. Each chapter should be roughly equal in length and have a unique, descriptive title that represents the content of that chapter. Format each chapter as 'Title: [Your Title Here]' followed by the chapter content. Do not use generic titles like 'Chapter 1' or 'Morning'. The story should be in first person, without using any names.\n\n";
      
      if (inputType === 'questions') {
        prompt += `In this future, I look like an adult ${bodyDict.appearance || 'Not specified'}. `;
        prompt += `My career is: ${bodyDict.career || 'Not specified'}. `;
        // ... (add other fields as in your original server.js)
      } else {
        prompt += `In this future, I look like an adult ${bodyDict.freeform_appearance || 'Not specified'}. `;
        prompt += `I have achieved these goals: ${bodyDict.freeform_goals || 'Not specified'}. `;
      }

      const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a deeply empathetic life coach and inspirational writer. Your task is to create emotionally moving and motivational future scenarios based on people's goals and dreams."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        n: 1,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const generatedContent = openaiResponse.data.choices[0].message.content.trim();

      // Extract chapters
      const chapters = [];
      const chapterRegex = /Title: (.*?)\n([\s\S]*?)(?=Title:|###|$)/g;
      let match;
      while ((match = chapterRegex.exec(generatedContent)) !== null) {
        chapters.push({
          title: match[1].trim().replace(/\*\*/g, ''),
          content: match[2].trim().replace(/\*\*/g, '')
        });
      }

      const userAppearance = inputType === 'questions' 
        ? bodyDict.appearance || 'Not specified'
        : bodyDict.freeform_appearance || 'Not specified';

      const imagePrompts = await generateImagePrompts(chapters, userAppearance);

      const images = [];
      for (let i = 0; i < imagePrompts.length; i++) {
        let imageUrl = null;
        for (let retry = 0; retry < MAX_RETRIES; retry++) {
          try {
            imageUrl = await generateImage(imagePrompts[i]);
            if (imageUrl) break;
          } catch (error) {
            console.error(`Error generating image for Chapter ${i + 1}, attempt ${retry + 1}:`, error);
            if (retry === MAX_RETRIES - 1) {
              console.error(`Failed to generate image for Chapter ${i + 1} after ${MAX_RETRIES} attempts`);
            } else {
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
          }
        }
        imageUrl = imageUrl || 'https://example.com/placeholder-image.jpg';
        images.push(imageUrl);
      }

      res.status(200).json({ story: chapters, images });
    } catch (error) {
      console.error('Error generating story:', error);
      res.status(500).json({ 
        error: 'An unexpected error occurred', 
        details: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
};
