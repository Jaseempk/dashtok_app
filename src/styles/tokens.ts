export const colors = {
  // Primary - Cyan/Teal
  primary: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#00f5d4', // Main accent
    600: '#00d4b8',
    700: '#0891b2',
    800: '#155e75',
    900: '#164e63',
  },

  // Secondary - Orange (streaks)
  secondary: {
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
  },

  // Backgrounds
  background: {
    primary: '#0a0f1a',
    secondary: '#111827',
    tertiary: '#1f2937',
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    muted: '#6b7280',
  },

  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',

  // Borders
  border: {
    subtle: '#1f2937',
    default: '#374151',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter',
    mono: 'JetBrainsMono',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  /*
   * Typography Scale (Tailwind classes):
   * - Display:  text-4xl font-bold    → Welcome headlines, celebration
   * - Title:    text-3xl font-bold    → Screen titles, questions
   * - Heading:  text-xl font-semibold → Section headers, card titles
   * - Body:     text-base             → Default content
   * - Small:    text-sm               → Secondary text, descriptions
   * - Caption:  text-xs               → Labels, hints, metadata
   */
} as const;
