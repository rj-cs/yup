tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        lab: {
          bg: 'var(--bg-primary)',
          elevated: 'var(--bg-elevated)',
          subtle: 'var(--bg-subtle)',
          border: 'var(--border-color)',
          borderHover: 'var(--border-hover)',
          text: 'var(--text-primary)',
          muted: 'var(--text-muted)',
          accent: '#10B981' // Emerald terminal accent
        }
      }
    }
  }
};
