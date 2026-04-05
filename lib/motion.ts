import type { Transition, Variants } from "framer-motion";

export const easeStandard: Transition["ease"] = [0.4, 0, 0.2, 1];
export const easeEnter: Transition["ease"] = [0, 0, 0.2, 1];
export const easeExit: Transition["ease"] = [0.4, 0, 1, 1];

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 600,
  damping: 40,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};
