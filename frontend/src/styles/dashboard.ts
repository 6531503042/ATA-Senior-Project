export const dashboardStyles = {
  // Color palette
  colors: {
    primary: {
      main: '#1E40AF',
      light: '#3B82F6',
      dark: '#1E3A8A',
      gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
    },
    secondary: {
      main: '#059669',
      light: '#10B981',
      dark: '#047857',
      gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    },
    accent: {
      main: '#7C3AED',
      light: '#8B5CF6',
      dark: '#6D28D9',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
    },
    background: {
      main: '#F8FAFC',
      gradient: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      light: '#94A3B8',
    },
  },

  // Card styles
  card: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    hoverShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },

  // Typography
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: {
      fontSize: '32px',
      fontWeight: '700',
      lineHeight: '1.2',
    },
    h2: {
      fontSize: '24px',
      fontWeight: '600',
      lineHeight: '1.3',
    },
    h3: {
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '1.4',
    },
    body: {
      fontSize: '16px',
      lineHeight: '1.5',
    },
    small: {
      fontSize: '14px',
      lineHeight: '1.4',
    },
  },

  // Transitions
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.45s ease',
  },

  // Chart styles
  chart: {
    tooltip: {
      background: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(0, 0, 0, 0.05)',
    },
    gradients: {
      blue: ['#1E40AF', '#3B82F6'],
      green: ['#059669', '#10B981'],
      purple: ['#7C3AED', '#8B5CF6'],
    },
  },

  // Layout
  layout: {
    maxWidth: '1440px',
    sidebarWidth: '280px',
    topbarHeight: '64px',
    containerPadding: '24px',
  },
};
