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
    landing: {
      gradientTop: "#041b63",
      gradientMiddle: "#0a3ea8",
      gradientAccent: "#2f8fff",
      gradientBottom: "#cfe6ff",
      logo: "#7ec0ff",
      login: "#1f6fff",
      loginHover: "#175de0",
      mainTitle: "#A8D8FF",
      badge: "rgba(255, 255, 255, 0.15)",
      subtitle: "rgba(255, 255, 255, 0.8)",
      buttonHover: "rgba(255, 255, 255, 0.1)",
      glowSoft: "rgba(255, 255, 255, 0.08)",
      glowStrong: "rgba(255, 255, 255, 0.18)",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "22px",
    xl: "28px",
    xxl: "60px",
  },
  fontFamily: {
    pretendard: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    wavvePado: "'Wave', sans-serif",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "20px",
    pill: "100px",
    circle: "50%",
  },
};

export type Theme = typeof theme;
