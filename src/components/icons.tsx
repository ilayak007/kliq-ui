/**
 * Social Media Icons
 * 
 * Reusable SVG components for TikTok, Instagram, Snapchat, and YouTube icons.
 * Each icon is displayed inside a rounded rectangle and uses brand-specific colors.
 * 
 * @author Ilayaraja Kasirajan
 * @created [19-Feb-2025]
 * @lastModified [23-Feb-2025]
 */

import React from "react";

/**
 * TikTokIcon Component
 * Renders the TikTok logo inside a rounded black square.
 */
export const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#000000" /> {/* Background */}
    <path fill="#25F4EE" d="M9 21c-2.8 0-5-2.2-5-5s2.2-5 5-5v3c-1.1 0-2 .9-2 2s.9 2 2 2v3z" /> {/* TikTok Blue */}
    <path fill="#FE2C55" d="M17 9c-2.8 0-5-2.2-5-5h3c0 1.1.9 2 2 2v3z" /> {/* TikTok Red */}
    <path fill="white" d="M12 4h3c0 2.8 2.2 5 5 5v3c-2.8 0-5-2.2-5-5h-3v10h-3v-3h2V4z" /> {/* TikTok White */}
  </svg>
);

/**
 * InstagramIcon Component
 * Renders the Instagram logo inside a rounded black square.
 */
export const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#000000" /> {/* Background */}
    <circle cx="12" cy="12" r="5" stroke="#E1306C" strokeWidth="2" /> {/* Main circle */}
    <circle cx="17" cy="7" r="1.2" fill="#E1306C" /> {/* Camera dot */}
  </svg>
);

/**
 * SnapchatIcon Component
 * Renders the Snapchat ghost inside a rounded black square.
 */
export const SnapchatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#000000" /> {/* Background */}
    <path d="M12 4c2 0 4 2 4 5s-1 4-2 5c0 1 1 1 1 2-1 1-3 2-3 2s-2-1-3-2c0-1 1-1 1-2-1-1-2-2-2-5s2-5 4-5z" fill="#FFFC00" /> {/* Snapchat Ghost */}
  </svg>
);

/**
 * YouTubeIcon Component
 * Renders the YouTube play button inside a rounded black square.
 */
export const YouTubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#000000" /> {/* Background */}
    <polygon points="10,8 16,12 10,16" fill="#FF0000" /> {/* Play button */}
  </svg>
);
