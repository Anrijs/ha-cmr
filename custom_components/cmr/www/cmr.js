var me=globalThis,ve=me.ShadowRoot&&(me.ShadyCSS===void 0||me.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ie=Symbol(),at=new WeakMap,te=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==Ie)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(ve&&i===void 0){let t=e!==void 0&&e.length===1;t&&(i=at.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&at.set(e,i))}return i}toString(){return this.cssText}},lt=n=>new te(typeof n=="string"?n:n+"",void 0,Ie),w=(n,...i)=>{let e=n.length===1?n[0]:i.reduce((t,s,r)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new te(e,n,Ie)},ct=(n,i)=>{if(ve)n.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let t=document.createElement("style"),s=me.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,n.appendChild(t)}},Oe=ve?n=>n:n=>n instanceof CSSStyleSheet?(i=>{let e="";for(let t of i.cssRules)e+=t.cssText;return lt(e)})(n):n;var{is:Bt,defineProperty:Vt,getOwnPropertyDescriptor:Wt,getOwnPropertyNames:qt,getOwnPropertySymbols:Yt,getPrototypeOf:Gt}=Object,ge=globalThis,dt=ge.trustedTypes,Xt=dt?dt.emptyScript:"",Jt=ge.reactiveElementPolyfillSupport,ie=(n,i)=>n,Ue={toAttribute(n,i){switch(i){case Boolean:n=n?Xt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,i){let e=n;switch(i){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},ht=(n,i)=>!Bt(n,i),pt={attribute:!0,type:String,converter:Ue,reflect:!1,useDefault:!1,hasChanged:ht};Symbol.metadata??=Symbol("metadata"),ge.litPropertyMetadata??=new WeakMap;var N=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=pt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(i,t,e);s!==void 0&&Vt(this.prototype,i,s)}}static getPropertyDescriptor(i,e,t){let{get:s,set:r}=Wt(this.prototype,i)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let l=s?.call(this);r?.call(this,o),this.requestUpdate(i,l,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??pt}static _$Ei(){if(this.hasOwnProperty(ie("elementProperties")))return;let i=Gt(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(ie("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ie("properties"))){let e=this.properties,t=[...qt(e),...Yt(e)];for(let s of t)this.createProperty(s,e[s])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let t=new Set(i.flat(1/0).reverse());for(let s of t)e.unshift(Oe(s))}else i!==void 0&&e.push(Oe(i));return e}static _$Eu(i,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ct(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){let t=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,t);if(s!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:Ue).toAttribute(e,t.type);this._$Em=i,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(i,e){let t=this.constructor,s=t._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let r=t.getPropertyOptions(s),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Ue;this._$Em=s;let l=o.fromAttribute(e,r.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(i,e,t,s=!1,r){if(i!==void 0){let o=this.constructor;if(s===!1&&(r=this[i]),t??=o.getPropertyOptions(i),!((t.hasChanged??ht)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(i)&&!this.hasAttribute(o._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:s,wrapped:r},o){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,o??e??this[i]),r!==!0||o!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,r]of t){let{wrapped:o}=r,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,r,l)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};N.elementStyles=[],N.shadowRootOptions={mode:"open"},N[ie("elementProperties")]=new Map,N[ie("finalized")]=new Map,Jt?.({ReactiveElement:N}),(ge.reactiveElementVersions??=[]).push("2.1.2");var qe=globalThis,ut=n=>n,fe=qe.trustedTypes,mt=fe?fe.createPolicy("lit-html",{createHTML:n=>n}):void 0,yt="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,xt="?"+U,Zt=`<${xt}>`,B=document,re=()=>B.createComment(""),ne=n=>n===null||typeof n!="object"&&typeof n!="function",Ye=Array.isArray,Qt=n=>Ye(n)||typeof n?.[Symbol.iterator]=="function",je=`[ 	
\f\r]`,se=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,vt=/-->/g,gt=/>/g,F=RegExp(`>|${je}(?:([^\\s"'>=/]+)(${je}*=${je}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ft=/'/g,_t=/"/g,$t=/^(?:script|style|textarea|title)$/i,Ge=n=>(i,...e)=>({_$litType$:n,strings:i,values:e}),a=Ge(1),le=Ge(2),Hi=Ge(3),V=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),bt=new WeakMap,K=B.createTreeWalker(B,129);function wt(n,i){if(!Ye(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return mt!==void 0?mt.createHTML(i):i}var ei=(n,i)=>{let e=n.length-1,t=[],s,r=i===2?"<svg>":i===3?"<math>":"",o=se;for(let l=0;l<e;l++){let c=n[l],d,p,u=-1,m=0;for(;m<c.length&&(o.lastIndex=m,p=o.exec(c),p!==null);)m=o.lastIndex,o===se?p[1]==="!--"?o=vt:p[1]!==void 0?o=gt:p[2]!==void 0?($t.test(p[2])&&(s=RegExp("</"+p[2],"g")),o=F):p[3]!==void 0&&(o=F):o===F?p[0]===">"?(o=s??se,u=-1):p[1]===void 0?u=-2:(u=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?F:p[3]==='"'?_t:ft):o===_t||o===ft?o=F:o===vt||o===gt?o=se:(o=F,s=void 0);let v=o===F&&n[l+1].startsWith("/>")?" ":"";r+=o===se?c+Zt:u>=0?(t.push(d),c.slice(0,u)+yt+c.slice(u)+U+v):c+U+(u===-2?l:v)}return[wt(n,r+(n[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),t]},oe=class n{constructor({strings:i,_$litType$:e},t){let s;this.parts=[];let r=0,o=0,l=i.length-1,c=this.parts,[d,p]=ei(i,e);if(this.el=n.createElement(d,t),K.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=K.nextNode())!==null&&c.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(yt)){let m=p[o++],v=s.getAttribute(u).split(U),y=/([.?@])?(.*)/.exec(m);c.push({type:1,index:r,name:y[2],strings:v,ctor:y[1]==="."?Ke:y[1]==="?"?Be:y[1]==="@"?Ve:Z}),s.removeAttribute(u)}else u.startsWith(U)&&(c.push({type:6,index:r}),s.removeAttribute(u));if($t.test(s.tagName)){let u=s.textContent.split(U),m=u.length-1;if(m>0){s.textContent=fe?fe.emptyScript:"";for(let v=0;v<m;v++)s.append(u[v],re()),K.nextNode(),c.push({type:2,index:++r});s.append(u[m],re())}}}else if(s.nodeType===8)if(s.data===xt)c.push({type:2,index:r});else{let u=-1;for(;(u=s.data.indexOf(U,u+1))!==-1;)c.push({type:7,index:r}),u+=U.length-1}r++}}static createElement(i,e){let t=B.createElement("template");return t.innerHTML=i,t}};function J(n,i,e=n,t){if(i===V)return i;let s=t!==void 0?e._$Co?.[t]:e._$Cl,r=ne(i)?void 0:i._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(i=J(n,s._$AS(n,i.values),s,t)),i}var Fe=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:t}=this._$AD,s=(i?.creationScope??B).importNode(e,!0);K.currentNode=s;let r=K.nextNode(),o=0,l=0,c=t[0];for(;c!==void 0;){if(o===c.index){let d;c.type===2?d=new ae(r,r.nextSibling,this,i):c.type===1?d=new c.ctor(r,c.name,c.strings,this,i):c.type===6&&(d=new We(r,this,i)),this._$AV.push(d),c=t[++l]}o!==c?.index&&(r=K.nextNode(),o++)}return K.currentNode=B,s}p(i){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}},ae=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,t,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=J(this,i,e),ne(i)?i===h||i==null||i===""?(this._$AH!==h&&this._$AR(),this._$AH=h):i!==this._$AH&&i!==V&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):Qt(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==h&&ne(this._$AH)?this._$AA.nextSibling.data=i:this.T(B.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:t}=i,s=typeof t=="number"?this._$AC(i):(t.el===void 0&&(t.el=oe.createElement(wt(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let r=new Fe(s,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(i){let e=bt.get(i.strings);return e===void 0&&bt.set(i.strings,e=new oe(i)),e}k(i){Ye(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let r of i)s===e.length?e.push(t=new n(this.O(re()),this.O(re()),this,this.options)):t=e[s],t._$AI(r),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let t=ut(i).nextSibling;ut(i).remove(),i=t}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},Z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,t,s,r){this.type=1,this._$AH=h,this._$AN=void 0,this.element=i,this.name=e,this._$AM=s,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=h}_$AI(i,e=this,t,s){let r=this.strings,o=!1;if(r===void 0)i=J(this,i,e,0),o=!ne(i)||i!==this._$AH&&i!==V,o&&(this._$AH=i);else{let l=i,c,d;for(i=r[0],c=0;c<r.length-1;c++)d=J(this,l[t+c],e,c),d===V&&(d=this._$AH[c]),o||=!ne(d)||d!==this._$AH[c],d===h?i=h:i!==h&&(i+=(d??"")+r[c+1]),this._$AH[c]=d}o&&!s&&this.j(i)}j(i){i===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},Ke=class extends Z{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===h?void 0:i}},Be=class extends Z{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==h)}},Ve=class extends Z{constructor(i,e,t,s,r){super(i,e,t,s,r),this.type=5}_$AI(i,e=this){if((i=J(this,i,e,0)??h)===V)return;let t=this._$AH,s=i===h&&t!==h||i.capture!==t.capture||i.once!==t.once||i.passive!==t.passive,r=i!==h&&(t===h||s);s&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},We=class{constructor(i,e,t){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(i){J(this,i)}};var ti=qe.litHtmlPolyfillSupport;ti?.(oe,ae),(qe.litHtmlVersions??=[]).push("3.3.3");var kt=(n,i,e)=>{let t=e?.renderBefore??i,s=t._$litPart$;if(s===void 0){let r=e?.renderBefore??null;t._$litPart$=s=new ae(i.insertBefore(re(),r),r,void 0,e??{})}return s._$AI(n),s};var Xe=globalThis,E=class extends N{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=kt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};E._$litElement$=!0,E.finalized=!0,Xe.litElementHydrateSupport?.({LitElement:E});var ii=Xe.litElementPolyfillSupport;ii?.({LitElement:E});(Xe.litElementVersions??=[]).push("4.2.2");function Et(n){return n?.message??String(n)}var Je=class{constructor(){this.listeners=new Set}subscribe(i,e){return this.listeners.add(e),this.latest&&e(this.latest),this.unsubscribe||(this.unsubscribe=i.connection.subscribeMessage(t=>{this.latest=t.entries,this.listeners.forEach(s=>s(t.entries))},{type:"cmr/subscribe"}),this.unsubscribe.catch(t=>{console.error("cmr: subscription failed",t),this.unsubscribe=void 0,this.listeners.forEach(s=>s([],Et(t)))})),()=>{if(this.listeners.delete(e),this.listeners.size===0&&this.unsubscribe){let t=this.unsubscribe;this.unsubscribe=void 0,this.latest=void 0,t.then(s=>s()).catch(()=>{})}}}once(i){return this.latest?Promise.resolve(this.latest):new Promise((e,t)=>{let s,r=!1;s=this.subscribe(i,(o,l)=>{r||(r=!0,queueMicrotask(()=>s?.()),l?t(new Error(l)):e(o))})})}},_e=new Je;function be(n,i){if(n?.length)return i?n.find(e=>e.entry_id===i):n[0]}var Ct=new Map,si=3e4;async function ri(n,i,e){let t=`${i}/${e}`,s=Ct.get(t);if(s&&Date.now()-s.at<si)return s.keys;let r=await n.connection.sendMessagePromise({type:"cmr/alert_devices",entry_id:i,rule_id:e});return Ct.set(t,{at:Date.now(),keys:r.devices}),r.devices}var R=class{constructor(i){this.onChange=i;this.state=new Map;this.stale=new Set}get(i,e,t){let s=`${e}/${t}`,r=this.state.get(s);return r!==void 0&&!this.stale.has(s)?r:(this.stale.delete(s),r===void 0&&this.state.set(s,"loading"),ri(i,e,t).then(o=>this.state.set(s,o)).catch(o=>this.state.set(s,o?.code==="unsupported"?"unsupported":"error")).finally(()=>this.onChange()),this.state.get(s))}invalidate(){for(let i of this.state.keys())this.stale.add(i)}};function ye(n,i,e){return n.connection.sendMessagePromise({type:"cmr/issue_dismiss",entry_id:i,key:e})}var Ze=class{constructor(i){this.entryId=i;this.listeners=new Set;this.events=[];this.issues=[];this.loaded=!1}subscribe(i,e){return this.listeners.add(e),this.loaded&&e(this.events,this.issues),this.unsubscribe||(this.unsubscribe=i.connection.subscribeMessage(t=>{this.events=t.reset?t.events:[...this.events,...t.events].slice(-1e3),this.issues=t.issues,this.loaded=!0,this.listeners.forEach(s=>s(this.events,this.issues))},{type:"cmr/events/subscribe",limit:1e3,...this.entryId?{entry_id:this.entryId}:{}}),this.unsubscribe.catch(t=>{console.error("cmr: events subscription failed",t),this.unsubscribe=void 0,this.listeners.forEach(s=>s([],[],Et(t)))})),()=>{if(this.listeners.delete(e),this.listeners.size===0&&this.unsubscribe){let t=this.unsubscribe;this.unsubscribe=void 0,this.loaded=!1,this.events=[],t.then(s=>s()).catch(()=>{})}}}},Qe=class{constructor(){this.feeds=new Map}subscribe(i,e,t){let s=e??"",r=this.feeds.get(s);return r||(r=new Ze(e),this.feeds.set(s,r)),r.subscribe(i,t)}},xe=new Qe;function Q(n){return n.controller?"mdi:router-network":"mdi:router"}function $(n){return n.pending||n.remote_pending?"pending":n.connected?n.alerts?.on?"alert":n.update_available?"update":"ok":"offline"}function q(n){return n.pending?"approve on the controller":n.remote_pending?"approve on the device":""}var ee=["offline","pending","alert","update","ok"];async function $e(n,i,e){await n.connection.sendMessagePromise({type:"cmr/pair",entry_id:i,device_key:e})}function St(n,i){return i?[n.identity,n.board,n.model_code,n.address,n.version,...n.labels].filter(Boolean).join(" ").toLowerCase().includes(i):!0}function we(){let n=new URLSearchParams(window.location.search),i=n.get("cmr_status");return{status:i&&ee.includes(i)?i:void 0,version:n.get("cmr_version")??void 0,search:n.get("cmr_search")??void 0,alert:n.get("cmr_alert")??void 0}}function W(n,i={}){let e=window.location.pathname.split("/")[1]||"lovelace",t=Object.entries(i).filter(s=>!!s[1]).map(([s,r])=>`${s}=${encodeURIComponent(r)}`).join("&");return`/${e}/${n}${t?`?${t}`:""}`}var A={ok:"OK",update:"Update available",alert:"Alert firing",pending:"Waiting to pair",offline:"Disconnected"};function ce(n){if(n==null)return"\u2013";let i=Math.floor(n/86400),e=Math.floor(n%86400/3600),t=Math.floor(n%3600/60);return i?`${i}d ${e}h`:e?`${e}h ${t}m`:t?`${t}m`:`${Math.floor(n)}s`}function j(n,i){return n.controller!==i.controller?n.controller?-1:1:n.identity.localeCompare(i.identity)}async function At(n){try{if(navigator.clipboard)return await navigator.clipboard.writeText(n),!0}catch{}let i=document.createElement("textarea");i.value=n,i.setAttribute("readonly",""),i.style.position="fixed",i.style.opacity="0",document.body.appendChild(i),i.select();let e=!1;try{e=document.execCommand("copy")}catch{e=!1}return i.remove(),e}function et(n,i,e){n.dispatchEvent(new CustomEvent(i,{detail:e,bubbles:!0,composed:!0}))}function P(n,i){i&&et(n,"hass-more-info",{entityId:i})}function D(n){history.pushState(null,"",n),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}function de(n,i="never"){if(!n)return i;let e=Math.max(0,(Date.now()-new Date(n).getTime())/1e3);return e<10?"just now":e<60?`${Math.round(e)} s ago`:e<3600?`${Math.round(e/60)} min ago`:e<86400?`${Math.round(e/3600)} h ago`:`${Math.round(e/86400)} d ago`}function Pt(n){return n.includes(":")&&!n.startsWith("[")?`http://[${n}]`:`http://${n}`}var z={name:"entry_id",selector:{config_entry:{integration:"cmr"}}};function L(n){return i=>n[i.name]}var S=class extends E{static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0},_error:{state:!0}}}setConfig(i){this._config=i}static getStubConfig(){return{}}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribeStore&&this._subscribeStore()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeStore?.(),this._unsubscribeStore=void 0,window.clearInterval(this._staleTicker),this._staleTicker=void 0}willUpdate(i){i.has("hass")&&this.hass&&!this._unsubscribeStore&&this.isConnected&&this._subscribeStore()}_subscribeStore(){this._unsubscribeStore=_e.subscribe(this.hass,(i,e)=>{this._error=e,this._entry=be(i,this._config?.entry_id);let t=!!this._entry&&!this._entry.available;t&&!this._staleTicker&&(this._staleTicker=window.setInterval(()=>this.requestUpdate(),3e4)),!t&&this._staleTicker&&(window.clearInterval(this._staleTicker),this._staleTicker=void 0)})}renderWaiting(i=""){let e=this._error?`Can't read CMR data from Home Assistant (${this._error}). Reload the page.`:"Waiting for the CMR controller\u2026";return a`<ha-card><div class="empty" style=${i}>${e}</div></ha-card>`}renderStale(i){return i.available?h:a`<div class="stale">
      <ha-icon icon="mdi:lan-disconnect"></ha-icon>Controller unreachable · showing data from ${de(i.last_update)}
    </div>`}},M=w`
  :host {
    --cmr-ok: var(--success-color, #2e7d32);
    --cmr-update: var(--info-color, #0288d1);
    /* Three distinct hues: alerts amber, offline red, pairing purple. */
    --cmr-alert: var(--warning-color, #f57c00);
    --cmr-pending: #8e24aa;
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
`;function Y(n,i=""){return n.product?.image?a`<div class="badge photo ${i}" title=${n.product.name}>
      <img src=${n.product.image} alt=${n.product.name} loading="lazy" referrerpolicy="no-referrer"
        @error=${e=>e.target.parentElement.classList.add("broken")} />
      <ha-icon icon=${Q(n)}></ha-icon>
    </div>`:a`<div class="badge ${i}"><ha-icon icon=${Q(n)}></ha-icon></div>`}function I(n){return(n.product&&!n.product.ambiguous?n.product:void 0)?.name??n.board??"Device"}function pe(n){return n.product&&!n.product.ambiguous?n.product.code:n.model_code}function ke(n,i,e,t,s,r=12){let o;if(e.devices_on===0)o=a`<div class="muted small">Not firing on any device right now.</div>`;else if(!i.console||t==="unsupported")o=a`<div class="muted small">
      The controller lists these devices only on its console, and this REST user may not run console commands.
    </div>`;else if(t==="loading")o=a`<div class="muted small">Asking the controller…</div>`;else if(t==="error")o=a`<div class="muted small">Couldn't read the device list from the controller.</div>`;else{let c=new Map(i.devices.map(u=>[u.key,u])),d=t.map(u=>c.get(u)).filter(u=>!!u).sort(j),p=d.slice(0,r);o=a`
      <div class="rd-list">
        ${p.map(u=>a`<button class="rd-dev status-${$(u)}" title=${A[$(u)]}
            @click=${()=>P(n,u.entities.connected)}><i class="dot"></i>${u.identity}</button>`)}
        ${d.length>p.length?a`<span class="muted small">+${d.length-p.length} more</span>`:h}
        ${d.length?h:a`<span class="muted small">Fires on devices this Home Assistant doesn't list yet.</span>`}
      </div>`}let l={cmr_alert:e.id};return a`<div class="rd">
    ${o}
    ${e.devices_on>0&&(s?.devices||s?.topology)?a`<div class="rd-links">
          ${s?.devices?a`<button class="rd-link" @click=${()=>D(W(s.devices,l))}>
                <ha-icon icon="mdi:table"></ha-icon>Show in Devices</button>`:h}
          ${s?.topology?a`<button class="rd-link" @click=${()=>D(W(s.topology,l))}>
                <ha-icon icon="mdi:sitemap-outline"></ha-icon>Show on map</button>`:h}
        </div>`:h}
  </div>`}var Ce=w`
  .rd {
    margin: 0 0 6px 19px; padding: 8px 10px 8px 12px; border-radius: 0 0 10px 10px;
    background: var(--cmr-surface-2); display: flex; flex-direction: column; gap: 8px;
  }
  .rd-list { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .rd-dev {
    all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px;
    padding: 3px 9px 3px 7px; border-radius: 999px; background: var(--cmr-surface); border: 1px solid var(--cmr-line);
    max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .rd-dev:hover { border-color: var(--status, var(--cmr-muted)); }
  .rd-links { display: flex; flex-wrap: wrap; gap: 4px 14px; }
  .rd-link {
    all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-size: 12.5px;
    color: var(--primary-color); --mdc-icon-size: 16px;
  }
  .rd-link:hover { text-decoration: underline; }
`;var Lt=["critical","high","medium","low"],Mt={critical:"mdi:alert-octagon",high:"mdi:alert",medium:"mdi:alert-circle-outline",low:"mdi:information-outline"},Ee=class extends S{constructor(){super();this._ruleDevices=new R(()=>this.requestUpdate());this._only="",this._open=""}static{this.properties={_setup:{state:!0},_copied:{state:!0},_push:{state:!0},_only:{state:!0},_open:{state:!0}}}willUpdate(e){super.willUpdate(e),e.has("_entry")&&this._ruleDevices.invalidate()}async _pushAlerts(e){this._push="busy";try{let t=await this.hass.connection.sendMessagePromise({type:"cmr/alert_push",entry_id:this._entry.entry_id,enable:e}),s=e?"now push to Home Assistant":"no longer push";this._push=`${t.done} rule${t.done===1?"":"s"} ${s}`+(t.failures.length?`; failed: ${t.failures.join("; ")}`:"")}catch(t){this._push=t?.message??String(t)}}static getConfigForm(){return{schema:[z,{name:"title",selector:{text:{}}},{name:"hide_disabled",selector:{boolean:{}}}],computeLabel:L({entry_id:"Controller",title:"Title",hide_disabled:"Hide disabled rules"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){return 2+(this._entry?.alerts.length??4)}async _toggleSetup(){if(this._setup!==void 0){this._setup=void 0;return}this._setup=null;try{this._setup=await this.hass.connection.sendMessagePromise({type:"cmr/alert_setup",entry_id:this._entry.entry_id})}catch(e){console.error("cmr: alert setup",e),this._setup=void 0}}async _copy(){this._setup&&await At(this._setup.script)&&(this._copied=!0,setTimeout(()=>this._copied=!1,1800))}render(){let e=this._entry;if(!e)return this.renderWaiting();let t=e.alerts.filter(m=>!(this._config.hide_disabled&&m.disabled)),s={firing:t.filter(m=>m.devices_on>0).length,disabled:t.filter(m=>m.disabled).length,pushing:t.filter(m=>m.webhook_ha).length},r=t.filter(m=>this._only==="firing"?m.devices_on>0:this._only==="disabled"?m.disabled:this._only==="pushing"?m.webhook_ha:!0).sort((m,v)=>+(v.devices_on>0)-+(m.devices_on>0)||Number(m.disabled)-Number(v.disabled)||Lt.indexOf(m.severity)-Lt.indexOf(v.severity)||m.name.localeCompare(v.name)),o=r.filter(m=>m.devices_on>0).length,l=e.alerts.filter(m=>m.webhook_ha).length,c=e.actions&&!!this.hass.user?.is_admin,d=e.fleet_entities.fleet_alert,p=d?this.hass.states[d]:void 0,u=p?.attributes??{};return a`
      <ha-card>
        <div class="card-header">
          <ha-icon icon=${o?"mdi:bell-alert":"mdi:bell-check-outline"}></ha-icon>
          <span>${this._config.title??"Alerts"}</span>
          ${o?a`<span class="chip alert">${o} firing</span>`:a`<span class="chip">all quiet</span>`}
          <div class="spacer"></div>
        </div>
        ${this.renderStale(e)}
        ${t.length>3?a`<div class="filters">
              <button class="pill ${this._only?"":"on"}" @click=${()=>this._only=""}>All ${t.length}</button>
              ${s.firing?a`<button class="pill hot ${this._only==="firing"?"on":""}" @click=${()=>this._only=this._only==="firing"?"":"firing"}>
                  <ha-icon icon="mdi:bell-alert-outline"></ha-icon>Firing ${s.firing}</button>`:h}
              ${s.pushing?a`<button class="pill ${this._only==="pushing"?"on":""}" @click=${()=>this._only=this._only==="pushing"?"":"pushing"}>
                  <ha-icon icon="mdi:webhook"></ha-icon>Pushing ${s.pushing}</button>`:h}
              ${s.disabled?a`<button class="pill ${this._only==="disabled"?"on":""}" @click=${()=>this._only=this._only==="disabled"?"":"disabled"}>
                  <ha-icon icon="mdi:bell-off-outline"></ha-icon>Disabled ${s.disabled}</button>`:h}
            </div>`:h}

        ${p&&p.state!=="unknown"&&p.state!=="unavailable"?a`<button class="last sev-${u.event_type}" @click=${()=>P(this,d)}>
              <ha-icon icon=${Mt[u.event_type]??"mdi:bell"}></ha-icon>
              <div>
                <div><b>${u.alert}</b>${u.device?a` · ${u.device}`:h}</div>
                <div class="muted small">Last pushed alert · ${de(p.state,"")}</div>
              </div>
            </button>`:h}

        <div class="rules">
          ${r.map(m=>this._rule(m,e))}
          ${r.length?h:a`<div class="empty">${t.length?"No rules match this filter.":"No alert rules on the controller."}</div>`}
        </div>

        ${this.hass.user?.is_admin?a`<div class="footer">
              ${c?a`<div class="push">
                    <ha-icon icon="mdi:webhook"></ha-icon>
                    <span class="small">${l?`${l} of ${e.alerts.length} rules push to Home Assistant`:"Alerts reach Home Assistant on the next poll only"}</span>
                    <button class="copy" ?disabled=${this._push==="busy"} @click=${()=>this._pushAlerts(l<e.alerts.length)}>
                      ${this._push==="busy"?"Working\u2026":l<e.alerts.length?"Push alerts to Home Assistant":"Stop pushing"}
                    </button>
                    ${this._push&&this._push!=="busy"?a`<div class="muted small">${this._push}</div>`:h}
                  </div>`:a`<button class="link" @click=${this._toggleSetup}>
                      <ha-icon icon="mdi:webhook"></ha-icon>
                      ${l?`${l} of ${e.alerts.length} rules push to Home Assistant`:"Push alerts to Home Assistant instantly"}
                      <ha-icon icon=${this._setup!==void 0?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                    </button>
                    ${this._setup===null?a`<div class="muted small">Loading…</div>`:h}
                    ${this._setup?a`<div class="setup">
                          <div class="small">Paste into the controller's terminal. Each alert rule gets an HTTP action that calls Home Assistant; edit <code>find</code> to choose rules. (With <i>Allow actions on the controller</i> in the options this becomes one click.)</div>
                          <pre>${this._setup.script}</pre>
                          <button class="copy" @click=${this._copy}>
                            <ha-icon icon=${this._copied?"mdi:check":"mdi:content-copy"}></ha-icon>${this._copied?"Copied":"Copy script"}
                          </button>
                        </div>`:h}`}
            </div>`:h}
      </ha-card>
    `}_rule(e,t){let s=e.devices_on>0,r=this._open===e.id;return a`
      <button class="rule sev-${e.severity} ${s?"on":""} ${e.disabled?"disabled":""} ${r?"open":""}"
              aria-expanded=${r} @click=${()=>this._open=r?"":e.id}>
        <span class="stripe"></span>
        <ha-icon class="sev" icon=${Mt[e.severity]}></ha-icon>
        <div class="body">
          <div class="title">
            <span class="name">${e.name}</span>
            ${e.webhook?a`<ha-icon class="hook" icon="mdi:webhook" title=${e.webhook_ha?"Pushes to Home Assistant":"Pushes to another webhook"}></ha-icon>`:h}
          </div>
          <div class="muted small">
            ${e.disabled?"disabled \xB7 ":h}${e.categories.join(", ")||"uncategorised"} ·
            ${e.labels.join(", ")||"all"}
          </div>
        </div>
        <div class="nums">
          <div class=${s?"hot":""}>${e.devices_on}/${e.devices}</div>
          <div class="muted small" title="Times fired">${e.fired}×</div>
        </div>
        ${e.entity_id?a`<span class="info" role="button" title="Entity details"
              @click=${o=>{o.stopPropagation(),P(this,e.entity_id)}}>
              <ha-icon icon="mdi:information-outline"></ha-icon></span>`:h}
      </button>
      ${r?ke(this,t,e,s?this._ruleDevices.get(this.hass,t.entry_id,e.id):[],this._config.views):h}
    `}static{this.styles=[M,Ce,w`
      .filters { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px; }
      .rule .info { color: var(--cmr-muted); --mdc-icon-size: 18px; line-height: 0; padding: 2px; border-radius: 50%; }
      .rule .info:hover { color: var(--primary-color); background: var(--cmr-surface); }
      .rule.open { background: var(--cmr-surface-2); border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
      .rule.open.on { background: color-mix(in srgb, var(--sev) 14%, transparent); }
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
    `]}};var ni=new Set(["insight","device","alert","upgrade","security","config"]),oi=n=>n.notable??(ni.has(n.category)||n.severity==="warning"||n.severity==="error"),Se={insight:{icon:"mdi:stethoscope",label:"Issues"},device:{icon:"mdi:router-network",label:"Devices"},alert:{icon:"mdi:bell-outline",label:"Alerts"},upgrade:{icon:"mdi:update",label:"Upgrades"},wifi:{icon:"mdi:wifi",label:"Wi-Fi"},link:{icon:"mdi:ethernet",label:"Links"},security:{icon:"mdi:shield-alert-outline",label:"Security"},login:{icon:"mdi:account-key-outline",label:"Logins"},config:{icon:"mdi:cog-outline",label:"Config"},dhcp:{icon:"mdi:ip-network-outline",label:"DHCP"},system:{icon:"mdi:cog-transfer-outline",label:"System"},api:{icon:"mdi:api",label:"API logins"}},Tt={icon:"mdi:text-box-outline",label:"Other"};function Rt(n){return Se[n]?Se[n]:n?{...Tt,label:n[0].toUpperCase()+n.slice(1)}:Tt}function ai(n){let i=n.data?.event;return n.category==="wifi"?i==="disconnected"?"mdi:wifi-off":i==="roamed"?"mdi:wifi-sync":"mdi:wifi-plus":n.category==="link"?n.data?.state==="down"?"mdi:ethernet-off":"mdi:ethernet":n.category==="device"?i==="disconnected"?"mdi:lan-disconnect":i==="rebooted"?"mdi:restart":"mdi:lan-connect":n.category==="insight"&&i==="resolved"?"mdi:check-circle-outline":Rt(n.category).icon}function li(n){return n.replace(/\b[0-9A-Fa-f]{2}(?::[0-9A-Fa-f]{2}){5}\b/g,"<mac>").replace(/\b\d{1,3}(?:\.\d{1,3}){3}(?:\/\d+)?(?::\d+)?\b/g,"<ip>").replace(/\b[0-9a-f]*:[0-9a-f:]+:[0-9a-f]*\b/gi,"<ip6>").replace(/\d+/g,"#")}function ci(n){let i=n.data??{},e=i.mac??i.interface??i.user??i.rule_id??i.key??li(n.title);return`${n.category}|${n.device_key??""}|${String(e)}`}var di=864e5,Ae=class extends E{constructor(){super();this._loaded=!1;this._events=[],this._issues=[],this._category="",this._device="",this._search="",this._open=new Set,this._limit=50}static{this.properties={hass:{attribute:!1},_config:{state:!0},_events:{state:!0},_issues:{state:!0},_category:{state:!0},_device:{state:!0},_search:{state:!0},_open:{state:!0},_limit:{state:!0},_notable:{state:!0}}}setConfig(e){this._unsubscribe&&e.entry_id!==this._config?.entry_id&&(this._unsubscribe(),this._unsubscribe=void 0,this._loaded=!1),this._config={show_issues:!0,show_filters:!0,hide_categories:["api"],max_items:50,...e},!this._unsubscribe&&this.hass&&this.isConnected&&this._subscribe(),this._limit=this._config.max_items??50,this._device=e.device??"",this._notable=!!e.notable}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"title",selector:{text:{}}},{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"device",selector:{text:{}}},{name:"max_items",selector:{number:{min:5,max:500,mode:"box"}}},{name:"notable",selector:{boolean:{}}},{name:"show_issues",selector:{boolean:{}}},{name:"show_filters",selector:{boolean:{}}}],computeLabel:e=>({title:"Title",entry_id:"Controller (default: all)",device:"Only this device (identity)",max_items:"Rows to show",notable:"Start with notable events only",show_issues:"Show detected issues",show_filters:"Show filters"})[e.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=xe.subscribe(this.hass,this._config?.entry_id,(e,t,s)=>{this._events=e,this._issues=t,this._error=s,this._loaded=!0})}_visible(){let e=this._config,t=this._search.trim().toLowerCase(),s=new Set(e.hide_categories??[]);return this._events.filter(r=>{if(this._notable&&!this._category&&!oi(r))return!1;if(this._category){if(r.category!==this._category)return!1}else if(e.categories?.length?!e.categories.includes(r.category):s.has(r.category))return!1;return!(this._device&&r.device_name!==this._device||t&&!`${r.title} ${r.message} ${r.device_name??""}`.toLowerCase().includes(t))})}_rows(e){let t=[];for(let s=e.length-1;s>=0;s--){let r=e[s],o=ci(r),l=t[t.length-1],c=l&&new Date(l.events[0].time).toDateString()===new Date(r.time).toDateString();l&&l.key===o&&c&&r.category!=="insight"?l.events.push(r):t.push({key:o,events:[r]})}return t}_toggle(e){let t=new Set(this._open);t.has(e)?t.delete(e):t.add(e),this._open=t}render(){if(!this._loaded)return a`<ha-card><div class="empty">Loading network events…</div></ha-card>`;if(this._error)return a`<ha-card><div class="empty">Can't read CMR events from Home Assistant (${this._error}). Reload the page.</div></ha-card>`;let e=this._config,t=this._visible(),s=this._rows(t),r=s.slice(0,this._limit),o=[...new Set(this._events.map(d=>d.category))].sort((d,p)=>Object.keys(Se).indexOf(d)-Object.keys(Se).indexOf(p)),l=[...new Set(this._events.map(d=>d.device_name).filter(Boolean))].sort(),c=this._device?this._issues.filter(d=>d.device_name===this._device):this._issues;return a`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:timeline-text-outline"></ha-icon>
          <span>${e.title??"Network events"}</span>
          ${c.length?a`<span class="chip alert">${c.length} issue${c.length>1?"s":""}</span>`:a`<span class="chip">no issues</span>`}
        </div>

        ${e.show_issues&&c.length?a`<div class="issues">${c.map(d=>this._issue(d))}</div>`:h}

        ${e.show_filters?a`<div class="filters">
              <div class="cats">
                <button class="pill ${!this._category&&this._notable?"on":""}"
                  @click=${()=>{this._category="",this._notable=!0}}>
                  <ha-icon icon="mdi:star-four-points-outline"></ha-icon>Notable</button>
                <button class="pill ${!this._category&&!this._notable?"on":""}"
                  @click=${()=>{this._category="",this._notable=!1}}>All</button>
                ${o.map(d=>{let p=Rt(d);return a`<button class="pill ${this._category===d?"on":""}" @click=${()=>this._category=this._category===d?"":d}>
                    <ha-icon icon=${p.icon}></ha-icon>${p.label}
                  </button>`})}
              </div>
              <div class="find">
                <select .value=${this._device} @change=${d=>this._device=d.target.value}>
                  <option value="">All devices</option>
                  ${l.map(d=>a`<option value=${d} ?selected=${d===this._device}>${d}</option>`)}
                </select>
                <input type="search" placeholder="Search" .value=${this._search}
                  @input=${d=>this._search=d.target.value} />
              </div>
            </div>`:h}

        <div class="timeline">
          ${r.map((d,p)=>{let u=new Date(d.events[0].time),m=p?new Date(r[p-1].events[0].time):void 0,v=!m||m.toDateString()!==u.toDateString();return a`${v?a`<div class="day section-label">${this._dayLabel(u)}</div>`:h}${this._row(d)}`})}
          ${r.length?h:a`<div class="empty">No events${this._search||this._category||this._device?" match these filters":" yet"}.</div>`}
          ${s.length>this._limit?a`<button class="more" @click=${()=>this._limit+=50}>Show more (${s.length-this._limit})</button>`:h}
        </div>
      </ha-card>
    `}_issue(e){let t=e.device_name;return a`<div class="issue sev-${e.severity}">
      <ha-icon icon=${e.severity==="error"?"mdi:alert-octagon-outline":"mdi:alert-outline"}></ha-icon>
      <div class="body">
        <div class="title">${e.title}</div>
        <div class="detail">${e.detail}</div>
        <div class="meta">
          since ${this._time(new Date(e.since))} · ${e.count}×
          ${t&&e.device_id?a`· <a href="#" @click=${s=>{s.preventDefault(),D(`/config/devices/device/${e.device_id}`)}}>${t}</a>`:t?a`· ${t}`:h}
        </div>
      </div>
      ${this.hass.user?.is_admin?a`<button class="dismiss" title="Dismiss (comes back only on new occurrences)"
            @click=${()=>ye(this.hass,e.entry_id,e.key).catch(s=>console.error("cmr: dismiss",s))}>
            <ha-icon icon="mdi:close"></ha-icon></button>`:h}
    </div>`}_row(e){let t=e.events[0],s=t.id,r=this._open.has(s),o=e.events.length>1,l=e.events[e.events.length-1],c=new Map;for(let d of e.events){let p=String(d.data?.event??d.category);c.set(p,(c.get(p)??0)+1)}return a`
      <div class="row sev-${t.severity} ${r?"open":""}">
        <button class="line" @click=${()=>this._toggle(s)}>
          <span class="time">${this._time(new Date(t.time))}</span>
          <span class="dot-icon"><ha-icon icon=${ai(t)}></ha-icon></span>
          <span class="text">
            <span class="title">${t.title}</span>
            ${o?a`<span class="fold">${e.events.length} events since ${this._time(new Date(l.time))} ·
                  ${[...c].map(([d,p])=>`${p} ${d}`).join(", ")}</span>`:h}
          </span>
          ${t.device_name?a`<span class="device">${t.device_name}</span>`:h}
        </button>
        ${r?this._details(e):h}
      </div>
    `}_details(e){let t=e.events.slice(0,30);return a`<div class="details">
      ${t.map(s=>{let r=Object.entries(s.data??{}).filter(([o,l])=>l!=null&&l!==""&&!["event","key","rule_id"].includes(o));return a`<div class="detail-item">
          <div class="detail-head"><span class="mono">${new Date(s.time).toLocaleString(this.hass.language)}</span>
            <span class="muted">${s.source}${s.topics?.length?` \xB7 ${s.topics.join(",")}`:""}</span></div>
          ${s.message&&s.message!==s.title?a`<div class="raw mono">${s.message}</div>`:h}
          ${r.length?a`<div class="fields">${r.map(([o,l])=>a`<span class="chip">${o.replace(/_/g," ")}: ${typeof l=="object"?JSON.stringify(l):String(l)}</span>`)}</div>`:h}
        </div>`})}
      ${e.events.length>t.length?a`<div class="muted">…and ${e.events.length-t.length} more</div>`:h}
      ${e.events[0].device_id?a`<a class="open-device" href="#" @click=${s=>{s.preventDefault(),D(`/config/devices/device/${e.events[0].device_id}`)}}>
            <ha-icon icon="mdi:open-in-app"></ha-icon>Open ${e.events[0].device_name}</a>`:h}
    </div>`}_time(e){return e.toLocaleTimeString(this.hass.language,{hour:"2-digit",minute:"2-digit"})}_dayLabel(e){let t=new Date;t.setHours(0,0,0,0);let s=new Date(e);s.setHours(0,0,0,0);let r=Math.round((t.getTime()-s.getTime())/di);return r===0?"Today":r===1?"Yesterday":e.toLocaleDateString(this.hass.language,{weekday:"long",day:"numeric",month:"long"})}static{this.styles=[M,w`
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
      .issue .dismiss {
        all: unset; cursor: pointer; flex: none; align-self: flex-start; line-height: 0; padding: 4px; border-radius: 50%;
        color: var(--cmr-muted); --mdc-icon-size: 18px;
      }
      .issue .dismiss:hover { color: var(--primary-text-color); background: color-mix(in srgb, var(--sev) 15%, transparent); }
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
    `]}};var Dt=8,pi={offline:"mdi:lan-disconnect",pending:"mdi:link-variant-plus",alert:"mdi:bell-alert-outline",update:"mdi:update",ok:"mdi:check-circle-outline"},Pe=class extends S{constructor(){super();this._ruleDevices=new R(()=>this.requestUpdate());this._onLocation=()=>this._applyDeepLink();this._filter=new Set,this._status="",this._version="",this._alert="",this._search="",this._sort={key:"attention",desc:!1},this._limit=100,this._unfolded=!1,this._pairing=new Map,this._labelPicker=!1,this._labelSearch=""}static{this.properties={_filter:{state:!0},_status:{state:!0},_version:{state:!0},_alert:{state:!0},_search:{state:!0},_sort:{state:!0},_limit:{state:!0},_unfolded:{state:!0},_pairing:{state:!0},_labelPicker:{state:!0},_labelSearch:{state:!0}}}setConfig(e){this._config={show_filters:!0,show_search:!0,fold_after:50,page_size:100,deep_link:!0,...e},this._filter=new Set(e.labels??[]),this._status=e.status??"",this._version=e.version??"",this._alert=e.alert??"",this._limit=this._config.page_size??100,this._applyDeepLink()}static getConfigForm(){return{schema:[z,{name:"title",selector:{text:{}}},{name:"labels",selector:{text:{multiple:!0}}},{name:"status",selector:{select:{mode:"dropdown",options:ee.map(e=>({value:e,label:A[e]}))}}},{name:"show_filters",selector:{boolean:{}}},{name:"show_search",selector:{boolean:{}}},{name:"fold_after",selector:{number:{min:0,max:5e3,mode:"box"}}},{name:"compact",selector:{boolean:{}}}],computeLabel:L({entry_id:"Controller",title:"Title",labels:"Only devices with these labels",status:"Only devices with this status",show_filters:"Show filter chips",show_search:"Show search",fold_after:"Fold healthy devices above this many rows (0: never)",compact:"Overview mode: only devices needing attention, few rows"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 2+Math.min(this._entry?.devices.length??4,12)}connectedCallback(){super.connectedCallback(),window.addEventListener("location-changed",this._onLocation),this._applyDeepLink()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("location-changed",this._onLocation)}_applyDeepLink(){if(this._config?.deep_link===!1)return;let e=we();e.status&&(this._status=e.status),e.version&&(this._version=e.version),e.search&&(this._search=e.search),e.alert&&(this._alert=e.alert)}willUpdate(e){super.willUpdate(e),e.has("_entry")&&this._ruleDevices.invalidate()}_toggleLabel(e){let t=new Set(this._filter);t.has(e)?t.delete(e):t.add(e),this._filter=t}_setStatus(e){this._status=this._status===e?"":e,this._limit=this._config.page_size??100}_setSort(e){this._sort={key:e,desc:this._sort.key===e?!this._sort.desc:!1}}async _approve(e){this._pairing=new Map(this._pairing).set(e.key,"busy");try{await $e(this.hass,this._entry.entry_id,e.key);let t=new Map(this._pairing);t.delete(e.key),this._pairing=t}catch(t){let s=t?.message??String(t);this._pairing=new Map(this._pairing).set(e.key,s)}}_sorted(e){let{key:t,desc:s}=this._sort,r=[...e].sort((o,l)=>{switch(t){case"device":return j(o,l);case"version":return(o.version??"").localeCompare(l.version??"",void 0,{numeric:!0});case"uptime":return(o.uptime??-1)-(l.uptime??-1);case"address":return(o.address??"").localeCompare(l.address??"",void 0,{numeric:!0});default:return ee.indexOf($(o))-ee.indexOf($(l))||j(o,l)}});return s?r.reverse():r}render(){let e=this._entry;if(!e)return this.renderWaiting();let t=!!this._config.compact,s=new Map;for(let g of e.devices)for(let k of g.labels)s.set(k,(s.get(k)??0)+1);let r=[...s.keys()].sort((g,k)=>s.get(k)-s.get(g)||g.localeCompare(k)),o=r.length>Dt+1?[...new Set([...r.slice(0,Dt),...this._filter])].sort((g,k)=>r.indexOf(g)-r.indexOf(k)):r,l=r.filter(g=>!o.includes(g)),c=this._labelSearch.trim().toLowerCase(),d=this._search.trim().toLowerCase(),p=this._alert?e.alerts.find(g=>g.id===this._alert):void 0,u=p&&p.devices_on>0?this._ruleDevices.get(this.hass,e.entry_id,p.id):p?[]:void 0,m=Array.isArray(u)?new Set(u):void 0,v=e.devices.filter(g=>[...this._filter].every(k=>g.labels.includes(k))&&(!this._version||g.version===this._version)&&(!m||m.has(g.key))&&St(g,d)),y=new Map;for(let g of v)y.set($(g),(y.get($(g))??0)+1);let x=this._sorted(this._status?v.filter(g=>$(g)===this._status):v),f=this._config.fold_after??50,b=x.filter(g=>$(g)!=="ok"),_=x.length-b.length,C=!this._status&&!this._unfolded&&f>0&&x.length>f&&b.length>0&&_>0,T=t&&!this._status||C?b:x,ue=T.slice(0,this._limit),X=this._config.views?.devices,O=g=>this._sort.key===g?a`<ha-icon class="sort" icon=${this._sort.desc?"mdi:arrow-down":"mdi:arrow-up"}></ha-icon>`:h;return a`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:router-network"></ha-icon>
          <span>${this._config.title??"Devices"}</span>
          <span class="chip">${x.length}${x.length!==e.devices.length?` of ${e.devices.length}`:""}</span>
          <div class="spacer"></div>
          ${t&&this._config.views?.devices?a`<button class="open-link" @click=${()=>D(W(this._config.views.devices))}>
                Open Devices <ha-icon icon="mdi:arrow-right"></ha-icon></button>`:h}
          ${this._config.show_search&&!t?a`<input class="search" type="search" placeholder="Search" .value=${this._search}
                @input=${g=>{this._search=g.target.value,this._limit=this._config.page_size??100}} />`:h}
        </div>
        ${this.renderStale(e)}
        ${this._config.show_filters?a`<div class="filters">
              <button class="pill ${this._status?"":"on"}" @click=${()=>this._setStatus("")}>All ${v.length}</button>
              ${ee.filter(g=>y.get(g)||g===this._status).map(g=>a`<button class="pill status-${g} ${this._status===g?"on":""}"
                  @click=${()=>this._setStatus(g)}>
                  <ha-icon icon=${pi[g]}></ha-icon>${A[g]} ${y.get(g)??0}
                </button>`)}
              ${this._version?a`<button class="pill on" title="Clear the version filter" @click=${()=>this._version=""}>
                    <span class="mono">${this._version}</span> ✕</button>`:h}
              ${this._alert?a`<button class="pill on status-alert" title="Clear the alert filter" @click=${()=>this._alert=""}>
                    <ha-icon icon="mdi:bell-alert-outline"></ha-icon>${p?.name??"alert rule"}${u==="loading"?" \u2026":""} ✕</button>`:h}
              ${u==="unsupported"||u==="error"?a`<span class="muted small">${u==="unsupported"?"The controller lists a rule's devices only on its console, which the REST user may not use.":"Couldn't read the rule's device list from the controller."}</span>`:h}
              ${o.length&&!t?a`<span class="sep"></span>`:h}
              ${t?h:o.map(g=>a`<button class="pill ${this._filter.has(g)?"on":""}" @click=${()=>this._toggleLabel(g)}>
                      ${g}
                    </button>`)}
              ${l.length&&!t?a`<button class="pill more-labels ${this._labelPicker?"on":""}" aria-expanded=${this._labelPicker}
                    @click=${()=>this._labelPicker=!this._labelPicker}>
                    ${this._labelPicker?"Fewer labels":`+${l.length} more`}</button>`:h}
            </div>
            ${this._labelPicker&&l.length&&!t?a`<div class="picker">
                  <input class="search" type="search" placeholder="Find a label" .value=${this._labelSearch}
                    @input=${g=>this._labelSearch=g.target.value} />
                  <div class="picker-list">
                    ${l.filter(g=>!c||g.toLowerCase().includes(c)).sort().map(g=>a`<button class="pill ${this._filter.has(g)?"on":""}" @click=${()=>this._toggleLabel(g)}>
                          ${g} <span class="muted">${s.get(g)}</span>
                        </button>`)}
                  </div>
                </div>`:h}`:h}
        <div class="table" role="table">
          <div class="row head section-label" role="row">
            <button class="c-device" @click=${()=>this._setSort(this._sort.key==="device"?"attention":"device")}
              title="Click to sort by name; again for attention first">
              Device ${O("device")}${this._sort.key==="attention"?a`<ha-icon class="sort" icon="mdi:sort-variant" title="Attention first"></ha-icon>`:h}
            </button>
            <span class="c-labels">Labels</span>
            <button class="c-version" @click=${()=>this._setSort("version")}>Version ${O("version")}</button>
            <button class="c-uptime" @click=${()=>this._setSort("uptime")}>Uptime ${O("uptime")}</button>
            <button class="c-address" @click=${()=>this._setSort("address")}>Address ${O("address")}</button>
          </div>
          ${ue.map(g=>this._row(g))}
          ${t&&!this._status&&_>0?a`<div class="fold static">
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                ${b.length?`${_} more`:`All ${_}`} device${_===1?"":"s"} online and up to date
              </div>`:h}
          ${C&&!t?a`<button class="fold" @click=${()=>this._unfolded=!0}>
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                ${_} device${_===1?"":"s"} online and up to date — show ${_===1?"it":"them"}
              </button>`:h}
          ${T.length>this._limit?t&&X?a`<button class="more" @click=${()=>D(W(X,this._status?{cmr_status:this._status}:{}))}>
                  ${T.length-this._limit} more — open Devices <ha-icon icon="mdi:arrow-right"></ha-icon></button>`:a`<button class="more" @click=${()=>this._limit+=this._config.page_size??100}>
                  Show more (${T.length-this._limit})</button>`:h}
          ${x.length?h:a`<div class="empty">${this._emptyText(e.devices.length)}</div>`}
        </div>
      </ha-card>
    `}_emptyText(e){return e?this._status?`No devices are ${A[this._status].toLowerCase()}.`:"No devices match these filters.":"The controller manages no devices yet."}_pairingCell(e,t){let s=this._pairing.get(e.key),r=e.pending&&!!this._entry?.actions&&!!this.hass.user?.is_admin;return a`<span class="offline" title=${q(e)}>${A[t]}</span>
      ${r?a`<button class="approve" ?disabled=${s==="busy"}
            @click=${o=>{o.stopPropagation(),this._approve(e)}}>
            ${s==="busy"?"Approving\u2026":"Approve"}</button>`:h}
      ${s&&s!=="busy"?a`<span class="small offline">${s}</span>`:h}`}_uptimeCell(e,t){return t==="pending"?this._pairingCell(e,t):e.connected?a`${ce(e.uptime)}`:a`<span class="offline">${A[t]}</span>
        ${e.disconnected_since?a`<span class="muted small">since ${e.disconnected_since}</span>`:h}`}_row(e){let t=$(e);return a`
      <div class="row status-${t}" role="row"
        @click=${()=>P(this,(e.update_available?e.entities.update:void 0)??e.entities.connected)}>
        <div class="c-device">
          <div class="icon" title=${A[t]}>${Y(e,"thumb")}<i class="dot"></i></div>
          <div class="who">
            <div class="name">
              ${e.identity}
              ${e.controller?a`<ha-icon class="crown" icon="mdi:crown-outline" title="CMR controller"></ha-icon>`:h}
            </div>
            <div class="muted small">${I(e)}${pe(e)?a` · <span class="mono">${pe(e)}</span>`:h}</div>
          </div>
        </div>
        <div class="c-labels">${e.labels.map(s=>a`<span class="chip">${s}</span>`)}</div>
        <div class="c-version" title=${e.prerelease?"Pre-release build \xB7 click to filter by this version":"Click to filter by this version"}>
          <button class="ver mono" @click=${s=>{s.stopPropagation(),this._version=this._version===e.version?"":e.version??""}}>
            ${e.version??"\u2013"}</button>
          ${e.update_available?a`<span class="update" title="Update available"><ha-icon icon="mdi:arrow-up-circle"></ha-icon><span class="mono">${e.available_version}</span></span>`:h}
        </div>
        <div class="c-uptime">${this._uptimeCell(e,t)}</div>
        <div class="c-address">
          ${e.address?a`<a class="mono" href=${Pt(e.address)} target="_blank" rel="noreferrer" @click=${s=>s.stopPropagation()}>${e.address}</a>`:a`<span class="muted">${e.controller?"local":"\u2013"}</span>`}
        </div>
      </div>
    `}static{this.styles=[M,w`
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
      .fold.static { cursor: default; color: var(--cmr-muted); }
      .more { background: none; }
      .more ha-icon { --mdc-icon-size: 16px; }
      .open-link {
        all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-size: 13px;
        color: var(--primary-color); --mdc-icon-size: 16px;
      }
      .open-link:hover { text-decoration: underline; }
      .picker { margin: -4px 16px 10px; padding: 10px; border-radius: 10px; background: var(--cmr-surface-2); display: flex; flex-direction: column; gap: 8px; }
      .picker .search { width: 220px; }
      .picker-list { display: flex; flex-wrap: wrap; gap: 6px; max-height: 180px; overflow: auto; }
      .picker-list .muted { font-size: 11px; margin-left: 2px; }

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
    `]}};var Le=["var(--primary-color)","var(--cmr-update)","var(--cmr-pending)","var(--accent-color, #7e57c2)","var(--cmr-ok)","var(--cmr-muted)"],Me=class extends S{constructor(){super();this._ruleDevices=new R(()=>this.requestUpdate());this._issues=[],this._pairing=new Map,this._openRule=""}static{this.properties={_panel:{state:!0},_version:{state:!0},_issues:{state:!0},_pairing:{state:!0},_openRule:{state:!0}}}willUpdate(e){super.willUpdate(e),e.has("_entry")&&this._ruleDevices.invalidate()}static getConfigForm(){return{schema:[z],computeLabel:L({entry_id:"Controller"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 4}connectedCallback(){super.connectedCallback(),this._ticker=window.setInterval(()=>this.requestUpdate(),15e3)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._ticker),this._unsubscribeEvents?.(),this._unsubscribeEvents=void 0}_toggle(e,t){let s=this._panel===e&&(e!=="version"||this._version===t);this._panel=s?void 0:e,this._version=s?void 0:t,this._panel==="issues"&&!this._unsubscribeEvents?this._unsubscribeEvents=xe.subscribe(this.hass,this._config?.entry_id,(r,o)=>{this._issues=o}):this._panel!=="issues"&&this._unsubscribeEvents&&(this._unsubscribeEvents(),this._unsubscribeEvents=void 0)}async _approve(e){this._pairing=new Map(this._pairing).set(e.key,"busy");try{await $e(this.hass,this._entry.entry_id,e.key);let t=new Map(this._pairing);t.delete(e.key),this._pairing=t}catch(t){this._pairing=new Map(this._pairing).set(e.key,t?.message??String(t))}}render(){let e=this._entry;if(!e)return this.renderWaiting();let t=e.devices,s=t.find(b=>b.controller),r=t.filter(b=>b.connected).length,o=t.filter(b=>b.update_available).length,l=t.filter(b=>b.pending||b.remote_pending).length,c=e.alerts.filter(b=>b.devices_on>0).length,d=e.fleet_entities.network_issues?this.hass.states[e.fleet_entities.network_issues]?.state:void 0,p=Number(d)||0,u=t.length?r/t.length:0,m=new Map;t.forEach(b=>m.set(b.version??"unknown",(m.get(b.version??"unknown")??0)+1));let v=[...m.entries()].sort((b,_)=>_[1]-b[1]),y=26,x=2*Math.PI*y,f=b=>this._panel===b?"on":"";return a`
      <ha-card>
        <div class="hero">
          <div class="identity">
            ${s?.product?.image?a`<div class="logo photo"><img src=${s.product.image} alt=${s.product.name} referrerpolicy="no-referrer" /></div>`:a`<div class="logo"><ha-icon icon="mdi:router-network"></ha-icon></div>`}
            <div class="who">
              <div class="eyebrow">CMR controller</div>
              <div class="name">${s?.identity??e.title}</div>
              <div class="meta">
                ${s?I(s):""} ·
                <span class="mono">${s?.version??"?"}</span>
                ${s?.prerelease?a`<span class="chip">pre-release</span>`:h}
              </div>
            </div>
            <a class="open" href=${e.controller_url} target="_blank" rel="noreferrer" title="Open the router's web interface (WebFig)">
              <ha-icon icon="mdi:open-in-new"></ha-icon>
            </a>
          </div>

          <div class="stats">
            <button class="stat ring ${f("online")}" aria-pressed=${this._panel==="online"} @click=${()=>this._toggle("online")}>
              <svg viewBox="0 0 64 64" class=${r===t.length?"status-ok":"status-offline"}>
                <circle cx="32" cy="32" r=${y} class="track"></circle>
                <circle cx="32" cy="32" r=${y} class="value"
                  stroke-dasharray=${`${x*u} ${x}`} transform="rotate(-90 32 32)"></circle>
              </svg>
              ${t.length<100?a`<div class="ring-text"><b>${r}</b><span>/${t.length}</span></div>
                    <div class="label">online</div>`:a`<div class="ring-text"><b>${r}</b></div>
                    <div class="label">of ${t.length} online</div>`}
            </button>
            ${this._stat("updates","mdi:update",o,"updates",o?"update":"ok")}
            ${this._stat("alerts","mdi:bell-alert-outline",c,"alerts firing",c?"alert":"ok")}
            ${this._stat("issues","mdi:stethoscope",p,p===1?"issue":"issues",p?"pending":"ok")}
            ${this._stat("pending","mdi:link-variant-plus",l,"to pair",l?"pending":"ok")}
          </div>
        </div>
        ${this.renderStale(e)}
        ${this._panel?this._renderPanel(e):h}

        <div class="bars">
          <div class="bar-title">
            <span>Versions</span>
            <span class="muted">updated ${de(e.last_update)}</span>
          </div>
          <div class="bar">
            ${v.map(([b,_],C)=>a`<button class="seg ${this._panel==="version"&&this._version===b?"on":""}"
                title="${b}: ${_} — click to list them"
                style="flex:${_};background:${Le[C%Le.length]}"
                @click=${()=>this._toggle("version",b)}></button>`)}
          </div>
          <div class="keys">
            ${v.map(([b,_],C)=>a`<button class="key ${this._panel==="version"&&this._version===b?"on":""}"
                @click=${()=>this._toggle("version",b)}>
                <i style="background:${Le[C%Le.length]}"></i>
                <span class="mono">${b}</span> <span class="muted">×${_}</span></button>`)}
          </div>
        </div>
      </ha-card>
    `}_stat(e,t,s,r,o){return a`
      <button class="stat status-${o} ${this._panel===e?"on":""}" aria-pressed=${this._panel===e}
        @click=${()=>this._toggle(e)}>
        <ha-icon icon=${t}></ha-icon>
        <b>${s}</b>
        <div class="label">${r}</div>
      </button>
    `}_renderPanel(e){let t=this._panel,s=d=>[...d].sort(j),r="",o=[],l="",c;if(t==="online"){let d=s(e.devices.filter(p=>!p.connected));r=d.length?`${d.length} offline`:"All devices online",l="Every managed device is connected to the controller.",o=d.map(p=>this._deviceRow(p,p.disconnected_since?`since ${p.disconnected_since}`:"disconnected")),c={view:this._config.views?.devices,params:{cmr_status:"offline"}}}else if(t==="updates"){let d=s(e.devices.filter(p=>p.update_available));r=d.length?`${d.length} with an update`:"Everything is up to date",l="No device's channel offers a newer version.",o=d.map(p=>this._deviceRow(p,a`<span class="mono">${p.version}</span> → <span class="mono up">${p.available_version}</span>`,p.entities.update)),c={view:this._config.views?.devices,params:{cmr_status:"update"}}}else if(t==="alerts"){let d=e.alerts.filter(p=>p.devices_on>0).sort((p,u)=>u.devices_on-p.devices_on);r=d.length?`${d.length} alert rule${d.length>1?"s":""} firing`:"No alert rule is firing",l="All alert rules are quiet.",o=d.map(p=>this._ruleRow(p,e))}else if(t==="issues")r=this._issues.length?`${this._issues.length} detected issue${this._issues.length>1?"s":""}`:"No issues detected",l=this._unsubscribeEvents?"Nothing unusual in the events.":"Loading\u2026",o=this._issues.map(d=>a`<div class="item sev-${d.severity}">
          <ha-icon icon=${d.severity==="error"?"mdi:alert-octagon-outline":"mdi:alert-outline"}></ha-icon>
          <div class="text">
            <div class="t">${d.title}</div>
            <div class="muted small">${d.detail}</div>
          </div>
          ${d.device_name?a`<span class="chip">${d.device_name}</span>`:h}
          ${this.hass.user?.is_admin?a`<button class="dismiss" title="Dismiss (comes back only on new occurrences)"
                @click=${()=>ye(this.hass,d.entry_id,d.key).catch(p=>console.error("cmr: dismiss",p))}>
                <ha-icon icon="mdi:close"></ha-icon></button>`:h}
        </div>`),c={view:this._config.views?.events,params:{}};else if(t==="pending"){let d=s(e.devices.filter(p=>p.pending||p.remote_pending));r=d.length?`${d.length} waiting to pair`:"No device is waiting to pair",l="New devices appear here until their pairing is approved.",o=d.map(p=>this._pendingRow(p,e)),c={view:this._config.views?.devices,params:{cmr_status:"pending"}}}else{let d=s(e.devices.filter(p=>(p.version??"unknown")===this._version));r=`${d.length} on ${this._version}`,o=d.map(p=>this._deviceRow(p,p.update_available?a`update: <span class="mono up">${p.available_version}</span>`:I(p))),c={view:this._config.views?.devices,params:{cmr_version:this._version}}}return a`<div class="panel">
      <div class="panel-head">
        <span class="section-label">${r}</span>
        <span class="spacer"></span>
        ${c?.view?a`<button class="link" @click=${()=>D(W(c.view,c.params))}>
              Open in ${t==="issues"?"Events":"Devices"} <ha-icon icon="mdi:arrow-right"></ha-icon></button>`:h}
        <button class="close" title="Close" @click=${()=>this._toggle(t,this._version)}><ha-icon icon="mdi:close"></ha-icon></button>
      </div>
      ${o.length?o:a`<div class="muted small">${l}</div>`}
    </div>`}_deviceRow(e,t,s){return a`<button class="item status-${e.connected?e.update_available?"update":"ok":"offline"}"
      @click=${()=>P(this,s??e.entities.connected)}>
      ${Y(e,"thumb")}
      <div class="text">
        <div class="t">${e.identity}</div>
        <div class="muted small">${t}</div>
      </div>
    </button>`}_ruleRow(e,t){let s=this._openRule===e.id;return a`<button class="item sev-${e.severity} ${s?"open":""}" aria-expanded=${s}
        @click=${()=>this._openRule=s?"":e.id}>
        <ha-icon icon="mdi:bell-alert"></ha-icon>
        <div class="text">
          <div class="t">${e.name}</div>
          <div class="muted small">${e.severity} · ${e.categories.join(", ")||"uncategorised"} · fired ${e.fired}×</div>
        </div>
        <span class="chip alert">${e.devices_on}/${e.devices}</span>
        <ha-icon class="chev" icon=${s?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </button>
      ${s?ke(this,t,e,this._ruleDevices.get(this.hass,t.entry_id,e.id),this._config.views):h}`}_pendingRow(e,t){let s=this._pairing.get(e.key),r=e.pending&&t.actions&&!!this.hass.user?.is_admin;return a`<div class="item status-pending">
      ${Y(e,"thumb")}
      <div class="text">
        <div class="t">${e.identity}</div>
        <div class="muted small">${I(e)} · ${q(e)}${s&&s!=="busy"?` \xB7 ${s}`:""}</div>
      </div>
      ${r?a`<button class="approve" ?disabled=${s==="busy"} @click=${()=>this._approve(e)}>
            ${s==="busy"?"Approving\u2026":"Approve"}</button>`:h}
    </div>`}static{this.styles=[M,Ce,w`
      .item .chev { color: var(--cmr-muted); --mdc-icon-size: 18px; }
      .item.open { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
      .rd { margin-left: 0; }
      .item .dismiss { all: unset; cursor: pointer; line-height: 0; padding: 4px; border-radius: 50%; color: var(--cmr-muted); --mdc-icon-size: 18px; }
      .item .dismiss:hover { color: var(--primary-text-color); background: var(--cmr-surface); }
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
    `]}};var zt=(n,i,e={})=>({type:"heading",heading:n,icon:i,heading_style:"title",...e});function hi(n,i,e){return Promise.race([n,new Promise(t=>setTimeout(()=>t(e),i))])}function ui(n,i,e){let t=o=>!!o&&!!i.states[o]&&i.states[o].state!=="unavailable",s=n.entities,r=[zt(n.identity,Q(n),{heading_style:"subtitle",...n.device_id?{tap_action:{action:"navigate",navigation_path:`/config/devices/device/${n.device_id}`}}:{},badges:t(s.version)?[{type:"entity",entity:s.version,show_icon:!0}]:[]})];return t(s.connected)&&r.push({type:"tile",entity:s.connected,name:"Connection",state_content:["state","last_changed"]}),t(s.uptime)&&r.push({type:"tile",entity:s.uptime,name:"Up since"}),t(s.update)&&r.push({type:"tile",entity:s.update,name:"RouterOS",show_entity_picture:!0,grid_options:{columns:12}}),t(s.active_alerts)&&r.push({type:"tile",entity:s.active_alerts,name:"Alerts"}),e&&t(s.alert)&&r.push({type:"tile",entity:s.alert,name:"Last alert"}),{type:"grid",cards:r}}function mi(n,i){let e=n.fleet_entities;return{title:"Network",path:"network",icon:"mdi:router-network",type:"sections",max_columns:3,badges:[[e.devices_online,"Online"],[e.updates_available,"Updates"],[e.alerts_firing,"Alerts firing"],[e.network_issues,"Issues"]].filter(([t])=>t).map(([t,s])=>({type:"entity",entity:t,name:s,show_name:!0})),sections:[{type:"grid",column_span:3,cards:[{...i,type:"custom:cmr-status-card",views:{devices:"devices",events:"events",topology:"topology"}}]},{type:"grid",column_span:3,cards:[{...i,type:"custom:cmr-topology-card",height:480,grid_options:{columns:"full"}}]},{type:"grid",column_span:2,cards:[{...i,type:"custom:cmr-fleet-card",compact:!0,page_size:8,views:{devices:"devices"},grid_options:{columns:"full"}},{...i,type:"custom:cmr-events-card",max_items:15,notable:!0,grid_options:{columns:"full"}}]},{type:"grid",cards:[{...i,type:"custom:cmr-alerts-card",views:{devices:"devices",topology:"topology"},grid_options:{columns:"full"}},{...i,type:"custom:cmr-upgrades-card",grid_options:{columns:"full"}}]}]}}var vi=24;function gi(n,i,e){let t=n.alerts.some(l=>l.webhook),s=[...n.devices].sort(j),r=s.length<=vi,o=s.map(l=>l.entities.connected).filter(Boolean);return{title:"Devices",path:"devices",icon:"mdi:devices",type:"sections",max_columns:4,sections:[{type:"grid",column_span:4,cards:[{...e,type:"custom:cmr-fleet-card",grid_options:{columns:"full"}}]},...r?[{type:"grid",column_span:4,cards:[zt("Connectivity, last 24 hours","mdi:chart-timeline-variant"),{type:"history-graph",hours_to_show:24,entities:o,grid_options:{columns:"full"}}]},...s.map(l=>ui(l,i,t))]:[]]}}function fi(n){return{title:"Events",path:"events",icon:"mdi:timeline-text-outline",type:"sections",max_columns:2,sections:[{type:"grid",column_span:2,cards:[{...n,type:"custom:cmr-events-card",max_items:100,grid_options:{columns:"full"}}]}]}}function _i(n){return{title:"Topology",path:"topology",icon:"mdi:sitemap-outline",type:"panel",cards:[{...n,type:"custom:cmr-topology-card",height:760}]}}function tt(n,i){return{title:n.title??"Network",views:[{title:"Network",path:"network",cards:[{type:"markdown",content:`## CMR
${i}`}]}]}}var Te=class extends HTMLElement{static getCreateSuggestions(){return{title:"Network",icon:"mdi:router-network"}}static{this.configRequired=!0}static async getConfigElement(){return document.createElement("cmr-strategy-editor")}static async generate(i,e){try{let t=await hi(_e.once(e),8e3,[]),s=be(t,i.entry_id);if(!s&&i.entry_id&&t.length)return tt(i,"The controller this dashboard shows isn't loaded right now. If Home Assistant just started, reload in a moment; if the controller was removed, open *Edit dashboard* and pick another one.");if(!s)return tt(i,"No CMR controller is set up yet. Add the **CMR** integration under [Settings \u2192 Devices & services](/config/integrations/dashboard/add?domain=cmr).");let r=t.length>1||i.entry_id?{entry_id:s.entry_id}:{},o=mi(s,r);return{title:i.title??s.title,views:[o,fi(r),gi(s,e,r),_i(r)]}}catch(t){return console.error("cmr: dashboard strategy failed",t),tt(i,`The dashboard couldn't be built (${String(t)}). Reload the page to try again.`)}}};var bi=[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"title",selector:{text:{}}}],yi=L({entry_id:"Controller (empty: the first one)",title:"Title shown in the dashboard header"}),Re=class extends E{static{this.properties={hass:{attribute:!1},lovelace:{attribute:!1},_config:{state:!0}}}setConfig(i){this._config=i}connectedCallback(){super.connectedCallback(),xi()}render(){return!this.hass||!this._config?a``:a`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${bi}
      .computeLabel=${yi}
      @value-changed=${this._changed}
    ></ha-form>`}_changed(i){i.stopPropagation();let e={...this._config,...i.detail.value,type:this._config.type};for(let t of["entry_id","title"])e[t]||delete e[t];this._config=e,et(this,"config-changed",{config:e})}};async function xi(){if(!customElements.get("ha-form"))try{await(await(await window.loadCardHelpers?.())?.createCardElement({type:"entities",entities:[]}))?.constructor?.getConfigElement?.()}catch{}}var H=184,G=62,De=48,he="__auto__",$i="mdi:map-marker-radius-outline",Ht={fiber:"Fiber (SFP)",copper:"Ethernet",wireless:"Wireless",logical:"Logical interface",uplink:"Link between layouts",unknown:"No ports detected"},wi=["copper","fiber","wireless","unknown"];function it(n){return/^q?sfp/i.test(n)?"fiber":/^(ether|combo)/i.test(n)?"copper":/^(wifi|wlan|wl\d)/i.test(n)?"wireless":"logical"}function ki(n,i,e=3){return n.x0<i.x1+e&&i.x0<n.x1+e&&n.y0<i.y1+e&&i.y0<n.y1+e}function Ci(n,i,e,t,s){let r=Math.hypot(e,t)||1,o=e/r,l=t/r,c=Math.min(o?H/2/Math.abs(o):1/0,l?G/2/Math.abs(l):1/0);return{x:n+o*(c+s),y:i+l*(c+s),ux:o,uy:l}}var ze=class extends S{constructor(){super();this._ruleDevices=new R(()=>this.requestUpdate());this._userMoved=!1;this._fittedFor="";this._fitK=1;this._onLocation=()=>{let e=we().alert;e&&(this._alert=e)};this._onKey=e=>{e.key==="Escape"&&this._clearHover()};this._clearHover=()=>{this._hover=void 0,this._hoverLink=void 0};this._path=[],this._view={x:0,y:0,k:1},this._alert=""}static{this.properties={_path:{state:!0},_hover:{state:!0},_hoverLink:{state:!0},_view:{state:!0},_autoHeight:{state:!0},_alert:{state:!0}}}setConfig(e){this._config={height:440,show_ports:!0,show_comments:!0,...e},this._path=e.layout?[e.layout]:[],this._userMoved=!1}static getConfigForm(){return{schema:[z,{name:"title",selector:{text:{}}},{name:"layout",selector:{text:{}}},{name:"height",selector:{number:{min:200,max:1400,step:20,mode:"box",unit_of_measurement:"px"}}},{name:"max_height",selector:{number:{min:200,max:3e3,step:20,mode:"box",unit_of_measurement:"px"}}},{name:"show_ports",selector:{boolean:{}}},{name:"show_comments",selector:{boolean:{}}}],computeLabel:L({entry_id:"Controller",title:"Title",layout:"Start at layout (empty: the top layout)",height:"Height",show_ports:"Show port names on cables",show_comments:"Show link comments"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6,min_rows:4}}getCardSize(){return Math.round((this._config?.height??440)/50)+1}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey),window.addEventListener("location-changed",this._onLocation),this._onLocation()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey),window.removeEventListener("location-changed",this._onLocation),this._resize?.disconnect(),this._resize=void 0}_memoFor(e){let t=this._path.join("/");return(this._memo?.entry!==e||this._memo.path!==t)&&(this._memo={entry:e,path:t,byKey:new Map(e.devices.map(s=>[s.key,s])),devicesIn:new Map,cables:new Map}),this._memo}_rootLayouts(e){let t=new Set(e.nodes.map(o=>o.target_layout).filter(Boolean)),s=new Set(e.nodes.map(o=>o.layout)),r=e.layouts.map(o=>o.name).filter(o=>!t.has(o)&&s.has(o));return r.length?r:e.layouts.map(o=>o.name).filter(o=>s.has(o))}_currentLayout(e){return this._path.length?this._path[this._path.length-1]:this._rootLayouts(e)[0]??he}_devicesIn(e,t,s=new Set){let r=this._memoFor(e),o=r.devicesIn.get(t);if(o)return o;if(s.has(t))return[];s.add(t);let l=new Map;for(let d of e.nodes){if(d.layout!==t)continue;let p=d.device_key?r.byKey.get(d.device_key):void 0;p&&l.set(p.key,p),d.target_layout&&this._devicesIn(e,d.target_layout,s).forEach(u=>l.set(u.key,u))}let c=[...l.values()];return r.devicesIn.set(t,c),c}_scene(e){let t=this._memoFor(e);return t.scene||(t.scene=this._buildScene(e,t.byKey)),t.scene}_buildScene(e,t){let s=this._currentLayout(e),r,o;if(s===he)({nodes:r,links:o}=this._autoLayout(e));else{let v=e.nodes.filter(_=>_.layout===s),y=v.filter(_=>_.x!=null&&_.y!=null),x=y.length?Math.max(...y.map(_=>_.y)):0,f=y.length?Math.min(...y.map(_=>_.x)):0,b=0;r=v.map(_=>{let C=_.x==null||_.y==null,T=C?f+b*(H+40):_.x,ue=C?x+G*2.4:_.y;if(C&&(b+=1),_.target_layout){let O=this._devicesIn(e,_.target_layout),g=O.filter(Ne=>Ne.connected).length,k=O.map($),Ft=k.includes("offline")?"offline":k.includes("alert")?"alert":k.includes("update")?"update":"ok",Kt=e.layouts.find(Ne=>Ne.name===_.target_layout)?.comment??null;return{id:_.name,name:_.name,x:T,y:ue,kind:"site",target:_.target_layout,site:{online:g,total:O.length,status:Ft,comment:Kt}}}let X=_.device_key?t.get(_.device_key):void 0;return{id:_.name,name:X?.identity??_.name,x:T,y:ue,kind:X?"device":"unknown",device:X}}),o=e.links.filter(_=>_.layout===s)}let l=r.map(v=>v.x),c=r.map(v=>v.y),d=Math.min(...l,0)-H/2-De,p=Math.min(...c,0)-G/2-De;for(let v of r)v.x-=d,v.y-=p;let u=Math.max(...r.map(v=>v.x),0)+H/2+De,m=Math.max(...r.map(v=>v.y),0)+G/2+De;return{layout:s,nodes:r,links:o,width:u,height:m}}_autoLayout(e){let t=p=>p.controller?0:1,s=new Map;for(let p of e.devices){let u=t(p);s.set(u,[...s.get(u)??[],p])}let r=Math.max(4,Math.ceil(Math.sqrt(e.devices.length*2.2))),o=[],l=0;for(let p of[...s.keys()].sort()){let u=s.get(p).sort((m,v)=>m.identity.localeCompare(v.identity));for(let m=0;m<u.length;m+=r,l+=1){let v=u.slice(m,m+r),y=(Math.min(r,e.devices.length)-v.length)*(H+48)/2;v.forEach((x,f)=>o.push({id:x.key,name:x.identity,kind:"device",device:x,x:y+f*(H+48),y:l*(G+90)}))}}let c=e.devices.find(p=>p.controller),d=c?e.devices.filter(p=>!p.controller).map(p=>({id:p.key,layout:he,node1:c.key,node2:p.key,comment:null,ports:[]})):[];return{nodes:o,links:d}}willUpdate(e){super.willUpdate(e),e.has("_entry")&&this._ruleDevices.invalidate()}updated(){let e=this.renderRoot.querySelector(".viewport");e&&!this._resize&&(this._resize=new ResizeObserver(()=>{this._sizeToLayout(),this._userMoved||this._fit()}),this._resize.observe(e)),this._sizeToLayout();let t=`${this._entry?.entry_id}|${this._path.join("/")}|${this._entry?this._scene(this._entry).nodes.length:0}`;this._entry&&t!==this._fittedFor&&(this._fittedFor=t,this._userMoved=!1,this._fit())}_sizeToLayout(){let e=this.renderRoot.querySelector(".viewport");if(!e||!this._entry)return;let{width:t,height:s}=this._scene(this._entry),r=e.clientWidth;if(!r||!t)return;let o=this._config?.height??440,l=Math.max(o,this._config?.max_height??Math.round(window.innerHeight*.85)),c=Math.round(Math.min(l,Math.max(o,r*s/t)));(this._autoHeight===void 0||Math.abs(c-this._autoHeight)>4)&&(this._autoHeight=c)}_fit(){let e=this.renderRoot.querySelector(".viewport");if(!e||!this._entry)return;let{width:t,height:s}=this._scene(this._entry),r=e.clientWidth,o=e.clientHeight;if(!r||!o)return;let l=Math.min(r/t,o/s,1.2);this._fitK=l;let c={k:l,x:(r-t*l)/2,y:(o-s*l)/2};(Math.abs(c.k-this._view.k)>.001||Math.abs(c.x-this._view.x)>.5||Math.abs(c.y-this._view.y)>.5)&&(this._view=c)}_onWheel(e){if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();let t=e.currentTarget.getBoundingClientRect();this._zoomAt(e.clientX-t.left,e.clientY-t.top,Math.exp(-e.deltaY*.0018))}_zoomAt(e,t,s){let{x:r,y:o,k:l}=this._view,c=Math.min(4,Math.max(Math.min(.25,this._fitK*.8),l*s));this._view={k:c,x:e-(e-r)*c/l,y:t-(t-o)*c/l},this._userMoved=!0,this._clearHover()}_onPointerDown(e){e.pointerType==="touch"||e.button!==0||(this._clearHover(),this._drag={id:e.pointerId,x:e.clientX,y:e.clientY,vx:this._view.x,vy:this._view.y,moved:!1})}_onPointerMove(e){let t=this._drag;if(!t||t.id!==e.pointerId)return;let s=e.clientX-t.x,r=e.clientY-t.y;!t.moved&&Math.hypot(s,r)<4||(t.moved||e.currentTarget.setPointerCapture(e.pointerId),t.moved=!0,this._userMoved=!0,this._hover=void 0,this._view={...this._view,x:t.vx+s,y:t.vy+r})}_onPointerUp(e){this._drag?.moved&&e.type==="pointerup"&&e.currentTarget?.addEventListener("click",t=>t.stopPropagation(),{capture:!0,once:!0}),this._drag=void 0}_zoom(e){let t=this.renderRoot.querySelector(".viewport");t&&this._zoomAt(t.clientWidth/2,t.clientHeight/2,e)}_onDoubleClick(e){if(e.target.closest(".controls"))return;let t=e.currentTarget.getBoundingClientRect();this._zoomAt(e.clientX-t.left,e.clientY-t.top,2)}_resetView(){this._userMoved=!1,this._fit()}_open(e){if(e.kind==="site"&&e.target)this._path=[...this._path.length?this._path:[this._currentLayout(this._entry)],e.target],this._hover=void 0;else if(e.device){let t=e.device.entities;P(this,(e.device.update_available?t.update:void 0)??t.connected??t.update)}}_goTo(e){this._path=this._path.slice(0,e+1),this._hover=void 0}_selectRoot(e){this._path=[e],this._hover=void 0}_onNodeKey(e,t){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._open(t))}_showHover(e,t){if(this._drag?.moved)return;let s=this.renderRoot.querySelector(".viewport");if(!s)return;let{x:r,y:o,k:l}=this._view,c=300,d=e.device?.product?.image_large?340:230,p=(e.x+H/2)*l+r+12,u=(e.x-H/2)*l+r-12-c,m=p+c<=s.clientWidth-8,v=e.y*l+o-d/2;this._hover={node:e,x:m||u<8?Math.min(p,s.clientWidth-c-8):u,y:Math.max(8,Math.min(v,s.clientHeight-d-8))},t.stopPropagation()}render(){let e=this._entry,t=this._config?.height??440;if(!e)return this.renderWaiting(`height:${t}px`);let s=this._scene(e),r=this._rootLayouts(e),o=this._path.length?this._path:[s.layout],l=new Map(s.nodes.map(f=>[f.id,f])),c=s.links.map(f=>this._linkInfo(f,l)).filter(f=>f!==void 0),d=wi.filter(f=>c.some(b=>b.kind===f)),{x:p,y:u,k:m}=this._view,v=e.layouts.find(f=>f.name===s.layout),y=this._alert?e.alerts.find(f=>f.id===this._alert):void 0,x=y?y.devices_on>0?this._ruleDevices.get(this.hass,e.entry_id,y.id):[]:void 0;return this._lit=Array.isArray(x)?new Set(x):void 0,a`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:sitemap-outline"></ha-icon>
          <div class="crumbs">
            ${this._config.title?a`<span class="title">${this._config.title}</span>`:h}
            ${o.map((f,b)=>a`
                ${b?a`<ha-icon class="sep" icon="mdi:chevron-right"></ha-icon>`:h}
                <button class="crumb ${b===o.length-1?"current":""}" @click=${()=>this._goTo(b)}>
                  ${f===he?"All devices":f}
                </button>
              `)}
          </div>
          <div class="spacer"></div>
          ${r.length>1?a`<div class="roots">
                ${r.map(f=>a`<button class="pill ${o[0]===f?"on":""}" @click=${()=>this._selectRoot(f)}>${f}</button>`)}
              </div>`:h}
        </div>
        ${v?.comment?a`<div class="subtitle">${v.comment}</div>`:h}
        ${y?a`<div class="hl">
              <ha-icon icon="mdi:bell-alert-outline"></ha-icon>
              <span>${Array.isArray(x)?`${x.length} device${x.length===1?"":"s"} where "${y.name}" fires`:x==="loading"?`Finding the devices where "${y.name}" fires\u2026`:`The devices where "${y.name}" fires can't be listed (console access)`}</span>
              <span class="spacer"></span>
              <button class="hl-close" title="Show every device" @click=${()=>this._alert=""}><ha-icon icon="mdi:close"></ha-icon></button>
            </div>`:h}
        ${this.renderStale(e)}
        <div
          class="viewport"
          style="min-height:${this._autoHeight??t}px"
          @wheel=${this._onWheel}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
          @dblclick=${this._onDoubleClick}
          @mouseleave=${this._clearHover}
        >
          <div
            class="world"
            style="width:${s.width}px;height:${s.height}px;transform:translate(${p}px,${u}px) scale(${m})"
          >
            <svg class="wires" width=${s.width} height=${s.height}>
              ${c.map(f=>this._renderLink(f))}
            </svg>
            ${this._config.show_ports?c.map(f=>this._renderPorts(f)):h}
            ${this._config.show_comments?c.map(f=>this._renderComment(f)):h}
            ${s.nodes.map(f=>this._renderNode(f))}
          </div>
          ${s.nodes.length?h:a`<div class="nothing">${s.layout===he?"No devices on the controller yet.":"This layout has no nodes yet."}</div>`}
          ${this._hover?this._renderTooltip(this._hover):h}
          ${this._hoverLink&&!this._hover?this._renderLinkTooltip(this._hoverLink):h}
          <div class="controls">
            <button title="Zoom in (or double-click the map)" @click=${()=>this._zoom(1.6)}><ha-icon icon="mdi:plus"></ha-icon></button>
            <button title="Zoom out" @click=${()=>this._zoom(1/1.6)}><ha-icon icon="mdi:minus"></ha-icon></button>
            <button title="Show the whole map" @click=${this._resetView}><ha-icon icon="mdi:fit-to-screen-outline"></ha-icon></button>
          </div>
          <div class="legend">
            ${["ok","update","alert","offline"].map(f=>a`<span class="status-${f}"><i class="dot"></i>${A[f]}</span>`)}
            ${d.map(f=>a`<span><i class="wire-sample k-${f}"></i>${Ht[f]}</span>`)}
            ${c.some(f=>f.poe)?a`<span><i class="poe-sample"></i>PoE power</span>`:h}
          </div>
        </div>
      </ha-card>
    `}_linkState(e,t){let s=l=>l?.kind==="device"?l.device.connected:l?.kind==="site"?l.site.online>0:void 0,r=s(e),o=s(t);return r===!1||o===!1?"down":r===void 0||o===void 0?"unknown":"up"}_linkInfo(e,t){let s=t.get(e.node1),r=t.get(e.node2);if(!s||!r)return;let o=e.ports,l=[s.name,r.name],c=!1,d;!o.length&&s.kind==="site"&&r.kind==="site"&&(c=!0,d=this._cableBetween(s.target,r.target),d&&(o=d.ports,l=d.names));let p=o[0],u;if(p){let v=[it(p.a.interface),it(p.b.interface)];u=v.includes("fiber")?"fiber":v.includes("wireless")?"wireless":v.every(y=>y==="copper")?"copper":"logical"}else u=c&&!d?"uplink":"unknown";let m;return p?.a.poe==="powered-on"?m={from:s,to:r,port:p.a.interface}:p?.b.poe==="powered-on"&&(m={from:r,to:s,port:p.b.interface}),{link:e,a:s,b:r,state:this._linkState(s,r),kind:u,ports:o,endNames:l,poe:m}}_cableBetween(e,t){let s=this._entry,r=this._memoFor(s),o=`${e}\0${t}`;if(r.cables.has(o))return r.cables.get(o);let l=new Set(this._devicesIn(s,e).map(m=>m.key)),c=new Set(this._devicesIn(s,t).map(m=>m.key)),d=new Map(s.nodes.map(m=>[`${m.layout}\0${m.name}`,m.device_key])),p=r.byKey,u;for(let m of s.links){let v=d.get(`${m.layout}\0${m.node1}`),y=d.get(`${m.layout}\0${m.node2}`);if(!v||!y)continue;let x=l.has(v)&&c.has(y);if(!x&&!(l.has(y)&&c.has(v)))continue;let[f,b]=x?[v,y]:[y,v],_=x?m.ports:m.ports.map(T=>({a:T.b,b:T.a})),C={ports:_,names:[p.get(f)?.identity??f,p.get(b)?.identity??b]};(!u||_.length&&!u.ports.length)&&(u=C)}return r.cables.set(o,u),u}_renderLink(e){let{a:t,b:s,state:r,kind:o,poe:l}=e,c=`M ${t.x} ${t.y} L ${s.x} ${s.y}`,d=r==="up"&&o!=="unknown"&&o!=="logical";return le`
      <g class="link ${r} k-${o}"
         @mouseenter=${p=>this._showLinkHover(e,p)}
         @mouseleave=${()=>this._hoverLink=void 0}>
        <path class="hit" d=${c}></path>
        <path class="wire" d=${c}></path>
        ${o==="fiber"?le`<path class="core" d=${c}></path>`:h}
        ${d?le`<path class="flow" d=${c}></path>`:h}
        ${l&&r==="up"?le`<circle class="power" r="3.6">
              <animateMotion dur="2.2s" repeatCount="indefinite"
                path=${`M ${l.from.x} ${l.from.y} L ${l.to.x} ${l.to.y}`}></animateMotion>
            </circle>`:h}
      </g>
    `}_renderPorts(e){let t=e.ports[0];if(!t)return h;let{a:s,b:r}=e,o=[this._chip(s,r,t.a,e.poe?.from===s),this._chip(r,s,t.b,e.poe?.from===r)];return ki(o[0].box,o[1].box)&&(o=[this._chip(s,r,t.a,e.poe?.from===s,-1),this._chip(r,s,t.b,e.poe?.from===r,1)]),a`${o.map(l=>l.html)}`}_chip(e,t,s,r,o){let l=Ci(e.x,e.y,t.x-e.x,t.y-e.y,o?4:8),c=s.interface.length*6.6+12+(r?13:0),d=18,p=Math.abs(l.ux)>=Math.abs(l.uy),u=Math.abs(l.ux)<.35?-.5:l.ux>0?0:-1,m=Math.abs(l.uy)<.35?-.5:l.uy>0?0:-1,v=0,y=0;o&&(p?(m=o<0?-1:0,y=o*3):(u=o<0?-1:0,v=o*4));let x=l.x+u*c+v,f=l.y+m*d+y;return{box:{x0:x,y0:f,x1:x+c,y1:f+d},html:a`<div class="port m-${it(s.interface)} ${r?"poe":""}"
        style="left:${l.x+v}px;top:${l.y+y}px;transform:translate(${u*100}%,${m*100}%)"
        title=${r?`${s.interface}: PoE out, powers ${t.name}`:`${s.interface} (${e.name})`}>
        ${r?a`<ha-icon icon="mdi:flash"></ha-icon>`:h}${s.interface}
      </div>`}}_renderComment(e){let{a:t,b:s,link:r}=e;return!r.comment||e.ports.length&&this._config.show_ports?h:a`<div class="comment" style="left:${(t.x+s.x)/2}px;top:${(t.y+s.y)/2}px" title=${r.comment}>
      ${r.comment}
    </div>`}_showLinkHover(e,t){if(this._drag?.moved)return;let s=this.renderRoot.querySelector(".viewport");if(!s)return;let r=s.getBoundingClientRect();this._hoverLink={info:e,x:t.clientX-r.left,y:t.clientY-r.top+14}}_renderLinkTooltip(e){let{info:t}=e,{a:s,b:r,link:o,poe:l,ports:c,endNames:d}=t,p=u=>u.tx||u.rx?a`<span class="mono">↑ ${u.tx??"\u2013"} · ↓ ${u.rx??"\u2013"}</span>`:"\u2013";return a`<div class="tooltip" style="left:${Math.max(8,e.x-150)}px;top:${e.y}px">
      <div class="tt-title">${s.name} ↔ ${r.name}</div>
      ${o.comment?a`<div class="muted">${o.comment}</div>`:h}
      <table>
        <tr><td>Medium</td><td>${Ht[t.kind]}</td></tr>
        ${c.map(u=>a`
            <tr><td>${d[0]}</td><td class="mono">${u.a.interface}</td></tr>
            <tr><td>${d[1]}</td><td class="mono">${u.b.interface}</td></tr>
          `)}
        ${l?a`<tr><td>Power</td><td><ha-icon class="inline poe" icon="mdi:flash"></ha-icon>
              ${l.from===s?d[0]:d[1]} <span class="mono">${l.port}</span>
              powers ${l.to===s?d[0]:d[1]}</td></tr>`:h}
        ${c[0]?a`<tr><td>Traffic</td><td>${d[0]}: ${p(c[0].a)}<br />${d[1]}: ${p(c[0].b)}</td></tr>`:h}
      </table>
    </div>`}_renderNode(e){let t=`left:${e.x-H/2}px;top:${e.y-G/2}px;width:${H}px;height:${G}px`;if(e.kind==="site"){let l=e.site;return a`
        <div class="node site status-${l.status}" style=${t} role="button" tabindex="0"
             aria-label="${e.name}, ${l.online} of ${l.total} online, open layout"
             @click=${()=>this._open(e)} @keydown=${c=>this._onNodeKey(c,e)}
             @mouseenter=${c=>this._showHover(e,c)} @mouseleave=${this._clearHover}
             @focus=${c=>this._showHover(e,c)} @blur=${this._clearHover}>
          <div class="badge"><ha-icon icon=${this._config.icons?.[e.name]??$i}></ha-icon></div>
          <div class="text">
            <div class="name">${e.name}</div>
            <div class="sub"><i class="dot"></i>${l.online}/${l.total} online</div>
          </div>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        </div>
      `}if(e.kind==="unknown"||!e.device)return a`
        <div class="node unknown" style=${t} title="Not a CMR-managed device">
          <div class="badge"><ha-icon icon="mdi:help-network-outline"></ha-icon></div>
          <div class="text"><div class="name">${e.name}</div><div class="sub">Not managed</div></div>
        </div>
      `;let s=e.device,r=$(s),o=this._lit&&!this._lit.has(s.key);return a`
      <div class="node device status-${r} ${s.controller?"controller":""} ${o?"dim":""}" style=${t}
           role="button" tabindex="0" aria-label="${s.identity}, ${A[r]}"
           @click=${()=>this._open(e)} @keydown=${l=>this._onNodeKey(l,e)}
           @mouseenter=${l=>this._showHover(e,l)} @mouseleave=${this._clearHover}
           @focus=${l=>this._showHover(e,l)} @blur=${this._clearHover}>
        ${Y(s)}
        <div class="text">
          <div class="name">${s.identity}</div>
          <div class="sub">${I(s)}</div>
          <div class="ver mono" title=${s.update_available?`${s.version} \u2192 ${s.available_version}`:""}>
            ${s.update_available?a`<span class="up"><ha-icon icon="mdi:arrow-up-circle"></ha-icon>${s.available_version}</span>`:s.version??"\u2013"}
          </div>
        </div>
        ${s.controller?a`<span class="crown" title="CMR controller"><ha-icon icon="mdi:crown-outline"></ha-icon></span>`:h}
        ${s.alerts?.on?a`<span class="count" title="Alerts firing">${s.alerts.on}</span>`:h}
      </div>
    `}_renderTooltip(e){let{node:t}=e,s;if(t.kind==="site"){let r=t.site;s=a`
        <div class="tt-title">${t.name}</div>
        ${r.comment?a`<div class="muted">${r.comment}</div>`:h}
        <div>${r.online} of ${r.total} devices online</div>
        <div class="muted">Click to open this layout</div>
      `}else if(t.device){let r=t.device;s=a`
        <div class="tt-title">${r.identity}${r.controller?a` <span class="chip">controller</span>`:h}</div>
        ${r.product?.image_large?a`<div class="tt-photo"><img src=${r.product.image_large} alt="" referrerpolicy="no-referrer" /></div>`:h}
        <div class="muted">${[I(r),pe(r),r.arch].filter(Boolean).join(" \xB7 ")}</div>
        <table>
          <tr><td>Status</td><td class="status-${$(r)}"><i class="dot"></i> ${A[$(r)]}${q(r)?` (${q(r)})`:""}${r.stale?" \xB7 stale data":""}</td></tr>
          ${r.connected&&r.connected_time!=null?a`<tr><td>Connected</td><td>for ${ce(r.connected_time)}</td></tr>`:h}
          <tr><td>Version</td><td class="mono">${r.version??"\u2013"}${r.prerelease?" (pre-release)":""}</td></tr>
          <tr><td>Channel</td><td>${r.channel??"\u2013"}${r.available_version&&r.available_version!==r.version?a` <span class="muted">(${r.update_available?"update to":"offers"} <span class="mono">${r.available_version}</span>)</span>`:h}</td></tr>
          ${r.address?a`<tr><td>Address</td><td class="mono">${r.address}</td></tr>`:h}
          <tr><td>Uptime</td><td>${ce(r.uptime)}</td></tr>
          ${r.labels.length?a`<tr><td>Labels</td><td>${r.labels.map(o=>a`<span class="chip">${o}</span> `)}</td></tr>`:h}
          ${r.alerts?a`<tr><td>Alerts</td><td>${r.alerts.on} firing of ${r.alerts.total} rules</td></tr>`:h}
        </table>
      `}else return a``;return a`<div class="tooltip" style="left:${Math.max(8,e.x)}px;top:${e.y}px">${s}</div>`}static{this.styles=[M,w`
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
      /* An offline device also loses its colour, so red-dot-offline and amber-dot-alert never look alike. */
      .node.status-offline .badge img, .node.status-offline .badge ha-icon { filter: grayscale(1); opacity: 0.55; }
      .node.status-offline .name { color: var(--cmr-muted); }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--status) 60%, transparent); }
        100% { box-shadow: 0 0 0 9px transparent; }
      }
      .node .text { min-width: 0; flex: 1; }
      .node .name { font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .node .sub { font-size: 11px; color: var(--cmr-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 5px; }
      .node .ver { font-size: 10.5px; color: var(--cmr-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .node .ver .up { color: var(--cmr-update); font-weight: 600; display: inline-flex; align-items: center; gap: 2px; --mdc-icon-size: 12px; }
      .node.controller { border-color: color-mix(in srgb, var(--primary-color) 50%, var(--cmr-line)); }
      .node .crown { position: absolute; top: -10px; right: 10px; color: var(--primary-color); background: var(--cmr-surface); border-radius: 50%; padding: 1px; --mdc-icon-size: 16px; line-height: 0; }
      .node .count {
        position: absolute; top: -8px; left: 32px; min-width: 18px; height: 18px; border-radius: 9px;
        background: var(--cmr-alert); color: #fff; font-size: 11px; font-weight: 700; display: grid; place-items: center; padding: 0 4px;
      }
      .node.site { border-style: dashed; border-width: 1.5px; }
      .node.site .chev { color: var(--cmr-muted); --mdc-icon-size: 20px; }
      .node.unknown { opacity: 0.6; cursor: default; }
      .node.dim { opacity: 0.18; filter: grayscale(1); }
      .node.dim .badge::after { animation: none; }
      .hl {
        display: flex; align-items: center; gap: 8px; margin: 0 16px 8px; padding: 6px 10px; border-radius: 10px;
        font-size: 13px; background: color-mix(in srgb, var(--cmr-alert) 10%, transparent); --mdc-icon-size: 18px;
      }
      .hl > ha-icon { color: var(--cmr-alert); }
      .hl-close { all: unset; cursor: pointer; line-height: 0; color: var(--cmr-muted); border-radius: 50%; padding: 2px; }
      .hl-close:hover { color: var(--primary-text-color); background: var(--cmr-surface-2); }

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
    `]}};var Ei={done:"mdi:check-circle",failed:"mdi:close-circle",processing:"mdi:progress-upload","version check":"mdi:magnify","waiting devices":"mdi:timer-sand",queued:"mdi:tray-full","queued (busy)":"mdi:tray-full",scheduled:"mdi:calendar-clock",cancelled:"mdi:cancel"},Nt=new Set(["processing","version check","waiting devices","queued","queued (busy)"]);function st(n){return(n??"").split(",").map(i=>i.trim()).filter(Boolean)}function Si(n){let[i,e]=(n.success??"").split("/").map(Number);return n.state==="done"&&e&&i<e?"failed":n.state??"scheduled"}function Ai(n){return(n??"").replace(/([a-z])(\d)/g,"$1 $2")}var He=class extends S{setConfig(i){this._config={jobs:5,...i}}static getConfigForm(){return{schema:[z,{name:"title",selector:{text:{}}},{name:"jobs",selector:{number:{min:0,max:30,mode:"box"}}}],computeLabel:L({entry_id:"Controller",title:"Title",jobs:"Recent jobs to show"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){return 6}render(){let i=this._entry;if(!i)return this.renderWaiting();let e=i.devices.filter(r=>r.update_available).length,t=i.upgrade_rules.filter(r=>r.dynamic!=="true"||i.devices.some(o=>o.upgrade_rule===r.name)),s=[...i.upgrade_jobs].sort((r,o)=>(o.schedule_time??"").localeCompare(r.schedule_time??"")).slice(0,this._config.jobs??5);return a`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:update"></ha-icon>
          <span>${this._config.title??"Upgrades"}</span>
          ${e?a`<span class="chip update">${e} available</span>`:a`<span class="chip">up to date</span>`}
        </div>
        ${this.renderStale(i)}

        ${t.length?t.map(r=>this._rule(i,r)):a`<div class="empty small">No upgrade rules. Devices are checked against their channel only.</div>`}

        ${s.length?a`<div class="section section-label">Recent jobs</div>
              <div class="jobs">
                ${s.map(r=>{let o=Si(r),l=o==="failed"?"failed":Nt.has(o)?"running":o==="scheduled"?"scheduled":o==="done"?"done":"other",c=o==="scheduled"&&r.starts_in?`starts in ${Ai(r.starts_in)}`:`${r.schedule_time??""}${r.run_time?` \xB7 took ${r.run_time}`:""}`;return a`<div class="job js-${l}">
                    <ha-icon icon=${Ei[o]??"mdi:circle-outline"} title=${o}></ha-icon>
                    <div class="what">
                      <div><span class="mono">${r.channel??"?"}</span> → ${st(r.labels).join(", ")||"all"}
                        ${Nt.has(o)?a`<span class="chip update">${o}</span>`:h}</div>
                      <div class="muted small">${c}</div>
                    </div>
                    <div class="ok mono">${r.success||(o==="scheduled"?"":"\u2013")}</div>
                  </div>`})}
              </div>`:h}
      </ha-card>
    `}_rule(i,e){let t=i.devices.filter(c=>c.upgrade_rule===e.name),s=st(e.order),r=s.length?s.map(c=>({label:c,devices:t.filter(d=>d.labels.includes(c))})):[{label:st(e.labels).join(", ")||"all",devices:t}],o=new Set(r.flatMap(c=>c.devices.map(d=>d.key))),l=t.filter(c=>!o.has(c.key));return l.length&&r.push({label:"other",devices:l}),a`
      <div class="rule">
        <div class="rule-head">
          <b>${e.name}</b>
          <span class="muted small">
            ${[e.channel&&`channel ${e.channel}`,e.strategy,e.fail_policy&&`on failure: ${e.fail_policy}`].filter(Boolean).join(" \xB7 ")}
          </span>
        </div>
        ${e.comment?a`<div class="muted small comment">${e.comment}</div>`:h}
        <div class="pipeline">
          ${r.map((c,d)=>a`
              ${d?a`<ha-icon class="arrow" icon="mdi:chevron-right"></ha-icon>`:h}
              <div class="step">
                <div class="step-label"><span class="n">${d+1}</span>${c.label}</div>
                <div class="devs">
                  ${c.devices.map(p=>a`<button class="dev status-${$(p)}" title="${p.identity} · ${p.version}"
                      @click=${()=>P(this,p.entities.update)}><ha-icon icon=${Q(p)}></ha-icon></button>`)}
                  ${c.devices.length?h:a`<span class="muted small">none</span>`}
                </div>
              </div>
            `)}
        </div>
      </div>
    `}static{this.styles=[M,w`
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
    `]}};var It="https://github.com/trakais/ha-cmr",Ot=[["cmr-status-card",Me,"CMR status","Controller, devices online, updates and alerts at a glance."],["cmr-topology-card",ze,"CMR topology","Live network map drawn from the controller's CMR layouts."],["cmr-fleet-card",Pe,"CMR devices","Every managed device with model, version, uptime and labels."],["cmr-alerts-card",Ee,"CMR alerts","Alert rules, what is firing, and pushing alerts to Home Assistant."],["cmr-upgrades-card",He,"CMR upgrades","Upgrade rules as a rollout pipeline, plus recent jobs."],["cmr-events-card",Ae,"CMR events","Network timeline from the controller's log and changes, with detected issues."]];function Pi(){for(let[n,i]of Ot)customElements.get(n)||customElements.define(n,i);customElements.get("ll-strategy-dashboard-cmr")||customElements.define("ll-strategy-dashboard-cmr",Te),customElements.get("cmr-strategy-editor")||customElements.define("cmr-strategy-editor",Re)}function Ut(n,i=0){if(customElements.get("home-assistant")||i>=15e3){n();return}setTimeout(()=>Ut(n,i+25),25)}Ut(Pi);window.customCards=window.customCards||[];for(let[n,,i,e]of Ot)window.customCards.some(t=>t.type===n)||window.customCards.push({type:n,name:i,description:e,preview:!1,documentationURL:It});window.customStrategies=window.customStrategies||[];window.customStrategies.some(n=>n.type==="cmr")||window.customStrategies.push({type:"cmr",strategyType:"dashboard",name:"MikroTik CMR network",description:"A complete network dashboard generated from your MikroTik CMR controller: status, topology, devices, alerts and upgrades.",documentationURL:It});var rt=performance.getEntriesByType("resource").find(n=>n.name.includes("/cmr_static/cmr.js")),Li=rt?`fetched ${Math.round(rt.startTime)}\u2013${Math.round(rt.responseEnd)} ms, `:"";console.info("%c CMR %c cards loaded ","background:#3a6ea5;color:#fff;border-radius:3px 0 0 3px","background:#ddd;color:#333;border-radius:0 3px 3px 0",`${Li}script ran at ${Math.round(performance.now())} ms`);var Mi="Timeout waiting for strategy element ll-strategy-dashboard-cmr",nt="cmr-strategy-reloaded";function ot(n,i=0){if(i>12)return!1;if(n instanceof Element&&n.shadowRoot&&ot(n.shadowRoot,i+1))return!0;for(let e of Array.from(n.children))if(!(e.tagName==="SCRIPT"||e.tagName==="STYLE")&&(e.children.length===0&&e.textContent?.includes(Mi)||ot(e,i+1)))return!0;return!1}function jt(n=0){if(!ot(document)){if(n<6)setTimeout(()=>jt(n+1),2e3);else try{sessionStorage.removeItem(nt)}catch{}return}let i=!1;try{i=sessionStorage.getItem(nt)===location.pathname,sessionStorage.setItem(nt,location.pathname)}catch{i=n>0}if(i){console.warn("cmr: the dashboard strategy timed out again after a reload; not retrying");return}console.warn("cmr: the dashboard strategy timed out before this script registered it; reloading once"),location.reload()}jt();
