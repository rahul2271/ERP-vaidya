/**
 * Responsive Design Utilities
 * - Breakpoints aligned with Tailwind CSS
 * - Mobile-first approach
 */

export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs}px)`,
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
} as const;

/**
 * Touch-friendly spacing for mobile
 */
export const touchTargets = {
  small: 32, // 8px * 4
  medium: 44, // minimum tap target
  large: 48,
  xlarge: 56,
} as const;

/**
 * Responsive padding scale
 */
export const responsivePadding = {
  xs: 'px-3 py-2',      // mobile
  sm: 'px-4 py-3',      // tablet
  md: 'px-6 py-4',      // desktop
  lg: 'px-8 py-5',      // large desktop
} as const;

/**
 * Common responsive class combinations
 */
export const responsiveClasses = {
  // Grid layouts
  gridCols: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  gridColsDual: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  gridColsSingle: 'grid-cols-1 md:grid-cols-2',
  
  // Spacing
  sectionGap: 'gap-4 sm:gap-5 md:gap-6 lg:gap-8',
  itemGap: 'gap-3 sm:gap-4 md:gap-5',
  
  // Typography responsive
  pageTitle: 'text-2xl sm:text-3xl md:text-4xl font-bold',
  sectionTitle: 'text-xl sm:text-2xl md:text-3xl font-bold',
  cardTitle: 'text-lg sm:text-xl font-semibold',
  
  // Container padding
  containerPadding: 'px-4 sm:px-6 md:px-8 lg:px-0',
  pagePadding: 'p-4 sm:p-6 md:p-8',
} as const;

/**
 * Sidebar responsive utilities
 */
export const sidebarResponsive = {
  desktop: 'hidden md:flex md:w-64 lg:w-72',
  mobile: 'fixed inset-0 z-50 md:hidden',
  mainContentDesktop: 'md:ml-64 lg:ml-72',
  overlay: 'fixed inset-0 bg-black/50 md:hidden',
} as const;
