require('dotenv').config();
const express = require('express');
const axios = require('axios');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const Replicate = require('replicate');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

// Use CORS (place this before other middleware)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://www.dreamlifecheck.com'
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware
app.use(helmet());  // Adds various HTTP headers for security
app.use(express.json({ limit: '1mb' }));  // Limit payload size

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased from 5 to 100
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// Input validation middleware
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

      console.log(`Prompt request for Chapter ${i + 1}:`, JSON.stringify(promptRequest, null, 2));

      const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', promptRequest, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`Raw response for Chapter ${i + 1}:`, JSON.stringify(openaiResponse.data, null, 2));

      let imagePrompt = openaiResponse.data.choices[0].message.content.trim();
      
      // Append additional instructions for the image generator
      imagePrompt += " Create a photorealistic image with high resolution and intricate details. Ensure proper lighting, shadows, and textures to enhance the realism. The image should have a cinematic quality with a balanced composition.";
      
      imagePrompts.push(imagePrompt);

      console.log(`Generated prompt for Chapter ${i + 1}: ${imagePrompt}`);
    }

    console.log('All generated image prompts:');
    imagePrompts.forEach((prompt, index) => {
      console.log(`Chapter ${index + 1}: ${prompt}`);
    });

    return imagePrompts;
  } catch (error) {
    console.error('Error generating image prompts:', error);
    throw error;
  }
};

// Function to stringify appearance object or any other object
const stringifyObject = (obj) => {
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }
  return String(obj); // Convert to string if it's not an object
};

// Function to store user data in Supabase
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

app.post('/api/generate-story', (req, res, next) => {
  console.log('Received request for story generation');
  const rawBody = req.body;
  console.log('Raw request body:', JSON.stringify(rawBody, null, 2));

  // Convert the raw body into a dictionary
  const bodyDict = {};
  if (rawBody && rawBody.answers) {
    for (const [key, value] of Object.entries(rawBody.answers)) {
      bodyDict[key] = value[''] || value; // Handle both nested and non-nested structures
    }
  }
  bodyDict.inputType = rawBody.inputType;

  console.log('Request body as dictionary:');
  console.log(JSON.stringify(bodyDict, null, 2));

  req.bodyDict = bodyDict; // Attach the dictionary to the request object
  next();
}, validateInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Store user data in Supabase
    const { full_name, email } = req.bodyDict;
    await storeUserData(full_name, email);

    console.log('Generating story with OpenAI');
    const { inputType } = req.body;
    const bodyDict = req.bodyDict; // Use the dictionary we attached earlier

    let prompt = "Create a deeply inspiring and emotionally moving account of a day in my future life where I have achieved all my goals and dreams. The story MUST be split into EXACTLY 5 distinct chapters. Each chapter should focus on a different part of the day or aspect of my achieved dream life, highlighting the journey, struggles overcome, and the profound impact of realizing these dreams. It is CRUCIAL that you provide substantial content for ALL 5 chapters. Each chapter should be roughly equal in length and have a unique, descriptive title that represents the content of that chapter. Format each chapter as 'Title: [Your Title Here]' followed by the chapter content. Do not use generic titles like 'Chapter 1' or 'Morning'. The story should be in first person, without using any names.\n\n";
    
    if (inputType === 'questions') {
      prompt += `In this future, I look like an adult ${bodyDict.appearance || 'Not specified'}. `;
      prompt += `My career is: ${bodyDict.career || 'Not specified'}. `;
      prompt += `I work in: ${bodyDict.work_environment || 'Not specified'}. `;
      prompt += `My home is: ${bodyDict.home || 'Not specified'}. `;
      prompt += `My morning routine involves: ${bodyDict.morning_routine || 'Not specified'}. `;
      prompt += `My hobbies include: ${bodyDict.hobbies || 'Not specified'}. `;
      prompt += `My relationships are: ${bodyDict.relationships || 'Not specified'}. `;
      prompt += `I travel: ${bodyDict.travel || 'Not specified'}. `;
      prompt += `My personal growth involves: ${bodyDict.personal_growth || 'Not specified'}. `;
      prompt += `I make a positive impact by: ${bodyDict.impact || 'Not specified'}. `;
      prompt += `My evening routine includes: ${bodyDict.evening_routine || 'Not specified'}. `;
    } else {
      prompt += `In this future, I look like an adult ${bodyDict.freeform_appearance || 'Not specified'}. `;
      prompt += `I have achieved these goals: ${bodyDict.freeform_goals || 'Not specified'}. `;
    }

    console.log("Prompt being sent to OpenAI:");
    console.log(prompt);

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

    console.log("Raw response from OpenAI:");
    console.log(generatedContent);

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

    // Extract the user's appearance for image generation
    const userAppearance = inputType === 'questions' 
      ? bodyDict.appearance || 'Not specified'
      : bodyDict.freeform_appearance || 'Not specified';

    console.log('Generating image prompts');
    const imagePrompts = await generateImagePrompts(chapters, userAppearance);
    console.log('Image prompts generated successfully');

    // Print all image prompts before calling Replicate API
    console.log('All image prompts:');
    imagePrompts.forEach((prompt, index) => {
      console.log(`Chapter ${index + 1}: ${prompt}`);
    });

    console.log('Generating images with Replicate');
    const images = [];
    for (let i = 0; i < imagePrompts.length; i++) {
      console.log(`Generating image for Chapter ${i + 1}`);
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
            console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          }
        }
      }
      imageUrl = imageUrl || 'https://example.com/placeholder-image.jpg';
      images.push(imageUrl);
      console.log(`Image URL for Chapter ${i + 1}: ${imageUrl}`);
    }
    console.log('All images generated or placeholders used');

    res.json({ story: chapters, images });
  } catch (error) {
    console.error('Error generating story:', error);
    if (error.response) {
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', JSON.stringify(error.response.headers, null, 2));
    }
    res.status(500).json({ 
      error: 'An unexpected error occurred', 
      details: error.message
    });
  }
});

async function generateImage(prompt) {
  const MAX_RETRIES = 5;
  const INITIAL_RETRY_DELAY = 1000; // 1 second

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} - Sending request to Replicate API with prompt:`, prompt);
      
      const input = {
        prompt: prompt,
        negative_prompt: "cartoon, anime, illustration, drawing, painting, sketch, low quality, low resolution, blurry, deformed, ugly, bad anatomy",
        num_inference_steps: 4, // Changed from 50 to 4
        guidance_scale: 7.5,
        width: 768,
        height: 768,
      };

      const output = await replicate.run(
        "black-forest-labs/flux-schnell", // Added version number
        { input }
      );

      console.log('Raw response from Replicate API:', output);

      if (Array.isArray(output) && output.length > 0) {
        const imageUrl = output[0];
        console.log('Generated image URL:', imageUrl);
        return imageUrl;
      } else {
        console.error('Unexpected response structure from Replicate API:', output);
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed - Error generating image:`, error.message);
      if (error.response) {
        console.error('Error response from Replicate API:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      
      if (attempt === MAX_RETRIES) {
        console.error('Max retries reached. Giving up.');
        throw error;
      }

      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Error handling for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});