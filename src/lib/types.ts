export type Message = {
  role: 'user' | 'assistant';
  content: string;
  isSpontaneous?: boolean;
  imageUrl?: string;
};

export type Mood = 'happy' | 'sad' | 'excited' | 'curious' | 'mad' | 'playful' | 'thoughtful' | 'neutral'; 