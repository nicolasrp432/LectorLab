/** Home: a scroll-led story. All chapters remain readable without animation. */
import { motion } from './common.js';
import './narrative.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { animate, hover } from 'motion';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
let context;
let removeHover = () => {};
const feedback = new Map();
function buildMotion(stopped) {
  removeHover();
  feedback.forEach(animation => animation.cancel());
  feedback.clear();
  context?.revert();
  context = null;
  document.querySelectorAll('.story-dots span').forEach(el => el.classList.remove('is-current'));
  document.querySelectorAll('.path-card').forEach(el => el.style.removeProperty('transform'));
  if (stopped) return;
  context = gsap.context(() => {
    gsap.from('.chapter-copy h1 > *', { y: 25, opacity: 0, duration: .85, stagger: .09, ease: 'power3.out', clearProps: 'all' });
    gsap.from('.chapter-lead, .chapter-copy .hero-actions', { y: 14, duration: .6, delay: .3, stagger: .1, clearProps: 'all' });
    gsap.from('.peter-cutout', { y: 25, duration: 1, ease: 'power3.out', clearProps: 'all' });
    gsap.to('.marquee-track', { xPercent: -22, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: .7 } });
    const dots = [...document.querySelectorAll('.story-dots span')];
    gsap.utils.toArray('[data-story-step]').forEach((step, index) => {
      gsap.to(step, { '--step-progress': 1, ease: 'none', scrollTrigger: {
        trigger: step, start: 'top 75%', end: 'bottom 50%', scrub: .4,
        onToggle: self => { if (self.isActive) dots.forEach((dot, i) => dot.classList.toggle('is-current', i === index)); },
      } });
    });
    const path = document.getElementById('rocket-path');
    const pathLength = path.getTotalLength();
    const flight = { trigger: '.rocket-stage', start: 'top 75%', end: 'bottom 40%', scrub: .65, invalidateOnRefresh: true };
    gsap.set('#rocket', { opacity: 1 });
    gsap.fromTo('#rocket',
      { motionPath: { path, align: path, alignOrigin: [.5, .5], autoRotate: 90, start: 0, end: 0 } },
      { motionPath: { path, align: path, alignOrigin: [.5, .5], autoRotate: 90, start: 0, end: 1 }, ease: 'none', scrollTrigger: flight });
    gsap.fromTo(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength },
      { strokeDashoffset: 0, ease: 'none', scrollTrigger: { ...flight } });
    const mm = gsap.matchMedia();
    mm.add('(min-width: 801px)', () => {
      gsap.to('[data-hero-depth]', { y: 32, rotate: -1, ease: 'none', scrollTrigger: { trigger: '.chapter-hero', start: 'top top', end: 'bottom top', scrub: .7 } });
      gsap.to('[data-hero-note]', { y: -18, rotate: -3, ease: 'none', scrollTrigger: { trigger: '.chapter-hero', start: 'top top', end: 'bottom top', scrub: .7 } });
      gsap.to('.possibility-orbit', { rotate: 25, ease: 'none', scrollTrigger: { trigger: '.chapter-hero', start: 'top top', end: 'bottom top', scrub: .7 } });
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
