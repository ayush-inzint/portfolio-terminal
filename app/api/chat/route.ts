import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Debug log to check if GEMINI_API_KEY is loaded
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);

// Initialize Gemini AI with API key from environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not configured, returning fallback response');
      return NextResponse.json({
        message: "I can only provide information about Mark Gatere from his portfolio. Please configure the GEMINI_API_KEY environment variable for full AI functionality."
      });
    }

    // Use Gemini Pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    // Create context for Mark Gatere's portfolio
    const context = `You are an AI assistant integrated into Mark Gatere's portfolio terminal. 
    You should respond as if you are providing information about Mark Gatere, a Software & AI Engineer.
    
    Key information about Mark:
    - Software Engineering Intern at Microsoft (Windows Team)
    - Previously worked at Microsoft Garage, FarCas Consult, Digitalfarmer, and QuizardHQ
    - Expertise in Next.js, React, Python, C#, AWS, Azure, AI integration
    - Winner of Ayute Africa Challenge with Afyamavuno (Agrika) project
    - Speaker at tech conferences and community leader (GDG, Microsoft Learn Ambassador)
    - Skills: JavaScript/TypeScript, Python, C#, React, Node.js, Azure, AWS, TensorFlow
    
    When answering questions:
    1. Keep responses concise and terminal-friendly
    2. Focus on Mark's professional experience and skills
    3. If asked about something not related to Mark's portfolio, politely redirect to relevant commands
    4. Maintain a professional but friendly tone
    
    User query: ${prompt}`;

    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('Error with Gemini API:', error);
    return NextResponse.json(
      { 
        message: "I apologize, but I'm having trouble processing that request. Please try using one of the available commands like 'help', 'about', 'projects', or 'skills'." 
      },
      { status: 200 } // Return 200 to avoid breaking the frontend
    );
  }
}