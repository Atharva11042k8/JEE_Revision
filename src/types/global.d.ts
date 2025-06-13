
declare global {
  interface Window {
    renderMathInElement: (element: HTMLElement, options?: any) => void;
    katex: any;
  }
}

export {};
