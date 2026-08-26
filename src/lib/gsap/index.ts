import gsap from 'gsap';

export { gsap };

/**
 * Animacion de entrada del Holocron.
 * Fase 1: aparece y desaparece el texto intro.
 * Fase 2: el logo aparece desde el infinito.
 */
export function playHolocronIntro(): void {
  gsap.set('.intro-text', { opacity: 0, y: 10 });
  gsap.set('.main-title', { opacity: 0, scale: 0.05 });

  const tl = gsap.timeline({ delay: 0.3 });

  tl.to('.intro-text', {
    opacity: 1,
    y: 0,
    duration: 2.2,
    ease: 'power2.inOut',
  })
    .to('.intro-text', {
      opacity: 0,
      y: -10,
      duration: 1.2,
      delay: 1.8,
      ease: 'power2.inOut',
    })
    .to(
      '.main-title',
      {
        opacity: 1,
        scale: 1,
        duration: 3.5,
        ease: 'expo.out',
      },
      '-=0.3',
    );
}
