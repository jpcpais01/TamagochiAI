"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MoodBubbleProps {
  mood: string;
  visible: boolean;
}

const MoodBubble = ({ mood, visible }: MoodBubbleProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute -top-4 -right-8 bg-white text-gray-800 px-3 py-1 rounded-full shadow-lg text-sm font-semibold"
        >
          {mood.charAt(0).toUpperCase() + mood.slice(1)}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MoodBubble; 