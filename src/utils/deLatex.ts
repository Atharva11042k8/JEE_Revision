
/**
 * Converts a LaTeX-formatted string into more readable plain text with actual math symbols (not just "a^2" but "a²", etc).
 */

// Map for superscript numbers and letters
const superscriptMap: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾", "n": "ⁿ", "i": "ⁱ"
};
// Map for subscript numbers and some letters
const subscriptMap: Record<string, string> = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
  "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎", "a": "ₐ", "e": "ₑ", "h": "ₕ", "i": "ᵢ", "j": "ⱼ", "k": "ₖ", "l": "ₗ", "m": "ₘ", "n": "ₙ", "o": "ₒ", "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", "u": "ᵤ", "v": "ᵥ", "x": "ₓ"
};

// Helper to convert text to superscript (when possible)
function toSuperscript(text: string): string {
  return text.split("").map(char => superscriptMap[char] ?? char).join("");
}
// Helper to convert text to subscript (when possible)
function toSubscript(text: string): string {
  return text.split("").map(char => subscriptMap[char] ?? char).join("");
}

const latexReplacements: [RegExp, string | ((substring: string, ...args: string[]) => string)][] = [
  // \text{}
  [/(\\text\s*\{([^}]*)\})/g, (_, __, txt) => txt],

  // Fractions: \frac{a}{b} → (a)/(b)
  [/\\frac\{([^}]*)\}\{([^}]*)\}/g, (_, num, den) => `(${num})/(${den})`],

  // superscripts a^{b}
  [
    /([a-zA-Z0-9])\^\{([^}]+)\}/g,
    (_, base, sup) => {
      // If it's a short number or variable, convert to superscript
      if (/^[0-9+\-()n]+$/.test(sup)) {
        return base + toSuperscript(sup);
      }
      return base + "^" + sup;
    }
  ],

  // simple superscripts a^b
  [
    /([a-zA-Z0-9])\^([0-9n+\-\(\)])/g,
    (_, base, sup) => base + toSuperscript(sup)
  ],

  // subscripts a_{b}
  [
    /([a-zA-Z0-9])_\{([^}]+)\}/g,
    (_, base, sub) => {
      if (/^[0-9a-z+\-()]+$/.test(sub)) { return base + toSubscript(sub);}
      return base + "_" + sub;
    }
  ],

  // simple subscripts a_b
  [
    /([a-zA-Z0-9])_([0-9a-z])/g,
    (_, base, sub) => base + toSubscript(sub)
  ],

  // sin, cos, tan, etc. (add more as needed)
  [/\\sin/g, "sin"],
  [/\\cos/g, "cos"],
  [/\\tan/g, "tan"],

  // Greek letter replacements (expand as needed)
  [/\\theta/g, "θ"],
  [/\\alpha/g, "α"],
  [/\\beta/g, "β"],
  [/\\gamma/g, "γ"],
  [/\\lambda/g, "λ"],
  [/\\mu/g, "μ"],
  [/\\pi/g, "π"],

  // Sum, integral
  [/\\sum/g, "∑"],
  [/\\int/g, "∫"],

  // Relations, operators
  [/\\geq/g, "≥"],
  [/\\leq/g, "≤"],
  [/\\pm/g, "±"],
  [/\\times/g, "×"],
  [/\\cdot/g, "⋅"],
  [/\\infty/g, "∞"],

  // Arrows
  [/\\rightarrow/g, "→"],
  [/\\leftarrow/g, "←"],
  [/\\to/g, "→"],

  // Modifiers/remove \\, \[
  [/\\\\/g, " "],
  [/\\\[/g, ""],
  [/\\\]/g, ""],
  [/\\ /g, " "],

  // Curly braces that remain
  [/\{|\}/g, ""],
  // Remove dollar signs if present
  [/\$/g, ""]
];

// Main export function
export function deLatex(input: string): string {
  let out = input || "";
  latexReplacements.forEach(([regex, replacement]) => {
    out = out.replace(regex, replacement as any);
  });
  // Clean up double spaces
  out = out.replace(/\s\s+/g, " ");
  return out.trim();
}
