/* Bilingual portfolio: shared public content in data/site.json; Arabic in data/ar.json. */
const arabic = document.documentElement.lang.toLowerCase().startsWith("ar");
const root = arabic ? "../" : "./";
const yearNode = document.querySelector("#year"); if (yearNode) yearNode.textContent = new Date().getFullYear();
const menu = document.querySelector(".menu-toggle"), nav = document.querySelector(".site-nav");
if (menu && nav) {
 menu.addEventListener("click", () => {const opened=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(opened));});
 nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false");}));
}
document.querySelectorAll(".filter-button").forEach(button=>button.addEventListener("click",()=>{
 document.querySelectorAll(".filter-button").forEach(x=>{const active=x===button;x.classList.toggle("active",active);x.setAttribute("aria-pressed",String(active));});
 document.querySelectorAll(".project-card").forEach(card=>{card.hidden=button.dataset.filter!=="all"&&!card.dataset.category.split(" ").includes(button.dataset.filter);});
}));
const make=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
const add=(parent,tag,cls,txt)=>{const n=make(tag,cls,txt);parent.append(n);return n};
const safe=(s)=>{try{const u=new URL(s);return ["https:","mailto:","tel:"].includes(u.protocol)?u.toString():null}catch{return null}};
const link=(text,url,cls)=>{const u=safe(url);if(!u)return null;const a=make("a",cls,text);a.href=u;if(u.startsWith("https:")){a.target="_blank";a.rel="noopener noreferrer";}return a};
async function loadContent(){
 let data,localized={};
 try {
  const r=await fetch(root+"data/site.json",{cache:"no-cache"});if(!r.ok)throw new Error("Portfolio data unavailable");data=await r.json();
  if(arabic){const a=await fetch(root+"data/ar.json",{cache:"no-cache"});if(a.ok)localized=await a.json();}
 } catch(e){console.warn(e);return;}
 const p={...(data.profile||{}),...(localized.profile||{})}, labels={
  developer:"Developer",employer:"Employer",role:"My role",period:"Period",type:"Project type",myWork:"MY CONTRIBUTION",sources:"PUBLIC PROJECT SOURCES",image:"IMAGE",contact:"GET IN TOUCH",downloadCv:"Download CV ↓",
  collab:"For project collaboration, send a brief scope and timeline.",editTitle:"Owner editing: Change portfolio projects, photos and contact details from one file.",editLink:"Edit portfolio data ↗",
  ...(localized.labels||{})
 };
 const brand=document.querySelector(".brand-title");if(brand&&p.displayName)brand.textContent=arabic?p.displayName:p.displayName.toUpperCase();
 const intro=document.querySelector(".hero-intro");if(intro&&p.heroIntro)intro.textContent=p.heroIntro;
 const localizedProjects=new Map((localized.projects||[]).map(x=>[x.id,x]));
 const cards=[...document.querySelectorAll(".project-card")];
 (data.projects||[]).forEach((base,i)=>{
  const card=cards[i];if(!card)return;
  const translated=localizedProjects.get(base.id)||{};
  const pr={...base,...translated,sources:base.sources?.map((s,j)=>({...s,title:translated.sources?.[j]?.title||s.title}))};
  const title=card.querySelector(".project-content h3");if(title)title.textContent=pr.title;
  const summary=card.querySelector(".project-content>p");if(summary)summary.textContent=pr.overview||"";
  const location=card.querySelector(".project-kicker");if(location)location.textContent=arabic?pr.location:pr.location.toUpperCase();
  const tags=card.querySelector(".project-tools");if(tags){tags.replaceChildren();(pr.tools||[]).forEach(x=>add(tags,"span","",x));}
  const box=card.querySelector(".project-content");if(!box)return;
  const meta=make("div","project-meta");
  [[labels.developer,pr.developer],[labels.employer,pr.employer],[labels.role,pr.role],[labels.period,pr.period],[labels.type,pr.type]].forEach(([k,v])=>{if(v)add(meta,"div","",k+": "+v)});
  box.insertBefore(meta,tags);
  if(pr.myWork?.length){add(box,"h4","detail-title",labels.myWork);const ul=make("ul","project-highlights");pr.myWork.forEach(item=>add(ul,"li","",item));box.append(ul);}
  if(pr.sources?.length){const sourceBox=make("div","source-links");add(sourceBox,"h4","detail-title",labels.sources);pr.sources.forEach(s=>{const a=link(s.title+" ↗",s.url,"project-source");if(a)sourceBox.append(a);});box.append(sourceBox);}
  const visual=card.querySelector(".project-visual");
  if(visual&&pr.image&&safe(pr.image)){
    const photo=make("img","project-photo");photo.src=pr.image;photo.alt=pr.title;photo.loading="lazy";photo.referrerPolicy="no-referrer";
    photo.onerror=()=>{photo.remove();visual.classList.remove("has-photo");};visual.prepend(photo);visual.classList.add("has-photo");
    if(pr.imageCredit){const caption=add(visual,"span","image-credit",labels.image+": "+pr.imageCredit);caption.title="Image rights remain with the source publisher";}
  }
 });
 const contact=document.querySelector(".contact-action");
 if(contact){
  contact.replaceChildren();add(contact,"h3","contact-title",labels.contact);
  if(p.phone){const a=link(p.phone,"tel:"+p.phone.replace(/\s+/g,""),"contact-link");if(a)contact.append(a);}
  if(p.email){const a=link(p.email,"mailto:"+p.email,"contact-link");if(a)contact.append(a);}
  const social=make("div","social-links");
  for(const [name,url] of [["LinkedIn",p.linkedin],["Facebook",p.facebook],["GitHub",p.github]])if(url){const a=link(name+" ↗",url,"social-link");if(a)social.append(a);}
  contact.append(social);
  if(p.cvUrl){const a=link(labels.downloadCv,p.cvUrl,"button button-dark");if(a)contact.append(a);}
  add(contact,"small","",labels.collab);
 }
 if(p.portrait){const heroArt=document.querySelector(".hero-art");if(heroArt){const photo=make("img","hero-portrait");photo.src=p.portrait.startsWith("http")?p.portrait:root+p.portrait;photo.alt=p.displayName;heroArt.append(photo);}}
 if(new URLSearchParams(location.search).has("edit")){
  const strip=make("div","edit-banner"),wrap=add(strip,"div","container");
  add(wrap,"span","",labels.editTitle);
  const a=link(labels.editLink,"https://github.com/Elmnyawey/mmelmnyawey/edit/main/data/site.json","");if(a)wrap.append(a);
  document.body.prepend(strip);
 }
}
loadContent();