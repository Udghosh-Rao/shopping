const r=()=>({createRipple:i=>{var l;const e=i.currentTarget,t=document.createElement("span"),c=Math.max(e.clientWidth,e.clientHeight),p=e.getBoundingClientRect();t.style.cssText=`
      width:${c}px; height:${c}px;
      left:${i.clientX-p.left-c/2}px;
      top:${i.clientY-p.top-c/2}px;
    `,t.classList.add("ripple-effect"),e.classList.add("ripple-container"),(l=e.querySelector(".ripple-effect"))==null||l.remove(),e.appendChild(t),setTimeout(()=>t.remove(),600)}});export{r as u};
