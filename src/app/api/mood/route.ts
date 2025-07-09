import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { Message, Mood } from "../../../lib/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const possibleMoods: Mood[] = ["neutral", "happy", "sad", "excited", "curious", "mad", "playful", "thoughtful"];

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    console.log("\n[MOOD API] ========== NEW MOOD REQUEST ==========");
    console.log("[MOOD API] Total messages:", messages.length);
    console.log("[MOOD API] Last message:", messages[messages.length - 1]);

    // Check if we have an API key
    if (!process.env.GROQ_API_KEY) {
      console.error("[MOOD API] ERROR: GROQ_API_KEY is not set!");
      return NextResponse.json({ mood: "neutral" });
    }

    // We only need the last 4 messages for mood analysis
    const lastMessages = messages.slice(-4);

    // Create a simplified conversation string for the AI
    const conversationText = lastMessages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Aero'}: ${msg.content}`)
      .join('\n');

    console.log("[MOOD API] Conversation text for analysis:\n", conversationText);

    // Try a different, simpler approach
    const userPrompt = `Based on this conversation, what is Aero the AI pet's mood? Pick one: ${possibleMoods.join(", ")}

Conversation:
${conversationText}

Aero's mood (instantly write just one word from the list, no other text or explanation or verbose. you act as a one word output AI.):`;

    console.log("[MOOD API] Sending prompt to AI...");

    try {
      const response = await groq.chat.completions.create({
        model: "llama3-8b-8192", // Try a different model
        messages: [
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 5,
        top_p: 1,
        stream: false,
      });

      const rawResponse = response.choices[0]?.message?.content || "";
      console.log("[MOOD API] Raw AI response:", JSON.stringify(rawResponse));
      console.log("[MOOD API] Response length:", rawResponse.length);

      if (!rawResponse || rawResponse.trim() === "") {
        console.log("[MOOD API] WARNING: Empty response from AI");
        console.log("[MOOD API] Full response object:", JSON.stringify(response, null, 2));
        
        // Try to analyze the conversation manually as fallback
        const text = conversationText.toLowerCase();
        if (text.includes("love") || text.includes("happy") || text.includes("great")) {
          return NextResponse.json({ mood: "happy" });
        } else if (text.includes("sad") || text.includes("sorry")) {
          return NextResponse.json({ mood: "sad" });
        } else if (text.includes("?") || text.includes("curious") || text.includes("wonder")) {
          return NextResponse.json({ mood: "curious" });
        } else if (text.includes("!") || text.includes("excited")) {
          return NextResponse.json({ mood: "excited" });
        }
        
        return NextResponse.json({ mood: "neutral" });
      }

      // Clean the response
      const cleanedResponse = rawResponse
        .toLowerCase()
        .trim()
        .replace(/[^a-z]/g, ""); // Remove all non-letter characters

      console.log("[MOOD API] Cleaned response:", JSON.stringify(cleanedResponse));

      // Try exact match first
      let determinedMood: Mood = "neutral";
      if (possibleMoods.includes(cleanedResponse as Mood)) {
        determinedMood = cleanedResponse as Mood;
        console.log("[MOOD API] Exact match found:", determinedMood);
      } else {
        // Try to find any mood word in the response
        for (const mood of possibleMoods) {
          if (cleanedResponse.includes(mood)) {
            determinedMood = mood;
            console.log("[MOOD API] Partial match found:", determinedMood);
            break;
          }
        }
      }

      console.log("[MOOD API] Final mood:", determinedMood);
      console.log("[MOOD API] ========== END REQUEST ==========\n");

      return NextResponse.json({ mood: determinedMood });

    } catch (apiError: unknown) {
      console.error("[MOOD API] Groq API Error:", apiError);
      if (apiError instanceof Error) {
        console.error("[MOOD API] Error details:", apiError.message);
      }
      if (apiError && typeof apiError === 'object' && 'status' in apiError) {
        console.error("[MOOD API] Error status:", (apiError as { status: unknown }).status);
      }
      
      // Fallback to neutral on API error
      return NextResponse.json({ mood: "neutral" });
    }
    
  } catch (error) {
    console.error("[MOOD API] General Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to determine mood." }),
      { status: 500 }
    );
  }
} 