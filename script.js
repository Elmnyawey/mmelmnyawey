/* Portfolio content is editable in /data/site.json through GitHub. */
document.getElementById("year").textContent=new Date().getFullYear();
const menu=document.querySelector(".menu-toggle"),nav=document.querySelector(".site-nav");
if(menu&&nav){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}))}
document.querySelectorAll(".filter-button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter-button").forEach(x=>{const active=x===b;x.classList.toggle("active",active);x.setAttribute("aria-pressed",String(active))});document.querySelectorAll(".project-card").forEach(x=>x.hidden=b.dataset.filter!=="all"&&!x.dataset.category.split(" ").includes(b.dataset.filter))}));
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e};
const safe=(s)=>{try{const u=new URL(s);return ["https:","mailto:","tel:"].includes(u.protocol)?u.toString():null}catch{return null}};
const link=(text,url,cls)=>{const u=safe(url);if(!u)return null;const a=el("a",cls,text);a.href=u;if(u.startsWith("https:")){a.target="_blank";a.rel="noopener noreferrer"}return a};
const add=(parent,tag,cls,txt)=>{const node=el(tag,cls,txt);parent.append(node);return node};
async function loadContent(){
  let data;try{const r=await fetch("./data/site.json",{cache:"no-cache"});if(!r.ok)throw new Error("load error");data=await r.json()}catch(err){console.warn("Using built-in portfolio content",err);return}
  const p=data.profile||{};
  const brandTitle=document.querySelector(".brand-title");if(brandTitle&&p.displayName)brandTitle.textContent=p.displayName.toUpperCase();
  const intro=document.querySelector(".hero-intro");if(intro&&p.heroIntro)intro.textContent=p.heroIntro;
  const cards=[...document.querySelectorAll(".project-card")];
  (data.projects||[]).forEach((pr,i)=>{
    const card=cards[i];if(!card)return;
    const heading=card.querySelector(".project-content h3");if(heading&&pr.title)heading.textContent=pr.title;
    const summary=card.querySelector(".project-content>p");if(summary&&pr.overview)summary.textContent=pr.overview;
    const kicker=card.querySelector(".project-kicker");if(kicker&&pr.location)kicker.textContent=pr.location.toUpperCase();
    const tags=card.querySelector(".project-tools");if(tags&&pr.tools){tags.replaceChildren();pr.tools.forEach(t=>add(tags,"span","",t))}
    const content=card.querySelector(".project-content");if(!content)return;
    const meta=el("div","project-meta");
    [["Developer",pr.developer],["Employer",pr.employer],["My role",pr.role],["Period",pr.period],["Project type",pr.type]].forEach(([k,v])=>{if(v)add(meta,"div","",k+": "+v)});
    content.insertBefore(meta,tags);
    if(pr.myWork?.length){add(content,"h4","detail-title","MY CONTRIBUTION");const ul=el("ul","project-highlights");pr.myWork.forEach(item=>add(ul,"li","",item));content.append(ul)}
    if(pr.sources?.length){const sourceWrap=el("div","source-links");add(sourceWrap,"h4","detail-title","PUBLIC PROJECT SOURCES");pr.sources.forEach(s=>{const a=link(s.title+" ↗",s.url,"project-source");if(a)sourceWrap.append(a)});content.append(sourceWrap)}
    const visual=card.querySelector(".project-visual");if(visual&&pr.image&&safe(pr.image)){const image=document.createElement("img");image.src=pr.image;image.alt=pr.title+" — public project image";image.loading="lazy";image.referrerPolicy="no-referrer";image.className="project-photo";image.onerror=()=>{image.remove();visual.classList.remove("has-photo")};visual.prepend(image);visual.classList.add("has-photo");if(pr.imageCredit){const credit=add(visual,"span","image-credit","IMAGE: "+pr.imageCredit);credit.title="Public external image; ownership remains with source publisher"}}
  });
  const contact=document.querySelector(".contact-action");
  if(contact){contact.replaceChildren();add(contact,"h3","contact-title","GET IN TOUCH");if(p.phone){let a=link(p.phone,"tel:"+p.phone.replace(/\s+/g,""),"contact-link");if(a)contact.append(a)}if(p.email){let a=link(p.email,"mailto:"+p.email,"contact-link");if(a)contact.append(a)}const social=el("div","social-links");for(const [name,url] of [["LinkedIn",p.linkedin],["Facebook",p.facebook],["GitHub",p.github]]){if(url){const a=link(name+" ↗",url,"social-link");if(a)social.append(a)}}contact.append(social);if(p.cvUrl){const a=link("Download CV ↓",p.cvUrl,"button button-dark");if(a)contact.append(a)}add(contact,"small","","For project collaboration, send a brief scope and timeline.")}
  if(p.portrait){const heroArt=document.querySelector(".hero-art");if(heroArt){const face=document.createElement("img");face.src=p.portrait;face.alt="Muhammed Elmnyawey";face.className="hero-portrait";heroArt.append(face)}}
  if(data.editorInstructions){const body=document.createElement("div");body.className="edit-banner";body.innerHTML='<div class="container"><span>Owner editing: Project descriptions, photos, and contact details are managed in one file.</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/Elmnyawey/mmelmnyawey/edit/main/data/site.json">Edit portfolio data ↗</a></div>';if(new URLSearchParams(location.search).has("edit"))document.body.prepend(body)}
}
loadContent();