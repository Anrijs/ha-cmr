var G=globalThis,X=G.ShadowRoot&&(G.ShadyCSS===void 0||G.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fe=Symbol(),De=new WeakMap,j=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(X&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=De.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&De.set(t,e))}return e}toString(){return this.cssText}},He=o=>new j(typeof o=="string"?o:o+"",void 0,fe),y=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((i,s,r)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+o[r+1],o[0]);return new j(t,o,fe)},Ue=(o,e)=>{if(X)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=G.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,o.appendChild(i)}},ge=X?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return He(t)})(o):o;var{is:ht,defineProperty:mt,getOwnPropertyDescriptor:vt,getOwnPropertyNames:ft,getOwnPropertySymbols:gt,getPrototypeOf:bt}=Object,J=globalThis,Ie=J.trustedTypes,_t=Ie?Ie.emptyScript:"",xt=J.reactiveElementPolyfillSupport,B=(o,e)=>o,be={toAttribute(o,e){switch(e){case Boolean:o=o?_t:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},Be=(o,e)=>!ht(o,e),je={attribute:!0,type:String,converter:be,reflect:!1,useDefault:!1,hasChanged:Be};Symbol.metadata??=Symbol("metadata"),J.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=je){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&mt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:r}=vt(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:s,set(n){let c=s?.call(this);r?.call(this,n),this.requestUpdate(e,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??je}static _$Ei(){if(this.hasOwnProperty(B("elementProperties")))return;let e=bt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(B("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(B("properties"))){let t=this.properties,i=[...ft(t),...gt(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(ge(s))}else e!==void 0&&t.push(ge(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ue(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:be).toAttribute(t,i.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:be;this._$Em=s;let c=n.fromAttribute(t,r.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(e!==void 0){let n=this.constructor;if(s===!1&&(r=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??Be)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:n}=r,c=this[s];n!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,r,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[B("elementProperties")]=new Map,A[B("finalized")]=new Map,xt?.({ReactiveElement:A}),(J.reactiveElementVersions??=[]).push("2.1.2");var Ce=globalThis,Ve=o=>o,Z=Ce.trustedTypes,Ke=Z?Z.createPolicy("lit-html",{createHTML:o=>o}):void 0,Xe="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,Je="?"+M,yt=`<${Je}>`,O=document,K=()=>O.createComment(""),F=o=>o===null||typeof o!="object"&&typeof o!="function",Ee=Array.isArray,$t=o=>Ee(o)||typeof o?.[Symbol.iterator]=="function",_e=`[ 	
\f\r]`,V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Fe=/-->/g,We=/>/g,z=RegExp(`>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),qe=/'/g,Ye=/"/g,Ze=/^(?:script|style|textarea|title)$/i,Se=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),d=Se(1),Y=Se(2),Qt=Se(3),D=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Ge=new WeakMap,N=O.createTreeWalker(O,129);function Qe(o,e){if(!Ee(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ke!==void 0?Ke.createHTML(e):e}var wt=(o,e)=>{let t=o.length-1,i=[],s,r=e===2?"<svg>":e===3?"<math>":"",n=V;for(let c=0;c<t;c++){let a=o[c],l,u,m=-1,g=0;for(;g<a.length&&(n.lastIndex=g,u=n.exec(a),u!==null);)g=n.lastIndex,n===V?u[1]==="!--"?n=Fe:u[1]!==void 0?n=We:u[2]!==void 0?(Ze.test(u[2])&&(s=RegExp("</"+u[2],"g")),n=z):u[3]!==void 0&&(n=z):n===z?u[0]===">"?(n=s??V,m=-1):u[1]===void 0?m=-2:(m=n.lastIndex-u[2].length,l=u[1],n=u[3]===void 0?z:u[3]==='"'?Ye:qe):n===Ye||n===qe?n=z:n===Fe||n===We?n=V:(n=z,s=void 0);let v=n===z&&o[c+1].startsWith("/>")?" ":"";r+=n===V?a+yt:m>=0?(i.push(l),a.slice(0,m)+Xe+a.slice(m)+M+v):a+M+(m===-2?c:v)}return[Qe(o,r+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},W=class o{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,n=0,c=e.length-1,a=this.parts,[l,u]=wt(e,t);if(this.el=o.createElement(l,i),N.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(s=N.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let m of s.getAttributeNames())if(m.endsWith(Xe)){let g=u[n++],v=s.getAttribute(m).split(M),h=/([.?@])?(.*)/.exec(g);a.push({type:1,index:r,name:h[2],strings:v,ctor:h[1]==="."?ye:h[1]==="?"?$e:h[1]==="@"?we:U}),s.removeAttribute(m)}else m.startsWith(M)&&(a.push({type:6,index:r}),s.removeAttribute(m));if(Ze.test(s.tagName)){let m=s.textContent.split(M),g=m.length-1;if(g>0){s.textContent=Z?Z.emptyScript:"";for(let v=0;v<g;v++)s.append(m[v],K()),N.nextNode(),a.push({type:2,index:++r});s.append(m[g],K())}}}else if(s.nodeType===8)if(s.data===Je)a.push({type:2,index:r});else{let m=-1;for(;(m=s.data.indexOf(M,m+1))!==-1;)a.push({type:7,index:r}),m+=M.length-1}r++}}static createElement(e,t){let i=O.createElement("template");return i.innerHTML=e,i}};function H(o,e,t=o,i){if(e===D)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,r=F(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(o),s._$AT(o,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=H(o,s._$AS(o,e.values),s,i)),e}var xe=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??O).importNode(t,!0);N.currentNode=s;let r=N.nextNode(),n=0,c=0,a=i[0];for(;a!==void 0;){if(n===a.index){let l;a.type===2?l=new q(r,r.nextSibling,this,e):a.type===1?l=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(l=new ke(r,this,e)),this._$AV.push(l),a=i[++c]}n!==a?.index&&(r=N.nextNode(),n++)}return N.currentNode=O,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},q=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=H(this,e,t),F(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==D&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):$t(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&F(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=W.createElement(Qe(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let r=new xe(s,this),n=r.u(this.options);r.p(t),this.T(n),this._$AH=r}}_$AC(e){let t=Ge.get(e.strings);return t===void 0&&Ge.set(e.strings,t=new W(e)),t}k(e){Ee(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let r of e)s===t.length?t.push(i=new o(this.O(K()),this.O(K()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=Ve(e).nextSibling;Ve(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},U=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=p}_$AI(e,t=this,i,s){let r=this.strings,n=!1;if(r===void 0)e=H(this,e,t,0),n=!F(e)||e!==this._$AH&&e!==D,n&&(this._$AH=e);else{let c=e,a,l;for(e=r[0],a=0;a<r.length-1;a++)l=H(this,c[i+a],t,a),l===D&&(l=this._$AH[a]),n||=!F(l)||l!==this._$AH[a],l===p?e=p:e!==p&&(e+=(l??"")+r[a+1]),this._$AH[a]=l}n&&!s&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ye=class extends U{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},$e=class extends U{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},we=class extends U{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=H(this,e,t,0)??p)===D)return;let i=this._$AH,s=e===p&&i!==p||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==p&&(i===p||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ke=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){H(this,e)}};var kt=Ce.litHtmlPolyfillSupport;kt?.(W,q),(Ce.litHtmlVersions??=[]).push("3.3.3");var et=(o,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let r=t?.renderBefore??null;i._$litPart$=s=new q(e.insertBefore(K(),r),r,void 0,t??{})}return s._$AI(o),s};var Ae=globalThis,_=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=et(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return D}};_._$litElement$=!0,_.finalized=!0,Ae.litElementHydrateSupport?.({LitElement:_});var Ct=Ae.litElementPolyfillSupport;Ct?.({LitElement:_});(Ae.litElementVersions??=[]).push("4.2.2");var Le=class{constructor(){this.listeners=new Set}subscribe(e,t){return this.listeners.add(t),this.latest&&t(this.latest),this.unsubscribe||(this.unsubscribe=e.connection.subscribeMessage(i=>{this.latest=i.entries,this.listeners.forEach(s=>s(i.entries))},{type:"cmr/subscribe"}),this.unsubscribe.catch(i=>{console.error("cmr: subscription failed",i),this.unsubscribe=void 0})),()=>{if(this.listeners.delete(t),this.listeners.size===0&&this.unsubscribe){let i=this.unsubscribe;this.unsubscribe=void 0,this.latest=void 0,i.then(s=>s()).catch(()=>{})}}}once(e){return this.latest?Promise.resolve(this.latest):new Promise(t=>{let i,s=!1;i=this.subscribe(e,r=>{s||(s=!0,queueMicrotask(()=>i?.()),t(r))})})}},$=new Le;function w(o,e){if(o?.length)return o.find(t=>t.entry_id===e)??o[0]}var Me=class{constructor(){this.listeners=new Set;this.events=[];this.issues=[];this.loaded=!1}subscribe(e,t){return this.listeners.add(t),this.loaded&&t(this.events,this.issues),this.unsubscribe||(this.unsubscribe=e.connection.subscribeMessage(i=>{this.events=i.reset?i.events:[...this.events,...i.events].slice(-1e3),this.issues=i.issues,this.loaded=!0,this.listeners.forEach(s=>s(this.events,this.issues))},{type:"cmr/events/subscribe",limit:1e3}),this.unsubscribe.catch(i=>{console.error("cmr: events subscription failed",i),this.unsubscribe=void 0})),()=>{if(this.listeners.delete(t),this.listeners.size===0&&this.unsubscribe){let i=this.unsubscribe;this.unsubscribe=void 0,this.loaded=!1,this.events=[],i.then(s=>s()).catch(()=>{})}}}},tt=new Me;var S={gateway:"mdi:web",router:"mdi:router",switch:"mdi:switch",ap:"mdi:access-point",lte:"mdi:signal-cellular-3",device:"mdi:chip"},Q={gateway:"Gateway",router:"Router",switch:"Switch",ap:"Access point",lte:"LTE",device:"Device"};function L(o){return o.pending?"pending":o.connected?o.alerts?.on?"alert":o.update_available?"update":"ok":"offline"}var I={ok:"Online",update:"Update available",alert:"Alert firing",pending:"Waiting to pair",offline:"Disconnected"};function ee(o){if(o==null)return"\u2013";let e=Math.floor(o/86400),t=Math.floor(o%86400/3600),i=Math.floor(o%3600/60);return e?`${e}d ${t}h`:t?`${t}h ${i}m`:i?`${i}m`:`${Math.floor(o)}s`}function te(o,e){let t=["gateway","router","switch","lte","ap","device"];return o.controller!==e.controller?o.controller?-1:1:t.indexOf(o.role)-t.indexOf(e.role)||o.identity.localeCompare(e.identity)}function Et(o,e,t){o.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}function k(o,e){e&&Et(o,"hass-more-info",{entityId:e})}function Pe(o){history.pushState(null,"",o),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}var C=y`
  :host {
    --cmr-ok: var(--success-color, #2e7d32);
    --cmr-update: var(--info-color, #0288d1);
    --cmr-alert: var(--error-color, #d32f2f);
    --cmr-pending: var(--warning-color, #f57c00);
    --cmr-offline: var(--error-color, #d32f2f);
    /* Aqua, the jacket colour of OM3/OM4 multimode fiber. */
    --cmr-fiber: var(--cyan-color, #00bcd4);
    --cmr-poe: var(--amber-color, #ffc107);
    --cmr-muted: var(--secondary-text-color);
    --cmr-line: var(--divider-color, rgba(127, 127, 127, 0.25));
    --cmr-surface: var(--card-background-color, var(--ha-card-background, #fff));
    --cmr-surface-2: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
    --cmr-radius: var(--ha-card-border-radius, 12px);
    --cmr-mono: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace;
  }
  ha-card {
    height: 100%;
    overflow: hidden;
  }
  .status-ok { --status: var(--cmr-ok); }
  .status-update { --status: var(--cmr-update); }
  .status-alert { --status: var(--cmr-alert); }
  .status-pending { --status: var(--cmr-pending); }
  .status-offline { --status: var(--cmr-offline); }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--status);
    flex: none;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    line-height: 16px;
    background: var(--cmr-surface-2);
    color: var(--primary-text-color);
    white-space: nowrap;
  }
  .mono {
    font-family: var(--cmr-mono);
    font-size: 0.92em;
  }
  .muted {
    color: var(--cmr-muted);
  }
  .empty {
    padding: 24px 16px;
    color: var(--cmr-muted);
    text-align: center;
  }
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px 8px;
    font-size: 16px;
    font-weight: 500;
  }
  .card-header ha-icon {
    --mdc-icon-size: 20px;
    color: var(--cmr-muted);
  }
  .card-header .spacer {
    flex: 1;
  }
`;var it=["critical","high","medium","low"],st={critical:"mdi:alert-octagon",high:"mdi:alert",medium:"mdi:alert-circle-outline",low:"mdi:information-outline"};function St(o){if(!o)return"";let e=(Date.now()-new Date(o).getTime())/1e3;return e<60?"just now":e<3600?`${Math.round(e/60)} min ago`:e<86400?`${Math.round(e/3600)} h ago`:`${Math.round(e/86400)} d ago`}var ie=class extends _{static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0},_setup:{state:!0},_copied:{state:!0}}}setConfig(e){this._config=e}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"title",selector:{text:{}}},{name:"hide_disabled",selector:{boolean:{}}}],computeLabel:e=>({entry_id:"Controller",title:"Title",hide_disabled:"Hide disabled rules"})[e.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){return 2+(this._entry?.alerts.length??4)}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=$.subscribe(this.hass,e=>{this._entry=w(e,this._config?.entry_id)})}async _toggleSetup(){if(this._setup!==void 0){this._setup=void 0;return}this._setup=null;try{this._setup=await this.hass.connection.sendMessagePromise({type:"cmr/alert_setup",entry_id:this._entry.entry_id})}catch(e){console.error("cmr: alert setup",e),this._setup=void 0}}async _copy(){this._setup&&(await navigator.clipboard.writeText(this._setup.script),this._copied=!0,setTimeout(()=>this._copied=!1,1800))}render(){let e=this._entry;if(!e)return d`<ha-card><div class="empty">Waiting for the CMR controller…</div></ha-card>`;let t=e.alerts.filter(a=>!(this._config.hide_disabled&&a.disabled)).sort((a,l)=>+(l.devices_on>0)-+(a.devices_on>0)||Number(a.disabled)-Number(l.disabled)||it.indexOf(a.severity)-it.indexOf(l.severity)||a.name.localeCompare(l.name)),i=t.filter(a=>a.devices_on>0).length,s=e.alerts.filter(a=>a.webhook).length,r=e.fleet_entities.fleet_alert,n=r?this.hass.states[r]:void 0,c=n?.attributes??{};return d`
      <ha-card>
        <div class="card-header">
          <ha-icon icon=${i?"mdi:bell-alert":"mdi:bell-check-outline"}></ha-icon>
          <span>${this._config.title??"Alerts"}</span>
          ${i?d`<span class="chip firing">${i} firing</span>`:d`<span class="chip">all quiet</span>`}
          <div class="spacer"></div>
        </div>

        ${n&&n.state!=="unknown"&&n.state!=="unavailable"?d`<button class="last sev-${c.event_type}" @click=${()=>k(this,r)}>
              <ha-icon icon=${st[c.event_type]??"mdi:bell"}></ha-icon>
              <div>
                <div><b>${c.alert}</b>${c.device?d` · ${c.device}`:p}</div>
                <div class="muted small">Last pushed alert · ${St(n.state)}</div>
              </div>
            </button>`:p}

        <div class="rules">
          ${t.map(a=>this._rule(a))}
          ${t.length?p:d`<div class="empty">No alert rules on the controller.</div>`}
        </div>

        ${this.hass.user?.is_admin?d`<div class="footer">
              <button class="link" @click=${this._toggleSetup}>
                <ha-icon icon="mdi:webhook"></ha-icon>
                ${s?`${s} of ${e.alerts.length} rules push to Home Assistant`:"Push alerts to Home Assistant instantly"}
                <ha-icon icon=${this._setup!==void 0?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
              </button>
              ${this._setup===null?d`<div class="muted small">Loading…</div>`:p}
              ${this._setup?d`<div class="setup">
                    <div class="small">Paste into the controller's terminal. Each alert rule gets an HTTP action that calls Home Assistant; edit <code>find</code> to choose rules.</div>
                    <pre>${this._setup.script}</pre>
                    <button class="copy" @click=${this._copy}>
                      <ha-icon icon=${this._copied?"mdi:check":"mdi:content-copy"}></ha-icon>${this._copied?"Copied":"Copy script"}
                    </button>
                  </div>`:p}
            </div>`:p}
      </ha-card>
    `}_rule(e){let t=e.devices_on>0;return d`
      <button class="rule sev-${e.severity} ${t?"on":""} ${e.disabled?"disabled":""}"
              @click=${()=>k(this,e.entity_id)}>
        <span class="stripe"></span>
        <ha-icon class="sev" icon=${st[e.severity]}></ha-icon>
        <div class="body">
          <div class="title">
            <span class="name">${e.name}</span>
            ${e.webhook?d`<ha-icon class="hook" icon="mdi:webhook" title="Pushes to a webhook"></ha-icon>`:p}
          </div>
          <div class="muted small">
            ${e.disabled?"disabled \xB7 ":p}${e.categories.join(", ")||"uncategorised"} ·
            ${e.labels.join(", ")||"all"}
          </div>
        </div>
        <div class="nums">
          <div class=${t?"hot":""}>${e.devices_on}/${e.devices}</div>
          <div class="muted small" title="Times fired">${e.fired}×</div>
        </div>
      </button>
    `}static{this.styles=[C,y`
      .chip.firing { background: var(--cmr-alert); color: #fff; }
      .last {
        all: unset; cursor: pointer; box-sizing: border-box; display: flex; gap: 10px; align-items: center;
        margin: 0 12px 8px; padding: 8px 12px; border-radius: 12px; width: calc(100% - 24px);
        background: color-mix(in srgb, var(--sev) 12%, transparent); --mdc-icon-size: 20px;
      }
      .last ha-icon { color: var(--sev); }
      .sev-critical { --sev: var(--cmr-alert); }
      .sev-high { --sev: var(--cmr-pending); }
      .sev-medium { --sev: var(--cmr-update); }
      .sev-low { --sev: var(--cmr-muted); }
      .rules { padding: 0 8px 8px; display: flex; flex-direction: column; gap: 2px; }
      .rule {
        all: unset; cursor: pointer; box-sizing: border-box; display: flex; align-items: center; gap: 10px;
        padding: 7px 10px 7px 6px; border-radius: 10px; position: relative;
      }
      .rule:hover { background: var(--cmr-surface-2); }
      .rule .stripe { width: 3px; align-self: stretch; border-radius: 2px; background: var(--sev); opacity: 0.35; }
      .rule.on .stripe { opacity: 1; }
      .rule.on { background: color-mix(in srgb, var(--sev) 10%, transparent); }
      .rule .sev { color: var(--sev); --mdc-icon-size: 18px; opacity: 0.8; }
      .rule.disabled { opacity: 0.45; }
      .body { flex: 1; min-width: 0; }
      .title { display: flex; align-items: center; gap: 6px; }
      .name { font-weight: 500; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .hook { --mdc-icon-size: 14px; color: var(--cmr-muted); }
      .small { font-size: 11.5px; }
      .nums { text-align: right; font-variant-numeric: tabular-nums; font-size: 13px; }
      .hot { color: var(--cmr-alert); font-weight: 700; }
      .footer { border-top: 1px solid var(--cmr-line); padding: 8px 12px 12px; }
      .footer .link {
        all: unset; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px;
        color: var(--primary-color); --mdc-icon-size: 18px;
      }
      .setup { margin-top: 8px; display: flex; flex-direction: column; gap: 8px; }
      pre {
        margin: 0; padding: 10px; border-radius: 8px; background: var(--cmr-surface-2);
        font: 11px/1.45 var(--cmr-mono); white-space: pre-wrap; word-break: break-all; max-height: 180px; overflow: auto;
      }
      code { font-family: var(--cmr-mono); }
      .copy {
        all: unset; cursor: pointer; align-self: flex-start; display: inline-flex; gap: 6px; align-items: center;
        padding: 6px 12px; border-radius: 8px; background: var(--primary-color); color: var(--text-primary-color, #fff);
        font-size: 13px; --mdc-icon-size: 16px;
      }
    `]}};var At=new Set(["insight","device","alert","upgrade","security","config"]),Lt=o=>At.has(o.category)||o.severity==="warning"||o.severity==="error",Re={insight:{icon:"mdi:stethoscope",label:"Issues"},device:{icon:"mdi:router-network",label:"Devices"},alert:{icon:"mdi:bell-outline",label:"Alerts"},upgrade:{icon:"mdi:update",label:"Upgrades"},wifi:{icon:"mdi:wifi",label:"Wi-Fi"},link:{icon:"mdi:ethernet",label:"Links"},security:{icon:"mdi:shield-alert-outline",label:"Security"},login:{icon:"mdi:account-key-outline",label:"Logins"},config:{icon:"mdi:cog-outline",label:"Config"},dhcp:{icon:"mdi:ip-network-outline",label:"DHCP"},system:{icon:"mdi:cog-transfer-outline",label:"System"},api:{icon:"mdi:api",label:"API logins"}},Mt={icon:"mdi:text-box-outline",label:"Other"};function rt(o){return Re[o]??{...Mt,label:o[0].toUpperCase()+o.slice(1)}}function Pt(o){let e=o.data?.event;return o.category==="wifi"?e==="disconnected"?"mdi:wifi-off":e==="roamed"?"mdi:wifi-sync":"mdi:wifi-plus":o.category==="link"?o.data?.state==="down"?"mdi:ethernet-off":"mdi:ethernet":o.category==="device"?e==="disconnected"?"mdi:lan-disconnect":e==="rebooted"?"mdi:restart":"mdi:lan-connect":o.category==="insight"&&e==="resolved"?"mdi:check-circle-outline":rt(o.category).icon}function Rt(o){let e=o.data??{},t=e.mac??e.interface??e.user??e.rule_id??e.key??o.title;return`${o.category}|${o.device_key??""}|${String(t)}`}var Tt=864e5,se=class extends _{constructor(){super();this._loaded=!1;this._events=[],this._issues=[],this._category="",this._device="",this._search="",this._open=new Set,this._limit=50}static{this.properties={hass:{attribute:!1},_config:{state:!0},_events:{state:!0},_issues:{state:!0},_category:{state:!0},_device:{state:!0},_search:{state:!0},_open:{state:!0},_limit:{state:!0},_notable:{state:!0}}}setConfig(t){this._config={show_issues:!0,show_filters:!0,hide_categories:["api"],max_items:50,...t},this._limit=this._config.max_items??50,this._device=t.device??"",this._notable=!!t.notable}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"title",selector:{text:{}}},{name:"device",selector:{text:{}}},{name:"max_items",selector:{number:{min:5,max:500,mode:"box"}}},{name:"notable",selector:{boolean:{}}},{name:"show_issues",selector:{boolean:{}}},{name:"show_filters",selector:{boolean:{}}}],computeLabel:t=>({title:"Title",device:"Only this device (identity)",max_items:"Rows to show",notable:"Start with notable events only",show_issues:"Show detected issues",show_filters:"Show filters"})[t.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(t){t.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=tt.subscribe(this.hass,(t,i)=>{this._events=t,this._issues=i,this._loaded=!0})}_visible(){let t=this._config,i=this._search.trim().toLowerCase(),s=new Set(t.hide_categories??[]);return this._events.filter(r=>{if(this._notable&&!this._category&&!Lt(r))return!1;if(this._category){if(r.category!==this._category)return!1}else if(t.categories?.length?!t.categories.includes(r.category):s.has(r.category))return!1;return!(this._device&&r.device_name!==this._device||i&&!`${r.title} ${r.message} ${r.device_name??""}`.toLowerCase().includes(i))})}_rows(t){let i=[];for(let s=t.length-1;s>=0;s--){let r=t[s],n=Rt(r),c=i[i.length-1],a=c&&new Date(c.events[0].time).toDateString()===new Date(r.time).toDateString();c&&c.key===n&&a&&r.category!=="insight"?c.events.push(r):i.push({key:n,events:[r]})}return i}_toggle(t){let i=new Set(this._open);i.has(t)?i.delete(t):i.add(t),this._open=i}render(){if(!this._loaded)return d`<ha-card><div class="empty">Loading network events…</div></ha-card>`;let t=this._config,i=this._visible(),s=this._rows(i),r=s.slice(0,this._limit),n=[...new Set(this._events.map(l=>l.category))].sort((l,u)=>Object.keys(Re).indexOf(l)-Object.keys(Re).indexOf(u)),c=[...new Set(this._events.map(l=>l.device_name).filter(Boolean))].sort(),a=this._device?this._issues.filter(l=>this._issueDevice(l)===this._device):this._issues;return d`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:timeline-text-outline"></ha-icon>
          <span>${t.title??"Network events"}</span>
          ${a.length?d`<span class="chip hot">${a.length} issue${a.length>1?"s":""}</span>`:d`<span class="chip">no issues</span>`}
        </div>

        ${t.show_issues&&a.length?d`<div class="issues">${a.map(l=>this._issue(l))}</div>`:p}

        ${t.show_filters?d`<div class="filters">
              <div class="cats">
                <button class="cat ${!this._category&&this._notable?"on":""}"
                  @click=${()=>{this._category="",this._notable=!0}}>
                  <ha-icon icon="mdi:star-four-points-outline"></ha-icon>Notable</button>
                <button class="cat ${!this._category&&!this._notable?"on":""}"
                  @click=${()=>{this._category="",this._notable=!1}}>All</button>
                ${n.map(l=>{let u=rt(l);return d`<button class="cat ${this._category===l?"on":""}" @click=${()=>this._category=this._category===l?"":l}>
                    <ha-icon icon=${u.icon}></ha-icon>${u.label}
                  </button>`})}
              </div>
              <div class="find">
                <select .value=${this._device} @change=${l=>this._device=l.target.value}>
                  <option value="">All devices</option>
                  ${c.map(l=>d`<option value=${l} ?selected=${l===this._device}>${l}</option>`)}
                </select>
                <input type="search" placeholder="Search" .value=${this._search}
                  @input=${l=>this._search=l.target.value} />
              </div>
            </div>`:p}

        <div class="timeline">
          ${r.map((l,u)=>{let m=new Date(l.events[0].time),g=u?new Date(r[u-1].events[0].time):void 0,v=!g||g.toDateString()!==m.toDateString();return d`${v?d`<div class="day">${this._dayLabel(m)}</div>`:p}${this._row(l)}`})}
          ${r.length?p:d`<div class="empty">No events${this._search||this._category||this._device?" match these filters":" yet"}.</div>`}
          ${s.length>this._limit?d`<button class="more" @click=${()=>this._limit+=50}>Show more (${s.length-this._limit})</button>`:p}
        </div>
      </ha-card>
    `}_issueDevice(t){return this._events.find(i=>i.device_key===t.device_key)?.device_name??void 0}_issue(t){let i=this._issueDevice(t);return d`<div class="issue sev-${t.severity}">
      <ha-icon icon=${t.severity==="error"?"mdi:alert-octagon-outline":"mdi:alert-outline"}></ha-icon>
      <div class="body">
        <div class="title">${t.title}</div>
        <div class="detail">${t.detail}</div>
        <div class="meta">
          since ${this._time(new Date(t.since))} · ${t.count}×
          ${i&&t.device_id?d`· <a href="#" @click=${s=>{s.preventDefault(),Pe(`/config/devices/device/${t.device_id}`)}}>${i}</a>`:i?d`· ${i}`:p}
        </div>
      </div>
    </div>`}_row(t){let i=t.events[0],s=i.id,r=this._open.has(s),n=t.events.length>1,c=t.events[t.events.length-1],a=new Map;for(let l of t.events){let u=String(l.data?.event??l.category);a.set(u,(a.get(u)??0)+1)}return d`
      <div class="row sev-${i.severity} ${r?"open":""}">
        <button class="line" @click=${()=>this._toggle(s)}>
          <span class="time">${this._time(new Date(i.time))}</span>
          <span class="dot-icon"><ha-icon icon=${Pt(i)}></ha-icon></span>
          <span class="text">
            <span class="title">${i.title}</span>
            ${n?d`<span class="fold">${t.events.length} events since ${this._time(new Date(c.time))} ·
                  ${[...a].map(([l,u])=>`${u} ${l}`).join(", ")}</span>`:p}
          </span>
          ${i.device_name?d`<span class="device">${i.device_name}</span>`:p}
        </button>
        ${r?this._details(t):p}
      </div>
    `}_details(t){let i=t.events.slice(0,30);return d`<div class="details">
      ${i.map(s=>{let r=Object.entries(s.data??{}).filter(([n,c])=>c!=null&&c!==""&&!["event","key","rule_id"].includes(n));return d`<div class="detail-item">
          <div class="detail-head"><span class="mono">${new Date(s.time).toLocaleString(this.hass.language)}</span>
            <span class="muted">${s.source}${s.topics?.length?` \xB7 ${s.topics.join(",")}`:""}</span></div>
          ${s.message&&s.message!==s.title?d`<div class="raw mono">${s.message}</div>`:p}
          ${r.length?d`<div class="fields">${r.map(([n,c])=>d`<span class="chip">${n.replace(/_/g," ")}: ${typeof c=="object"?JSON.stringify(c):String(c)}</span>`)}</div>`:p}
        </div>`})}
      ${t.events.length>i.length?d`<div class="muted">…and ${t.events.length-i.length} more</div>`:p}
      ${t.events[0].device_id?d`<a class="open-device" href="#" @click=${s=>{s.preventDefault(),Pe(`/config/devices/device/${t.events[0].device_id}`)}}>
            <ha-icon icon="mdi:open-in-app"></ha-icon>Open ${t.events[0].device_name}</a>`:p}
    </div>`}_time(t){return t.toLocaleTimeString(this.hass.language,{hour:"2-digit",minute:"2-digit"})}_dayLabel(t){let i=new Date;i.setHours(0,0,0,0);let s=new Date(t);s.setHours(0,0,0,0);let r=Math.round((i.getTime()-s.getTime())/Tt);return r===0?"Today":r===1?"Yesterday":t.toLocaleDateString(this.hass.language,{weekday:"long",day:"numeric",month:"long"})}static{this.styles=[C,y`
      ha-card { container-type: inline-size; }
      .chip.hot { background: var(--cmr-alert); color: #fff; }
      .issues { display: flex; flex-direction: column; gap: 8px; padding: 0 12px 10px; }
      .issue {
        display: flex; gap: 10px; padding: 10px 12px; border-radius: 12px;
        background: color-mix(in srgb, var(--sev) 10%, transparent);
        border-left: 3px solid var(--sev); --mdc-icon-size: 20px;
      }
      .issue ha-icon { color: var(--sev); flex: none; margin-top: 1px; }
      .issue .title { font-weight: 600; }
      .issue .detail { font-size: 13px; margin-top: 2px; line-height: 1.4; }
      .issue .meta { font-size: 12px; color: var(--cmr-muted); margin-top: 4px; }
      .issue a { color: var(--primary-color); text-decoration: none; }
      .sev-error { --sev: var(--cmr-alert); }
      .sev-warning { --sev: var(--cmr-pending); }
      .sev-notice { --sev: var(--cmr-update); }
      .sev-info { --sev: var(--cmr-muted); }

      .filters { padding: 0 12px 6px; display: flex; flex-direction: column; gap: 8px; }
      .cats { display: flex; flex-wrap: wrap; gap: 6px; }
      .cat {
        all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
        font-size: 12px; padding: 3px 10px; border-radius: 999px; border: 1px solid var(--cmr-line);
        color: var(--cmr-muted); --mdc-icon-size: 14px;
      }
      .cat.on { background: var(--primary-color); border-color: var(--primary-color); color: var(--text-primary-color, #fff); }
      .find { display: flex; gap: 8px; }
      .find select, .find input {
        font: inherit; font-size: 13px; padding: 6px 10px; border-radius: 8px; min-width: 0;
        border: 1px solid var(--cmr-line); background: var(--cmr-surface); color: var(--primary-text-color);
      }
      .find input { flex: 1; }

      .timeline { padding: 0 8px 10px; }
      .day { padding: 10px 8px 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--cmr-muted); }
      .row { border-radius: 10px; }
      .row.open { background: var(--cmr-surface-2); }
      .line {
        all: unset; box-sizing: border-box; cursor: pointer; width: 100%; display: flex; align-items: flex-start; gap: 10px;
        padding: 6px 8px; border-radius: 10px;
      }
      .line:hover { background: var(--cmr-surface-2); }
      .time { font: 12px var(--cmr-mono); color: var(--cmr-muted); width: 44px; flex: none; padding-top: 3px; font-variant-numeric: tabular-nums; }
      .dot-icon {
        width: 24px; height: 24px; border-radius: 50%; flex: none; display: grid; place-items: center;
        background: color-mix(in srgb, var(--sev) 14%, transparent); color: var(--sev); --mdc-icon-size: 15px;
      }
      .sev-info .dot-icon { color: var(--secondary-text-color); }
      .text { flex: 1; min-width: 0; display: flex; flex-direction: column; padding-top: 2px; }
      .text .title { font-size: 13.5px; line-height: 1.35; overflow-wrap: anywhere; }
      .fold { font-size: 12px; color: var(--cmr-muted); }
      .device {
        flex: none; font-size: 11px; padding: 2px 8px; border-radius: 999px; background: var(--cmr-surface-2);
        color: var(--cmr-muted); margin-top: 1px; max-width: 40%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .details { padding: 2px 10px 10px 62px; display: flex; flex-direction: column; gap: 8px; }
      .detail-item { display: flex; flex-direction: column; gap: 3px; }
      .detail-head { display: flex; gap: 8px; font-size: 11.5px; flex-wrap: wrap; }
      .raw { font-size: 11.5px; color: var(--primary-text-color); overflow-wrap: anywhere; }
      .fields { display: flex; flex-wrap: wrap; gap: 4px; }
      .open-device { display: inline-flex; gap: 4px; align-items: center; color: var(--primary-color); text-decoration: none; font-size: 13px; --mdc-icon-size: 16px; }
      .more { all: unset; cursor: pointer; display: block; margin: 8px auto 0; font-size: 13px; color: var(--primary-color); }
      @container (max-width: 480px) {
        .device { display: none; }
        .details { padding-left: 12px; }
      }
    `]}};var re=class extends _{static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0},_filter:{state:!0},_sort:{state:!0}}}constructor(){super(),this._filter=new Set,this._sort={key:"device",desc:!1}}setConfig(e){this._config={show_filters:!0,...e},this._filter=new Set(e.labels??[])}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"title",selector:{text:{}}},{name:"labels",selector:{text:{multiple:!0}}},{name:"show_filters",selector:{boolean:{}}}],computeLabel:e=>({entry_id:"Controller",title:"Title",labels:"Only devices with these labels",show_filters:"Show label filters"})[e.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 2+(this._entry?.devices.length??4)}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=$.subscribe(this.hass,e=>{this._entry=w(e,this._config?.entry_id)})}_toggle(e){let t=new Set(this._filter);t.has(e)?t.delete(e):t.add(e),this._filter=t}_setSort(e){this._sort={key:e,desc:this._sort.key===e?!this._sort.desc:!1}}_sorted(e){let{key:t,desc:i}=this._sort,s=[...e].sort((r,n)=>{switch(t){case"version":return(r.version??"").localeCompare(n.version??"",void 0,{numeric:!0});case"uptime":return(r.uptime??-1)-(n.uptime??-1);case"address":return(r.address??"").localeCompare(n.address??"",void 0,{numeric:!0});default:return te(r,n)}});return i?s.reverse():s}render(){let e=this._entry;if(!e)return d`<ha-card><div class="empty">Waiting for the CMR controller…</div></ha-card>`;let t=[...new Set(e.devices.flatMap(r=>r.labels))].sort(),i=this._sorted(e.devices.filter(r=>[...this._filter].every(n=>r.labels.includes(n)))),s=r=>this._sort.key===r?d`<ha-icon class="sort" icon=${this._sort.desc?"mdi:arrow-down":"mdi:arrow-up"}></ha-icon>`:p;return d`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:router-network"></ha-icon>
          <span>${this._config.title??"Devices"}</span>
          <span class="chip">${i.length}</span>
          <div class="spacer"></div>
        </div>
        ${this._config.show_filters&&t.length?d`<div class="filters">
              ${t.map(r=>d`<button class="filter ${this._filter.has(r)?"on":""}" @click=${()=>this._toggle(r)}>
                  ${r}
                </button>`)}
            </div>`:p}
        <div class="table" role="table">
          <div class="row head" role="row">
            <button class="c-device" @click=${()=>this._setSort("device")}>Device ${s("device")}</button>
            <span class="c-labels">Labels</span>
            <button class="c-version" @click=${()=>this._setSort("version")}>Version ${s("version")}</button>
            <button class="c-uptime" @click=${()=>this._setSort("uptime")}>Uptime ${s("uptime")}</button>
            <button class="c-address" @click=${()=>this._setSort("address")}>Address ${s("address")}</button>
          </div>
          ${i.map(r=>this._row(r))}
          ${i.length?p:d`<div class="empty">No devices match these labels.</div>`}
        </div>
      </ha-card>
    `}_row(e){let t=L(e);return d`
      <div class="row status-${t}" role="row" @click=${()=>k(this,e.entities.connected)}>
        <div class="c-device">
          <div class="icon" title=${I[t]}><ha-icon icon=${S[e.role]}></ha-icon><i class="dot"></i></div>
          <div class="who">
            <div class="name">
              ${e.identity}
              ${e.controller?d`<ha-icon class="crown" icon="mdi:crown-outline" title="CMR controller"></ha-icon>`:p}
            </div>
            <div class="muted small">${e.board??"\u2013"}${e.model_code?d` · <span class="mono">${e.model_code}</span>`:p}</div>
          </div>
        </div>
        <div class="c-labels">${e.labels.map(i=>d`<span class="chip">${i}</span>`)}</div>
        <div class="c-version" title=${e.prerelease?"Pre-release build":""}>
          <span class="mono">${e.version??"\u2013"}</span>
          ${e.update_available?d`<span class="update" title="Update available"><ha-icon icon="mdi:arrow-up-circle"></ha-icon><span class="mono">${e.available_version}</span></span>`:p}
        </div>
        <div class="c-uptime">${e.connected?ee(e.uptime):d`<span class="offline">${I[t]}</span>`}</div>
        <div class="c-address">
          ${e.address?d`<a class="mono" href="http://${e.address}" target="_blank" rel="noreferrer" @click=${i=>i.stopPropagation()}>${e.address}</a>`:d`<span class="muted">${e.controller?"local":"\u2013"}</span>`}
        </div>
      </div>
    `}static{this.styles=[C,y`
      ha-card { container-type: inline-size; }
      .filters { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px; }
      .filter {
        all: unset; cursor: pointer; font-size: 12px; padding: 3px 10px; border-radius: 999px;
        border: 1px solid var(--cmr-line); color: var(--cmr-muted);
      }
      .filter.on { background: var(--primary-color); border-color: var(--primary-color); color: var(--text-primary-color, #fff); }
      .table { padding: 0 8px 8px; }
      .row {
        display: grid; grid-template-columns: minmax(180px, 2.2fr) minmax(90px, 1.4fr) minmax(120px, 1.4fr) 80px 120px;
        gap: 10px; align-items: center; padding: 8px; border-radius: 10px; cursor: pointer;
      }
      .row:not(.head):hover { background: var(--cmr-surface-2); }
      .row.head { cursor: default; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--cmr-muted); padding-bottom: 4px; }
      .row.head button { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 2px; }
      .sort { --mdc-icon-size: 14px; }
      .c-device { display: flex; gap: 10px; align-items: center; min-width: 0; }
      .icon { position: relative; width: 34px; height: 34px; border-radius: 10px; flex: none; display: grid; place-items: center;
        background: color-mix(in srgb, var(--status) 13%, transparent); color: var(--status); --mdc-icon-size: 20px; }
      .icon .dot { position: absolute; right: -2px; bottom: -2px; border: 2px solid var(--cmr-surface); width: 9px; height: 9px; }
      .who { min-width: 0; }
      .name { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 4px; }
      .crown { --mdc-icon-size: 15px; color: var(--primary-color); }
      .small { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .c-labels { display: flex; flex-wrap: wrap; gap: 4px; }
      .c-version { display: flex; flex-wrap: wrap; gap: 4px 8px; align-items: center; font-size: 13px; }
      .update { display: inline-flex; align-items: center; gap: 3px; color: var(--cmr-update); font-weight: 600; --mdc-icon-size: 15px; }
      .c-uptime { font-size: 13px; font-variant-numeric: tabular-nums; }
      .offline { color: var(--cmr-offline); font-weight: 500; }
      .c-address a { color: var(--primary-color); text-decoration: none; font-size: 12.5px; }
      .c-address a:hover { text-decoration: underline; }

      @container (max-width: 640px) {
        .row { grid-template-columns: 1fr auto; grid-template-areas: "device uptime" "version address" "labels labels"; gap: 4px 10px; }
        .row.head { display: none; }
        .c-device { grid-area: device; }
        .c-uptime { grid-area: uptime; text-align: right; }
        .c-version { grid-area: version; padding-left: 44px; }
        .c-address { grid-area: address; text-align: right; }
        .c-labels { grid-area: labels; padding-left: 44px; }
        .row:not(.head) { border-bottom: 1px solid var(--cmr-line); border-radius: 0; }
      }
    `]}};var ne=["var(--primary-color)","var(--cmr-update)","var(--cmr-pending)","var(--accent-color, #7e57c2)","var(--cmr-ok)","var(--cmr-muted)"];function zt(o){if(!o)return"never";let e=Math.max(0,(Date.now()-new Date(o).getTime())/1e3);return e<10?"just now":e<60?`${Math.round(e)} s ago`:e<3600?`${Math.round(e/60)} min ago`:`${Math.round(e/3600)} h ago`}var oe=class extends _{static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0}}}setConfig(e){this._config=e}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}}],computeLabel:()=>"Controller"}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 4}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe(),this._ticker=window.setInterval(()=>this.requestUpdate(),15e3)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0,window.clearInterval(this._ticker)}willUpdate(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=$.subscribe(this.hass,e=>{this._entry=w(e,this._config?.entry_id)})}render(){let e=this._entry;if(!e)return d`<ha-card><div class="empty">Waiting for the CMR controller…</div></ha-card>`;let t=e.devices,i=t.find(b=>b.controller),s=t.filter(b=>b.connected).length,r=t.filter(b=>b.update_available).length,n=t.filter(b=>b.pending).length,c=e.alerts.filter(b=>b.devices_on>0).length,a=e.fleet_entities.network_issues?this.hass.states[e.fleet_entities.network_issues]?.state:void 0,l=Number(a)||0,u=t.length?s/t.length:0,m=new Map;t.forEach(b=>m.set(b.version??"unknown",(m.get(b.version??"unknown")??0)+1));let g=[...m.entries()].sort((b,f)=>f[1]-b[1]),v=new Map;t.forEach(b=>v.set(b.role,(v.get(b.role)??0)+1));let h=e.fleet_entities,x=26,E=2*Math.PI*x;return d`
      <ha-card>
        <div class="hero">
          <div class="identity">
            <div class="logo"><ha-icon icon="mdi:router-network"></ha-icon></div>
            <div class="who">
              <div class="eyebrow">CMR controller ${e.available?p:d`<span class="chip warn">unreachable</span>`}</div>
              <div class="name">${i?.identity??e.title}</div>
              <div class="meta">
                ${i?.board??""} ·
                <span class="mono">${i?.version??"?"}</span>
                ${i?.prerelease?d`<span class="chip">pre-release</span>`:p}
              </div>
            </div>
            <a class="open" href=${e.controller_url} target="_blank" rel="noreferrer" title="Open the router's web interface">
              <ha-icon icon="mdi:open-in-new"></ha-icon>
            </a>
          </div>

          <div class="stats">
            <button class="stat ring" @click=${()=>k(this,h.devices_online)}>
              <svg viewBox="0 0 64 64" class=${s===t.length?"status-ok":"status-offline"}>
                <circle cx="32" cy="32" r=${x} class="track"></circle>
                <circle cx="32" cy="32" r=${x} class="value"
                  stroke-dasharray=${`${E*u} ${E}`} transform="rotate(-90 32 32)"></circle>
              </svg>
              <div class="ring-text"><b>${s}</b><span>/${t.length}</span></div>
              <div class="label">online</div>
            </button>
            ${this._stat("mdi:update",r,"updates",h.updates_available,r?"update":"ok")}
            ${this._stat("mdi:bell-alert-outline",c,"alerts firing",h.alerts_firing,c?"alert":"ok")}
            ${this._stat("mdi:stethoscope",l,l===1?"issue":"issues",h.network_issues,l?"pending":"ok")}
            ${this._stat("mdi:link-variant-plus",n,"to pair",h.devices_online,n?"pending":"ok")}
          </div>
        </div>

        <div class="bars">
          <div class="bar-title">
            <span>Versions</span>
            <span class="muted">updated ${zt(e.last_update)}</span>
          </div>
          <div class="bar">
            ${g.map(([b,f],T)=>d`<div class="seg" title="${b}: ${f}"
                style="flex:${f};background:${ne[T%ne.length]}"></div>`)}
          </div>
          <div class="keys">
            ${g.map(([b,f],T)=>d`<span><i style="background:${ne[T%ne.length]}"></i>
                <span class="mono">${b}</span> <span class="muted">×${f}</span></span>`)}
            <span class="spacer"></span>
            ${[...v.entries()].map(([b,f])=>d`<span class="role" title=${Q[b]}><ha-icon icon=${S[b]}></ha-icon>${f}</span>`)}
          </div>
        </div>
      </ha-card>
    `}_stat(e,t,i,s,r){return d`
      <button class="stat status-${r}" @click=${()=>k(this,s)}>
        <ha-icon icon=${e}></ha-icon>
        <b>${t}</b>
        <div class="label">${i}</div>
      </button>
    `}static{this.styles=[C,y`
      ha-card { display: flex; flex-direction: column; container-type: inline-size; }
      .hero { display: flex; gap: 16px; padding: 16px; align-items: center; flex-wrap: wrap; }
      .identity { display: flex; gap: 12px; align-items: center; flex: 1 1 260px; min-width: 0; }
      .logo {
        width: 52px; height: 52px; border-radius: 16px; flex: none; display: grid; place-items: center;
        background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 55%, #000));
        color: var(--text-primary-color, #fff); --mdc-icon-size: 28px;
        box-shadow: 0 6px 18px color-mix(in srgb, var(--primary-color) 35%, transparent);
      }
      .who { min-width: 0; }
      .eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--cmr-muted); display: flex; gap: 6px; align-items: center; }
      .name { font-size: 22px; font-weight: 600; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .meta { font-size: 13px; color: var(--cmr-muted); display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
      .chip.warn { background: var(--cmr-alert); color: #fff; }
      .open { color: var(--cmr-muted); align-self: flex-start; --mdc-icon-size: 18px; }
      .open:hover { color: var(--primary-color); }

      .stats { display: flex; gap: 8px; flex: 1 1 300px; justify-content: flex-end; flex-wrap: wrap; }
      .stat {
        all: unset; cursor: pointer; box-sizing: border-box; flex: 1; min-width: 72px; max-width: 120px;
        padding: 10px 6px; border-radius: 14px; text-align: center; background: var(--cmr-surface-2);
        display: flex; flex-direction: column; align-items: center; gap: 2px; position: relative;
      }
      .stat:hover { outline: 1px solid var(--cmr-line); }
      .stat ha-icon { color: var(--status); --mdc-icon-size: 20px; }
      .stat b { font-size: 22px; line-height: 1.1; }
      .stat .label { font-size: 11px; color: var(--cmr-muted); }
      .stat.ring svg { width: 46px; height: 46px; }
      .ring .track { fill: none; stroke: var(--cmr-line); stroke-width: 6; }
      .ring .value { fill: none; stroke: var(--status); stroke-width: 6; stroke-linecap: round; transition: stroke-dasharray 0.6s ease; }
      .ring-text { position: absolute; top: 22px; left: 0; right: 0; text-align: center; font-size: 13px; }
      .ring-text b { font-size: 15px; }
      .ring-text span { color: var(--cmr-muted); }
      .stat.ring .label { margin-top: 2px; }

      .bars { padding: 0 16px 14px; margin-top: auto; }
      .bar-title { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
      .bar { display: flex; gap: 3px; height: 8px; border-radius: 4px; overflow: hidden; }
      .seg { min-width: 6px; }
      .keys { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-top: 8px; font-size: 12px; align-items: center; }
      .keys i { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 4px; }
      .keys .spacer { flex: 1; }
      .role { display: inline-flex; align-items: center; gap: 3px; color: var(--cmr-muted); --mdc-icon-size: 16px; }
      @container (max-width: 520px) {
        .stats { justify-content: stretch; }
        .stat { max-width: none; }
      }
    `]}};var ot=(o,e,t={})=>({type:"heading",heading:o,icon:e,heading_style:"title",...t});function Nt(o,e,t){return Promise.race([o,new Promise(i=>setTimeout(()=>i(t),e))])}function Ot(o,e,t){let i=n=>!!n&&!!e.states[n]&&e.states[n].state!=="unavailable",s=o.entities,r=[ot(o.identity,S[o.role],{heading_style:"subtitle",...o.device_id?{tap_action:{action:"navigate",navigation_path:`/config/devices/device/${o.device_id}`}}:{},badges:i(s.version)?[{type:"entity",entity:s.version,show_icon:!0}]:[]})];return i(s.connected)&&r.push({type:"tile",entity:s.connected,name:"Connection",state_content:["state","last_changed"]}),i(s.uptime)&&r.push({type:"tile",entity:s.uptime,name:"Up since"}),i(s.update)&&r.push({type:"tile",entity:s.update,name:"Firmware",grid_options:{columns:12}}),i(s.active_alerts)&&r.push({type:"tile",entity:s.active_alerts,name:"Alerts"}),t&&i(s.alert)&&r.push({type:"tile",entity:s.alert,name:"Last alert"}),{type:"grid",cards:r}}function Dt(o,e){let t=o.fleet_entities;return{title:"Network",path:"network",icon:"mdi:router-network",type:"sections",max_columns:3,badges:[[t.devices_online,"Online"],[t.updates_available,"Updates"],[t.alerts_firing,"Alerts firing"],[t.network_issues,"Issues"]].filter(([i])=>i).map(([i,s])=>({type:"entity",entity:i,name:s,show_name:!0})),sections:[{type:"grid",column_span:3,cards:[{...e,type:"custom:cmr-status-card"}]},{type:"grid",column_span:3,cards:[{...e,type:"custom:cmr-topology-card",height:480,grid_options:{columns:"full"}}]},{type:"grid",column_span:2,cards:[{...e,type:"custom:cmr-fleet-card",grid_options:{columns:"full"}}]},{type:"grid",cards:[{...e,type:"custom:cmr-alerts-card",grid_options:{columns:"full"}}]},{type:"grid",column_span:2,cards:[{...e,type:"custom:cmr-events-card",max_items:15,notable:!0,grid_options:{columns:"full"}}]},{type:"grid",cards:[{...e,type:"custom:cmr-upgrades-card",grid_options:{columns:"full"}}]}]}}function Ht(o,e){let t=o.alerts.some(r=>r.webhook),i=[...o.devices].sort(te),s=i.map(r=>r.entities.connected).filter(Boolean);return{title:"Devices",path:"devices",icon:"mdi:devices",type:"sections",max_columns:4,sections:[{type:"grid",column_span:4,cards:[ot("Connectivity, last 24 hours","mdi:chart-timeline-variant"),{type:"history-graph",hours_to_show:24,entities:s,grid_options:{columns:"full"}}]},...i.map(r=>Ot(r,e,t))]}}function Ut(o){return{title:"Events",path:"events",icon:"mdi:timeline-text-outline",type:"sections",max_columns:2,sections:[{type:"grid",column_span:2,cards:[{...o,type:"custom:cmr-events-card",max_items:100,grid_options:{columns:"full"}}]}]}}function It(o){return{title:"Topology",path:"topology",icon:"mdi:sitemap-outline",type:"panel",cards:[{...o,type:"custom:cmr-topology-card",height:760}]}}function nt(o,e){return{title:o.title??"Network",views:[{title:"Network",path:"network",cards:[{type:"markdown",content:`## CMR
${e}`}]}]}}var ae=class extends HTMLElement{static getCreateSuggestions(){return{title:"Network",icon:"mdi:router-network"}}static async generate(e,t){try{let i=await Nt($.once(t),8e3,[]),s=w(i,e.entry_id);if(!s)return nt(e,"No CMR controller is set up yet. Add the **CMR** integration under [Settings \u2192 Devices & services](/config/integrations/dashboard/add?domain=cmr).");let r=e.entry_id?{entry_id:e.entry_id}:{};return{title:e.title??"Network",views:[Dt(s,r),Ut(r),Ht(s,t),It(r)]}}catch(i){return console.error("cmr: dashboard strategy failed",i),nt(e,`The dashboard couldn't be built (${String(i)}). Reload the page to try again.`)}}};var P=184,R=62,ce=48,le="__auto__",jt="mdi:map-marker-radius-outline",Bt={copper:"Ethernet",fiber:"SFP / fiber",wireless:"Wireless",unknown:"Not detected"},Vt={fiber:"Fiber (SFP)",copper:"Copper (Ethernet)",wireless:"Wireless",logical:"Logical interface",uplink:"Link between layouts",unknown:"No ports detected"};function Te(o){return/^q?sfp/i.test(o)?"fiber":/^(ether|combo)/i.test(o)?"copper":/^(wifi|wlan|wl\d)/i.test(o)?"wireless":"logical"}var Kt={"":1,K:1024,M:1024**2,G:1024**3,T:1024**4};function at(o){let e=/^([\d.]+)\s*([KMGT]?)i?B?$/i.exec(o??"");return e?parseFloat(e[1])*(Kt[e[2].toUpperCase()]??1):0}function Ft(o,e,t=3){return o.x0<e.x1+t&&e.x0<o.x1+t&&o.y0<e.y1+t&&e.y0<o.y1+t}function Wt(o,e,t,i,s){let r=Math.hypot(t,i)||1,n=t/r,c=i/r,a=Math.min(n?P/2/Math.abs(n):1/0,c?R/2/Math.abs(c):1/0);return{x:o+n*(a+s),y:e+c*(a+s),ux:n,uy:c}}var de=class extends _{constructor(){super();this._userMoved=!1;this._fittedFor="";this._onKey=t=>{t.key==="Escape"&&this._clearHover()};this._clearHover=()=>{this._hover=void 0,this._hoverLink=void 0};this._path=[],this._view={x:0,y:0,k:1}}static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0},_path:{state:!0},_hover:{state:!0},_hoverLink:{state:!0},_view:{state:!0}}}setConfig(t){this._config={height:440,show_ports:!0,show_comments:!0,...t},this._path=t.layout?[t.layout]:[],this._userMoved=!1}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"title",selector:{text:{}}},{name:"layout",selector:{text:{}}},{name:"height",selector:{number:{min:200,max:1400,step:20,mode:"box",unit_of_measurement:"px"}}},{name:"show_ports",selector:{boolean:{}}},{name:"show_comments",selector:{boolean:{}}}],computeLabel:t=>({entry_id:"Controller",title:"Title",layout:"Start at layout (empty: the top layout)",height:"Height",show_ports:"Show port names on cables",show_comments:"Show link comments"})[t.name]}}getGridOptions(){return{columns:"full",rows:Math.round((this._config?.height??440)/56)+1,min_columns:6,min_rows:4}}getCardSize(){return Math.round((this._config?.height??440)/50)+1}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe(),window.addEventListener("keydown",this._onKey)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey),this._unsubscribe?.(),this._unsubscribe=void 0,this._resize?.disconnect(),this._resize=void 0}willUpdate(t){t.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=$.subscribe(this.hass,t=>{this._entry=w(t,this._config?.entry_id)})}_rootLayouts(t){let i=new Set(t.nodes.map(n=>n.target_layout).filter(Boolean)),s=new Set(t.nodes.map(n=>n.layout)),r=t.layouts.map(n=>n.name).filter(n=>!i.has(n)&&s.has(n));return r.length?r:t.layouts.map(n=>n.name).filter(n=>s.has(n))}_currentLayout(t){return this._path.length?this._path[this._path.length-1]:this._rootLayouts(t)[0]??le}_devicesIn(t,i,s=new Set){if(s.has(i))return[];s.add(i);let r=new Map(t.devices.map(c=>[c.key,c])),n=new Map;for(let c of t.nodes.filter(a=>a.layout===i))c.device_key&&r.has(c.device_key)&&n.set(c.device_key,r.get(c.device_key)),c.target_layout&&this._devicesIn(t,c.target_layout,s).forEach(a=>n.set(a.key,a));return[...n.values()]}_scene(t){let i=this._currentLayout(t),s=new Map(t.devices.map(v=>[v.key,v])),r,n;if(i===le)({nodes:r,links:n}=this._autoLayout(t));else{let v=t.nodes.filter(f=>f.layout===i),h=v.filter(f=>f.x!=null&&f.y!=null),x=h.length?Math.max(...h.map(f=>f.y)):0,E=h.length?Math.min(...h.map(f=>f.x)):0,b=0;r=v.map(f=>{let T=f.x==null||f.y==null,Ne=T?E+b*(P+40):f.x,Oe=T?x+R*2.4:f.y;if(T&&(b+=1),f.target_layout){let he=this._devicesIn(t,f.target_layout),dt=he.filter(ve=>ve.connected).length,me=he.map(L),pt=me.includes("offline")?"offline":me.includes("alert")?"alert":me.includes("update")?"update":"ok",ut=t.layouts.find(ve=>ve.name===f.target_layout)?.comment??null;return{id:f.name,name:f.name,x:Ne,y:Oe,kind:"site",target:f.target_layout,site:{online:dt,total:he.length,status:pt,comment:ut}}}let ue=f.device_key?s.get(f.device_key):void 0;return{id:f.name,name:ue?.identity??f.name,x:Ne,y:Oe,kind:ue?"device":"unknown",device:ue}}),n=t.links.filter(f=>f.layout===i)}let c=r.map(v=>v.x),a=r.map(v=>v.y),l=Math.min(...c,0)-P/2-ce,u=Math.min(...a,0)-R/2-ce;for(let v of r)v.x-=l,v.y-=u;let m=Math.max(...r.map(v=>v.x),0)+P/2+ce,g=Math.max(...r.map(v=>v.y),0)+R/2+ce;return{layout:i,nodes:r,links:n,width:m,height:g}}_autoLayout(t){let i=l=>l.controller?1:{gateway:0,lte:0,router:1,switch:2,ap:3,device:3}[l.role],s=new Map;for(let l of t.devices){let u=i(l);s.set(u,[...s.get(u)??[],l])}let r=Math.max(...[...s.values()].map(l=>l.length),1),n=[];[...s.keys()].sort().forEach((l,u)=>{let m=s.get(l).sort((v,h)=>v.identity.localeCompare(h.identity)),g=(r-m.length)*(P+48)/2;m.forEach((v,h)=>n.push({id:v.key,name:v.identity,kind:"device",device:v,x:g+h*(P+48),y:u*(R+90)}))});let c=t.devices.find(l=>l.controller),a=c?t.devices.filter(l=>!l.controller).map(l=>({id:l.key,layout:le,node1:c.key,node2:l.key,comment:null,ports:[]})):[];return{nodes:n,links:a}}updated(){let t=this.renderRoot.querySelector(".viewport");t&&!this._resize&&(this._resize=new ResizeObserver(()=>{this._userMoved||this._fit()}),this._resize.observe(t));let i=`${this._entry?.entry_id}|${this._path.join("/")}|${this._entry?this._scene(this._entry).nodes.length:0}`;this._entry&&i!==this._fittedFor&&(this._fittedFor=i,this._userMoved=!1,this._fit())}_fit(){let t=this.renderRoot.querySelector(".viewport");if(!t||!this._entry)return;let{width:i,height:s}=this._scene(this._entry),r=t.clientWidth,n=t.clientHeight;if(!r||!n)return;let c=Math.min(r/i,n/s,1.2),a={k:c,x:(r-i*c)/2,y:(n-s*c)/2};(Math.abs(a.k-this._view.k)>.001||Math.abs(a.x-this._view.x)>.5||Math.abs(a.y-this._view.y)>.5)&&(this._view=a)}_onWheel(t){if(!t.ctrlKey&&!t.metaKey)return;t.preventDefault();let i=t.currentTarget.getBoundingClientRect(),s=t.clientX-i.left,r=t.clientY-i.top,{x:n,y:c,k:a}=this._view,l=Math.min(2.5,Math.max(.25,a*Math.exp(-t.deltaY*.0018)));this._view={k:l,x:s-(s-n)*l/a,y:r-(r-c)*l/a},this._userMoved=!0,this._hover=void 0}_onPointerDown(t){t.pointerType==="touch"||t.button!==0||(this._clearHover(),this._drag={id:t.pointerId,x:t.clientX,y:t.clientY,vx:this._view.x,vy:this._view.y,moved:!1})}_onPointerMove(t){let i=this._drag;if(!i||i.id!==t.pointerId)return;let s=t.clientX-i.x,r=t.clientY-i.y;!i.moved&&Math.hypot(s,r)<4||(i.moved||t.currentTarget.setPointerCapture(t.pointerId),i.moved=!0,this._userMoved=!0,this._hover=void 0,this._view={...this._view,x:i.vx+s,y:i.vy+r})}_onPointerUp(t){this._drag?.moved&&t.currentTarget?.addEventListener("click",i=>i.stopPropagation(),{capture:!0,once:!0}),this._drag=void 0}_zoom(t){let i=this.renderRoot.querySelector(".viewport");if(!i)return;let s=i.clientWidth/2,r=i.clientHeight/2,{x:n,y:c,k:a}=this._view,l=Math.min(2.5,Math.max(.25,a*t));this._view={k:l,x:s-(s-n)*l/a,y:r-(r-c)*l/a},this._userMoved=!0}_resetView(){this._userMoved=!1,this._fit()}_open(t){t.kind==="site"&&t.target?(this._path=[...this._path.length?this._path:[this._currentLayout(this._entry)],t.target],this._hover=void 0):t.device&&k(this,t.device.entities.connected??t.device.entities.update)}_goTo(t){this._path=this._path.slice(0,t+1),this._hover=void 0}_selectRoot(t){this._path=[t],this._hover=void 0}_showHover(t,i){if(this._drag?.moved||!this.renderRoot.querySelector(".viewport"))return;let{x:r,y:n,k:c}=this._view;this._hover={node:t,x:t.x*c+r,y:(t.y+R/2)*c+n+8},i.stopPropagation()}render(){let t=this._entry,i=this._config?.height??440;if(!t)return d`<ha-card><div class="empty" style="height:${i}px">Waiting for the CMR controller…</div></ha-card>`;let s=this._scene(t),r=this._rootLayouts(t),n=this._path.length?this._path:[s.layout],c=new Map(s.nodes.map(h=>[h.id,h])),a=s.links.map(h=>this._linkInfo(h,c)).filter(h=>h!==void 0),l=["copper","fiber","wireless","unknown"].filter(h=>a.some(x=>x.kind===h)),{x:u,y:m,k:g}=this._view,v=t.layouts.find(h=>h.name===s.layout);return d`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:sitemap-outline"></ha-icon>
          <div class="crumbs">
            ${this._config.title?d`<span class="title">${this._config.title}</span>`:p}
            ${n.map((h,x)=>d`
                ${x?d`<ha-icon class="sep" icon="mdi:chevron-right"></ha-icon>`:p}
                <button class="crumb ${x===n.length-1?"current":""}" @click=${()=>this._goTo(x)}>
                  ${h===le?"All devices":h}
                </button>
              `)}
          </div>
          <div class="spacer"></div>
          ${r.length>1?d`<div class="roots">
                ${r.map(h=>d`<button class="root ${n[0]===h?"active":""}" @click=${()=>this._selectRoot(h)}>${h}</button>`)}
              </div>`:p}
        </div>
        ${v?.comment?d`<div class="subtitle">${v.comment}</div>`:p}
        <div
          class="viewport"
          style="height:${i}px"
          @wheel=${this._onWheel}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
          @dblclick=${this._resetView}
          @mouseleave=${()=>{this._hover=void 0,this._hoverLink=void 0}}
        >
          <div
            class="world"
            style="width:${s.width}px;height:${s.height}px;transform:translate(${u}px,${m}px) scale(${g})"
          >
            <svg class="wires" width=${s.width} height=${s.height}>
              ${a.map(h=>this._renderLink(h))}
            </svg>
            ${this._config.show_ports?a.map(h=>this._renderPorts(h)):p}
            ${this._config.show_comments?a.map(h=>this._renderComment(h)):p}
            ${s.nodes.map(h=>this._renderNode(h))}
          </div>
          ${this._hover?this._renderTooltip(this._hover):p}
          ${this._hoverLink&&!this._hover?this._renderLinkTooltip(this._hoverLink):p}
          <div class="controls">
            <button title="Zoom in" @click=${()=>this._zoom(1.25)}><ha-icon icon="mdi:plus"></ha-icon></button>
            <button title="Zoom out" @click=${()=>this._zoom(.8)}><ha-icon icon="mdi:minus"></ha-icon></button>
            <button title="Fit" @click=${this._resetView}><ha-icon icon="mdi:fit-to-screen-outline"></ha-icon></button>
          </div>
          <div class="legend">
            ${["ok","update","alert","offline"].map(h=>d`<span class="status-${h}"><i class="dot"></i>${I[h]}</span>`)}
            ${l.map(h=>d`<span><i class="wire-sample k-${h}"></i>${Bt[h]}</span>`)}
            ${a.some(h=>h.poe)?d`<span><i class="poe-sample"></i>PoE power</span>`:p}
          </div>
        </div>
      </ha-card>
    `}_linkState(t,i){let s=c=>c?.kind==="device"?c.device.connected:c?.kind==="site"?c.site.online>0:void 0,r=s(t),n=s(i);return r===!1||n===!1?"down":r===void 0||n===void 0?"unknown":"up"}_linkInfo(t,i){let s=i.get(t.node1),r=i.get(t.node2);if(!s||!r)return;let n=t.ports,c=[s.name,r.name],a=!1;if(!n.length&&s.kind==="site"&&r.kind==="site"){a=!0;let v=this._cableBetween(s.target,r.target);v&&(n=v.ports,c=v.names)}let l=n[0],u;if(l){let v=[Te(l.a.interface),Te(l.b.interface)];u=v.includes("fiber")?"fiber":v.includes("wireless")?"wireless":v.every(h=>h==="copper")?"copper":"logical"}else u=a&&!this._cableBetween(s.target,r.target)?"uplink":"unknown";let m;l?.a.poe==="powered-on"?m={from:s,to:r,port:l.a.interface}:l?.b.poe==="powered-on"&&(m={from:r,to:s,port:l.b.interface});let g=n.reduce((v,h)=>v+at(h.a.tx)+at(h.a.rx),0);return{link:t,a:s,b:r,state:this._linkState(s,r),kind:u,ports:n,endNames:c,poe:m,bytes:g}}_cableBetween(t,i){let s=this._entry,r=new Set(this._devicesIn(s,t).map(u=>u.key)),n=new Set(this._devicesIn(s,i).map(u=>u.key)),c=new Map(s.nodes.map(u=>[`${u.layout}\0${u.name}`,u.device_key])),a=new Map(s.devices.map(u=>[u.key,u])),l;for(let u of s.links){let m=c.get(`${u.layout}\0${u.node1}`),g=c.get(`${u.layout}\0${u.node2}`);if(!m||!g)continue;let v=r.has(m)&&n.has(g);if(!v&&!(r.has(g)&&n.has(m)))continue;let[h,x]=v?[m,g]:[g,m],E=v?u.ports:u.ports.map(f=>({a:f.b,b:f.a})),b={ports:E,names:[a.get(h)?.identity??h,a.get(x)?.identity??x]};(!l||E.length&&!l.ports.length)&&(l=b)}return l}_renderLink(t){let{a:i,b:s,state:r,kind:n,poe:c}=t,a=`M ${i.x} ${i.y} L ${s.x} ${s.y}`,l=r==="up"&&n!=="unknown"&&n!=="logical",u=Math.min(2.4,Math.max(.6,2.4-.3*Math.log10(t.bytes+1)));return Y`
      <g class="link ${r} k-${n}"
         @mouseenter=${m=>this._showLinkHover(t,m)}
         @mouseleave=${()=>this._hoverLink=void 0}>
        <path class="hit" d=${a}></path>
        <path class="wire" d=${a}></path>
        ${n==="fiber"?Y`<path class="core" d=${a}></path>`:p}
        ${l?Y`<path class="flow" d=${a} style="animation-duration:${u}s"></path>`:p}
        ${c&&r==="up"?Y`<circle class="power" r="3.6">
              <animateMotion dur="2.2s" repeatCount="indefinite"
                path=${`M ${c.from.x} ${c.from.y} L ${c.to.x} ${c.to.y}`}></animateMotion>
            </circle>`:p}
      </g>
    `}_renderPorts(t){let i=t.ports[0];if(!i)return p;let{a:s,b:r}=t,n=[this._chip(s,r,i.a,t.poe?.from===s),this._chip(r,s,i.b,t.poe?.from===r)];return Ft(n[0].box,n[1].box)&&(n=[this._chip(s,r,i.a,t.poe?.from===s,-1),this._chip(r,s,i.b,t.poe?.from===r,1)]),d`${n.map(c=>c.html)}`}_chip(t,i,s,r,n){let c=Wt(t.x,t.y,i.x-t.x,i.y-t.y,n?4:8),a=s.interface.length*6.6+12+(r?13:0),l=18,u=Math.abs(c.ux)>=Math.abs(c.uy),m=Math.abs(c.ux)<.35?-.5:c.ux>0?0:-1,g=Math.abs(c.uy)<.35?-.5:c.uy>0?0:-1,v=0,h=0;n&&(u?(g=n<0?-1:0,h=n*3):(m=n<0?-1:0,v=n*4));let x=c.x+m*a+v,E=c.y+g*l+h;return{box:{x0:x,y0:E,x1:x+a,y1:E+l},html:d`<div class="port m-${Te(s.interface)} ${r?"poe":""}"
        style="left:${c.x+v}px;top:${c.y+h}px;transform:translate(${m*100}%,${g*100}%)"
        title=${r?`${s.interface}: PoE out, powers ${i.name}`:`${s.interface} (${t.name})`}>
        ${r?d`<ha-icon icon="mdi:flash"></ha-icon>`:p}${s.interface}
      </div>`}}_renderComment(t){let{a:i,b:s,link:r}=t;return!r.comment||t.ports.length&&this._config.show_ports?p:d`<div class="comment" style="left:${(i.x+s.x)/2}px;top:${(i.y+s.y)/2}px" title=${r.comment}>
      ${r.comment}
    </div>`}_showLinkHover(t,i){if(this._drag?.moved)return;let s=this.renderRoot.querySelector(".viewport");if(!s)return;let r=s.getBoundingClientRect();this._hoverLink={info:t,x:i.clientX-r.left,y:i.clientY-r.top+14}}_renderLinkTooltip(t){let{info:i}=t,{a:s,b:r,link:n,poe:c,ports:a,endNames:l}=i,u=m=>m.tx||m.rx?d`<span class="mono">↑ ${m.tx??"\u2013"} · ↓ ${m.rx??"\u2013"}</span>`:"\u2013";return d`<div class="tooltip" style="left:${Math.max(8,t.x-150)}px;top:${t.y}px">
      <div class="tt-title">${s.name} ↔ ${r.name}</div>
      ${n.comment?d`<div class="muted">${n.comment}</div>`:p}
      <table>
        <tr><td>Medium</td><td>${Vt[i.kind]}</td></tr>
        ${a.map(m=>d`
            <tr><td>${l[0]}</td><td class="mono">${m.a.interface}</td></tr>
            <tr><td>${l[1]}</td><td class="mono">${m.b.interface}</td></tr>
          `)}
        ${c?d`<tr><td>Power</td><td><ha-icon class="inline poe" icon="mdi:flash"></ha-icon>
              ${c.from===s?l[0]:l[1]} <span class="mono">${c.port}</span>
              powers ${c.to===s?l[0]:l[1]}</td></tr>`:p}
        ${a[0]?d`<tr><td>Traffic</td><td>${l[0]}: ${u(a[0].a)}<br />${l[1]}: ${u(a[0].b)}</td></tr>`:p}
      </table>
    </div>`}_renderNode(t){let i=`left:${t.x-P/2}px;top:${t.y-R/2}px;width:${P}px;height:${R}px`;if(t.kind==="site"){let n=t.site;return d`
        <div class="node site status-${n.status}" style=${i} @click=${()=>this._open(t)}
             @mouseenter=${c=>this._showHover(t,c)} @mouseleave=${this._clearHover}>
          <div class="badge"><ha-icon icon=${this._config.icons?.[t.name]??jt}></ha-icon></div>
          <div class="text">
            <div class="name">${t.name}</div>
            <div class="sub"><i class="dot"></i>${n.online}/${n.total} online</div>
          </div>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        </div>
      `}if(t.kind==="unknown"||!t.device)return d`
        <div class="node unknown" style=${i} title="Not a CMR-managed device">
          <div class="badge"><ha-icon icon="mdi:help-network-outline"></ha-icon></div>
          <div class="text"><div class="name">${t.name}</div><div class="sub">Not managed</div></div>
        </div>
      `;let s=t.device,r=L(s);return d`
      <div class="node device status-${r} ${s.controller?"controller":""}" style=${i}
           @click=${()=>this._open(t)} @mouseenter=${n=>this._showHover(t,n)}
           @mouseleave=${this._clearHover}>
        <div class="badge"><ha-icon icon=${S[s.role]}></ha-icon></div>
        <div class="text">
          <div class="name">${s.identity}</div>
          <div class="sub">${s.board??Q[s.role]}</div>
          <div class="ver mono">
            ${s.version??"\u2013"}${s.update_available?d`<span class="up"> → ${s.available_version}</span>`:p}
          </div>
        </div>
        ${s.controller?d`<span class="crown" title="CMR controller"><ha-icon icon="mdi:crown-outline"></ha-icon></span>`:p}
        ${s.alerts?.on?d`<span class="count" title="Alerts firing">${s.alerts.on}</span>`:p}
      </div>
    `}_renderTooltip(t){let{node:i}=t,s;if(i.kind==="site"){let n=i.site;s=d`
        <div class="tt-title">${i.name}</div>
        ${n.comment?d`<div class="muted">${n.comment}</div>`:p}
        <div>${n.online} of ${n.total} devices online</div>
        <div class="muted">Click to open this layout</div>
      `}else if(i.device){let n=i.device;s=d`
        <div class="tt-title">${n.identity}${n.controller?d` <span class="chip">controller</span>`:p}</div>
        <div class="muted">${[n.board,n.model_code,n.arch].filter(Boolean).join(" \xB7 ")}</div>
        <table>
          <tr><td>Status</td><td class="status-${L(n)}"><i class="dot"></i> ${I[L(n)]}</td></tr>
          <tr><td>Version</td><td class="mono">${n.version??"\u2013"}${n.prerelease?" (pre-release)":""}</td></tr>
          <tr><td>Channel</td><td>${n.channel??"\u2013"}${n.available_version&&n.available_version!==n.version?d` <span class="muted">(${n.update_available?"update to":"offers"} <span class="mono">${n.available_version}</span>)</span>`:p}</td></tr>
          ${n.address?d`<tr><td>Address</td><td class="mono">${n.address}</td></tr>`:p}
          <tr><td>Uptime</td><td>${ee(n.uptime)}</td></tr>
          ${n.labels.length?d`<tr><td>Labels</td><td>${n.labels.map(c=>d`<span class="chip">${c}</span> `)}</td></tr>`:p}
          ${n.alerts?d`<tr><td>Alerts</td><td>${n.alerts.on} firing of ${n.alerts.total} rules</td></tr>`:p}
        </table>
      `}else return d``;let r=Math.max(8,t.x-150);return d`<div class="tooltip" style="left:${r}px;top:${t.y}px">${s}</div>`}static{this.styles=[C,y`
      .card-header { padding-bottom: 4px; flex-wrap: wrap; }
      .crumbs { display: flex; align-items: center; gap: 2px; min-width: 0; flex-wrap: wrap; }
      .title { margin-right: 8px; }
      .crumb {
        all: unset; cursor: pointer; padding: 2px 6px; border-radius: 6px;
        color: var(--cmr-muted); font-size: 15px;
      }
      .crumb:hover { background: var(--cmr-surface-2); color: var(--primary-text-color); }
      .crumb.current { color: var(--primary-text-color); font-weight: 500; }
      .sep { --mdc-icon-size: 16px; color: var(--cmr-muted); }
      .roots { display: flex; gap: 4px; flex-wrap: wrap; }
      .root {
        all: unset; cursor: pointer; font-size: 12px; padding: 3px 10px; border-radius: 999px;
        border: 1px solid var(--cmr-line); color: var(--cmr-muted);
      }
      .root.active { background: var(--primary-color); border-color: var(--primary-color); color: var(--text-primary-color, #fff); }
      .subtitle { padding: 0 16px 6px; font-size: 12px; color: var(--cmr-muted); }

      .viewport {
        position: relative; overflow: hidden; cursor: grab; touch-action: pan-y pinch-zoom;
        background:
          radial-gradient(circle, var(--cmr-line) 1px, transparent 1.2px) 0 0 / 22px 22px;
        border-top: 1px solid var(--cmr-line);
      }
      .viewport:active { cursor: grabbing; }
      .world { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
      .wires { position: absolute; inset: 0; overflow: visible; }

      .wires { pointer-events: none; }
      .link .hit { stroke: transparent; stroke-width: 16; fill: none; pointer-events: stroke; cursor: help; }
      .link .wire { stroke: var(--cmr-muted); stroke-width: 3; fill: none; opacity: 0.45; stroke-linecap: round; }
      .link.k-fiber .wire { stroke: var(--cmr-fiber); stroke-width: 5; opacity: 0.8; }
      .link .core { stroke: var(--cmr-surface); stroke-width: 1.4; fill: none; opacity: 0.9; }
      .link.k-wireless .wire { stroke: var(--cmr-update); stroke-dasharray: 1 6; stroke-width: 3; opacity: 0.7; }
      .link.k-unknown .wire, .link.k-logical .wire { stroke-dasharray: 2 7; stroke-width: 2.4; }
      .link.down .wire { stroke: var(--cmr-offline); opacity: 0.75; }
      .link .flow {
        stroke: var(--cmr-ok); stroke-width: 3; fill: none; stroke-dasharray: 5 19; stroke-linecap: round;
        animation: flow 1.6s linear infinite; opacity: 0.9;
      }
      .link.k-fiber .flow { stroke: var(--cmr-surface); stroke-width: 2; opacity: 1; }
      @keyframes flow { to { stroke-dashoffset: -24; } }
      .link .power { fill: var(--cmr-poe); filter: drop-shadow(0 0 3px var(--cmr-poe)); }
      @media (prefers-reduced-motion: reduce) {
        .link .flow { animation: none; }
        .link .power { display: none; }
      }
      .port {
        position: absolute; display: inline-flex; align-items: center; gap: 2px; white-space: nowrap;
        font: 600 10.5px/16px var(--cmr-mono); padding: 0 5px; border-radius: 6px;
        background: var(--cmr-surface); border: 1px solid var(--cmr-line); color: var(--cmr-muted);
        --mdc-icon-size: 12px;
      }
      .port.m-fiber { border-color: color-mix(in srgb, var(--cmr-fiber) 60%, transparent); color: var(--primary-text-color); }
      .port.poe { border-color: color-mix(in srgb, var(--cmr-poe) 70%, transparent); color: var(--primary-text-color); }
      .port.poe ha-icon, ha-icon.poe { color: var(--cmr-poe); }
      ha-icon.inline { --mdc-icon-size: 14px; vertical-align: -2px; }
      .comment {
        position: absolute; transform: translate(-50%, -50%); max-width: 170px;
        padding: 2px 8px; border-radius: 999px; font-size: 10.5px; line-height: 15px;
        background: var(--cmr-surface); border: 1px solid var(--cmr-line); color: var(--cmr-muted);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: auto;
      }

      .node {
        position: absolute; box-sizing: border-box; display: flex; align-items: center; gap: 10px;
        padding: 8px 10px; border-radius: 14px; cursor: pointer; user-select: none;
        background: var(--cmr-surface); border: 1px solid var(--cmr-line);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 14px rgba(0, 0, 0, 0.06);
        transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
      }
      .node:hover { transform: translateY(-1px); border-color: var(--status, var(--primary-color)); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
      .node .badge {
        position: relative; flex: none; width: 38px; height: 38px; border-radius: 11px;
        display: grid; place-items: center;
        background: color-mix(in srgb, var(--status, var(--cmr-muted)) 14%, transparent);
        color: var(--status, var(--cmr-muted));
      }
      .node .badge::after {
        content: ""; position: absolute; right: -3px; bottom: -3px; width: 11px; height: 11px;
        border-radius: 50%; background: var(--status, var(--cmr-muted)); border: 2px solid var(--cmr-surface);
      }
      .node.status-alert .badge::after, .node.status-offline .badge::after { animation: pulse 1.8s ease-out infinite; }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--status) 60%, transparent); }
        100% { box-shadow: 0 0 0 9px transparent; }
      }
      .node .text { min-width: 0; flex: 1; }
      .node .name { font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .node .sub { font-size: 11px; color: var(--cmr-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 5px; }
      .node .ver { font-size: 10.5px; color: var(--cmr-muted); white-space: nowrap; }
      .node .ver .up { color: var(--cmr-update); font-weight: 600; }
      .node.controller { border-color: color-mix(in srgb, var(--primary-color) 50%, var(--cmr-line)); }
      .node .crown { position: absolute; top: -10px; right: 10px; color: var(--primary-color); background: var(--cmr-surface); border-radius: 50%; padding: 1px; --mdc-icon-size: 16px; line-height: 0; }
      .node .count {
        position: absolute; top: -8px; left: 32px; min-width: 18px; height: 18px; border-radius: 9px;
        background: var(--cmr-alert); color: #fff; font-size: 11px; font-weight: 700; display: grid; place-items: center; padding: 0 4px;
      }
      .node.site { border-style: dashed; border-width: 1.5px; }
      .node.site .chev { color: var(--cmr-muted); --mdc-icon-size: 20px; }
      .node.unknown { opacity: 0.6; cursor: default; }

      .tooltip {
        position: absolute; z-index: 3; width: 300px; padding: 10px 12px; border-radius: 12px;
        background: var(--cmr-surface); border: 1px solid var(--cmr-line);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18); font-size: 12px; pointer-events: none;
      }
      .tooltip .tt-title { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
      .tooltip table { width: 100%; border-collapse: collapse; margin-top: 6px; }
      .tooltip td { padding: 2px 0; vertical-align: top; }
      .tooltip td:first-child { color: var(--cmr-muted); width: 1%; white-space: nowrap; padding-right: 12px; }
      .tooltip td i.dot { display: inline-block; }

      .controls { position: absolute; right: 10px; top: 10px; display: flex; flex-direction: column; gap: 4px; }
      .controls button {
        all: unset; cursor: pointer; width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center;
        background: var(--cmr-surface); border: 1px solid var(--cmr-line); color: var(--cmr-muted); --mdc-icon-size: 18px;
      }
      .controls button:hover { color: var(--primary-text-color); }
      .legend {
        position: absolute; left: 10px; bottom: 8px; display: flex; flex-wrap: wrap; gap: 4px 12px;
        font-size: 11px; color: var(--cmr-muted); background: color-mix(in srgb, var(--cmr-surface) 85%, transparent);
        padding: 4px 8px; border-radius: 8px; pointer-events: none;
      }
      .legend span { display: inline-flex; align-items: center; gap: 5px; }
      .wire-sample { display: inline-block; width: 18px; height: 0; border-top: 3px solid var(--cmr-muted); opacity: 0.8; }
      .wire-sample.k-fiber { border-top: 4px solid var(--cmr-fiber); }
      .wire-sample.k-wireless { border-top: 3px dotted var(--cmr-update); }
      .wire-sample.k-unknown { border-top: 2.5px dashed var(--cmr-muted); }
      .poe-sample { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--cmr-poe); box-shadow: 0 0 4px var(--cmr-poe); }
      @media (max-width: 600px) { .legend { display: none; } }
    `]}};var qt={done:"mdi:check-circle",failed:"mdi:close-circle",running:"mdi:progress-upload",scheduled:"mdi:calendar-clock",waiting:"mdi:timer-sand"};function ze(o){return(o??"").split(",").map(e=>e.trim()).filter(Boolean)}function Yt(o){let[e,t]=(o.success??"").split("/").map(Number);return o.state==="done"&&t&&e<t?"failed":o.state??"waiting"}var pe=class extends _{static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0}}}setConfig(e){this._config={jobs:5,...e}}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"title",selector:{text:{}}},{name:"jobs",selector:{number:{min:0,max:30,mode:"box"}}}],computeLabel:e=>({entry_id:"Controller",title:"Title",jobs:"Recent jobs to show"})[e.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=$.subscribe(this.hass,e=>{this._entry=w(e,this._config?.entry_id)})}render(){let e=this._entry;if(!e)return d`<ha-card><div class="empty">Waiting for the CMR controller…</div></ha-card>`;let t=e.devices.filter(r=>r.update_available).length,i=e.upgrade_rules.filter(r=>r.dynamic!=="true"||e.devices.some(n=>n.upgrade_rule===r.name)),s=[...e.upgrade_jobs].sort((r,n)=>(n.schedule_time??"").localeCompare(r.schedule_time??"")).slice(0,this._config.jobs??5);return d`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:update"></ha-icon>
          <span>${this._config.title??"Upgrades"}</span>
          ${t?d`<span class="chip upd">${t} available</span>`:d`<span class="chip">up to date</span>`}
        </div>

        ${i.length?i.map(r=>this._rule(e,r)):d`<div class="empty small">No upgrade rules. Devices are checked against their channel only.</div>`}

        ${s.length?d`<div class="section">Recent jobs</div>
              <div class="jobs">
                ${s.map(r=>{let n=Yt(r);return d`<div class="job js-${n}">
                    <ha-icon icon=${qt[n]??"mdi:circle-outline"}></ha-icon>
                    <div class="what">
                      <div><span class="mono">${r.channel??"?"}</span> → ${ze(r.labels).join(", ")||"all"}</div>
                      <div class="muted small">${r.schedule_time??""}${r.run_time?` \xB7 took ${r.run_time}`:""}</div>
                    </div>
                    <div class="ok mono">${r.success||"\u2013"}</div>
                  </div>`})}
              </div>`:p}
      </ha-card>
    `}_rule(e,t){let i=e.devices.filter(a=>a.upgrade_rule===t.name),s=ze(t.order),r=s.length?s.map(a=>({label:a,devices:i.filter(l=>l.labels.includes(a))})):[{label:ze(t.labels).join(", ")||"all",devices:i}],n=new Set(r.flatMap(a=>a.devices.map(l=>l.key))),c=i.filter(a=>!n.has(a.key));return c.length&&r.push({label:"other",devices:c}),d`
      <div class="rule">
        <div class="rule-head">
          <b>${t.name}</b>
          <span class="muted small">
            ${[t.channel&&`channel ${t.channel}`,t.strategy,t.fail_policy&&`on failure: ${t.fail_policy}`].filter(Boolean).join(" \xB7 ")}
          </span>
        </div>
        ${t.comment?d`<div class="muted small comment">${t.comment}</div>`:p}
        <div class="pipeline">
          ${r.map((a,l)=>d`
              ${l?d`<ha-icon class="arrow" icon="mdi:chevron-right"></ha-icon>`:p}
              <div class="step">
                <div class="step-label"><span class="n">${l+1}</span>${a.label}</div>
                <div class="devs">
                  ${a.devices.map(u=>d`<button class="dev status-${L(u)}" title="${u.identity} · ${u.version}"
                      @click=${()=>k(this,u.entities.update)}><ha-icon icon=${S[u.role]}></ha-icon></button>`)}
                  ${a.devices.length?p:d`<span class="muted small">none</span>`}
                </div>
              </div>
            `)}
        </div>
      </div>
    `}static{this.styles=[C,y`
      .chip.upd { background: var(--cmr-update); color: #fff; }
      .small { font-size: 12px; }
      .rule { margin: 0 12px 10px; padding: 10px 12px; border-radius: 12px; background: var(--cmr-surface-2); }
      .rule-head { display: flex; flex-wrap: wrap; gap: 4px 10px; align-items: baseline; }
      .comment { margin-top: 2px; }
      .pipeline { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 4px; margin-top: 10px; }
      .arrow { color: var(--cmr-muted); flex: none; --mdc-icon-size: 18px; }
      .step { flex: 1 0 auto; min-width: 84px; padding: 6px 8px; border-radius: 10px; background: var(--cmr-surface); border: 1px solid var(--cmr-line); }
      .step-label { font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
      .n { width: 16px; height: 16px; border-radius: 50%; display: grid; place-items: center; font-size: 10px; background: var(--primary-color); color: var(--text-primary-color, #fff); }
      .devs { display: flex; gap: 4px; flex-wrap: wrap; }
      .dev {
        all: unset; cursor: pointer; width: 26px; height: 26px; border-radius: 8px; display: grid; place-items: center;
        background: color-mix(in srgb, var(--status) 14%, transparent); color: var(--status); --mdc-icon-size: 16px;
      }
      .section { padding: 4px 16px 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--cmr-muted); }
      .jobs { padding: 0 8px 10px; }
      .job { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 10px; font-size: 13px; }
      .job ha-icon { --mdc-icon-size: 20px; }
      .js-done ha-icon { color: var(--cmr-ok); }
      .js-failed ha-icon { color: var(--cmr-alert); }
      .js-running ha-icon, .js-scheduled ha-icon { color: var(--cmr-update); }
      .what { flex: 1; min-width: 0; }
      .ok { font-size: 12px; color: var(--cmr-muted); }
    `]}};var ct="https://github.com/trakais/ha-cmr",lt=[["cmr-status-card",oe,"CMR status","Controller, devices online, updates and alerts at a glance."],["cmr-topology-card",de,"CMR topology","Live network map drawn from the controller's CMR layouts."],["cmr-fleet-card",re,"CMR devices","Every managed device with model, version, uptime and labels."],["cmr-alerts-card",ie,"CMR alerts","Alert rules, what is firing, and pushing alerts to Home Assistant."],["cmr-upgrades-card",pe,"CMR upgrades","Upgrade rules as a rollout pipeline, plus recent jobs."],["cmr-events-card",se,"CMR events","Network timeline from the controller's log and changes, with detected issues."]];for(let[o,e]of lt)customElements.get(o)||customElements.define(o,e);window.customCards=window.customCards||[];for(let[o,,e,t]of lt)window.customCards.some(i=>i.type===o)||window.customCards.push({type:o,name:e,description:t,preview:!1,documentationURL:ct});customElements.get("ll-strategy-dashboard-cmr")||customElements.define("ll-strategy-dashboard-cmr",ae);window.customStrategies=window.customStrategies||[];window.customStrategies.some(o=>o.type==="cmr")||window.customStrategies.push({type:"cmr",strategyType:"dashboard",name:"CMR network",description:"A complete network dashboard generated from your CMR controller: status, topology, devices, alerts and upgrades.",documentationURL:ct});console.info("%c CMR %c cards loaded ","background:#3a6ea5;color:#fff;border-radius:3px 0 0 3px","background:#ddd;color:#333;border-radius:0 3px 3px 0");
