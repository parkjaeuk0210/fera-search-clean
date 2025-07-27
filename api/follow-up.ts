import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from 'marked';

// Configure marked for better formatting
marked.setOptions({
  breaks: true,
  gfm: true,
  mangle: false,
});

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

// Interface for conversation history
interface ConversationEntry {
  query: string;
  response: string;
}

// Format raw text into proper HTML
async function formatResponseToHTML(text: string | Promise<string>): Promise<string> {
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
  
  // Convert markdown to HTML
  const html = marked(processedText.trim());
  return html;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { query, conversationHistory } = req.body;
    
    if (!query) {
      return res.status(400).json({
        message: "Query is required",
      });
    }
    
    // Build conversation history for context
    let history: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((entry: ConversationEntry) => {
        // Add user query
        history.push({
          role: "user",
          parts: [{ text: entry.query }]
        });
        // Add model response
        history.push({
          role: "model", 
          parts: [{ text: entry.response }]
        });
      });
    }
    
    // Create a new chat session with history
    const chat = model.startChat({
      history,
      tools: [
        {
          // @ts-ignore
          google_search: {},
        },
      ],
    });
    
    // Send follow-up message
    const result = await chat.sendMessage(query);
    const response = await result.response;
    const text = response.text();
    
    // Format the response text to HTML
    const formattedText = await formatResponseToHTML(text);
    
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
    
    res.status(200).json({
      summary: formattedText,
      sources,
    });
  } catch (error: any) {
    console.error("Follow-up error:", error);
    res.status(500).json({
      message: error.message || "An error occurred while processing your follow-up",
    });
  }
}