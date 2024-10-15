// functions/api/generate-story.js

import OpenAI from 'openai';
import Replicate from 'replicate';
import { createClient } from '@supabase/supabase-js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://dreamlifecheck.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
  // Handle CORS preflight requests
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Add CORS headers to the actual response
  if (context.request.method === "POST") {
    try {
      const { inputType, answers } = await context.request.json();

      // Initialize API clients
      const openai = new OpenAI({ apiKey: context.env.OPENAI_API_KEY });
      const replicate = new Replicate({ auth: context.env.REPLICATE_API_TOKEN });
      const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);

      // Store user data in Supabase
      const { full_name, email } = answers;
      await storeUserData(supabase, full_name, email);

      // Generate story prompt
      let prompt = "Create a deeply inspiring and emotionally moving account of a day in my future life where I have achieved all my goals and dreams. The story MUST be split into EXACTLY 5 distinct chapters. Each chapter should focus on a different part of the day or aspect of my achieved dream life, highlighting the journey, struggles overcome, and the profound impact of realizing these dreams. It is CRUCIAL that you provide substantial content for ALL 5 chapters. Each chapter should be roughly equal in length and have a unique, descriptive title that represents the content of that chapter. Format each chapter as 'Title: [Your Title Here]' followed by the chapter content. Do not use generic titles like 'Chapter 1' or 'Morning'. The story should be in first person, without using any names.\n\n";

      if (inputType === 'questions') {
        prompt += `In this future, I look like an adult ${answers.appearance || 'Not specified'}. `;
        prompt += `My career is: ${answers.career || 'Not specified'}. `;
        prompt += `I work in: ${answers.work_environment || 'Not specified'}. `;
        prompt += `My home is: ${answers.home || 'Not specified'}. `;
        prompt += `My morning routine involves: ${answers.morning_routine || 'Not specified'}. `;
        prompt += `My hobbies include: ${answers.hobbies || 'Not specified'}. `;
        prompt += `My relationships are: ${answers.relationships || 'Not specified'}. `;
        prompt += `I travel: ${answers.travel || 'Not specified'}. `;
        prompt += `My personal growth involves: ${answers.personal_growth || 'Not specified'}. `;
        prompt += `I make a positive impact by: ${answers.impact || 'Not specified'}. `;
        prompt += `My evening routine includes: ${answers.evening_routine || 'Not specified'}. `;
      } else {
        prompt += `In this future, I look like an adult ${answers.freeform_appearance || 'Not specified'}. `;
        prompt += `I have achieved these goals: ${answers.freeform_goals || 'Not specified'}. `;
      }

      // Generate story with OpenAI
      const completion = await openai.chat.completions.create({
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
      });

      const generatedContent = completion.choices[0].message.content.trim();

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
        ? answers.appearance || 'Not specified'
        : answers.freeform_appearance || 'Not specified';

      // Generate image prompts
      const imagePrompts = await generateImagePrompts(openai, chapters, userAppearance);

      // Generate images
      const images = await Promise.all(imagePrompts.map(prompt => generateImage(replicate, prompt)));

      return new Response(JSON.stringify({ story: chapters, images }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
      });
    }
  }

  return new Response("Method not allowed", {
    status: 405,
    headers: corsHeaders
  });
}

async function generateImagePrompts(openai, chapters, userAppearance) {
  const imagePrompts = [];

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
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

    const completion = await openai.chat.completions.create(promptRequest);
    let imagePrompt = completion.choices[0].message.content.trim();
    
    imagePrompt += " Create a photorealistic image with high resolution and intricate details. Ensure proper lighting, shadows, and textures to enhance the realism. The image should have a cinematic quality with a balanced composition.";
    
    imagePrompts.push(imagePrompt);
  }

  return imagePrompts;
}

async function generateImage(replicate, prompt) {
  const MAX_RETRIES = 5;
  const INITIAL_RETRY_DELAY = 1000; // 1 second

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
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
      if (attempt === MAX_RETRIES) {
        console.error('Max retries reached. Giving up.');
        throw error;
      }

      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function storeUserData(supabase, name, email) {
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
