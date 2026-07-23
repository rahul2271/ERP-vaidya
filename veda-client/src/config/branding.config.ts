// Global Branding Configuration - Update here to customize across the entire platform
// This file controls all branding elements: colors, logos, names, watermarks, and subscription features

// Global Branding Configuration - Update here to customize across the entire platform
// This file controls all branding elements: colors, logos, names, watermarks, and subscription features

export type SubscriptionTier = 'basic' | 'professional' | 'premium' | 'enterprise';

export interface BrandingConfig {
  // Brand Identity
  brandName: string;
  tagline: string;
  logo: {
    url: string;
    width: number;
    height: number;
  };

  // Color Palette - All customizable for white-label
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    success: string;
    warning: string;
    error: string;
    neutral: string;
    // Additional accent colors for UI variety
    info: string;
    muted: string;
  };

  // Typography
  fonts: {
    headingFont: string;
    bodyFont: string;
  };

  // Watermark Settings (shown on Basic tier)
  watermark: {
    enabled: boolean;
    text: string;
    opacity: number;
    position: 'top-left' | 'center' | 'diagonal';
    fontSize: number;
  };

  // Company Info
  company: {
    name: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    gst?: string;
  };

  // Subscription-based Feature Visibility
  features: {
    telemedicine: boolean;
    analytics: boolean;
    insurance: boolean;
    loyalty: boolean;
    aiOptimization: boolean;
  };

  // Subscription Tier Configuration
  subscriptionTier: SubscriptionTier;
}

// Default VAIDYA branding (shown when using VAIDYA platform)
export const DEFAULT_BRANDING: BrandingConfig = {
  brandName: 'VAIDYA ERP',
  tagline: 'Integrated Healthcare Management System',
  logo: {
    url: '/logo.png',
    width: 120,
    height: 40,
  },
  colors: {
    primary: '#3b82f6',
    primaryDark: '#1e40af',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: '#ffffff',
    foreground: '#0f172a',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    neutral: '#64748b',
    info: '#06b6d4',
    muted: '#94a3b8',
  },
  fonts: {
    headingFont: "'Poppins', sans-serif",
    bodyFont: "'Poppins', sans-serif",
  },
  watermark: {
    enabled: true,
    text: 'Powered by VAIDYA ERP',
    opacity: 0.15,
    position: 'diagonal',
    fontSize: 48,
  },
  company: {
    name: 'VAIDYA ERP',
    email: 'hello@vaidyaerp.com',
    phone: '+91-7009646377',
    website: 'www.vaidyaerp.in',
    address: 'India',
    gst: 'GSTXXXXXXXXXX',
  },
  features: {
    telemedicine: true,
    analytics: true,
    insurance: true,
    loyalty: true,
    aiOptimization: true,
  },
  subscriptionTier: 'basic',
};

// White-label template (customize for your business)
export const WHITE_LABEL_TEMPLATE: BrandingConfig = {
  brandName: 'Your Clinic Name', // CHANGE THIS
  tagline: 'Your Clinic Tagline', // CHANGE THIS
  logo: {
    url: '/logo/your-clinic-logo.svg', // CHANGE THIS
    width: 120,
    height: 40,
  },
  colors: {
    primary: '#3b82f6', // CHANGE THIS
    primaryDark: '#1e40af',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: '#ffffff',
    foreground: '#0f172a',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    neutral: '#64748b',
    info: '#06b6d4',
    muted: '#94a3b8',
  },
  fonts: {
    headingFont: "'Poppins', sans-serif",
    bodyFont: "'Poppins', sans-serif",
  },
  watermark: {
    enabled: false, // Disabled for white-label
    text: '',
    opacity: 0,
    position: 'center',
    fontSize: 48,
  },
  company: {
    name: 'Your Clinic Name',
    email: 'info@yourclinic.com',
    phone: '+91-XXXXXXXXXX',
    website: 'www.yourclinic.com',
    address: 'Your Address',
    gst: 'Your GST Number',
  },
  features: {
    telemedicine: true,
    analytics: true,
    insurance: true,
    loyalty: true,
    aiOptimization: true,
  },
  subscriptionTier: 'premium',
};

/**
 * Get current branding configuration
 * Returns WHITE_LABEL_TEMPLATE if subscriptionTier is 'premium' or 'enterprise'
 * Otherwise returns DEFAULT_BRANDING with watermark
 */
export function getBrandingConfig(subscriptionTier?: SubscriptionTier): BrandingConfig {
  const isWhiteLabel = subscriptionTier === 'premium' || subscriptionTier === 'enterprise';
  const config = isWhiteLabel ? WHITE_LABEL_TEMPLATE : DEFAULT_BRANDING;
  config.subscriptionTier = subscriptionTier || 'basic';
  return config;
}

/**
 * Feature access control based on subscription tier
 */
export const TIER_FEATURES: Record<SubscriptionTier, Set<string>> = {
  basic: new Set([
    'patient_management',
    'appointment_scheduling',
    'basic_reports',
    'staff_management',
  ]),
  professional: new Set([
    'patient_management',
    'appointment_scheduling',
    'advanced_reports',
    'staff_management',
    'inventory_management',
    'pharmacy_billing',
    'analytics',
  ]),
  premium: new Set([
    'patient_management',
    'appointment_scheduling',
    'advanced_reports',
    'staff_management',
    'inventory_management',
    'pharmacy_billing',
    'analytics',
    'telemedicine',
    'insurance_claims',
    'loyalty_program',
    'white_label',
  ]),
  enterprise: new Set([
    'patient_management',
    'appointment_scheduling',
    'advanced_reports',
    'staff_management',
    'inventory_management',
    'pharmacy_billing',
    'analytics',
    'telemedicine',
    'insurance_claims',
    'loyalty_program',
    'white_label',
    'ai_optimization',
    'multi_hospital',
    'api_access',
  ]),
};

/**
 * Update white-label branding (only for premium/enterprise users)
 */
export function updateWhiteLabelBranding(updates: Partial<BrandingConfig>) {
  Object.assign(WHITE_LABEL_TEMPLATE, updates);
  // 🚀 FIX: Prevent Next.js from crashing on the server
  if (typeof window !== 'undefined') {
    localStorage.setItem('whiteLabelBranding', JSON.stringify(WHITE_LABEL_TEMPLATE));
  }
}

/**
 * Load saved white-label branding from localStorage
 */
export function loadWhiteLabelBranding() {
  // 🚀 FIX: Prevent Next.js from crashing on the server
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('whiteLabelBranding');
    if (saved) {
      try {
        Object.assign(WHITE_LABEL_TEMPLATE, JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse branding config", error);
      }
    }
  }
}

// 🚀 FIX: Removed the automatic 'loadWhiteLabelBranding()' call here. 
// It must only be called inside a useEffect or component body.
