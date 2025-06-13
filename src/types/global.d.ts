
declare global {
  interface Window {
    renderMathInElement: (element: Element | HTMLDocument, options?: any) => void;
    gsap: any;
    anime: any;
  }
  
  const gsap: any;
  const anime: any;
}

export {};
