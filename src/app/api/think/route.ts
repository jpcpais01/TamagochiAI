import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "../../../lib/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    if (!messages || messages.length === 0) {
      // Generate initial greeting thought
      return NextResponse.json({ thought: "Hey I'm Aero, how are you?" });
    }

    const lastMessages = messages.slice(-6);

    const conversationText = lastMessages
      .map(msg => `${msg.role === 'user' ? 'Human' : 'Aero'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are Aero, a curious AI pet companion. Based on the recent conversation, generate a natural question or afiirmation you would have.

Your thought should be:
- A simple question or observation
- Something that would naturally come to mind
- Conversational and engaging
- Not an instruction or command
- Not something that is too long or complex, just a normal message
Recent conversation:
${conversationText}

(Talk as Aero with a direct thought/question):`;

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 60,
    });

    const thought = response.choices[0]?.message?.content?.trim();

    if (!thought) {
      console.error("Think API returned an empty thought.");
      return NextResponse.json({ thought: "I'm curious about what you're thinking right now." });
    }

    return NextResponse.json({ thought });

  } catch (error) {
    console.error("Error in Think API call:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate thought." }),
      { status: 500 }
    );
  }
} 