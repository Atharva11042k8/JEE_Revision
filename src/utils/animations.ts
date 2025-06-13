
declare const gsap: any;
declare const anime: any;

export class AnimationEngine {
  // GSAP Animations
  static fadeInUp(element: string | Element, delay: number = 0) {
    gsap.fromTo(element, 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.9
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.8,
        delay,
        ease: "power2.out"
      }
    );
  }

  static slideInFromLeft(element: string | Element, delay: number = 0) {
    gsap.fromTo(element,
      {
        x: -100,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        delay,
        ease: "power2.out"
      }
    );
  }

  static slideInFromRight(element: string | Element, delay: number = 0) {
    gsap.fromTo(element,
      {
        x: 100,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        delay,
        ease: "power2.out"
      }
    );
  }

  static scaleIn(element: string | Element, delay: number = 0) {
    gsap.fromTo(element,
      {
        scale: 0,
        opacity: 0,
        rotation: 180
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.7,
        delay,
        ease: "back.out(1.7)"
      }
    );
  }

  static typeWriter(element: string | Element, text: string, delay: number = 0) {
    gsap.to(element, {
      duration: 2,
      delay,
      text: {
        value: text,
        delimiter: ""
      },
      ease: "none"
    });
  }

  static morphBackground() {
    gsap.to(".morph-bg", {
      duration: 4,
      morphSVG: "M0,0 Q50,100 100,0 L100,100 L0,100 Z",
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });
  }

  // Anime.js Animations
  static pulseGlow(element: string) {
    anime({
      targets: element,
      boxShadow: [
        { value: '0 0 20px rgba(59, 130, 246, 0.5)' },
        { value: '0 0 40px rgba(147, 51, 234, 0.8)' },
        { value: '0 0 20px rgba(59, 130, 246, 0.5)' }
      ],
      duration: 2000,
      loop: true,
      easing: 'easeInOutSine'
    });
  }

  static floatingParticles() {
    const particles = document.querySelectorAll('.floating-particle');
    
    particles.forEach((particle, index) => {
      anime({
        targets: particle,
        translateY: [
          { value: -20, duration: 1000 },
          { value: 20, duration: 1000 }
        ],
        translateX: [
          { value: -10, duration: 1500 },
          { value: 10, duration: 1500 }
        ],
        opacity: [
          { value: 0.3, duration: 1000 },
          { value: 0.8, duration: 1000 }
        ],
        scale: [
          { value: 0.8, duration: 1200 },
          { value: 1.2, duration: 1200 }
        ],
        delay: index * 200,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine'
      });
    });
  }

  static cardFlip(element: string | Element) {
    anime({
      targets: element,
      rotateY: [0, 180],
      duration: 600,
      easing: 'easeInOutExpo',
      complete: () => {
        anime({
          targets: element,
          rotateY: [180, 360],
          duration: 600,
          easing: 'easeInOutExpo'
        });
      }
    });
  }

  static buttonPress(element: string | Element) {
    anime({
      targets: element,
      scale: [1, 0.95, 1],
      duration: 200,
      easing: 'easeInOutQuad'
    });
  }

  static liquidFill(element: string | Element) {
    anime({
      targets: element,
      background: [
        { value: 'linear-gradient(0deg, #3b82f6 0%, transparent 0%)' },
        { value: 'linear-gradient(0deg, #3b82f6 100%, transparent 100%)' }
      ],
      duration: 1000,
      easing: 'easeInOutQuart'
    });
  }

  static staggerText(element: string) {
    anime({
      targets: `${element} .char`,
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 1200,
      delay: anime.stagger(100),
      easing: 'easeOutExpo'
    });
  }
}
