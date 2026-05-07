import type { Variants } from "framer-motion";

export const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

export const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.18,
    },
  },
};

export const userReviewViewport = {
  once: true,
  amount: 0.18,
  margin: "0px 0px -12% 0px",
} as const;
