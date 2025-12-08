import { Colors } from "./Colors";

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  round: 9999,
};

export const Typography = {
  size: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  weight: {
    regular: "400",
    medium: "500",
    bold: "700",
  },
};

export const TextVariants = {
  title: {
    color: Colors.dark.text,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold as "700",
  },
  cardTitle: {
    color: Colors.dark.text,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold as "700",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  text: {
    color: Colors.dark.text,
    fontSize: Typography.size.md,
  },
  textInput: {
    color: Colors.dark.text,
    fontSize: Typography.size.md,
  },
  chip: {
    color: Colors.dark.text,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium as "500",
  },
  chipSectionTitle: {
    color: Colors.dark.textSecondary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium as "500",
  },
};
