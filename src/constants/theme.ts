export const COLORS = {
  primary: '#FF4081', // Vibrant "Girly Pop" Pink
  secondary: '#E040FB', // Bright Purple/Lavender accent
  background: '#FFF5F9', // Very soft blush pink background
  card: '#FFFFFF',
  textDark: '#4A0E4E', // Deep purple text instead of black (softer, girl-coded)
  textLight: '#885885', // Muted purple-grey
  white: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.85)', // Milkier glass
  glassBorder: 'rgba(255, 192, 203, 0.5)', // Pink tinted border
  success: '#00E676', // Bright mint green
  warning: '#FF80AB', // Soft hot pink for alerts
  sentinelPulsing: '#F50057', // Deep pink pulse
  sentinelStressed: '#D50000', // Red, but keep it in tone
  error: '#FF1744',
  text: '#4A0E4E', // Alias for main text
  gray: '#9E779F', // Purple-tinted gray
};

export const FONTS = {
  h1: { fontFamily: 'System', fontSize: 32, lineHeight: 38, fontWeight: '800' as const, letterSpacing: -0.5 }, // Chunkier headers
  h2: { fontFamily: 'System', fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  h3: { fontFamily: 'System', fontSize: 18, lineHeight: 24, fontWeight: '700' as const },
  body1: { fontFamily: 'System', fontSize: 16, lineHeight: 24, fontWeight: '500' as const }, // Slightly bolder body
  body2: { fontFamily: 'System', fontSize: 14, lineHeight: 20 },
  body3: { fontFamily: 'System', fontSize: 12, lineHeight: 18 },
};


export const SPACING = {
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  s: 12,
  m: 20,
  l: 28,
  xl: 40, // Super rounded "pill" shapes
  circle: 9999,
};

export const SHADOWS = {
  soft: {
    shadowColor: '#FF4081', // Pink shadows!
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  glass: {
    shadowColor: '#E040FB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};
