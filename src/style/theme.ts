export const theme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    background: "#ffffff",
    text: "#333333",
    error: "#ff0000",
    white: "#ffffff",
    landingGradientTop: "#041b63",
    landingGradientMiddle: "#0a3ea8",
    landingGradientAccent: "#2f8fff",
    landingGradientBottom: "#cfe6ff",
    landingLogo: "#7ec0ff",
    landingLogin: "#1f6fff",
    landingLoginHover: "#175de0",
    landingBadge: "rgba(255, 255, 255, 0.15)",
    landingSubtitle: "rgba(255, 255, 255, 0.8)",
    landingButtonHover: "rgba(255, 255, 255, 0.1)",
    landingGlowSoft: "rgba(255, 255, 255, 0.08)",
    landingGlowStrong: "rgba(255, 255, 255, 0.18)",
  },
  fontSize: {
    small: "12px",
    medium: "16px",
    large: "24px",
    badgeFont: "12px",
    navFont: "13px",
    subtitleFont: "14px",
    logoFont: "30px",
    bigFont: "60px",
  },
  fontFamily: {
    pretendard:
      "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    wavvePado: "'Wave', sans-serif",
  },
};

export type Theme = typeof theme;
