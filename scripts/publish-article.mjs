import fs from "node:fs";
import path from "node:path";

const input=process.env.ARTICLE_JSON;
if(!input || input.length>55000) throw Error("Missing article data or maximum input exceeded");
let article;
try {article=JSON.parse(input)} catch {throw Error("Invalid JSON. Copy JSON from the publisher page, not HTML.")}

const one=(key,max=4000)=>{const value=article[key];if(typeof value!=="string")throw Error(key+" must be text");const clean=value.trim();if(!clean||clean.length>max)throw Error(key+" is empty or too long");return clean};
const arr=(key)=>{const value=article[key];if(!Array.isArray(value)||value.length<1||value.length>50||value.some(x=>typeof x!=="string"||!x.trim()||x.length>4000))throw Error(key+" must contain 1–50 non-empty paragraphs");return value.map(x=>x.trim())};
const slug=one("slug",80).toLowerCase();
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw Error("Slug must use lowercase English letters, numbers and hyphens");
const reserved=new Set(["index","services","courses","admin","publisher"]);
if(reserved.has(slug))throw Error("Reserved article slug");
const normalized={
 slug,
 title:one("title",180),arTitle:one("arTitle",180),
 category:one("category",100),arCategory:one("arCategory",100),
 excerpt:one("excerpt",340),arExcerpt:one("arExcerpt",340),
 body:arr("body"),arBody:arr("arBody")
};
const contentPath="data/content.json";
const content=JSON.parse(fs.readFileSync(contentPath,"utf8"));
if(content.articles.some(a=>a.slug===slug))throw Error("This slug already exists. Choose another.");
const safe=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const origin="https://mmelmnyawey.pages.dev";
function articlePage(ar){
 const title=ar?normalized.arTitle:normalized.title;
 const desc=ar?normalized.arExcerpt:normalized.excerpt;
 const target=ar?"/ar/articles/"+slug+".html":"/articles/"+slug+".html";
 const alternate=ar?"/articles/"+slug+".html":"/ar/articles/"+slug+".html";
 const nav=ar?
 [['الرئيسية','/ar/'],['المشروعات','/ar/#work'],['الخدمات','/ar/services.html'],['الكورسات','/ar/courses.html'],['المقالات','/ar/articles.html'],['تواصل','/ar/#contact'],['EN',alternate]]:
 [['Home','/'],['Projects','/#work'],['Services','/services.html'],['Courses','/courses.html'],['Articles','/articles.html'],['Contact','/#contact'],['عربي',alternate]];
 const navHtml=nav.map(([n,u],i)=>'<a'+(i===6?' class="language-switch"':'')+' href="'+u+'">'+safe(n)+'</a>').join("");
 const steps=(ar?normalized.arBody:normalized.body).map(p=>'<li>'+safe(p)+'</li>').join("");
 return '<!doctype html><html lang="'+(ar?'ar" dir="rtl':'en')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#343739"><meta name="description" content="'+safe(desc)+'"><meta property="og:title" content="'+safe(title)+'"><meta property="og:description" content="'+safe(desc)+'"><meta property="og:type" content="article"><title>'+safe(title)+' | '+(ar?'محمد المنياوي':'Muhammed Elmnyawey')+'</title><link rel="canonical" href="'+origin+target+'"><link rel="alternate" hreflang="en" href="'+origin+(ar?alternate:target)+'"><link rel="alternate" hreflang="ar" href="'+origin+(ar?target:alternate)+'"><link rel="icon" href="../../favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../../styles.css"><script src="../../script.js" defer></script><script src="../../motion.js" defer></script><script src="../../content.js" defer></script></head><body><header class="site-header"><div class="container header-inner"><a class="brand" href="'+(ar?'/ar/':'/')+'"><span class="brand-mark">M<span>.</span>E</span><span class="brand-title">'+(ar?'محمد المنياوي':'MUHAMMED ELMNYAWEY')+'</span></a><button class="menu-toggle" type="button" aria-label="'+(ar?'فتح القائمة':'Toggle navigation')+'" aria-controls="site-nav" aria-expanded="false"><span></span><span></span><span></span></button><nav class="site-nav" id="site-nav">'+navHtml+'</nav></div></header><main><section class="page-hero"><div class="container"><p class="section-index">03 / '+(ar?'مقالات هندسية':'ENGINEERING ARTICLES')+'</p><h1>'+safe(title)+'</h1><p>'+safe(desc)+'</p></div></section><article class="container article-body"><div class="article-detail"><span class="page-card-kicker">'+safe(ar?normalized.arCategory:normalized.category)+'</span><h2>'+(ar?'أفكار وخطوات عملية':'Practical notes')+'</h2><ol>'+steps+'</ol><p>'+(ar?'ملاحظات هندسية عامة، ويجب الرجوع إلى مواصفات المشروع واعتماداته قبل التنفيذ.':'General engineering notes. Always follow project-specific standards and approved documents.')+'</p><a class="page-card-link" href="'+(ar?'/ar/articles.html':'/articles.html')+'">'+(ar?'العودة للمقالات':'Back to articles')+' ↗</a></div></article></main><footer class="site-footer"><div class="container footer-inner"><a href="'+(ar?'/ar/':'/')+'" class="footer-brand">M<span>.</span>E</a><p>© <span id="year">2026</span> '+(ar?'محمد المنياوي':'Muhammed Elmnyawey')+'</p><a href="'+(ar?'/ar/':'/')+'">'+(ar?'الرئيسية':'Home')+' ↑</a></div></footer></body></html>';
}
for (const [ar,target] of [[false,'articles/'+slug+'.html'],[true,'ar/articles/'+slug+'.html']]){
 fs.mkdirSync(path.dirname(target),{recursive:true});
 fs.writeFileSync(target,articlePage(ar));
}
content.articles.push(normalized);
fs.writeFileSync(contentPath,JSON.stringify(content,null,2)+"\n");
for(const [ar,filename] of [[false,"articles.html"],[true,"ar/articles.html"]]){
 let html=fs.readFileSync(filename,"utf8");
 const gridMarker='<div class="container page-grid">';
 const start=html.indexOf(gridMarker),end=html.indexOf('</div></main>',start);
 if(start===-1||end===-1) throw Error("Cannot find the article grid in "+filename);
 const items=content.articles.map(x=>{
  const category=ar?x.arCategory:x.category,heading=ar?x.arTitle:x.title,excerpt=ar?x.arExcerpt:x.excerpt;
  const href=(ar?'/ar/':'/')+'articles/'+x.slug+'.html';
  return '<article class="article-card"><span class="page-card-kicker">'+safe(category)+'</span><h2>'+safe(heading)+'</h2><p>'+safe(excerpt)+'</p><a class="page-card-link" href="'+href+'">'+(ar?'اقرأ المقال':'Read article')+' ↗</a></article>';
 }).join("");
 html=html.slice(0,start)+gridMarker+items+html.slice(end);
 fs.writeFileSync(filename,html);
}
let sitemap=fs.readFileSync('sitemap.xml','utf8');
for(const p of ['articles/'+slug+'.html','ar/articles/'+slug+'.html']){
 const url=origin+'/'+p;
 if(!sitemap.includes(url))sitemap=sitemap.replace('</urlset>','  <url><loc>'+url+'</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>');
}
fs.writeFileSync('sitemap.xml',sitemap);
console.log('Created bilingual article pages:',slug);
