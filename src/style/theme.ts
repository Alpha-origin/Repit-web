// color is not used yet, but it will be used in the future when we implement dark mode and light mode.
export const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#333333',
    error: '#ff0000',
  },
  fontSize: {
    small: '12px',
    medium: '16px',
    large: '24px',
  },
};


export type Theme = typeof theme;