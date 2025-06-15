
/**
 * Simple function to convert LaTeX markup to readable plain text for major use cases.
 * Not a full parser! Handles \text{}, fractions, superscripts, subscripts, greek, and basic commands.
 */
const latexReplacements: [RegExp, string | ((substring: string, ...args: string[]) => string)][] = [
  // \text{}
  [/(\\text\s*\{([^}]*)\})/g, (_, __, txt) => txt],
  // Fractions
  [/\\frac\{([^}]*)\}\{([^}]*)\}/g, (_, num, den) => `(${num})/(${den})`],
  // superscripts a^{b}
  [/([a-zA-Z0-9])\^\{([^}]+)\}/g, (_, base, sup) => `${base}^${sup}`],
  // subscripts a_{b}
  [/([a-zA-Z0-9])_\{([^}]+)\}/g, (_, base, sub) => `${base}_${sub}`],
  // sin, cos, tan, etc. (add more as needed)
  [/\\sin/g, "sin"],
  [/\\cos/g, "cos"],
  [/\\tan/g, "tan"],
  // greek letters (some examples)
  [/\\theta/g, "θ"],
  [/\\alpha/g, "α"],
  [/\\beta/g, "β"],
  // Sum, integrals, etc.
  [/\\sum/g, "sum"],
  [/\\int/g, "∫"],
  // Pi
  [/\\pi/g, "π"],
  // Equals, approx, ge/le
  [/\\geq/g, "≥"],
  [/\\leq/g, "≤"],
  [/\\pm/g, "±"],
  [/\\times/g, "×"],
  // Remove \
  [/\\\\/g, " "],
  [/\\ /g, " "],
  // Curly braces that remain
  [/\{|\}/g, ""],
  // Remove dollar signs if present
  [/\$/g, ""],
];

export function deLatex(input: string): string {
  let out = input || "";
  latexReplacements.forEach(([regex, replacement]) => {
    out = out.replace(regex, replacement as any);
  });
  // Clean up double spaces
  out = out.replace(/\s\s+/g, " ");
  return out.trim();
}
