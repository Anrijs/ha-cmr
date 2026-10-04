var X=globalThis,J=X.ShadowRoot&&(X.ShadyCSS===void 0||X.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_e=Symbol(),Ie=new WeakMap,j=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==_e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(J&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=Ie.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Ie.set(t,e))}return e}toString(){return this.cssText}},je=n=>new j(typeof n=="string"?n:n+"",void 0,_e),y=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((i,s,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new j(t,n,_e)},Be=(n,e)=>{if(J)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=X.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,n.appendChild(i)}},xe=J?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return je(t)})(n):n;var{is:bt,defineProperty:_t,getOwnPropertyDescriptor:xt,getOwnPropertyNames:yt,getOwnPropertySymbols:$t,getPrototypeOf:wt}=Object,Z=globalThis,Ve=Z.trustedTypes,kt=Ve?Ve.emptyScript:"",Ct=Z.reactiveElementPolyfillSupport,B=(n,e)=>n,ye={toAttribute(n,e){switch(e){case Boolean:n=n?kt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},We=(n,e)=>!bt(n,e),Ke={attribute:!0,type:String,converter:ye,reflect:!1,useDefault:!1,hasChanged:We};Symbol.metadata??=Symbol("metadata"),Z.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ke){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&_t(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:r}=xt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let d=s?.call(this);r?.call(this,o),this.requestUpdate(e,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ke}static _$Ei(){if(this.hasOwnProperty(B("elementProperties")))return;let e=wt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(B("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(B("properties"))){let t=this.properties,i=[...yt(t),...$t(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(xe(s))}else e!==void 0&&t.push(xe(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Be(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:ye).toAttribute(t,i.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:ye;this._$Em=s;let d=o.fromAttribute(t,r.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(e!==void 0){let o=this.constructor;if(s===!1&&(r=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??We)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:o}=r,d=this[s];o!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,r,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[B("elementProperties")]=new Map,A[B("finalized")]=new Map,Ct?.({ReactiveElement:A}),(Z.reactiveElementVersions??=[]).push("2.1.2");var Ae=globalThis,Fe=n=>n,Q=Ae.trustedTypes,qe=Q?Q.createPolicy("lit-html",{createHTML:n=>n}):void 0,Qe="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,et="?"+L,Et=`<${et}>`,R=document,K=()=>R.createComment(""),W=n=>n===null||typeof n!="object"&&typeof n!="function",Me=Array.isArray,St=n=>Me(n)||typeof n?.[Symbol.iterator]=="function",$e=`[ 	
\f\r]`,V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ye=/-->/g,Ge=/>/g,P=RegExp(`>|${$e}(?:([^\\s"'>=/]+)(${$e}*=${$e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xe=/'/g,Je=/"/g,tt=/^(?:script|style|textarea|title)$/i,Le=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),l=Le(1),Y=Le(2),si=Le(3),z=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Ze=new WeakMap,T=R.createTreeWalker(R,129);function it(n,e){if(!Me(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return qe!==void 0?qe.createHTML(e):e}var At=(n,e)=>{let t=n.length-1,i=[],s,r=e===2?"<svg>":e===3?"<math>":"",o=V;for(let d=0;d<t;d++){let a=n[d],c,u,h=-1,f=0;for(;f<a.length&&(o.lastIndex=f,u=o.exec(a),u!==null);)f=o.lastIndex,o===V?u[1]==="!--"?o=Ye:u[1]!==void 0?o=Ge:u[2]!==void 0?(tt.test(u[2])&&(s=RegExp("</"+u[2],"g")),o=P):u[3]!==void 0&&(o=P):o===P?u[0]===">"?(o=s??V,h=-1):u[1]===void 0?h=-2:(h=o.lastIndex-u[2].length,c=u[1],o=u[3]===void 0?P:u[3]==='"'?Je:Xe):o===Je||o===Xe?o=P:o===Ye||o===Ge?o=V:(o=P,s=void 0);let v=o===P&&n[d+1].startsWith("/>")?" ":"";r+=o===V?a+Et:h>=0?(i.push(c),a.slice(0,h)+Qe+a.slice(h)+L+v):a+L+(h===-2?d:v)}return[it(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},F=class n{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0,d=e.length-1,a=this.parts,[c,u]=At(e,t);if(this.el=n.createElement(c,i),T.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=T.nextNode())!==null&&a.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let h of s.getAttributeNames())if(h.endsWith(Qe)){let f=u[o++],v=s.getAttribute(h).split(L),m=/([.?@])?(.*)/.exec(f);a.push({type:1,index:r,name:m[2],strings:v,ctor:m[1]==="."?ke:m[1]==="?"?Ce:m[1]==="@"?Ee:U}),s.removeAttribute(h)}else h.startsWith(L)&&(a.push({type:6,index:r}),s.removeAttribute(h));if(tt.test(s.tagName)){let h=s.textContent.split(L),f=h.length-1;if(f>0){s.textContent=Q?Q.emptyScript:"";for(let v=0;v<f;v++)s.append(h[v],K()),T.nextNode(),a.push({type:2,index:++r});s.append(h[f],K())}}}else if(s.nodeType===8)if(s.data===et)a.push({type:2,index:r});else{let h=-1;for(;(h=s.data.indexOf(L,h+1))!==-1;)a.push({type:7,index:r}),h+=L.length-1}r++}}static createElement(e,t){let i=R.createElement("template");return i.innerHTML=e,i}};function H(n,e,t=n,i){if(e===z)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,r=W(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=H(n,s._$AS(n,e.values),s,i)),e}var we=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??R).importNode(t,!0);T.currentNode=s;let r=T.nextNode(),o=0,d=0,a=i[0];for(;a!==void 0;){if(o===a.index){let c;a.type===2?c=new q(r,r.nextSibling,this,e):a.type===1?c=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(c=new Se(r,this,e)),this._$AV.push(c),a=i[++d]}o!==a?.index&&(r=T.nextNode(),o++)}return T.currentNode=R,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},q=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=H(this,e,t),W(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==z&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):St(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&W(this._$AH)?this._$AA.nextSibling.data=e:this.T(R.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=F.createElement(it(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let r=new we(s,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=Ze.get(e.strings);return t===void 0&&Ze.set(e.strings,t=new F(e)),t}k(e){Me(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let r of e)s===t.length?t.push(i=new n(this.O(K()),this.O(K()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=Fe(e).nextSibling;Fe(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},U=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=p}_$AI(e,t=this,i,s){let r=this.strings,o=!1;if(r===void 0)e=H(this,e,t,0),o=!W(e)||e!==this._$AH&&e!==z,o&&(this._$AH=e);else{let d=e,a,c;for(e=r[0],a=0;a<r.length-1;a++)c=H(this,d[i+a],t,a),c===z&&(c=this._$AH[a]),o||=!W(c)||c!==this._$AH[a],c===p?e=p:e!==p&&(e+=(c??"")+r[a+1]),this._$AH[a]=c}o&&!s&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ke=class extends U{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},Ce=class extends U{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},Ee=class extends U{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=H(this,e,t,0)??p)===z)return;let i=this._$AH,s=e===p&&i!==p||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==p&&(i===p||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Se=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){H(this,e)}};var Mt=Ae.litHtmlPolyfillSupport;Mt?.(F,q),(Ae.litHtmlVersions??=[]).push("3.3.3");var st=(n,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let r=t?.renderBefore??null;i._$litPart$=s=new q(e.insertBefore(K(),r),r,void 0,t??{})}return s._$AI(n),s};var Pe=globalThis,_=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=st(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}};_._$litElement$=!0,_.finalized=!0,Pe.litElementHydrateSupport?.({LitElement:_});var Lt=Pe.litElementPolyfillSupport;Lt?.({LitElement:_});(Pe.litElementVersions??=[]).push("4.2.2");var Te=class{constructor(){this.listeners=new Set}subscribe(e,t){return this.listeners.add(t),this.latest&&t(this.latest),this.unsubscribe||(this.unsubscribe=e.connection.subscribeMessage(i=>{this.latest=i.entries,this.listeners.forEach(s=>s(i.entries))},{type:"cmr/subscribe"}),this.unsubscribe.catch(i=>{console.error("cmr: subscription failed",i),this.unsubscribe=void 0})),()=>{if(this.listeners.delete(t),this.listeners.size===0&&this.unsubscribe){let i=this.unsubscribe;this.unsubscribe=void 0,this.latest=void 0,i.then(s=>s()).catch(()=>{})}}}once(e){return this.latest?Promise.resolve(this.latest):new Promise(t=>{let i,s=!1;i=this.subscribe(e,r=>{s||(s=!0,queueMicrotask(()=>i?.()),t(r))})})}},$=new Te;function w(n,e){if(n?.length)return n.find(t=>t.entry_id===e)??n[0]}var Re=class{constructor(e){this.entryId=e;this.listeners=new Set;this.events=[];this.issues=[];this.loaded=!1}subscribe(e,t){return this.listeners.add(t),this.loaded&&t(this.events,this.issues),this.unsubscribe||(this.unsubscribe=e.connection.subscribeMessage(i=>{this.events=i.reset?i.events:[...this.events,...i.events].slice(-1e3),this.issues=i.issues,this.loaded=!0,this.listeners.forEach(s=>s(this.events,this.issues))},{type:"cmr/events/subscribe",limit:1e3,...this.entryId?{entry_id:this.entryId}:{}}),this.unsubscribe.catch(i=>{console.error("cmr: events subscription failed",i),this.unsubscribe=void 0})),()=>{if(this.listeners.delete(t),this.listeners.size===0&&this.unsubscribe){let i=this.unsubscribe;this.unsubscribe=void 0,this.loaded=!1,this.events=[],i.then(s=>s()).catch(()=>{})}}}},ze=class{constructor(){this.feeds=new Map}subscribe(e,t,i){let s=t??"",r=this.feeds.get(s);return r||(r=new Re(t),this.feeds.set(s,r)),r.subscribe(e,i)}},rt=new ze;function O(n){return n.controller?"mdi:router-network":"mdi:router"}function M(n){return n.pending?"pending":n.connected?n.alerts?.on?"alert":n.update_available?"update":"ok":"offline"}var I={ok:"Online",update:"Update available",alert:"Alert firing",pending:"Waiting to pair",offline:"Disconnected"};function ee(n){if(n==null)return"\u2013";let e=Math.floor(n/86400),t=Math.floor(n%86400/3600),i=Math.floor(n%3600/60);return e?`${e}d ${t}h`:t?`${t}h ${i}m`:i?`${i}m`:`${Math.floor(n)}s`}function te(n,e){return n.controller!==e.controller?n.controller?-1:1:n.identity.localeCompare(e.identity)}async function nt(n){try{if(navigator.clipboard)return await navigator.clipboard.writeText(n),!0}catch{}let e=document.createElement("textarea");e.value=n,e.setAttribute("readonly",""),e.style.position="fixed",e.style.opacity="0",document.body.appendChild(e),e.select();let t=!1;try{t=document.execCommand("copy")}catch{t=!1}return e.remove(),t}function Pt(n,e,t){n.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}function k(n,e){e&&Pt(n,"hass-more-info",{entityId:e})}function Ne(n){history.pushState(null,"",n),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}var C=y`
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
  /* Product photos sit on a light "pedestal" in every theme: some photos have
     opaque white backgrounds, and white devices need contrast on light cards. */
  .badge.photo {
    background: linear-gradient(160deg, #fbfbfc, #e9ebef) !important;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }
  .badge.photo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 9%;
    box-sizing: border-box;
    display: block;
    /* White photo backgrounds (JPGs, some PNGs) take on the tile's colour. */
    mix-blend-mode: multiply;
  }
  .badge.photo ha-icon {
    display: none;
  }
  .badge.photo.broken img {
    display: none;
  }
  .badge.photo.broken ha-icon {
    display: inline-flex;
    color: #5f6368;
  }
`;function ie(n,e=""){return n.product?.image?l`<div class="badge photo ${e}" title=${n.product.name}>
      <img src=${n.product.image} alt=${n.product.name} loading="lazy" referrerpolicy="no-referrer"
        @error=${t=>t.target.parentElement.classList.add("broken")} />
      <ha-icon icon=${O(n)}></ha-icon>
    </div>`:l`<div class="badge ${e}"><ha-icon icon=${O(n)}></ha-icon></div>`}function N(n){return(n.product&&!n.product.ambiguous?n.product:void 0)?.name??n.board??"Device"}function G(n){return n.product&&!n.product.ambiguous?n.product.code:n.model_code}var ot=["critical","high","medium","low"],at={critical:"mdi:alert-octagon",high:"mdi:alert",medium:"mdi:alert-circle-outline",low:"mdi:information-outline"};function Tt(n){if(!n)return"";let e=(Date.now()-new Date(n).getTime())/1e3;return e<60?"just now":e<3600?`${Math.round(e/60)} min ago`:e<86400?`${Math.round(e/3600)} h ago`:`${Math.round(e/86400)} d ago`}var se=class extends _{static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0},_setup:{state:!0},_copied:{state:!0}}}setConfig(e){this._config=e}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"title",selector:{text:{}}},{name:"hide_disabled",selector:{boolean:{}}}],computeLabel:e=>({entry_id:"Controller",title:"Title",hide_disabled:"Hide disabled rules"})[e.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){return 2+(this._entry?.alerts.length??4)}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=$.subscribe(this.hass,e=>{this._entry=w(e,this._config?.entry_id)})}async _toggleSetup(){if(this._setup!==void 0){this._setup=void 0;return}this._setup=null;try{this._setup=await this.hass.connection.sendMessagePromise({type:"cmr/alert_setup",entry_id:this._entry.entry_id})}catch(e){console.error("cmr: alert setup",e),this._setup=void 0}}async _copy(){this._setup&&await nt(this._setup.script)&&(this._copied=!0,setTimeout(()=>this._copied=!1,1800))}render(){let e=this._entry;if(!e)return l`<ha-card><div class="empty">Waiting for the CMR controller…</div></ha-card>`;let t=e.alerts.filter(a=>!(this._config.hide_disabled&&a.disabled)).sort((a,c)=>+(c.devices_on>0)-+(a.devices_on>0)||Number(a.disabled)-Number(c.disabled)||ot.indexOf(a.severity)-ot.indexOf(c.severity)||a.name.localeCompare(c.name)),i=t.filter(a=>a.devices_on>0).length,s=e.alerts.filter(a=>a.webhook).length,r=e.fleet_entities.fleet_alert,o=r?this.hass.states[r]:void 0,d=o?.attributes??{};return l`
      <ha-card>
        <div class="card-header">
          <ha-icon icon=${i?"mdi:bell-alert":"mdi:bell-check-outline"}></ha-icon>
          <span>${this._config.title??"Alerts"}</span>
          ${i?l`<span class="chip firing">${i} firing</span>`:l`<span class="chip">all quiet</span>`}
          <div class="spacer"></div>
        </div>

        ${o&&o.state!=="unknown"&&o.state!=="unavailable"?l`<button class="last sev-${d.event_type}" @click=${()=>k(this,r)}>
              <ha-icon icon=${at[d.event_type]??"mdi:bell"}></ha-icon>
              <div>
                <div><b>${d.alert}</b>${d.device?l` · ${d.device}`:p}</div>
                <div class="muted small">Last pushed alert · ${Tt(o.state)}</div>
              </div>
            </button>`:p}

        <div class="rules">
          ${t.map(a=>this._rule(a))}
          ${t.length?p:l`<div class="empty">No alert rules on the controller.</div>`}
        </div>

        ${this.hass.user?.is_admin?l`<div class="footer">
              <button class="link" @click=${this._toggleSetup}>
                <ha-icon icon="mdi:webhook"></ha-icon>
                ${s?`${s} of ${e.alerts.length} rules push to Home Assistant`:"Push alerts to Home Assistant instantly"}
                <ha-icon icon=${this._setup!==void 0?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
              </button>
              ${this._setup===null?l`<div class="muted small">Loading…</div>`:p}
              ${this._setup?l`<div class="setup">
                    <div class="small">Paste into the controller's terminal. Each alert rule gets an HTTP action that calls Home Assistant; edit <code>find</code> to choose rules.</div>
                    <pre>${this._setup.script}</pre>
                    <button class="copy" @click=${this._copy}>
                      <ha-icon icon=${this._copied?"mdi:check":"mdi:content-copy"}></ha-icon>${this._copied?"Copied":"Copy script"}
                    </button>
                  </div>`:p}
            </div>`:p}
      </ha-card>
    `}_rule(e){let t=e.devices_on>0;return l`
      <button class="rule sev-${e.severity} ${t?"on":""} ${e.disabled?"disabled":""}"
              @click=${()=>k(this,e.entity_id)}>
        <span class="stripe"></span>
        <ha-icon class="sev" icon=${at[e.severity]}></ha-icon>
        <div class="body">
          <div class="title">
            <span class="name">${e.name}</span>
            ${e.webhook?l`<ha-icon class="hook" icon="mdi:webhook" title="Pushes to a webhook"></ha-icon>`:p}
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
    `]}};var Rt=new Set(["insight","device","alert","upgrade","security","config"]),zt=n=>Rt.has(n.category)||n.severity==="warning"||n.severity==="error",re={insight:{icon:"mdi:stethoscope",label:"Issues"},device:{icon:"mdi:router-network",label:"Devices"},alert:{icon:"mdi:bell-outline",label:"Alerts"},upgrade:{icon:"mdi:update",label:"Upgrades"},wifi:{icon:"mdi:wifi",label:"Wi-Fi"},link:{icon:"mdi:ethernet",label:"Links"},security:{icon:"mdi:shield-alert-outline",label:"Security"},login:{icon:"mdi:account-key-outline",label:"Logins"},config:{icon:"mdi:cog-outline",label:"Config"},dhcp:{icon:"mdi:ip-network-outline",label:"DHCP"},system:{icon:"mdi:cog-transfer-outline",label:"System"},api:{icon:"mdi:api",label:"API logins"}},ct={icon:"mdi:text-box-outline",label:"Other"};function lt(n){return re[n]?re[n]:n?{...ct,label:n[0].toUpperCase()+n.slice(1)}:ct}function Nt(n){let e=n.data?.event;return n.category==="wifi"?e==="disconnected"?"mdi:wifi-off":e==="roamed"?"mdi:wifi-sync":"mdi:wifi-plus":n.category==="link"?n.data?.state==="down"?"mdi:ethernet-off":"mdi:ethernet":n.category==="device"?e==="disconnected"?"mdi:lan-disconnect":e==="rebooted"?"mdi:restart":"mdi:lan-connect":n.category==="insight"&&e==="resolved"?"mdi:check-circle-outline":lt(n.category).icon}function Dt(n){let e=n.data??{},t=e.mac??e.interface??e.user??e.rule_id??e.key??n.title;return`${n.category}|${n.device_key??""}|${String(t)}`}var Ht=864e5,ne=class extends _{constructor(){super();this._loaded=!1;this._events=[],this._issues=[],this._category="",this._device="",this._search="",this._open=new Set,this._limit=50}static{this.properties={hass:{attribute:!1},_config:{state:!0},_events:{state:!0},_issues:{state:!0},_category:{state:!0},_device:{state:!0},_search:{state:!0},_open:{state:!0},_limit:{state:!0},_notable:{state:!0}}}setConfig(t){this._unsubscribe&&t.entry_id!==this._config?.entry_id&&(this._unsubscribe(),this._unsubscribe=void 0,this._loaded=!1),this._config={show_issues:!0,show_filters:!0,hide_categories:["api"],max_items:50,...t},!this._unsubscribe&&this.hass&&this.isConnected&&this._subscribe(),this._limit=this._config.max_items??50,this._device=t.device??"",this._notable=!!t.notable}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"title",selector:{text:{}}},{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"device",selector:{text:{}}},{name:"max_items",selector:{number:{min:5,max:500,mode:"box"}}},{name:"notable",selector:{boolean:{}}},{name:"show_issues",selector:{boolean:{}}},{name:"show_filters",selector:{boolean:{}}}],computeLabel:t=>({title:"Title",entry_id:"Controller (default: all)",device:"Only this device (identity)",max_items:"Rows to show",notable:"Start with notable events only",show_issues:"Show detected issues",show_filters:"Show filters"})[t.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(t){t.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=rt.subscribe(this.hass,this._config?.entry_id,(t,i)=>{this._events=t,this._issues=i,this._loaded=!0})}_visible(){let t=this._config,i=this._search.trim().toLowerCase(),s=new Set(t.hide_categories??[]);return this._events.filter(r=>{if(this._notable&&!this._category&&!zt(r))return!1;if(this._category){if(r.category!==this._category)return!1}else if(t.categories?.length?!t.categories.includes(r.category):s.has(r.category))return!1;return!(this._device&&r.device_name!==this._device||i&&!`${r.title} ${r.message} ${r.device_name??""}`.toLowerCase().includes(i))})}_rows(t){let i=[];for(let s=t.length-1;s>=0;s--){let r=t[s],o=Dt(r),d=i[i.length-1],a=d&&new Date(d.events[0].time).toDateString()===new Date(r.time).toDateString();d&&d.key===o&&a&&r.category!=="insight"?d.events.push(r):i.push({key:o,events:[r]})}return i}_toggle(t){let i=new Set(this._open);i.has(t)?i.delete(t):i.add(t),this._open=i}render(){if(!this._loaded)return l`<ha-card><div class="empty">Loading network events…</div></ha-card>`;let t=this._config,i=this._visible(),s=this._rows(i),r=s.slice(0,this._limit),o=[...new Set(this._events.map(c=>c.category))].sort((c,u)=>Object.keys(re).indexOf(c)-Object.keys(re).indexOf(u)),d=[...new Set(this._events.map(c=>c.device_name).filter(Boolean))].sort(),a=this._device?this._issues.filter(c=>this._issueDevice(c)===this._device):this._issues;return l`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:timeline-text-outline"></ha-icon>
          <span>${t.title??"Network events"}</span>
          ${a.length?l`<span class="chip hot">${a.length} issue${a.length>1?"s":""}</span>`:l`<span class="chip">no issues</span>`}
        </div>

        ${t.show_issues&&a.length?l`<div class="issues">${a.map(c=>this._issue(c))}</div>`:p}

        ${t.show_filters?l`<div class="filters">
              <div class="cats">
                <button class="cat ${!this._category&&this._notable?"on":""}"
                  @click=${()=>{this._category="",this._notable=!0}}>
                  <ha-icon icon="mdi:star-four-points-outline"></ha-icon>Notable</button>
                <button class="cat ${!this._category&&!this._notable?"on":""}"
                  @click=${()=>{this._category="",this._notable=!1}}>All</button>
                ${o.map(c=>{let u=lt(c);return l`<button class="cat ${this._category===c?"on":""}" @click=${()=>this._category=this._category===c?"":c}>
                    <ha-icon icon=${u.icon}></ha-icon>${u.label}
                  </button>`})}
              </div>
              <div class="find">
                <select .value=${this._device} @change=${c=>this._device=c.target.value}>
                  <option value="">All devices</option>
                  ${d.map(c=>l`<option value=${c} ?selected=${c===this._device}>${c}</option>`)}
                </select>
                <input type="search" placeholder="Search" .value=${this._search}
                  @input=${c=>this._search=c.target.value} />
              </div>
            </div>`:p}

        <div class="timeline">
          ${r.map((c,u)=>{let h=new Date(c.events[0].time),f=u?new Date(r[u-1].events[0].time):void 0,v=!f||f.toDateString()!==h.toDateString();return l`${v?l`<div class="day">${this._dayLabel(h)}</div>`:p}${this._row(c)}`})}
          ${r.length?p:l`<div class="empty">No events${this._search||this._category||this._device?" match these filters":" yet"}.</div>`}
          ${s.length>this._limit?l`<button class="more" @click=${()=>this._limit+=50}>Show more (${s.length-this._limit})</button>`:p}
        </div>
      </ha-card>
    `}_issueDevice(t){return this._events.find(i=>i.device_key===t.device_key)?.device_name??void 0}_issue(t){let i=this._issueDevice(t);return l`<div class="issue sev-${t.severity}">
      <ha-icon icon=${t.severity==="error"?"mdi:alert-octagon-outline":"mdi:alert-outline"}></ha-icon>
      <div class="body">
        <div class="title">${t.title}</div>
        <div class="detail">${t.detail}</div>
        <div class="meta">
          since ${this._time(new Date(t.since))} · ${t.count}×
          ${i&&t.device_id?l`· <a href="#" @click=${s=>{s.preventDefault(),Ne(`/config/devices/device/${t.device_id}`)}}>${i}</a>`:i?l`· ${i}`:p}
        </div>
      </div>
    </div>`}_row(t){let i=t.events[0],s=i.id,r=this._open.has(s),o=t.events.length>1,d=t.events[t.events.length-1],a=new Map;for(let c of t.events){let u=String(c.data?.event??c.category);a.set(u,(a.get(u)??0)+1)}return l`
      <div class="row sev-${i.severity} ${r?"open":""}">
        <button class="line" @click=${()=>this._toggle(s)}>
          <span class="time">${this._time(new Date(i.time))}</span>
          <span class="dot-icon"><ha-icon icon=${Nt(i)}></ha-icon></span>
          <span class="text">
            <span class="title">${i.title}</span>
            ${o?l`<span class="fold">${t.events.length} events since ${this._time(new Date(d.time))} ·
                  ${[...a].map(([c,u])=>`${u} ${c}`).join(", ")}</span>`:p}
          </span>
          ${i.device_name?l`<span class="device">${i.device_name}</span>`:p}
        </button>
        ${r?this._details(t):p}
      </div>
    `}_details(t){let i=t.events.slice(0,30);return l`<div class="details">
      ${i.map(s=>{let r=Object.entries(s.data??{}).filter(([o,d])=>d!=null&&d!==""&&!["event","key","rule_id"].includes(o));return l`<div class="detail-item">
          <div class="detail-head"><span class="mono">${new Date(s.time).toLocaleString(this.hass.language)}</span>
            <span class="muted">${s.source}${s.topics?.length?` \xB7 ${s.topics.join(",")}`:""}</span></div>
          ${s.message&&s.message!==s.title?l`<div class="raw mono">${s.message}</div>`:p}
          ${r.length?l`<div class="fields">${r.map(([o,d])=>l`<span class="chip">${o.replace(/_/g," ")}: ${typeof d=="object"?JSON.stringify(d):String(d)}</span>`)}</div>`:p}
        </div>`})}
      ${t.events.length>i.length?l`<div class="muted">…and ${t.events.length-i.length} more</div>`:p}
      ${t.events[0].device_id?l`<a class="open-device" href="#" @click=${s=>{s.preventDefault(),Ne(`/config/devices/device/${t.events[0].device_id}`)}}>
            <ha-icon icon="mdi:open-in-app"></ha-icon>Open ${t.events[0].device_name}</a>`:p}
    </div>`}_time(t){return t.toLocaleTimeString(this.hass.language,{hour:"2-digit",minute:"2-digit"})}_dayLabel(t){let i=new Date;i.setHours(0,0,0,0);let s=new Date(t);s.setHours(0,0,0,0);let r=Math.round((i.getTime()-s.getTime())/Ht);return r===0?"Today":r===1?"Yesterday":t.toLocaleDateString(this.hass.language,{weekday:"long",day:"numeric",month:"long"})}static{this.styles=[C,y`
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
    `]}};var oe=class extends _{static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0},_filter:{state:!0},_sort:{state:!0}}}constructor(){super(),this._filter=new Set,this._sort={key:"device",desc:!1}}setConfig(e){this._config={show_filters:!0,...e},this._filter=new Set(e.labels??[])}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"title",selector:{text:{}}},{name:"labels",selector:{text:{multiple:!0}}},{name:"show_filters",selector:{boolean:{}}}],computeLabel:e=>({entry_id:"Controller",title:"Title",labels:"Only devices with these labels",show_filters:"Show label filters"})[e.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 2+(this._entry?.devices.length??4)}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=$.subscribe(this.hass,e=>{this._entry=w(e,this._config?.entry_id)})}_toggle(e){let t=new Set(this._filter);t.has(e)?t.delete(e):t.add(e),this._filter=t}_setSort(e){this._sort={key:e,desc:this._sort.key===e?!this._sort.desc:!1}}_sorted(e){let{key:t,desc:i}=this._sort,s=[...e].sort((r,o)=>{switch(t){case"version":return(r.version??"").localeCompare(o.version??"",void 0,{numeric:!0});case"uptime":return(r.uptime??-1)-(o.uptime??-1);case"address":return(r.address??"").localeCompare(o.address??"",void 0,{numeric:!0});default:return te(r,o)}});return i?s.reverse():s}render(){let e=this._entry;if(!e)return l`<ha-card><div class="empty">Waiting for the CMR controller…</div></ha-card>`;let t=[...new Set(e.devices.flatMap(r=>r.labels))].sort(),i=this._sorted(e.devices.filter(r=>[...this._filter].every(o=>r.labels.includes(o)))),s=r=>this._sort.key===r?l`<ha-icon class="sort" icon=${this._sort.desc?"mdi:arrow-down":"mdi:arrow-up"}></ha-icon>`:p;return l`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:router-network"></ha-icon>
          <span>${this._config.title??"Devices"}</span>
          <span class="chip">${i.length}</span>
          <div class="spacer"></div>
        </div>
        ${this._config.show_filters&&t.length?l`<div class="filters">
              ${t.map(r=>l`<button class="filter ${this._filter.has(r)?"on":""}" @click=${()=>this._toggle(r)}>
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
          ${i.length?p:l`<div class="empty">No devices match these labels.</div>`}
        </div>
      </ha-card>
    `}_row(e){let t=M(e);return l`
      <div class="row status-${t}" role="row" @click=${()=>k(this,e.entities.connected)}>
        <div class="c-device">
          <div class="icon" title=${I[t]}>${ie(e,"thumb")}<i class="dot"></i></div>
          <div class="who">
            <div class="name">
              ${e.identity}
              ${e.controller?l`<ha-icon class="crown" icon="mdi:crown-outline" title="CMR controller"></ha-icon>`:p}
            </div>
            <div class="muted small">${N(e)}${G(e)?l` · <span class="mono">${G(e)}</span>`:p}</div>
          </div>
        </div>
        <div class="c-labels">${e.labels.map(i=>l`<span class="chip">${i}</span>`)}</div>
        <div class="c-version" title=${e.prerelease?"Pre-release build":""}>
          <span class="mono">${e.version??"\u2013"}</span>
          ${e.update_available?l`<span class="update" title="Update available"><ha-icon icon="mdi:arrow-up-circle"></ha-icon><span class="mono">${e.available_version}</span></span>`:p}
        </div>
        <div class="c-uptime">${e.connected?ee(e.uptime):l`<span class="offline">${I[t]}</span>`}</div>
        <div class="c-address">
          ${e.address?l`<a class="mono" href="http://${e.address}" target="_blank" rel="noreferrer" @click=${i=>i.stopPropagation()}>${e.address}</a>`:l`<span class="muted">${e.controller?"local":"\u2013"}</span>`}
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
      .icon { position: relative; width: 40px; height: 40px; flex: none; }
      .icon .badge { width: 100%; height: 100%; border-radius: 10px; display: grid; place-items: center;
        background: color-mix(in srgb, var(--status) 13%, transparent); color: var(--status); --mdc-icon-size: 20px; }
      .icon .dot { position: absolute; right: -3px; bottom: -3px; border: 2px solid var(--cmr-surface); width: 9px; height: 9px; z-index: 1; }
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
    `]}};var ae=["var(--primary-color)","var(--cmr-update)","var(--cmr-pending)","var(--accent-color, #7e57c2)","var(--cmr-ok)","var(--cmr-muted)"];function Ut(n){if(!n)return"never";let e=Math.max(0,(Date.now()-new Date(n).getTime())/1e3);return e<10?"just now":e<60?`${Math.round(e)} s ago`:e<3600?`${Math.round(e/60)} min ago`:`${Math.round(e/3600)} h ago`}var ce=class extends _{static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0}}}setConfig(e){this._config=e}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}}],computeLabel:()=>"Controller"}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 4}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe(),this._ticker=window.setInterval(()=>this.requestUpdate(),15e3)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0,window.clearInterval(this._ticker)}willUpdate(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=$.subscribe(this.hass,e=>{this._entry=w(e,this._config?.entry_id)})}render(){let e=this._entry;if(!e)return l`<ha-card><div class="empty">Waiting for the CMR controller…</div></ha-card>`;let t=e.devices,i=t.find(b=>b.controller),s=t.filter(b=>b.connected).length,r=t.filter(b=>b.update_available).length,o=t.filter(b=>b.pending).length,d=e.alerts.filter(b=>b.devices_on>0).length,a=e.fleet_entities.network_issues?this.hass.states[e.fleet_entities.network_issues]?.state:void 0,c=Number(a)||0,u=t.length?s/t.length:0,h=new Map;t.forEach(b=>h.set(b.version??"unknown",(h.get(b.version??"unknown")??0)+1));let f=[...h.entries()].sort((b,E)=>E[1]-b[1]),v=e.fleet_entities,m=26,x=2*Math.PI*m;return l`
      <ha-card>
        <div class="hero">
          <div class="identity">
            ${i?.product?.image?l`<div class="logo photo"><img src=${i.product.image} alt=${i.product.name} referrerpolicy="no-referrer" /></div>`:l`<div class="logo"><ha-icon icon="mdi:router-network"></ha-icon></div>`}
            <div class="who">
              <div class="eyebrow">CMR controller ${e.available?p:l`<span class="chip warn">unreachable</span>`}</div>
              <div class="name">${i?.identity??e.title}</div>
              <div class="meta">
                ${i?N(i):""} ·
                <span class="mono">${i?.version??"?"}</span>
                ${i?.prerelease?l`<span class="chip">pre-release</span>`:p}
              </div>
            </div>
            <a class="open" href=${e.controller_url} target="_blank" rel="noreferrer" title="Open the router's web interface">
              <ha-icon icon="mdi:open-in-new"></ha-icon>
            </a>
          </div>

          <div class="stats">
            <button class="stat ring" @click=${()=>k(this,v.devices_online)}>
              <svg viewBox="0 0 64 64" class=${s===t.length?"status-ok":"status-offline"}>
                <circle cx="32" cy="32" r=${m} class="track"></circle>
                <circle cx="32" cy="32" r=${m} class="value"
                  stroke-dasharray=${`${x*u} ${x}`} transform="rotate(-90 32 32)"></circle>
              </svg>
              <div class="ring-text"><b>${s}</b><span>/${t.length}</span></div>
              <div class="label">online</div>
            </button>
            ${this._stat("mdi:update",r,"updates",v.updates_available,r?"update":"ok")}
            ${this._stat("mdi:bell-alert-outline",d,"alerts firing",v.alerts_firing,d?"alert":"ok")}
            ${this._stat("mdi:stethoscope",c,c===1?"issue":"issues",v.network_issues,c?"pending":"ok")}
            ${this._stat("mdi:link-variant-plus",o,"to pair",v.devices_online,o?"pending":"ok")}
          </div>
        </div>

        <div class="bars">
          <div class="bar-title">
            <span>Versions</span>
            <span class="muted">updated ${Ut(e.last_update)}</span>
          </div>
          <div class="bar">
            ${f.map(([b,E],g)=>l`<div class="seg" title="${b}: ${E}"
                style="flex:${E};background:${ae[g%ae.length]}"></div>`)}
          </div>
          <div class="keys">
            ${f.map(([b,E],g)=>l`<span><i style="background:${ae[g%ae.length]}"></i>
                <span class="mono">${b}</span> <span class="muted">×${E}</span></span>`)}
          </div>
        </div>
      </ha-card>
    `}_stat(e,t,i,s,r){return l`
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
      .logo.photo {
        width: 64px; height: 64px; background: linear-gradient(160deg, #fbfbfc, #e9ebef);
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
      }
      .logo.photo img { width: 100%; height: 100%; object-fit: contain; padding: 8%; box-sizing: border-box; mix-blend-mode: multiply; }
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
      @container (max-width: 520px) {
        .stats { justify-content: stretch; }
        .stat { max-width: none; }
      }
    `]}};var pt=(n,e,t={})=>({type:"heading",heading:n,icon:e,heading_style:"title",...t});function Ot(n,e,t){return Promise.race([n,new Promise(i=>setTimeout(()=>i(t),e))])}function It(n,e,t){let i=o=>!!o&&!!e.states[o]&&e.states[o].state!=="unavailable",s=n.entities,r=[pt(n.identity,O(n),{heading_style:"subtitle",...n.device_id?{tap_action:{action:"navigate",navigation_path:`/config/devices/device/${n.device_id}`}}:{},badges:i(s.version)?[{type:"entity",entity:s.version,show_icon:!0}]:[]})];return i(s.connected)&&r.push({type:"tile",entity:s.connected,name:"Connection",state_content:["state","last_changed"]}),i(s.uptime)&&r.push({type:"tile",entity:s.uptime,name:"Up since"}),i(s.update)&&r.push({type:"tile",entity:s.update,name:"Firmware",show_entity_picture:!0,grid_options:{columns:12}}),i(s.active_alerts)&&r.push({type:"tile",entity:s.active_alerts,name:"Alerts"}),t&&i(s.alert)&&r.push({type:"tile",entity:s.alert,name:"Last alert"}),{type:"grid",cards:r}}function jt(n,e){let t=n.fleet_entities;return{title:"Network",path:"network",icon:"mdi:router-network",type:"sections",max_columns:3,badges:[[t.devices_online,"Online"],[t.updates_available,"Updates"],[t.alerts_firing,"Alerts firing"],[t.network_issues,"Issues"]].filter(([i])=>i).map(([i,s])=>({type:"entity",entity:i,name:s,show_name:!0})),sections:[{type:"grid",column_span:3,cards:[{...e,type:"custom:cmr-status-card"}]},{type:"grid",column_span:3,cards:[{...e,type:"custom:cmr-topology-card",height:480,grid_options:{columns:"full"}}]},{type:"grid",column_span:2,cards:[{...e,type:"custom:cmr-fleet-card",grid_options:{columns:"full"}}]},{type:"grid",cards:[{...e,type:"custom:cmr-alerts-card",grid_options:{columns:"full"}}]},{type:"grid",column_span:2,cards:[{...e,type:"custom:cmr-events-card",max_items:15,notable:!0,grid_options:{columns:"full"}}]},{type:"grid",cards:[{...e,type:"custom:cmr-upgrades-card",grid_options:{columns:"full"}}]}]}}function Bt(n,e){let t=n.alerts.some(r=>r.webhook),i=[...n.devices].sort(te),s=i.map(r=>r.entities.connected).filter(Boolean);return{title:"Devices",path:"devices",icon:"mdi:devices",type:"sections",max_columns:4,sections:[{type:"grid",column_span:4,cards:[pt("Connectivity, last 24 hours","mdi:chart-timeline-variant"),{type:"history-graph",hours_to_show:24,entities:s,grid_options:{columns:"full"}}]},...i.map(r=>It(r,e,t))]}}function Vt(n){return{title:"Events",path:"events",icon:"mdi:timeline-text-outline",type:"sections",max_columns:2,sections:[{type:"grid",column_span:2,cards:[{...n,type:"custom:cmr-events-card",max_items:100,grid_options:{columns:"full"}}]}]}}function Kt(n){return{title:"Topology",path:"topology",icon:"mdi:sitemap-outline",type:"panel",cards:[{...n,type:"custom:cmr-topology-card",height:760}]}}function dt(n,e){return{title:n.title??"Network",views:[{title:"Network",path:"network",cards:[{type:"markdown",content:`## CMR
${e}`}]}]}}var le=class extends HTMLElement{static getCreateSuggestions(){return{title:"Network",icon:"mdi:router-network"}}static async generate(e,t){try{let i=await Ot($.once(t),8e3,[]),s=w(i,e.entry_id);if(!s)return dt(e,"No CMR controller is set up yet. Add the **CMR** integration under [Settings \u2192 Devices & services](/config/integrations/dashboard/add?domain=cmr).");let r=e.entry_id?{entry_id:e.entry_id}:{};return{title:e.title??"Network",views:[jt(s,r),Vt(r),Bt(s,t),Kt(r)]}}catch(i){return console.error("cmr: dashboard strategy failed",i),dt(e,`The dashboard couldn't be built (${String(i)}). Reload the page to try again.`)}}};var S=184,D=62,de=48,pe="__auto__",Wt="mdi:map-marker-radius-outline",Ft={copper:"Ethernet",fiber:"SFP / fiber",wireless:"Wireless",unknown:"Not detected"},qt={fiber:"Fiber (SFP)",copper:"Copper (Ethernet)",wireless:"Wireless",logical:"Logical interface",uplink:"Link between layouts",unknown:"No ports detected"};function De(n){return/^q?sfp/i.test(n)?"fiber":/^(ether|combo)/i.test(n)?"copper":/^(wifi|wlan|wl\d)/i.test(n)?"wireless":"logical"}var Yt={"":1,K:1024,M:1024**2,G:1024**3,T:1024**4};function ut(n){let e=/^([\d.]+)\s*([KMGT]?)i?B?$/i.exec(n??"");return e?parseFloat(e[1])*(Yt[e[2].toUpperCase()]??1):0}function Gt(n,e,t=3){return n.x0<e.x1+t&&e.x0<n.x1+t&&n.y0<e.y1+t&&e.y0<n.y1+t}function Xt(n,e,t,i,s){let r=Math.hypot(t,i)||1,o=t/r,d=i/r,a=Math.min(o?S/2/Math.abs(o):1/0,d?D/2/Math.abs(d):1/0);return{x:n+o*(a+s),y:e+d*(a+s),ux:o,uy:d}}var ue=class extends _{constructor(){super();this._userMoved=!1;this._fittedFor="";this._onKey=t=>{t.key==="Escape"&&this._clearHover()};this._clearHover=()=>{this._hover=void 0,this._hoverLink=void 0};this._path=[],this._view={x:0,y:0,k:1}}static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0},_path:{state:!0},_hover:{state:!0},_hoverLink:{state:!0},_view:{state:!0}}}setConfig(t){this._config={height:440,show_ports:!0,show_comments:!0,...t},this._path=t.layout?[t.layout]:[],this._userMoved=!1}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"title",selector:{text:{}}},{name:"layout",selector:{text:{}}},{name:"height",selector:{number:{min:200,max:1400,step:20,mode:"box",unit_of_measurement:"px"}}},{name:"show_ports",selector:{boolean:{}}},{name:"show_comments",selector:{boolean:{}}}],computeLabel:t=>({entry_id:"Controller",title:"Title",layout:"Start at layout (empty: the top layout)",height:"Height",show_ports:"Show port names on cables",show_comments:"Show link comments"})[t.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6,min_rows:4}}getCardSize(){return Math.round((this._config?.height??440)/50)+1}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe(),window.addEventListener("keydown",this._onKey)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey),this._unsubscribe?.(),this._unsubscribe=void 0,this._resize?.disconnect(),this._resize=void 0}willUpdate(t){t.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=$.subscribe(this.hass,t=>{this._entry=w(t,this._config?.entry_id)})}_rootLayouts(t){let i=new Set(t.nodes.map(o=>o.target_layout).filter(Boolean)),s=new Set(t.nodes.map(o=>o.layout)),r=t.layouts.map(o=>o.name).filter(o=>!i.has(o)&&s.has(o));return r.length?r:t.layouts.map(o=>o.name).filter(o=>s.has(o))}_currentLayout(t){return this._path.length?this._path[this._path.length-1]:this._rootLayouts(t)[0]??pe}_devicesIn(t,i,s=new Set){if(s.has(i))return[];s.add(i);let r=new Map(t.devices.map(d=>[d.key,d])),o=new Map;for(let d of t.nodes.filter(a=>a.layout===i))d.device_key&&r.has(d.device_key)&&o.set(d.device_key,r.get(d.device_key)),d.target_layout&&this._devicesIn(t,d.target_layout,s).forEach(a=>o.set(a.key,a));return[...o.values()]}_scene(t){let i=this._currentLayout(t),s=new Map(t.devices.map(v=>[v.key,v])),r,o;if(i===pe)({nodes:r,links:o}=this._autoLayout(t));else{let v=t.nodes.filter(g=>g.layout===i),m=v.filter(g=>g.x!=null&&g.y!=null),x=m.length?Math.max(...m.map(g=>g.y)):0,b=m.length?Math.min(...m.map(g=>g.x)):0,E=0;r=v.map(g=>{let me=g.x==null||g.y==null,Ue=me?b+E*(S+40):g.x,Oe=me?x+D*2.4:g.y;if(me&&(E+=1),g.target_layout){let fe=this._devicesIn(t,g.target_layout),vt=fe.filter(be=>be.connected).length,ge=fe.map(M),ft=ge.includes("offline")?"offline":ge.includes("alert")?"alert":ge.includes("update")?"update":"ok",gt=t.layouts.find(be=>be.name===g.target_layout)?.comment??null;return{id:g.name,name:g.name,x:Ue,y:Oe,kind:"site",target:g.target_layout,site:{online:vt,total:fe.length,status:ft,comment:gt}}}let ve=g.device_key?s.get(g.device_key):void 0;return{id:g.name,name:ve?.identity??g.name,x:Ue,y:Oe,kind:ve?"device":"unknown",device:ve}}),o=t.links.filter(g=>g.layout===i)}let d=r.map(v=>v.x),a=r.map(v=>v.y),c=Math.min(...d,0)-S/2-de,u=Math.min(...a,0)-D/2-de;for(let v of r)v.x-=c,v.y-=u;let h=Math.max(...r.map(v=>v.x),0)+S/2+de,f=Math.max(...r.map(v=>v.y),0)+D/2+de;return{layout:i,nodes:r,links:o,width:h,height:f}}_autoLayout(t){let i=c=>c.controller?0:1,s=new Map;for(let c of t.devices){let u=i(c);s.set(u,[...s.get(u)??[],c])}let r=Math.max(...[...s.values()].map(c=>c.length),1),o=[];[...s.keys()].sort().forEach((c,u)=>{let h=s.get(c).sort((v,m)=>v.identity.localeCompare(m.identity)),f=(r-h.length)*(S+48)/2;h.forEach((v,m)=>o.push({id:v.key,name:v.identity,kind:"device",device:v,x:f+m*(S+48),y:u*(D+90)}))});let d=t.devices.find(c=>c.controller),a=d?t.devices.filter(c=>!c.controller).map(c=>({id:c.key,layout:pe,node1:d.key,node2:c.key,comment:null,ports:[]})):[];return{nodes:o,links:a}}updated(){let t=this.renderRoot.querySelector(".viewport");t&&!this._resize&&(this._resize=new ResizeObserver(()=>{this._userMoved||this._fit()}),this._resize.observe(t));let i=`${this._entry?.entry_id}|${this._path.join("/")}|${this._entry?this._scene(this._entry).nodes.length:0}`;this._entry&&i!==this._fittedFor&&(this._fittedFor=i,this._userMoved=!1,this._fit())}_fit(){let t=this.renderRoot.querySelector(".viewport");if(!t||!this._entry)return;let{width:i,height:s}=this._scene(this._entry),r=t.clientWidth,o=t.clientHeight;if(!r||!o)return;let d=Math.min(r/i,o/s,1.2),a={k:d,x:(r-i*d)/2,y:(o-s*d)/2};(Math.abs(a.k-this._view.k)>.001||Math.abs(a.x-this._view.x)>.5||Math.abs(a.y-this._view.y)>.5)&&(this._view=a)}_onWheel(t){if(!t.ctrlKey&&!t.metaKey)return;t.preventDefault();let i=t.currentTarget.getBoundingClientRect(),s=t.clientX-i.left,r=t.clientY-i.top,{x:o,y:d,k:a}=this._view,c=Math.min(2.5,Math.max(.25,a*Math.exp(-t.deltaY*.0018)));this._view={k:c,x:s-(s-o)*c/a,y:r-(r-d)*c/a},this._userMoved=!0,this._hover=void 0}_onPointerDown(t){t.pointerType==="touch"||t.button!==0||(this._clearHover(),this._drag={id:t.pointerId,x:t.clientX,y:t.clientY,vx:this._view.x,vy:this._view.y,moved:!1})}_onPointerMove(t){let i=this._drag;if(!i||i.id!==t.pointerId)return;let s=t.clientX-i.x,r=t.clientY-i.y;!i.moved&&Math.hypot(s,r)<4||(i.moved||t.currentTarget.setPointerCapture(t.pointerId),i.moved=!0,this._userMoved=!0,this._hover=void 0,this._view={...this._view,x:i.vx+s,y:i.vy+r})}_onPointerUp(t){this._drag?.moved&&t.type==="pointerup"&&t.currentTarget?.addEventListener("click",i=>i.stopPropagation(),{capture:!0,once:!0}),this._drag=void 0}_zoom(t){let i=this.renderRoot.querySelector(".viewport");if(!i)return;let s=i.clientWidth/2,r=i.clientHeight/2,{x:o,y:d,k:a}=this._view,c=Math.min(2.5,Math.max(.25,a*t));this._view={k:c,x:s-(s-o)*c/a,y:r-(r-d)*c/a},this._userMoved=!0}_resetView(){this._userMoved=!1,this._fit()}_open(t){t.kind==="site"&&t.target?(this._path=[...this._path.length?this._path:[this._currentLayout(this._entry)],t.target],this._hover=void 0):t.device&&k(this,t.device.entities.connected??t.device.entities.update)}_goTo(t){this._path=this._path.slice(0,t+1),this._hover=void 0}_selectRoot(t){this._path=[t],this._hover=void 0}_showHover(t,i){if(this._drag?.moved)return;let s=this.renderRoot.querySelector(".viewport");if(!s)return;let{x:r,y:o,k:d}=this._view,a=300,c=t.device?.product?.image_large?340:230,u=(t.x+S/2)*d+r+12,h=(t.x-S/2)*d+r-12-a,f=u+a<=s.clientWidth-8,v=t.y*d+o-c/2;this._hover={node:t,x:f||h<8?Math.min(u,s.clientWidth-a-8):h,y:Math.max(8,Math.min(v,s.clientHeight-c-8))},i.stopPropagation()}render(){let t=this._entry,i=this._config?.height??440;if(!t)return l`<ha-card><div class="empty" style="height:${i}px">Waiting for the CMR controller…</div></ha-card>`;let s=this._scene(t),r=this._rootLayouts(t),o=this._path.length?this._path:[s.layout],d=new Map(s.nodes.map(m=>[m.id,m])),a=s.links.map(m=>this._linkInfo(m,d)).filter(m=>m!==void 0),c=["copper","fiber","wireless","unknown"].filter(m=>a.some(x=>x.kind===m)),{x:u,y:h,k:f}=this._view,v=t.layouts.find(m=>m.name===s.layout);return l`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:sitemap-outline"></ha-icon>
          <div class="crumbs">
            ${this._config.title?l`<span class="title">${this._config.title}</span>`:p}
            ${o.map((m,x)=>l`
                ${x?l`<ha-icon class="sep" icon="mdi:chevron-right"></ha-icon>`:p}
                <button class="crumb ${x===o.length-1?"current":""}" @click=${()=>this._goTo(x)}>
                  ${m===pe?"All devices":m}
                </button>
              `)}
          </div>
          <div class="spacer"></div>
          ${r.length>1?l`<div class="roots">
                ${r.map(m=>l`<button class="root ${o[0]===m?"active":""}" @click=${()=>this._selectRoot(m)}>${m}</button>`)}
              </div>`:p}
        </div>
        ${v?.comment?l`<div class="subtitle">${v.comment}</div>`:p}
        <div
          class="viewport"
          style="min-height:${i}px"
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
            style="width:${s.width}px;height:${s.height}px;transform:translate(${u}px,${h}px) scale(${f})"
          >
            <svg class="wires" width=${s.width} height=${s.height}>
              ${a.map(m=>this._renderLink(m))}
            </svg>
            ${this._config.show_ports?a.map(m=>this._renderPorts(m)):p}
            ${this._config.show_comments?a.map(m=>this._renderComment(m)):p}
            ${s.nodes.map(m=>this._renderNode(m))}
          </div>
          ${this._hover?this._renderTooltip(this._hover):p}
          ${this._hoverLink&&!this._hover?this._renderLinkTooltip(this._hoverLink):p}
          <div class="controls">
            <button title="Zoom in" @click=${()=>this._zoom(1.25)}><ha-icon icon="mdi:plus"></ha-icon></button>
            <button title="Zoom out" @click=${()=>this._zoom(.8)}><ha-icon icon="mdi:minus"></ha-icon></button>
            <button title="Fit" @click=${this._resetView}><ha-icon icon="mdi:fit-to-screen-outline"></ha-icon></button>
          </div>
          <div class="legend">
            ${["ok","update","alert","offline"].map(m=>l`<span class="status-${m}"><i class="dot"></i>${I[m]}</span>`)}
            ${c.map(m=>l`<span><i class="wire-sample k-${m}"></i>${Ft[m]}</span>`)}
            ${a.some(m=>m.poe)?l`<span><i class="poe-sample"></i>PoE power</span>`:p}
          </div>
        </div>
      </ha-card>
    `}_linkState(t,i){let s=d=>d?.kind==="device"?d.device.connected:d?.kind==="site"?d.site.online>0:void 0,r=s(t),o=s(i);return r===!1||o===!1?"down":r===void 0||o===void 0?"unknown":"up"}_linkInfo(t,i){let s=i.get(t.node1),r=i.get(t.node2);if(!s||!r)return;let o=t.ports,d=[s.name,r.name],a=!1;if(!o.length&&s.kind==="site"&&r.kind==="site"){a=!0;let v=this._cableBetween(s.target,r.target);v&&(o=v.ports,d=v.names)}let c=o[0],u;if(c){let v=[De(c.a.interface),De(c.b.interface)];u=v.includes("fiber")?"fiber":v.includes("wireless")?"wireless":v.every(m=>m==="copper")?"copper":"logical"}else u=a&&!this._cableBetween(s.target,r.target)?"uplink":"unknown";let h;c?.a.poe==="powered-on"?h={from:s,to:r,port:c.a.interface}:c?.b.poe==="powered-on"&&(h={from:r,to:s,port:c.b.interface});let f=o.reduce((v,m)=>v+ut(m.a.tx)+ut(m.a.rx),0);return{link:t,a:s,b:r,state:this._linkState(s,r),kind:u,ports:o,endNames:d,poe:h,bytes:f}}_cableBetween(t,i){let s=this._entry,r=new Set(this._devicesIn(s,t).map(u=>u.key)),o=new Set(this._devicesIn(s,i).map(u=>u.key)),d=new Map(s.nodes.map(u=>[`${u.layout}\0${u.name}`,u.device_key])),a=new Map(s.devices.map(u=>[u.key,u])),c;for(let u of s.links){let h=d.get(`${u.layout}\0${u.node1}`),f=d.get(`${u.layout}\0${u.node2}`);if(!h||!f)continue;let v=r.has(h)&&o.has(f);if(!v&&!(r.has(f)&&o.has(h)))continue;let[m,x]=v?[h,f]:[f,h],b=v?u.ports:u.ports.map(g=>({a:g.b,b:g.a})),E={ports:b,names:[a.get(m)?.identity??m,a.get(x)?.identity??x]};(!c||b.length&&!c.ports.length)&&(c=E)}return c}_renderLink(t){let{a:i,b:s,state:r,kind:o,poe:d}=t,a=`M ${i.x} ${i.y} L ${s.x} ${s.y}`,c=r==="up"&&o!=="unknown"&&o!=="logical",u=Math.min(2.4,Math.max(.6,2.4-.3*Math.log10(t.bytes+1)));return Y`
      <g class="link ${r} k-${o}"
         @mouseenter=${h=>this._showLinkHover(t,h)}
         @mouseleave=${()=>this._hoverLink=void 0}>
        <path class="hit" d=${a}></path>
        <path class="wire" d=${a}></path>
        ${o==="fiber"?Y`<path class="core" d=${a}></path>`:p}
        ${c?Y`<path class="flow" d=${a} style="animation-duration:${u}s"></path>`:p}
        ${d&&r==="up"?Y`<circle class="power" r="3.6">
              <animateMotion dur="2.2s" repeatCount="indefinite"
                path=${`M ${d.from.x} ${d.from.y} L ${d.to.x} ${d.to.y}`}></animateMotion>
            </circle>`:p}
      </g>
    `}_renderPorts(t){let i=t.ports[0];if(!i)return p;let{a:s,b:r}=t,o=[this._chip(s,r,i.a,t.poe?.from===s),this._chip(r,s,i.b,t.poe?.from===r)];return Gt(o[0].box,o[1].box)&&(o=[this._chip(s,r,i.a,t.poe?.from===s,-1),this._chip(r,s,i.b,t.poe?.from===r,1)]),l`${o.map(d=>d.html)}`}_chip(t,i,s,r,o){let d=Xt(t.x,t.y,i.x-t.x,i.y-t.y,o?4:8),a=s.interface.length*6.6+12+(r?13:0),c=18,u=Math.abs(d.ux)>=Math.abs(d.uy),h=Math.abs(d.ux)<.35?-.5:d.ux>0?0:-1,f=Math.abs(d.uy)<.35?-.5:d.uy>0?0:-1,v=0,m=0;o&&(u?(f=o<0?-1:0,m=o*3):(h=o<0?-1:0,v=o*4));let x=d.x+h*a+v,b=d.y+f*c+m;return{box:{x0:x,y0:b,x1:x+a,y1:b+c},html:l`<div class="port m-${De(s.interface)} ${r?"poe":""}"
        style="left:${d.x+v}px;top:${d.y+m}px;transform:translate(${h*100}%,${f*100}%)"
        title=${r?`${s.interface}: PoE out, powers ${i.name}`:`${s.interface} (${t.name})`}>
        ${r?l`<ha-icon icon="mdi:flash"></ha-icon>`:p}${s.interface}
      </div>`}}_renderComment(t){let{a:i,b:s,link:r}=t;return!r.comment||t.ports.length&&this._config.show_ports?p:l`<div class="comment" style="left:${(i.x+s.x)/2}px;top:${(i.y+s.y)/2}px" title=${r.comment}>
      ${r.comment}
    </div>`}_showLinkHover(t,i){if(this._drag?.moved)return;let s=this.renderRoot.querySelector(".viewport");if(!s)return;let r=s.getBoundingClientRect();this._hoverLink={info:t,x:i.clientX-r.left,y:i.clientY-r.top+14}}_renderLinkTooltip(t){let{info:i}=t,{a:s,b:r,link:o,poe:d,ports:a,endNames:c}=i,u=h=>h.tx||h.rx?l`<span class="mono">↑ ${h.tx??"\u2013"} · ↓ ${h.rx??"\u2013"}</span>`:"\u2013";return l`<div class="tooltip" style="left:${Math.max(8,t.x-150)}px;top:${t.y}px">
      <div class="tt-title">${s.name} ↔ ${r.name}</div>
      ${o.comment?l`<div class="muted">${o.comment}</div>`:p}
      <table>
        <tr><td>Medium</td><td>${qt[i.kind]}</td></tr>
        ${a.map(h=>l`
            <tr><td>${c[0]}</td><td class="mono">${h.a.interface}</td></tr>
            <tr><td>${c[1]}</td><td class="mono">${h.b.interface}</td></tr>
          `)}
        ${d?l`<tr><td>Power</td><td><ha-icon class="inline poe" icon="mdi:flash"></ha-icon>
              ${d.from===s?c[0]:c[1]} <span class="mono">${d.port}</span>
              powers ${d.to===s?c[0]:c[1]}</td></tr>`:p}
        ${a[0]?l`<tr><td>Traffic</td><td>${c[0]}: ${u(a[0].a)}<br />${c[1]}: ${u(a[0].b)}</td></tr>`:p}
      </table>
    </div>`}_renderNode(t){let i=`left:${t.x-S/2}px;top:${t.y-D/2}px;width:${S}px;height:${D}px`;if(t.kind==="site"){let o=t.site;return l`
        <div class="node site status-${o.status}" style=${i} @click=${()=>this._open(t)}
             @mouseenter=${d=>this._showHover(t,d)} @mouseleave=${this._clearHover}>
          <div class="badge"><ha-icon icon=${this._config.icons?.[t.name]??Wt}></ha-icon></div>
          <div class="text">
            <div class="name">${t.name}</div>
            <div class="sub"><i class="dot"></i>${o.online}/${o.total} online</div>
          </div>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        </div>
      `}if(t.kind==="unknown"||!t.device)return l`
        <div class="node unknown" style=${i} title="Not a CMR-managed device">
          <div class="badge"><ha-icon icon="mdi:help-network-outline"></ha-icon></div>
          <div class="text"><div class="name">${t.name}</div><div class="sub">Not managed</div></div>
        </div>
      `;let s=t.device,r=M(s);return l`
      <div class="node device status-${r} ${s.controller?"controller":""}" style=${i}
           @click=${()=>this._open(t)} @mouseenter=${o=>this._showHover(t,o)}
           @mouseleave=${this._clearHover}>
        ${ie(s)}
        <div class="text">
          <div class="name">${s.identity}</div>
          <div class="sub">${N(s)}</div>
          <div class="ver mono">
            ${s.version??"\u2013"}${s.update_available?l`<span class="up"> → ${s.available_version}</span>`:p}
          </div>
        </div>
        ${s.controller?l`<span class="crown" title="CMR controller"><ha-icon icon="mdi:crown-outline"></ha-icon></span>`:p}
        ${s.alerts?.on?l`<span class="count" title="Alerts firing">${s.alerts.on}</span>`:p}
      </div>
    `}_renderTooltip(t){let{node:i}=t,s;if(i.kind==="site"){let r=i.site;s=l`
        <div class="tt-title">${i.name}</div>
        ${r.comment?l`<div class="muted">${r.comment}</div>`:p}
        <div>${r.online} of ${r.total} devices online</div>
        <div class="muted">Click to open this layout</div>
      `}else if(i.device){let r=i.device;s=l`
        <div class="tt-title">${r.identity}${r.controller?l` <span class="chip">controller</span>`:p}</div>
        ${r.product?.image_large?l`<div class="tt-photo"><img src=${r.product.image_large} alt="" referrerpolicy="no-referrer" /></div>`:p}
        <div class="muted">${[N(r),G(r),r.arch].filter(Boolean).join(" \xB7 ")}</div>
        <table>
          <tr><td>Status</td><td class="status-${M(r)}"><i class="dot"></i> ${I[M(r)]}</td></tr>
          <tr><td>Version</td><td class="mono">${r.version??"\u2013"}${r.prerelease?" (pre-release)":""}</td></tr>
          <tr><td>Channel</td><td>${r.channel??"\u2013"}${r.available_version&&r.available_version!==r.version?l` <span class="muted">(${r.update_available?"update to":"offers"} <span class="mono">${r.available_version}</span>)</span>`:p}</td></tr>
          ${r.address?l`<tr><td>Address</td><td class="mono">${r.address}</td></tr>`:p}
          <tr><td>Uptime</td><td>${ee(r.uptime)}</td></tr>
          ${r.labels.length?l`<tr><td>Labels</td><td>${r.labels.map(o=>l`<span class="chip">${o}</span> `)}</td></tr>`:p}
          ${r.alerts?l`<tr><td>Alerts</td><td>${r.alerts.on} firing of ${r.alerts.total} rules</td></tr>`:p}
        </table>
      `}else return l``;return l`<div class="tooltip" style="left:${Math.max(8,t.x)}px;top:${t.y}px">${s}</div>`}static{this.styles=[C,y`
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

      ha-card { display: flex; flex-direction: column; }
      .viewport {
        flex: 1 1 auto;
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
        position: relative; flex: none; width: 42px; height: 42px; border-radius: 11px;
        display: grid; place-items: center;
        background: color-mix(in srgb, var(--status, var(--cmr-muted)) 14%, transparent);
        color: var(--status, var(--cmr-muted));
      }
      .node .badge.photo { overflow: visible; }
      .node .badge.photo img { border-radius: 11px; }
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
      .tt-photo {
        height: 110px; margin: -2px -4px 8px; border-radius: 9px; display: grid; place-items: center;
        background: linear-gradient(160deg, #fbfbfc, #e9ebef);
      }
      .tt-photo img { max-width: 88%; max-height: 92px; object-fit: contain; mix-blend-mode: multiply; }
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
    `]}};var Jt={done:"mdi:check-circle",failed:"mdi:close-circle",running:"mdi:progress-upload",scheduled:"mdi:calendar-clock",waiting:"mdi:timer-sand"};function He(n){return(n??"").split(",").map(e=>e.trim()).filter(Boolean)}function Zt(n){let[e,t]=(n.success??"").split("/").map(Number);return n.state==="done"&&t&&e<t?"failed":n.state??"waiting"}var he=class extends _{static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0}}}setConfig(e){this._config={jobs:5,...e}}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"title",selector:{text:{}}},{name:"jobs",selector:{number:{min:0,max:30,mode:"box"}}}],computeLabel:e=>({entry_id:"Controller",title:"Title",jobs:"Recent jobs to show"})[e.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=$.subscribe(this.hass,e=>{this._entry=w(e,this._config?.entry_id)})}render(){let e=this._entry;if(!e)return l`<ha-card><div class="empty">Waiting for the CMR controller…</div></ha-card>`;let t=e.devices.filter(r=>r.update_available).length,i=e.upgrade_rules.filter(r=>r.dynamic!=="true"||e.devices.some(o=>o.upgrade_rule===r.name)),s=[...e.upgrade_jobs].sort((r,o)=>(o.schedule_time??"").localeCompare(r.schedule_time??"")).slice(0,this._config.jobs??5);return l`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:update"></ha-icon>
          <span>${this._config.title??"Upgrades"}</span>
          ${t?l`<span class="chip upd">${t} available</span>`:l`<span class="chip">up to date</span>`}
        </div>

        ${i.length?i.map(r=>this._rule(e,r)):l`<div class="empty small">No upgrade rules. Devices are checked against their channel only.</div>`}

        ${s.length?l`<div class="section">Recent jobs</div>
              <div class="jobs">
                ${s.map(r=>{let o=Zt(r);return l`<div class="job js-${o}">
                    <ha-icon icon=${Jt[o]??"mdi:circle-outline"}></ha-icon>
                    <div class="what">
                      <div><span class="mono">${r.channel??"?"}</span> → ${He(r.labels).join(", ")||"all"}</div>
                      <div class="muted small">${r.schedule_time??""}${r.run_time?` \xB7 took ${r.run_time}`:""}</div>
                    </div>
                    <div class="ok mono">${r.success||"\u2013"}</div>
                  </div>`})}
              </div>`:p}
      </ha-card>
    `}_rule(e,t){let i=e.devices.filter(a=>a.upgrade_rule===t.name),s=He(t.order),r=s.length?s.map(a=>({label:a,devices:i.filter(c=>c.labels.includes(a))})):[{label:He(t.labels).join(", ")||"all",devices:i}],o=new Set(r.flatMap(a=>a.devices.map(c=>c.key))),d=i.filter(a=>!o.has(a.key));return d.length&&r.push({label:"other",devices:d}),l`
      <div class="rule">
        <div class="rule-head">
          <b>${t.name}</b>
          <span class="muted small">
            ${[t.channel&&`channel ${t.channel}`,t.strategy,t.fail_policy&&`on failure: ${t.fail_policy}`].filter(Boolean).join(" \xB7 ")}
          </span>
        </div>
        ${t.comment?l`<div class="muted small comment">${t.comment}</div>`:p}
        <div class="pipeline">
          ${r.map((a,c)=>l`
              ${c?l`<ha-icon class="arrow" icon="mdi:chevron-right"></ha-icon>`:p}
              <div class="step">
                <div class="step-label"><span class="n">${c+1}</span>${a.label}</div>
                <div class="devs">
                  ${a.devices.map(u=>l`<button class="dev status-${M(u)}" title="${u.identity} · ${u.version}"
                      @click=${()=>k(this,u.entities.update)}><ha-icon icon=${O(u)}></ha-icon></button>`)}
                  ${a.devices.length?p:l`<span class="muted small">none</span>`}
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
    `]}};var ht="https://github.com/trakais/ha-cmr",mt=[["cmr-status-card",ce,"CMR status","Controller, devices online, updates and alerts at a glance."],["cmr-topology-card",ue,"CMR topology","Live network map drawn from the controller's CMR layouts."],["cmr-fleet-card",oe,"CMR devices","Every managed device with model, version, uptime and labels."],["cmr-alerts-card",se,"CMR alerts","Alert rules, what is firing, and pushing alerts to Home Assistant."],["cmr-upgrades-card",he,"CMR upgrades","Upgrade rules as a rollout pipeline, plus recent jobs."],["cmr-events-card",ne,"CMR events","Network timeline from the controller's log and changes, with detected issues."]];for(let[n,e]of mt)customElements.get(n)||customElements.define(n,e);window.customCards=window.customCards||[];for(let[n,,e,t]of mt)window.customCards.some(i=>i.type===n)||window.customCards.push({type:n,name:e,description:t,preview:!1,documentationURL:ht});customElements.get("ll-strategy-dashboard-cmr")||customElements.define("ll-strategy-dashboard-cmr",le);window.customStrategies=window.customStrategies||[];window.customStrategies.some(n=>n.type==="cmr")||window.customStrategies.push({type:"cmr",strategyType:"dashboard",name:"CMR network",description:"A complete network dashboard generated from your CMR controller: status, topology, devices, alerts and upgrades.",documentationURL:ht});console.info("%c CMR %c cards loaded ","background:#3a6ea5;color:#fff;border-radius:3px 0 0 3px","background:#ddd;color:#333;border-radius:0 3px 3px 0");
