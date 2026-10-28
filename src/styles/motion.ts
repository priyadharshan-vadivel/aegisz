// JS mirror of the motion tokens in theme.css (--ae-dur-*, --ae-ease-out-expo). Keep in sync.
export const dur = { fast: 0.16, base: 0.32, slow: 0.7 } as const;
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const spring = { type: "spring", stiffness: 520, damping: 28, mass: 0.6 } as const;
export const stagger = 0.08;
