
import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LatexProps {
  latex: string;
  block?: boolean;
  className?: string;
}

const Latex: React.FC<LatexProps> = ({ latex, block = false, className = "" }) => {
  let html = "";
  try {
    html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: block,
      output: "html"
    });
  } catch (e) {
    html = `<span style="color: red;">Invalid KaTeX: ${latex}</span>`;
  }
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Latex;
