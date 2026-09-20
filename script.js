
const PRODUCTS = [
 {id:1,name:"Noir Tailored Blazer",price:185000,category:"Men",type:"Jackets",image:"https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=900&q=85"},
 {id:2,name:"Élan Satin Dress",price:145000,category:"Women",type:"Dresses",image:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85"},
 {id:3,name:"Monarch Oxford Shirt",price:68000,category:"Men",type:"Shirts",image:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85"},
 {id:4,name:"Lumière Co-ord Set",price:120000,category:"Women",type:"Dresses",image:"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85"},
 {id:5,name:"Atelier Wide-Leg Trouser",price:78000,category:"Women",type:"Trousers",image:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85"},
 {id:6,name:"Obsidian Leather Jacket",price:210000,category:"Men",type:"Jackets",image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85"},
 {id:7,name:"Noir Signature Heels",price:99000,category:"Women",type:"Shoes",image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85"},
 {id:8,name:"Monogram Leather Loafers",price:115000,category:"Men",type:"Shoes",image:"https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=85"},
 {id:9,name:"Sculpted Mini Bag",price:72000,category:"Women",type:"Accessories",image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85"},
 {id:10,name:"Crown Knit Polo",price:62000,category:"Men",type:"Shirts",image:"https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=900&q=85"},
 {id:11,name:"Velvet Evening Blazer",price:155000,category:"Women",type:"Jackets",image:"https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=900&q=85"},
 {id:12,name:"Apex Pleated Trousers",price:74000,category:"Men",type:"Trousers",image:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=85"},
 {id:13,name:"Soleil Statement Earrings",price:35000,category:"Women",type:"Accessories",image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85"},
 {id:14,name:"Executive Leather Belt",price:42000,category:"Men",type:"Accessories",image:"https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=85"}
];

const money = n => `₦${n.toLocaleString("en-NG")}`;
let cart = JSON.parse(localStorage.getItem("noireCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("noireWishlist") || "[]");

function saveState(){
 localStorage.setItem("noireCart",JSON.stringify(cart));
 localStorage.setItem("noireWishlist",JSON.stringify(wishlist));
 updateCartCount();
}

function productCard(p){
 const liked = wishlist.includes(p.id) ? "active" : "";
 return `<article class="product-card reveal">
   <div class="product-image">
     <img src="${p.image}" alt="${p.name}" loading="lazy">
   </div>
   <div class="product-info">
     <div class="product-top">
       <div><div class="product-name">${p.name}</div><div class="category">${p.category} · ${p.type}</div></div>
       <button class="heart ${liked}" aria-label="Add to wishlist" onclick="toggleWishlist(${p.id})"><i class="fa-${liked?'solid':'regular'} fa-heart"></i></button>
     </div>
     <div class="price">${money(p.price)}</div>
     <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
   </div>
 </article>`;
}

function renderProducts(list=PRODUCTS, target="#productGrid"){
 const el=document.querySelector(target);
 if(!el)return;
 el.innerHTML=list.map(productCard).join("");
 observeReveal();
}

function filterProducts(value){
 document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===value));
 let list = value==="All" ? PRODUCTS : PRODUCTS.filter(p=>p.category===value || p.type===value);
 renderProducts(list);
}

function addToCart(id){
 const found=cart.find(i=>i.id===id);
 if(found) found.qty++;
 else cart.push({id,qty:1});
 saveState(); renderCart(); openCart();
}

function changeQty(id,delta){
 const item=cart.find(i=>i.id===id);
 if(!item)return;
 item.qty+=delta;
 if(item.qty<=0) cart=cart.filter(i=>i.id!==id);
 saveState(); renderCart();
}
function removeFromCart(id){cart=cart.filter(i=>i.id!==id);saveState();renderCart()}

function renderCart(){
 const el=document.querySelector("#cartItems"), totalEl=document.querySelector("#cartTotal");
 if(!el)return;
 if(!cart.length){el.innerHTML='<p class="muted">Your cart is currently empty.</p>';totalEl.textContent=money(0);return}
 el.innerHTML=cart.map(item=>{
   const p=PRODUCTS.find(x=>x.id===item.id);
   return `<div class="cart-item">
    <img src="${p.image}" alt="${p.name}">
    <div><h4>${p.name}</h4><p>${money(p.price)}</p>
    <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div>
    <button class="remove" onclick="removeFromCart(${p.id})">Remove</button>
   </div>`;
 }).join("");
 totalEl.textContent=money(cart.reduce((sum,i)=>sum+(PRODUCTS.find(p=>p.id===i.id).price*i.qty),0));
}
function updateCartCount(){
 const count=cart.reduce((s,i)=>s+i.qty,0);
 document.querySelectorAll(".cart-count").forEach(e=>e.textContent=count);
}
function openCart(){document.querySelector("#cartDrawer")?.classList.add("open");document.querySelector("#overlay")?.classList.add("show")}
function closeCart(){document.querySelector("#cartDrawer")?.classList.remove("open");document.querySelector("#overlay")?.classList.remove("show")}
function toggleWishlist(id){
 wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];
 saveState();
 const activeFilter=document.querySelector(".filter.active")?.dataset.filter || "All";
 filterProducts(activeFilter);
}

function setupNav(){
 const menu=document.querySelector("#menuBtn"), links=document.querySelector("#navLinks");
 menu?.addEventListener("click",()=>links.classList.toggle("open"));
 links?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));
 document.querySelector("#cartBtn")?.addEventListener("click",openCart);
 document.querySelector("#closeCart")?.addEventListener("click",closeCart);
 document.querySelector("#overlay")?.addEventListener("click",closeCart);
}

function setupFilters(){
 document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>filterProducts(btn.dataset.filter)));
}

function setupForm(){
 const form=document.querySelector("#contactForm"), msg=document.querySelector("#formMessage");
 form?.addEventListener("submit",e=>{
   e.preventDefault();
   if(!form.checkValidity()){form.reportValidity();return}
   msg.textContent="Thank you. Your message has been received by the NOIRÉ team.";
   form.reset();
 });
}

function observeReveal(){
 const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});
 document.querySelectorAll(".reveal:not(.visible)").forEach(el=>obs.observe(el));
}

document.addEventListener("DOMContentLoaded",()=>{
 setupNav();setupFilters();setupForm();updateCartCount();renderCart();renderProducts();
 observeReveal();
});
