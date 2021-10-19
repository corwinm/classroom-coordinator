var I=Object.defineProperty,U=Object.defineProperties;var M=Object.getOwnPropertyDescriptors;var y=Object.getOwnPropertySymbols;var S=Object.prototype.hasOwnProperty,j=Object.prototype.propertyIsEnumerable;var O=(e,t,o)=>t in e?I(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,$=(e,t)=>{for(var o in t||(t={}))S.call(t,o)&&O(e,o,t[o]);if(y)for(var o of y(t))j.call(t,o)&&O(e,o,t[o]);return e},E=(e,t)=>U(e,M(t));var A=(e,t)=>{var o={};for(var r in e)S.call(e,r)&&t.indexOf(r)<0&&(o[r]=e[r]);if(e!=null&&y)for(var r of y(e))t.indexOf(r)<0&&j.call(e,r)&&(o[r]=e[r]);return o};import{j as k,e as W,r as v,R as P,a as q}from"./vendor.3647ac4e.js";const H=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function o(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerpolicy&&(l.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?l.credentials="include":n.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(n){if(n.ep)return;n.ep=!0;const l=o(n);fetch(n.href,l)}};H();const a=k.exports.jsx,h=k.exports.jsxs,K=k.exports.Fragment;function T(){return a("header",{className:"bg-white border-b-2 border-gray-200",children:a("h1",{className:"text-2xl text-gray-900 py-5 px-4",children:"Classroom Coordinator"})})}function B(e){var t;return((t=e.value)==null?void 0:t.toString().split(" ")[1].split("/").slice(0,2).join("-"))||"N/A"}function _(e,t,o){return`${e.substring(0,e.indexOf("rotation")+8)} ${t} to ${o}`}const D=24,z=29,C=31;function G(e){const t=new FileReader;return t.readAsArrayBuffer(e),t.onload=async()=>{var d;if(!t.result||typeof t.result=="string"){alert("Failed to load file");return}let o,r;try{o=await new W.exports.Workbook().xlsx.load(t.result),console.log(`Found worksheets: ${o.worksheets.map(s=>s.name)}`),r=o.worksheets.find(s=>s.name.toLowerCase()==="rotation")}catch(i){alert("Failed to read Excel doc. Check uploaded document and try again.");return}if(!r){alert("Couldn't find worksheet named 'Rotation'");return}r.spliceRows(2,7),(d=r.getRows(D,6))==null||d.forEach((i,s)=>{var F,L;if(!r){alert("Couldn't find worksheet named 'Rotation'");return}const x=r.getRow(s+C);x.height=i.height;for(const g of[2,3,4]){const p=r.getCell(s+D,g),f=r.getCell(s+C,g);if(f.style=p.style,[2,4].includes(g)){if(s===0){const[u,N]=(L=(F=p.value)==null?void 0:F.toString().split(" "))!=null?L:[],R=new Date(N);R.setDate(R.getDate()+7),f.value=`${u} ${R.toLocaleDateString()}`}else if(s===1){let u=0;for(;p.value&&!f.value&&u<5;){const N=r.getCell(z-u,g);f.value=N.value,u+=1}}else if(p.value){const u=r.getCell(s+D-1,g);f.value=u.value}continue}f.value=p.value}});const n=B(r.getCell(3,2)),l=B(r.getCell(C,4)),c=await o.xlsx.writeBuffer(),w=new Blob([c],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),b=window.URL.createObjectURL(w),m=document.createElement("a");m.href=b,m.download=_(e.name,n,l),m.click(),window.URL.revokeObjectURL(b)},null}const J=(l,n)=>{var c=l,{id:e,label:t,accept:o}=c,r=A(c,["id","label","accept"]);const[w,b]=v.exports.useState(null),[m,d]=v.exports.useState(!1);return h(K,{children:[a("label",{htmlFor:e,className:"leading-8",children:t}),h("div",{className:`relative px-4 py-8 border-dashed border-gray-500 border-4 text-center hover:bg-gray-200 ${m&&"bg-blue-200"}`,children:[w===null?h("div",{children:["Drag file here or"," ",a("span",{className:"text-blue-600 underline",children:"select a file"})]}):w,a("input",E($({type:"file",ref:n,id:e,accept:o},r),{style:{textIndent:"-999em"},onChange:i=>{var s,x;return b(((x=(s=i.target.files)==null?void 0:s[0])==null?void 0:x.name)||null)},onDragEnter:i=>d(!0),onDragLeave:i=>d(!1),onDragEnd:i=>d(!1),onDrop:i=>d(!1),className:"absolute top-0 left-0 w-full h-full cursor-pointer text-transparent"}))]})]})};var Q=v.exports.forwardRef(J);function V(){const e=v.exports.useRef(null);return a("div",{className:"m-4",children:h("form",{onSubmit:o=>{var r;if(o.preventDefault(),((r=e.current)==null?void 0:r.files)&&e.current.files.length){console.log(`Found ${e.current.files.length} files`);const n=e.current.files[0];G(n)}},className:"max-w-lg mx-auto bg-white border-gray-200 border-2 rounded-md p-2",children:[a("legend",{className:"text-xl leading-10",children:"Class Rotation"}),a(Q,{id:"original-xl",label:"Original Excel Document",accept:".xlsx",required:!0,ref:e}),a("div",{className:"text-center",children:a("button",{type:"submit",className:"bg-green-600 hover:bg-green-800 text-white p-4 text-center mt-4 mb-2",children:"Create Next Sheet"})})]})})}console.log(`Build timestamp: ${new Date("Mon Oct 18 21:06:58 PDT 2021").toLocaleString()}`);function X(){return h("div",{className:"App",children:[a(T,{}),a(V,{})]})}P.render(a(q.StrictMode,{children:a(X,{})}),document.getElementById("root"));
