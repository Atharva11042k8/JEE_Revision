
/**
 * Converts a LaTeX-formatted string into more readable plain text with actual math symbols (not just "a^2" but "a²", fractions like ½, actual square root √, etc).
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
// Map for common unicode vulgar fractions
const vulgarFractions: Record<string, string> = {
  "1/2": "½", "1/3": "⅓", "2/3": "⅔", "1/4": "¼", "3/4": "¾", "1/5": "⅕", "2/5": "⅖", "3/5": "⅗", "4/5": "⅘",
  "1/6": "⅙", "5/6": "⅚", "1/8": "⅛", "3/8": "⅜", "5/8": "⅝", "7/8": "⅞"
};

// Helper to convert text to superscript (when possible)
function toSuperscript(text: string): string {
  return text.split("").map(char => superscriptMap[char] ?? char).join("");
}
// Helper to convert text to subscript (when possible)
function toSubscript(text: string): string {
  return text.split("").map(char => subscriptMap[char] ?? char).join("");
}

// Helper to convert certain fractions to unicode vulgar, otherwise fallback
function toVulgarFraction(numer: string, denom: string): string {
  const cleaned = numer.trim() + "/" + denom.trim();
  if (vulgarFractions[cleaned]) return vulgarFractions[cleaned];
  // fallback: (a)/(b)
  return `(${numer})/(${denom})`;
}

const latexReplacements: [RegExp, string | ((substring: string, ...args: string[]) => string)][] = [
  // \text{}
  [/(\\text\s*\{([^}]*)\})/g, (_, __, txt) => txt],

  // \frac{a}{b} ⟶ unicode vulgar fraction or fallback
  [/\\frac\{ *([0-9]+) *\}\{ *([0-9]+) *\}/g, (_, num, denom) => toVulgarFraction(num, denom)],
  // fallback for fractions: (numerator)/(denominator)
  [/\\frac\{([^}]*)\}\{([^}]*)\}/g, (_, num, den) => `(${deLatex(num)})/(${deLatex(den)})`],

  // \sqrt{stuff} ⟶ √stuff (no parenthesis if just variable/number)
  [/\\sqrt\{([^}]*)\}/g, (_, radicand) => {
    // If radicand is simple (var/number), no need for parens
    const val = deLatex(radicand.trim());
    if (/^[a-zA-Z0-9⁰¹²³⁴⁵⁶⁷⁸⁹\+\-\*\/\s]+$/.test(val)) {
      return `√${val}`;
    }
    return `√(${val})`;
  }],

  // nth roots: \sqrt[n]{x} → ⁿ√x
  [/\\sqrt\[([^\]]+)\]\{([^\}]+)\}/g, (_, n, radicand) => `${toSuperscript(deLatex(n))}√${deLatex(radicand)}`],

  // Superscripts: a^{b}
  [
    /([a-zA-Z0-9])\^\{([^}]+)\}/g,
    (_, base, sup) => {
      if (/^[0-9+\-()n]+$/.test(sup)) {
        return base + toSuperscript(sup);
      }
      return base + "^" + deLatex(sup);
    }
  ],
  // Simple superscript: a^b
  [
    /([a-zA-Z0-9])\^([0-9n+\-\(\)])/g,
    (_, base, sup) => base + toSuperscript(sup)
  ],

  // Subscript: a_{b}
  [
    /([a-zA-Z0-9])_\{([^}]+)\}/g,
    (_, base, sub) => {
      if (/^[0-9a-z+\-()]+$/.test(sub)) {
        return base + toSubscript(sub);
      }
      return base + "_" + deLatex(sub);
    }
  ],
  // Simple subscript: a_b
  [
    /([a-zA-Z0-9])_([0-9a-z])/g,
    (_, base, sub) => base + toSubscript(sub)
  ],

  // sin, cos, tan, etc.
  [/\\sin/g, "sin"],
  [/\\cos/g, "cos"],
  [/\\tan/g, "tan"],
  [/\\cot/g, "cot"],
  [/\\sec/g, "sec"],
  [/\\csc/g, "csc"],

  // Greek letters
  [/\\theta/g, "θ"],
  [/\\alpha/g, "α"],
  [/\\beta/g, "β"],
  [/\\gamma/g, "γ"],
  [/\\lambda/g, "λ"],
  [/\\mu/g, "μ"],
  [/\\pi/g, "π"],
  [/\\phi/g, "φ"],
  [/\\rho/g, "ρ"],
  [/\\sigma/g, "σ"],
  [/\\Delta/g, "Δ"],
  [/\\delta/g, "δ"],
  [/\\Omega/g, "Ω"],
  [/\\omega/g, "ω"],

  // Sum, integral, product
  [/\\sum/g, "∑"],
  [/\\int/g, "∫"],
  [/\\prod/g, "∏"],

  // Infinity
  [/\\infty/g, "∞"],

  // Relations, operators
  [/\\geq/g, "≥"],
  [/\\leq/g, "≤"],
  [/\\neq/g, "≠"],
  [/\\approx/g, "≈"],
  [/\\pm/g, "±"],
  [/\\mp/g, "∓"],
  [/\\times/g, "×"],
  [/\\cdot/g, "⋅"],
  [/\\div/g, "÷"],
  [/\\degree/g, "°"],

  // Dots
  [/\\ldots/g, "…"],

  // Arrows
  [/\\rightarrow/g, "→"],
  [/\\leftarrow/g, "←"],
  [/\\to/g, "→"],
  [/\\Rightarrow/g, "⇒"],
  [/\\Leftarrow/g, "⇐"],

  // Spaces and newlines
  [/\\\\/g, " "],
  [/\\\[/g, ""],
  [/\\\]/g, ""],
  [/\\,/g, " "],
  [/\\ /g, " "],

  // Remove curly braces (that remain after above)
  [/\{|\}/g, ""],
  // Remove dollar (inline math)
  [/\$/g, ""],
];

export function deLatex(input: string): string {
  let out = input || "";
  // Always run multiple passes, as replacement may reveal more LaTeX
  // Limit to 3 passes to avoid infinite loops
  for (let i = 0; i < 3; ++i) {
    latexReplacements.forEach(([regex, replacement]) => {
      out = out.replace(regex, replacement as any);
    });
  }
  // Clean up double spaces
  out = out.replace(/\s\s+/g, " ");
  return out.trim();
}

