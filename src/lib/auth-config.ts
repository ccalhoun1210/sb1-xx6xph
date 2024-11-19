export const authConfig = {
  // Redirect URLs
  redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
  
  // OAuth providers
  providers: {
    github: {
      enabled: false,
    },
    google: {
      enabled: false,
    },
    facebook: {
      enabled: false,
    },
  },

  // Email settings
  emailAuth: {
    enabled: true,
    verifyEmail: true,
  },

  // Phone settings
  phoneAuth: {
    enabled: true,
    verifyPhone: true,
  },

  // Password settings
  passwordAuth: {
    enabled: true,
    minLength: 8,
    requireNumbers: true,
    requireSpecialChars: true,
  },
};