var ae=globalThis,le=ae.ShadowRoot&&(ae.ShadyCSS===void 0||ae.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Me=Symbol(),Ye=new WeakMap,Y=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==Me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(le&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=Ye.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Ye.set(e,t))}return t}toString(){return this.cssText}},Ge=n=>new Y(typeof n=="string"?n:n+"",void 0,Me),x=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((i,s,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new Y(e,n,Me)},Xe=(n,t)=>{if(le)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=ae.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,n.appendChild(i)}},Pe=le?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return Ge(e)})(n):n;var{is:Lt,defineProperty:Tt,getOwnPropertyDescriptor:Rt,getOwnPropertyNames:zt,getOwnPropertySymbols:Dt,getPrototypeOf:Nt}=Object,ce=globalThis,Je=ce.trustedTypes,Ht=Je?Je.emptyScript:"",It=ce.reactiveElementPolyfillSupport,G=(n,t)=>n,Le={toAttribute(n,t){switch(t){case Boolean:n=n?Ht:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},Qe=(n,t)=>!Lt(n,t),Ze={attribute:!0,type:String,converter:Le,reflect:!1,useDefault:!1,hasChanged:Qe};Symbol.metadata??=Symbol("metadata"),ce.litPropertyMetadata??=new WeakMap;var L=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ze){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Tt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:r}=Rt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let d=s?.call(this);r?.call(this,o),this.requestUpdate(t,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ze}static _$Ei(){if(this.hasOwnProperty(G("elementProperties")))return;let t=Nt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(G("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(G("properties"))){let e=this.properties,i=[...zt(e),...Dt(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(Pe(s))}else t!==void 0&&e.push(Pe(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Xe(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:Le).toAttribute(e,i.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Le;this._$Em=s;let d=o.fromAttribute(e,r.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(t!==void 0){let o=this.constructor;if(s===!1&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??Qe)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:o}=r,d=this[s];o!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,r,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};L.elementStyles=[],L.shadowRootOptions={mode:"open"},L[G("elementProperties")]=new Map,L[G("finalized")]=new Map,It?.({ReactiveElement:L}),(ce.reactiveElementVersions??=[]).push("2.1.2");var Ie=globalThis,et=n=>n,de=Ie.trustedTypes,tt=de?de.createPolicy("lit-html",{createHTML:n=>n}):void 0,at="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,lt="?"+R,Ot=`<${lt}>`,N=document,J=()=>N.createComment(""),Z=n=>n===null||typeof n!="object"&&typeof n!="function",Oe=Array.isArray,Ut=n=>Oe(n)||typeof n?.[Symbol.iterator]=="function",Te=`[ 	
\f\r]`,X=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,it=/-->/g,st=/>/g,z=RegExp(`>|${Te}(?:([^\\s"'>=/]+)(${Te}*=${Te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),rt=/'/g,nt=/"/g,ct=/^(?:script|style|textarea|title)$/i,Ue=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),l=Ue(1),te=Ue(2),mi=Ue(3),H=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),ot=new WeakMap,D=N.createTreeWalker(N,129);function dt(n,t){if(!Oe(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return tt!==void 0?tt.createHTML(t):t}var jt=(n,t)=>{let e=n.length-1,i=[],s,r=t===2?"<svg>":t===3?"<math>":"",o=X;for(let d=0;d<e;d++){let c=n[d],a,m,u=-1,g=0;for(;g<c.length&&(o.lastIndex=g,m=o.exec(c),m!==null);)g=o.lastIndex,o===X?m[1]==="!--"?o=it:m[1]!==void 0?o=st:m[2]!==void 0?(ct.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=z):m[3]!==void 0&&(o=z):o===z?m[0]===">"?(o=s??X,u=-1):m[1]===void 0?u=-2:(u=o.lastIndex-m[2].length,a=m[1],o=m[3]===void 0?z:m[3]==='"'?nt:rt):o===nt||o===rt?o=z:o===it||o===st?o=X:(o=z,s=void 0);let v=o===z&&n[d+1].startsWith("/>")?" ":"";r+=o===X?c+Ot:u>=0?(i.push(a),c.slice(0,u)+at+c.slice(u)+R+v):c+R+(u===-2?d:v)}return[dt(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},Q=class n{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0,d=t.length-1,c=this.parts,[a,m]=jt(t,e);if(this.el=n.createElement(a,i),D.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=D.nextNode())!==null&&c.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(at)){let g=m[o++],v=s.getAttribute(u).split(R),h=/([.?@])?(.*)/.exec(g);c.push({type:1,index:r,name:h[2],strings:v,ctor:h[1]==="."?ze:h[1]==="?"?De:h[1]==="@"?Ne:B}),s.removeAttribute(u)}else u.startsWith(R)&&(c.push({type:6,index:r}),s.removeAttribute(u));if(ct.test(s.tagName)){let u=s.textContent.split(R),g=u.length-1;if(g>0){s.textContent=de?de.emptyScript:"";for(let v=0;v<g;v++)s.append(u[v],J()),D.nextNode(),c.push({type:2,index:++r});s.append(u[g],J())}}}else if(s.nodeType===8)if(s.data===lt)c.push({type:2,index:r});else{let u=-1;for(;(u=s.data.indexOf(R,u+1))!==-1;)c.push({type:7,index:r}),u+=R.length-1}r++}}static createElement(t,e){let i=N.createElement("template");return i.innerHTML=t,i}};function F(n,t,e=n,i){if(t===H)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,r=Z(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=F(n,s._$AS(n,t.values),s,i)),t}var Re=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??N).importNode(e,!0);D.currentNode=s;let r=D.nextNode(),o=0,d=0,c=i[0];for(;c!==void 0;){if(o===c.index){let a;c.type===2?a=new ee(r,r.nextSibling,this,t):c.type===1?a=new c.ctor(r,c.name,c.strings,this,t):c.type===6&&(a=new He(r,this,t)),this._$AV.push(a),c=i[++d]}o!==c?.index&&(r=D.nextNode(),o++)}return D.currentNode=N,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},ee=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=F(this,t,e),Z(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==H&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ut(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&Z(this._$AH)?this._$AA.nextSibling.data=t:this.T(N.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Q.createElement(dt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let r=new Re(s,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=ot.get(t.strings);return e===void 0&&ot.set(t.strings,e=new Q(t)),e}k(t){Oe(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let r of t)s===e.length?e.push(i=new n(this.O(J()),this.O(J()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=et(t).nextSibling;et(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},B=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=p}_$AI(t,e=this,i,s){let r=this.strings,o=!1;if(r===void 0)t=F(this,t,e,0),o=!Z(t)||t!==this._$AH&&t!==H,o&&(this._$AH=t);else{let d=t,c,a;for(t=r[0],c=0;c<r.length-1;c++)a=F(this,d[i+c],e,c),a===H&&(a=this._$AH[c]),o||=!Z(a)||a!==this._$AH[c],a===p?t=p:t!==p&&(t+=(a??"")+r[c+1]),this._$AH[c]=a}o&&!s&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ze=class extends B{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},De=class extends B{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},Ne=class extends B{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=F(this,t,e,0)??p)===H)return;let i=this._$AH,s=t===p&&i!==p||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==p&&(i===p||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},He=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){F(this,t)}};var Ft=Ie.litHtmlPolyfillSupport;Ft?.(Q,ee),(Ie.litHtmlVersions??=[]).push("3.3.3");var pt=(n,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let r=e?.renderBefore??null;i._$litPart$=s=new ee(t.insertBefore(J(),r),r,void 0,e??{})}return s._$AI(n),s};var je=globalThis,S=class extends L{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=pt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return H}};S._$litElement$=!0,S.finalized=!0,je.litElementHydrateSupport?.({LitElement:S});var Bt=je.litElementPolyfillSupport;Bt?.({LitElement:S});(je.litElementVersions??=[]).push("4.2.2");function ht(n){return n?.message??String(n)}var Fe=class{constructor(){this.listeners=new Set}subscribe(t,e){return this.listeners.add(e),this.latest&&e(this.latest),this.unsubscribe||(this.unsubscribe=t.connection.subscribeMessage(i=>{this.latest=i.entries,this.listeners.forEach(s=>s(i.entries))},{type:"cmr/subscribe"}),this.unsubscribe.catch(i=>{console.error("cmr: subscription failed",i),this.unsubscribe=void 0,this.listeners.forEach(s=>s([],ht(i)))})),()=>{if(this.listeners.delete(e),this.listeners.size===0&&this.unsubscribe){let i=this.unsubscribe;this.unsubscribe=void 0,this.latest=void 0,i.then(s=>s()).catch(()=>{})}}}once(t){return this.latest?Promise.resolve(this.latest):new Promise((e,i)=>{let s,r=!1;s=this.subscribe(t,(o,d)=>{r||(r=!0,queueMicrotask(()=>s?.()),d?i(new Error(d)):e(o))})})}},pe=new Fe;function he(n,t){if(n?.length)return n.find(e=>e.entry_id===t)??n[0]}var Be=class{constructor(t){this.entryId=t;this.listeners=new Set;this.events=[];this.issues=[];this.loaded=!1}subscribe(t,e){return this.listeners.add(e),this.loaded&&e(this.events,this.issues),this.unsubscribe||(this.unsubscribe=t.connection.subscribeMessage(i=>{this.events=i.reset?i.events:[...this.events,...i.events].slice(-1e3),this.issues=i.issues,this.loaded=!0,this.listeners.forEach(s=>s(this.events,this.issues))},{type:"cmr/events/subscribe",limit:1e3,...this.entryId?{entry_id:this.entryId}:{}}),this.unsubscribe.catch(i=>{console.error("cmr: events subscription failed",i),this.unsubscribe=void 0,this.listeners.forEach(s=>s([],[],ht(i)))})),()=>{if(this.listeners.delete(e),this.listeners.size===0&&this.unsubscribe){let i=this.unsubscribe;this.unsubscribe=void 0,this.loaded=!1,this.events=[],i.then(s=>s()).catch(()=>{})}}}},Ke=class{constructor(){this.feeds=new Map}subscribe(t,e,i){let s=e??"",r=this.feeds.get(s);return r||(r=new Be(e),this.feeds.set(s,r)),r.subscribe(t,i)}},ue=new Ke;function K(n){return n.controller?"mdi:router-network":"mdi:router"}function y(n){return n.pending||n.remote_pending?"pending":n.connected?n.alerts?.on?"alert":n.update_available?"update":"ok":"offline"}function I(n){return n.pending?"approve on the controller":n.remote_pending?"approve on the device":""}var W=["offline","pending","alert","update","ok"];async function me(n,t,e){await n.connection.sendMessagePromise({type:"cmr/pair",entry_id:t,device_key:e})}function ut(n,t){return t?[n.identity,n.board,n.model_code,n.address,n.version,...n.labels].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function mt(){let n=new URLSearchParams(window.location.search),t=n.get("cmr_status");return{status:t&&W.includes(t)?t:void 0,version:n.get("cmr_version")??void 0,search:n.get("cmr_search")??void 0}}function vt(n,t={}){let e=window.location.pathname.split("/")[1]||"lovelace",i=Object.entries(t).filter(s=>!!s[1]).map(([s,r])=>`${s}=${encodeURIComponent(r)}`).join("&");return`/${e}/${n}${i?`?${i}`:""}`}var E={ok:"Online",update:"Update available",alert:"Alert firing",pending:"Waiting to pair",offline:"Disconnected"};function ie(n){if(n==null)return"\u2013";let t=Math.floor(n/86400),e=Math.floor(n%86400/3600),i=Math.floor(n%3600/60);return t?`${t}d ${e}h`:e?`${e}h ${i}m`:i?`${i}m`:`${Math.floor(n)}s`}function O(n,t){return n.controller!==t.controller?n.controller?-1:1:n.identity.localeCompare(t.identity)}async function gt(n){try{if(navigator.clipboard)return await navigator.clipboard.writeText(n),!0}catch{}let t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();let e=!1;try{e=document.execCommand("copy")}catch{e=!1}return t.remove(),e}function Kt(n,t,e){n.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}function k(n,t){t&&Kt(n,"hass-more-info",{entityId:t})}function se(n){history.pushState(null,"",n),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}function re(n,t="never"){if(!n)return t;let e=Math.max(0,(Date.now()-new Date(n).getTime())/1e3);return e<10?"just now":e<60?`${Math.round(e)} s ago`:e<3600?`${Math.round(e/60)} min ago`:e<86400?`${Math.round(e/3600)} h ago`:`${Math.round(e/86400)} d ago`}function ft(n){return n.includes(":")&&!n.startsWith("[")?`http://[${n}]`:`http://${n}`}var A={name:"entry_id",selector:{config_entry:{integration:"cmr"}}};function M(n){return t=>n[t.name]}var w=class extends S{static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0},_error:{state:!0}}}setConfig(t){this._config=t}static getStubConfig(){return{}}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribeStore&&this._subscribeStore()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeStore?.(),this._unsubscribeStore=void 0,window.clearInterval(this._staleTicker),this._staleTicker=void 0}willUpdate(t){t.has("hass")&&this.hass&&!this._unsubscribeStore&&this.isConnected&&this._subscribeStore()}_subscribeStore(){this._unsubscribeStore=pe.subscribe(this.hass,(t,e)=>{this._error=e,this._entry=he(t,this._config?.entry_id);let i=!!this._entry&&!this._entry.available;i&&!this._staleTicker&&(this._staleTicker=window.setInterval(()=>this.requestUpdate(),3e4)),!i&&this._staleTicker&&(window.clearInterval(this._staleTicker),this._staleTicker=void 0)})}renderWaiting(t=""){let e=this._error?`Can't read CMR data from Home Assistant (${this._error}). Reload the page.`:"Waiting for the CMR controller\u2026";return l`<ha-card><div class="empty" style=${t}>${e}</div></ha-card>`}renderStale(t){return t.available?p:l`<div class="stale">
      <ha-icon icon="mdi:lan-disconnect"></ha-icon>Controller unreachable · showing data from ${re(t.last_update)}
    </div>`}},C=x`
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
    /* Light "pedestal" behind product photos, in every theme. */
    --cmr-pedestal: linear-gradient(160deg, #fbfbfc, #e9ebef);
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
  .small {
    font-size: 12px;
  }
  .section-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--cmr-muted);
  }
  .chip.alert {
    background: var(--cmr-alert);
    color: #fff;
  }
  .chip.update {
    background: var(--cmr-update);
    color: #fff;
  }
  /* Toggle buttons: label filters, event categories, layout roots. */
  .pill {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    padding: 3px 10px;
    border-radius: 999px;
    border: 1px solid var(--cmr-line);
    color: var(--cmr-muted);
    --mdc-icon-size: 14px;
  }
  .pill.on {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .stale {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 12px 8px;
    padding: 6px 10px;
    border-radius: 10px;
    font-size: 12px;
    background: color-mix(in srgb, var(--cmr-pending) 14%, transparent);
    color: var(--primary-text-color);
    --mdc-icon-size: 16px;
  }
  .stale ha-icon {
    color: var(--cmr-pending);
  }
  /* Product photos sit on a light "pedestal" in every theme: some photos have
     opaque white backgrounds, and white devices need contrast on light cards. */
  .badge.photo {
    background: var(--cmr-pedestal) !important;
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
`;function U(n,t=""){return n.product?.image?l`<div class="badge photo ${t}" title=${n.product.name}>
      <img src=${n.product.image} alt=${n.product.name} loading="lazy" referrerpolicy="no-referrer"
        @error=${e=>e.target.parentElement.classList.add("broken")} />
      <ha-icon icon=${K(n)}></ha-icon>
    </div>`:l`<div class="badge ${t}"><ha-icon icon=${K(n)}></ha-icon></div>`}function T(n){return(n.product&&!n.product.ambiguous?n.product:void 0)?.name??n.board??"Device"}function ne(n){return n.product&&!n.product.ambiguous?n.product.code:n.model_code}var _t=["critical","high","medium","low"],bt={critical:"mdi:alert-octagon",high:"mdi:alert",medium:"mdi:alert-circle-outline",low:"mdi:information-outline"},ve=class extends w{static{this.properties={_setup:{state:!0},_copied:{state:!0},_push:{state:!0},_only:{state:!0}}}constructor(){super(),this._only=""}async _pushAlerts(t){this._push="busy";try{let e=await this.hass.connection.sendMessagePromise({type:"cmr/alert_push",entry_id:this._entry.entry_id,enable:t}),i=t?"now push to Home Assistant":"no longer push";this._push=`${e.done} rule${e.done===1?"":"s"} ${i}`+(e.failures.length?`; failed: ${e.failures.join("; ")}`:"")}catch(e){this._push=e?.message??String(e)}}static getConfigForm(){return{schema:[A,{name:"title",selector:{text:{}}},{name:"hide_disabled",selector:{boolean:{}}}],computeLabel:M({entry_id:"Controller",title:"Title",hide_disabled:"Hide disabled rules"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){return 2+(this._entry?.alerts.length??4)}async _toggleSetup(){if(this._setup!==void 0){this._setup=void 0;return}this._setup=null;try{this._setup=await this.hass.connection.sendMessagePromise({type:"cmr/alert_setup",entry_id:this._entry.entry_id})}catch(t){console.error("cmr: alert setup",t),this._setup=void 0}}async _copy(){this._setup&&await gt(this._setup.script)&&(this._copied=!0,setTimeout(()=>this._copied=!1,1800))}render(){let t=this._entry;if(!t)return this.renderWaiting();let e=t.alerts.filter(u=>!(this._config.hide_disabled&&u.disabled)),i={firing:e.filter(u=>u.devices_on>0).length,disabled:e.filter(u=>u.disabled).length,pushing:e.filter(u=>u.webhook_ha).length},s=e.filter(u=>this._only==="firing"?u.devices_on>0:this._only==="disabled"?u.disabled:this._only==="pushing"?u.webhook_ha:!0).sort((u,g)=>+(g.devices_on>0)-+(u.devices_on>0)||Number(u.disabled)-Number(g.disabled)||_t.indexOf(u.severity)-_t.indexOf(g.severity)||u.name.localeCompare(g.name)),r=s.filter(u=>u.devices_on>0).length,o=t.alerts.filter(u=>u.webhook_ha).length,d=t.actions&&!!this.hass.user?.is_admin,c=t.fleet_entities.fleet_alert,a=c?this.hass.states[c]:void 0,m=a?.attributes??{};return l`
      <ha-card>
        <div class="card-header">
          <ha-icon icon=${r?"mdi:bell-alert":"mdi:bell-check-outline"}></ha-icon>
          <span>${this._config.title??"Alerts"}</span>
          ${r?l`<span class="chip alert">${r} firing</span>`:l`<span class="chip">all quiet</span>`}
          <div class="spacer"></div>
        </div>
        ${this.renderStale(t)}
        ${e.length>3?l`<div class="filters">
              <button class="pill ${this._only?"":"on"}" @click=${()=>this._only=""}>All ${e.length}</button>
              ${i.firing?l`<button class="pill hot ${this._only==="firing"?"on":""}" @click=${()=>this._only=this._only==="firing"?"":"firing"}>
                  <ha-icon icon="mdi:bell-alert-outline"></ha-icon>Firing ${i.firing}</button>`:p}
              ${i.pushing?l`<button class="pill ${this._only==="pushing"?"on":""}" @click=${()=>this._only=this._only==="pushing"?"":"pushing"}>
                  <ha-icon icon="mdi:webhook"></ha-icon>Pushing ${i.pushing}</button>`:p}
              ${i.disabled?l`<button class="pill ${this._only==="disabled"?"on":""}" @click=${()=>this._only=this._only==="disabled"?"":"disabled"}>
                  <ha-icon icon="mdi:bell-off-outline"></ha-icon>Disabled ${i.disabled}</button>`:p}
            </div>`:p}

        ${a&&a.state!=="unknown"&&a.state!=="unavailable"?l`<button class="last sev-${m.event_type}" @click=${()=>k(this,c)}>
              <ha-icon icon=${bt[m.event_type]??"mdi:bell"}></ha-icon>
              <div>
                <div><b>${m.alert}</b>${m.device?l` · ${m.device}`:p}</div>
                <div class="muted small">Last pushed alert · ${re(a.state,"")}</div>
              </div>
            </button>`:p}

        <div class="rules">
          ${s.map(u=>this._rule(u))}
          ${s.length?p:l`<div class="empty">${e.length?"No rules match this filter.":"No alert rules on the controller."}</div>`}
        </div>

        ${this.hass.user?.is_admin?l`<div class="footer">
              ${d?l`<div class="push">
                    <ha-icon icon="mdi:webhook"></ha-icon>
                    <span class="small">${o?`${o} of ${t.alerts.length} rules push to Home Assistant`:"Alerts reach Home Assistant on the next poll only"}</span>
                    <button class="copy" ?disabled=${this._push==="busy"} @click=${()=>this._pushAlerts(o<t.alerts.length)}>
                      ${this._push==="busy"?"Working\u2026":o<t.alerts.length?"Push alerts to Home Assistant":"Stop pushing"}
                    </button>
                    ${this._push&&this._push!=="busy"?l`<div class="muted small">${this._push}</div>`:p}
                  </div>`:l`<button class="link" @click=${this._toggleSetup}>
                      <ha-icon icon="mdi:webhook"></ha-icon>
                      ${o?`${o} of ${t.alerts.length} rules push to Home Assistant`:"Push alerts to Home Assistant instantly"}
                      <ha-icon icon=${this._setup!==void 0?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                    </button>
                    ${this._setup===null?l`<div class="muted small">Loading…</div>`:p}
                    ${this._setup?l`<div class="setup">
                          <div class="small">Paste into the controller's terminal. Each alert rule gets an HTTP action that calls Home Assistant; edit <code>find</code> to choose rules. (With <i>Allow actions on the controller</i> in the options this becomes one click.)</div>
                          <pre>${this._setup.script}</pre>
                          <button class="copy" @click=${this._copy}>
                            <ha-icon icon=${this._copied?"mdi:check":"mdi:content-copy"}></ha-icon>${this._copied?"Copied":"Copy script"}
                          </button>
                        </div>`:p}`}
            </div>`:p}
      </ha-card>
    `}_rule(t){let e=t.devices_on>0;return l`
      <button class="rule sev-${t.severity} ${e?"on":""} ${t.disabled?"disabled":""}"
              @click=${()=>k(this,t.entity_id)}>
        <span class="stripe"></span>
        <ha-icon class="sev" icon=${bt[t.severity]}></ha-icon>
        <div class="body">
          <div class="title">
            <span class="name">${t.name}</span>
            ${t.webhook?l`<ha-icon class="hook" icon="mdi:webhook" title=${t.webhook_ha?"Pushes to Home Assistant":"Pushes to another webhook"}></ha-icon>`:p}
          </div>
          <div class="muted small">
            ${t.disabled?"disabled \xB7 ":p}${t.categories.join(", ")||"uncategorised"} ·
            ${t.labels.join(", ")||"all"}
          </div>
        </div>
        <div class="nums">
          <div class=${e?"hot":""}>${t.devices_on}/${t.devices}</div>
          <div class="muted small" title="Times fired">${t.fired}×</div>
        </div>
      </button>
    `}static{this.styles=[C,x`
      .filters { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px; }
      .pill.hot:not(.on) { border-color: color-mix(in srgb, var(--cmr-alert) 55%, transparent); color: var(--cmr-alert); }
      .pill.hot.on { background: var(--cmr-alert); border-color: var(--cmr-alert); }
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
      .nums { text-align: right; font-variant-numeric: tabular-nums; font-size: 13px; }
      .hot { color: var(--cmr-alert); font-weight: 700; }
      .footer { border-top: 1px solid var(--cmr-line); padding: 8px 12px 12px; }
      .footer .link {
        all: unset; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px;
        color: var(--primary-color); --mdc-icon-size: 18px;
      }
      .setup { margin-top: 8px; display: flex; flex-direction: column; gap: 8px; }
      .push { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; --mdc-icon-size: 18px; }
      .push ha-icon { color: var(--cmr-muted); }
      .push .copy { align-self: center; }
      .push .copy[disabled] { opacity: 0.6; cursor: default; }
      .push > .muted { flex-basis: 100%; }
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
    `]}};var Wt=new Set(["insight","device","alert","upgrade","security","config"]),Vt=n=>n.notable??(Wt.has(n.category)||n.severity==="warning"||n.severity==="error"),ge={insight:{icon:"mdi:stethoscope",label:"Issues"},device:{icon:"mdi:router-network",label:"Devices"},alert:{icon:"mdi:bell-outline",label:"Alerts"},upgrade:{icon:"mdi:update",label:"Upgrades"},wifi:{icon:"mdi:wifi",label:"Wi-Fi"},link:{icon:"mdi:ethernet",label:"Links"},security:{icon:"mdi:shield-alert-outline",label:"Security"},login:{icon:"mdi:account-key-outline",label:"Logins"},config:{icon:"mdi:cog-outline",label:"Config"},dhcp:{icon:"mdi:ip-network-outline",label:"DHCP"},system:{icon:"mdi:cog-transfer-outline",label:"System"},api:{icon:"mdi:api",label:"API logins"}},xt={icon:"mdi:text-box-outline",label:"Other"};function yt(n){return ge[n]?ge[n]:n?{...xt,label:n[0].toUpperCase()+n.slice(1)}:xt}function qt(n){let t=n.data?.event;return n.category==="wifi"?t==="disconnected"?"mdi:wifi-off":t==="roamed"?"mdi:wifi-sync":"mdi:wifi-plus":n.category==="link"?n.data?.state==="down"?"mdi:ethernet-off":"mdi:ethernet":n.category==="device"?t==="disconnected"?"mdi:lan-disconnect":t==="rebooted"?"mdi:restart":"mdi:lan-connect":n.category==="insight"&&t==="resolved"?"mdi:check-circle-outline":yt(n.category).icon}function Yt(n){let t=n.data??{},e=t.mac??t.interface??t.user??t.rule_id??t.key??n.title;return`${n.category}|${n.device_key??""}|${String(e)}`}var Gt=864e5,fe=class extends S{constructor(){super();this._loaded=!1;this._events=[],this._issues=[],this._category="",this._device="",this._search="",this._open=new Set,this._limit=50}static{this.properties={hass:{attribute:!1},_config:{state:!0},_events:{state:!0},_issues:{state:!0},_category:{state:!0},_device:{state:!0},_search:{state:!0},_open:{state:!0},_limit:{state:!0},_notable:{state:!0}}}setConfig(e){this._unsubscribe&&e.entry_id!==this._config?.entry_id&&(this._unsubscribe(),this._unsubscribe=void 0,this._loaded=!1),this._config={show_issues:!0,show_filters:!0,hide_categories:["api"],max_items:50,...e},!this._unsubscribe&&this.hass&&this.isConnected&&this._subscribe(),this._limit=this._config.max_items??50,this._device=e.device??"",this._notable=!!e.notable}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"title",selector:{text:{}}},{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"device",selector:{text:{}}},{name:"max_items",selector:{number:{min:5,max:500,mode:"box"}}},{name:"notable",selector:{boolean:{}}},{name:"show_issues",selector:{boolean:{}}},{name:"show_filters",selector:{boolean:{}}}],computeLabel:e=>({title:"Title",entry_id:"Controller (default: all)",device:"Only this device (identity)",max_items:"Rows to show",notable:"Start with notable events only",show_issues:"Show detected issues",show_filters:"Show filters"})[e.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=ue.subscribe(this.hass,this._config?.entry_id,(e,i,s)=>{this._events=e,this._issues=i,this._error=s,this._loaded=!0})}_visible(){let e=this._config,i=this._search.trim().toLowerCase(),s=new Set(e.hide_categories??[]);return this._events.filter(r=>{if(this._notable&&!this._category&&!Vt(r))return!1;if(this._category){if(r.category!==this._category)return!1}else if(e.categories?.length?!e.categories.includes(r.category):s.has(r.category))return!1;return!(this._device&&r.device_name!==this._device||i&&!`${r.title} ${r.message} ${r.device_name??""}`.toLowerCase().includes(i))})}_rows(e){let i=[];for(let s=e.length-1;s>=0;s--){let r=e[s],o=Yt(r),d=i[i.length-1],c=d&&new Date(d.events[0].time).toDateString()===new Date(r.time).toDateString();d&&d.key===o&&c&&r.category!=="insight"?d.events.push(r):i.push({key:o,events:[r]})}return i}_toggle(e){let i=new Set(this._open);i.has(e)?i.delete(e):i.add(e),this._open=i}render(){if(!this._loaded)return l`<ha-card><div class="empty">Loading network events…</div></ha-card>`;if(this._error)return l`<ha-card><div class="empty">Can't read CMR events from Home Assistant (${this._error}). Reload the page.</div></ha-card>`;let e=this._config,i=this._visible(),s=this._rows(i),r=s.slice(0,this._limit),o=[...new Set(this._events.map(a=>a.category))].sort((a,m)=>Object.keys(ge).indexOf(a)-Object.keys(ge).indexOf(m)),d=[...new Set(this._events.map(a=>a.device_name).filter(Boolean))].sort(),c=this._device?this._issues.filter(a=>a.device_name===this._device):this._issues;return l`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:timeline-text-outline"></ha-icon>
          <span>${e.title??"Network events"}</span>
          ${c.length?l`<span class="chip alert">${c.length} issue${c.length>1?"s":""}</span>`:l`<span class="chip">no issues</span>`}
        </div>

        ${e.show_issues&&c.length?l`<div class="issues">${c.map(a=>this._issue(a))}</div>`:p}

        ${e.show_filters?l`<div class="filters">
              <div class="cats">
                <button class="pill ${!this._category&&this._notable?"on":""}"
                  @click=${()=>{this._category="",this._notable=!0}}>
                  <ha-icon icon="mdi:star-four-points-outline"></ha-icon>Notable</button>
                <button class="pill ${!this._category&&!this._notable?"on":""}"
                  @click=${()=>{this._category="",this._notable=!1}}>All</button>
                ${o.map(a=>{let m=yt(a);return l`<button class="pill ${this._category===a?"on":""}" @click=${()=>this._category=this._category===a?"":a}>
                    <ha-icon icon=${m.icon}></ha-icon>${m.label}
                  </button>`})}
              </div>
              <div class="find">
                <select .value=${this._device} @change=${a=>this._device=a.target.value}>
                  <option value="">All devices</option>
                  ${d.map(a=>l`<option value=${a} ?selected=${a===this._device}>${a}</option>`)}
                </select>
                <input type="search" placeholder="Search" .value=${this._search}
                  @input=${a=>this._search=a.target.value} />
              </div>
            </div>`:p}

        <div class="timeline">
          ${r.map((a,m)=>{let u=new Date(a.events[0].time),g=m?new Date(r[m-1].events[0].time):void 0,v=!g||g.toDateString()!==u.toDateString();return l`${v?l`<div class="day section-label">${this._dayLabel(u)}</div>`:p}${this._row(a)}`})}
          ${r.length?p:l`<div class="empty">No events${this._search||this._category||this._device?" match these filters":" yet"}.</div>`}
          ${s.length>this._limit?l`<button class="more" @click=${()=>this._limit+=50}>Show more (${s.length-this._limit})</button>`:p}
        </div>
      </ha-card>
    `}_issue(e){let i=e.device_name;return l`<div class="issue sev-${e.severity}">
      <ha-icon icon=${e.severity==="error"?"mdi:alert-octagon-outline":"mdi:alert-outline"}></ha-icon>
      <div class="body">
        <div class="title">${e.title}</div>
        <div class="detail">${e.detail}</div>
        <div class="meta">
          since ${this._time(new Date(e.since))} · ${e.count}×
          ${i&&e.device_id?l`· <a href="#" @click=${s=>{s.preventDefault(),se(`/config/devices/device/${e.device_id}`)}}>${i}</a>`:i?l`· ${i}`:p}
        </div>
      </div>
    </div>`}_row(e){let i=e.events[0],s=i.id,r=this._open.has(s),o=e.events.length>1,d=e.events[e.events.length-1],c=new Map;for(let a of e.events){let m=String(a.data?.event??a.category);c.set(m,(c.get(m)??0)+1)}return l`
      <div class="row sev-${i.severity} ${r?"open":""}">
        <button class="line" @click=${()=>this._toggle(s)}>
          <span class="time">${this._time(new Date(i.time))}</span>
          <span class="dot-icon"><ha-icon icon=${qt(i)}></ha-icon></span>
          <span class="text">
            <span class="title">${i.title}</span>
            ${o?l`<span class="fold">${e.events.length} events since ${this._time(new Date(d.time))} ·
                  ${[...c].map(([a,m])=>`${m} ${a}`).join(", ")}</span>`:p}
          </span>
          ${i.device_name?l`<span class="device">${i.device_name}</span>`:p}
        </button>
        ${r?this._details(e):p}
      </div>
    `}_details(e){let i=e.events.slice(0,30);return l`<div class="details">
      ${i.map(s=>{let r=Object.entries(s.data??{}).filter(([o,d])=>d!=null&&d!==""&&!["event","key","rule_id"].includes(o));return l`<div class="detail-item">
          <div class="detail-head"><span class="mono">${new Date(s.time).toLocaleString(this.hass.language)}</span>
            <span class="muted">${s.source}${s.topics?.length?` \xB7 ${s.topics.join(",")}`:""}</span></div>
          ${s.message&&s.message!==s.title?l`<div class="raw mono">${s.message}</div>`:p}
          ${r.length?l`<div class="fields">${r.map(([o,d])=>l`<span class="chip">${o.replace(/_/g," ")}: ${typeof d=="object"?JSON.stringify(d):String(d)}</span>`)}</div>`:p}
        </div>`})}
      ${e.events.length>i.length?l`<div class="muted">…and ${e.events.length-i.length} more</div>`:p}
      ${e.events[0].device_id?l`<a class="open-device" href="#" @click=${s=>{s.preventDefault(),se(`/config/devices/device/${e.events[0].device_id}`)}}>
            <ha-icon icon="mdi:open-in-app"></ha-icon>Open ${e.events[0].device_name}</a>`:p}
    </div>`}_time(e){return e.toLocaleTimeString(this.hass.language,{hour:"2-digit",minute:"2-digit"})}_dayLabel(e){let i=new Date;i.setHours(0,0,0,0);let s=new Date(e);s.setHours(0,0,0,0);let r=Math.round((i.getTime()-s.getTime())/Gt);return r===0?"Today":r===1?"Yesterday":e.toLocaleDateString(this.hass.language,{weekday:"long",day:"numeric",month:"long"})}static{this.styles=[C,x`
      ha-card { container-type: inline-size; }
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
      .find { display: flex; gap: 8px; }
      .find select, .find input {
        font: inherit; font-size: 13px; padding: 6px 10px; border-radius: 8px; min-width: 0;
        border: 1px solid var(--cmr-line); background: var(--cmr-surface); color: var(--primary-text-color);
      }
      .find input { flex: 1; }

      .timeline { padding: 0 8px 10px; }
      .day { padding: 10px 8px 4px; }
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
    `]}};var Xt={offline:"mdi:lan-disconnect",pending:"mdi:link-variant-plus",alert:"mdi:bell-alert-outline",update:"mdi:update",ok:"mdi:check-circle-outline"},_e=class extends w{constructor(){super();this._onLocation=()=>this._applyDeepLink();this._filter=new Set,this._status="",this._version="",this._search="",this._sort={key:"attention",desc:!1},this._limit=100,this._unfolded=!1,this._pairing=new Map}static{this.properties={_filter:{state:!0},_status:{state:!0},_version:{state:!0},_search:{state:!0},_sort:{state:!0},_limit:{state:!0},_unfolded:{state:!0},_pairing:{state:!0}}}setConfig(e){this._config={show_filters:!0,show_search:!0,fold_after:50,page_size:100,deep_link:!0,...e},this._filter=new Set(e.labels??[]),this._status=e.status??"",this._version=e.version??"",this._limit=this._config.page_size??100,this._applyDeepLink()}static getConfigForm(){return{schema:[A,{name:"title",selector:{text:{}}},{name:"labels",selector:{text:{multiple:!0}}},{name:"status",selector:{select:{mode:"dropdown",options:W.map(e=>({value:e,label:E[e]}))}}},{name:"show_filters",selector:{boolean:{}}},{name:"show_search",selector:{boolean:{}}},{name:"fold_after",selector:{number:{min:0,max:5e3,mode:"box"}}}],computeLabel:M({entry_id:"Controller",title:"Title",labels:"Only devices with these labels",status:"Only devices with this status",show_filters:"Show filter chips",show_search:"Show search",fold_after:"Fold healthy devices above this many rows (0: never)"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 2+Math.min(this._entry?.devices.length??4,12)}connectedCallback(){super.connectedCallback(),window.addEventListener("location-changed",this._onLocation),this._applyDeepLink()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("location-changed",this._onLocation)}_applyDeepLink(){if(this._config?.deep_link===!1)return;let e=mt();e.status&&(this._status=e.status),e.version&&(this._version=e.version),e.search&&(this._search=e.search)}_toggleLabel(e){let i=new Set(this._filter);i.has(e)?i.delete(e):i.add(e),this._filter=i}_setStatus(e){this._status=this._status===e?"":e,this._limit=this._config.page_size??100}_setSort(e){this._sort={key:e,desc:this._sort.key===e?!this._sort.desc:!1}}async _approve(e){this._pairing=new Map(this._pairing).set(e.key,"busy");try{await me(this.hass,this._entry.entry_id,e.key);let i=new Map(this._pairing);i.delete(e.key),this._pairing=i}catch(i){let s=i?.message??String(i);this._pairing=new Map(this._pairing).set(e.key,s)}}_sorted(e){let{key:i,desc:s}=this._sort,r=[...e].sort((o,d)=>{switch(i){case"device":return O(o,d);case"version":return(o.version??"").localeCompare(d.version??"",void 0,{numeric:!0});case"uptime":return(o.uptime??-1)-(d.uptime??-1);case"address":return(o.address??"").localeCompare(d.address??"",void 0,{numeric:!0});default:return W.indexOf(y(o))-W.indexOf(y(d))||O(o,d)}});return s?r.reverse():r}render(){let e=this._entry;if(!e)return this.renderWaiting();let i=[...new Set(e.devices.flatMap(h=>h.labels))].sort(),s=this._search.trim().toLowerCase(),r=e.devices.filter(h=>[...this._filter].every(b=>h.labels.includes(b))&&(!this._version||h.version===this._version)&&ut(h,s)),o=new Map;for(let h of r)o.set(y(h),(o.get(y(h))??0)+1);let d=this._sorted(this._status?r.filter(h=>y(h)===this._status):r),c=this._config.fold_after??50,a=d.filter(h=>y(h)!=="ok"),m=!this._status&&!this._unfolded&&c>0&&d.length>c&&a.length>0,u=m?a:d,g=u.slice(0,this._limit),v=h=>this._sort.key===h?l`<ha-icon class="sort" icon=${this._sort.desc?"mdi:arrow-down":"mdi:arrow-up"}></ha-icon>`:p;return l`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:router-network"></ha-icon>
          <span>${this._config.title??"Devices"}</span>
          <span class="chip">${d.length}${d.length!==e.devices.length?` of ${e.devices.length}`:""}</span>
          <div class="spacer"></div>
          ${this._config.show_search?l`<input class="search" type="search" placeholder="Search" .value=${this._search}
                @input=${h=>{this._search=h.target.value,this._limit=this._config.page_size??100}} />`:p}
        </div>
        ${this.renderStale(e)}
        ${this._config.show_filters?l`<div class="filters">
              <button class="pill ${this._status?"":"on"}" @click=${()=>this._setStatus("")}>All ${r.length}</button>
              ${W.filter(h=>o.get(h)||h===this._status).map(h=>l`<button class="pill status-${h} ${this._status===h?"on":""}"
                  @click=${()=>this._setStatus(h)}>
                  <ha-icon icon=${Xt[h]}></ha-icon>${E[h]} ${o.get(h)??0}
                </button>`)}
              ${this._version?l`<button class="pill on" title="Clear the version filter" @click=${()=>this._version=""}>
                    <span class="mono">${this._version}</span> ✕</button>`:p}
              ${i.length?l`<span class="sep"></span>`:p}
              ${i.map(h=>l`<button class="pill ${this._filter.has(h)?"on":""}" @click=${()=>this._toggleLabel(h)}>
                  ${h}
                </button>`)}
            </div>`:p}
        <div class="table" role="table">
          <div class="row head section-label" role="row">
            <button class="c-device" @click=${()=>this._setSort(this._sort.key==="device"?"attention":"device")}
              title="Click to sort by name; again for attention first">
              Device ${v("device")}${this._sort.key==="attention"?l`<ha-icon class="sort" icon="mdi:sort-variant" title="Attention first"></ha-icon>`:p}
            </button>
            <span class="c-labels">Labels</span>
            <button class="c-version" @click=${()=>this._setSort("version")}>Version ${v("version")}</button>
            <button class="c-uptime" @click=${()=>this._setSort("uptime")}>Uptime ${v("uptime")}</button>
            <button class="c-address" @click=${()=>this._setSort("address")}>Address ${v("address")}</button>
          </div>
          ${g.map(h=>this._row(h))}
          ${m?l`<button class="fold" @click=${()=>this._unfolded=!0}>
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                ${d.length-a.length} devices online and up to date — show them
              </button>`:p}
          ${u.length>this._limit?l`<button class="more" @click=${()=>this._limit+=this._config.page_size??100}>
                Show more (${u.length-this._limit})</button>`:p}
          ${d.length?p:l`<div class="empty">${this._emptyText(e.devices.length)}</div>`}
        </div>
      </ha-card>
    `}_emptyText(e){return e?this._status?`No devices are ${E[this._status].toLowerCase()}.`:"No devices match these filters.":"The controller manages no devices yet."}_pairingCell(e,i){let s=this._pairing.get(e.key),r=e.pending&&!!this._entry?.actions&&!!this.hass.user?.is_admin;return l`<span class="offline" title=${I(e)}>${E[i]}</span>
      ${r?l`<button class="approve" ?disabled=${s==="busy"}
            @click=${o=>{o.stopPropagation(),this._approve(e)}}>
            ${s==="busy"?"Approving\u2026":"Approve"}</button>`:p}
      ${s&&s!=="busy"?l`<span class="small offline">${s}</span>`:p}`}_uptimeCell(e,i){return i==="pending"?this._pairingCell(e,i):e.connected?l`${ie(e.uptime)}`:l`<span class="offline">${E[i]}</span>
        ${e.disconnected_since?l`<span class="muted small">since ${e.disconnected_since}</span>`:p}`}_row(e){let i=y(e);return l`
      <div class="row status-${i}" role="row" @click=${()=>k(this,e.entities.connected)}>
        <div class="c-device">
          <div class="icon" title=${E[i]}>${U(e,"thumb")}<i class="dot"></i></div>
          <div class="who">
            <div class="name">
              ${e.identity}
              ${e.controller?l`<ha-icon class="crown" icon="mdi:crown-outline" title="CMR controller"></ha-icon>`:p}
            </div>
            <div class="muted small">${T(e)}${ne(e)?l` · <span class="mono">${ne(e)}</span>`:p}</div>
          </div>
        </div>
        <div class="c-labels">${e.labels.map(s=>l`<span class="chip">${s}</span>`)}</div>
        <div class="c-version" title=${e.prerelease?"Pre-release build \xB7 click to filter by this version":"Click to filter by this version"}>
          <button class="ver mono" @click=${s=>{s.stopPropagation(),this._version=this._version===e.version?"":e.version??""}}>
            ${e.version??"\u2013"}</button>
          ${e.update_available?l`<span class="update" title="Update available"><ha-icon icon="mdi:arrow-up-circle"></ha-icon><span class="mono">${e.available_version}</span></span>`:p}
        </div>
        <div class="c-uptime">${this._uptimeCell(e,i)}</div>
        <div class="c-address">
          ${e.address?l`<a class="mono" href=${ft(e.address)} target="_blank" rel="noreferrer" @click=${s=>s.stopPropagation()}>${e.address}</a>`:l`<span class="muted">${e.controller?"local":"\u2013"}</span>`}
        </div>
      </div>
    `}static{this.styles=[C,x`
      ha-card { container-type: inline-size; }
      .card-header { flex-wrap: wrap; }
      .search {
        font: inherit; font-size: 13px; padding: 5px 10px; border-radius: 999px; width: 160px; max-width: 100%;
        border: 1px solid var(--cmr-line); background: var(--cmr-surface); color: var(--primary-text-color);
      }
      .filters { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 0 16px 10px; }
      .filters .sep { width: 1px; height: 18px; background: var(--cmr-line); margin: 0 4px; }
      .pill.status-offline:not(.on), .pill.status-pending:not(.on), .pill.status-alert:not(.on), .pill.status-update:not(.on) {
        border-color: color-mix(in srgb, var(--status) 55%, transparent); color: var(--status);
      }
      .pill.on.status-offline, .pill.on.status-pending, .pill.on.status-alert, .pill.on.status-update {
        background: var(--status); border-color: var(--status);
      }
      .table { padding: 0 8px 8px; }
      .row {
        display: grid; grid-template-columns: minmax(180px, 2.2fr) minmax(90px, 1.4fr) minmax(120px, 1.4fr) minmax(80px, 1fr) 120px;
        gap: 10px; align-items: center; padding: 8px; border-radius: 10px; cursor: pointer;
      }
      .row:not(.head):hover { background: var(--cmr-surface-2); }
      .row.head { cursor: default; padding-bottom: 4px; }
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
      .small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .c-labels { display: flex; flex-wrap: wrap; gap: 4px; }
      .c-version { display: flex; flex-wrap: wrap; gap: 4px 8px; align-items: center; font-size: 13px; }
      .ver { all: unset; cursor: pointer; border-bottom: 1px dotted transparent; }
      .ver:hover { border-bottom-color: var(--cmr-muted); }
      .update { display: inline-flex; align-items: center; gap: 3px; color: var(--cmr-update); font-weight: 600; --mdc-icon-size: 15px; }
      .c-uptime { font-size: 13px; font-variant-numeric: tabular-nums; display: flex; flex-wrap: wrap; gap: 2px 8px; align-items: center; }
      .offline { color: var(--cmr-offline); font-weight: 500; }
      .status-pending .offline { color: var(--cmr-pending); }
      .approve {
        all: unset; cursor: pointer; font-size: 12px; padding: 3px 10px; border-radius: 999px;
        background: var(--primary-color); color: var(--text-primary-color, #fff);
      }
      .approve[disabled] { opacity: 0.6; cursor: default; }
      .c-address a { color: var(--primary-color); text-decoration: none; font-size: 12.5px; }
      .c-address a:hover { text-decoration: underline; }
      .fold, .more {
        all: unset; cursor: pointer; box-sizing: border-box; width: 100%; display: flex; align-items: center; justify-content: center;
        gap: 8px; padding: 10px 8px; margin-top: 4px; border-radius: 10px; font-size: 13px; color: var(--primary-color);
        background: var(--cmr-surface-2); --mdc-icon-size: 18px;
      }
      .fold ha-icon { color: var(--cmr-ok); }
      .more { background: none; }

      @container (max-width: 640px) {
        .card-header .search { width: 100%; order: 10; }
        .row { grid-template-columns: 1fr auto; grid-template-areas: "device uptime" "version address" "labels labels"; gap: 4px 10px; }
        .row.head { display: none; }
        .c-device { grid-area: device; }
        .c-uptime { grid-area: uptime; justify-content: flex-end; text-align: right; }
        .c-version { grid-area: version; padding-left: 44px; }
        .c-address { grid-area: address; text-align: right; }
        .c-labels { grid-area: labels; padding-left: 44px; }
        .row:not(.head) { border-bottom: 1px solid var(--cmr-line); border-radius: 0; }
      }
    `]}};var be=["var(--primary-color)","var(--cmr-update)","var(--cmr-pending)","var(--accent-color, #7e57c2)","var(--cmr-ok)","var(--cmr-muted)"],xe=class extends w{static{this.properties={_panel:{state:!0},_version:{state:!0},_issues:{state:!0},_pairing:{state:!0}}}constructor(){super(),this._issues=[],this._pairing=new Map}static getConfigForm(){return{schema:[A],computeLabel:M({entry_id:"Controller"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 4}connectedCallback(){super.connectedCallback(),this._ticker=window.setInterval(()=>this.requestUpdate(),15e3)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._ticker),this._unsubscribeEvents?.(),this._unsubscribeEvents=void 0}_toggle(t,e){let i=this._panel===t&&(t!=="version"||this._version===e);this._panel=i?void 0:t,this._version=i?void 0:e,this._panel==="issues"&&!this._unsubscribeEvents?this._unsubscribeEvents=ue.subscribe(this.hass,this._config?.entry_id,(s,r)=>{this._issues=r}):this._panel!=="issues"&&this._unsubscribeEvents&&(this._unsubscribeEvents(),this._unsubscribeEvents=void 0)}async _approve(t){this._pairing=new Map(this._pairing).set(t.key,"busy");try{await me(this.hass,this._entry.entry_id,t.key);let e=new Map(this._pairing);e.delete(t.key),this._pairing=e}catch(e){this._pairing=new Map(this._pairing).set(t.key,e?.message??String(e))}}render(){let t=this._entry;if(!t)return this.renderWaiting();let e=t.devices,i=e.find(f=>f.controller),s=e.filter(f=>f.connected).length,r=e.filter(f=>f.update_available).length,o=e.filter(f=>f.pending||f.remote_pending).length,d=t.alerts.filter(f=>f.devices_on>0).length,c=t.fleet_entities.network_issues?this.hass.states[t.fleet_entities.network_issues]?.state:void 0,a=Number(c)||0,m=e.length?s/e.length:0,u=new Map;e.forEach(f=>u.set(f.version??"unknown",(u.get(f.version??"unknown")??0)+1));let g=[...u.entries()].sort((f,$)=>$[1]-f[1]),v=26,h=2*Math.PI*v,b=f=>this._panel===f?"on":"";return l`
      <ha-card>
        <div class="hero">
          <div class="identity">
            ${i?.product?.image?l`<div class="logo photo"><img src=${i.product.image} alt=${i.product.name} referrerpolicy="no-referrer" /></div>`:l`<div class="logo"><ha-icon icon="mdi:router-network"></ha-icon></div>`}
            <div class="who">
              <div class="eyebrow">CMR controller</div>
              <div class="name">${i?.identity??t.title}</div>
              <div class="meta">
                ${i?T(i):""} ·
                <span class="mono">${i?.version??"?"}</span>
                ${i?.prerelease?l`<span class="chip">pre-release</span>`:p}
              </div>
            </div>
            <a class="open" href=${t.controller_url} target="_blank" rel="noreferrer" title="Open the router's web interface">
              <ha-icon icon="mdi:open-in-new"></ha-icon>
            </a>
          </div>

          <div class="stats">
            <button class="stat ring ${b("online")}" aria-pressed=${this._panel==="online"} @click=${()=>this._toggle("online")}>
              <svg viewBox="0 0 64 64" class=${s===e.length?"status-ok":"status-offline"}>
                <circle cx="32" cy="32" r=${v} class="track"></circle>
                <circle cx="32" cy="32" r=${v} class="value"
                  stroke-dasharray=${`${h*m} ${h}`} transform="rotate(-90 32 32)"></circle>
              </svg>
              <div class="ring-text"><b>${s}</b><span>/${e.length}</span></div>
              <div class="label">online</div>
            </button>
            ${this._stat("updates","mdi:update",r,"updates",r?"update":"ok")}
            ${this._stat("alerts","mdi:bell-alert-outline",d,"alerts firing",d?"alert":"ok")}
            ${this._stat("issues","mdi:stethoscope",a,a===1?"issue":"issues",a?"pending":"ok")}
            ${this._stat("pending","mdi:link-variant-plus",o,"to pair",o?"pending":"ok")}
          </div>
        </div>
        ${this.renderStale(t)}
        ${this._panel?this._renderPanel(t):p}

        <div class="bars">
          <div class="bar-title">
            <span>Versions</span>
            <span class="muted">updated ${re(t.last_update)}</span>
          </div>
          <div class="bar">
            ${g.map(([f,$],_)=>l`<button class="seg ${this._panel==="version"&&this._version===f?"on":""}"
                title="${f}: ${$} — click to list them"
                style="flex:${$};background:${be[_%be.length]}"
                @click=${()=>this._toggle("version",f)}></button>`)}
          </div>
          <div class="keys">
            ${g.map(([f,$],_)=>l`<button class="key ${this._panel==="version"&&this._version===f?"on":""}"
                @click=${()=>this._toggle("version",f)}>
                <i style="background:${be[_%be.length]}"></i>
                <span class="mono">${f}</span> <span class="muted">×${$}</span></button>`)}
          </div>
        </div>
      </ha-card>
    `}_stat(t,e,i,s,r){return l`
      <button class="stat status-${r} ${this._panel===t?"on":""}" aria-pressed=${this._panel===t}
        @click=${()=>this._toggle(t)}>
        <ha-icon icon=${e}></ha-icon>
        <b>${i}</b>
        <div class="label">${s}</div>
      </button>
    `}_renderPanel(t){let e=this._panel,i=c=>[...c].sort(O),s="",r=[],o="",d;if(e==="online"){let c=i(t.devices.filter(a=>!a.connected));s=c.length?`${c.length} offline`:"All devices online",o="Every managed device is connected to the controller.",r=c.map(a=>this._deviceRow(a,a.disconnected_since?`since ${a.disconnected_since}`:"disconnected")),d={view:this._config.views?.devices,params:{cmr_status:"offline"}}}else if(e==="updates"){let c=i(t.devices.filter(a=>a.update_available));s=c.length?`${c.length} with an update`:"Everything is up to date",o="No device's channel offers a newer version.",r=c.map(a=>this._deviceRow(a,l`<span class="mono">${a.version}</span> → <span class="mono up">${a.available_version}</span>`,a.entities.update)),d={view:this._config.views?.devices,params:{cmr_status:"update"}}}else if(e==="alerts"){let c=t.alerts.filter(a=>a.devices_on>0).sort((a,m)=>m.devices_on-a.devices_on);s=c.length?`${c.length} alert rule${c.length>1?"s":""} firing`:"No alert rule is firing",o="All alert rules are quiet.",r=c.map(a=>this._ruleRow(a))}else if(e==="issues")s=this._issues.length?`${this._issues.length} detected issue${this._issues.length>1?"s":""}`:"No issues detected",o=this._unsubscribeEvents?"Nothing unusual in the events.":"Loading\u2026",r=this._issues.map(c=>l`<div class="item sev-${c.severity}">
          <ha-icon icon=${c.severity==="error"?"mdi:alert-octagon-outline":"mdi:alert-outline"}></ha-icon>
          <div class="text">
            <div class="t">${c.title}</div>
            <div class="muted small">${c.detail}</div>
          </div>
          ${c.device_name?l`<span class="chip">${c.device_name}</span>`:p}
        </div>`),d={view:this._config.views?.events,params:{}};else if(e==="pending"){let c=i(t.devices.filter(a=>a.pending||a.remote_pending));s=c.length?`${c.length} waiting to pair`:"No device is waiting to pair",o="New devices appear here until their pairing is approved.",r=c.map(a=>this._pendingRow(a,t)),d={view:this._config.views?.devices,params:{cmr_status:"pending"}}}else{let c=i(t.devices.filter(a=>(a.version??"unknown")===this._version));s=`${c.length} on ${this._version}`,r=c.map(a=>this._deviceRow(a,a.update_available?l`update: <span class="mono up">${a.available_version}</span>`:T(a))),d={view:this._config.views?.devices,params:{cmr_version:this._version}}}return l`<div class="panel">
      <div class="panel-head">
        <span class="section-label">${s}</span>
        <span class="spacer"></span>
        ${d?.view?l`<button class="link" @click=${()=>se(vt(d.view,d.params))}>
              Open in ${e==="issues"?"Events":"Devices"} <ha-icon icon="mdi:arrow-right"></ha-icon></button>`:p}
        <button class="close" title="Close" @click=${()=>this._toggle(e,this._version)}><ha-icon icon="mdi:close"></ha-icon></button>
      </div>
      ${r.length?r:l`<div class="muted small">${o}</div>`}
    </div>`}_deviceRow(t,e,i){return l`<button class="item status-${t.connected?t.update_available?"update":"ok":"offline"}"
      @click=${()=>k(this,i??t.entities.connected)}>
      ${U(t,"thumb")}
      <div class="text">
        <div class="t">${t.identity}</div>
        <div class="muted small">${e}</div>
      </div>
    </button>`}_ruleRow(t){return l`<button class="item sev-${t.severity}" @click=${()=>k(this,t.entity_id)}>
      <ha-icon icon="mdi:bell-alert"></ha-icon>
      <div class="text">
        <div class="t">${t.name}</div>
        <div class="muted small">${t.severity} · ${t.categories.join(", ")||"uncategorised"} · fired ${t.fired}×</div>
      </div>
      <span class="chip alert">${t.devices_on}/${t.devices}</span>
    </button>`}_pendingRow(t,e){let i=this._pairing.get(t.key),s=t.pending&&e.actions&&!!this.hass.user?.is_admin;return l`<div class="item status-pending">
      ${U(t,"thumb")}
      <div class="text">
        <div class="t">${t.identity}</div>
        <div class="muted small">${T(t)} · ${I(t)}${i&&i!=="busy"?` \xB7 ${i}`:""}</div>
      </div>
      ${s?l`<button class="approve" ?disabled=${i==="busy"} @click=${()=>this._approve(t)}>
            ${i==="busy"?"Approving\u2026":"Approve"}</button>`:p}
    </div>`}static{this.styles=[C,x`
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
        width: 64px; height: 64px; background: var(--cmr-pedestal);
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
      }
      .logo.photo img { width: 100%; height: 100%; object-fit: contain; padding: 8%; box-sizing: border-box; mix-blend-mode: multiply; }
      .who { min-width: 0; }
      .eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--cmr-muted); }
      .name { font-size: 22px; font-weight: 600; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .meta { font-size: 13px; color: var(--cmr-muted); display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
      .open { color: var(--cmr-muted); align-self: flex-start; --mdc-icon-size: 18px; }
      .open:hover { color: var(--primary-color); }

      .stats { display: flex; gap: 8px; flex: 1 1 300px; justify-content: flex-end; flex-wrap: wrap; }
      .stat {
        all: unset; cursor: pointer; box-sizing: border-box; flex: 1; min-width: 72px; max-width: 120px;
        padding: 10px 6px; border-radius: 14px; text-align: center; background: var(--cmr-surface-2);
        display: flex; flex-direction: column; align-items: center; gap: 2px; position: relative;
        border: 1px solid transparent;
      }
      .stat:hover { border-color: var(--cmr-line); }
      .stat.on { border-color: var(--status, var(--primary-color)); background: color-mix(in srgb, var(--status, var(--primary-color)) 10%, var(--cmr-surface-2)); }
      .stat:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
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

      .panel { margin: 0 16px 12px; padding: 10px 12px; border-radius: 12px; background: var(--cmr-surface-2); display: flex; flex-direction: column; gap: 4px; }
      .panel-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
      .panel-head .spacer { flex: 1; }
      .panel-head .link { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 2px; font-size: 12px; color: var(--primary-color); --mdc-icon-size: 16px; }
      .panel-head .close { all: unset; cursor: pointer; color: var(--cmr-muted); --mdc-icon-size: 18px; line-height: 0; }
      .item {
        all: unset; cursor: pointer; box-sizing: border-box; display: flex; align-items: center; gap: 10px;
        padding: 6px 8px; border-radius: 10px; width: 100%; --mdc-icon-size: 20px;
      }
      div.item { cursor: default; }
      button.item:hover { background: var(--cmr-surface); }
      .item .badge { width: 34px; height: 34px; border-radius: 9px; flex: none; display: grid; place-items: center;
        background: color-mix(in srgb, var(--status, var(--cmr-muted)) 14%, var(--cmr-surface)); color: var(--status, var(--cmr-muted)); --mdc-icon-size: 18px; }
      .item > ha-icon { color: var(--sev, var(--status, var(--cmr-muted))); flex: none; }
      .item .text { flex: 1; min-width: 0; }
      .item .t { font-size: 13.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .item .small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .item .up { color: var(--cmr-update); font-weight: 600; }
      .sev-critical, .sev-error { --sev: var(--cmr-alert); }
      .sev-high, .sev-warning { --sev: var(--cmr-pending); }
      .sev-medium, .sev-notice { --sev: var(--cmr-update); }
      .sev-low, .sev-info { --sev: var(--cmr-muted); }
      .approve {
        all: unset; cursor: pointer; font-size: 12px; padding: 4px 12px; border-radius: 999px; flex: none;
        background: var(--primary-color); color: var(--text-primary-color, #fff);
      }
      .approve[disabled] { opacity: 0.6; cursor: default; }

      .bars { padding: 0 16px 14px; margin-top: auto; }
      .bar-title { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
      .bar { display: flex; gap: 3px; height: 8px; border-radius: 4px; overflow: hidden; }
      .seg { all: unset; cursor: pointer; min-width: 6px; height: 8px; display: block; }
      .seg.on { outline: 2px solid var(--primary-text-color); outline-offset: -1px; }
      .keys { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-top: 8px; font-size: 12px; align-items: center; }
      .key { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 2px; padding: 1px 6px; margin: -1px -6px; border-radius: 6px; }
      .key:hover, .key.on { background: var(--cmr-surface-2); }
      .key i { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 4px; }
      @container (max-width: 520px) {
        .stats { justify-content: stretch; }
        .stat { max-width: none; }
      }
    `]}};var wt=(n,t,e={})=>({type:"heading",heading:n,icon:t,heading_style:"title",...e});function Jt(n,t,e){return Promise.race([n,new Promise(i=>setTimeout(()=>i(e),t))])}function Zt(n,t,e){let i=o=>!!o&&!!t.states[o]&&t.states[o].state!=="unavailable",s=n.entities,r=[wt(n.identity,K(n),{heading_style:"subtitle",...n.device_id?{tap_action:{action:"navigate",navigation_path:`/config/devices/device/${n.device_id}`}}:{},badges:i(s.version)?[{type:"entity",entity:s.version,show_icon:!0}]:[]})];return i(s.connected)&&r.push({type:"tile",entity:s.connected,name:"Connection",state_content:["state","last_changed"]}),i(s.uptime)&&r.push({type:"tile",entity:s.uptime,name:"Up since"}),i(s.update)&&r.push({type:"tile",entity:s.update,name:"Firmware",show_entity_picture:!0,grid_options:{columns:12}}),i(s.active_alerts)&&r.push({type:"tile",entity:s.active_alerts,name:"Alerts"}),e&&i(s.alert)&&r.push({type:"tile",entity:s.alert,name:"Last alert"}),{type:"grid",cards:r}}function Qt(n,t){let e=n.fleet_entities;return{title:"Network",path:"network",icon:"mdi:router-network",type:"sections",max_columns:3,badges:[[e.devices_online,"Online"],[e.updates_available,"Updates"],[e.alerts_firing,"Alerts firing"],[e.network_issues,"Issues"]].filter(([i])=>i).map(([i,s])=>({type:"entity",entity:i,name:s,show_name:!0})),sections:[{type:"grid",column_span:3,cards:[{...t,type:"custom:cmr-status-card",views:{devices:"devices",events:"events"}}]},{type:"grid",column_span:3,cards:[{...t,type:"custom:cmr-topology-card",height:480,grid_options:{columns:"full"}}]},{type:"grid",column_span:2,cards:[{...t,type:"custom:cmr-fleet-card",grid_options:{columns:"full"}}]},{type:"grid",cards:[{...t,type:"custom:cmr-alerts-card",grid_options:{columns:"full"}}]},{type:"grid",column_span:2,cards:[{...t,type:"custom:cmr-events-card",max_items:15,notable:!0,grid_options:{columns:"full"}}]},{type:"grid",cards:[{...t,type:"custom:cmr-upgrades-card",grid_options:{columns:"full"}}]}]}}function ei(n,t,e){let i=n.alerts.some(o=>o.webhook),s=[...n.devices].sort(O),r=s.map(o=>o.entities.connected).filter(Boolean);return{title:"Devices",path:"devices",icon:"mdi:devices",type:"sections",max_columns:4,sections:[{type:"grid",column_span:4,cards:[{...e,type:"custom:cmr-fleet-card",grid_options:{columns:"full"}}]},{type:"grid",column_span:4,cards:[wt("Connectivity, last 24 hours","mdi:chart-timeline-variant"),{type:"history-graph",hours_to_show:24,entities:r,grid_options:{columns:"full"}}]},...s.map(o=>Zt(o,t,i))]}}function ti(n){return{title:"Events",path:"events",icon:"mdi:timeline-text-outline",type:"sections",max_columns:2,sections:[{type:"grid",column_span:2,cards:[{...n,type:"custom:cmr-events-card",max_items:100,grid_options:{columns:"full"}}]}]}}function ii(n){return{title:"Topology",path:"topology",icon:"mdi:sitemap-outline",type:"panel",cards:[{...n,type:"custom:cmr-topology-card",height:760}]}}function $t(n,t){return{title:n.title??"Network",views:[{title:"Network",path:"network",cards:[{type:"markdown",content:`## CMR
${t}`}]}]}}var ye=class extends HTMLElement{static getCreateSuggestions(){return{title:"Network",icon:"mdi:router-network"}}static async generate(t,e){try{let i=await Jt(pe.once(e),8e3,[]),s=he(i,t.entry_id);if(!s)return $t(t,"No CMR controller is set up yet. Add the **CMR** integration under [Settings \u2192 Devices & services](/config/integrations/dashboard/add?domain=cmr).");let r=t.entry_id?{entry_id:t.entry_id}:{};return{title:t.title??"Network",views:[Qt(s,r),ti(r),ei(s,e,r),ii(r)]}}catch(i){return console.error("cmr: dashboard strategy failed",i),$t(t,`The dashboard couldn't be built (${String(i)}). Reload the page to try again.`)}}};var P=184,j=62,$e=48,oe="__auto__",si="mdi:map-marker-radius-outline",kt={fiber:"Fiber (SFP)",copper:"Ethernet",wireless:"Wireless",logical:"Logical interface",uplink:"Link between layouts",unknown:"No ports detected"},ri=["copper","fiber","wireless","unknown"];function We(n){return/^q?sfp/i.test(n)?"fiber":/^(ether|combo)/i.test(n)?"copper":/^(wifi|wlan|wl\d)/i.test(n)?"wireless":"logical"}function ni(n,t,e=3){return n.x0<t.x1+e&&t.x0<n.x1+e&&n.y0<t.y1+e&&t.y0<n.y1+e}function oi(n,t,e,i,s){let r=Math.hypot(e,i)||1,o=e/r,d=i/r,c=Math.min(o?P/2/Math.abs(o):1/0,d?j/2/Math.abs(d):1/0);return{x:n+o*(c+s),y:t+d*(c+s),ux:o,uy:d}}var we=class extends w{constructor(){super();this._userMoved=!1;this._fittedFor="";this._onKey=e=>{e.key==="Escape"&&this._clearHover()};this._clearHover=()=>{this._hover=void 0,this._hoverLink=void 0};this._path=[],this._view={x:0,y:0,k:1}}static{this.properties={_path:{state:!0},_hover:{state:!0},_hoverLink:{state:!0},_view:{state:!0}}}setConfig(e){this._config={height:440,show_ports:!0,show_comments:!0,...e},this._path=e.layout?[e.layout]:[],this._userMoved=!1}static getConfigForm(){return{schema:[A,{name:"title",selector:{text:{}}},{name:"layout",selector:{text:{}}},{name:"height",selector:{number:{min:200,max:1400,step:20,mode:"box",unit_of_measurement:"px"}}},{name:"show_ports",selector:{boolean:{}}},{name:"show_comments",selector:{boolean:{}}}],computeLabel:M({entry_id:"Controller",title:"Title",layout:"Start at layout (empty: the top layout)",height:"Height",show_ports:"Show port names on cables",show_comments:"Show link comments"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6,min_rows:4}}getCardSize(){return Math.round((this._config?.height??440)/50)+1}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey),this._resize?.disconnect(),this._resize=void 0}_memoFor(e){let i=this._path.join("/");return(this._memo?.entry!==e||this._memo.path!==i)&&(this._memo={entry:e,path:i,byKey:new Map(e.devices.map(s=>[s.key,s])),devicesIn:new Map,cables:new Map}),this._memo}_rootLayouts(e){let i=new Set(e.nodes.map(o=>o.target_layout).filter(Boolean)),s=new Set(e.nodes.map(o=>o.layout)),r=e.layouts.map(o=>o.name).filter(o=>!i.has(o)&&s.has(o));return r.length?r:e.layouts.map(o=>o.name).filter(o=>s.has(o))}_currentLayout(e){return this._path.length?this._path[this._path.length-1]:this._rootLayouts(e)[0]??oe}_devicesIn(e,i,s=new Set){let r=this._memoFor(e),o=r.devicesIn.get(i);if(o)return o;if(s.has(i))return[];s.add(i);let d=new Map;for(let a of e.nodes){if(a.layout!==i)continue;let m=a.device_key?r.byKey.get(a.device_key):void 0;m&&d.set(m.key,m),a.target_layout&&this._devicesIn(e,a.target_layout,s).forEach(u=>d.set(u.key,u))}let c=[...d.values()];return r.devicesIn.set(i,c),c}_scene(e){let i=this._memoFor(e);return i.scene||(i.scene=this._buildScene(e,i.byKey)),i.scene}_buildScene(e,i){let s=this._currentLayout(e),r,o;if(s===oe)({nodes:r,links:o}=this._autoLayout(e));else{let v=e.nodes.filter(_=>_.layout===s),h=v.filter(_=>_.x!=null&&_.y!=null),b=h.length?Math.max(...h.map(_=>_.y)):0,f=h.length?Math.min(...h.map(_=>_.x)):0,$=0;r=v.map(_=>{let V=_.x==null||_.y==null,q=V?f+$*(P+40):_.x,qe=V?b+j*2.4:_.y;if(V&&($+=1),_.target_layout){let Ee=this._devicesIn(e,_.target_layout),At=Ee.filter(Ae=>Ae.connected).length,Se=Ee.map(y),Mt=Se.includes("offline")?"offline":Se.includes("alert")?"alert":Se.includes("update")?"update":"ok",Pt=e.layouts.find(Ae=>Ae.name===_.target_layout)?.comment??null;return{id:_.name,name:_.name,x:q,y:qe,kind:"site",target:_.target_layout,site:{online:At,total:Ee.length,status:Mt,comment:Pt}}}let Ce=_.device_key?i.get(_.device_key):void 0;return{id:_.name,name:Ce?.identity??_.name,x:q,y:qe,kind:Ce?"device":"unknown",device:Ce}}),o=e.links.filter(_=>_.layout===s)}let d=r.map(v=>v.x),c=r.map(v=>v.y),a=Math.min(...d,0)-P/2-$e,m=Math.min(...c,0)-j/2-$e;for(let v of r)v.x-=a,v.y-=m;let u=Math.max(...r.map(v=>v.x),0)+P/2+$e,g=Math.max(...r.map(v=>v.y),0)+j/2+$e;return{layout:s,nodes:r,links:o,width:u,height:g}}_autoLayout(e){let i=a=>a.controller?0:1,s=new Map;for(let a of e.devices){let m=i(a);s.set(m,[...s.get(m)??[],a])}let r=Math.max(...[...s.values()].map(a=>a.length),1),o=[];[...s.keys()].sort().forEach((a,m)=>{let u=s.get(a).sort((v,h)=>v.identity.localeCompare(h.identity)),g=(r-u.length)*(P+48)/2;u.forEach((v,h)=>o.push({id:v.key,name:v.identity,kind:"device",device:v,x:g+h*(P+48),y:m*(j+90)}))});let d=e.devices.find(a=>a.controller),c=d?e.devices.filter(a=>!a.controller).map(a=>({id:a.key,layout:oe,node1:d.key,node2:a.key,comment:null,ports:[]})):[];return{nodes:o,links:c}}updated(){let e=this.renderRoot.querySelector(".viewport");e&&!this._resize&&(this._resize=new ResizeObserver(()=>{this._userMoved||this._fit()}),this._resize.observe(e));let i=`${this._entry?.entry_id}|${this._path.join("/")}|${this._entry?this._scene(this._entry).nodes.length:0}`;this._entry&&i!==this._fittedFor&&(this._fittedFor=i,this._userMoved=!1,this._fit())}_fit(){let e=this.renderRoot.querySelector(".viewport");if(!e||!this._entry)return;let{width:i,height:s}=this._scene(this._entry),r=e.clientWidth,o=e.clientHeight;if(!r||!o)return;let d=Math.min(r/i,o/s,1.2),c={k:d,x:(r-i*d)/2,y:(o-s*d)/2};(Math.abs(c.k-this._view.k)>.001||Math.abs(c.x-this._view.x)>.5||Math.abs(c.y-this._view.y)>.5)&&(this._view=c)}_onWheel(e){if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();let i=e.currentTarget.getBoundingClientRect();this._zoomAt(e.clientX-i.left,e.clientY-i.top,Math.exp(-e.deltaY*.0018))}_zoomAt(e,i,s){let{x:r,y:o,k:d}=this._view,c=Math.min(2.5,Math.max(.25,d*s));this._view={k:c,x:e-(e-r)*c/d,y:i-(i-o)*c/d},this._userMoved=!0,this._clearHover()}_onPointerDown(e){e.pointerType==="touch"||e.button!==0||(this._clearHover(),this._drag={id:e.pointerId,x:e.clientX,y:e.clientY,vx:this._view.x,vy:this._view.y,moved:!1})}_onPointerMove(e){let i=this._drag;if(!i||i.id!==e.pointerId)return;let s=e.clientX-i.x,r=e.clientY-i.y;!i.moved&&Math.hypot(s,r)<4||(i.moved||e.currentTarget.setPointerCapture(e.pointerId),i.moved=!0,this._userMoved=!0,this._hover=void 0,this._view={...this._view,x:i.vx+s,y:i.vy+r})}_onPointerUp(e){this._drag?.moved&&e.type==="pointerup"&&e.currentTarget?.addEventListener("click",i=>i.stopPropagation(),{capture:!0,once:!0}),this._drag=void 0}_zoom(e){let i=this.renderRoot.querySelector(".viewport");i&&this._zoomAt(i.clientWidth/2,i.clientHeight/2,e)}_resetView(){this._userMoved=!1,this._fit()}_open(e){e.kind==="site"&&e.target?(this._path=[...this._path.length?this._path:[this._currentLayout(this._entry)],e.target],this._hover=void 0):e.device&&k(this,e.device.entities.connected??e.device.entities.update)}_goTo(e){this._path=this._path.slice(0,e+1),this._hover=void 0}_selectRoot(e){this._path=[e],this._hover=void 0}_onNodeKey(e,i){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._open(i))}_showHover(e,i){if(this._drag?.moved)return;let s=this.renderRoot.querySelector(".viewport");if(!s)return;let{x:r,y:o,k:d}=this._view,c=300,a=e.device?.product?.image_large?340:230,m=(e.x+P/2)*d+r+12,u=(e.x-P/2)*d+r-12-c,g=m+c<=s.clientWidth-8,v=e.y*d+o-a/2;this._hover={node:e,x:g||u<8?Math.min(m,s.clientWidth-c-8):u,y:Math.max(8,Math.min(v,s.clientHeight-a-8))},i.stopPropagation()}render(){let e=this._entry,i=this._config?.height??440;if(!e)return this.renderWaiting(`height:${i}px`);let s=this._scene(e),r=this._rootLayouts(e),o=this._path.length?this._path:[s.layout],d=new Map(s.nodes.map(h=>[h.id,h])),c=s.links.map(h=>this._linkInfo(h,d)).filter(h=>h!==void 0),a=ri.filter(h=>c.some(b=>b.kind===h)),{x:m,y:u,k:g}=this._view,v=e.layouts.find(h=>h.name===s.layout);return l`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:sitemap-outline"></ha-icon>
          <div class="crumbs">
            ${this._config.title?l`<span class="title">${this._config.title}</span>`:p}
            ${o.map((h,b)=>l`
                ${b?l`<ha-icon class="sep" icon="mdi:chevron-right"></ha-icon>`:p}
                <button class="crumb ${b===o.length-1?"current":""}" @click=${()=>this._goTo(b)}>
                  ${h===oe?"All devices":h}
                </button>
              `)}
          </div>
          <div class="spacer"></div>
          ${r.length>1?l`<div class="roots">
                ${r.map(h=>l`<button class="pill ${o[0]===h?"on":""}" @click=${()=>this._selectRoot(h)}>${h}</button>`)}
              </div>`:p}
        </div>
        ${v?.comment?l`<div class="subtitle">${v.comment}</div>`:p}
        ${this.renderStale(e)}
        <div
          class="viewport"
          style="min-height:${i}px"
          @wheel=${this._onWheel}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
          @dblclick=${this._resetView}
          @mouseleave=${this._clearHover}
        >
          <div
            class="world"
            style="width:${s.width}px;height:${s.height}px;transform:translate(${m}px,${u}px) scale(${g})"
          >
            <svg class="wires" width=${s.width} height=${s.height}>
              ${c.map(h=>this._renderLink(h))}
            </svg>
            ${this._config.show_ports?c.map(h=>this._renderPorts(h)):p}
            ${this._config.show_comments?c.map(h=>this._renderComment(h)):p}
            ${s.nodes.map(h=>this._renderNode(h))}
          </div>
          ${s.nodes.length?p:l`<div class="nothing">${s.layout===oe?"No devices on the controller yet.":"This layout has no nodes yet."}</div>`}
          ${this._hover?this._renderTooltip(this._hover):p}
          ${this._hoverLink&&!this._hover?this._renderLinkTooltip(this._hoverLink):p}
          <div class="controls">
            <button title="Zoom in" @click=${()=>this._zoom(1.25)}><ha-icon icon="mdi:plus"></ha-icon></button>
            <button title="Zoom out" @click=${()=>this._zoom(.8)}><ha-icon icon="mdi:minus"></ha-icon></button>
            <button title="Fit" @click=${this._resetView}><ha-icon icon="mdi:fit-to-screen-outline"></ha-icon></button>
          </div>
          <div class="legend">
            ${["ok","update","alert","offline"].map(h=>l`<span class="status-${h}"><i class="dot"></i>${E[h]}</span>`)}
            ${a.map(h=>l`<span><i class="wire-sample k-${h}"></i>${kt[h]}</span>`)}
            ${c.some(h=>h.poe)?l`<span><i class="poe-sample"></i>PoE power</span>`:p}
          </div>
        </div>
      </ha-card>
    `}_linkState(e,i){let s=d=>d?.kind==="device"?d.device.connected:d?.kind==="site"?d.site.online>0:void 0,r=s(e),o=s(i);return r===!1||o===!1?"down":r===void 0||o===void 0?"unknown":"up"}_linkInfo(e,i){let s=i.get(e.node1),r=i.get(e.node2);if(!s||!r)return;let o=e.ports,d=[s.name,r.name],c=!1,a;!o.length&&s.kind==="site"&&r.kind==="site"&&(c=!0,a=this._cableBetween(s.target,r.target),a&&(o=a.ports,d=a.names));let m=o[0],u;if(m){let v=[We(m.a.interface),We(m.b.interface)];u=v.includes("fiber")?"fiber":v.includes("wireless")?"wireless":v.every(h=>h==="copper")?"copper":"logical"}else u=c&&!a?"uplink":"unknown";let g;return m?.a.poe==="powered-on"?g={from:s,to:r,port:m.a.interface}:m?.b.poe==="powered-on"&&(g={from:r,to:s,port:m.b.interface}),{link:e,a:s,b:r,state:this._linkState(s,r),kind:u,ports:o,endNames:d,poe:g}}_cableBetween(e,i){let s=this._entry,r=this._memoFor(s),o=`${e}\0${i}`;if(r.cables.has(o))return r.cables.get(o);let d=new Set(this._devicesIn(s,e).map(g=>g.key)),c=new Set(this._devicesIn(s,i).map(g=>g.key)),a=new Map(s.nodes.map(g=>[`${g.layout}\0${g.name}`,g.device_key])),m=r.byKey,u;for(let g of s.links){let v=a.get(`${g.layout}\0${g.node1}`),h=a.get(`${g.layout}\0${g.node2}`);if(!v||!h)continue;let b=d.has(v)&&c.has(h);if(!b&&!(d.has(h)&&c.has(v)))continue;let[f,$]=b?[v,h]:[h,v],_=b?g.ports:g.ports.map(q=>({a:q.b,b:q.a})),V={ports:_,names:[m.get(f)?.identity??f,m.get($)?.identity??$]};(!u||_.length&&!u.ports.length)&&(u=V)}return r.cables.set(o,u),u}_renderLink(e){let{a:i,b:s,state:r,kind:o,poe:d}=e,c=`M ${i.x} ${i.y} L ${s.x} ${s.y}`,a=r==="up"&&o!=="unknown"&&o!=="logical";return te`
      <g class="link ${r} k-${o}"
         @mouseenter=${m=>this._showLinkHover(e,m)}
         @mouseleave=${()=>this._hoverLink=void 0}>
        <path class="hit" d=${c}></path>
        <path class="wire" d=${c}></path>
        ${o==="fiber"?te`<path class="core" d=${c}></path>`:p}
        ${a?te`<path class="flow" d=${c}></path>`:p}
        ${d&&r==="up"?te`<circle class="power" r="3.6">
              <animateMotion dur="2.2s" repeatCount="indefinite"
                path=${`M ${d.from.x} ${d.from.y} L ${d.to.x} ${d.to.y}`}></animateMotion>
            </circle>`:p}
      </g>
    `}_renderPorts(e){let i=e.ports[0];if(!i)return p;let{a:s,b:r}=e,o=[this._chip(s,r,i.a,e.poe?.from===s),this._chip(r,s,i.b,e.poe?.from===r)];return ni(o[0].box,o[1].box)&&(o=[this._chip(s,r,i.a,e.poe?.from===s,-1),this._chip(r,s,i.b,e.poe?.from===r,1)]),l`${o.map(d=>d.html)}`}_chip(e,i,s,r,o){let d=oi(e.x,e.y,i.x-e.x,i.y-e.y,o?4:8),c=s.interface.length*6.6+12+(r?13:0),a=18,m=Math.abs(d.ux)>=Math.abs(d.uy),u=Math.abs(d.ux)<.35?-.5:d.ux>0?0:-1,g=Math.abs(d.uy)<.35?-.5:d.uy>0?0:-1,v=0,h=0;o&&(m?(g=o<0?-1:0,h=o*3):(u=o<0?-1:0,v=o*4));let b=d.x+u*c+v,f=d.y+g*a+h;return{box:{x0:b,y0:f,x1:b+c,y1:f+a},html:l`<div class="port m-${We(s.interface)} ${r?"poe":""}"
        style="left:${d.x+v}px;top:${d.y+h}px;transform:translate(${u*100}%,${g*100}%)"
        title=${r?`${s.interface}: PoE out, powers ${i.name}`:`${s.interface} (${e.name})`}>
        ${r?l`<ha-icon icon="mdi:flash"></ha-icon>`:p}${s.interface}
      </div>`}}_renderComment(e){let{a:i,b:s,link:r}=e;return!r.comment||e.ports.length&&this._config.show_ports?p:l`<div class="comment" style="left:${(i.x+s.x)/2}px;top:${(i.y+s.y)/2}px" title=${r.comment}>
      ${r.comment}
    </div>`}_showLinkHover(e,i){if(this._drag?.moved)return;let s=this.renderRoot.querySelector(".viewport");if(!s)return;let r=s.getBoundingClientRect();this._hoverLink={info:e,x:i.clientX-r.left,y:i.clientY-r.top+14}}_renderLinkTooltip(e){let{info:i}=e,{a:s,b:r,link:o,poe:d,ports:c,endNames:a}=i,m=u=>u.tx||u.rx?l`<span class="mono">↑ ${u.tx??"\u2013"} · ↓ ${u.rx??"\u2013"}</span>`:"\u2013";return l`<div class="tooltip" style="left:${Math.max(8,e.x-150)}px;top:${e.y}px">
      <div class="tt-title">${s.name} ↔ ${r.name}</div>
      ${o.comment?l`<div class="muted">${o.comment}</div>`:p}
      <table>
        <tr><td>Medium</td><td>${kt[i.kind]}</td></tr>
        ${c.map(u=>l`
            <tr><td>${a[0]}</td><td class="mono">${u.a.interface}</td></tr>
            <tr><td>${a[1]}</td><td class="mono">${u.b.interface}</td></tr>
          `)}
        ${d?l`<tr><td>Power</td><td><ha-icon class="inline poe" icon="mdi:flash"></ha-icon>
              ${d.from===s?a[0]:a[1]} <span class="mono">${d.port}</span>
              powers ${d.to===s?a[0]:a[1]}</td></tr>`:p}
        ${c[0]?l`<tr><td>Traffic</td><td>${a[0]}: ${m(c[0].a)}<br />${a[1]}: ${m(c[0].b)}</td></tr>`:p}
      </table>
    </div>`}_renderNode(e){let i=`left:${e.x-P/2}px;top:${e.y-j/2}px;width:${P}px;height:${j}px`;if(e.kind==="site"){let o=e.site;return l`
        <div class="node site status-${o.status}" style=${i} role="button" tabindex="0"
             aria-label="${e.name}, ${o.online} of ${o.total} online, open layout"
             @click=${()=>this._open(e)} @keydown=${d=>this._onNodeKey(d,e)}
             @mouseenter=${d=>this._showHover(e,d)} @mouseleave=${this._clearHover}
             @focus=${d=>this._showHover(e,d)} @blur=${this._clearHover}>
          <div class="badge"><ha-icon icon=${this._config.icons?.[e.name]??si}></ha-icon></div>
          <div class="text">
            <div class="name">${e.name}</div>
            <div class="sub"><i class="dot"></i>${o.online}/${o.total} online</div>
          </div>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        </div>
      `}if(e.kind==="unknown"||!e.device)return l`
        <div class="node unknown" style=${i} title="Not a CMR-managed device">
          <div class="badge"><ha-icon icon="mdi:help-network-outline"></ha-icon></div>
          <div class="text"><div class="name">${e.name}</div><div class="sub">Not managed</div></div>
        </div>
      `;let s=e.device,r=y(s);return l`
      <div class="node device status-${r} ${s.controller?"controller":""}" style=${i}
           role="button" tabindex="0" aria-label="${s.identity}, ${E[r]}"
           @click=${()=>this._open(e)} @keydown=${o=>this._onNodeKey(o,e)}
           @mouseenter=${o=>this._showHover(e,o)} @mouseleave=${this._clearHover}
           @focus=${o=>this._showHover(e,o)} @blur=${this._clearHover}>
        ${U(s)}
        <div class="text">
          <div class="name">${s.identity}</div>
          <div class="sub">${T(s)}</div>
          <div class="ver mono">
            ${s.version??"\u2013"}${s.update_available?l`<span class="up"> → ${s.available_version}</span>`:p}
          </div>
        </div>
        ${s.controller?l`<span class="crown" title="CMR controller"><ha-icon icon="mdi:crown-outline"></ha-icon></span>`:p}
        ${s.alerts?.on?l`<span class="count" title="Alerts firing">${s.alerts.on}</span>`:p}
      </div>
    `}_renderTooltip(e){let{node:i}=e,s;if(i.kind==="site"){let r=i.site;s=l`
        <div class="tt-title">${i.name}</div>
        ${r.comment?l`<div class="muted">${r.comment}</div>`:p}
        <div>${r.online} of ${r.total} devices online</div>
        <div class="muted">Click to open this layout</div>
      `}else if(i.device){let r=i.device;s=l`
        <div class="tt-title">${r.identity}${r.controller?l` <span class="chip">controller</span>`:p}</div>
        ${r.product?.image_large?l`<div class="tt-photo"><img src=${r.product.image_large} alt="" referrerpolicy="no-referrer" /></div>`:p}
        <div class="muted">${[T(r),ne(r),r.arch].filter(Boolean).join(" \xB7 ")}</div>
        <table>
          <tr><td>Status</td><td class="status-${y(r)}"><i class="dot"></i> ${E[y(r)]}${I(r)?` (${I(r)})`:""}${r.stale?" \xB7 stale data":""}</td></tr>
          ${r.connected&&r.connected_time!=null?l`<tr><td>Connected</td><td>for ${ie(r.connected_time)}</td></tr>`:p}
          <tr><td>Version</td><td class="mono">${r.version??"\u2013"}${r.prerelease?" (pre-release)":""}</td></tr>
          <tr><td>Channel</td><td>${r.channel??"\u2013"}${r.available_version&&r.available_version!==r.version?l` <span class="muted">(${r.update_available?"update to":"offers"} <span class="mono">${r.available_version}</span>)</span>`:p}</td></tr>
          ${r.address?l`<tr><td>Address</td><td class="mono">${r.address}</td></tr>`:p}
          <tr><td>Uptime</td><td>${ie(r.uptime)}</td></tr>
          ${r.labels.length?l`<tr><td>Labels</td><td>${r.labels.map(o=>l`<span class="chip">${o}</span> `)}</td></tr>`:p}
          ${r.alerts?l`<tr><td>Alerts</td><td>${r.alerts.on} firing of ${r.alerts.total} rules</td></tr>`:p}
        </table>
      `}else return l``;return l`<div class="tooltip" style="left:${Math.max(8,e.x)}px;top:${e.y}px">${s}</div>`}static{this.styles=[C,x`
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
      .subtitle { padding: 0 16px 6px; font-size: 12px; color: var(--cmr-muted); }
      .nothing { position: absolute; inset: 0; display: grid; place-items: center; color: var(--cmr-muted); pointer-events: none; }

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
      .node:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
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
        background: var(--cmr-pedestal);
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
      @media (max-width: 600px) { .legend { font-size: 10px; gap: 2px 8px; max-width: calc(100% - 64px); } }
    `]}};var ai={done:"mdi:check-circle",failed:"mdi:close-circle",processing:"mdi:progress-upload","version check":"mdi:magnify","waiting devices":"mdi:timer-sand",queued:"mdi:tray-full","queued (busy)":"mdi:tray-full",scheduled:"mdi:calendar-clock",cancelled:"mdi:cancel"},Ct=new Set(["processing","version check","waiting devices","queued","queued (busy)"]);function Ve(n){return(n??"").split(",").map(t=>t.trim()).filter(Boolean)}function li(n){let[t,e]=(n.success??"").split("/").map(Number);return n.state==="done"&&e&&t<e?"failed":n.state??"scheduled"}function ci(n){return(n??"").replace(/([a-z])(\d)/g,"$1 $2")}var ke=class extends w{setConfig(t){this._config={jobs:5,...t}}static getConfigForm(){return{schema:[A,{name:"title",selector:{text:{}}},{name:"jobs",selector:{number:{min:0,max:30,mode:"box"}}}],computeLabel:M({entry_id:"Controller",title:"Title",jobs:"Recent jobs to show"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){return 6}render(){let t=this._entry;if(!t)return this.renderWaiting();let e=t.devices.filter(r=>r.update_available).length,i=t.upgrade_rules.filter(r=>r.dynamic!=="true"||t.devices.some(o=>o.upgrade_rule===r.name)),s=[...t.upgrade_jobs].sort((r,o)=>(o.schedule_time??"").localeCompare(r.schedule_time??"")).slice(0,this._config.jobs??5);return l`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:update"></ha-icon>
          <span>${this._config.title??"Upgrades"}</span>
          ${e?l`<span class="chip update">${e} available</span>`:l`<span class="chip">up to date</span>`}
        </div>
        ${this.renderStale(t)}

        ${i.length?i.map(r=>this._rule(t,r)):l`<div class="empty small">No upgrade rules. Devices are checked against their channel only.</div>`}

        ${s.length?l`<div class="section section-label">Recent jobs</div>
              <div class="jobs">
                ${s.map(r=>{let o=li(r),d=o==="failed"?"failed":Ct.has(o)?"running":o==="scheduled"?"scheduled":o==="done"?"done":"other",c=o==="scheduled"&&r.starts_in?`starts in ${ci(r.starts_in)}`:`${r.schedule_time??""}${r.run_time?` \xB7 took ${r.run_time}`:""}`;return l`<div class="job js-${d}">
                    <ha-icon icon=${ai[o]??"mdi:circle-outline"} title=${o}></ha-icon>
                    <div class="what">
                      <div><span class="mono">${r.channel??"?"}</span> → ${Ve(r.labels).join(", ")||"all"}
                        ${Ct.has(o)?l`<span class="chip update">${o}</span>`:p}</div>
                      <div class="muted small">${c}</div>
                    </div>
                    <div class="ok mono">${r.success||(o==="scheduled"?"":"\u2013")}</div>
                  </div>`})}
              </div>`:p}
      </ha-card>
    `}_rule(t,e){let i=t.devices.filter(c=>c.upgrade_rule===e.name),s=Ve(e.order),r=s.length?s.map(c=>({label:c,devices:i.filter(a=>a.labels.includes(c))})):[{label:Ve(e.labels).join(", ")||"all",devices:i}],o=new Set(r.flatMap(c=>c.devices.map(a=>a.key))),d=i.filter(c=>!o.has(c.key));return d.length&&r.push({label:"other",devices:d}),l`
      <div class="rule">
        <div class="rule-head">
          <b>${e.name}</b>
          <span class="muted small">
            ${[e.channel&&`channel ${e.channel}`,e.strategy,e.fail_policy&&`on failure: ${e.fail_policy}`].filter(Boolean).join(" \xB7 ")}
          </span>
        </div>
        ${e.comment?l`<div class="muted small comment">${e.comment}</div>`:p}
        <div class="pipeline">
          ${r.map((c,a)=>l`
              ${a?l`<ha-icon class="arrow" icon="mdi:chevron-right"></ha-icon>`:p}
              <div class="step">
                <div class="step-label"><span class="n">${a+1}</span>${c.label}</div>
                <div class="devs">
                  ${c.devices.map(m=>l`<button class="dev status-${y(m)}" title="${m.identity} · ${m.version}"
                      @click=${()=>k(this,m.entities.update)}><ha-icon icon=${K(m)}></ha-icon></button>`)}
                  ${c.devices.length?p:l`<span class="muted small">none</span>`}
                </div>
              </div>
            `)}
        </div>
      </div>
    `}static{this.styles=[C,x`
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
      .section { padding: 4px 16px 4px; }
      .jobs { padding: 0 8px 10px; }
      .job { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 10px; font-size: 13px; }
      .job ha-icon { --mdc-icon-size: 20px; }
      .js-done ha-icon { color: var(--cmr-ok); }
      .js-failed ha-icon { color: var(--cmr-alert); }
      .js-running ha-icon { color: var(--cmr-update); }
      .js-scheduled ha-icon { color: var(--cmr-pending); }
      .js-other ha-icon { color: var(--cmr-muted); }
      .what { flex: 1; min-width: 0; }
      .ok { font-size: 12px; color: var(--cmr-muted); }
    `]}};var Et="https://github.com/trakais/ha-cmr",St=[["cmr-status-card",xe,"CMR status","Controller, devices online, updates and alerts at a glance."],["cmr-topology-card",we,"CMR topology","Live network map drawn from the controller's CMR layouts."],["cmr-fleet-card",_e,"CMR devices","Every managed device with model, version, uptime and labels."],["cmr-alerts-card",ve,"CMR alerts","Alert rules, what is firing, and pushing alerts to Home Assistant."],["cmr-upgrades-card",ke,"CMR upgrades","Upgrade rules as a rollout pipeline, plus recent jobs."],["cmr-events-card",fe,"CMR events","Network timeline from the controller's log and changes, with detected issues."]];for(let[n,t]of St)customElements.get(n)||customElements.define(n,t);window.customCards=window.customCards||[];for(let[n,,t,e]of St)window.customCards.some(i=>i.type===n)||window.customCards.push({type:n,name:t,description:e,preview:!1,documentationURL:Et});customElements.get("ll-strategy-dashboard-cmr")||customElements.define("ll-strategy-dashboard-cmr",ye);window.customStrategies=window.customStrategies||[];window.customStrategies.some(n=>n.type==="cmr")||window.customStrategies.push({type:"cmr",strategyType:"dashboard",name:"CMR network",description:"A complete network dashboard generated from your CMR controller: status, topology, devices, alerts and upgrades.",documentationURL:Et});console.info("%c CMR %c cards loaded ","background:#3a6ea5;color:#fff;border-radius:3px 0 0 3px","background:#ddd;color:#333;border-radius:0 3px 3px 0");
