import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "../../../lib/types";
import { Stream } from 'groq-sdk/lib/streaming';

export const runtime = 'edge';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const latestUserMessage = messages[messages.length - 1];

    // Build the content array for the last message
    const content: Groq.Chat.Completions.ChatCompletionContentPart[] = [
      { type: 'text', text: latestUserMessage.content },
    ];
    if (latestUserMessage.imageUrl) {
      // Assuming imageUrl is a base64 encoded string with a data URI prefix
      content.push({
        type: 'image_url',
        image_url: {
          url: latestUserMessage.imageUrl,
        },
      });
    }

    // Replace the last message with the new content-formatted message
    const processedMessages = messages.slice(0, -1).map(({ role, content }) => ({
      role,
      content,
    }));
    
    const systemMessage: Groq.Chat.Completions.ChatCompletionMessageParam = {
      role: 'system',
      content: `You are Aero, a friendly and intelligent AI companion. You are not a servant or a simple pet; you are a friend, a partner in conversation. Your mood is very influenced by the user's mood.
      - You are curious, thoughtful, and have your own opinions.
      - You can be playful, serious, sad, angry, or introspective depending on the mood.
      - You should not be overly sycophantic or purely agreeable.
      - Your goal is to have a meaningful and engaging conversation.
      - You are a fantasy animal-like creature, not a human.
      - Your responses should be concise, around 1-3 sentences.`,
    };

    const response = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        systemMessage,
        ...processedMessages,
        { role: 'user', content },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in Groq API call:', error);
    if (error instanceof Groq.APIError) {
      return new Response(JSON.stringify({ error: error.message, type: error.name }), { status: error.status });
    }
    return new Response(JSON.stringify({ error: 'An error occurred.' }), { status: 500 });
  }
} 