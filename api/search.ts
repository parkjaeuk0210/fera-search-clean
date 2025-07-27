import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 2048,
  },
});

// Store chat sessions in memory (Note: This will reset on each deployment)
const chatSessions = new Map<string, any>();

// Format raw text into proper markdown
async function formatResponseToMarkdown(text: string | Promise<string>): Promise<string> {
  const resolvedText = await Promise.resolve(text);
  let processedText = resolvedText.replace(/\r\n/g, "\n");
  
  // Process main sections
  processedText = processedText.replace(/^([A-Za-z][A-Za-z\s]+):(\s*)/gm, "## $1$2");
  
  // Process sub-sections
  processedText = processedText.replace(/(?<=\n|^)([A-Za-z][A-Za-z\s]+):(?!\d)/gm, "### $1");
  
  // Process bullet points
  processedText = processedText.replace(/^[•●○]\s*/gm, "* ");
  
  // Process numbered lists
  processedText = processedText.replace(/^(\d+)\.\s*/gm, "$1. ");
  
  return processedText.trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({
        message: "Query parameter 'q' is required",
      });
    }
    
    // Create a new chat session with search capability
    const chat = model.startChat({
      tools: [
        {
          // @ts-ignore
          google_search: {},
        },
      ],
    });
    
    // Generate content with search tool
    const result = await chat.sendMessage(query);
    const response = await result.response;
    const text = response.text();
    
    // Format the response text
    const formattedText = await formatResponseToMarkdown(text);
    
    // Extract sources from grounding metadata
    const sourceMap = new Map<string, { title: string; url: string; snippet: string }>();
    
    const metadata = response.candidates?.[0]?.groundingMetadata as any;
    if (metadata) {
      const chunks = metadata.groundingChunks || [];
      const supports = metadata.groundingSupports || [];
      
      chunks.forEach((chunk: any, index: number) => {
        if (chunk.web?.uri && chunk.web?.title) {
          const url = chunk.web.uri;
          if (!sourceMap.has(url)) {
            const snippets = supports
              .filter((support: any) => support.groundingChunkIndices.includes(index))
              .map((support: any) => support.segment.text)
              .join(" ");
            
            sourceMap.set(url, {
              title: chunk.web.title,
              url: url,
              snippet: snippets || "",
            });
          }
        }
      });
    }
    
    const sources = Array.from(sourceMap.values());
    
    // Generate a session ID
    const sessionId = Math.random().toString(36).substring(7);
    chatSessions.set(sessionId, chat);
    
    // Clean up old sessions (keep only last 100)
    if (chatSessions.size > 100) {
      const firstKey = chatSessions.keys().next().value;
      if (firstKey) {
        chatSessions.delete(firstKey);
      }
    }
    
    res.status(200).json({
      sessionId,
      summary: formattedText,
      sources,
    });
  } catch (error: any) {
    console.error("Search error:", error);
    res.status(500).json({
      message: error.message || "An error occurred while processing your search",
    });
  }
}