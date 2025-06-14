
// Minimal animations for a clean interface

declare const gsap: any;

export class AnimationEngine {
  // FadeInUp for card/selection transitions
  static fadeInUp(element: string | Element, delay: number = 0) {
    gsap.fromTo(element, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay, ease: "power2.out" }
    );
  }
  // ScaleIn for splash effect
  static scaleIn(element: string | Element, delay: number = 0) {
    gsap.fromTo(element,
      { scale: 0.96, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, delay, ease: "power2.out" }
    );
  }
}
