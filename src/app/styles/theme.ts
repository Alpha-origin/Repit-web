export const theme = {
  colors: {
    primary: "#007bff",
    white: "#ffffff",
    brand: {
      blue: "#1877f2",
      blueLight: "#9ec7ff",
      blueAction: "#0066ff",
    },
    text: {
      default: "#333333",
      strong: "#050505",
      muted: "#6b8fc1",
    },
    surface: {
      background: "#ffffff",
      muted: "#f7f8fa",
      subtle: "#f4f4f5",
      blueLight: "#eef6ff",
      blueSoft: "#dfe9f8",
      blueMuted: "#d5e3f7",
    },
    shadow: {
      blue: "rgba(0, 102, 255, 0.25)",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.375rem",
    xl: "1.75rem",
    xxl: "3.75rem",
  },
  fontFamily: {
    calSans: "'Cal Sans', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    pretendard: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    wavvePado: "'Wave', sans-serif",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1.25rem",
    pill: "6.25rem",
    circle: "50%",
  },
};

export type Theme = typeof theme;
