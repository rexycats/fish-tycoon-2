import{r as Q,j as r}from"./index-DSbCYOfl.js";const j={common:null,uncommon:{color:"#78c8ff",opacity:.2,blur:6},rare:{color:"#c878ff",opacity:.28,blur:8},epic:{color:"#ffe040",opacity:.4,blur:10}};function u({fish:e,size:a=60,flipped:d=!1,selected:n=!1,onClick:c}){var x;const t=((e==null?void 0:e.id)||"sh").slice(0,8),p=((x=e==null?void 0:e.species)==null?void 0:x.rarity)||"rare",s=j[p],l=(e==null?void 0:e.colorVariant)||"default",h=a*.6,f=a,y=l==="yellow"?{filter:"hue-rotate(60deg) saturate(1.2)"}:l==="purple"?{filter:"hue-rotate(-40deg) saturate(1.3)"}:l==="white"?{filter:"saturate(0.2) brightness(1.4)"}:{};return r.jsxs("svg",{width:h,height:f,viewBox:"0 0 50 85",onClick:c,style:{cursor:c?"pointer":"default",transform:d?"scaleX(-1)":"none",overflow:"visible",...y},children:[r.jsxs("defs",{children:[r.jsx("filter",{id:`shsh-${t}`,x:"-30%",y:"-15%",width:"160%",height:"140%",children:r.jsx("feDropShadow",{dx:"0",dy:"2",stdDeviation:"2",floodColor:"#000",floodOpacity:"0.25"})}),r.jsxs("linearGradient",{id:`shbody-${t}`,x1:"0",y1:"0",x2:"0",y2:"1",children:[r.jsx("stop",{offset:"0%",stopColor:"#e08030"}),r.jsx("stop",{offset:"40%",stopColor:"#d06820"}),r.jsx("stop",{offset:"100%",stopColor:"#904010"})]}),r.jsxs("radialGradient",{id:`shspec-${t}`,cx:"35%",cy:"15%",r:"40%",children:[r.jsx("stop",{offset:"0%",stopColor:"white",stopOpacity:"0.5"}),r.jsx("stop",{offset:"100%",stopColor:"white",stopOpacity:"0"})]}),s&&r.jsxs("filter",{id:`shaura-${t}`,x:"-60%",y:"-40%",width:"220%",height:"180%",children:[r.jsx("feGaussianBlur",{stdDeviation:s.blur,result:"blur"}),r.jsxs("feMerge",{children:[r.jsx("feMergeNode",{in:"blur"}),r.jsx("feMergeNode",{in:"SourceGraphic"})]})]})]}),s&&r.jsx("ellipse",{cx:"25",cy:"35",rx:"20",ry:"30",fill:s.color,opacity:s.opacity,filter:`url(#shaura-${t})`}),r.jsx("path",{d:"M32,18 Q40,22 38,30 Q36,36 32,38 Q34,28 32,18",fill:"rgba(220,120,50,0.35)",stroke:"rgba(180,80,30,0.3)",strokeWidth:"0.5"}),r.jsx("line",{x1:"33",y1:"20",x2:"37",y2:"24",stroke:"rgba(180,80,30,0.2)",strokeWidth:"0.5"}),r.jsx("line",{x1:"33",y1:"26",x2:"37",y2:"28",stroke:"rgba(180,80,30,0.2)",strokeWidth:"0.5"}),r.jsx("line",{x1:"33",y1:"32",x2:"36",y2:"33",stroke:"rgba(180,80,30,0.2)",strokeWidth:"0.5"}),r.jsxs("g",{filter:`url(#shsh-${t})`,children:[r.jsx("path",{d:`
          M18,8
          Q12,8 10,12
          L8,16
          Q6,14 8,10
          Q10,6 18,8
          Z
        `,fill:`url(#shbody-${t})`})," ",r.jsx("path",{d:`
          M18,8
          Q28,5 30,12
          Q32,20 30,30
          Q28,40 25,46
          Q22,52 20,54
          Q18,56 16,56
          Q12,52 14,46
          Q16,40 18,32
          Q20,24 20,16
          Q20,10 18,8
          Z
        `,fill:`url(#shbody-${t})`}),r.jsx("path",{d:"M18,14 Q16,24 16,34 Q16,44 18,50 Q14,44 14,34 Q14,24 18,14",fill:"rgba(255,200,140,0.25)"}),[16,22,28,34,40,48].map((i,o)=>r.jsx("path",{d:`M${14+o*.3},${i} Q${22-o*.2},${i-1} ${28-o*.5},${i}`,stroke:"rgba(160,80,20,0.3)",strokeWidth:"0.8",fill:"none"},o))]}),r.jsx("path",{d:`
        M18,54
        Q16,58 18,62
        Q22,66 24,64
        Q26,62 24,58
        Q22,56 20,58
        Q18,60 20,62
      `,stroke:`url(#shbody-${t})`,strokeWidth:"3.5",fill:"none",strokeLinecap:"round"}),r.jsx("path",{d:"M22,5 Q24,0 26,4 Q28,0 27,6 Q25,4 22,5",fill:"#c06820",opacity:"0.7"}),r.jsx("path",{d:"M18,8 Q28,5 30,12 Q32,20 30,30 Q28,40 25,46 Q22,52 20,54 Q18,56 16,56 Q12,52 14,46 Q16,40 18,32 Q20,24 20,16 Q20,10 18,8 Z",fill:`url(#shspec-${t})`}),r.jsx("circle",{cx:"20",cy:"11",r:"3",fill:"#1a0800"}),r.jsx("circle",{cx:"20",cy:"11",r:"2",fill:"#302010"}),r.jsx("circle",{cx:"19",cy:"10",r:"1",fill:"white",opacity:"0.85"}),r.jsx("path",{d:"M14,16 Q8,20 10,24 Q12,20 14,18",fill:"rgba(220,120,50,0.3)"}),r.jsx("ellipse",{cx:"20",cy:"80",rx:"10",ry:"1.5",fill:"#000",opacity:"0.07"}),n&&r.jsx("ellipse",{cx:"22",cy:"35",rx:"22",ry:"32",fill:"none",stroke:"#f0c040",strokeWidth:"1.5",strokeDasharray:"4 3",opacity:"0.9",style:{animation:"shimmer-ring-march 0.9s linear infinite"}})]})}const g=Q.memo(u);export{g as default};
