const defaults = {
  heroTitle: "خليك فوق.|خلي جهازك Smart.",
  heroCopy: "تجميعات كمبيوتر، قطع أصلية وحلول تقنية بتصميم وتجربة مختلفة.",
  wa: "01155598423",
  products: [
    {name:"Gaming Beast", desc:"تجميعة ألعاب وأداء عالي", price:"ابتداءً من 24,999 ج.م"},
    {name:"Creator Pro", desc:"شغل، مونتاج وصناعة محتوى", price:"ابتداءً من 32,999 ج.م"},
    {name:"Smart Office", desc:"مكتب سريع وموفر", price:"ابتداءً من 12,999 ج.م"}
  ]
};

const state = JSON.parse(localStorage.getItem("smartSite") || "null") || structuredClone(defaults);
const $ = s => document.querySelector(s);
const waUrl = n => "https://wa.me/" + n.replace(/\D/g,"").replace(/^0/,"20");

function renderProducts(){
  $("#productsGrid").innerHTML = state.products.map((p,i)=>`
    <article class="product">
      <div class="product-art"><span style="font-size:12px;color:#d9ff68;position:relative;z-index:2">SMART / ${String(i+1).padStart(2,"0")}</span></div>
      <div class="product-body">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        <span class="price">${escapeHtml(p.price)}</span>
        <a class="buy" href="${waUrl(state.wa)}" target="_blank" rel="noopener">اسأل على واتساب</a>
      </div>
    </article>`).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function apply(){
  $("#heroCopy").textContent = state.heroCopy;
  const h1 = document.querySelector(".hero h1");
  const parts = state.heroTitle.split("|");
  h1.innerHTML = escapeHtml(parts[0]||"") + "<br><span>"+escapeHtml(parts[1]||"")+"</span>";
  document.querySelectorAll('a[href*="wa.me"]').forEach(a=>a.href=waUrl(state.wa));
  document.querySelectorAll("footer a").forEach(a=>a.textContent="واتساب: "+state.wa);
  renderProducts();
}
function openEditor(){
  $("#editor").classList.remove("hidden");
  $("#heroTitle").value=state.heroTitle;
  $("#heroCopy").value=state.heroCopy;
  $("#waNumber").value=state.wa;
  $("#productEditor").innerHTML=state.products.map((p,i)=>`
    <div class="edit-product">
      <input data-k="name" data-i="${i}" value="${escapeHtml(p.name)}" placeholder="اسم المنتج">
      <input data-k="price" data-i="${i}" value="${escapeHtml(p.price)}" placeholder="السعر">
    </div>
    <input data-k="desc" data-i="${i}" value="${escapeHtml(p.desc)}" placeholder="وصف المنتج">`).join("");
}
$("#editBtn").onclick=openEditor;
$("#closeEditor").onclick=()=>$("#editor").classList.add("hidden");
$("#saveBtn").onclick=()=>{
  state.heroTitle=$("#heroTitle").value;
  state.heroCopy=$("#heroCopy").value;
  state.wa=$("#waNumber").value;
  document.querySelectorAll("#productEditor [data-k]").forEach(el=>state.products[+el.dataset.i][el.dataset.k]=el.value);
  localStorage.setItem("smartSite",JSON.stringify(state));
  apply(); $("#editor").classList.add("hidden");
};
$("#resetBtn").onclick=()=>{
  localStorage.removeItem("smartSite"); location.reload();
};

const heroSection=document.querySelector('.valorant-hero');
function updateHeroVideo(){
  if(!heroSection) return;
  const r=heroSection.getBoundingClientRect(), vh=innerHeight;
  const p=Math.max(0,Math.min(1,(vh-r.top)/(r.height+vh*.2)));
  heroSection.style.setProperty('--valorant-scale',(1.04+p*.10).toFixed(3));
  heroSection.style.setProperty('--valorant-y',(p*-55).toFixed(1)+'px');
  const content=heroSection.querySelector('.hero-content');
  if(content){content.style.transform=`translateY(${p*-70}px)`;content.style.opacity=String(Math.max(.2,1-p*1.35));}
  const ret=heroSection.querySelector('.valorant-reticle');
  if(ret) ret.style.transform=`translate(${-50+p*35}%,${-50+p*20}%) scale(${1+p*.7})`;
}
window.addEventListener('scroll',updateHeroVideo,{passive:true});
window.addEventListener('resize',updateHeroVideo);
updateHeroVideo();

// Cinematic opening: local video starts silently, then the PC reveal hands off to gameplay.
const introVideo = document.getElementById('valorantVideo');
const introHero = document.querySelector('.valorant-hero');
if (introVideo) {
  introVideo.muted = true;
  introVideo.play().catch(()=>{});
}
window.setTimeout(()=>{
  if (introHero) introHero.classList.remove('intro-active');
  if (introVideo) introVideo.play().catch(()=>{});
}, 4700);
apply();

const pcSection=document.querySelector('.pc-showcase');
function updatePCScene(){
  if(!pcSection) return;
  const r=pcSection.getBoundingClientRect();
  const vh=innerHeight;
  const progress=Math.max(0,Math.min(1,(vh-r.top)/(r.height+vh*.25)));
  const pcProgress=Math.max(0,Math.min(1,progress*1.35));
  const x=-80+pcProgress*250;
  const y=-90+pcProgress*130;
  const rot=-16+pcProgress*30;
  const z=-2+pcProgress*5;
  const screenP=Math.max(0,Math.min(1,(progress-.34)/.42));
  pcSection.style.setProperty('--pc-scroll', `${scrollY}px`);
  pcSection.style.setProperty('--pc-x', `${x}px`);
  pcSection.style.setProperty('--pc-y', `${y}px`);
  pcSection.style.setProperty('--pc-rotate', `${rot}deg`);
  pcSection.style.setProperty('--pc-z', `${z}deg`);
  pcSection.style.setProperty('--screen-y', `${(1-screenP)*150}px`);
  pcSection.style.setProperty('--screen-scale', `${screenP*.04}`);
  pcSection.style.setProperty('--screen-opacity', `${.15+screenP*.85}`);
  pcSection.style.setProperty('--pc-light', `${pcProgress*300}`);
}
window.addEventListener('scroll',updatePCScene,{passive:true});
window.addEventListener('resize',updatePCScene); updatePCScene();

const securitySection=document.querySelector('.security-showcase');
const cams=[...document.querySelectorAll('.cam')];
function updateSecurityScene(){
  if(!securitySection) return;
  const r=securitySection.getBoundingClientRect(), vh=innerHeight;
  const p=Math.max(0,Math.min(1,(vh-r.top)/(r.height+vh*.15)));
  const bgx=(p-.5)*-70, bgy=(p-.5)*-35;
  securitySection.style.setProperty('--security-bg-x',bgx+'px');
  securitySection.style.setProperty('--security-bg-y',bgy+'px');
  cams.forEach((c,i)=>{
    const d=parseFloat(c.dataset.depth||1);
    const wave=Math.sin(p*Math.PI*2+i)*12;
    const x=(p-.5)*150*d + wave;
    const y=(p-.2)*85*d;
    const rot=(p-.5)*20*d;
    c.style.setProperty('--cam-x',x+'px');
    c.style.setProperty('--cam-y',y+'px');
    c.style.setProperty('--cam-r',rot+'deg');
  });
}
window.addEventListener('scroll',updateSecurityScene,{passive:true});
window.addEventListener('resize',updateSecurityScene);
updateSecurityScene();
