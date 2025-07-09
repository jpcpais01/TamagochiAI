"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Mood } from "@/lib/types";
import MoodBubble from "./MoodBubble";

interface PetProps {
  mood: Mood;
}

const moodConfig = {
  happy: {
    auraColor: "rgba(251, 222, 101, 0.6)",
    primaryColor: "rgba(251, 222, 101, 0.9)",
    secondaryColor: "rgba(255, 239, 153, 0.8)",
    wingColor: "rgba(251, 222, 101, 0.5)",
    eyeColor: "rgba(255, 215, 0, 0.8)",
    animationSpeed: 1.5,
    antennaAngle: -15,
    floatY: [-4, 4, -4],
    wingFlap: 0.6,
    glowIntensity: 0.8,
    bodyScale: 1.1,
    eyeShape: { rx: 16, ry: 20 },
    mouthCurve: "M 88 115 Q 100 132 112 115",
    mouthWidth: 3.5,
    particleCount: 8,
    breathingScale: [1, 1.05, 1],
    wingSpread: 1.3,
  },
  sad: {
    auraColor: "rgba(100, 149, 237, 0.3)",
    primaryColor: "rgba(100, 149, 237, 0.6)",
    secondaryColor: "rgba(135, 176, 255, 0.4)",
    wingColor: "rgba(100, 149, 237, 0.2)",
    eyeColor: "rgba(70, 130, 180, 0.7)",
    animationSpeed: 6,
    antennaAngle: 35,
    floatY: [0, 1, 0],
    wingFlap: 3.5,
    glowIntensity: 0.2,
    bodyScale: 0.9,
    eyeShape: { rx: 12, ry: 14 },
    mouthCurve: "M 96 125 Q 100 118 104 125",
    mouthWidth: 2,
    particleCount: 3,
    breathingScale: [1, 1.02, 1],
    wingSpread: 0.8,
  },
  excited: {
    auraColor: "rgba(255, 105, 180, 0.7)",
    primaryColor: "rgba(255, 105, 180, 1.0)",
    secondaryColor: "rgba(255, 182, 193, 0.9)",
    wingColor: "rgba(255, 105, 180, 0.6)",
    eyeColor: "rgba(255, 20, 147, 0.9)",
    animationSpeed: 1,
    antennaAngle: -25,
    floatY: [-6, 6, -6],
    wingFlap: 0.3,
    glowIntensity: 1.0,
    bodyScale: 1.2,
    eyeShape: { rx: 18, ry: 22 },
    mouthCurve: "M 85 115 Q 100 138 115 115",
    mouthWidth: 4,
    particleCount: 12,
    breathingScale: [1, 1.08, 1],
    wingSpread: 1.5,
  },
  curious: {
    auraColor: "rgba(123, 104, 238, 0.5)",
    primaryColor: "rgba(123, 104, 238, 0.8)",
    secondaryColor: "rgba(147, 112, 219, 0.7)",
    wingColor: "rgba(123, 104, 238, 0.4)",
    eyeColor: "rgba(138, 43, 226, 0.8)",
    animationSpeed: 3,
    antennaAngle: -8,
    floatY: [-2, 2, -2],
    wingFlap: 1.0,
    glowIntensity: 0.6,
    bodyScale: 1.05,
    eyeShape: { rx: 15, ry: 19 },
    mouthCurve: "M 95 115 Q 100 120 105 115",
    mouthWidth: 2.5,
    particleCount: 6,
    breathingScale: [1, 1.04, 1],
    wingSpread: 1.1,
  },
  mad: {
    auraColor: "rgba(255, 69, 0, 0.8)",
    primaryColor: "rgba(255, 69, 0, 1.0)",
    secondaryColor: "rgba(255, 140, 0, 0.9)",
    wingColor: "rgba(255, 69, 0, 0.6)",
    eyeColor: "rgba(178, 34, 34, 0.9)",
    animationSpeed: 0.8,
    antennaAngle: -30,
    floatY: [-7, 7, -7],
    wingFlap: 0.2,
    glowIntensity: 1.2,
    bodyScale: 1.15,
    eyeShape: { rx: 10, ry: 16 },
    mouthCurve: "M 90 120 Q 100 112 110 120",
    mouthWidth: 3,
    particleCount: 10,
    breathingScale: [1, 1.1, 1],
    wingSpread: 1.4,
  },
  playful: {
    auraColor: "rgba(0, 255, 127, 0.6)",
    primaryColor: "rgba(0, 255, 127, 0.9)",
    secondaryColor: "rgba(144, 238, 144, 0.8)",
    wingColor: "rgba(0, 255, 127, 0.5)",
    eyeColor: "rgba(0, 206, 209, 0.8)",
    animationSpeed: 1.2,
    antennaAngle: -18,
    floatY: [-5, 5, -5],
    wingFlap: 0.5,
    glowIntensity: 0.7,
    bodyScale: 1.08,
    eyeShape: { rx: 17, ry: 19 },
    mouthCurve: "M 90 115 Q 100 130 110 115",
    mouthWidth: 3.5,
    particleCount: 9,
    breathingScale: [1, 1.06, 1],
    wingSpread: 1.25,
  },
  thoughtful: {
    auraColor: "rgba(135, 206, 250, 0.4)",
    primaryColor: "rgba(135, 206, 250, 0.7)",
    secondaryColor: "rgba(176, 224, 230, 0.6)",
    wingColor: "rgba(135, 206, 250, 0.3)",
    eyeColor: "rgba(70, 130, 180, 0.7)",
    animationSpeed: 8,
    antennaAngle: 10,
    floatY: [0, 1.5, 0],
    wingFlap: 2.5,
    glowIntensity: 0.4,
    bodyScale: 1.0,
    eyeShape: { rx: 13, ry: 17 },
    mouthCurve: "M 96 115 Q 100 118 104 115",
    mouthWidth: 2,
    particleCount: 4,
    breathingScale: [1, 1.03, 1],
    wingSpread: 0.9,
  },
  neutral: {
    auraColor: "rgba(161, 196, 253, 0.4)",
    primaryColor: "rgba(161, 196, 253, 0.6)",
    secondaryColor: "rgba(191, 216, 255, 0.5)",
    wingColor: "rgba(161, 196, 253, 0.3)",
    eyeColor: "rgba(100, 149, 237, 0.7)",
    animationSpeed: 4,
    antennaAngle: 0,
    floatY: [-2, 2, -2],
    wingFlap: 1.5,
    glowIntensity: 0.5,
    bodyScale: 1.0,
    eyeShape: { rx: 14, ry: 18 },
    mouthCurve: "M 95 115 Q 100 118 105 115",
    mouthWidth: 2.5,
    particleCount: 5,
    breathingScale: [1, 1.03, 1],
    wingSpread: 1.0,
  },
};

const Pet = ({ mood }: PetProps) => {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [earTwitch, setEarTwitch] = useState(0);
  const [showMoodBubble, setShowMoodBubble] = useState(false);
  const [wingFlutter, setWingFlutter] = useState(0);
  const [particlePositions, setParticlePositions] = useState<Array<{x: number, y: number, delay: number, type: string}>>([]);
  const [bodyPulse, setBodyPulse] = useState(1);
  const [eyebrowAngle, setEyebrowAngle] = useState(0);

  const config = moodConfig[mood] || moodConfig.neutral;
  
  useEffect(() => {
    if (mood) {
        setShowMoodBubble(true);
        const timer = setTimeout(() => {
            setShowMoodBubble(false);
        }, 2500);
        return () => clearTimeout(timer);
    }
  }, [mood]);

  // Enhanced eye movement with mood-based patterns
  useEffect(() => {
    const interval = setInterval(() => {
      const intensity = mood === "curious" ? 12 : mood === "excited" ? 15 : 8;
      setEyeOffset({
        x: (Math.random() - 0.5) * intensity,
        y: (Math.random() - 0.5) * (intensity * 0.7),
      });
    }, mood === "excited" ? 1500 : mood === "thoughtful" ? 4000 : 2500);
    return () => clearInterval(interval);
  }, [mood]);

  // Mood-responsive blinking
  useEffect(() => {
    const blinkFrequency = mood === "excited" ? 1500 : mood === "sad" ? 6000 : 3000;
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), mood === "sad" ? 200 : 150);
    }, Math.random() * blinkFrequency + 2000);
    return () => clearInterval(blinkInterval);
  }, [mood]);

  // Enhanced ear/antennae movement
  useEffect(() => {
    const twitchInterval = setInterval(() => {
      const intensity = mood === "excited" ? 40 : mood === "curious" ? 25 : 15;
      setEarTwitch((Math.random() - 0.5) * intensity);
      setTimeout(() => setEarTwitch(0), 300);
    }, Math.random() * 4000 + 2000);
    return () => clearInterval(twitchInterval);
  }, [mood]);

  // Dynamic wing flutter
  useEffect(() => {
    const flutterInterval = setInterval(() => {
      const intensity = mood === "excited" ? 30 : mood === "playful" ? 25 : 20;
      setWingFlutter((Math.random() - 0.5) * intensity);
      setTimeout(() => setWingFlutter(0), 400);
    }, Math.random() * 2500 + 1500);
    return () => clearInterval(flutterInterval);
  }, [mood]);

  // Enhanced particle system
  useEffect(() => {
    const generateParticles = () => {
      const particles = Array.from({ length: config.particleCount }, (_, i) => ({
        x: 100 + (Math.random() - 0.5) * 120,
        y: 100 + (Math.random() - 0.5) * 120,
        delay: i * 0.3,
        type: mood === "excited" ? "star" : mood === "happy" ? "heart" : mood === "mad" ? "spark" : "dot",
      }));
      setParticlePositions(particles);
    };
    
    generateParticles();
    const particleInterval = setInterval(generateParticles, 2500);
    return () => clearInterval(particleInterval);
  }, [mood, config.particleCount]);

  // Body breathing animation
  useEffect(() => {
    const breatheInterval = setInterval(() => {
      setBodyPulse(prev => prev === 1 ? 1.02 : 1);
    }, mood === "excited" ? 1000 : mood === "thoughtful" ? 3000 : 2000);
    return () => clearInterval(breatheInterval);
  }, [mood]);

  // Eyebrow expressions
  useEffect(() => {
    const baseAngle = mood === "mad" ? -15 : mood === "curious" ? -5 : mood === "sad" ? 10 : 0;
    setEyebrowAngle(baseAngle);
  }, [mood]);

  return (
    <motion.div
      className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 relative overflow-visible"
      initial={{ y: 0, rotate: -5, scale: 0.8 }}
      animate={{
        y: config.floatY,
        rotate: [-5, 0, -5],
        x: [-1, 1, -1],
        scale: config.bodyScale,
      }}
      transition={{
        duration: config.animationSpeed,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "reverse",
      }}
    >
      <MoodBubble mood={mood} visible={showMoodBubble} />
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        style={{ overflow: "visible" }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ 
          scale: config.breathingScale,
          opacity: 1 
        }}
        transition={{ 
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" },
          opacity: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
        }}
      >
        <defs>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="bodyGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
            <stop offset="40%" stopColor="rgba(255, 255, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
          </radialGradient>

          <radialGradient id="moodGradient" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor={config.secondaryColor} />
            <stop offset="50%" stopColor={config.primaryColor} />
            <stop offset="100%" stopColor={config.auraColor} />
          </radialGradient>

          <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.wingColor} stopOpacity="0.9" />
            <stop offset="50%" stopColor={config.primaryColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={config.wingColor} stopOpacity="0.3" />
          </linearGradient>

          <filter id="glass" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0" result="translucent" />
            <feMerge>
              <feMergeNode in="translucent" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Enhanced Outer Aura with Pulsing */}
        <motion.ellipse
          cx="100"
          cy="100"
          rx="120"
          ry="115"
          fill={config.auraColor}
          filter="url(#strongGlow)"
          animate={{ 
            scale: [1, 1.1],
            opacity: [config.glowIntensity, config.glowIntensity * 0.6],
            rotate: 360
          }}
          transition={{ 
            scale: { duration: config.animationSpeed * 0.4, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" },
            opacity: { duration: config.animationSpeed * 0.6, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        />

        {/* Enhanced Wings with Dynamic Movement */}
        <motion.g
          animate={{ 
            rotate: wingFlutter,
            scale: config.wingSpread 
          }}
          style={{ transformOrigin: "100px 120px" }}
        >
          <motion.path
            d="M 60 120 Q 20 80 15 130 Q 25 160 50 155 Q 60 140 60 120"
            fill="url(#wingGradient)"
            filter="url(#glass)"
            animate={{ 
              rotate: [-8, 0],
              scale: [1, 1.05],
              opacity: [0.8, 1]
            }}
            transition={{ 
              duration: config.wingFlap,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
          <motion.path
            d="M 140 120 Q 180 80 185 130 Q 175 160 150 155 Q 140 140 140 120"
            fill="url(#wingGradient)"
            filter="url(#glass)"
            animate={{ 
              rotate: [8, 0],
              scale: [1, 1.05],
              opacity: [0.8, 1]
            }}
            transition={{ 
              duration: config.wingFlap,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
          
          {/* Wing Details */}
          <motion.path
            d="M 45 125 Q 35 115 30 125"
            stroke={config.primaryColor}
            strokeWidth="2"
            fill="transparent"
            opacity="0.6"
            animate={{ opacity: [0.4, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M 155 125 Q 165 115 170 125"
            stroke={config.primaryColor}
            strokeWidth="2"
            fill="transparent"
            opacity="0.6"
            animate={{ opacity: [0.4, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          />
        </motion.g>

        {/* Enhanced Antennae with Orbs */}
        <motion.g
          animate={{ rotate: earTwitch }}
          style={{ transformOrigin: "50% 100%" }}
        >
          <motion.path
            d="M 75 65 Q 55 20 85 30"
            stroke={config.primaryColor}
            strokeWidth="4"
            fill="transparent"
            filter="url(#innerGlow)"
            animate={{ rotate: config.antennaAngle }}
            transition={{ duration: 0.5 }}
          />
          <motion.circle
            cx="85"
            cy="30"
            r="5"
            fill={config.primaryColor}
            filter="url(#strongGlow)"
            animate={{ 
              scale: [1, 1.4],
              opacity: [0.8, 1] 
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
          
          <motion.path
            d="M 125 65 Q 145 20 115 30"
            stroke={config.primaryColor}
            strokeWidth="4"
            fill="transparent"
            filter="url(#innerGlow)"
            animate={{ rotate: config.antennaAngle }}
            transition={{ duration: 0.5 }}
          />
          <motion.circle
            cx="115"
            cy="30"
            r="5"
            fill={config.primaryColor}
            filter="url(#strongGlow)"
            animate={{ 
              scale: [1, 1.4],
              opacity: [0.8, 1] 
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse",
              delay: 0.7 
            }}
          />
        </motion.g>

        {/* Main Body with Enhanced Glass Effect */}
        <motion.ellipse
          cx="100"
          cy="105"
          rx="58"
          ry="53"
          fill="url(#bodyGradient)"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="2"
          filter="url(#glass)"
          animate={{ scale: bodyPulse }}
          transition={{ duration: 0.3 }}
        />

        {/* Enhanced Mood-colored Inner Glow */}
        <motion.ellipse
          cx="100"
          cy="105"
          rx="52"
          ry="47"
          fill="url(#moodGradient)"
          filter="url(#innerGlow)"
          animate={{ 
            opacity: [0.6, 0.9],
            scale: [1, 1.02]
          }}
          transition={{ 
            duration: config.animationSpeed * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
        />

        {/* Enhanced Facial Markings */}
        <motion.path
          d="M 100 80 Q 115 88 110 95 Q 100 88 90 95 Q 85 88 100 80"
          fill={config.primaryColor}
          opacity="0.5"
          animate={{ 
            opacity: [0.3, 0.7],
            scale: [1, 1.1]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
        />

        {/* Eyebrows */}
        <motion.g
          animate={{ rotate: eyebrowAngle }}
          style={{ transformOrigin: "85px 95px" }}
        >
          <motion.path
            d="M 75 92 Q 85 88 95 92"
            stroke={config.primaryColor}
            strokeWidth="3"
            strokeLinecap="round"
            fill="transparent"
            opacity="0.7"
          />
        </motion.g>
        <motion.g
          animate={{ rotate: -eyebrowAngle }}
          style={{ transformOrigin: "115px 95px" }}
        >
          <motion.path
            d="M 105 92 Q 115 88 125 92"
            stroke={config.primaryColor}
            strokeWidth="3"
            strokeLinecap="round"
            fill="transparent"
            opacity="0.7"
          />
        </motion.g>

        {/* Enhanced Eyes with Mood-based Shapes */}
        <g>
          {/* Eye Background */}
          <motion.ellipse
            cx="85"
            cy="100"
            rx={config.eyeShape.rx}
            ry={config.eyeShape.ry}
            fill="rgba(255, 255, 255, 0.95)"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="2"
            filter="url(#glass)"
            animate={{ scaleY: isBlinking ? 0.1 : 1 }}
            transition={{ duration: 0.07 }}
          />
          <motion.ellipse
            cx="115"
            cy="100"
            rx={config.eyeShape.rx}
            ry={config.eyeShape.ry}
            fill="rgba(255, 255, 255, 0.95)"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="2"
            filter="url(#glass)"
            animate={{ scaleY: isBlinking ? 0.1 : 1 }}
            transition={{ duration: 0.07 }}
          />
          
          {/* Mood-colored Iris */}
          <motion.circle
            cx="85"
            cy="100"
            r="9"
            fill={config.eyeColor}
            animate={{ x: eyeOffset.x, y: eyeOffset.y }}
            transition={{ duration: 0.8, ease: "backInOut" }}
          />
          <motion.circle
            cx="115"
            cy="100"
            r="9"
            fill={config.eyeColor}
            animate={{ x: eyeOffset.x, y: eyeOffset.y }}
            transition={{ duration: 0.8, ease: "backInOut" }}
          />
          
          {/* Dynamic Pupils */}
          <motion.circle
            cx="85"
            cy="100"
            r={mood === "excited" ? "3" : mood === "mad" ? "2" : "4"}
            fill="#0f172a"
            animate={{ x: eyeOffset.x, y: eyeOffset.y }}
            transition={{ duration: 0.8, ease: "backInOut" }}
          />
          <motion.circle
            cx="115"
            cy="100"
            r={mood === "excited" ? "3" : mood === "mad" ? "2" : "4"}
            fill="#0f172a"
            animate={{ x: eyeOffset.x, y: eyeOffset.y }}
            transition={{ duration: 0.8, ease: "backInOut" }}
          />
          
          {/* Enhanced Eye Highlights */}
          <motion.ellipse
            cx="87"
            cy="96"
            rx="3"
            ry="4"
            fill="rgba(255, 255, 255, 0.9)"
            animate={{ 
              x: eyeOffset.x, 
              y: eyeOffset.y,
              scale: mood === "excited" ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              x: { duration: 0.8, ease: "backInOut" },
              y: { duration: 0.8, ease: "backInOut" },
              scale: { duration: 1, repeat: Infinity }
            }}
          />
          <motion.ellipse
            cx="117"
            cy="96"
            rx="3"
            ry="4"
            fill="rgba(255, 255, 255, 0.9)"
            animate={{ 
              x: eyeOffset.x, 
              y: eyeOffset.y,
              scale: mood === "excited" ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              x: { duration: 0.8, ease: "backInOut" },
              y: { duration: 0.8, ease: "backInOut" },
              scale: { duration: 1, repeat: Infinity }
            }}
          />
        </g>

        {/* Enhanced Mouth with Mood Expressions */}
        <motion.path
          d={config.mouthCurve}
          stroke={config.primaryColor}
          strokeWidth={config.mouthWidth}
          strokeLinecap="round"
          fill="transparent"
          opacity="0.8"
          animate={{ 
            scale: mood === "excited" ? [1, 1.1] : mood === "happy" ? [1, 1.05] : 1,
            opacity: [0.7, 0.9]
          }}
          transition={{ 
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }
          }}
        />

        {/* Enhanced Nose */}
        <motion.ellipse
          cx="100"
          cy="108"
          rx="3"
          ry="4"
          fill={config.primaryColor}
          opacity="0.7"
          animate={{ 
            scale: [1, 1.15],
            opacity: [0.6, 0.8]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
        />

        {/* Enhanced Cheek Blush */}
                 <motion.ellipse
           cx="65"
           cy="110"
           rx="8"
           ry="6"
           fill={config.primaryColor}
           opacity="0.4"
           animate={{ 
             opacity: mood === "happy" || mood === "excited" || mood === "playful" ? [0.3, 0.6] : 0.1,
             scale: mood === "excited" ? [1, 1.2] : 1
           }}
           transition={{ 
             opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" },
             scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }
           }}
         />
                 <motion.ellipse
           cx="135"
           cy="110"
           rx="8"
           ry="6"
           fill={config.primaryColor}
           opacity="0.4"
           animate={{ 
             opacity: mood === "happy" || mood === "excited" || mood === "playful" ? [0.3, 0.6] : 0.1,
             scale: mood === "excited" ? [1, 1.2] : 1
           }}
           transition={{ 
             opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" },
             scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }
           }}
         />

        {/* Enhanced Particle System */}
        {particlePositions.map((particle, index) => (
          <motion.g key={index}>
            {particle.type === "heart" && (
              <motion.path
                d={`M ${particle.x} ${particle.y} C ${particle.x-2} ${particle.y-2}, ${particle.x-4} ${particle.y}, ${particle.x} ${particle.y+3} C ${particle.x+4} ${particle.y}, ${particle.x+2} ${particle.y-2}, ${particle.x} ${particle.y}`}
                fill="rgba(255, 105, 180, 0.8)"
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: [0, 360],
                  y: [0, -20]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: particle.delay 
                }}
              />
            )}
            {particle.type === "star" && (
              <motion.path
                d={`M ${particle.x} ${particle.y-3} L ${particle.x+1} ${particle.y-1} L ${particle.x+3} ${particle.y} L ${particle.x+1} ${particle.y+1} L ${particle.x} ${particle.y+3} L ${particle.x-1} ${particle.y+1} L ${particle.x-3} ${particle.y} L ${particle.x-1} ${particle.y-1} Z`}
                fill="rgba(255, 215, 0, 0.9)"
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 2, 0],
                  rotate: [0, 180],
                  y: [0, -15]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: particle.delay 
                }}
              />
            )}
            {particle.type === "spark" && (
              <motion.circle
                cx={particle.x}
                cy={particle.y}
                r="2"
                fill="rgba(255, 69, 0, 0.9)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 2, 0],
                  x: [(Math.random() - 0.5) * 40],
                  y: [(Math.random() - 0.5) * 40]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: particle.delay 
                }}
              />
            )}
            {particle.type === "dot" && (
              <motion.circle
                cx={particle.x}
                cy={particle.y}
                r="1.5"
                fill="rgba(255, 255, 255, 0.8)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.8, 0],
                  y: [0, -25]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: particle.delay 
                }}
              />
            )}
          </motion.g>
        ))}

        

        {/* Mood-specific Additional Elements */}
        {mood === "excited" && (
          <motion.circle
            cx="100"
            cy="105"
            r="60"
            stroke={config.primaryColor}
            strokeWidth="2"
            fill="transparent"
            opacity="0.3"
                         animate={{ 
               scale: [1, 1.3],
               opacity: [0, 0.5]
             }}
             transition={{ 
               duration: 2,
               repeat: Infinity,
               ease: "easeOut",
               repeatType: "reverse"
             }}
          />
        )}
        
        {mood === "thoughtful" && (
          <motion.g>
                         <motion.circle cx="120" cy="80" r="2" fill={config.primaryColor} opacity="0.6"
               animate={{ scale: [0, 1] }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0 }} />
             <motion.circle cx="130" cy="75" r="1.5" fill={config.primaryColor} opacity="0.5"
               animate={{ scale: [0, 1] }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }} />
             <motion.circle cx="125" cy="85" r="1" fill={config.primaryColor} opacity="0.4"
               animate={{ scale: [0, 1] }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 1 }} />
          </motion.g>
        )}
      </motion.svg>
    </motion.div>
  );
};

export default Pet; 