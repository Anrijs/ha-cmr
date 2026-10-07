var _e=globalThis,be=_e.ShadowRoot&&(_e.ShadyCSS===void 0||_e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Je=Symbol(),wt=new WeakMap,ae=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==Je)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(be&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=wt.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&wt.set(e,s))}return s}toString(){return this.cssText}},kt=r=>new ae(typeof r=="string"?r:r+"",void 0,Je),E=(r,...s)=>{let e=r.length===1?r[0]:s.reduce((t,i,n)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new ae(e,r,Je)},Ct=(r,s)=>{if(be)r.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),i=_e.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,r.appendChild(t)}},Xe=be?r=>r:r=>r instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return kt(e)})(r):r;var{is:gi,defineProperty:fi,getOwnPropertyDescriptor:_i,getOwnPropertyNames:bi,getOwnPropertySymbols:yi,getPrototypeOf:xi}=Object,ye=globalThis,Et=ye.trustedTypes,$i=Et?Et.emptyScript:"",wi=ye.reactiveElementPolyfillSupport,le=(r,s)=>r,Ze={toAttribute(r,s){switch(s){case Boolean:r=r?$i:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,s){let e=r;switch(s){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Mt=(r,s)=>!gi(r,s),St={attribute:!0,type:String,converter:Ze,reflect:!1,useDefault:!1,hasChanged:Mt};Symbol.metadata??=Symbol("metadata"),ye.litPropertyMetadata??=new WeakMap;var B=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=St){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(s,t,e);i!==void 0&&fi(this.prototype,s,i)}}static getPropertyDescriptor(s,e,t){let{get:i,set:n}=_i(this.prototype,s)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let a=i?.call(this);n?.call(this,o),this.requestUpdate(s,a,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??St}static _$Ei(){if(this.hasOwnProperty(le("elementProperties")))return;let s=xi(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(le("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(le("properties"))){let e=this.properties,t=[...bi(e),...yi(e)];for(let i of t)this.createProperty(i,e[i])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let i of t)e.unshift(Xe(i))}else s!==void 0&&e.push(Xe(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ct(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),i=this.constructor._$Eu(s,t);if(i!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:Ze).toAttribute(e,t.type);this._$Em=s,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(s,e){let t=this.constructor,i=t._$Eh.get(s);if(i!==void 0&&this._$Em!==i){let n=t.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Ze;this._$Em=i;let a=o.fromAttribute(e,n.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(s,e,t,i=!1,n){if(s!==void 0){let o=this.constructor;if(i===!1&&(n=this[s]),t??=o.getPropertyOptions(s),!((t.hasChanged??Mt)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(s)&&!this.hasAttribute(o._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:i,wrapped:n},o){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,o??e??this[s]),n!==!0||o!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),i===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,n]of t){let{wrapped:o}=n,a=this[i];o!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,n,a)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};B.elementStyles=[],B.shadowRootOptions={mode:"open"},B[le("elementProperties")]=new Map,B[le("finalized")]=new Map,wi?.({ReactiveElement:B}),(ye.reactiveElementVersions??=[]).push("2.1.2");var rt=globalThis,Pt=r=>r,xe=rt.trustedTypes,Rt=xe?xe.createPolicy("lit-html",{createHTML:r=>r}):void 0,Nt="$lit$",V=`lit$${Math.random().toFixed(9).slice(2)}$`,Ht="?"+V,ki=`<${Ht}>`,J=document,de=()=>J.createComment(""),pe=r=>r===null||typeof r!="object"&&typeof r!="function",ot=Array.isArray,Ci=r=>ot(r)||typeof r?.[Symbol.iterator]=="function",Qe=`[ 	
\f\r]`,ce=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,At=/-->/g,Lt=/>/g,Y=RegExp(`>|${Qe}(?:([^\\s"'>=/]+)(${Qe}*=${Qe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Tt=/'/g,Dt=/"/g,It=/^(?:script|style|textarea|title)$/i,at=r=>(s,...e)=>({_$litType$:r,strings:s,values:e}),c=at(1),N=at(2),Ps=at(3),X=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),zt=new WeakMap,G=J.createTreeWalker(J,129);function Ot(r,s){if(!ot(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Rt!==void 0?Rt.createHTML(s):s}var Ei=(r,s)=>{let e=r.length-1,t=[],i,n=s===2?"<svg>":s===3?"<math>":"",o=ce;for(let a=0;a<e;a++){let l=r[a],d,h,u=-1,m=0;for(;m<l.length&&(o.lastIndex=m,h=o.exec(l),h!==null);)m=o.lastIndex,o===ce?h[1]==="!--"?o=At:h[1]!==void 0?o=Lt:h[2]!==void 0?(It.test(h[2])&&(i=RegExp("</"+h[2],"g")),o=Y):h[3]!==void 0&&(o=Y):o===Y?h[0]===">"?(o=i??ce,u=-1):h[1]===void 0?u=-2:(u=o.lastIndex-h[2].length,d=h[1],o=h[3]===void 0?Y:h[3]==='"'?Dt:Tt):o===Dt||o===Tt?o=Y:o===At||o===Lt?o=ce:(o=Y,i=void 0);let g=o===Y&&r[a+1].startsWith("/>")?" ":"";n+=o===ce?l+ki:u>=0?(t.push(d),l.slice(0,u)+Nt+l.slice(u)+V+g):l+V+(u===-2?a:g)}return[Ot(r,n+(r[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},he=class r{constructor({strings:s,_$litType$:e},t){let i;this.parts=[];let n=0,o=0,a=s.length-1,l=this.parts,[d,h]=Ei(s,e);if(this.el=r.createElement(d,t),G.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=G.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(Nt)){let m=h[o++],g=i.getAttribute(u).split(V),v=/([.?@])?(.*)/.exec(m);l.push({type:1,index:n,name:v[2],strings:g,ctor:v[1]==="."?tt:v[1]==="?"?it:v[1]==="@"?st:se}),i.removeAttribute(u)}else u.startsWith(V)&&(l.push({type:6,index:n}),i.removeAttribute(u));if(It.test(i.tagName)){let u=i.textContent.split(V),m=u.length-1;if(m>0){i.textContent=xe?xe.emptyScript:"";for(let g=0;g<m;g++)i.append(u[g],de()),G.nextNode(),l.push({type:2,index:++n});i.append(u[m],de())}}}else if(i.nodeType===8)if(i.data===Ht)l.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(V,u+1))!==-1;)l.push({type:7,index:n}),u+=V.length-1}n++}}static createElement(s,e){let t=J.createElement("template");return t.innerHTML=s,t}};function ie(r,s,e=r,t){if(s===X)return s;let i=t!==void 0?e._$Co?.[t]:e._$Cl,n=pe(s)?void 0:s._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(s=ie(r,i._$AS(r,s.values),i,t)),s}var et=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,i=(s?.creationScope??J).importNode(e,!0);G.currentNode=i;let n=G.nextNode(),o=0,a=0,l=t[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new ue(n,n.nextSibling,this,s):l.type===1?d=new l.ctor(n,l.name,l.strings,this,s):l.type===6&&(d=new nt(n,this,s)),this._$AV.push(d),l=t[++a]}o!==l?.index&&(n=G.nextNode(),o++)}return G.currentNode=J,i}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},ue=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=ie(this,s,e),pe(s)?s===p||s==null||s===""?(this._$AH!==p&&this._$AR(),this._$AH=p):s!==this._$AH&&s!==X&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):Ci(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==p&&pe(this._$AH)?this._$AA.nextSibling.data=s:this.T(J.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,i=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=he.createElement(Ot(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new et(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(s){let e=zt.get(s.strings);return e===void 0&&zt.set(s.strings,e=new he(s)),e}k(s){ot(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let n of s)i===e.length?e.push(t=new r(this.O(de()),this.O(de()),this,this.options)):t=e[i],t._$AI(n),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=Pt(s).nextSibling;Pt(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},se=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,i,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=s,this.name=e,this._$AM=i,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(s,e=this,t,i){let n=this.strings,o=!1;if(n===void 0)s=ie(this,s,e,0),o=!pe(s)||s!==this._$AH&&s!==X,o&&(this._$AH=s);else{let a=s,l,d;for(s=n[0],l=0;l<n.length-1;l++)d=ie(this,a[t+l],e,l),d===X&&(d=this._$AH[l]),o||=!pe(d)||d!==this._$AH[l],d===p?s=p:s!==p&&(s+=(d??"")+n[l+1]),this._$AH[l]=d}o&&!i&&this.j(s)}j(s){s===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},tt=class extends se{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===p?void 0:s}},it=class extends se{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==p)}},st=class extends se{constructor(s,e,t,i,n){super(s,e,t,i,n),this.type=5}_$AI(s,e=this){if((s=ie(this,s,e,0)??p)===X)return;let t=this._$AH,i=s===p&&t!==p||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,n=s!==p&&(t===p||i);i&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},nt=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){ie(this,s)}};var Si=rt.litHtmlPolyfillSupport;Si?.(he,ue),(rt.litHtmlVersions??=[]).push("3.3.3");var Ut=(r,s,e)=>{let t=e?.renderBefore??s,i=t._$litPart$;if(i===void 0){let n=e?.renderBefore??null;t._$litPart$=i=new ue(s.insertBefore(de(),n),n,void 0,e??{})}return i._$AI(r),i};var lt=globalThis,H=class extends B{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=Ut(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return X}};H._$litElement$=!0,H.finalized=!0,lt.litElementHydrateSupport?.({LitElement:H});var Mi=lt.litElementPolyfillSupport;Mi?.({LitElement:H});(lt.litElementVersions??=[]).push("4.2.2");function Ft(r){return r?.message??String(r)}var ct=class{constructor(){this.listeners=new Set;this.topology=new Map}subscribe(s,e){return this.listeners.add(e),this.latest&&e(this.latest),this.unsubscribe||(this.unsubscribe=s.connection.subscribeMessage(t=>{let i=t.entries.map(n=>this._hydrate(n));this.latest=i,this.listeners.forEach(n=>n(i))},{type:"cmr/subscribe"}),this.unsubscribe.catch(t=>{console.error("cmr: subscription failed",t),this.unsubscribe=void 0,this.listeners.forEach(i=>i([],Ft(t)))})),()=>{if(this.listeners.delete(e),this.listeners.size===0&&this.unsubscribe){let t=this.unsubscribe;this.unsubscribe=void 0,this.latest=void 0,this.topology.clear(),t.then(i=>i()).catch(()=>{})}}}_hydrate(s){let{products:e={},...t}=s,i=t.devices.map(({product:o,product_ambiguous:a,...l})=>({...l,product:o&&e[o]?{...e[o],...a?{ambiguous:!0}:{}}:null}));if(t.layouts&&t.nodes)return this.topology.set(t.entry_id,{layouts:t.layouts,nodes:t.nodes}),{...t,devices:i,layouts:t.layouts,nodes:t.nodes};let n=this.topology.get(t.entry_id)??{layouts:[],nodes:[]};return{...t,devices:i,...n}}once(s){return this.latest?Promise.resolve(this.latest):new Promise((e,t)=>{let i,n=!1;i=this.subscribe(s,(o,a)=>{n||(n=!0,queueMicrotask(()=>i?.()),a?t(new Error(a)):e(o))})})}},we=new ct;function ke(r,s){if(r?.length)return s?r.find(e=>e.entry_id===s):r[0]}var jt=new Map,Pi=3e4;async function Ri(r,s,e){let t=`${s}/${e}`,i=jt.get(t);if(i&&Date.now()-i.at<Pi)return i.keys;let n=await r.connection.sendMessagePromise({type:"cmr/alert_devices",entry_id:s,rule_id:e});return jt.set(t,{at:Date.now(),keys:n.devices}),n.devices}var j=class{constructor(s){this.onChange=s;this.state=new Map;this.stale=new Set}get(s,e,t){let i=`${e}/${t}`,n=this.state.get(i);return n!==void 0&&!this.stale.has(i)?n:(this.stale.delete(i),n===void 0&&this.state.set(i,"loading"),Ri(s,e,t).then(o=>this.state.set(i,o)).catch(o=>this.state.set(i,o?.code==="unsupported"?"unsupported":"error")).finally(()=>this.onChange()),this.state.get(i))}invalidate(){for(let s of this.state.keys())this.stale.add(s)}},$e=class{constructor(s){this.onChange=s;this.state=new Map}get(s,e,t){let i=`${e}/${t.id}`,n=[t.state,t.success,t.start_time,t.end_time].join("|"),o=this.state.get(i);if(o?.version===n)return o.value;let a=o?.value??"loading";return this.state.set(i,{version:n,value:a}),s.connection.sendMessagePromise({type:"cmr/job_devices",entry_id:e,job_id:t.id}).then(l=>this.state.set(i,{version:n,value:l.devices})).catch(l=>this.state.set(i,{version:n,value:l?.code==="unsupported"?"unsupported":"error"})).finally(()=>this.onChange()),a}};function Kt(r,s,e,t){return r.connection.sendMessagePromise({type:"cmr/job_action",entry_id:s,job_id:e,action:t})}function Ce(r,s,e){return r.connection.sendMessagePromise({type:"cmr/issue_dismiss",entry_id:s,key:e})}var dt=class{constructor(s){this.entryId=s;this.listeners=new Set;this.events=[];this.issues=[];this.loaded=!1}subscribe(s,e){return this.listeners.add(e),this.loaded&&e(this.events,this.issues),this.unsubscribe||(this.unsubscribe=s.connection.subscribeMessage(t=>{this.events=t.reset?t.events:[...this.events,...t.events].slice(-1e3),this.issues=t.issues,this.loaded=!0,this.listeners.forEach(i=>i(this.events,this.issues))},{type:"cmr/events/subscribe",limit:1e3,...this.entryId?{entry_id:this.entryId}:{}}),this.unsubscribe.catch(t=>{console.error("cmr: events subscription failed",t),this.unsubscribe=void 0,this.listeners.forEach(i=>i([],[],Ft(t)))})),()=>{if(this.listeners.delete(e),this.listeners.size===0&&this.unsubscribe){let t=this.unsubscribe;this.unsubscribe=void 0,this.loaded=!1,this.events=[],t.then(i=>i()).catch(()=>{})}}}},pt=class{constructor(){this.feeds=new Map}subscribe(s,e,t){let i=e??"",n=this.feeds.get(i);return n||(n=new dt(e),this.feeds.set(i,n)),n.subscribe(s,t)}},Ee=new pt;function ne(r){return r.controller?"mdi:router-network":"mdi:router"}function C(r){return r.pending||r.remote_pending?"pending":r.connected?r.alerts?.on?"alert":r.update_available?"update":"ok":"offline"}function Z(r){return r.pending?"approve on the controller":r.remote_pending?"approve on the device":""}var re=["offline","pending","alert","update","ok"];async function Se(r,s,e){await r.connection.sendMessagePromise({type:"cmr/pair",entry_id:s,device_key:e})}function Me(r,s){return s?[r.identity,r.board,r.model_code,r.address,r.version,...r.labels].filter(Boolean).join(" ").toLowerCase().includes(s):!0}function Pe(){let r=new URLSearchParams(window.location.search),s=r.get("cmr_status");return{status:s&&re.includes(s)?s:void 0,version:r.get("cmr_version")??void 0,search:r.get("cmr_search")??void 0,alert:r.get("cmr_alert")??void 0}}function O(r,s={}){let e=window.location.pathname.split("/")[1]||"lovelace",t=Object.entries(s).filter(i=>!!i[1]).map(([i,n])=>`${i}=${encodeURIComponent(n)}`).join("&");return`/${e}/${r}${t?`?${t}`:""}`}var L={ok:"OK",update:"Update available",alert:"Alert active",pending:"Waiting to pair",offline:"Disconnected"};function me(r){if(r==null)return"\u2013";let s=Math.floor(r/86400),e=Math.floor(r%86400/3600),t=Math.floor(r%3600/60);return s?`${s}d ${e}h`:e?`${e}h ${t}m`:t?`${t}m`:`${Math.floor(r)}s`}function F(r,s){return r.controller!==s.controller?r.controller?-1:1:r.identity.localeCompare(s.identity)}async function Wt(r){try{if(navigator.clipboard)return await navigator.clipboard.writeText(r),!0}catch{}let s=document.createElement("textarea");s.value=r,s.setAttribute("readonly",""),s.style.position="fixed",s.style.opacity="0",document.body.appendChild(s),s.select();let e=!1;try{e=document.execCommand("copy")}catch{e=!1}return s.remove(),e}function ht(r,s,e){r.dispatchEvent(new CustomEvent(s,{detail:e,bubbles:!0,composed:!0}))}function P(r,s){s&&ht(r,"hass-more-info",{entityId:s})}function R(r){history.pushState(null,"",r),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}function ve(r,s="never"){if(!r)return s;let e=Math.max(0,(Date.now()-new Date(r).getTime())/1e3);return e<10?"just now":e<60?`${Math.round(e)} s ago`:e<3600?`${Math.round(e/60)} min ago`:e<86400?`${Math.round(e/3600)} h ago`:`${Math.round(e/86400)} d ago`}function Bt(r){return r.includes(":")&&!r.startsWith("[")?`http://[${r}]`:`http://${r}`}var I={name:"entry_id",selector:{config_entry:{integration:"cmr"}}};function T(r){return s=>r[s.name]}var A=class extends H{static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0},_error:{state:!0}}}setConfig(s){this._config=s}static getStubConfig(){return{}}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribeStore&&this._subscribeStore()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeStore?.(),this._unsubscribeStore=void 0,window.clearInterval(this._staleTicker),this._staleTicker=void 0}willUpdate(s){s.has("hass")&&this.hass&&!this._unsubscribeStore&&this.isConnected&&this._subscribeStore()}_subscribeStore(){this._unsubscribeStore=we.subscribe(this.hass,(s,e)=>{this._error=e,this._entry=ke(s,this._config?.entry_id);let t=!!this._entry&&!this._entry.available;t&&!this._staleTicker&&(this._staleTicker=window.setInterval(()=>this.requestUpdate(),3e4)),!t&&this._staleTicker&&(window.clearInterval(this._staleTicker),this._staleTicker=void 0)})}renderWaiting(s=""){let e=this._error?`Can't read CMR data from Home Assistant (${this._error}). Reload the page.`:"Waiting for the CMR controller\u2026";return c`<ha-card><div class="empty" style=${s}>${e}</div></ha-card>`}renderStale(s){return s.available?p:c`<div class="stale">
      <ha-icon icon="mdi:lan-disconnect"></ha-icon>Controller unreachable · showing data from ${ve(s.last_update)}
    </div>`}},D=E`
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
  /* Product photos sit on a light "pedestal" in every theme.
     White devices need contrast on light cards. */
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
`;function Q(r,s=""){return r.product?.image?c`<div class="badge photo ${s}" title=${r.product.name}>
      <img src=${r.product.image} alt=${r.product.name} loading="lazy" referrerpolicy="no-referrer"
        @error=${e=>e.target.parentElement.classList.add("broken")} />
      <ha-icon icon=${ne(r)}></ha-icon>
    </div>`:c`<div class="badge ${s}"><ha-icon icon=${ne(r)}></ha-icon></div>`}function q(r){return(r.product&&!r.product.ambiguous?r.product:void 0)?.name??r.board??"Device"}function ge(r){return r.product&&!r.product.ambiguous?r.product.code:r.model_code}function Re(r,s,e,t,i,n=12){let o;if(e.kind==="event")o=c`<div class="muted small">
      An event alert: it runs its actions each time it happens (${e.fired}× so far) and never stays
      active, so no device is listed here. Its occurrences show in the events timeline.
      ${e.scope==="system"?" It reports a whole upgrade job, not a single device.":p}
    </div>`;else if(e.devices_on===0)o=c`<div class="muted small">Not active on any device right now.</div>`;else if(!s.console||t==="unsupported")o=c`<div class="muted small">
      The controller lists these devices only on its console, and this REST user may not run console commands.
    </div>`;else if(t==="loading")o=c`<div class="muted small">Asking the controller…</div>`;else if(t==="error")o=c`<div class="muted small">Couldn't read the device list from the controller.</div>`;else{let l=new Map(s.devices.map(u=>[u.key,u])),d=t.map(u=>l.get(u)).filter(u=>!!u).sort(F),h=d.slice(0,n);o=c`
      <div class="rd-list">
        ${h.map(u=>c`<button class="rd-dev status-${C(u)}" title=${L[C(u)]}
            @click=${()=>P(r,u.entities.connected)}><i class="dot"></i>${u.identity}</button>`)}
        ${d.length>h.length?c`<span class="muted small">+${d.length-h.length} more</span>`:p}
        ${d.length?p:c`<span class="muted small">Active on devices this Home Assistant doesn't list yet.</span>`}
      </div>`}let a={cmr_alert:e.id};return c`<div class="rd">
    ${o}
    ${e.devices_on>0&&(i?.devices||i?.topology)?c`<div class="rd-links">
          ${i?.devices?c`<button class="rd-link" @click=${()=>R(O(i.devices,a))}>
                <ha-icon icon="mdi:table"></ha-icon>Show in Devices</button>`:p}
          ${i?.topology?c`<button class="rd-link" @click=${()=>R(O(i.topology,a))}>
                <ha-icon icon="mdi:sitemap-outline"></ha-icon>Show on map</button>`:p}
        </div>`:p}
  </div>`}var Ae=E`
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
`;var qt=["critical","high","medium","low"],Vt={critical:"mdi:alert-octagon",high:"mdi:alert",medium:"mdi:alert-circle-outline",low:"mdi:information-outline"},Le=class extends A{constructor(){super();this._ruleDevices=new j(()=>this.requestUpdate());this._only="",this._open=""}static{this.properties={_setup:{state:!0},_copied:{state:!0},_push:{state:!0},_only:{state:!0},_open:{state:!0}}}willUpdate(e){super.willUpdate(e),e.has("_entry")&&this._ruleDevices.invalidate()}async _pushAlerts(e){this._push="busy";try{let t=await this.hass.connection.sendMessagePromise({type:"cmr/alert_push",entry_id:this._entry.entry_id,enable:e}),i=e?"now push to Home Assistant":"no longer push";this._push=`${t.done} rule${t.done===1?"":"s"} ${i}`+(t.failures.length?`; failed: ${t.failures.join("; ")}`:"")}catch(t){this._push=t?.message??String(t)}}static getConfigForm(){return{schema:[I,{name:"title",selector:{text:{}}},{name:"hide_disabled",selector:{boolean:{}}}],computeLabel:T({entry_id:"Controller",title:"Title",hide_disabled:"Hide disabled rules"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){return 2+(this._entry?.alerts.length??4)}async _toggleSetup(){if(this._setup!==void 0){this._setup=void 0;return}this._setup=null;try{this._setup=await this.hass.connection.sendMessagePromise({type:"cmr/alert_setup",entry_id:this._entry.entry_id})}catch(e){console.error("cmr: alert setup",e),this._setup=void 0}}async _copy(){this._setup&&await Wt(this._setup.script)&&(this._copied=!0,setTimeout(()=>this._copied=!1,1800))}render(){let e=this._entry;if(!e)return this.renderWaiting();let t=e.alerts.filter(g=>!(this._config.hide_disabled&&g.disabled)),i={firing:t.filter(g=>g.devices_on>0).length,disabled:t.filter(g=>g.disabled).length,pushing:t.filter(g=>g.webhook_ha).length},n=t.filter(g=>this._only==="firing"?g.devices_on>0:this._only==="disabled"?g.disabled:this._only==="pushing"?g.webhook_ha:!0).sort((g,v)=>+(v.devices_on>0)-+(g.devices_on>0)||Number(g.disabled)-Number(v.disabled)||qt.indexOf(g.severity)-qt.indexOf(v.severity)||g.name.localeCompare(v.name)),o=n.filter(g=>g.devices_on>0).length,a=e.alerts.filter(g=>g.webhook_ha).length,l=e.alerts.filter(g=>g.webhook_outdated).length,d=e.actions&&!!this.hass.user?.is_admin,h=e.fleet_entities.fleet_alert,u=h?this.hass.states[h]:void 0,m=u?.attributes??{};return c`
      <ha-card>
        <div class="card-header">
          <ha-icon icon=${o?"mdi:bell-alert":"mdi:bell-check-outline"}></ha-icon>
          <span>${this._config.title??"Alerts"}</span>
          ${o?c`<span class="chip alert">${o} active</span>`:c`<span class="chip">all quiet</span>`}
          <div class="spacer"></div>
        </div>
        ${this.renderStale(e)}
        ${t.length>3?c`<div class="filters">
              <button class="pill ${this._only?"":"on"}" @click=${()=>this._only=""}>All ${t.length}</button>
              ${i.firing?c`<button class="pill hot ${this._only==="firing"?"on":""}" @click=${()=>this._only=this._only==="firing"?"":"firing"}>
                  <ha-icon icon="mdi:bell-alert-outline"></ha-icon>Active ${i.firing}</button>`:p}
              ${i.pushing?c`<button class="pill ${this._only==="pushing"?"on":""}" @click=${()=>this._only=this._only==="pushing"?"":"pushing"}>
                  <ha-icon icon="mdi:webhook"></ha-icon>Pushing ${i.pushing}</button>`:p}
              ${i.disabled?c`<button class="pill ${this._only==="disabled"?"on":""}" @click=${()=>this._only=this._only==="disabled"?"":"disabled"}>
                  <ha-icon icon="mdi:bell-off-outline"></ha-icon>Disabled ${i.disabled}</button>`:p}
            </div>`:p}

        ${u&&u.state!=="unknown"&&u.state!=="unavailable"?c`<button class="last sev-${m.event_type}" @click=${()=>P(this,h)}>
              <ha-icon icon=${Vt[m.event_type]??"mdi:bell"}></ha-icon>
              <div>
                <div><b>${m.alert}</b>${m.device?c` · ${m.device}`:p}</div>
                <div class="muted small">Last pushed alert · ${ve(u.state,"")}</div>
              </div>
            </button>`:p}

        <div class="rules">
          ${n.map(g=>this._rule(g,e))}
          ${n.length?p:c`<div class="empty">${t.length?"No rules match this filter.":"No alert rules on the controller."}</div>`}
        </div>

        ${this.hass.user?.is_admin?c`<div class="footer">
              ${d?c`<div class="push">
                    <ha-icon icon="mdi:webhook"></ha-icon>
                    <span class="small">${a?`${a} of ${e.alerts.length} rules push to Home Assistant`:"Alerts reach Home Assistant on the next poll only"}</span>
                    <button class="copy" ?disabled=${this._push==="busy"} @click=${()=>this._pushAlerts(a<e.alerts.length)}>
                      ${this._push==="busy"?"Working\u2026":a<e.alerts.length?"Push alerts to Home Assistant":"Stop pushing"}
                    </button>
                    ${l&&a===e.alerts.length&&this._push!=="busy"?c`<button class="copy" title="Adds upgrade results, job counts and interface changes to the pushed alerts"
                          @click=${()=>this._pushAlerts(!0)}>Update ${l} rule${l===1?"":"s"}</button>`:p}
                    ${this._push&&this._push!=="busy"?c`<div class="muted small">${this._push}</div>`:p}
                  </div>`:c`<button class="link" @click=${this._toggleSetup}>
                      <ha-icon icon="mdi:webhook"></ha-icon>
                      ${a?`${a} of ${e.alerts.length} rules push to Home Assistant`:"Push alerts to Home Assistant instantly"}
                      <ha-icon icon=${this._setup!==void 0?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                    </button>
                    ${this._setup===null?c`<div class="muted small">Loading…</div>`:p}
                    ${this._setup?c`<div class="setup">
                          <div class="small">Paste into the controller's terminal. Each alert rule gets an HTTP action that calls Home Assistant; edit <code>find</code> to choose rules. (With <i>Allow actions on the controller</i> in the options this becomes one click.)</div>
                          <pre>${this._setup.script}</pre>
                          <button class="copy" @click=${this._copy}>
                            <ha-icon icon=${this._copied?"mdi:check":"mdi:content-copy"}></ha-icon>${this._copied?"Copied":"Copy script"}
                          </button>
                        </div>`:p}`}
            </div>`:p}
      </ha-card>
    `}_rule(e,t){let i=e.devices_on>0,n=this._open===e.id;return c`
      <button class="rule sev-${e.severity} ${i?"on":""} ${e.disabled?"disabled":""} ${n?"open":""}"
              aria-expanded=${n} @click=${()=>this._open=n?"":e.id}>
        <span class="stripe"></span>
        <ha-icon class="sev" icon=${Vt[e.severity]}></ha-icon>
        <div class="body">
          <div class="title">
            <span class="name">${e.name}</span>
            ${e.webhook?c`<ha-icon class="hook" icon="mdi:webhook" title=${e.webhook_ha?"Pushes to Home Assistant":"Pushes to another webhook"}></ha-icon>`:p}
          </div>
          <div class="muted small">
            ${e.disabled?"disabled \xB7 ":p}${e.kind==="event"?"event \xB7 ":p}${e.categories.join(", ")||"uncategorised"} ·
            ${e.scope==="system"?"upgrade jobs":e.labels.join(", ")||"all"}
          </div>
        </div>
        ${e.kind==="event"?c`<div class="nums" title="An event alert fires per occurrence and never stays active">
              <div>${e.fired}×</div>
              <div class="muted small">fired</div>
            </div>`:c`<div class="nums">
              <div class=${i?"hot":""} title="Active on / covered devices">${e.devices_on}/${e.devices}</div>
              <div class="muted small" title="Times fired">${e.fired}×</div>
            </div>`}
        ${e.entity_id?c`<span class="info" role="button" title="Entity details"
              @click=${o=>{o.stopPropagation(),P(this,e.entity_id)}}>
              <ha-icon icon="mdi:information-outline"></ha-icon></span>`:p}
      </button>
      ${n?Re(this,t,e,i?this._ruleDevices.get(this.hass,t.entry_id,e.id):[],this._config.views):p}
    `}static{this.styles=[D,Ae,E`
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
    `]}};var Ai=new Set(["insight","device","alert","upgrade","security","config"]),Li=r=>r.notable??(Ai.has(r.category)||r.severity==="warning"||r.severity==="error"),Te={insight:{icon:"mdi:stethoscope",label:"Issues"},device:{icon:"mdi:router-network",label:"Devices"},alert:{icon:"mdi:bell-outline",label:"Alerts"},upgrade:{icon:"mdi:update",label:"Upgrades"},wifi:{icon:"mdi:wifi",label:"Wi-Fi"},link:{icon:"mdi:ethernet",label:"Links"},security:{icon:"mdi:shield-alert-outline",label:"Security"},login:{icon:"mdi:account-key-outline",label:"Logins"},config:{icon:"mdi:cog-outline",label:"Config"},dhcp:{icon:"mdi:ip-network-outline",label:"DHCP"},system:{icon:"mdi:cog-transfer-outline",label:"System"},api:{icon:"mdi:api",label:"API logins"}},Yt={icon:"mdi:text-box-outline",label:"Other"};function Gt(r){return Te[r]?Te[r]:r?{...Yt,label:r[0].toUpperCase()+r.slice(1)}:Yt}function Ti(r){let s=r.data?.event;return r.category==="wifi"?s==="disconnected"?"mdi:wifi-off":s==="roamed"?"mdi:wifi-sync":"mdi:wifi-plus":r.category==="link"?r.data?.state==="down"?"mdi:ethernet-off":"mdi:ethernet":r.category==="device"?s==="disconnected"?"mdi:lan-disconnect":s==="rebooted"?"mdi:restart":"mdi:lan-connect":r.category==="insight"&&s==="resolved"?"mdi:check-circle-outline":Gt(r.category).icon}function Di(r){return r.replace(/\b[0-9A-Fa-f]{2}(?::[0-9A-Fa-f]{2}){5}\b/g,"<mac>").replace(/\b\d{1,3}(?:\.\d{1,3}){3}(?:\/\d+)?(?::\d+)?\b/g,"<ip>").replace(/\b[0-9a-f]*:[0-9a-f:]+:[0-9a-f]*\b/gi,"<ip6>").replace(/\d+/g,"#")}function zi(r){let s=r.data??{},e=s.mac??s.interface??s.user??s.rule_id??s.key??Di(r.title);return`${r.category}|${r.device_key??""}|${String(e)}`}var Ni=864e5,De=class extends H{constructor(){super();this._loaded=!1;this._events=[],this._issues=[],this._category="",this._device="",this._search="",this._open=new Set,this._limit=50}static{this.properties={hass:{attribute:!1},_config:{state:!0},_events:{state:!0},_issues:{state:!0},_category:{state:!0},_device:{state:!0},_search:{state:!0},_open:{state:!0},_limit:{state:!0},_notable:{state:!0}}}setConfig(e){this._unsubscribe&&e.entry_id!==this._config?.entry_id&&(this._unsubscribe(),this._unsubscribe=void 0,this._loaded=!1),this._config={show_issues:!0,show_filters:!0,hide_categories:["api"],max_items:50,...e},!this._unsubscribe&&this.hass&&this.isConnected&&this._subscribe(),this._limit=this._config.max_items??50,this._device=e.device??"",this._notable=!!e.notable}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"title",selector:{text:{}}},{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"device",selector:{text:{}}},{name:"max_items",selector:{number:{min:5,max:500,mode:"box"}}},{name:"notable",selector:{boolean:{}}},{name:"show_issues",selector:{boolean:{}}},{name:"show_filters",selector:{boolean:{}}}],computeLabel:e=>({title:"Title",entry_id:"Controller (default: all)",device:"Only this device (identity)",max_items:"Rows to show",notable:"Start with notable events only",show_issues:"Show detected issues",show_filters:"Show filters"})[e.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=Ee.subscribe(this.hass,this._config?.entry_id,(e,t,i)=>{this._events=e,this._issues=t,this._error=i,this._loaded=!0})}_visible(){let e=this._config,t=this._search.trim().toLowerCase(),i=new Set(e.hide_categories??[]),n=this._deviceFilter();return this._events.filter(o=>{if(this._notable&&!this._category&&!Li(o))return!1;if(this._category){if(o.category!==this._category)return!1}else if(e.categories?.length?!e.categories.includes(o.category):i.has(o.category))return!1;return!(!n(o.device_name)||t&&!`${o.title} ${o.message} ${o.device_name??""}`.toLowerCase().includes(t))})}_deviceFilter(){let e=this._device.trim();if(!e)return()=>!0;if(this._events.some(i=>i.device_name===e))return i=>i===e;let t=e.toLowerCase();return i=>!!i&&i.toLowerCase().includes(t)}_rows(e){let t=[];for(let i=e.length-1;i>=0;i--){let n=e[i],o=zi(n),a=t[t.length-1],l=a&&new Date(a.events[0].time).toDateString()===new Date(n.time).toDateString();a&&a.key===o&&l&&n.category!=="insight"?a.events.push(n):t.push({key:o,events:[n]})}return t}_toggle(e){let t=new Set(this._open);t.has(e)?t.delete(e):t.add(e),this._open=t}render(){if(!this._loaded)return c`<ha-card><div class="empty">Loading network events…</div></ha-card>`;if(this._error)return c`<ha-card><div class="empty">Can't read CMR events from Home Assistant (${this._error}). Reload the page.</div></ha-card>`;let e=this._config,t=this._visible(),i=this._rows(t),n=i.slice(0,this._limit),o=[...new Set(this._events.map(d=>d.category))].sort((d,h)=>Object.keys(Te).indexOf(d)-Object.keys(Te).indexOf(h)),a=[...new Set(this._events.map(d=>d.device_name).filter(Boolean))].sort(),l=this._issues.filter(d=>this._deviceFilter()(d.device_name));return c`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:timeline-text-outline"></ha-icon>
          <span>${e.title??"Network events"}</span>
          ${l.length?c`<span class="chip alert">${l.length} issue${l.length>1?"s":""}</span>`:c`<span class="chip">no issues</span>`}
        </div>

        ${e.show_issues&&l.length?c`<div class="issues">${l.map(d=>this._issue(d))}</div>`:p}

        ${e.show_filters?c`<div class="filters">
              <div class="cats">
                <button class="pill ${!this._category&&this._notable?"on":""}"
                  @click=${()=>{this._category="",this._notable=!0}}>
                  <ha-icon icon="mdi:star-four-points-outline"></ha-icon>Notable</button>
                <button class="pill ${!this._category&&!this._notable?"on":""}"
                  @click=${()=>{this._category="",this._notable=!1}}>All</button>
                ${o.map(d=>{let h=Gt(d);return c`<button class="pill ${this._category===d?"on":""}" @click=${()=>this._category=this._category===d?"":d}>
                    <ha-icon icon=${h.icon}></ha-icon>${h.label}
                  </button>`})}
              </div>
              <div class="find">
                <input class="device" type="search" list="cmr-event-devices" placeholder="All devices"
                  aria-label="Device" .value=${this._device}
                  @input=${d=>this._device=d.target.value} />
                <datalist id="cmr-event-devices">
                  ${a.map(d=>c`<option value=${d}></option>`)}
                </datalist>
                <input type="search" placeholder="Search" .value=${this._search}
                  @input=${d=>this._search=d.target.value} />
              </div>
            </div>`:p}

        <div class="timeline">
          ${n.map((d,h)=>{let u=new Date(d.events[0].time),m=h?new Date(n[h-1].events[0].time):void 0,g=!m||m.toDateString()!==u.toDateString();return c`${g?c`<div class="day section-label">${this._dayLabel(u)}</div>`:p}${this._row(d)}`})}
          ${n.length?p:c`<div class="empty">No events${this._search||this._category||this._device?" match these filters":" yet"}.</div>`}
          ${i.length>this._limit?c`<button class="more" @click=${()=>this._limit+=50}>Show more (${i.length-this._limit})</button>`:p}
        </div>
      </ha-card>
    `}_issue(e){let t=e.device_name;return c`<div class="issue sev-${e.severity}">
      <ha-icon icon=${e.severity==="error"?"mdi:alert-octagon-outline":"mdi:alert-outline"}></ha-icon>
      <div class="body">
        <div class="title">${e.title}</div>
        <div class="detail">${e.detail}</div>
        <div class="meta">
          since ${this._time(new Date(e.since))} · ${e.count}×
          ${t&&e.device_id?c`· <a href="#" @click=${i=>{i.preventDefault(),R(`/config/devices/device/${e.device_id}`)}}>${t}</a>`:t?c`· ${t}`:p}
        </div>
      </div>
      ${this.hass.user?.is_admin?c`<button class="dismiss" title="Dismiss (comes back only on new occurrences)"
            @click=${()=>Ce(this.hass,e.entry_id,e.key).catch(i=>console.error("cmr: dismiss",i))}>
            <ha-icon icon="mdi:close"></ha-icon></button>`:p}
    </div>`}_row(e){let t=e.events[0],i=t.id,n=this._open.has(i),o=e.events.length>1,a=e.events[e.events.length-1],l=new Map;for(let d of e.events){let h=String(d.data?.event??d.category);l.set(h,(l.get(h)??0)+1)}return c`
      <div class="row sev-${t.severity} ${n?"open":""}">
        <button class="line" @click=${()=>this._toggle(i)}>
          <span class="time">${this._time(new Date(t.time))}</span>
          <span class="dot-icon"><ha-icon icon=${Ti(t)}></ha-icon></span>
          <span class="text">
            <span class="title">${t.title}</span>
            ${o?c`<span class="fold">${e.events.length} events since ${this._time(new Date(a.time))} ·
                  ${[...l].map(([d,h])=>`${h} ${d}`).join(", ")}</span>`:p}
          </span>
          ${t.device_name?c`<span class="device">${t.device_name}</span>`:p}
        </button>
        ${n?this._details(e):p}
      </div>
    `}_details(e){let t=e.events.slice(0,30);return c`<div class="details">
      ${t.map(i=>{let n=Object.entries(i.data??{}).filter(([o,a])=>a!=null&&a!==""&&!["event","key","rule_id"].includes(o));return c`<div class="detail-item">
          <div class="detail-head"><span class="mono">${new Date(i.time).toLocaleString(this.hass.language)}</span>
            <span class="muted">${i.source}${i.topics?.length?` \xB7 ${i.topics.join(",")}`:""}</span></div>
          ${i.message&&i.message!==i.title?c`<div class="raw mono">${i.message}</div>`:p}
          ${n.length?c`<div class="fields">${n.map(([o,a])=>c`<span class="chip">${o.replace(/_/g," ")}: ${typeof a=="object"?JSON.stringify(a):String(a)}</span>`)}</div>`:p}
        </div>`})}
      ${e.events.length>t.length?c`<div class="muted">…and ${e.events.length-t.length} more</div>`:p}
      ${e.events[0].device_id?c`<a class="open-device" href="#" @click=${i=>{i.preventDefault(),R(`/config/devices/device/${e.events[0].device_id}`)}}>
            <ha-icon icon="mdi:open-in-app"></ha-icon>Open ${e.events[0].device_name}</a>`:p}
    </div>`}_time(e){return e.toLocaleTimeString(this.hass.language,{hour:"2-digit",minute:"2-digit"})}_dayLabel(e){let t=new Date;t.setHours(0,0,0,0);let i=new Date(e);i.setHours(0,0,0,0);let n=Math.round((t.getTime()-i.getTime())/Ni);return n===0?"Today":n===1?"Yesterday":e.toLocaleDateString(this.hass.language,{weekday:"long",day:"numeric",month:"long"})}static{this.styles=[D,E`
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
      .find input {
        font: inherit; font-size: 13px; padding: 6px 10px; border-radius: 8px; min-width: 0;
        border: 1px solid var(--cmr-line); background: var(--cmr-surface); color: var(--primary-text-color);
      }
      .find input { flex: 1; }
      .find input.device { flex: 0 1 40%; }

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
    `]}};var Jt=8,Hi={offline:"mdi:lan-disconnect",pending:"mdi:link-variant-plus",alert:"mdi:bell-alert-outline",update:"mdi:update",ok:"mdi:check-circle-outline"},ze=class extends A{constructor(){super();this._ruleDevices=new j(()=>this.requestUpdate());this._onLocation=()=>this._applyDeepLink();this._filter=new Set,this._status="",this._version="",this._alert="",this._search="",this._sort={key:"attention",desc:!1},this._limit=100,this._unfolded=!1,this._pairing=new Map,this._labelPicker=!1,this._labelSearch=""}static{this.properties={_filter:{state:!0},_status:{state:!0},_version:{state:!0},_alert:{state:!0},_search:{state:!0},_sort:{state:!0},_limit:{state:!0},_unfolded:{state:!0},_pairing:{state:!0},_labelPicker:{state:!0},_labelSearch:{state:!0}}}setConfig(e){this._config={show_filters:!0,show_search:!0,fold_after:50,page_size:100,deep_link:!0,...e},this._filter=new Set(e.labels??[]),this._status=e.status??"",this._version=e.version??"",this._alert=e.alert??"",this._limit=this._config.page_size??100,this._applyDeepLink()}static getConfigForm(){return{schema:[I,{name:"title",selector:{text:{}}},{name:"labels",selector:{text:{multiple:!0}}},{name:"status",selector:{select:{mode:"dropdown",options:re.map(e=>({value:e,label:L[e]}))}}},{name:"show_filters",selector:{boolean:{}}},{name:"show_search",selector:{boolean:{}}},{name:"fold_after",selector:{number:{min:0,max:5e3,mode:"box"}}},{name:"compact",selector:{boolean:{}}}],computeLabel:T({entry_id:"Controller",title:"Title",labels:"Only devices with these labels",status:"Only devices with this status",show_filters:"Show filter chips",show_search:"Show search",fold_after:"Fold healthy devices above this many rows (0: never)",compact:"Overview mode: only devices needing attention, few rows"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 2+Math.min(this._entry?.devices.length??4,12)}connectedCallback(){super.connectedCallback(),window.addEventListener("location-changed",this._onLocation),this._applyDeepLink()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("location-changed",this._onLocation)}_applyDeepLink(){if(this._config?.deep_link===!1)return;let e=Pe();e.status&&(this._status=e.status),e.version&&(this._version=e.version),e.search&&(this._search=e.search),e.alert&&(this._alert=e.alert)}willUpdate(e){super.willUpdate(e),e.has("_entry")&&this._ruleDevices.invalidate()}_toggleLabel(e){let t=new Set(this._filter);t.has(e)?t.delete(e):t.add(e),this._filter=t}_setStatus(e){this._status=this._status===e?"":e,this._limit=this._config.page_size??100}_setSort(e){this._sort={key:e,desc:this._sort.key===e?!this._sort.desc:!1}}async _approve(e){this._pairing=new Map(this._pairing).set(e.key,"busy");try{await Se(this.hass,this._entry.entry_id,e.key);let t=new Map(this._pairing);t.delete(e.key),this._pairing=t}catch(t){let i=t?.message??String(t);this._pairing=new Map(this._pairing).set(e.key,i)}}_sorted(e){let{key:t,desc:i}=this._sort,n=[...e].sort((o,a)=>{switch(t){case"device":return F(o,a);case"version":return(o.version??"").localeCompare(a.version??"",void 0,{numeric:!0});case"uptime":return(o.uptime??-1)-(a.uptime??-1);case"address":return(o.address??"").localeCompare(a.address??"",void 0,{numeric:!0});default:return re.indexOf(C(o))-re.indexOf(C(a))||F(o,a)}});return i?n.reverse():n}render(){let e=this._entry;if(!e)return this.renderWaiting();let t=!!this._config.compact,i=new Map;for(let y of e.devices)for(let S of y.labels)i.set(S,(i.get(S)??0)+1);let n=[...i.keys()].sort((y,S)=>i.get(S)-i.get(y)||y.localeCompare(S)),o=n.length>Jt+1?[...new Set([...n.slice(0,Jt),...this._filter])].sort((y,S)=>n.indexOf(y)-n.indexOf(S)):n,a=n.filter(y=>!o.includes(y)),l=this._labelSearch.trim().toLowerCase(),d=this._search.trim().toLowerCase(),h=this._alert?e.alerts.find(y=>y.id===this._alert):void 0,u=h&&h.devices_on>0?this._ruleDevices.get(this.hass,e.entry_id,h.id):h?[]:void 0,m=Array.isArray(u)?new Set(u):void 0,g=e.devices.filter(y=>[...this._filter].every(S=>y.labels.includes(S))&&(!this._version||y.version===this._version)&&(!m||m.has(y.key))&&Me(y,d)),v=new Map;for(let y of g)v.set(C(y),(v.get(C(y))??0)+1);let f=this._sorted(this._status?g.filter(y=>C(y)===this._status):g),w=this._config.fold_after??50,b=f.filter(y=>C(y)!=="ok"),x=f.length-b.length,$=!this._status&&!this._unfolded&&w>0&&f.length>w&&b.length>0&&x>0,_=t&&!this._status||$?b:f,k=_.slice(0,this._limit),U=this._config.views?.devices,M=y=>this._sort.key===y?c`<ha-icon class="sort" icon=${this._sort.desc?"mdi:arrow-down":"mdi:arrow-up"}></ha-icon>`:p;return c`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:router-network"></ha-icon>
          <span>${this._config.title??"Devices"}</span>
          <span class="chip">${f.length}${f.length!==e.devices.length?` of ${e.devices.length}`:""}</span>
          <div class="spacer"></div>
          ${t&&this._config.views?.devices?c`<button class="open-link" @click=${()=>R(O(this._config.views.devices))}>
                Open Devices <ha-icon icon="mdi:arrow-right"></ha-icon></button>`:p}
          ${this._config.show_search&&!t?c`<input class="search" type="search" placeholder="Search" .value=${this._search}
                @input=${y=>{this._search=y.target.value,this._limit=this._config.page_size??100}} />`:p}
        </div>
        ${this.renderStale(e)}
        ${this._config.show_filters?c`<div class="filters">
              <button class="pill ${this._status?"":"on"}" @click=${()=>this._setStatus("")}>All ${g.length}</button>
              ${re.filter(y=>v.get(y)||y===this._status).map(y=>c`<button class="pill status-${y} ${this._status===y?"on":""}"
                  @click=${()=>this._setStatus(y)}>
                  <ha-icon icon=${Hi[y]}></ha-icon>${L[y]} ${v.get(y)??0}
                </button>`)}
              ${this._version?c`<button class="pill on" title="Clear the version filter" @click=${()=>this._version=""}>
                    <span class="mono">${this._version}</span> ✕</button>`:p}
              ${this._alert?c`<button class="pill on status-alert" title="Clear the alert filter" @click=${()=>this._alert=""}>
                    <ha-icon icon="mdi:bell-alert-outline"></ha-icon>${h?.name??"alert rule"}${u==="loading"?" \u2026":""} ✕</button>`:p}
              ${u==="unsupported"||u==="error"?c`<span class="muted small">${u==="unsupported"?"The controller lists a rule's devices only on its console, which the REST user may not use.":"Couldn't read the rule's device list from the controller."}</span>`:p}
              ${o.length&&!t?c`<span class="sep"></span>`:p}
              ${t?p:o.map(y=>c`<button class="pill ${this._filter.has(y)?"on":""}" @click=${()=>this._toggleLabel(y)}>
                      ${y}
                    </button>`)}
              ${a.length&&!t?c`<button class="pill more-labels ${this._labelPicker?"on":""}" aria-expanded=${this._labelPicker}
                    @click=${()=>this._labelPicker=!this._labelPicker}>
                    ${this._labelPicker?"Fewer labels":`+${a.length} more`}</button>`:p}
            </div>
            ${this._labelPicker&&a.length&&!t?c`<div class="picker">
                  <input class="search" type="search" placeholder="Find a label" .value=${this._labelSearch}
                    @input=${y=>this._labelSearch=y.target.value} />
                  <div class="picker-list">
                    ${a.filter(y=>!l||y.toLowerCase().includes(l)).sort().map(y=>c`<button class="pill ${this._filter.has(y)?"on":""}" @click=${()=>this._toggleLabel(y)}>
                          ${y} <span class="muted">${i.get(y)}</span>
                        </button>`)}
                  </div>
                </div>`:p}`:p}
        <div class="table" role="table">
          <div class="row head section-label" role="row">
            <button class="c-device" @click=${()=>this._setSort(this._sort.key==="device"?"attention":"device")}
              title="Click to sort by name; again for attention first">
              Device ${M("device")}${this._sort.key==="attention"?c`<ha-icon class="sort" icon="mdi:sort-variant" title="Attention first"></ha-icon>`:p}
            </button>
            <span class="c-labels">Labels</span>
            <button class="c-version" @click=${()=>this._setSort("version")}>Version ${M("version")}</button>
            <button class="c-uptime" @click=${()=>this._setSort("uptime")}>Uptime ${M("uptime")}</button>
            <button class="c-address" @click=${()=>this._setSort("address")}>Address ${M("address")}</button>
          </div>
          ${k.map(y=>this._row(y))}
          ${t&&!this._status&&x>0?c`<div class="fold static">
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                ${b.length?`${x} more`:`All ${x}`} device${x===1?"":"s"} online and up to date
              </div>`:p}
          ${$&&!t?c`<button class="fold" @click=${()=>this._unfolded=!0}>
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                ${x} device${x===1?"":"s"} online and up to date — show ${x===1?"it":"them"}
              </button>`:p}
          ${_.length>this._limit?t&&U?c`<button class="more" @click=${()=>R(O(U,this._status?{cmr_status:this._status}:{}))}>
                  ${_.length-this._limit} more — open Devices <ha-icon icon="mdi:arrow-right"></ha-icon></button>`:c`<button class="more" @click=${()=>this._limit+=this._config.page_size??100}>
                  Show more (${_.length-this._limit})</button>`:p}
          ${f.length?p:c`<div class="empty">${this._emptyText(e.devices.length)}</div>`}
        </div>
      </ha-card>
    `}_emptyText(e){return e?this._status?`No devices are ${L[this._status].toLowerCase()}.`:"No devices match these filters.":"The controller manages no devices yet."}_pairingCell(e,t){let i=this._pairing.get(e.key),n=e.pending&&!!this._entry?.actions&&!!this.hass.user?.is_admin;return c`<span class="offline" title=${Z(e)}>${L[t]}</span>
      ${n?c`<button class="approve" ?disabled=${i==="busy"}
            @click=${o=>{o.stopPropagation(),this._approve(e)}}>
            ${i==="busy"?"Approving\u2026":"Approve"}</button>`:p}
      ${i&&i!=="busy"?c`<span class="small offline">${i}</span>`:p}`}_uptimeCell(e,t){return t==="pending"?this._pairingCell(e,t):e.connected?c`${me(e.uptime)}`:c`<span class="offline">${L[t]}</span>
        ${e.disconnected_since?c`<span class="muted small">since ${e.disconnected_since}</span>`:p}`}_row(e){let t=C(e);return c`
      <div class="row status-${t}" role="row"
        @click=${()=>P(this,(e.update_available?e.entities.update:void 0)??e.entities.connected)}>
        <div class="c-device">
          <div class="icon" title=${L[t]}>${Q(e,"thumb")}<i class="dot"></i></div>
          <div class="who">
            <div class="name">
              ${e.identity}
              ${e.controller?c`<ha-icon class="crown" icon="mdi:crown-outline" title="CMR controller"></ha-icon>`:p}
            </div>
            <div class="muted small">${q(e)}${ge(e)?c` · <span class="mono">${ge(e)}</span>`:p}</div>
          </div>
        </div>
        <div class="c-labels">${e.labels.map(i=>c`<span class="chip">${i}</span>`)}</div>
        <div class="c-version" title="Click to filter by this version">
          <button class="ver mono" @click=${i=>{i.stopPropagation(),this._version=this._version===e.version?"":e.version??""}}>
            ${e.version??"\u2013"}</button>
          ${e.update_available?c`<span class="update" title="Update available"><ha-icon icon="mdi:arrow-up-circle"></ha-icon><span class="mono">${e.available_version}</span></span>`:p}
        </div>
        <div class="c-uptime">${this._uptimeCell(e,t)}</div>
        <div class="c-address">
          ${e.address?c`<a class="mono" href=${Bt(e.address)} target="_blank" rel="noreferrer" @click=${i=>i.stopPropagation()}>${e.address}</a>`:c`<span class="muted">${e.controller?"local":"\u2013"}</span>`}
        </div>
      </div>
    `}static{this.styles=[D,E`
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
    `]}};var Ii=["devices","devices_online","updates_available","alerts_firing","network_issues"];function Oi(r,s){let e=new Map;for(let[a,l]of Object.entries(r.entities??{})){if(l.platform!=="cmr"||!l.device_id||!Ii.includes(l.translation_key??"")||s&&!r.devices?.[l.device_id]?.config_entries?.includes(s))continue;let d=e.get(l.device_id)??new Map;d.set(l.translation_key,a),e.set(l.device_id,d)}let t=[...e.entries()].find(([,a])=>Number.isFinite(Number(r.states[a.get("devices_online")??""]?.state)));if(!t)return;let[i,n]=t,o=r.devices?.[i];return{name:o?.name_by_user||o?.name||"CMR controller",value:a=>Number(r.states[n.get(a)??""]?.state)||0}}var Ne=["var(--primary-color)","var(--cmr-update)","var(--cmr-pending)","var(--accent-color, #7e57c2)","var(--cmr-ok)","var(--cmr-muted)"],He=class extends A{constructor(){super();this._ruleDevices=new j(()=>this.requestUpdate());this._issues=[],this._pairing=new Map,this._openRule=""}static{this.properties={_panel:{state:!0},_version:{state:!0},_issues:{state:!0},_pairing:{state:!0},_openRule:{state:!0}}}willUpdate(e){super.willUpdate(e),e.has("_entry")&&this._ruleDevices.invalidate()}static getConfigForm(){return{schema:[I],computeLabel:T({entry_id:"Controller"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 4}connectedCallback(){super.connectedCallback(),this._ticker=window.setInterval(()=>this.requestUpdate(),15e3)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._ticker),this._unsubscribeEvents?.(),this._unsubscribeEvents=void 0}_toggle(e,t){let i=this._panel===e&&(e!=="version"||this._version===t);this._panel=i?void 0:e,this._version=i?void 0:t,this._panel==="issues"&&!this._unsubscribeEvents?this._unsubscribeEvents=Ee.subscribe(this.hass,this._config?.entry_id,(n,o)=>{this._issues=o}):this._panel!=="issues"&&this._unsubscribeEvents&&(this._unsubscribeEvents(),this._unsubscribeEvents=void 0)}async _approve(e){this._pairing=new Map(this._pairing).set(e.key,"busy");try{await Se(this.hass,this._entry.entry_id,e.key);let t=new Map(this._pairing);t.delete(e.key),this._pairing=t}catch(t){this._pairing=new Map(this._pairing).set(e.key,t?.message??String(t))}}render(){let e=this._entry;if(!e)return this._renderFromSensors()??this.renderWaiting();let t=e.devices,i=t.find(b=>b.controller),n=t.filter(b=>b.connected).length,o=t.filter(b=>b.update_available).length,a=t.filter(b=>b.pending||b.remote_pending).length,l=e.alerts.filter(b=>b.devices_on>0).length,d=e.fleet_entities.network_issues?this.hass.states[e.fleet_entities.network_issues]?.state:void 0,h=Number(d)||0,u=t.length?n/t.length:0,m=new Map;t.forEach(b=>m.set(b.version??"unknown",(m.get(b.version??"unknown")??0)+1));let g=[...m.entries()].sort((b,x)=>x[1]-b[1]),v=26,f=2*Math.PI*v,w=b=>this._panel===b?"on":"";return c`
      <ha-card>
        <div class="hero">
          <div class="identity">
            ${i?.product?.image?c`<div class="logo photo"><img src=${i.product.image} alt=${i.product.name} referrerpolicy="no-referrer" /></div>`:c`<div class="logo"><ha-icon icon="mdi:router-network"></ha-icon></div>`}
            <div class="who">
              <div class="eyebrow">CMR controller</div>
              <div class="name">${i?.identity??e.title}</div>
              <div class="meta">
                ${i?q(i):""} ·
                <span class="mono">${i?.version??"?"}</span>
              </div>
            </div>
            <a class="open" href=${e.controller_url} target="_blank" rel="noreferrer" title="Open the router's web interface (WebFig)">
              <ha-icon icon="mdi:open-in-new"></ha-icon>
            </a>
          </div>

          <div class="stats">
            <button class="stat ring ${w("online")}" aria-pressed=${this._panel==="online"} @click=${()=>this._toggle("online")}>
              <svg viewBox="0 0 64 64" class=${n===t.length?"status-ok":"status-offline"}>
                <circle cx="32" cy="32" r=${v} class="track"></circle>
                <circle cx="32" cy="32" r=${v} class="value"
                  stroke-dasharray=${`${f*u} ${f}`} transform="rotate(-90 32 32)"></circle>
              </svg>
              ${t.length<100?c`<div class="ring-text"><b>${n}</b><span>/${t.length}</span></div>
                    <div class="label">online</div>`:c`<div class="ring-text"><b>${n}</b></div>
                    <div class="label">of ${t.length} online</div>`}
            </button>
            ${this._stat("updates","mdi:update",o,"updates",o?"update":"ok")}
            ${this._stat("alerts","mdi:bell-alert-outline",l,"alerts active",l?"alert":"ok")}
            ${this._stat("issues","mdi:stethoscope",h,h===1?"issue":"issues",h?"pending":"ok")}
            ${this._stat("pending","mdi:link-variant-plus",a,"to pair",a?"pending":"ok")}
          </div>
        </div>
        ${this.renderStale(e)}
        ${this._panel?this._renderPanel(e):p}

        <div class="bars">
          <div class="bar-title">
            <span>Versions</span>
            <span class="muted">updated ${ve(e.last_update)}</span>
          </div>
          <div class="bar">
            ${g.map(([b,x],$)=>c`<button class="seg ${this._panel==="version"&&this._version===b?"on":""}"
                title="${b}: ${x} — click to list them"
                style="flex:${x};background:${Ne[$%Ne.length]}"
                @click=${()=>this._toggle("version",b)}></button>`)}
          </div>
          <div class="keys">
            ${g.map(([b,x],$)=>c`<button class="key ${this._panel==="version"&&this._version===b?"on":""}"
                @click=${()=>this._toggle("version",b)}>
                <i style="background:${Ne[$%Ne.length]}"></i>
                <span class="mono">${b}</span> <span class="muted">×${x}</span></button>`)}
          </div>
        </div>
      </ha-card>
    `}_renderFromSensors(){if(this._error)return;let e=Oi(this.hass,this._config?.entry_id);if(!e)return;let t=e.value("devices_online"),i=e.value("devices"),n=(d,h,u,m)=>c`<div class="stat static status-${m}"><ha-icon icon=${d}></ha-icon><b>${h}</b><div class="label">${u}</div></div>`,o=e.value("updates_available"),a=e.value("alerts_firing"),l=e.value("network_issues");return c`
      <ha-card>
        <div class="hero">
          <div class="identity">
            <div class="logo"><ha-icon icon="mdi:router-network"></ha-icon></div>
            <div class="who">
              <div class="eyebrow">CMR controller</div>
              <div class="name">${e.name}</div>
              <div class="meta">Loading the details…</div>
            </div>
          </div>
          <div class="stats">
            ${n("mdi:lan-connect",i?`${t}/${i}`:t,"online",t<i?"offline":"ok")}
            ${n("mdi:update",o,"updates",o?"update":"ok")}
            ${n("mdi:bell-alert-outline",a,"alerts active",a?"alert":"ok")}
            ${n("mdi:stethoscope",l,l===1?"issue":"issues",l?"pending":"ok")}
          </div>
        </div>
      </ha-card>
    `}_stat(e,t,i,n,o){return c`
      <button class="stat status-${o} ${this._panel===e?"on":""}" aria-pressed=${this._panel===e}
        @click=${()=>this._toggle(e)}>
        <ha-icon icon=${t}></ha-icon>
        <b>${i}</b>
        <div class="label">${n}</div>
      </button>
    `}_renderPanel(e){let t=this._panel,i=d=>[...d].sort(F),n="",o=[],a="",l;if(t==="online"){let d=i(e.devices.filter(h=>!h.connected));n=d.length?`${d.length} offline`:"All devices online",a="Every managed device is connected to the controller.",o=d.map(h=>this._deviceRow(h,h.disconnected_since?`since ${h.disconnected_since}`:"disconnected")),l={view:this._config.views?.devices,params:{cmr_status:"offline"}}}else if(t==="updates"){let d=i(e.devices.filter(h=>h.update_available));n=d.length?`${d.length} with an update`:"Everything is up to date",a="No device's channel offers a newer version.",o=d.map(h=>this._deviceRow(h,c`<span class="mono">${h.version}</span> → <span class="mono up">${h.available_version}</span>`,h.entities.update)),l={view:this._config.views?.devices,params:{cmr_status:"update"}}}else if(t==="alerts"){let d=e.alerts.filter(h=>h.devices_on>0).sort((h,u)=>u.devices_on-h.devices_on);n=d.length?`${d.length} alert rule${d.length>1?"s":""} active`:"No alert rule is active",a="All alert rules are quiet.",o=d.map(h=>this._ruleRow(h,e))}else if(t==="issues")n=this._issues.length?`${this._issues.length} detected issue${this._issues.length>1?"s":""}`:"No issues detected",a=this._unsubscribeEvents?"Nothing unusual in the events.":"Loading\u2026",o=this._issues.map(d=>c`<div class="item sev-${d.severity}">
          <ha-icon icon=${d.severity==="error"?"mdi:alert-octagon-outline":"mdi:alert-outline"}></ha-icon>
          <div class="text">
            <div class="t">${d.title}</div>
            <div class="muted small">${d.detail}</div>
          </div>
          ${d.device_name?c`<span class="chip">${d.device_name}</span>`:p}
          ${this.hass.user?.is_admin?c`<button class="dismiss" title="Dismiss (comes back only on new occurrences)"
                @click=${()=>Ce(this.hass,d.entry_id,d.key).catch(h=>console.error("cmr: dismiss",h))}>
                <ha-icon icon="mdi:close"></ha-icon></button>`:p}
        </div>`),l={view:this._config.views?.events,params:{}};else if(t==="pending"){let d=i(e.devices.filter(h=>h.pending||h.remote_pending));n=d.length?`${d.length} waiting to pair`:"No device is waiting to pair",a="New devices appear here until their pairing is approved.",o=d.map(h=>this._pendingRow(h,e)),l={view:this._config.views?.devices,params:{cmr_status:"pending"}}}else{let d=i(e.devices.filter(h=>(h.version??"unknown")===this._version));n=`${d.length} on ${this._version}`,o=d.map(h=>this._deviceRow(h,h.update_available?c`update: <span class="mono up">${h.available_version}</span>`:q(h))),l={view:this._config.views?.devices,params:{cmr_version:this._version}}}return c`<div class="panel">
      <div class="panel-head">
        <span class="section-label">${n}</span>
        <span class="spacer"></span>
        ${l?.view?c`<button class="link" @click=${()=>R(O(l.view,l.params))}>
              Open in ${t==="issues"?"Events":"Devices"} <ha-icon icon="mdi:arrow-right"></ha-icon></button>`:p}
        <button class="close" title="Close" @click=${()=>this._toggle(t,this._version)}><ha-icon icon="mdi:close"></ha-icon></button>
      </div>
      ${o.length?o:c`<div class="muted small">${a}</div>`}
    </div>`}_deviceRow(e,t,i){return c`<button class="item status-${e.connected?e.update_available?"update":"ok":"offline"}"
      @click=${()=>P(this,i??e.entities.connected)}>
      ${Q(e,"thumb")}
      <div class="text">
        <div class="t">${e.identity}</div>
        <div class="muted small">${t}</div>
      </div>
    </button>`}_ruleRow(e,t){let i=this._openRule===e.id;return c`<button class="item sev-${e.severity} ${i?"open":""}" aria-expanded=${i}
        @click=${()=>this._openRule=i?"":e.id}>
        <ha-icon icon="mdi:bell-alert"></ha-icon>
        <div class="text">
          <div class="t">${e.name}</div>
          <div class="muted small">${e.severity} · ${e.categories.join(", ")||"uncategorised"} · fired ${e.fired}×</div>
        </div>
        <span class="chip alert">${e.devices_on}/${e.devices}</span>
        <ha-icon class="chev" icon=${i?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </button>
      ${i?Re(this,t,e,this._ruleDevices.get(this.hass,t.entry_id,e.id),this._config.views):p}`}_pendingRow(e,t){let i=this._pairing.get(e.key),n=e.pending&&t.actions&&!!this.hass.user?.is_admin;return c`<div class="item status-pending">
      ${Q(e,"thumb")}
      <div class="text">
        <div class="t">${e.identity}</div>
        <div class="muted small">${q(e)} · ${Z(e)}${i&&i!=="busy"?` \xB7 ${i}`:""}</div>
      </div>
      ${n?c`<button class="approve" ?disabled=${i==="busy"} @click=${()=>this._approve(e)}>
            ${i==="busy"?"Approving\u2026":"Approve"}</button>`:p}
    </div>`}static{this.styles=[D,Ae,E`
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
      .logo.photo img { width: 100%; height: 100%; object-fit: contain; padding: 8%; box-sizing: border-box; }
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
      .stat.static { cursor: default; }
      .stat.static:hover { border-color: transparent; }
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
    `]}};var Xt=(r,s,e={})=>({type:"heading",heading:r,icon:s,heading_style:"title",...e});function Ui(r,s,e){return Promise.race([r,new Promise(t=>setTimeout(()=>t(e),s))])}function ji(r,s,e){let t=o=>!!o&&!!s.states[o]&&s.states[o].state!=="unavailable",i=r.entities,n=[Xt(r.identity,ne(r),{heading_style:"subtitle",...r.device_id?{tap_action:{action:"navigate",navigation_path:`/config/devices/device/${r.device_id}`}}:{},badges:t(i.version)?[{type:"entity",entity:i.version,show_icon:!0}]:[]})];return t(i.connected)&&n.push({type:"tile",entity:i.connected,name:"Connection",state_content:["state","last_changed"]}),t(i.uptime)&&n.push({type:"tile",entity:i.uptime,name:"Up since"}),t(i.update)&&n.push({type:"tile",entity:i.update,name:"RouterOS",show_entity_picture:!0,grid_options:{columns:12}}),t(i.active_alerts)&&n.push({type:"tile",entity:i.active_alerts,name:"Alerts"}),e&&t(i.alert)&&n.push({type:"tile",entity:i.alert,name:"Last alert"}),{type:"grid",cards:n}}function Fi(r,s,e){let t=r.fleet_entities;return{title:"Network",path:"network",icon:"mdi:router-network",type:"sections",max_columns:3,badges:[[t.devices_online,"Online"],[t.updates_available,"Updates"],[t.alerts_firing,"Alerts active"],[t.network_issues,"Issues"]].filter(([i])=>i).map(([i,n])=>({type:"entity",entity:i,name:n,show_name:!0})),sections:[{type:"grid",column_span:3,cards:[{...s,type:"custom:cmr-status-card",views:{devices:"devices",events:"events",topology:"topology"}}]},{type:"grid",column_span:3,cards:[{...s,type:"custom:cmr-topology-card",link_style:e,height:480,views:{devices:"devices"},grid_options:{columns:"full"}}]},{type:"grid",column_span:2,cards:[{...s,type:"custom:cmr-fleet-card",compact:!0,page_size:8,views:{devices:"devices"},grid_options:{columns:"full"}},{...s,type:"custom:cmr-events-card",max_items:15,notable:!0,grid_options:{columns:"full"}}]},{type:"grid",cards:[{...s,type:"custom:cmr-alerts-card",views:{devices:"devices",topology:"topology"},grid_options:{columns:"full"}},{...s,type:"custom:cmr-upgrades-card",views:{devices:"devices"},grid_options:{columns:"full"}}]}]}}var Ki=24;function Wi(r,s,e){let t=r.alerts.some(a=>a.webhook),i=[...r.devices].sort(F),n=i.length<=Ki,o=i.map(a=>a.entities.connected).filter(Boolean);return{title:"Devices",path:"devices",icon:"mdi:devices",type:"sections",max_columns:4,sections:[{type:"grid",column_span:4,cards:[{...e,type:"custom:cmr-fleet-card",grid_options:{columns:"full"}}]},...n?[{type:"grid",column_span:4,cards:[Xt("Connectivity, last 24 hours","mdi:chart-timeline-variant"),{type:"history-graph",hours_to_show:24,entities:o,grid_options:{columns:"full"}}]},...i.map(a=>ji(a,s,t))]:[]]}}function Bi(r){return{title:"Events",path:"events",icon:"mdi:timeline-text-outline",type:"sections",max_columns:2,sections:[{type:"grid",column_span:2,cards:[{...r,type:"custom:cmr-events-card",max_items:100,grid_options:{columns:"full"}}]}]}}function qi(r,s){return{title:"Topology",path:"topology",icon:"mdi:sitemap-outline",type:"panel",cards:[{...r,type:"custom:cmr-topology-card",link_style:s,height:760,views:{devices:"devices"}}]}}function Vi(r){return{title:"Wi-Fi",path:"wifi",icon:"mdi:wifi",type:"sections",max_columns:2,sections:[{type:"grid",column_span:2,cards:[{...r,type:"custom:cmr-wifi-card",grid_options:{columns:"full"}}]}]}}function ut(r,s){return{title:r.title??"Network",views:[{title:"Network",path:"network",cards:[{type:"markdown",content:`## CMR
${s}`}]}]}}var Ie=class extends HTMLElement{static getCreateSuggestions(){return{title:"Network",icon:"mdi:router-network"}}static{this.configRequired=!0}static async getConfigElement(){return document.createElement("cmr-strategy-editor")}static async generate(s,e){try{let t=await Ui(we.once(e),8e3,[]),i=ke(t,s.entry_id);if(!i&&s.entry_id&&t.length)return ut(s,"The controller this dashboard shows isn't loaded right now. If Home Assistant just started, reload in a moment; if the controller was removed, open *Edit dashboard* and pick another one.");if(!i)return ut(s,"No CMR controller is set up yet. Add the **CMR** integration under [Settings \u2192 Devices & services](/config/integrations/dashboard/add?domain=cmr).");let n=t.length>1||s.entry_id?{entry_id:i.entry_id}:{},o=s.link_style??"straight",a=Fi(i,n,o);return{title:s.title??i.title,views:[a,Bi(n),Wi(i,e,n),qi(n,o),Vi(n)]}}catch(t){return console.error("cmr: dashboard strategy failed",t),ut(s,`The dashboard couldn't be built (${String(t)}). Reload the page to try again.`)}}};var je={name:"link_style",selector:{select:{options:[{value:"straight",label:"Straight"},{value:"elbow",label:"Elbow (right angles)"}]}}};function vt(r){return r.map((s,e)=>`${e?"L":"M"} ${s.x} ${s.y}`).join(" ")}function Qt(r){let s=r.slice(1).map((t,i)=>Math.hypot(t.x-r[i].x,t.y-r[i].y)),e=s.reduce((t,i)=>t+i,0)/2;for(let t=0;t<s.length;t++){if(e<=s[t]&&s[t]){let i=e/s[t];return{x:r[t].x+i*(r[t+1].x-r[t].x),y:r[t].y+i*(r[t+1].y-r[t].y)}}e-=s[t]}return r[0]}function Oe(r){let s=[];for(let e of r){let t=s.at(-1);if(t?.x===e.x&&t.y===e.y)continue;let i=s.at(-2);i&&t&&(i.x===t.x&&t.x===e.x||i.y===t.y&&t.y===e.y)&&s.pop(),s.push(e)}return s}function Zt(r,s,e){return r.x===s.x?r.x>e.x0&&r.x<e.x1&&Math.max(r.y,s.y)>e.y0&&Math.min(r.y,s.y)<e.y1:r.y>e.y0&&r.y<e.y1&&Math.max(r.x,s.x)>e.x0&&Math.min(r.x,s.x)<e.x1}var mt=class{constructor(){this.items=[]}push(s){let e=this.items;e.push(s);let t=e.length-1;for(;t;){let i=t-1>>1;if(e[i].rank<=s.rank)break;e[t]=e[i],t=i}e[t]=s}pop(){let s=this.items,e=s[0],t=s.pop();if(s.length&&t){let i=0;for(;i*2+1<s.length;){let n=i*2+1;if(n+1<s.length&&s[n+1].rank<s[n].rank&&n++,s[n].rank>=t.rank)break;s[i]=s[n],i=n}s[i]=t}return e}},Ue=class{constructor(s,e=184,t=62){this.nodeWidth=e;this.nodeHeight=t;this.used=new Map;let i=Math.min(0,...s.map(l=>l.x-e/2))-96,n=Math.min(0,...s.map(l=>l.y-t/2))-96,o=Math.max(0,...s.map(l=>l.x+e/2))+96,a=Math.max(0,...s.map(l=>l.y+t/2))+96;this.step=Math.max(24,Math.ceil(Math.sqrt((o-i)*(a-n)/12e4)),Math.ceil((o-i)/4096),Math.ceil((a-n)/4096)),this.x0=Math.floor(i/this.step)*this.step,this.y0=Math.floor(n/this.step)*this.step,this.cols=Math.ceil((o-this.x0)/this.step)+1,this.rows=Math.ceil((a-this.y0)/this.step)+1,this.blocked=new Uint8Array(this.cols*this.rows),this.boxes=new Map(s.map(l=>[l.id,{x0:l.x-e/2-10,x1:l.x+e/2+10,y0:l.y-t/2-10,y1:l.y+t/2+10}]));for(let l of this.boxes.values()){let d=Math.max(0,Math.ceil((l.x0-this.step/2-this.x0)/this.step)),h=Math.min(this.cols-1,Math.floor((l.x1+this.step/2-this.x0)/this.step)),u=Math.max(0,Math.ceil((l.y0-this.step/2-this.y0)/this.step)),m=Math.min(this.rows-1,Math.floor((l.y1+this.step/2-this.y0)/this.step));for(let g=u;g<=m;g++)for(let v=d;v<=h;v++)this.blocked[g*this.cols+v]=1}}point(s){return{x:this.x0+s%this.cols*this.step,y:this.y0+Math.floor(s/this.cols)*this.step}}exits(s){let e=[];for(let[t,i]of[[1,0],[-1,0],[0,1],[0,-1]]){let n={x:s.x+t*this.nodeWidth/2,y:s.y+i*this.nodeHeight/2},o=(g,v)=>v>0?Math.ceil(g):v<0?Math.floor(g):Math.round(g),a=o((n.x+t*(12+this.step)-this.x0)/this.step,t),l=o((n.y+i*(12+this.step)-this.y0)/this.step,i);if(a<0||a>=this.cols||l<0||l>=this.rows)continue;let d=l*this.cols+a;if(this.blocked[d])continue;let h=this.point(d),u=Oe([n,t?{x:h.x,y:n.y}:{x:n.x,y:h.y},h]);if([...this.boxes].every(([g,v])=>g===s.id||u.slice(1).every((f,w)=>!Zt(u[w],f,v)))){let g=u.at(-2);e.push({cell:d,points:u,direction:g.x===h.x?1:0})}}return e}simpleRoute(s,e){let t=a=>[[1,0],[-1,0],[0,1],[0,-1]].map(([l,d])=>({x:a.x+l*this.nodeWidth/2,y:a.y+d*this.nodeHeight/2,dx:l,dy:d})),i,n=1/0,o=[...this.boxes].map(([a,l])=>a===s.id||a===e.id?{x0:l.x0+10,x1:l.x1-10,y0:l.y0+10,y1:l.y1-10}:l);for(let a of t(s))for(let l of t(e)){let d=(a.x+l.x)/2,h=(a.y+l.y)/2;for(let u of[[{x:a.x,y:l.y}],[{x:l.x,y:a.y}],[{x:d,y:a.y},{x:d,y:l.y}],[{x:a.x,y:h},{x:l.x,y:h}]]){let m=Oe([a,...u,l]);if(m.length<2)continue;let g=m[1],v=m.at(-2);if((a.dx?g.y!==a.y||(g.x-a.x)*a.dx<=0:g.x!==a.x||(g.y-a.y)*a.dy<=0)||(l.dx?v.y!==l.y||(v.x-l.x)*l.dx<=0:v.x!==l.x||(v.y-l.y)*l.dy<=0))continue;let f=m.slice(1).reduce((w,b,x)=>w+Math.abs(b.x-m[x].x)+Math.abs(b.y-m[x].y),0)+(m.length-2)*20;f>=n||o.some(w=>m.slice(1).some((b,x)=>Zt(m[x],b,w)))||(i=m,n=f)}}return i}route(s,e){let t=this.simpleRoute(s,e);if(t)return t;let i=this.exits(s),n=this.exits(e),o=new Map(n.map(g=>[g.cell,g])),a=new mt,l=new Map,d=new Map,h=new Map,u=g=>{let v=this.point(g);return Math.min(...n.map(f=>{let w=this.point(f.cell);return Math.abs(v.x-w.x)+Math.abs(v.y-w.y)}))};for(let g of i){let v=g.cell*2+g.direction,f=Math.abs(s.x-this.point(g.cell).x)+Math.abs(s.y-this.point(g.cell).y);l.set(v,f),h.set(v,g),a.push({key:v,cost:f,rank:f+u(g.cell)})}for(let g=0;n.length&&g<3e4;g++){let v=a.pop();if(!v)break;if(l.get(v.key)!==v.cost)continue;let f=Math.floor(v.key/2),w=v.key%2,b=o.get(f);if(b){let _=[f],k=v.key;for(;d.has(k);)k=d.get(k),_.push(Math.floor(k/2));let U=h.get(k);_.reverse();for(let M of _)this.used.set(M,(this.used.get(M)??0)+1);return Oe([...U.points,..._.map(M=>this.point(M)),...[...b.points].reverse()])}let x=f%this.cols,$=Math.floor(f/this.cols);for(let[_,k,U]of[[1,0,0],[-1,0,0],[0,1,1],[0,-1,1]]){if(x+_<0||x+_>=this.cols||$+k<0||$+k>=this.rows)continue;let M=f+_+k*this.cols;if(this.blocked[M])continue;let y=M*2+U,S=v.cost+this.step+(U===w?0:20)+(this.used.get(M)??0)*4;S>=(l.get(y)??1/0)||(l.set(y,S),d.set(y,v.key),a.push({key:y,cost:S,rank:S+u(M)}))}}let m=(s.x+e.x)/2;return Oe([s,{x:m,y:s.y},{x:m,y:e.y},e])}};var Yi=[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"title",selector:{text:{}}},je],Gi=T({entry_id:"Controller (empty: the first one)",title:"Title shown in the dashboard header",link_style:"Map link style"}),Fe=class extends H{static{this.properties={hass:{attribute:!1},lovelace:{attribute:!1},_config:{state:!0}}}setConfig(s){this._config={link_style:"straight",...s}}connectedCallback(){super.connectedCallback(),Ji()}render(){return!this.hass||!this._config?c``:c`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${Yi}
      .computeLabel=${Gi}
      @value-changed=${this._changed}
    ></ha-form>`}_changed(s){s.stopPropagation();let e={...this._config,...s.detail.value,type:this._config.type};for(let t of["entry_id","title"])e[t]||delete e[t];this._config=e,ht(this,"config-changed",{config:e})}};async function Ji(){if(!customElements.get("ha-form"))try{await(await(await window.loadCardHelpers?.())?.createCardElement({type:"entities",entities:[]}))?.constructor?.getConfigElement?.()}catch{}}function ei(r,s,e){let t=new Map,i=new Set;for(let n of[...e,...r]){if(i.has(n))continue;i.add(n);let o=[n];for(;o.length;){let a=o.shift();for(let l of s){let d=l.target_layout;l.layout!==a||!d||i.has(d)||(i.add(d),t.set(a,[...t.get(a)??[],d]),o.push(d))}}}return t}var Ke=class{constructor(s,e,t,i,n){this.entryId=s;this.layout=e;this.origin=t;this.moved=new Set;this.originals=new Map(i.filter(o=>o.layout===e).map(o=>[o.id,{...o}])),this.positions=new Map(n.filter(o=>o.restId).map(o=>[o.restId,{x:o.x+t.x,y:o.y+t.y}])),this.initialPositions=new Map(this.positions)}move(s,e,t,i=1){if(!this.originals.has(s)||!Number.isFinite(e)||!Number.isFinite(t))return;let n=o=>Math.max(-(2**31),Math.min(2**31-1,Math.round(o/i)*i));this.positions.set(s,{x:n(e),y:n(t)}),this.moved.add(s)}changes(){return[...this.moved].flatMap(s=>{let e=this.originals.get(s),t=this.positions.get(s),i=this.initialPositions.get(s);return(e.x==null||e.y==null)&&t.x===i?.x&&t.y===i.y?[]:e.x===t.x&&e.y===t.y?[]:[{id:s,revision:e.revision,...t}]})}acknowledge(s){for(let e of s){let t=this.originals.get(e.id);t&&this.originals.set(e.id,{...t,...e}),this.positions.set(e.id,{x:e.x,y:e.y}),this.moved.delete(e.id)}}};function gt(r,s,e){let t=new Map(r.nodes.map(n=>[`${n.layout}\0${n.name}`,n.device_key])),i=new Map;for(let n of r.links){let o=t.get(`${n.layout}\0${n.node1}`),a=t.get(`${n.layout}\0${n.node2}`),l=o===s.key?"a":a===s.key?"b":void 0;if(!l)continue;let d=l==="a"?a:o,h=d?e.get(d):void 0;for(let u of n.ports){let m=l==="a"?u.a:u.b;i.get(m.interface)?.up===void 0&&i.set(m.interface,{interface:m.interface,peer:h?.identity??(l==="a"?n.node2:n.node1),up:h?s.connected&&h.connected:void 0,poe:m.poe==="powered-on"})}}return[...i.values()].sort((n,o)=>n.interface.localeCompare(o.interface,void 0,{numeric:!0}))}var Xi=[[/^ether(\d+)/,"ether"],[/^combo(\d+)/,"combo"],[/^sfp-sfpplus(\d+)/,"sfp+"],[/^sfp28-(\d+)/,"sfp28"],[/^sfp56-(\d+)/,"sfp56"],[/^qsfpplus(\d+)/,"qsfp+"],[/^qsfp28-(\d+)/,"qsfp28"],[/^qsfp56-dd-(\d+)/,"qsfp56-dd"],[/^qsfp56-(\d+)/,"qsfp56"],[/^sfp(\d+)/,"sfp"]];function Zi(r,s){let e=r.toLowerCase();for(let[t,i]of Xi){let n=t.exec(e);if(!n)continue;if(i==="ether")return`ether:${n[1]}`;let o=s.cages.map(([l])=>l);if(o.includes(i))return`${i}:${n[1]}`;let a=i==="sfp"?"sfp+":i==="sfp+"?"sfp":void 0;return a&&o.includes(a)?`${a}:${n[1]}`:void 0}}var Qi={sfp:"SFP","sfp+":"SFP+",combo:"combo",sfp28:"SFP28",sfp56:"SFP56","qsfp+":"QSFP+",qsfp28:"QSFP28",qsfp56:"QSFP56","qsfp56-dd":"QSFP56-DD"},ti=new Set(["qsfp+","qsfp28","qsfp56","qsfp56-dd"]),ee=10,es=15,oe=8,K=2,We=10,ii=7;function ts(r,s){let e=r.ether.reduce((v,[,f])=>v+f,0),t=v=>r.poe_out.some(([f,w])=>v>=f&&v<=w),i=e>=14||/^CRS/i.test(s)&&/-IN$/i.test(s)&&e>=8,n=(v,f)=>!ti.has(v)&&f>2,o=i||r.cages.some(([v,f])=>n(v,f))?2:1,a=o===2?We/2:0,l=[],d=0,h=(v,f,w)=>l.push({key:`ether:${v}`,label:String(v),cage:!1,x:f,y:w<0?a:w*We,w:ee,flip:w===1,poeOut:t(v)}),u=v=>{d=v+ii},m=e,g=[];if(i&&e%2&&g.push(m--),r.mgmt&&g.push(e+1),g.length&&(g.sort((v,f)=>v-f).forEach((v,f)=>h(v,d+f*(ee+K),-1)),u(d+g.length*(ee+K)-K)),m){for(let f=0;f<m;f++)i?h(f+1,d+Math.floor(f/2)*(ee+K),f%2?0:1):h(f+1,d+f*(ee+K),-1);let v=i?Math.ceil(m/2):m;u(d+v*(ee+K)-K)}for(let[v,f]of r.cages){let w=ti.has(v)?es:ee,b=d;for(let x=0;x<f;x++){let $,_;if(n(v,f)){let k=Math.floor(x/4);$=d+(k*2+Math.floor(x%4/2))*(w+K)+k*K,_=x%2?0:1}else $=d+x*(w+K),_=-1;l.push({key:`${v}:${x+1}`,label:String(x+1),cage:!0,x:$,y:_<0?a:_*We,w,flip:_===1,poeOut:!1}),b=Math.max(b,$+w)}u(b)}return{cells:l,width:Math.max(0,d-ii),rows:o}}function ft(r){let s=[];r.ether.length&&s.push(`${r.ether.map(([e,t])=>`${t}\xD7 ${e}`).join(" + ")} Ethernet`),r.mgmt&&s.push("management port");for(let[e,t]of r.cages)s.push(`${t}\xD7 ${Qi[e]}`);if(r.poe_out.length){let e=r.poe_out.map(([t,i])=>t===i?`ether${t}`:`ether${t}\u2013${i}`);s.push(`PoE out ${e.join(", ")}`)}return s.join(" \xB7 ")}var is="M2.2 0 L0 2.9 H1.5 L1.1 5 L3.6 1.9 H2 Z",ss=276;function si(r,s){let e=r.ports;if(!e)return p;let{cells:t,width:i,rows:n}=ts(e,r.code);if(!t.length)return p;let o=new Map;for(let b of s){let x=Zi(b.interface,e);x&&o.set(x,b)}let a=/RM$/i.test(r.code),l=3,d=a?8:0,h=-l-d,u=i+2*(l+d),m=(n===2?We:0)+oe+2*l,g=Math.min(2.4,ss/u),v=g>=1.9,f=g>=.9,w=i+2*l;return c`<svg class="front" viewBox="${h} ${-l} ${u} ${m}" width=${u*g} height=${m*g}
      role="img" aria-label="Front panel: ${ft(e)}">
    ${a?N`<rect class="ear" x=${h} y=${-l} width=${d+1} height=${m} rx="1.5"></rect>
          <rect class="ear" x=${i+l-1} y=${-l} width=${d+1} height=${m} rx="1.5"></rect>
          <circle class="hole" cx=${h+d/2} cy=${m/2-l} r="1.3"></circle>
          <circle class="hole" cx=${i+l+d/2} cy=${m/2-l} r="1.3"></circle>`:p}
    <rect class="face" x=${-l} y=${-l} width=${w} height=${m} rx="2.5"></rect>
    ${t.map(b=>{let x=o.get(b.key),$=x?x.up===!1?"down":"on":"",_=b.flip;return N`<g class="p ${b.cage?"cage":"rj"} ${$} ${x?.poe?"poe":""}"
          transform="translate(${b.x} ${b.y})">
        <rect class="body" width=${b.w} height=${oe} rx="1.2"></rect>
        ${b.cage?N`<rect class="slot" x="2" y=${oe/2-1.2} width=${b.w-4} height="2.4" rx="0.6"></rect>`:N`<rect class="latch" x="1" y=${_?oe-1.8:.4} width="3.4" height="1.4" rx="0.4"></rect>`}
        ${f&&(b.poeOut||x?.poe)?N`<path class="bolt" d=${is} transform="translate(${b.w-4.4} ${_?oe-5.6:.6})"></path>`:p}
        ${v?N`<text class="num" x="1.1" y=${_?4.4:oe-1.1}>${b.label}</text>`:p}
      </g>`})}
  </svg>`}var ni=E`
  .front { display: block; margin: 8px auto 4px; overflow: visible; }
  .front .face, .front .ear { fill: var(--cmr-surface-2); stroke: var(--cmr-line); stroke-width: 0.6; }
  .front .hole { fill: var(--cmr-surface); stroke: var(--cmr-line); stroke-width: 0.4; }
  .front .p .body {
    fill: color-mix(in srgb, var(--cmr-muted) 18%, var(--cmr-surface));
    stroke: color-mix(in srgb, var(--cmr-muted) 45%, transparent); stroke-width: 0.4;
  }
  .front .p.cage .body {
    fill: color-mix(in srgb, var(--cmr-fiber) 16%, var(--cmr-surface));
    stroke: color-mix(in srgb, var(--cmr-fiber) 60%, transparent);
  }
  .front .p.on .body { fill: var(--cmr-ok); stroke: none; }
  .front .p.down .body { fill: var(--cmr-offline); stroke: none; }
  .front .latch, .front .slot { fill: rgba(0, 0, 0, 0.3); }
  .front .bolt { fill: color-mix(in srgb, var(--cmr-muted) 75%, transparent); }
  .front .p.on .bolt, .front .p.down .bolt { fill: rgba(255, 255, 255, 0.75); }
  .front .p.poe .bolt { fill: var(--cmr-poe); stroke: rgba(0, 0, 0, 0.55); stroke-width: 0.3; }
  .front .num { font: 600 3.9px var(--cmr-mono); fill: var(--primary-text-color); opacity: 0.65; }
  .front .p.on .num, .front .p.down .num { fill: #fff; opacity: 0.95; }
`;var ns=.4,ri=.7,rs=250,z=184,W=62,os=48,te="__auto__",as="mdi:map-marker-radius-outline",oi={fiber:"Fiber (SFP)",copper:"Ethernet",wireless:"Wireless",logical:"Logical interface",uplink:"Link between layouts",unknown:"No ports detected"},ls=["copper","fiber","wireless","unknown"];function _t(r){return/^q?sfp/i.test(r)?"fiber":/^(ether|combo)/i.test(r)?"copper":/^(wifi|wlan|wl\d)/i.test(r)?"wireless":"logical"}function cs(r,s,e=3){return r.x0<s.x1+e&&s.x0<r.x1+e&&r.y0<s.y1+e&&s.y0<r.y1+e}function ds(r,s,e,t,i){let n=Math.hypot(e,t)||1,o=e/n,a=t/n,l=Math.min(o?z/2/Math.abs(o):1/0,a?W/2/Math.abs(a):1/0);return{x:r+o*(l+i),y:s+a*(l+i),ux:o,uy:a}}var Be=class extends A{constructor(){super();this._pointers=new Map;this._touch=!1;this._ruleDevices=new j(()=>this.requestUpdate());this._userMoved=!1;this._fittedFor="";this._fitK=1;this._onLocation=()=>{let e=Pe().alert;e&&(this._alert=e)};this._onKey=e=>{e.key==="Escape"&&(this._clearHover(),this._pinned=void 0)};this._clearHover=()=>{this._hover=void 0,this._hoverLink=void 0};this._beforeUnload=e=>{(this._saving||this._edit?.changes().length)&&(e.preventDefault(),e.returnValue="")};this._path=[],this._view={x:0,y:0,k:1},this._alert="",this._find="",this._copied=!1,this._saving=!1,this._snap=!0,this._editMessage=""}static{this.properties={_path:{state:!0},_hover:{state:!0},_hoverLink:{state:!0},_view:{state:!0},_autoHeight:{state:!0},_alert:{state:!0},_rebuild:{state:!0},_reboot:{state:!0},_pinned:{state:!0},_find:{state:!0},_copied:{state:!0},_edit:{state:!0},_saving:{state:!0},_editMessage:{state:!0},_snap:{state:!0}}}_nodeMatches(e,t){return e.name.toLowerCase().includes(t)||!!e.device&&Me(e.device,t)}setConfig(e){this._edit=void 0,this._memo=void 0,this._config={height:440,show_ports:!0,show_comments:!0,...e},this._path=e.layout?[e.layout]:[],this._userMoved=!1}static getConfigForm(){return{schema:[I,{name:"title",selector:{text:{}}},{name:"layout",selector:{text:{}}},{name:"height",selector:{number:{min:200,max:1400,step:20,mode:"box",unit_of_measurement:"px"}}},{name:"max_height",selector:{number:{min:200,max:3e3,step:20,mode:"box",unit_of_measurement:"px"}}},{name:"show_ports",selector:{boolean:{}}},{name:"show_comments",selector:{boolean:{}}},je],computeLabel:T({entry_id:"Controller",title:"Title",layout:"Start at layout (empty: the top layout)",height:"Height",show_ports:"Show port names on cables",show_comments:"Show link comments",link_style:"Link style"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6,min_rows:4}}getCardSize(){return Math.round((this._config?.height??440)/50)+1}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey),window.addEventListener("location-changed",this._onLocation),window.addEventListener("beforeunload",this._beforeUnload),this._onLocation()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey),window.removeEventListener("location-changed",this._onLocation),window.removeEventListener("beforeunload",this._beforeUnload),window.clearTimeout(this._openTimer),this._resize?.disconnect(),this._resize=void 0}_memoFor(e){let t=this._path.join("/");return(this._memo?.entry!==e||this._memo.path!==t)&&(this._memo={entry:e,path:t,byKey:new Map(e.devices.map(i=>[i.key,i])),devicesIn:new Map,cables:new Map}),this._memo}_rootLayouts(e){let t=new Set(e.nodes.map(o=>o.target_layout).filter(Boolean)),i=new Set(e.nodes.map(o=>o.layout)),n=e.layouts.map(o=>o.name).filter(o=>!t.has(o)&&i.has(o));return n.length?n:e.layouts.map(o=>o.name).filter(o=>i.has(o))}_currentLayout(e){return this._edit?.entryId===e.entry_id?this._edit.layout:this._path.length?this._path[this._path.length-1]:this._rootLayouts(e)[0]??te}_devicesIn(e,t){let i=this._memoFor(e),n=i.devicesIn.get(t);if(n)return n;i.children??=ei(e.layouts.map(l=>l.name),e.nodes,this._rootLayouts(e));let o=new Map;for(let l of e.nodes){if(l.layout!==t)continue;let d=l.device_key?i.byKey.get(l.device_key):void 0;d&&o.set(d.key,d)}for(let l of i.children.get(t)??[])this._devicesIn(e,l).forEach(d=>o.set(d.key,d));let a=[...o.values()];return i.devicesIn.set(t,a),a}_scene(e){let t=this._memoFor(e);return t.scene||(t.scene=this._buildScene(e,t.byKey)),t.scene}_buildScene(e,t){let i=this._currentLayout(e),n,o;if(i===te)({nodes:n,links:o}=this._autoLayout(e));else{let v=this._edit?[...this._edit.originals.values()]:e.nodes.filter($=>$.layout===i),f=v.filter($=>$.x!=null&&$.y!=null),w=f.length?Math.max(...f.map($=>$.y)):0,b=f.length?Math.min(...f.map($=>$.x)):0,x=0;n=v.map($=>{let _=$.x==null||$.y==null,k=this._edit?.positions.get($.id),U=k?.x??(_?b+x*(z+40):$.x),M=k?.y??(_?w+W*2.4:$.y);if(_&&(x+=1),$.target_layout){let S=this._devicesIn(e,$.target_layout),ui=S.filter(Ge=>Ge.connected).length,Ye=S.map(C),mi=Ye.includes("offline")?"offline":Ye.includes("alert")?"alert":Ye.includes("update")?"update":"ok",vi=e.layouts.find(Ge=>Ge.name===$.target_layout)?.comment??null;return{id:$.name,restId:$.id,name:$.name,x:U,y:M,kind:"site",target:$.target_layout,site:{online:ui,total:S.length,status:mi,comment:vi}}}let y=$.device_key?t.get($.device_key):void 0;return{id:$.name,restId:$.id,name:y?.identity??$.name,x:U,y:M,kind:y?"device":"unknown",device:y}}),o=e.links.filter($=>$.layout===i)}let a=n.map(v=>v.x),l=n.map(v=>v.y),d=os+(this._config.link_style==="elbow"?96:0),h=this._edit?.origin.x??Math.min(...a,0)-z/2-d,u=this._edit?.origin.y??Math.min(...l,0)-W/2-d;for(let v of n)v.x-=h,v.y-=u;let m=Math.max(...n.map(v=>v.x),0)+z/2+d,g=Math.max(...n.map(v=>v.y),0)+W/2+d;return{layout:i,nodes:n,links:o,width:m,height:g,origin:{x:h,y:u}}}_autoLayout(e){let t=h=>h.controller?0:1,i=new Map;for(let h of e.devices){let u=t(h);i.set(u,[...i.get(u)??[],h])}let n=Math.max(4,Math.ceil(Math.sqrt(e.devices.length*2.2))),o=[],a=0;for(let h of[...i.keys()].sort()){let u=i.get(h).sort((m,g)=>m.identity.localeCompare(g.identity));for(let m=0;m<u.length;m+=n,a+=1){let g=u.slice(m,m+n),v=(Math.min(n,e.devices.length)-g.length)*(z+48)/2;g.forEach((f,w)=>o.push({id:f.key,name:f.identity,kind:"device",device:f,x:v+w*(z+48),y:a*(W+90)}))}}let l=e.devices.find(h=>h.controller),d=l?e.devices.filter(h=>!h.controller).map(h=>({id:h.key,layout:te,node1:l.key,node2:h.key,comment:null,ports:[]})):[];return{nodes:o,links:d}}willUpdate(e){super.willUpdate(e),this._edit&&this._entry&&this._edit.entryId!==this._entry.entry_id&&(this._edit=void 0,this._nodeDrag=void 0,this._memo=void 0),e.has("_entry")&&this._ruleDevices.invalidate()}updated(){let e=this.renderRoot.querySelector(".viewport");e&&!this._resize&&(this._resize=new ResizeObserver(()=>{this._sizeToLayout(),this._userMoved||this._fit()}),this._resize.observe(e)),this._sizeToLayout();let t=`${this._entry?.entry_id}|${this._path.join("/")}|${this._entry?this._scene(this._entry).nodes.length:0}`;this._entry&&!this._edit&&t!==this._fittedFor&&(this._fittedFor=t,this._userMoved=!1,this._fit())}_sizeToLayout(){if(this._edit)return;let e=this.renderRoot.querySelector(".viewport");if(!e||!this._entry)return;let{width:t,height:i}=this._scene(this._entry),n=e.clientWidth;if(!n||!t)return;let o=n<600,a=o?240:this._config?.height??440,l=o?Math.max(a,Math.round(window.innerHeight*.6)):Math.max(a,this._config?.max_height??Math.round(window.innerHeight*.85)),d=Math.round(Math.min(l,Math.max(a,n*i/t)));(this._autoHeight===void 0||Math.abs(d-this._autoHeight)>4)&&(this._autoHeight=d)}_fit(){let e=this.renderRoot.querySelector(".viewport");if(!e||!this._entry)return;let{width:t,height:i}=this._scene(this._entry),n=e.clientWidth,o=e.clientHeight;if(!n||!o)return;let a=Math.min(n/t,o/i,1.2),l=n<600?Math.max(a,Math.min(o/i,ri)):a;this._fitK=l;let d={k:l,x:t*l>n?0:(n-t*l)/2,y:(o-i*l)/2};(Math.abs(d.k-this._view.k)>.001||Math.abs(d.x-this._view.x)>.5||Math.abs(d.y-this._view.y)>.5)&&(this._view=d)}_onWheel(e){if(!e.ctrlKey&&!e.metaKey||(e.preventDefault(),this._nodeDrag))return;let t=e.currentTarget.getBoundingClientRect();this._zoomAt(e.clientX-t.left,e.clientY-t.top,Math.exp(-e.deltaY*.0018))}_zoomAt(e,t,i){let{x:n,y:o,k:a}=this._view,l=Math.min(4,Math.max(this._minK(),a*i));this._view={k:l,x:e-(e-n)*l/a,y:t-(t-o)*l/a},this._userMoved=!0,this._clearHover(),this._pinned=void 0}_minK(){return Math.min(.25,this._fitK*.8)}_zoomTo(e){let t=this.renderRoot.querySelector(".viewport");if(!t||!e.length)return;let i=40,n=Math.min(...e.map(m=>m.x))-z/2-i,o=Math.max(...e.map(m=>m.x))+z/2+i,a=Math.min(...e.map(m=>m.y))-W/2-i,l=Math.max(...e.map(m=>m.y))+W/2+i,d=t.clientWidth,h=t.clientHeight,u=Math.max(this._minK(),Math.min(d/(o-n),h/(l-a),1.2));this._view={k:u,x:d/2-(n+o)/2*u,y:h/2-(a+l)/2*u},this._userMoved=!0,this._clearHover(),this._pinned=void 0}_local(e){let t=e.currentTarget.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}_onPointerDown(e){if(e.pointerType==="mouse"&&e.button!==0||(this._touch=e.pointerType==="touch",e.target.closest(".tooltip.pinned, .controls, .find")))return;if(this._clearHover(),this._pointers.set(e.pointerId,this._local(e)),this._pointers.size===2){this._nodeDrag=void 0;let[n,o]=[...this._pointers.values()],{x:a,y:l,k:d}=this._view,h={x:(n.x+o.x)/2,y:(n.y+o.y)/2};this._pinch={dist:Math.hypot(n.x-o.x,n.y-o.y)||1,k:d,wx:(h.x-a)/d,wy:(h.y-l)/d},this._drag&&(this._drag.moved=!0),e.currentTarget.setPointerCapture(e.pointerId);return}let t=e.target.closest("[data-node-id]"),i=t?.dataset.nodeId;if(this._edit&&i){if(this._saving||!this._canEdit(this._entry,this._scene(this._entry)))return;let n=this._edit.positions.get(i);if(!n)return;this._nodeDrag={pointer:e.pointerId,id:i,x:e.clientX,y:e.clientY,start:n,moved:!1},t?.focus({preventScroll:!0}),e.currentTarget.setPointerCapture(e.pointerId);return}this._drag={id:e.pointerId,x:e.clientX,y:e.clientY,vx:this._view.x,vy:this._view.y,moved:!1}}_onPointerMove(e){e.pointerType==="mouse"&&(this._touch=!1),this._pointers.has(e.pointerId)&&this._pointers.set(e.pointerId,this._local(e));let t=this._pinch;if(t&&this._pointers.size>=2){let[l,d]=[...this._pointers.values()],h=Math.min(4,Math.max(this._minK(),t.k*Math.hypot(l.x-d.x,l.y-d.y)/t.dist)),u={x:(l.x+d.x)/2,y:(l.y+d.y)/2};this._view={k:h,x:u.x-t.wx*h,y:u.y-t.wy*h},this._userMoved=!0,this._pinned=void 0;return}let i=this._nodeDrag;if(i&&this._edit&&i.pointer===e.pointerId&&!this._saving){let l=e.clientX-i.x,d=e.clientY-i.y;if(!i.moved&&Math.hypot(l,d)<4)return;i.moved=!0,this._edit.move(i.id,i.start.x+l/this._view.k,i.start.y+d/this._view.k,this._snap?20:1),this._draftChanged();return}let n=this._drag;if(!n||n.id!==e.pointerId)return;let o=e.clientX-n.x,a=e.clientY-n.y;!n.moved&&Math.hypot(o,a)<4||(n.moved||e.currentTarget.setPointerCapture(e.pointerId),n.moved=!0,this._userMoved=!0,this._hover=void 0,this._pinned=void 0,this._view={...this._view,x:n.vx+o,y:n.vy+a})}_onPointerUp(e){if(this._pointers.delete(e.pointerId),this._nodeDrag?.pointer===e.pointerId){e.type==="pointercancel"&&this._nodeDrag.moved&&this._edit&&(this._edit.move(this._nodeDrag.id,this._nodeDrag.start.x,this._nodeDrag.start.y),this._draftChanged()),this._nodeDrag=void 0;return}if(this._pinch){if(this._pointers.size<2){this._pinch=void 0;let[t]=[...this._pointers.entries()],i=e.currentTarget.getBoundingClientRect();this._drag=t?{id:t[0],x:t[1].x+i.left,y:t[1].y+i.top,vx:this._view.x,vy:this._view.y,moved:!0}:void 0}return}this._drag?.moved&&e.type==="pointerup"?e.currentTarget?.addEventListener("click",t=>t.stopPropagation(),{capture:!0,once:!0}):!this._drag?.moved&&e.type==="pointerup"&&!e.target.closest(".node, .tooltip.pinned, .controls, .find")&&(this._pinned=void 0),this._drag=void 0}_zoom(e){let t=this.renderRoot.querySelector(".viewport");t&&this._zoomAt(t.clientWidth/2,t.clientHeight/2,e)}_onDoubleClick(e){if(this._edit&&e.target.closest(".node")||(window.clearTimeout(this._openTimer),e.target.closest(".controls, .tooltip.pinned, .find")))return;let t=e.currentTarget.getBoundingClientRect();this._zoomAt(e.clientX-t.left,e.clientY-t.top,2)}_resetView(){this._userMoved=!1,this._fit()}_click(e,t){t.stopPropagation(),!this._edit&&(window.clearTimeout(this._openTimer),this._openTimer=window.setTimeout(()=>this._open(e),rs))}_open(e){this._edit||(e.kind==="site"&&e.target?(this._path=[...this._path.length?this._path:[this._currentLayout(this._entry)],e.target],this._hover=void 0,this._pinned=void 0):e.device&&(this._pinned={node:e,...this._placeBeside(e,56)},this._hover=void 0,this._copied=!1))}_goTo(e){this._leaveEdit()&&(this._path=this._path.slice(0,e+1),this._hover=void 0)}_selectRoot(e){this._leaveEdit()&&(this._path=[e],this._hover=void 0)}_onNodeKey(e,t){if(this._edit&&t.restId){let n={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(n){if(e.preventDefault(),e.stopPropagation(),this._saving||!this._canEdit(this._entry,this._scene(this._entry)))return;let o=this._edit.positions.get(t.restId),a=(this._snap?20:1)*(e.shiftKey?5:1);this._edit.move(t.restId,o.x+n[0]*a,o.y+n[1]*a,this._snap?20:1),this._draftChanged()}return}(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._open(t))}_showHover(e,t){this._edit||this._drag?.moved||this._touch||this._pinned||this.renderRoot.querySelector(".viewport")&&(this._hover={node:e,...this._placeBeside(e)},t.stopPropagation())}_placeBeside(e,t=0){let i=this.renderRoot.querySelector(".viewport"),{x:n,y:o,k:a}=this._view,l=300,d=e.device?.product,h=e.device?Math.min(9,gt(this._entry,e.device,this._memoFor(this._entry).byKey).length):0,u=(d?.image_large?340:230)+(d?.ports?70:0)+h*18+t,m=(e.x+z/2)*a+n+12,g=(e.x-z/2)*a+n-12-l,v=m+l<=i.clientWidth-8,f=e.y*a+o-u/2;return{x:Math.max(8,v||g<8?Math.min(m,i.clientWidth-l-8):g),y:Math.max(8,Math.min(f,i.clientHeight-u-8))}}render(){let e=this._entry,t=this._config?.height??440;if(!e)return this.renderWaiting(`height:${t}px`);let i=this._scene(e);this._prepareRoutes(i);let n=this._rootLayouts(e),o=this._path.length?this._path:[i.layout],a=new Map(i.nodes.map(_=>[_.id,_])),l=i.links.map(_=>this._linkInfo(_,a)).filter(_=>_!==void 0),d=ls.filter(_=>l.some(k=>k.kind===_)),{x:h,y:u,k:m}=this._view,g=e.layouts.find(_=>_.name===i.layout),v=this._alert?e.alerts.find(_=>_.id===this._alert):void 0,f=v?v.devices_on>0?this._ruleDevices.get(this.hass,e.entry_id,v.id):[]:void 0;this._lit=Array.isArray(f)?new Set(f):void 0;let w=this._find.trim().toLowerCase(),b=w?i.nodes.filter(_=>this._nodeMatches(_,w)):[];this._found=w?new Set(b.map(_=>_.id)):void 0;let x=i.nodes.filter(_=>_.device?C(_.device)!=="ok":_.site?_.site.status!=="ok":!1),$=this._edit?"lod-full editing":m<ns?"lod-dot":m<ri?"lod-text":"lod-full";return c`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:sitemap-outline"></ha-icon>
          <div class="crumbs">
            ${this._config.title?c`<span class="title">${this._config.title}</span>`:p}
            ${o.map((_,k)=>c`
                ${k?c`<ha-icon class="sep" icon="mdi:chevron-right"></ha-icon>`:p}
                <button class="crumb ${k===o.length-1?"current":""}" @click=${()=>this._goTo(k)}>
                  ${_===te?"All devices":_}
                </button>
              `)}
          </div>
          <div class="spacer"></div>
          ${!this._edit&&this._canEdit(e,i)?c`<button class="tool edit-tool" @click=${this._startEdit}><ha-icon icon="mdi:pencil-outline"></ha-icon> Edit layout</button>`:p}
          ${!this._edit&&this._canRebuild(e,i)?c`<button class="tool" title="Rebuild links from detected ports" aria-label="Rebuild links"
                @click=${()=>this._rebuild={layout:i.layout,state:"confirm"}}>
                <ha-icon icon="mdi:cable-data"></ha-icon></button>`:p}
          ${n.length>1?c`<div class="roots">
                ${n.map(_=>c`<button class="pill ${o[0]===_?"on":""}" @click=${()=>this._selectRoot(_)}>${_}</button>`)}
              </div>`:p}
        </div>
        ${g?.comment?c`<div class="subtitle">${g.comment}</div>`:p}
        ${this._edit?this._renderEdit(e,i):this._editMessage?c`<div class="subtitle" role="status">${this._editMessage}</div>`:p}
        ${v?c`<div class="hl">
              <ha-icon icon="mdi:bell-alert-outline"></ha-icon>
              <span>${Array.isArray(f)?`${f.length} device${f.length===1?"":"s"} where "${v.name}" is active`:f==="loading"?`Finding the devices where "${v.name}" is active\u2026`:`The devices where "${v.name}" is active can't be listed (console access)`}</span>
              <span class="spacer"></span>
              <button class="hl-close" title="Show every device" @click=${()=>this._alert=""}><ha-icon icon="mdi:close"></ha-icon></button>
            </div>`:p}
        ${this._rebuild?.layout===i.layout?this._renderRebuild(this._rebuild):p}
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
            class="world ${$}"
            style="width:${i.width}px;height:${i.height}px;transform:translate(${h}px,${u}px) scale(${m});--inv:${1/m}"
          >
            <svg class="wires" width=${i.width} height=${i.height}>
              ${l.map(_=>this._renderLink(_))}
            </svg>
            ${this._config.show_ports?l.map(_=>this._renderPorts(_)):p}
            ${this._config.show_comments?l.map(_=>this._renderComment(_)):p}
            ${i.nodes.map(_=>this._renderNode(_))}
          </div>
          ${i.nodes.length?p:c`<div class="nothing">${i.layout===te?"No devices on the controller yet.":"This layout has no nodes yet."}</div>`}
          ${this._pinned?this._renderTooltip(this._pinned,!0):p}
          ${this._hover&&!this._pinned?this._renderTooltip(this._hover):p}
          ${this._hoverLink&&!this._hover&&!this._pinned?this._renderLinkTooltip(this._hoverLink):p}
          ${i.nodes.length>1?c`<div class="find">
                <ha-icon icon="mdi:magnify"></ha-icon>
                <input type="search" placeholder="Find on map" aria-label="Find on map" .value=${this._find}
                  @input=${_=>this._find=_.target.value}
                  @keydown=${_=>{_.key==="Enter"&&this._zoomTo(b),_.key==="Escape"&&(this._find="")}} />
                ${w?c`<span class="hits">${b.length}</span>`:p}
              </div>`:p}
          <div class="controls">
            <button title="Zoom in (or double-click the map)" @click=${()=>this._zoom(1.6)}><ha-icon icon="mdi:plus"></ha-icon></button>
            <button title="Zoom out" @click=${()=>this._zoom(1/1.6)}><ha-icon icon="mdi:minus"></ha-icon></button>
            <button title="Show the whole map" @click=${this._resetView}><ha-icon icon="mdi:fit-to-screen-outline"></ha-icon></button>
            ${x.length?c`<button class="problems" title="Zoom to what needs attention (${x.length})" @click=${()=>this._zoomTo(x)}>
                  <ha-icon icon="mdi:alert-circle-outline"></ha-icon></button>`:p}
          </div>
          <div class="legend">
            ${["ok","update","alert","offline"].map(_=>c`<span class="status-${_}"><i class="dot"></i>${L[_]}</span>`)}
            ${d.map(_=>c`<span><i class="wire-sample k-${_}"></i>${oi[_]}</span>`)}
            ${l.some(_=>_.poe)?c`<span><i class="poe-sample"></i>PoE power</span>`:p}
          </div>
        </div>
      </ha-card>
    `}_prepareRoutes(e){if(this._config.link_style!=="elbow")return;let t=JSON.stringify([e.nodes.map(a=>[a.id,a.x,a.y]),e.links.map(a=>[a.id,a.node1,a.node2])]);if(this._routes?.key===t)return;let i=new Ue(e.nodes,z,W),n=new Map(e.nodes.map(a=>[a.id,a])),o=new Map;for(let a of[...e.links].sort((l,d)=>l.id.localeCompare(d.id))){let l=n.get(a.node1),d=n.get(a.node2);l&&d&&o.set(a.id,i.route(l,d))}this._routes={key:t,paths:o}}_route(e){return(this._config.link_style==="elbow"?this._routes?.paths.get(e.link.id):void 0)??[e.a,e.b]}_canEdit(e,t){return e.available&&e.actions&&!!this.hass.user?.is_admin&&t.layout!==te&&t.nodes.length>0&&e.nodes.filter(i=>i.layout===t.layout).every(i=>!!i.revision)}_startEdit(){let e=this._entry,t=this._scene(e);this._canEdit(e,t)&&(window.clearTimeout(this._openTimer),this._clearHover(),this._pinned=void 0,this._rebuild=void 0,this._edit=new Ke(e.entry_id,t.layout,t.origin,e.nodes,t.nodes),this._userMoved=!0,this._editMessage="",this._draftChanged())}_draftChanged(){this._memo=void 0,this.requestUpdate()}_cancelEdit(){this._saving||(this._edit=void 0,this._nodeDrag=void 0,this._editMessage="",this._draftChanged(),this.updateComplete.then(()=>this._fit()))}_leaveEdit(){return this._saving?!1:this._edit?.changes().length?(this._editMessage="Save or cancel your changes before opening another layout.",!1):(this._edit=void 0,this._memo=void 0,!0)}async _saveEdit(){let e=this._edit;if(!e||this._saving||!this._canEdit(this._entry,this._scene(this._entry)))return;let t=e.changes();if(t.length){if(t.length>500){this._editMessage="Save at most 500 changed nodes at a time.";return}this._saving=!0,this._editMessage="",this._nodeDrag=void 0;try{let i=await this.hass.connection.sendMessagePromise({type:"cmr/move_nodes",entry_id:e.entryId,layout:e.layout,nodes:t});if(this._edit!==e)return;if(e.acknowledge(i.saved),i.failed.length)this._editMessage=`${i.saved.length} saved; ${i.failed.length} failed. `+i.failed.map(n=>`${e.originals.get(n.id)?.name??n.id}: ${n.message}`).join("; ");else{this._edit=void 0,this._memo=void 0;let n=this._scene(this._entry).origin;this._view={...this._view,x:this._view.x+(n.x-e.origin.x)*this._view.k,y:this._view.y+(n.y-e.origin.y)*this._view.k},this._editMessage=`Saved ${i.saved.length} node position${i.saved.length===1?"":"s"} to CMR.`}this._draftChanged()}catch(i){this._edit===e&&(this._editMessage=i?.message??String(i))}finally{this._saving=!1}}}_renderEdit(e,t){let i=this._edit.changes().length;return c`<div class="edit-bar">
      <div class="edit-controls">
        <span><b>Edit layout</b> · ${i} changed</span>
        <label><input type="checkbox" .checked=${this._snap} ?disabled=${this._saving}
          @change=${n=>{this._snap=n.target.checked}} /> Snap to grid</label>
        <span class="spacer"></span>
        <button class="pill" ?disabled=${this._saving} @click=${this._cancelEdit}>Cancel</button>
        <button class="pill on" ?disabled=${this._saving||!i||!this._canEdit(e,t)} @click=${this._saveEdit}>
          ${this._saving?"Saving\u2026":"Save to CMR"}</button>
      </div>
      <div class="edit-hint">Drag nodes or use arrow keys when focused. Changes apply to CMR when saved.</div>
      ${this._canEdit(e,t)?p:c`<div role="status">Saving is unavailable. Check the connection and your action permissions.</div>`}
      ${this._editMessage?c`<div class="edit-message" role="status">${this._editMessage}</div>`:p}
    </div>`}_canRebuild(e,t){return e.actions&&!!this.hass.user?.is_admin&&t.layout!==te&&t.nodes.filter(i=>i.kind==="device").length>1}_renderRebuild(e){let t=c`<button class="hl-close" title="Close" @click=${()=>this._rebuild=void 0}>
      <ha-icon icon="mdi:close"></ha-icon></button>`;return e.state==="confirm"?c`<div class="hl rebuild">
        <ha-icon icon="mdi:cable-data"></ha-icon>
        <span>Create the links of <b>${e.layout}</b> from the ports the controller detected between its devices?</span>
        <span class="spacer"></span>
        <button class="pill on" @click=${()=>this._rebuildLinks(e.layout)}>Rebuild links</button>
        ${t}
      </div>`:c`<div class="hl rebuild ${e.state}">
      <ha-icon icon=${e.state==="error"?"mdi:alert-circle-outline":"mdi:cable-data"}></ha-icon>
      <span>${e.state==="busy"?`Rebuilding the links of ${e.layout}\u2026`:e.text}</span>
      <span class="spacer"></span>
      ${e.state==="busy"?p:t}
    </div>`}async _rebuildLinks(e){this._rebuild={layout:e,state:"busy"};try{await this.hass.connection.sendMessagePromise({type:"cmr/rebuild_links",entry_id:this._entry.entry_id,layout:e}),this._rebuild={layout:e,state:"done",text:"Links rebuilt. Connections the controller can't see (a VPN, a switch it doesn't manage) stay yours to draw."}}catch(t){this._rebuild={layout:e,state:"error",text:t?.message??String(t)}}}_linkState(e,t){let i=a=>a?.kind==="device"?a.device.connected:a?.kind==="site"?a.site.online>0:void 0,n=i(e),o=i(t);return n===!1||o===!1?"down":n===void 0||o===void 0?"unknown":"up"}_linkInfo(e,t){let i=t.get(e.node1),n=t.get(e.node2);if(!i||!n)return;let o=e.ports,a=[i.name,n.name],l=!1,d;!o.length&&i.kind==="site"&&n.kind==="site"&&(l=!0,d=this._cableBetween(i.target,n.target),d&&(o=d.ports,a=d.names));let h=o[0],u;if(h){let g=[_t(h.a.interface),_t(h.b.interface)];u=g.includes("fiber")?"fiber":g.includes("wireless")?"wireless":g.every(v=>v==="copper")?"copper":"logical"}else u=l&&!d?"uplink":"unknown";let m;return h?.a.poe==="powered-on"?m={from:i,to:n,port:h.a.interface}:h?.b.poe==="powered-on"&&(m={from:n,to:i,port:h.b.interface}),{link:e,a:i,b:n,state:this._linkState(i,n),kind:u,ports:o,endNames:a,poe:m}}_cableBetween(e,t){let i=this._entry,n=this._memoFor(i),o=`${e}\0${t}`;if(n.cables.has(o))return n.cables.get(o);let a=new Set(this._devicesIn(i,e).map(m=>m.key)),l=new Set(this._devicesIn(i,t).map(m=>m.key)),d=new Map(i.nodes.map(m=>[`${m.layout}\0${m.name}`,m.device_key])),h=n.byKey,u;for(let m of i.links){let g=d.get(`${m.layout}\0${m.node1}`),v=d.get(`${m.layout}\0${m.node2}`);if(!g||!v)continue;let f=a.has(g)&&l.has(v);if(!f&&!(a.has(v)&&l.has(g)))continue;let[w,b]=f?[g,v]:[v,g],x=f?m.ports:m.ports.map(_=>({a:_.b,b:_.a})),$={ports:x,names:[h.get(w)?.identity??w,h.get(b)?.identity??b]};(!u||x.length&&!u.ports.length)&&(u=$)}return n.cables.set(o,u),u}_renderLink(e){let{a:t,state:i,kind:n,poe:o}=e,a=this._route(e),l=vt(a),d=i==="up"&&n!=="unknown"&&n!=="logical";return N`
      <g class="link ${i} k-${n}"
         @mouseenter=${h=>this._showLinkHover(e,h)}
         @mouseleave=${()=>this._hoverLink=void 0}>
        <path class="hit" d=${l}></path>
        <path class="wire" d=${l}></path>
        ${n==="fiber"?N`<path class="core" d=${l}></path>`:p}
        ${d?N`<path class="flow" d=${l}></path>`:p}
        ${o&&i==="up"?N`<circle class="power" r="3.6">
              <animateMotion dur="2.2s" repeatCount="indefinite"
                path=${vt(o.from===t?a:[...a].reverse())}></animateMotion>
            </circle>`:p}
      </g>
    `}_renderPorts(e){let t=e.ports[0];if(!t)return p;let{a:i,b:n}=e,o=this._config.link_style==="elbow"?this._route(e):void 0,a=o?[...o].reverse():void 0,l=[this._chip(i,n,t.a,e.poe?.from===i,void 0,o),this._chip(n,i,t.b,e.poe?.from===n,void 0,a)];return cs(l[0].box,l[1].box)&&(l=[this._chip(i,n,t.a,e.poe?.from===i,-1,o),this._chip(n,i,t.b,e.poe?.from===n,1,a)]),c`${l.map(d=>d.html)}`}_chip(e,t,i,n,o,a){let l=ds(e.x,e.y,t.x-e.x,t.y-e.y,o?4:8);if(a&&a.length>1){let x=Math.sign(a[1].x-a[0].x),$=Math.sign(a[1].y-a[0].y);l={x:a[0].x+x*8,y:a[0].y+$*8,ux:x,uy:$}}let d=i.interface.length*6.6+12+(n?13:0),h=18,u=Math.abs(l.ux)>=Math.abs(l.uy),m=Math.abs(l.ux)<.35?-.5:l.ux>0?0:-1,g=Math.abs(l.uy)<.35?-.5:l.uy>0?0:-1,v=0,f=0;o&&(u?(g=o<0?-1:0,f=o*3):(m=o<0?-1:0,v=o*4));let w=l.x+m*d+v,b=l.y+g*h+f;return{box:{x0:w,y0:b,x1:w+d,y1:b+h},html:c`<div class="port m-${_t(i.interface)} ${n?"poe":""}"
        style="left:${l.x+v}px;top:${l.y+f}px;transform:translate(${m*100}%,${g*100}%)"
        title=${n?`${i.interface}: PoE out, powers ${t.name}`:`${i.interface} (${e.name})`}>
        ${n?c`<ha-icon icon="mdi:flash"></ha-icon>`:p}${i.interface}
      </div>`}}_renderComment(e){let{link:t}=e,i=Qt(this._route(e));return!t.comment||e.ports.length&&this._config.show_ports?p:c`<div class="comment" style="left:${i.x}px;top:${i.y}px" title=${t.comment}>
      ${t.comment}
    </div>`}_showLinkHover(e,t){if(this._edit||this._drag?.moved)return;let i=this.renderRoot.querySelector(".viewport");if(!i)return;let n=i.getBoundingClientRect();this._hoverLink={info:e,x:t.clientX-n.left,y:t.clientY-n.top+14}}_renderLinkTooltip(e){let{info:t}=e,{a:i,b:n,link:o,poe:a,ports:l,endNames:d}=t,h=u=>u.tx||u.rx?c`<span class="mono">↑ ${u.tx??"\u2013"} · ↓ ${u.rx??"\u2013"}</span>`:"\u2013";return c`<div class="tooltip" style="left:${Math.max(8,e.x-150)}px;top:${e.y}px">
      <div class="tt-title">${i.name} ↔ ${n.name}</div>
      ${o.comment?c`<div class="muted">${o.comment}</div>`:p}
      <table>
        <tr><td>Medium</td><td>${oi[t.kind]}</td></tr>
        ${l.map(u=>c`
            <tr><td>${d[0]}</td><td class="mono">${u.a.interface}</td></tr>
            <tr><td>${d[1]}</td><td class="mono">${u.b.interface}</td></tr>
          `)}
        ${a?c`<tr><td>Power</td><td><ha-icon class="inline poe" icon="mdi:flash"></ha-icon>
              ${a.from===i?d[0]:d[1]} <span class="mono">${a.port}</span>
              powers ${a.to===i?d[0]:d[1]}</td></tr>`:p}
        ${l[0]?c`<tr><td>Traffic</td><td>${d[0]}: ${h(l[0].a)}<br />${d[1]}: ${h(l[0].b)}</td></tr>`:p}
      </table>
    </div>`}_renderNode(e){let t=`left:${e.x-z/2}px;top:${e.y-W/2}px;width:${z}px;height:${W}px`;if(e.kind==="site"){let a=e.site;return c`
        <div class="node site status-${a.status} ${this._found&&!this._found.has(e.id)?"dim":""}" style=${t} data-node-id=${e.restId??""}
             role="button" tabindex="0" aria-label="${e.name}, ${a.online} of ${a.total} online, ${this._edit?"use arrow keys to move":"open layout"}"
             @click=${l=>this._click(e,l)} @keydown=${l=>this._onNodeKey(l,e)}
             @mouseenter=${l=>this._showHover(e,l)} @mouseleave=${this._clearHover}
             @focus=${l=>this._showHover(e,l)} @blur=${this._clearHover}>
          <i class="pin"></i>
          <div class="badge"><ha-icon icon=${this._config.icons?.[e.name]??as}></ha-icon></div>
          <div class="text">
            <div class="name">${e.name}</div>
            <div class="sub"><i class="dot"></i>${a.online}/${a.total} online</div>
          </div>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        </div>
      `}if(e.kind==="unknown"||!e.device)return c`
        <div class="node unknown ${this._found&&!this._found.has(e.id)?"dim":""}" style=${t} title="Not a CMR-managed device"
             data-node-id=${e.restId??""} tabindex=${this._edit?0:-1} role="button" aria-label=${e.name}
             @keydown=${a=>this._onNodeKey(a,e)}>
          <i class="pin"></i>
          <div class="badge"><ha-icon icon="mdi:help-network-outline"></ha-icon></div>
          <div class="text"><div class="name">${e.name}</div><div class="sub">Not managed</div></div>
        </div>
      `;let i=e.device,n=C(i),o=this._lit&&!this._lit.has(i.key)||this._found&&!this._found.has(e.id);return c`
      <div class="node device status-${n} ${i.controller?"controller":""} ${o?"dim":""}" style=${t} data-node-id=${e.restId??""}
           role="button" tabindex="0" aria-label="${i.identity}, ${L[n]}"
           @click=${a=>this._click(e,a)} @keydown=${a=>this._onNodeKey(a,e)}
           @mouseenter=${a=>this._showHover(e,a)} @mouseleave=${this._clearHover}
           @focus=${a=>this._showHover(e,a)} @blur=${this._clearHover}>
        <i class="pin"></i>
        ${Q(i)}
        <div class="text">
          <div class="name">${i.identity}</div>
          <div class="sub">${q(i)}</div>
          <div class="ver mono" title=${i.update_available?`${i.version} \u2192 ${i.available_version}`:""}>
            ${i.update_available?c`<span class="up"><ha-icon icon="mdi:arrow-up-circle"></ha-icon>${i.available_version}</span>`:i.version??"\u2013"}
          </div>
        </div>
        ${i.controller?c`<span class="crown" title="CMR controller"><ha-icon icon="mdi:crown-outline"></ha-icon></span>`:p}
        ${i.alerts?.on?c`<span class="count" title="Active alerts">${i.alerts.on}</span>`:p}
      </div>
    `}_renderTooltip(e,t=!1){let{node:i}=e,n;if(i.kind==="site"){let a=i.site;n=c`
        <div class="tt-title">${i.name}</div>
        ${a.comment?c`<div class="muted">${a.comment}</div>`:p}
        <div>${a.online} of ${a.total} devices online</div>
        <div class="muted">Click to open this layout</div>
      `}else if(i.device){let a=i.device,l=this._entry,d=gt(l,a,this._memoFor(l).byKey);n=c`
        <div class="tt-title">${a.identity}${a.controller?c` <span class="chip">controller</span>`:p}</div>
        ${a.product?.image_large?c`<div class="tt-photo"><img src=${a.product.image_large} alt="" referrerpolicy="no-referrer" /></div>`:p}
        <div class="muted">${[q(a),ge(a),a.arch].filter(Boolean).join(" \xB7 ")}</div>
        ${a.product?.ports?c`${si(a.product,d)}<div class="muted tt-ports">${ft(a.product.ports)}</div>`:p}
        <table>
          <tr><td>Status</td><td class="status-${C(a)}"><i class="dot"></i> ${L[C(a)]}${Z(a)?` (${Z(a)})`:""}${a.stale?" \xB7 stale data":""}</td></tr>
          ${a.connected&&a.connected_time!=null?c`<tr><td>Connected</td><td>for ${me(a.connected_time)}</td></tr>`:p}
          <tr><td>Version</td><td class="mono">${a.version??"\u2013"}</td></tr>
          <tr><td>Channel</td><td>${a.channel??"\u2013"}${a.available_version&&a.available_version!==a.version?c` <span class="muted">(${a.update_available?"update to":"offers"} <span class="mono">${a.available_version}</span>)</span>`:p}</td></tr>
          ${a.address?c`<tr><td>Address</td><td><span class="mono">${a.address}</span>${t&&navigator.clipboard?c`<button class="copy" title="Copy the address" @click=${()=>this._copy(a.address)}>
                    ${this._copied?"copied":c`<ha-icon icon="mdi:content-copy"></ha-icon>`}</button>`:p}</td></tr>`:p}
          <tr><td>Uptime</td><td>${me(a.uptime)}</td></tr>
          ${a.labels.length?c`<tr><td>Labels</td><td>${a.labels.map(h=>c`<span class="chip">${h}</span> `)}</td></tr>`:p}
          ${a.alerts?c`<tr><td>Alerts</td><td>${a.alerts.on} active of ${a.alerts.total} rules</td></tr>`:p}
          ${d.length?c`<tr><td>Links</td><td>
                ${d.slice(0,8).map(h=>c`<div>
                    <span class="mono">${h.interface}</span>${h.poe?c` <ha-icon class="inline poe" icon="mdi:flash"></ha-icon>`:p}
                    → ${h.peer}${h.up===!1?c` <span class="muted">(down)</span>`:p}
                  </div>`)}
                ${d.length>8?c`<div class="muted">and ${d.length-8} more</div>`:p}
              </td></tr>`:p}
        </table>
        ${t?this._popoverActions(a):p}
      `}else return c``;let o=t?`;max-height:calc(100% - ${e.y+8}px)`:"";return c`<div class="tooltip ${t?"pinned":""}" style="left:${Math.max(8,e.x)}px;top:${e.y}px${o}"
        role=${t?"dialog":p} aria-label=${t?i.name:p}>
      ${t?c`<button class="pop-close" title="Close" @click=${()=>this._pinned=void 0}><ha-icon icon="mdi:close"></ha-icon></button>`:p}
      ${n}
    </div>`}_popoverActions(e){let t=this._config.views?.devices,i=e.entities,n=this._reboot?.key===e.key?this._reboot:void 0;return n?.state==="confirm"?c`<div class="pop-confirm">
        <span>Reboot <b>${e.identity}</b>? It is back in about a minute; its clients lose the connection meanwhile.</span>
        <div class="pop-actions">
          <button class="pill on" @click=${()=>this._rebootDevice(e.key,i.reboot)}><ha-icon icon="mdi:restart"></ha-icon>Reboot</button>
          <button class="pill" @click=${()=>this._reboot=void 0}>Cancel</button>
        </div>
      </div>`:c`${n?c`<div class="pop-note ${n.state}">${n.text}</div>`:p}
    <div class="pop-actions">
      ${e.update_available&&i.update?c`<button class="pill on" @click=${()=>P(this,i.update)}><ha-icon icon="mdi:arrow-up-circle"></ha-icon>Update</button>`:p}
      ${e.device_id?c`<button class="pill" @click=${()=>R(`/config/devices/device/${e.device_id}`)}>Device page</button>`:p}
      ${t?c`<button class="pill" @click=${()=>R(O(t,{cmr_search:e.identity}))}>In Devices</button>`:p}
      ${i.connected?c`<button class="pill" @click=${()=>P(this,i.connected)}>History</button>`:p}
      ${i.reboot&&e.connected&&!e.pending&&n?.state!=="busy"?c`<button class="pill" @click=${()=>this._reboot={key:e.key,state:"confirm"}}>
            <ha-icon icon="mdi:restart"></ha-icon>Reboot</button>`:p}
    </div>`}async _rebootDevice(e,t){this._reboot={key:e,state:"busy",text:"Asking the controller to reboot it\u2026"};try{await this.hass.callService("button","press",{entity_id:t}),this._reboot={key:e,state:"done",text:"Rebooting. It shows offline until it is back, in about a minute."}}catch(i){this._reboot={key:e,state:"error",text:i?.message??String(i)}}}async _copy(e){try{await navigator.clipboard.writeText(e),this._copied=!0}catch{this._copied=!1}}static{this.styles=[D,ni,E`
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
        /* One finger pans the map and two zoom it, as in Home Assistant's own map card. */
        position: relative; overflow: hidden; cursor: grab; touch-action: none;
        background:
          radial-gradient(circle, var(--cmr-line) 1px, transparent 1.2px) 0 0 / 22px 22px;
        border-top: 1px solid var(--cmr-line);
      }
      .viewport:active { cursor: grabbing; }
      .world { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
      .world.editing .node { cursor: grab; }
      .world.editing .node:active { cursor: grabbing; }
      .wires { position: absolute; inset: 0; overflow: visible; }
      .edit-bar { padding: 10px 16px; border-top: 1px solid var(--cmr-line); }
      .edit-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .edit-controls label { display: flex; align-items: center; gap: 4px; }
      .edit-hint { color: var(--cmr-muted); font-size: 12px; margin-top: 8px; }
      .edit-message { margin-top: 8px; overflow-wrap: anywhere; }
      .editing .node:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 4px; }
      .editing .link .hit { pointer-events: none; }
      button:disabled { opacity: 0.5; cursor: default; }

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

      /* Level of detail: zoomed far out a node is a status dot of constant
         screen size (--inv is 1/zoom), then its name only, then the card. */
      .node .pin { display: none; }
      .lod-dot .node { background: none; border-color: transparent; box-shadow: none; }
      .lod-dot .node > :not(.pin) { visibility: hidden; }
      .lod-dot .node .pin {
        display: block; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
        width: calc(12px * var(--inv)); height: calc(12px * var(--inv)); border-radius: 50%;
        background: var(--status, var(--cmr-muted)); box-shadow: 0 0 0 calc(2px * var(--inv)) var(--cmr-surface);
      }
      .lod-dot .port, .lod-dot .comment, .lod-text .port, .lod-text .comment { display: none; }
      .lod-text .node .badge, .lod-text .node .sub, .lod-text .node .ver, .lod-text .node .chev,
      .lod-text .node .crown, .lod-text .node .count { display: none; }
      /* Names only: the status dot (the same one the far zoom draws) leads the name. */
      .lod-text .node { justify-content: center; border-color: color-mix(in srgb, var(--status, var(--cmr-line)) 45%, var(--cmr-line)); }
      .lod-text .node .pin {
        display: block; flex: none; width: 14px; height: 14px; border-radius: 50%;
        background: var(--status, var(--cmr-muted));
      }
      .lod-text .node .name { font-size: 18px; text-align: center; }

      .find {
        position: absolute; left: 10px; top: 10px; z-index: 2; display: flex; align-items: center; gap: 6px;
        padding: 4px 8px; border-radius: 10px; background: var(--cmr-surface); border: 1px solid var(--cmr-line);
        color: var(--cmr-muted); --mdc-icon-size: 16px; cursor: auto;
      }
      .find input { all: unset; width: 130px; font-size: 13px; color: var(--primary-text-color); }
      .find .hits { font-size: 11px; font-variant-numeric: tabular-nums; }
      .controls .problems { color: var(--cmr-alert); }

      .tooltip.pinned { pointer-events: auto; z-index: 4; overflow: auto; cursor: auto; box-sizing: border-box; }
      .pop-close {
        all: unset; cursor: pointer; position: absolute; top: 6px; right: 6px; line-height: 0; padding: 3px;
        border-radius: 50%; color: var(--cmr-muted); --mdc-icon-size: 18px;
      }
      .pop-close:hover { color: var(--primary-text-color); background: var(--cmr-surface-2); }
      .pop-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; --mdc-icon-size: 16px; }
      .pop-confirm { margin-top: 10px; font-size: 13px; line-height: 1.4; }
      .pop-note { margin-top: 10px; font-size: 12.5px; color: var(--cmr-muted); }
      .pop-note.error { color: var(--cmr-offline); }
      .copy {
        all: unset; cursor: pointer; margin-left: 6px; color: var(--cmr-muted); font-size: 11px;
        --mdc-icon-size: 14px; vertical-align: -2px;
      }
      .copy:hover { color: var(--primary-text-color); }
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
      .hl.rebuild { background: var(--cmr-surface-2); }
      .hl.rebuild > ha-icon { color: var(--cmr-muted); }
      .hl.rebuild.error > ha-icon { color: var(--cmr-offline); }
      .tool {
        all: unset; cursor: pointer; line-height: 0; padding: 5px; border-radius: 8px;
        color: var(--cmr-muted); --mdc-icon-size: 18px;
      }
      .tool:hover { color: var(--primary-text-color); background: var(--cmr-surface-2); }
      .edit-tool { display: inline-flex; align-items: center; gap: 4px; line-height: 1.4; font-size: 13px; white-space: nowrap; }

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
      .tt-photo img { max-width: 88%; max-height: 92px; object-fit: contain; }
      .tooltip table { width: 100%; border-collapse: collapse; margin-top: 6px; }
      .tooltip td { padding: 2px 0; vertical-align: top; }
      .tooltip td:first-child { color: var(--cmr-muted); width: 1%; white-space: nowrap; padding-right: 12px; }
      .tooltip td i.dot { display: inline-block; }
      .tt-ports { text-align: center; font-size: 11px; }

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
      @media (max-width: 600px) {
        .legend { font-size: 10px; gap: 2px 8px; max-width: calc(100% - 64px); }
        .find input { width: 84px; }
      }
    `]}};var ps=12,hs={done:"mdi:check-circle",failed:"mdi:close-circle",processing:"mdi:progress-upload","version check":"mdi:magnify","waiting devices":"mdi:timer-sand",queued:"mdi:tray-full","queued (busy)":"mdi:tray-full",scheduled:"mdi:calendar-clock",cancelled:"mdi:cancel"},bt=new Set(["processing","version check","waiting devices","queued","queued (busy)"]),ai=new Set([...bt,"scheduled"]),us=new Set(["processing","version check","waiting devices"]),ms=new Set(["long-term","stable","testing","development"]);function fe(r){return(r??"").split(",").map(s=>s.trim()).filter(Boolean)}function vs(r){let[s,e]=(r.success??"").split("/").map(Number);return r.state==="done"&&e&&s<e?"failed":r.state??"scheduled"}function gs(r){return(r??"").replace(/([a-z])(\d)/g,"$1 $2")}var qe=class extends A{constructor(){super();this._jobDevices=new $e(()=>this.requestUpdate());this._open="",this._outcome={}}static{this.properties={_open:{state:!0},_confirm:{state:!0},_outcome:{state:!0}}}setConfig(e){this._config={jobs:5,...e}}static getConfigForm(){return{schema:[I,{name:"title",selector:{text:{}}},{name:"jobs",selector:{number:{min:0,max:30,mode:"box"}}}],computeLabel:T({entry_id:"Controller",title:"Title",jobs:"Recent jobs to show"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){return 6}render(){let e=this._entry;if(!e)return this.renderWaiting();let t=e.devices.filter(o=>o.update_available).length,i=e.upgrade_rules.filter(o=>o.dynamic!=="true"||e.devices.some(a=>a.upgrade_rule===o.name)),n=[...e.upgrade_jobs].sort((o,a)=>(a.schedule_time??"").localeCompare(o.schedule_time??"")).slice(0,this._config.jobs??5);return c`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:update"></ha-icon>
          <span>${this._config.title??"Upgrades"}</span>
          ${t?c`<span class="chip update">${t} available</span>`:c`<span class="chip">up to date</span>`}
        </div>
        ${this.renderStale(e)}

        ${i.length?i.map(o=>this._rule(e,o)):c`<div class="empty small">No upgrade rules. Devices are checked against their channel only.</div>`}

        ${n.length?c`<div class="section section-label">Recent jobs</div>
              <div class="jobs">${n.map(o=>this._job(e,o))}</div>`:p}
      </ha-card>
    `}_job(e,t){let i=vs(t),n=i==="failed"?"failed":bt.has(i)?"running":i==="scheduled"?"scheduled":i==="done"?"done":"other",o=i==="scheduled"&&t.starts_in?`starts in ${gs(t.starts_in)}`:`${t.schedule_time??""}${t.run_time?` \xB7 took ${t.run_time}`:""}`,a=!!t.id&&this._open===t.id,l=()=>{t.id&&(this._open=a?"":t.id,this._confirm=void 0)};return c`<div class="job js-${n} ${t.id?"opens":""} ${a?"open":""}" role="button" tabindex="0"
        aria-expanded=${a?"true":"false"} @click=${l}
        @keydown=${d=>(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),l())}>
        <ha-icon icon=${hs[i]??"mdi:circle-outline"} title=${i}></ha-icon>
        <div class="what">
          <div>${fe(t.labels).length?c`<span class="mono">${t.channel??"?"}</span> → ${fe(t.labels).join(", ")}`:c`Install ${t.channel?c`<span class="mono">${t.channel}</span>`:"from each device's channel"}`}
            ${bt.has(i)?c`<span class="chip update">${i}</span>`:p}</div>
          <div class="muted small">${o}</div>
        </div>
        <div class="ok mono">${t.success||(i==="scheduled"?"":"\u2013")}</div>
        ${t.id?c`<ha-icon class="chev" icon=${a?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>`:p}
      </div>
      ${a?this._jobDetail(e,t,i):p}`}_jobDetail(e,t,i){let n=this._jobDevices.get(this.hass,e.entry_id,t),o=new Map(e.devices.map(m=>[m.key,m])),a;if(n==="loading")a=c`<div class="muted small">Loading the job's devices…</div>`;else if(n==="unsupported")a=c`<div class="muted small">This controller can't list a job's devices.</div>`;else if(n==="error")a=c`<div class="muted small">The job's devices couldn't be read.</div>`;else if(!n.length)a=c`<div class="muted small">${i==="scheduled"?"The controller lists the devices when the job starts.":"No devices."}</div>`;else{let m=!ai.has(t.state??"scheduled"),g=!!t.channel&&!ms.has(t.channel);a=c`${n.map(v=>this._jobDevice(v,o.get(v.device_key??""),m))}
        ${n.some(v=>v.error==="no upgrade available")?c`<div class="muted small note">CMR counts <i>no upgrade available</i> as a failed upgrade: the
              device already ran the target version, or that version's packages weren't found.
              ${g?c`This job pins <span class="mono">${t.channel}</span>, and the controller installs a pinned
                    version only from packages it already has (its packages directory or cache). An upgrade through
                    the device's channel downloads them.`:p}</div>`:p}`}let l=t.state??"scheduled",d=[];e.actions&&this.hass.user?.is_admin&&(l==="scheduled"&&d.push("run_next"),ai.has(l)&&d.push("cancel"));let h=this._outcome[t.id],u=this._confirm?.job===t.id?this._confirm.action:void 0;return c`<div class="job-detail">
      ${a}
      ${u?c`<div class="confirm">
            <span>${u==="run_next"?fe(t.labels).length?"Run this job now? It starts as a new job, and this one stays scheduled.":"Run this install now instead of at its scheduled time?":us.has(l)?"Stop this job? Devices not upgraded yet are marked cancelled; an install already under way can still finish when its device reboots.":"Cancel this job?"}</span>
            <button class="pill on" @click=${()=>this._act(e,t.id,u)}>
              ${u==="run_next"?"Run now":"Cancel job"}</button>
            <button class="pill" @click=${()=>this._confirm=void 0}>Back</button>
          </div>`:d.length&&h!=="busy"?c`<div class="actions">
              ${d.map(m=>c`<button class="pill" @click=${()=>this._confirm={job:t.id,action:m}}>
                ${m==="run_next"?"Run now":"Cancel job"}</button>`)}
            </div>`:p}
      ${h?c`<div class="muted small">${h==="busy"?"Sending\u2026":h}</div>`:p}
    </div>`}_jobDevice(e,t,i){let n=i&&!e.error&&e.state==="rebooting"&&!!e.upgrade_version&&e.current_version===e.upgrade_version,o=e.error?"failed":e.state==="done"||n?"done":e.state==="cancelled"?"other":"running",a={failed:"mdi:alert-circle",done:"mdi:check-circle",other:"mdi:cancel",running:"mdi:progress-clock"}[o],l=e.upgrade_version&&e.upgrade_version!==e.current_version?`${e.current_version??"?"} \u2192 ${e.upgrade_version}`:e.current_version??"";return c`<div class="jd js-${o}">
      <ha-icon icon=${a}></ha-icon>
      ${t?.entities.update?c`<button class="name" @click=${()=>P(this,t.entities.update)}>${e.identity}</button>`:c`<span class="name">${e.identity}</span>`}
      <span class="mono muted">${l}</span>
      <span class="chip">${n?"upgraded":e.state??"?"}</span>
      ${e.error?c`<span class="reason">${e.error}</span>`:p}
      ${n?c`<span class="muted small">restarted before the job could record it</span>`:p}
    </div>`}async _act(e,t,i){this._confirm=void 0,this._outcome={...this._outcome,[t]:"busy"};let n;try{await Kt(this.hass,e.entry_id,t,i),n=i==="run_next"?"Started as a new job.":"Job removed; the list updates on the next poll."}catch(o){n=o?.message??String(o)}this._outcome={...this._outcome,[t]:n}}_rule(e,t){let i=e.devices.filter(d=>d.upgrade_rule===t.name),n=fe(t.order),o=n.length?n.map(d=>({label:d,devices:i.filter(h=>h.labels.includes(d))})):[{label:fe(t.labels).join(", ")||"all",devices:i}],a=new Set(o.flatMap(d=>d.devices.map(h=>h.key))),l=i.filter(d=>!a.has(d.key));return l.length&&o.push({label:"other",devices:l}),c`
      <div class="rule">
        <div class="rule-head">
          <b>${t.name}</b>
          <span class="muted small">
            ${[t.channel&&`channel ${t.channel}`,t.strategy,t.fail_policy&&`on failure: ${t.fail_policy}`].filter(Boolean).join(" \xB7 ")}
          </span>
        </div>
        ${t.comment?c`<div class="muted small comment">${t.comment}</div>`:p}
        <div class="pipeline">
          ${o.map((d,h)=>c`
              ${h?c`<ha-icon class="arrow" icon="mdi:chevron-right"></ha-icon>`:p}
              <div class="step">
                <div class="step-label"><span class="n">${h+1}</span>${d.label}</div>
                ${d.devices.length>ps?this._summary(d.devices):c`<div class="devs">
                      ${d.devices.map(u=>c`<button class="dev status-${C(u)}" title="${u.identity} · ${u.version}"
                          @click=${()=>P(this,u.entities.update)}><ha-icon icon=${ne(u)}></ha-icon></button>`)}
                      ${d.devices.length?p:c`<span class="muted small">none</span>`}
                    </div>`}
              </div>
            `)}
        </div>
      </div>
    `}_summary(e){let t=new Map,i=0;for(let o of e){!o.connected&&!o.controller&&i++;let a=o.version??"?",l=o.update_available?o.available_version??void 0:void 0,d=`${a}\0${l??""}`,h=t.get(d)??{from:a,to:l,count:0};h.count++,t.set(d,h)}let n=this._config.views?.devices;return c`<div class="summary">
      ${[...t.values()].sort((o,a)=>a.count-o.count||o.from.localeCompare(a.from)).map(o=>{let a=c`<b>${o.count}×</b> <span class="mono">${o.from}${o.to?` \u2192 ${o.to}`:""}</span>`,l=`trans ${o.to?"status-update":"status-ok"}`;return n?c`<button class=${l} title="Show these devices"
                @click=${()=>R(O(n,{cmr_version:o.from}))}>${a}</button>`:c`<span class=${l}>${a}</span>`})}
      ${i?c`<span class="trans status-offline"><b>${i}</b> offline</span>`:p}
    </div>`}static{this.styles=[D,E`
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
      .summary { display: flex; flex-wrap: wrap; gap: 4px; }
      .trans {
        all: unset; font-size: 12px; padding: 2px 8px; border-radius: 999px; white-space: nowrap;
        background: color-mix(in srgb, var(--status) 14%, transparent);
      }
      button.trans { cursor: pointer; }
      button.trans:hover { background: color-mix(in srgb, var(--status) 24%, transparent); }
      .section { padding: 4px 16px 4px; }
      .jobs { padding: 0 8px 10px; }
      .job { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 10px; font-size: 13px; }
      .job ha-icon { --mdc-icon-size: 20px; }
      .job.opens { cursor: pointer; }
      .job.opens:hover, .job.open { background: var(--cmr-surface-2); }
      .job .chev { color: var(--cmr-muted); --mdc-icon-size: 18px; }
      .job-detail { margin: 2px 8px 8px 38px; display: grid; gap: 4px; font-size: 12.5px; }
      .jd { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
      .jd ha-icon { --mdc-icon-size: 16px; }
      .jd .name { all: unset; font-weight: 500; }
      .jd button.name { cursor: pointer; }
      .jd button.name:hover { text-decoration: underline; }
      .jd .reason { color: var(--cmr-alert); }
      .js-done.jd ha-icon { color: var(--cmr-ok); }
      .js-failed.jd ha-icon { color: var(--cmr-alert); }
      .js-running.jd ha-icon { color: var(--cmr-update); }
      .js-other.jd ha-icon { color: var(--cmr-muted); }
      .note { margin-top: 2px; }
      .actions, .confirm { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 4px; }
      .confirm span { flex: 1 1 220px; }
      .js-done ha-icon { color: var(--cmr-ok); }
      .js-failed ha-icon { color: var(--cmr-alert); }
      .js-running ha-icon { color: var(--cmr-update); }
      .js-scheduled ha-icon { color: var(--cmr-pending); }
      .js-other ha-icon { color: var(--cmr-muted); }
      .what { flex: 1; min-width: 0; }
      .ok { font-size: 12px; color: var(--cmr-muted); }
    `]}};var fs={be:"Wi-Fi 7",ax:"Wi-Fi 6",ac:"Wi-Fi 5",n:"Wi-Fi 4",g:"802.11g",a:"802.11a"};function _s(r){let s=/^(\d+)ghz-([a-z]+)$/.exec(r??"");if(!s)return r?[r]:[];let e=s[1]==="2"?"2.4":s[1],t=s[1]==="6"&&s[2]==="ax"?"Wi-Fi 6E":fs[s[2]]??s[2];return[`${e} GHz`,t]}function bs(r){if(!r)return null;if(!/^\d+$/.test(r))return`${r.replace(/,/g,", ")} MHz`;let s=Number(r),e=s===2484?14:s>=2412&&s<=2472?(s-2407)/5:s>=5e3&&s<=5900?(s-5e3)/5:s>=5955?(s-5950)/5:null;return e!==null&&Number.isInteger(e)?`channel ${e} (${s} MHz)`:`${s} MHz`}function ys(r){let s=n=>[...new Set(r.filter(o=>o.includes(n)).map(o=>o.match(/^wpa(\d?)/)?.[1]||"1"))].sort().map(o=>o==="1"?"WPA":`WPA${o}`),e=[],t=s("-psk"),i=s("-eap");return t.length&&e.push(`${t.join("/")} Personal`),i.length&&e.push(`${i.join("/")} Enterprise`),r.includes("owe")&&e.push("Enhanced Open"),e.join(" \xB7 ")||null}function li(r){return r.length?c`${r.map(s=>c`<span class="chip band">${s} GHz</span>`)}`:c`<span class="chip band">All bands</span>`}function xs(r,s){return!r.length||!s.length||r.some(e=>s.includes(e))}var Ve=class extends A{static getConfigForm(){return{schema:[I,{name:"title",selector:{text:{}}}],computeLabel:T({entry_id:"Controller",title:"Title"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){let s=this._entry?.wifi;return 2+2*((s?.networks.length??1)+(s?.radios.length??0))}render(){let s=this._entry;if(!s)return this.renderWaiting();let e=s.wifi,t=new Map(s.devices.map(a=>[a.key,a])),i=e?.networks.filter(a=>!a.disabled)??[],n=new Set(i.flatMap(a=>a.devices).filter(a=>t.get(a)?.wifi)),o;return e?!e.networks.length&&!e.radios.length?o=c`<div class="none">
        <ha-icon icon="mdi:wifi-cog"></ha-icon>
        <div>
          <div>CMR doesn't configure any Wi-Fi on this controller.</div>
          <div class="muted small">Networks and radio settings added under CMR › WiFi show up here, with the access points they apply to.</div>
        </div>
      </div>`:o=c`
        ${e.networks.length?c`<div class="section-label">Networks</div>
              <div class="items">${e.networks.map(a=>this._network(a,t))}</div>`:p}
        ${e.radios.length?c`<div class="section-label">Radio settings</div>
              <div class="items">${e.radios.map(a=>this._radio(a,i,t))}</div>`:p}`:o=c`<div class="empty">This controller's CMR has no WiFi menu.</div>`,c`<ha-card>
      <div class="card-header">
        <ha-icon icon="mdi:wifi"></ha-icon>
        <span>${this._config.title??"Wi-Fi"}</span>
        ${e?.networks.length?c`<span class="chip">${i.length} network${i.length===1?"":"s"}</span>
              <span class="chip">${n.size} access point${n.size===1?"":"s"}</span>`:p}
        <div class="spacer"></div>
      </div>
      ${this.renderStale(s)}
      ${o}
      ${e?c`<div class="foot muted small">Live access point and client counts aren't available from the controller's API yet.</div>`:p}
    </ha-card>`}_network(s,e){let i=[ys(s.authentication),s.vlan_id!==null?`VLAN ${s.vlan_id}`:null,s.fast_roaming?"Fast roaming":null,s.max_clients!==null?`up to ${s.max_clients} clients`:null].filter(Boolean),n=[];return!s.disabled&&s.vlan_id===null&&(s.mode??"ap")==="ap"&&n.push("No VLAN: CMR puts this network in no bridge, so its clients get no network access. Set a VLAN and carry it on the access points' uplink."),c`<div class="item ${s.disabled?"off":""}">
      <ha-icon class="kind" icon=${s.disabled?"mdi:wifi-off":s.hidden?"mdi:wifi-lock":"mdi:wifi"}></ha-icon>
      <div class="main">
        <div class="title">
          <span class="name">${s.ssid??"(no SSID)"}</span>
          ${li(s.bands)}
          ${s.hidden?c`<span class="chip">Hidden</span>`:p}
          ${s.mlo?c`<span class="chip" title="Multi-Link Operation (Wi-Fi 7)">MLO</span>`:p}
          ${s.mode&&s.mode!=="ap"?c`<span class="chip">${s.mode}</span>`:p}
          ${s.disabled?c`<span class="chip">Off</span>`:p}
        </div>
        ${i.length||s.comment?c`<div class="muted small" title=${[...s.authentication,...s.encryption].join(", ")}>
              ${i.join(" \xB7 ")}${s.comment?c`${i.length?" \xB7 ":""}<i>${s.comment}</i>`:p}
            </div>`:p}
        ${this._targets(s.devices,s.selector,e,s.disabled)}
        ${s.disabled?p:n.map(o=>c`<div class="warn small"><ha-icon icon="mdi:alert-outline"></ha-icon>${o}</div>`)}
      </div>
    </div>`}_radio(s,e,t){let[i,n]=_s(s.band),o=s.chains?s.chains.split(",").filter(Boolean).length:0,a=[bs(s.frequency),s.width?s.width.replace(/mhz$/i," MHz"):null,s.tx_power!==null?`${s.tx_power} dBm`:null,o?`${o} chain${o===1?"":"s"}`:null,s.country].filter(Boolean),l=[];!s.disabled&&s.frequency&&!s.bands.length&&l.push("No band label: the channel goes to every radio, and a radio of another band is left with no available channel. Add +2ghz, +5ghz or +6ghz to its labels.");let d=e.some(u=>xs(u.bands,s.bands)&&u.devices.some(m=>s.devices.includes(m)));!s.disabled&&s.devices.length&&!d&&l.push("No enabled CMR network selects these radios, so these settings aren't applied.");let h=i?`${i}${n?` \xB7 ${n}`:""}`:s.bands.length?s.bands.map(u=>`${u} GHz`).join(", "):"All radios";return c`<div class="item ${s.disabled?"off":""}">
      <ha-icon class="kind" icon="mdi:access-point"></ha-icon>
      <div class="main">
        <div class="title">
          <span class="name">${h}</span>
          ${i?p:li(s.bands)}
          ${s.disabled?c`<span class="chip">Off</span>`:p}
        </div>
        ${a.length||s.comment?c`<div class="muted small">
              ${a.join(" \xB7 ")}${s.comment?c`${a.length?" \xB7 ":""}<i>${s.comment}</i>`:p}
            </div>`:p}
        ${this._targets(s.devices,s.selector,t,s.disabled)}
        ${l.map(u=>c`<div class="warn small"><ha-icon icon="mdi:alert-outline"></ha-icon>${u}</div>`)}
      </div>
    </div>`}_targets(s,e,t,i){let n=s.map(d=>t.get(d)).filter(d=>!!d),o=n.filter(d=>d.wifi).sort(F),a=n.length-o.length,l=e.length?`labels ${e.join(", ")}`:"all devices";return n.length?c`<div class="aps">
      ${o.map(d=>c`<button class="ap status-${C(d)}" title=${L[C(d)]}
          @click=${()=>P(this,d.entities.connected)}><i class="dot"></i>${d.identity}</button>`)}
      <span class="muted small">${o.length?"":"No access point: "}${l}${a?` \xB7 ${a} device${a===1?"":"s"} without radios`:""}</span>
    </div>`:i?c`<div class="muted small">${l} · selects no device</div>`:c`<div class="warn small"><ha-icon icon="mdi:alert-outline"></ha-icon>Its ${l} select no device.</div>`}static{this.styles=[D,E`
      .section-label { padding: 4px 16px 4px; }
      .items { display: flex; flex-direction: column; gap: 2px; padding: 0 8px 8px; }
      .item { display: flex; gap: 10px; padding: 8px 10px; border-radius: 10px; }
      .item:hover { background: var(--cmr-surface-2); }
      .item.off { opacity: 0.55; }
      .kind { --mdc-icon-size: 20px; color: var(--primary-color); margin-top: 1px; flex: none; }
      .item.off .kind { color: var(--cmr-muted); }
      .main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
      .title { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
      .name { font-weight: 500; font-size: 14px; overflow: hidden; text-overflow: ellipsis; }
      .chip.band { background: color-mix(in srgb, var(--primary-color) 14%, transparent); }
      .aps { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; margin-top: 2px; }
      .ap {
        all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px;
        padding: 1px 8px 1px 6px; border-radius: 999px; border: 1px solid var(--cmr-line);
      }
      .ap:hover { border-color: var(--status, var(--cmr-muted)); }
      .warn { display: flex; gap: 6px; align-items: flex-start; color: var(--cmr-alert); --mdc-icon-size: 15px; line-height: 1.35; }
      .warn ha-icon { flex: none; margin-top: 1px; }
      .none { display: flex; gap: 12px; align-items: center; padding: 8px 16px 14px; --mdc-icon-size: 28px; }
      .none ha-icon { color: var(--cmr-muted); }
      .foot { border-top: 1px solid var(--cmr-line); padding: 8px 16px 10px; }
    `]}};var ci="https://github.com/trakais/ha-cmr",di=[["cmr-status-card",He,"CMR status","Controller, devices online, updates and alerts at a glance."],["cmr-topology-card",Be,"CMR topology","Live network map drawn from the controller's CMR layouts."],["cmr-fleet-card",ze,"CMR devices","Every managed device with model, version, uptime and labels."],["cmr-alerts-card",Le,"CMR alerts","Alert rules, which are active, and pushing alerts to Home Assistant."],["cmr-upgrades-card",qe,"CMR upgrades","Upgrade rules as a rollout pipeline, plus recent jobs."],["cmr-events-card",De,"CMR events","Network timeline from the controller's log and changes, with detected issues."],["cmr-wifi-card",Ve,"CMR Wi-Fi","The Wi-Fi networks and radio settings CMR applies, and the access points they reach."]];function $s(){for(let[r,s]of di)customElements.get(r)||customElements.define(r,s);customElements.get("ll-strategy-dashboard-cmr")||customElements.define("ll-strategy-dashboard-cmr",Ie),customElements.get("cmr-strategy-editor")||customElements.define("cmr-strategy-editor",Fe)}function pi(r,s=0){if(customElements.get("home-assistant")||s>=15e3){r();return}setTimeout(()=>pi(r,s+25),25)}pi($s);window.customCards=window.customCards||[];for(let[r,,s,e]of di)window.customCards.some(t=>t.type===r)||window.customCards.push({type:r,name:s,description:e,preview:!1,documentationURL:ci});window.customStrategies=window.customStrategies||[];window.customStrategies.some(r=>r.type==="cmr")||window.customStrategies.push({type:"cmr",strategyType:"dashboard",name:"MikroTik CMR network",description:"A complete network dashboard generated from your MikroTik CMR controller: status, topology, devices, alerts and upgrades.",documentationURL:ci});var yt=performance.getEntriesByType("resource").find(r=>r.name.includes("/cmr_static/cmr.js")),ws=yt?`fetched ${Math.round(yt.startTime)}\u2013${Math.round(yt.responseEnd)} ms, `:"";console.info("%c CMR %c cards loaded ","background:#3a6ea5;color:#fff;border-radius:3px 0 0 3px","background:#ddd;color:#333;border-radius:0 3px 3px 0",`${ws}script ran at ${Math.round(performance.now())} ms`);var ks="Timeout waiting for strategy element ll-strategy-dashboard-cmr",xt="cmr-strategy-reloaded";function $t(r,s=0){if(s>12)return!1;if(r instanceof Element&&r.shadowRoot&&$t(r.shadowRoot,s+1))return!0;for(let e of Array.from(r.children))if(!(e.tagName==="SCRIPT"||e.tagName==="STYLE")&&(e.children.length===0&&e.textContent?.includes(ks)||$t(e,s+1)))return!0;return!1}function hi(r=0){if(!$t(document)){if(r<6)setTimeout(()=>hi(r+1),2e3);else try{sessionStorage.removeItem(xt)}catch{}return}let s=!1;try{s=sessionStorage.getItem(xt)===location.pathname,sessionStorage.setItem(xt,location.pathname)}catch{s=r>0}if(s){console.warn("cmr: the dashboard strategy timed out again after a reload; not retrying");return}console.warn("cmr: the dashboard strategy timed out before this script registered it; reloading once"),location.reload()}hi();
