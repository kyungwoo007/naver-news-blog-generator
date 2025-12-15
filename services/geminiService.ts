import { GoogleGenAI, Type } from "@google/genai";
import { GeneratorConfig, BlogPost } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

export const generateBlogDraft = async (config: GeneratorConfig): Promise<BlogPost> => {
  const prompt = `
    You are an expert content writer for a Korean audience, specializing in synthesizing news from the Naver ecosystem and analyzing Global Trends.
    
    Task: Create a high-quality blog post based on the following parameters:
    - Keywords/Topic: "${config.keywords}"
    - Timeframe Context: "${config.dateRange}"
    - Tone/Style: "${config.tone}"
    - Target Length: "${config.length}"

    Requirements:
    1. Title: Catchy, SEO-optimized for Naver Search.
    2. Content: 
       - Write in fluent Korean.
       - Structure with HTML tags (<h2>, <p>, <ul>, <strong>, <blockquote>).
       - DO NOT output a full HTML document (no <html> or <body> tags), just the inner content.
       - **VISUALS**: You MUST insert 2-3 **High-Definition** images.
         - Use this EXACT format: <img src="https://image.pollinations.ai/prompt/{english_keywords}?width=1280&height=720&nologo=true&seed={random_seed}" alt="{korean_alt_text}" />
         - {english_keywords}: 3-5 simple, concrete English keywords describing the scene, separated by "%20" (e.g. futuristic%20office%20seoul%20night). DO NOT use full sentences.
         - {random_seed}: A random integer (e.g. 4829) to ensure the image is unique every time.
         - {korean_alt_text}: Descriptive alt text in Korean.
       - **GLOBAL PERSPECTIVE**: Include a dedicated section for "Global Case Studies" (해외 사례/트렌드) comparing the topic with examples from the US, Europe, or Japan.
       - Ensure the content flows logically: Introduction -> Domestic News Synthesis -> Global Case Studies -> In-depth Analysis -> Conclusion.
    3. Tags: Generate 5 relevant hashtags.
    4. Sources: 
       - Invent 2-3 realistic Naver News source titles (Domestic).
       - Invent 2 reputable Global source titles (e.g., Bloomberg, TechCrunch, BBC) relevant to the case studies.

    Output Format: JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            sources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as BlogPost;
  } catch (error) {
    console.error("Error generating blog:", error);
    throw error;
  }
};

export const refineBlogContent = async (currentContent: string, instruction: string): Promise<string> => {
  const prompt = `
    You are an AI Editor Assistant. 
    Current Blog Content (HTML): 
    ${currentContent}

    User Instruction: "${instruction}"

    Task: Rewrite the content to satisfy the user's instruction. 
    - Keep the HTML structure valid.
    - **CRITICAL**: Do NOT remove or modify any <img src="..."> tags. Keep them exactly where they are.
    - Return ONLY the updated HTML content string.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || currentContent;
  } catch (error) {
    console.error("Error refining content:", error);
    return currentContent;
  }
};

export const translateBlogContent = async (currentContent: string, targetLanguage: string): Promise<string> => {
  const prompt = `
    You are a professional translator.
    Task: Translate the following HTML blog content into "${targetLanguage}".
    
    Rules:
    - Preserve ALL HTML tags, classes, and structure exactly.
    - Do NOT translate attributes like 'src', 'class', 'id'.
    - Do NOT translate English text inside 'src' URLs.
    - Only translate the visible human-readable text.
    - Return ONLY the translated HTML string.
    
    Content:
    ${currentContent}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text || currentContent;
  } catch (error) {
    console.error("Error translating content:", error);
    throw error;
  }
};
