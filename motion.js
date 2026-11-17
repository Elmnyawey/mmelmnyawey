/* Lightweight portfolio motion, inspired by modern interactive portfolios.
   No external dependency; accessible and honors prefers-reduced-motion. */
(()=>{
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
 document.documentElement.classList.add("motion-ready");
 const getTargets=()=>document.querySelectorAll(
   ".hero-copy > *, .hero-art, .metrics-strip > div, .section-heading, .section-headline, .section-body, .expertise-card, .project-card, .timeline-item, .contact-panel, .service-card, .course-card, .article-card, .section-index, .page-hero > *, .toolset, .pill-row, .filter-controls"
 );
 function init(){
  const targets=getTargets();
  targets.forEach((el,i)=>{
   el.classList.add("motion-reveal");
   if(reduced){el.classList.add("motion-visible");return;}
   if(el.closest(".hero")||el.closest(".page-hero")){
    el.style.setProperty("--motion-delay",Math.min((i%9)*75,550)+"ms");
   }
  });
  if(!reduced&&"IntersectionObserver" in window){
   const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("motion-visible");observer.unobserve(entry.target);}});
   },{rootMargin:"0px 0px -35px 0px",threshold:.08});
   targets.forEach(el=>observer.observe(el));
  }else targets.forEach(el=>el.classList.add("motion-visible"));
  if(!reduced&&matchMedia("(hover: hover) and (pointer: fine)").matches){
   document.querySelectorAll(".project-card, .expertise-card, .service-card, .course-card, .article-card").forEach(card=>{
    card.classList.add("interactive-card");
    let raf=0;
    card.addEventListener("pointermove",e=>{
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        card.style.setProperty("--mx",(x*100).toFixed(2)+"%");
        card.style.setProperty("--my",(y*100).toFixed(2)+"%");
        card.style.setProperty("--rx",((.5-y)*3).toFixed(2)+"deg");
        card.style.setProperty("--ry",((x-.5)*3).toFixed(2)+"deg");
      });
    },{passive:true});
    card.addEventListener("pointerleave",()=>{cancelAnimationFrame(raf);card.style.setProperty("--rx","0deg");card.style.setProperty("--ry","0deg");});
   });
   document.querySelectorAll(".button").forEach(btn=>{
    btn.addEventListener("pointermove",e=>{
      const r=btn.getBoundingClientRect();
      btn.style.setProperty("--bx",(e.clientX-r.left)+"px");
      btn.style.setProperty("--by",(e.clientY-r.top)+"px");
    },{passive:true});
   });
  }
  const bar=document.createElement("div");bar.className="scroll-progress";bar.setAttribute("aria-hidden","true");document.body.append(bar);
  let queued=false;
  function progress(){queued=false;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);bar.style.transform="scaleX("+Math.min(1,Math.max(0,scrollY/max))+")";}
  addEventListener("scroll",()=>{if(!queued){queued=true;requestAnimationFrame(progress);}},{passive:true});progress();
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
