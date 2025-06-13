
declare const gsap: any;

export class AnimationEngine {
  // Simple GSAP Animations only
  static fadeInUp(element: string | Element, delay: number = 0) {
    gsap.fromTo(element, 
      { 
        opacity: 0, 
        y: 30
      },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.6,
        delay,
        ease: "power2.out"
      }
    );
  }

  static slideInFromLeft(element: string | Element, delay: number = 0) {
    gsap.fromTo(element,
      {
        x: -50,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        delay,
        ease: "power2.out"
      }
    );
  }

  static scaleIn(element: string | Element, delay: number = 0) {
    gsap.fromTo(element,
      {
        scale: 0.9,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        delay,
        ease: "power2.out"
      }
    );
  }

  static buttonPress(element: string | Element) {
    gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });
  }
}
