/** Home: GSAP entrance/scroll depth and Motion hover feedback. Static HTML first. */
import { motion } from './common.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, hover } from 'motion';

gsap.registerPlugin(ScrollTrigger);
let context;
let removeHover = () => {};
const feedback = new Map();
function buildMotion(stopped) {
  removeHover();
  feedback.forEach(animation => animation.cancel());
  feedback.clear();
  context?.revert();
  context = null;
  document.querySelectorAll('.path-card').forEach(el => el.style.removeProperty('transform'));
  if (stopped) return;
  context = gsap.context(() => {
    gsap.from('.chapter-copy h1 > *', { y: 25, opacity: 0, duration: .85, stagger: .09, ease: 'power3.out', clearProps: 'all' });
    gsap.from('.chapter-lead, .chapter-copy .hero-actions', { y: 14, duration: .6, delay: .3, stagger: .1, clearProps: 'all' });
    gsap.from('.portrait-frame', { y: 25, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'opacity' });
    const mm = gsap.matchMedia();
    mm.add('(min-width: 801px)', () => {
      gsap.to('[data-hero-depth]', { y: 32, rotate: -1, ease: 'none', scrollTrigger: { trigger: '.chapter-hero', start: 'top top', end: 'bottom top', scrub: .7 } });
      gsap.to('[data-hero-book]', { y: -32, rotateY: 8, rotate: -4, ease: 'none', scrollTrigger: { trigger: '.chapter-hero', start: 'top top', end: 'bottom top', scrub: .7 } });
      gsap.to('[data-hero-note]', { y: -18, rotate: -3, ease: 'none', scrollTrigger: { trigger: '.chapter-hero', start: 'top top', end: 'bottom top', scrub: .7 } });
    });
    return () => mm.revert();
  });
  const run = (el, y) => {
    if (motion.stopped) return;
    feedback.get(el)?.stop();
    const animation = animate(el, { y }, { type: 'spring', stiffness: 240, damping: 24 });
    feedback.set(el, animation);
  };
  removeHover = hover('.path-card', el => {
    run(el, -5);
    return () => run(el, 0);
  });
}
motion.onChange(buildMotion);
buildMotion(motion.stopped);
document.fonts.ready.then(() => ScrollTrigger.refresh());
addEventListener('pagehide', () => { removeHover(); feedback.forEach(a => a.cancel()); context?.revert(); });

addEventListener('pageshow', event => { if (event.persisted) buildMotion(motion.stopped); });
