(()=>{"use strict";var e={933:(e,t)=>{var n=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==n)return n;throw new Error("unable to locate global object")}();e.exports=t=n.fetch,n.fetch&&(t.default=n.fetch.bind(n)),t.Headers=n.Headers,t.Request=n.Request,t.Response=n.Response}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var u=t[o]={exports:{}};return e[o](u,u.exports,n),u.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e=n(933),t=n.n(e);globalThis.fetch=t();var o=document.querySelector("video"),r=document.getElementById("play"),u=r.querySelector("i"),d=document.getElementById("mute"),a=(d.querySelector("i"),document.getElementById("volume")),i=document.getElementById("currentTime"),l=document.getElementById("totalTime"),s=document.getElementById("timeline"),c=document.getElementById("fullScreen"),m=c.querySelector("i"),f=document.getElementById("videoContainer"),v=document.getElementById("videoControls"),p=null,y=null,E=.5;o.volume=E;var g=function(e){return new Date(1e3*e).toISOString().substr(14,5)},L=function(){return v.classList.remove("showing")};r.addEventListener("click",(function(e){o.paused?(o.play(),console.log(o)):o.pause(),u.classList=o.paused?"fas fa-play":"fas fa-pause"})),d.addEventListener("click",(function(e){o.muted?o.muted=!1:o.muted=!0,d.innerText=o.muted?"unmuted":"Muted",a.value=o.muted?0:E})),a.addEventListener("input",(function(e){var t=e.target.value;o.muted&&(o.muted=!1,d.innerText="Mute"),E=t,o.volume=t})),o.addEventListener("loadedmetadata",(function(){l.innerText=g(Math.floor(o.duration)),s.max=Math.floor(o.duration)})),o.addEventListener("timeupdate",(function(){i.innerText=g(Math.floor(o.currentTime)),s.value=Math.floor(o.currentTime)})),s.addEventListener("input",(function(e){var t=e.target.value;o.currentTime=t})),f.addEventListener("mousemove",(function(){p&&(clearTimeout(p),p=null),y&&(clearTimeout(y),y=null),v.classList.add("showing"),y=setTimeout(L,3e3)})),f.addEventListener("mouseleave",(function(){p=setTimeout(L,3e3)})),o.addEventListener("ended",(function(){var e=f.dataset.id;t()("/api/videos/".concat(e,"/view"),{method:"POST"})})),c.addEventListener("click",(function(){document.fullscreenElement?(document.exitFullscreen(),m.classList="fas = fa-expand"):(f.requestFullscreen(),m.classList="fas fa-compress")}))})()})();