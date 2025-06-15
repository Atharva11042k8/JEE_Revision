
/**
 * Converts a LaTeX-formatted string into more readable plain text with actual math symbols (², √, ½, Greek, etc).
 */
const superscriptMap: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾", "n": "ⁿ", "i": "ⁱ"
};
const subscriptMap: Record<string, string> = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
  "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
  "a": "ₐ", "e": "ₑ", "h": "ₕ", "i": "ᵢ", "j": "ⱼ", "k": "ₖ", "l": "ₗ", "m": "ₘ", "n": "ₙ",
  "o": "ₒ", "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", "u": "ᵤ", "v": "ᵥ", "x": "ₓ"
};
const vulgarFractions: Record<string, string> = {
  "1/2": "½", "1/3": "⅓", "2/3": "⅔", "1/4": "¼", "3/4": "¾", "1/5": "⅕", "2/5": "⅖", "3/5": "⅗", "4/5": "⅘",
  "1/6": "⅙", "5/6": "⅚", "1/8": "⅛", "3/8": "⅜", "5/8": "⅝", "7/8": "⅞"
};

// Helper to convert text to superscript (when possible)
function toSuperscript(text: string): string {
  return text.split("").map(char => superscriptMap[char] ?? char).join("");
}
function toSubscript(text: string): string {
  return text.split("").map(char => subscriptMap[char] ?? char).join("");
}
function toVulgarFraction(numer: string, denom: string): string {
  const key = numer.trim() + "/" + denom.trim();
  if (vulgarFractions[key]) return vulgarFractions[key];
  // fallback: (a)/(b)
  return `(${numer})/(${denom})`;
}
function simpleRoot(x: string) {
  // If simple variable/number, no parentheses; else, wrap
  if (/^[a-zA-Z0-9⁰¹²³⁴⁵⁶⁷⁸⁹\+\-\*\/\s]+$/.test(x)) return "√" + x;
  return "√(" + x + ")";
}

// -- Custom manual \frac parsing logic (robust for your requirements)
function parseFracAll(str: string): string {
  if (!str) return "";

  // 1. \frac{A}{B}
  str = str.replace(/\\frac\s*\{\s*([^\{\}]+)\s*\}\s*\{\s*([^\{\}]+)\s*\}/g, (_, num, denom) =>
    toVulgarFraction(deLatex(num), deLatex(denom))
  );

  // 2. \fracA|B| or \fracA/B
  str = str.replace(/\\frac([A-Za-z0-9\^_\{\}\\\[\]\(\)]+)[|\/]([A-Za-z0-9\^_\{\}\\\[\]\(\)]+)/g, (_, num, denom) =>
    toVulgarFraction(deLatex(num), deLatex(denom))
  );

  // 3. \fracAB   (single-character or vector etc)
  str = str.replace(/\\frac\s*([A-Za-z0-9\u20D7\u0302\u0304])\s*([A-Za-z0-9\u20D7\u0302\u0304])/g, (_, num, denom) =>
    toVulgarFraction(deLatex(num), deLatex(denom))
  );
  str = str.replace(/\\frac([A-Za-z0-9\u20D7\u0302\u0304])([A-Za-z0-9\u20D7\u0302\u0304])/g, (_, num, denom) =>
    toVulgarFraction(deLatex(num), deLatex(denom))
  );

  // 4. Fallback: \frac X Y   (space-separated two tokens)
  str = str.replace(/\\frac\s+([^\s{}]+)\s+([^\s{}]+)/g, (_, num, denom) =>
    toVulgarFraction(deLatex(num), deLatex(denom))
  );

  // If any remaining \frac expression, show as (num)/(denom)
  str = str.replace(/\\frac\s*\{?([^{}\s]+)\}?\s*\{?([^{}\s]+)\}?/g, (_, num, denom) =>
    `(${deLatex(num)})/(${deLatex(denom)})`
  );

  return str;
}

// Main conversion
const replacements: [RegExp, string | ((...args: string[]) => string)][] = [
  // \\text{...}
  [/(\\text\s*\{([^}]*)\})/g, (_, __, txt) => txt],

  // FRACTION HANDLING (handled by parseFracAll below, so this is skipped here)

  // Square root and nth root
  [/\\sqrt\{([^}]*)\}/g, (_, r) => simpleRoot(deLatex(r.trim()))],
  [/\\sqrt\[([^\]]+)\]\{([^\}]+)\}/g, (_, n, radicand) => `${toSuperscript(deLatex(n))}√${deLatex(radicand)}`],

  // Superscript (power)
  [/([a-zA-Z0-9])\^\{([^}]+)\}/g, (_, base, pow) => base + toSuperscript(deLatex(pow))],
  [/([a-zA-Z0-9])\^([0-9n+\-\(\)])/g, (_, base, pow) => base + toSuperscript(pow)],

  // Subscript
  [/([a-zA-Z0-9])_\{([^}]+)\}/g, (_, base, sub) => base + toSubscript(deLatex(sub))],
  [/([a-zA-Z0-9])_([0-9a-zA-Z])/g, (_, base, sub) => base + toSubscript(sub)],

  // Vector, hat and overline
  [/\\vec\{([A-Za-z])\}/g, (_, v) => v + "\u20D7"], // a⃗
  [/\\vec ([A-Za-z])/g, (_, v) => v + "\u20D7"],
  [/\\hat\{([A-Za-z])\}/g, (_, v) => v + "\u0302"], // â
  [/\\bar\{([A-Za-z])\}/g, (_, v) => v + "\u0304"], // ā

  // Greek letters (add more as needed)
  [/\\theta/g, "θ"], [/\\Theta/g, "Θ"],
  [/\\alpha/g, "α"], [/\\beta/g, "β"], [/\\gamma/g, "γ"], [/\\Gamma/g, "Γ"],
  [/\\lambda/g, "λ"], [/\\mu/g, "μ"],
  [/\\pi/g, "π"], [/\\phi/g, "φ"],
  [/\\rho/g, "ρ"], [/\\sigma/g, "σ"],
  [/\\Delta/g, "Δ"], [/\\delta/g, "δ"],
  [/\\Omega/g, "Ω"], [/\\omega/g, "ω"],

  // Operators
  [/\\sum/g, "∑"], [/\\int/g, "∫"], [/\\prod/g, "∏"],
  [/\\infty/g, "∞"],
  [/\\geq/g, "≥"], [/\\leq/g, "≤"], [/\\neq/g, "≠"], [/\\approx/g, "≈"], [/\\pm/g, "±"], [/\\mp/g, "∓"],
  [/\\times/g, "×"], [/\\cdot/g, "⋅"], [/\\div/g, "÷"], [/\\degree/g, "°"],

  // Dots
  [/\\ldots/g, "…"],

  // Arrows
  [/\\rightarrow/g, "→"], [/\\leftarrow/g, "←"], [/\\to/g, "→"], [/\\Rightarrow/g, "⇒"], [/\\Leftarrow/g, "⇐"],

  // Trigonometric functions
  [/\\sin/g, "sin"], [/\\cos/g, "cos"], [/\\tan/g, "tan"], [/\\cot/g, "cot"], [/\\sec/g, "sec"], [/\\csc/g, "csc"],

  // Misc symbols
  [/\\le/g, "≤"], [/\\ge/g, "≥"],

  // Remove \left, \right, \rm, etc.
  [/\\left\s*/g, ""], [/\\right\s*/g, ""], [/\\rm\s*/g, ""],

  // Remove braces and double dollar/mathmode markup
  [/\{|\}/g, ""],
  [/\$\$?/g, ""],

  // Spaces and newlines (for inline PDFs etc)
  [/\\\\/g, " "], [/\n/g, " "],
  [/\\,/g, " "], [/\\ /g, " "],

  // Clean up stray \ or math-mode
  [/\\ /g, " "]
];

export function deLatex(input: string): string {
  if (!input) return "";
  let out = input;

  // HANDLE ALL \frac FORMS MANUALLY FIRST (before main replacements)
  out = parseFracAll(out);

  // Repeat a few times to cover nested cases
  for (let i = 0; i < 3; ++i) {
    replacements.forEach(([regex, rep]) => {
      out = out.replace(regex, rep as any);
    });
  }
  return out.replace(/\s\s+/g, " ").trim();
}
