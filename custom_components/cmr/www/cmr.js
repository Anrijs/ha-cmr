var be=globalThis,xe=be.ShadowRoot&&(be.ShadyCSS===void 0||be.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Xe=Symbol(),Et=new WeakMap,ce=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==Xe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(xe&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=Et.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&Et.set(e,s))}return s}toString(){return this.cssText}},Mt=a=>new ce(typeof a=="string"?a:a+"",void 0,Xe),S=(a,...s)=>{let e=a.length===1?a[0]:s.reduce((t,i,n)=>t+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+a[n+1],a[0]);return new ce(e,a,Xe)},St=(a,s)=>{if(xe)a.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),i=be.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,a.appendChild(t)}},Ze=xe?a=>a:a=>a instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return Mt(e)})(a):a;var{is:_i,defineProperty:yi,getOwnPropertyDescriptor:bi,getOwnPropertyNames:xi,getOwnPropertySymbols:$i,getPrototypeOf:wi}=Object,$e=globalThis,Pt=$e.trustedTypes,ki=Pt?Pt.emptyScript:"",Ci=$e.reactiveElementPolyfillSupport,le=(a,s)=>a,Qe={toAttribute(a,s){switch(s){case Boolean:a=a?ki:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,s){let e=a;switch(s){case Boolean:e=a!==null;break;case Number:e=a===null?null:Number(a);break;case Object:case Array:try{e=JSON.parse(a)}catch{e=null}}return e}},At=(a,s)=>!_i(a,s),Rt={attribute:!0,type:String,converter:Qe,reflect:!1,useDefault:!1,hasChanged:At};Symbol.metadata??=Symbol("metadata"),$e.litPropertyMetadata??=new WeakMap;var B=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=Rt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(s,t,e);i!==void 0&&yi(this.prototype,s,i)}}static getPropertyDescriptor(s,e,t){let{get:i,set:n}=bi(this.prototype,s)??{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){let o=i?.call(this);n?.call(this,r),this.requestUpdate(s,o,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??Rt}static _$Ei(){if(this.hasOwnProperty(le("elementProperties")))return;let s=wi(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(le("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(le("properties"))){let e=this.properties,t=[...xi(e),...$i(e)];for(let i of t)this.createProperty(i,e[i])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let i of t)e.unshift(Ze(i))}else s!==void 0&&e.push(Ze(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return St(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),i=this.constructor._$Eu(s,t);if(i!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:Qe).toAttribute(e,t.type);this._$Em=s,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(s,e){let t=this.constructor,i=t._$Eh.get(s);if(i!==void 0&&this._$Em!==i){let n=t.getPropertyOptions(i),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Qe;this._$Em=i;let o=r.fromAttribute(e,n.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(s,e,t,i=!1,n){if(s!==void 0){let r=this.constructor;if(i===!1&&(n=this[s]),t??=r.getPropertyOptions(s),!((t.hasChanged??At)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(s)&&!this.hasAttribute(r._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:i,wrapped:n},r){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,r??e??this[s]),n!==!0||r!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),i===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,n]of t){let{wrapped:r}=n,o=this[i];r!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,n,o)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};B.elementStyles=[],B.shadowRootOptions={mode:"open"},B[le("elementProperties")]=new Map,B[le("finalized")]=new Map,Ci?.({ReactiveElement:B}),($e.reactiveElementVersions??=[]).push("2.1.2");var ot=globalThis,Tt=a=>a,we=ot.trustedTypes,Lt=we?we.createPolicy("lit-html",{createHTML:a=>a}):void 0,Ot="$lit$",V=`lit$${Math.random().toFixed(9).slice(2)}$`,Ut="?"+V,Ei=`<${Ut}>`,G=document,pe=()=>G.createComment(""),he=a=>a===null||typeof a!="object"&&typeof a!="function",at=Array.isArray,Mi=a=>at(a)||typeof a?.[Symbol.iterator]=="function",et=`[ 	
\f\r]`,de=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Dt=/-->/g,zt=/>/g,Y=RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Nt=/'/g,Ht=/"/g,jt=/^(?:script|style|textarea|title)$/i,ct=a=>(s,...e)=>({_$litType$:a,strings:s,values:e}),d=ct(1),H=ct(2),Rs=ct(3),X=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),It=new WeakMap,J=G.createTreeWalker(G,129);function Ft(a,s){if(!at(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return Lt!==void 0?Lt.createHTML(s):s}var Si=(a,s)=>{let e=a.length-1,t=[],i,n=s===2?"<svg>":s===3?"<math>":"",r=de;for(let o=0;o<e;o++){let l=a[o],c,p,u=-1,m=0;for(;m<l.length&&(r.lastIndex=m,p=r.exec(l),p!==null);)m=r.lastIndex,r===de?p[1]==="!--"?r=Dt:p[1]!==void 0?r=zt:p[2]!==void 0?(jt.test(p[2])&&(i=RegExp("</"+p[2],"g")),r=Y):p[3]!==void 0&&(r=Y):r===Y?p[0]===">"?(r=i??de,u=-1):p[1]===void 0?u=-2:(u=r.lastIndex-p[2].length,c=p[1],r=p[3]===void 0?Y:p[3]==='"'?Ht:Nt):r===Ht||r===Nt?r=Y:r===Dt||r===zt?r=de:(r=Y,i=void 0);let v=r===Y&&a[o+1].startsWith("/>")?" ":"";n+=r===de?l+Ei:u>=0?(t.push(c),l.slice(0,u)+Ot+l.slice(u)+V+v):l+V+(u===-2?o:v)}return[Ft(a,n+(a[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},ue=class a{constructor({strings:s,_$litType$:e},t){let i;this.parts=[];let n=0,r=0,o=s.length-1,l=this.parts,[c,p]=Si(s,e);if(this.el=a.createElement(c,t),J.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=J.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(Ot)){let m=p[r++],v=i.getAttribute(u).split(V),g=/([.?@])?(.*)/.exec(m);l.push({type:1,index:n,name:g[2],strings:v,ctor:g[1]==="."?it:g[1]==="?"?st:g[1]==="@"?nt:ne}),i.removeAttribute(u)}else u.startsWith(V)&&(l.push({type:6,index:n}),i.removeAttribute(u));if(jt.test(i.tagName)){let u=i.textContent.split(V),m=u.length-1;if(m>0){i.textContent=we?we.emptyScript:"";for(let v=0;v<m;v++)i.append(u[v],pe()),J.nextNode(),l.push({type:2,index:++n});i.append(u[m],pe())}}}else if(i.nodeType===8)if(i.data===Ut)l.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(V,u+1))!==-1;)l.push({type:7,index:n}),u+=V.length-1}n++}}static createElement(s,e){let t=G.createElement("template");return t.innerHTML=s,t}};function se(a,s,e=a,t){if(s===X)return s;let i=t!==void 0?e._$Co?.[t]:e._$Cl,n=he(s)?void 0:s._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(a),i._$AT(a,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(s=se(a,i._$AS(a,s.values),i,t)),s}var tt=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,i=(s?.creationScope??G).importNode(e,!0);J.currentNode=i;let n=J.nextNode(),r=0,o=0,l=t[0];for(;l!==void 0;){if(r===l.index){let c;l.type===2?c=new me(n,n.nextSibling,this,s):l.type===1?c=new l.ctor(n,l.name,l.strings,this,s):l.type===6&&(c=new rt(n,this,s)),this._$AV.push(c),l=t[++o]}r!==l?.index&&(n=J.nextNode(),r++)}return J.currentNode=G,i}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},me=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=se(this,s,e),he(s)?s===h||s==null||s===""?(this._$AH!==h&&this._$AR(),this._$AH=h):s!==this._$AH&&s!==X&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):Mi(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==h&&he(this._$AH)?this._$AA.nextSibling.data=s:this.T(G.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,i=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=ue.createElement(Ft(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new tt(i,this),r=n.u(this.options);n.p(e),this.T(r),this._$AH=n}}_$AC(s){let e=It.get(s.strings);return e===void 0&&It.set(s.strings,e=new ue(s)),e}k(s){at(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let n of s)i===e.length?e.push(t=new a(this.O(pe()),this.O(pe()),this,this.options)):t=e[i],t._$AI(n),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=Tt(s).nextSibling;Tt(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},ne=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,i,n){this.type=1,this._$AH=h,this._$AN=void 0,this.element=s,this.name=e,this._$AM=i,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=h}_$AI(s,e=this,t,i){let n=this.strings,r=!1;if(n===void 0)s=se(this,s,e,0),r=!he(s)||s!==this._$AH&&s!==X,r&&(this._$AH=s);else{let o=s,l,c;for(s=n[0],l=0;l<n.length-1;l++)c=se(this,o[t+l],e,l),c===X&&(c=this._$AH[l]),r||=!he(c)||c!==this._$AH[l],c===h?s=h:s!==h&&(s+=(c??"")+n[l+1]),this._$AH[l]=c}r&&!i&&this.j(s)}j(s){s===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},it=class extends ne{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===h?void 0:s}},st=class extends ne{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==h)}},nt=class extends ne{constructor(s,e,t,i,n){super(s,e,t,i,n),this.type=5}_$AI(s,e=this){if((s=se(this,s,e,0)??h)===X)return;let t=this._$AH,i=s===h&&t!==h||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,n=s!==h&&(t===h||i);i&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},rt=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){se(this,s)}};var Pi=ot.litHtmlPolyfillSupport;Pi?.(ue,me),(ot.litHtmlVersions??=[]).push("3.3.3");var Wt=(a,s,e)=>{let t=e?.renderBefore??s,i=t._$litPart$;if(i===void 0){let n=e?.renderBefore??null;t._$litPart$=i=new me(s.insertBefore(pe(),n),n,void 0,e??{})}return i._$AI(a),i};var lt=globalThis,I=class extends B{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=Wt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return X}};I._$litElement$=!0,I.finalized=!0,lt.litElementHydrateSupport?.({LitElement:I});var Ri=lt.litElementPolyfillSupport;Ri?.({LitElement:I});(lt.litElementVersions??=[]).push("4.2.2");function Bt(a){return a?.message??String(a)}var dt=class{constructor(){this.listeners=new Set;this.topology=new Map}subscribe(s,e){return this.listeners.add(e),this.latest&&e(this.latest),this.unsubscribe||(this.unsubscribe=s.connection.subscribeMessage(t=>{let i=t.entries.map(n=>this._hydrate(n));this.latest=i,this.listeners.forEach(n=>n(i))},{type:"cmr/subscribe"}),this.unsubscribe.catch(t=>{console.error("cmr: subscription failed",t),this.unsubscribe=void 0,this.listeners.forEach(i=>i([],Bt(t)))})),()=>{if(this.listeners.delete(e),this.listeners.size===0&&this.unsubscribe){let t=this.unsubscribe;this.unsubscribe=void 0,this.latest=void 0,this.topology.clear(),t.then(i=>i()).catch(()=>{})}}}_hydrate(s){let{products:e={},...t}=s,i=t.devices.map(({product:r,product_ambiguous:o,...l})=>({...l,product:r&&e[r]?{...e[r],...o?{ambiguous:!0}:{}}:null}));if(t.layouts&&t.nodes)return this.topology.set(t.entry_id,{layouts:t.layouts,nodes:t.nodes}),{...t,devices:i,layouts:t.layouts,nodes:t.nodes};let n=this.topology.get(t.entry_id)??{layouts:[],nodes:[]};return{...t,devices:i,...n}}once(s){return this.latest?Promise.resolve(this.latest):new Promise((e,t)=>{let i,n=!1;i=this.subscribe(s,(r,o)=>{n||(n=!0,queueMicrotask(()=>i?.()),o?t(new Error(o)):e(r))})})}},Ce=new dt;function Ee(a,s){if(a?.length)return s?a.find(e=>e.entry_id===s):a[0]}var Kt=new Map,Ai=3e4;async function Ti(a,s,e){let t=`${s}/${e}`,i=Kt.get(t);if(i&&Date.now()-i.at<Ai)return i.keys;let n=await a.connection.sendMessagePromise({type:"cmr/alert_devices",entry_id:s,rule_id:e});return Kt.set(t,{at:Date.now(),keys:n.devices}),n.devices}var j=class{constructor(s){this.onChange=s;this.state=new Map;this.stale=new Set}get(s,e,t){let i=`${e}/${t}`,n=this.state.get(i);return n!==void 0&&!this.stale.has(i)?n:(this.stale.delete(i),n===void 0&&this.state.set(i,"loading"),Ti(s,e,t).then(r=>this.state.set(i,r)).catch(r=>this.state.set(i,r?.code==="unsupported"?"unsupported":"error")).finally(()=>this.onChange()),this.state.get(i))}invalidate(){for(let s of this.state.keys())this.stale.add(s)}},ke=class{constructor(s){this.onChange=s;this.state=new Map}get(s,e,t){let i=`${e}/${t.id}`,n=[t.state,t.success,t.start_time,t.end_time].join("|"),r=this.state.get(i);if(r?.version===n)return r.value;let o=r?.value??"loading";return this.state.set(i,{version:n,value:o}),s.connection.sendMessagePromise({type:"cmr/job_devices",entry_id:e,job_id:t.id}).then(l=>this.state.set(i,{version:n,value:l.devices})).catch(l=>this.state.set(i,{version:n,value:l?.code==="unsupported"?"unsupported":"error"})).finally(()=>this.onChange()),o}};function qt(a,s,e,t){return a.connection.sendMessagePromise({type:"cmr/job_action",entry_id:s,job_id:e,action:t})}function Me(a,s,e){return a.connection.sendMessagePromise({type:"cmr/issue_dismiss",entry_id:s,key:e})}var pt=class{constructor(s){this.entryId=s;this.listeners=new Set;this.events=[];this.issues=[];this.loaded=!1}subscribe(s,e){return this.listeners.add(e),this.loaded&&e(this.events,this.issues),this.unsubscribe||(this.unsubscribe=s.connection.subscribeMessage(t=>{this.events=t.reset?t.events:[...this.events,...t.events].slice(-1e3),this.issues=t.issues,this.loaded=!0,this.listeners.forEach(i=>i(this.events,this.issues))},{type:"cmr/events/subscribe",limit:1e3,...this.entryId?{entry_id:this.entryId}:{}}),this.unsubscribe.catch(t=>{console.error("cmr: events subscription failed",t),this.unsubscribe=void 0,this.listeners.forEach(i=>i([],[],Bt(t)))})),()=>{if(this.listeners.delete(e),this.listeners.size===0&&this.unsubscribe){let t=this.unsubscribe;this.unsubscribe=void 0,this.loaded=!1,this.events=[],t.then(i=>i()).catch(()=>{})}}}},ht=class{constructor(){this.feeds=new Map}subscribe(s,e,t){let i=e??"",n=this.feeds.get(i);return n||(n=new pt(e),this.feeds.set(i,n)),n.subscribe(s,t)}},Se=new ht;function re(a){return a.controller?"mdi:router-network":"mdi:router"}function M(a){return a.pending||a.remote_pending?"pending":a.connected?a.alerts?.on?"alert":a.update_available?"update":"ok":"offline"}function Z(a){return a.pending?"approve on the controller":a.remote_pending?"approve on the device":""}var oe=["offline","pending","alert","update","ok"];async function Pe(a,s,e){await a.connection.sendMessagePromise({type:"cmr/pair",entry_id:s,device_key:e})}function Re(a,s){return s?[a.identity,a.board,a.model_code,a.address,a.version,...a.labels].filter(Boolean).join(" ").toLowerCase().includes(s):!0}function Ae(){let a=new URLSearchParams(window.location.search),s=a.get("cmr_status");return{status:s&&oe.includes(s)?s:void 0,version:a.get("cmr_version")??void 0,search:a.get("cmr_search")??void 0,alert:a.get("cmr_alert")??void 0}}function U(a,s={}){let e=window.location.pathname.split("/")[1]||"lovelace",t=Object.entries(s).filter(i=>!!i[1]).map(([i,n])=>`${i}=${encodeURIComponent(n)}`).join("&");return`/${e}/${a}${t?`?${t}`:""}`}var L={ok:"OK",update:"Update available",alert:"Alert active",pending:"Waiting to pair",offline:"Disconnected"};function ge(a){if(a==null)return"\u2013";let s=Math.floor(a/86400),e=Math.floor(a%86400/3600),t=Math.floor(a%3600/60);return s?`${s}d ${e}h`:e?`${e}h ${t}m`:t?`${t}m`:`${Math.floor(a)}s`}function F(a,s){return a.controller!==s.controller?a.controller?-1:1:a.identity.localeCompare(s.identity)}async function Vt(a){try{if(navigator.clipboard)return await navigator.clipboard.writeText(a),!0}catch{}let s=document.createElement("textarea");s.value=a,s.setAttribute("readonly",""),s.style.position="fixed",s.style.opacity="0",document.body.appendChild(s),s.select();let e=!1;try{e=document.execCommand("copy")}catch{e=!1}return s.remove(),e}function ut(a,s,e){a.dispatchEvent(new CustomEvent(s,{detail:e,bubbles:!0,composed:!0}))}function R(a,s){s&&ut(a,"hass-more-info",{entityId:s})}function A(a){history.pushState(null,"",a),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}function ve(a,s="never"){if(!a)return s;let e=Math.max(0,(Date.now()-new Date(a).getTime())/1e3);return e<10?"just now":e<60?`${Math.round(e)} s ago`:e<3600?`${Math.round(e/60)} min ago`:e<86400?`${Math.round(e/3600)} h ago`:`${Math.round(e/86400)} d ago`}function Yt(a){return a.includes(":")&&!a.startsWith("[")?`http://[${a}]`:`http://${a}`}var O={name:"entry_id",selector:{config_entry:{integration:"cmr"}}};function D(a){return s=>a[s.name]}var T=class extends I{static{this.properties={hass:{attribute:!1},_config:{state:!0},_entry:{state:!0},_error:{state:!0}}}setConfig(s){this._config=s}static getStubConfig(){return{}}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribeStore&&this._subscribeStore()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeStore?.(),this._unsubscribeStore=void 0,window.clearInterval(this._staleTicker),this._staleTicker=void 0}willUpdate(s){s.has("hass")&&this.hass&&!this._unsubscribeStore&&this.isConnected&&this._subscribeStore()}_subscribeStore(){this._unsubscribeStore=Ce.subscribe(this.hass,(s,e)=>{this._error=e,this._entry=Ee(s,this._config?.entry_id);let t=!!this._entry&&!this._entry.available;t&&!this._staleTicker&&(this._staleTicker=window.setInterval(()=>this.requestUpdate(),3e4)),!t&&this._staleTicker&&(window.clearInterval(this._staleTicker),this._staleTicker=void 0)})}renderWaiting(s=""){let e=this._error?`Can't read CMR data from Home Assistant (${this._error}). Reload the page.`:"Waiting for the CMR controller\u2026";return d`<ha-card><div class="empty" style=${s}>${e}</div></ha-card>`}renderStale(s){return s.available?h:d`<div class="stale">
      <ha-icon icon="mdi:lan-disconnect"></ha-icon>Controller unreachable · showing data from ${ve(s.last_update)}
    </div>`}},z=S`
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
`;function Q(a,s=""){return a.product?.image?d`<div class="badge photo ${s}" title=${a.product.name}>
      <img src=${a.product.image} alt=${a.product.name} loading="lazy" referrerpolicy="no-referrer"
        @error=${e=>e.target.parentElement.classList.add("broken")} />
      <ha-icon icon=${re(a)}></ha-icon>
    </div>`:d`<div class="badge ${s}"><ha-icon icon=${re(a)}></ha-icon></div>`}function q(a){return(a.product&&!a.product.ambiguous?a.product:void 0)?.name??a.board??"Device"}function fe(a){return a.product&&!a.product.ambiguous?a.product.code:a.model_code}function Te(a,s,e,t,i,n=12){let r;if(e.kind==="event")r=d`<div class="muted small">
      An event alert: it runs its actions each time it happens (${e.fired}× so far) and never stays
      active, so no device is listed here. Its occurrences show in the events timeline.
      ${e.scope==="system"?" It reports a whole upgrade job, not a single device.":h}
    </div>`;else if(e.devices_on===0)r=d`<div class="muted small">Not active on any device right now.</div>`;else if(!s.console||t==="unsupported")r=d`<div class="muted small">
      The controller lists these devices only on its console, and this REST user may not run console commands.
    </div>`;else if(t==="loading")r=d`<div class="muted small">Asking the controller…</div>`;else if(t==="error")r=d`<div class="muted small">Couldn't read the device list from the controller.</div>`;else{let l=new Map(s.devices.map(u=>[u.key,u])),c=t.map(u=>l.get(u)).filter(u=>!!u).sort(F),p=c.slice(0,n);r=d`
      <div class="rd-list">
        ${p.map(u=>d`<button class="rd-dev status-${M(u)}" title=${L[M(u)]}
            @click=${()=>R(a,u.entities.connected)}><i class="dot"></i>${u.identity}</button>`)}
        ${c.length>p.length?d`<span class="muted small">+${c.length-p.length} more</span>`:h}
        ${c.length?h:d`<span class="muted small">Active on devices this Home Assistant doesn't list yet.</span>`}
      </div>`}let o={cmr_alert:e.id};return d`<div class="rd">
    ${r}
    ${e.devices_on>0&&(i?.devices||i?.topology)?d`<div class="rd-links">
          ${i?.devices?d`<button class="rd-link" @click=${()=>A(U(i.devices,o))}>
                <ha-icon icon="mdi:table"></ha-icon>Show in Devices</button>`:h}
          ${i?.topology?d`<button class="rd-link" @click=${()=>A(U(i.topology,o))}>
                <ha-icon icon="mdi:sitemap-outline"></ha-icon>Show on map</button>`:h}
        </div>`:h}
  </div>`}var Le=S`
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
`;var Jt=["critical","high","medium","low"],Gt={critical:"mdi:alert-octagon",high:"mdi:alert",medium:"mdi:alert-circle-outline",low:"mdi:information-outline"},De=class extends T{constructor(){super();this._ruleDevices=new j(()=>this.requestUpdate());this._only="",this._open=""}static{this.properties={_setup:{state:!0},_copied:{state:!0},_push:{state:!0},_only:{state:!0},_open:{state:!0}}}willUpdate(e){super.willUpdate(e),e.has("_entry")&&this._ruleDevices.invalidate()}async _pushAlerts(e){this._push="busy";try{let t=await this.hass.connection.sendMessagePromise({type:"cmr/alert_push",entry_id:this._entry.entry_id,enable:e}),i=e?"now push to Home Assistant":"no longer push";this._push=`${t.done} rule${t.done===1?"":"s"} ${i}`+(t.failures.length?`; failed: ${t.failures.join("; ")}`:"")}catch(t){this._push=t?.message??String(t)}}static getConfigForm(){return{schema:[O,{name:"title",selector:{text:{}}},{name:"hide_disabled",selector:{boolean:{}}}],computeLabel:D({entry_id:"Controller",title:"Title",hide_disabled:"Hide disabled rules"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){return 2+(this._entry?.alerts.length??4)}async _toggleSetup(){if(this._setup!==void 0){this._setup=void 0;return}this._setup=null;try{this._setup=await this.hass.connection.sendMessagePromise({type:"cmr/alert_setup",entry_id:this._entry.entry_id})}catch(e){console.error("cmr: alert setup",e),this._setup=void 0}}async _copy(){this._setup&&await Vt(this._setup.script)&&(this._copied=!0,setTimeout(()=>this._copied=!1,1800))}render(){let e=this._entry;if(!e)return this.renderWaiting();let t=e.alerts.filter(v=>!(this._config.hide_disabled&&v.disabled)),i={firing:t.filter(v=>v.devices_on>0).length,disabled:t.filter(v=>v.disabled).length,pushing:t.filter(v=>v.webhook_ha).length},n=t.filter(v=>this._only==="firing"?v.devices_on>0:this._only==="disabled"?v.disabled:this._only==="pushing"?v.webhook_ha:!0).sort((v,g)=>+(g.devices_on>0)-+(v.devices_on>0)||Number(v.disabled)-Number(g.disabled)||Jt.indexOf(v.severity)-Jt.indexOf(g.severity)||v.name.localeCompare(g.name)),r=n.filter(v=>v.devices_on>0).length,o=e.alerts.filter(v=>v.webhook_ha).length,l=e.alerts.filter(v=>v.webhook_outdated).length,c=e.actions&&!!this.hass.user?.is_admin,p=e.fleet_entities.fleet_alert,u=p?this.hass.states[p]:void 0,m=u?.attributes??{};return d`
      <ha-card>
        <div class="card-header">
          <ha-icon icon=${r?"mdi:bell-alert":"mdi:bell-check-outline"}></ha-icon>
          <span>${this._config.title??"Alerts"}</span>
          ${r?d`<span class="chip alert">${r} active</span>`:d`<span class="chip">all quiet</span>`}
          <div class="spacer"></div>
        </div>
        ${this.renderStale(e)}
        ${t.length>3?d`<div class="filters">
              <button class="pill ${this._only?"":"on"}" @click=${()=>this._only=""}>All ${t.length}</button>
              ${i.firing?d`<button class="pill hot ${this._only==="firing"?"on":""}" @click=${()=>this._only=this._only==="firing"?"":"firing"}>
                  <ha-icon icon="mdi:bell-alert-outline"></ha-icon>Active ${i.firing}</button>`:h}
              ${i.pushing?d`<button class="pill ${this._only==="pushing"?"on":""}" @click=${()=>this._only=this._only==="pushing"?"":"pushing"}>
                  <ha-icon icon="mdi:webhook"></ha-icon>Pushing ${i.pushing}</button>`:h}
              ${i.disabled?d`<button class="pill ${this._only==="disabled"?"on":""}" @click=${()=>this._only=this._only==="disabled"?"":"disabled"}>
                  <ha-icon icon="mdi:bell-off-outline"></ha-icon>Disabled ${i.disabled}</button>`:h}
            </div>`:h}

        ${u&&u.state!=="unknown"&&u.state!=="unavailable"?d`<button class="last sev-${m.event_type}" @click=${()=>R(this,p)}>
              <ha-icon icon=${Gt[m.event_type]??"mdi:bell"}></ha-icon>
              <div>
                <div><b>${m.alert}</b>${m.device?d` · ${m.device}`:h}</div>
                <div class="muted small">Last pushed alert · ${ve(u.state,"")}</div>
              </div>
            </button>`:h}

        <div class="rules">
          ${n.map(v=>this._rule(v,e))}
          ${n.length?h:d`<div class="empty">${t.length?"No rules match this filter.":"No alert rules on the controller."}</div>`}
        </div>

        ${this.hass.user?.is_admin?d`<div class="footer">
              ${c?d`<div class="push">
                    <ha-icon icon="mdi:webhook"></ha-icon>
                    <span class="small">${o?`${o} of ${e.alerts.length} rules push to Home Assistant`:"Alerts reach Home Assistant on the next poll only"}</span>
                    <button class="copy" ?disabled=${this._push==="busy"} @click=${()=>this._pushAlerts(o<e.alerts.length)}>
                      ${this._push==="busy"?"Working\u2026":o<e.alerts.length?"Push alerts to Home Assistant":"Stop pushing"}
                    </button>
                    ${l&&o===e.alerts.length&&this._push!=="busy"?d`<button class="copy" title="Adds upgrade results, job counts and interface changes to the pushed alerts"
                          @click=${()=>this._pushAlerts(!0)}>Update ${l} rule${l===1?"":"s"}</button>`:h}
                    ${this._push&&this._push!=="busy"?d`<div class="muted small">${this._push}</div>`:h}
                  </div>`:d`<button class="link" @click=${this._toggleSetup}>
                      <ha-icon icon="mdi:webhook"></ha-icon>
                      ${o?`${o} of ${e.alerts.length} rules push to Home Assistant`:"Push alerts to Home Assistant instantly"}
                      <ha-icon icon=${this._setup!==void 0?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                    </button>
                    ${this._setup===null?d`<div class="muted small">Loading…</div>`:h}
                    ${this._setup?d`<div class="setup">
                          <div class="small">Paste into the controller's terminal. Each alert rule gets an HTTP action that calls Home Assistant; edit <code>find</code> to choose rules. (With <i>Allow actions on the controller</i> in the options this becomes one click.)</div>
                          <pre>${this._setup.script}</pre>
                          <button class="copy" @click=${this._copy}>
                            <ha-icon icon=${this._copied?"mdi:check":"mdi:content-copy"}></ha-icon>${this._copied?"Copied":"Copy script"}
                          </button>
                        </div>`:h}`}
            </div>`:h}
      </ha-card>
    `}_rule(e,t){let i=e.devices_on>0,n=this._open===e.id;return d`
      <button class="rule sev-${e.severity} ${i?"on":""} ${e.disabled?"disabled":""} ${n?"open":""}"
              aria-expanded=${n} @click=${()=>this._open=n?"":e.id}>
        <span class="stripe"></span>
        <ha-icon class="sev" icon=${Gt[e.severity]}></ha-icon>
        <div class="body">
          <div class="title">
            <span class="name">${e.name}</span>
            ${e.webhook?d`<ha-icon class="hook" icon="mdi:webhook" title=${e.webhook_ha?"Pushes to Home Assistant":"Pushes to another webhook"}></ha-icon>`:h}
          </div>
          <div class="muted small">
            ${e.disabled?"disabled \xB7 ":h}${e.kind==="event"?"event \xB7 ":h}${e.categories.join(", ")||"uncategorised"} ·
            ${e.scope==="system"?"upgrade jobs":e.labels.join(", ")||"all"}
          </div>
        </div>
        ${e.kind==="event"?d`<div class="nums" title="An event alert fires per occurrence and never stays active">
              <div>${e.fired}×</div>
              <div class="muted small">fired</div>
            </div>`:d`<div class="nums">
              <div class=${i?"hot":""} title="Active on / covered devices">${e.devices_on}/${e.devices}</div>
              <div class="muted small" title="Times fired">${e.fired}×</div>
            </div>`}
        ${e.entity_id?d`<span class="info" role="button" title="Entity details"
              @click=${r=>{r.stopPropagation(),R(this,e.entity_id)}}>
              <ha-icon icon="mdi:information-outline"></ha-icon></span>`:h}
      </button>
      ${n?Te(this,t,e,i?this._ruleDevices.get(this.hass,t.entry_id,e.id):[],this._config.views):h}
    `}static{this.styles=[z,Le,S`
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
    `]}};var Li=new Set(["insight","device","alert","upgrade","security","config"]),Di=a=>a.notable??(Li.has(a.category)||a.severity==="warning"||a.severity==="error"),ze={insight:{icon:"mdi:stethoscope",label:"Issues"},device:{icon:"mdi:router-network",label:"Devices"},alert:{icon:"mdi:bell-outline",label:"Alerts"},upgrade:{icon:"mdi:update",label:"Upgrades"},wifi:{icon:"mdi:wifi",label:"Wi-Fi"},link:{icon:"mdi:ethernet",label:"Links"},security:{icon:"mdi:shield-alert-outline",label:"Security"},login:{icon:"mdi:account-key-outline",label:"Logins"},config:{icon:"mdi:cog-outline",label:"Config"},dhcp:{icon:"mdi:ip-network-outline",label:"DHCP"},system:{icon:"mdi:cog-transfer-outline",label:"System"},api:{icon:"mdi:api",label:"API logins"}},Xt={icon:"mdi:text-box-outline",label:"Other"};function Zt(a){return ze[a]?ze[a]:a?{...Xt,label:a[0].toUpperCase()+a.slice(1)}:Xt}function zi(a){let s=a.data?.event;return a.category==="wifi"?s==="disconnected"?"mdi:wifi-off":s==="roamed"?"mdi:wifi-sync":"mdi:wifi-plus":a.category==="link"?a.data?.state==="down"?"mdi:ethernet-off":"mdi:ethernet":a.category==="device"?s==="disconnected"?"mdi:lan-disconnect":s==="rebooted"?"mdi:restart":"mdi:lan-connect":a.category==="insight"&&s==="resolved"?"mdi:check-circle-outline":Zt(a.category).icon}function Ni(a){return a.replace(/\b[0-9A-Fa-f]{2}(?::[0-9A-Fa-f]{2}){5}\b/g,"<mac>").replace(/\b\d{1,3}(?:\.\d{1,3}){3}(?:\/\d+)?(?::\d+)?\b/g,"<ip>").replace(/\b[0-9a-f]*:[0-9a-f:]+:[0-9a-f]*\b/gi,"<ip6>").replace(/\d+/g,"#")}function Hi(a){let s=a.data??{},e=s.mac??s.interface??s.user??s.rule_id??s.key??Ni(a.title);return`${a.category}|${a.device_key??""}|${String(e)}`}var Ii=864e5,Ne=class extends I{constructor(){super();this._loaded=!1;this._events=[],this._issues=[],this._category="",this._device="",this._search="",this._open=new Set,this._limit=50}static{this.properties={hass:{attribute:!1},_config:{state:!0},_events:{state:!0},_issues:{state:!0},_category:{state:!0},_device:{state:!0},_search:{state:!0},_open:{state:!0},_limit:{state:!0},_notable:{state:!0}}}setConfig(e){this._unsubscribe&&e.entry_id!==this._config?.entry_id&&(this._unsubscribe(),this._unsubscribe=void 0,this._loaded=!1),this._config={show_issues:!0,show_filters:!0,hide_categories:["api"],max_items:50,...e},!this._unsubscribe&&this.hass&&this.isConnected&&this._subscribe(),this._limit=this._config.max_items??50,this._device=e.device??"",this._notable=!!e.notable}static getStubConfig(){return{}}static getConfigForm(){return{schema:[{name:"title",selector:{text:{}}},{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"device",selector:{text:{}}},{name:"max_items",selector:{number:{min:5,max:500,mode:"box"}}},{name:"notable",selector:{boolean:{}}},{name:"show_issues",selector:{boolean:{}}},{name:"show_filters",selector:{boolean:{}}}],computeLabel:e=>({title:"Title",entry_id:"Controller (default: all)",device:"Only this device (identity)",max_items:"Rows to show",notable:"Start with notable events only",show_issues:"Show detected issues",show_filters:"Show filters"})[e.name]}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this.isConnected&&this._subscribe()}_subscribe(){this._unsubscribe=Se.subscribe(this.hass,this._config?.entry_id,(e,t,i)=>{this._events=e,this._issues=t,this._error=i,this._loaded=!0})}_visible(){let e=this._config,t=this._search.trim().toLowerCase(),i=new Set(e.hide_categories??[]),n=this._deviceFilter();return this._events.filter(r=>{if(this._notable&&!this._category&&!Di(r))return!1;if(this._category){if(r.category!==this._category)return!1}else if(e.categories?.length?!e.categories.includes(r.category):i.has(r.category))return!1;return!(!n(r.device_name)||t&&!`${r.title} ${r.message} ${r.device_name??""}`.toLowerCase().includes(t))})}_deviceFilter(){let e=this._device.trim();if(!e)return()=>!0;if(this._events.some(i=>i.device_name===e))return i=>i===e;let t=e.toLowerCase();return i=>!!i&&i.toLowerCase().includes(t)}_rows(e){let t=[];for(let i=e.length-1;i>=0;i--){let n=e[i],r=Hi(n),o=t[t.length-1],l=o&&new Date(o.events[0].time).toDateString()===new Date(n.time).toDateString();o&&o.key===r&&l&&n.category!=="insight"?o.events.push(n):t.push({key:r,events:[n]})}return t}_toggle(e){let t=new Set(this._open);t.has(e)?t.delete(e):t.add(e),this._open=t}render(){if(!this._loaded)return d`<ha-card><div class="empty">Loading network events…</div></ha-card>`;if(this._error)return d`<ha-card><div class="empty">Can't read CMR events from Home Assistant (${this._error}). Reload the page.</div></ha-card>`;let e=this._config,t=this._visible(),i=this._rows(t),n=i.slice(0,this._limit),r=[...new Set(this._events.map(c=>c.category))].sort((c,p)=>Object.keys(ze).indexOf(c)-Object.keys(ze).indexOf(p)),o=[...new Set(this._events.map(c=>c.device_name).filter(Boolean))].sort(),l=this._issues.filter(c=>this._deviceFilter()(c.device_name));return d`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:timeline-text-outline"></ha-icon>
          <span>${e.title??"Network events"}</span>
          ${l.length?d`<span class="chip alert">${l.length} issue${l.length>1?"s":""}</span>`:d`<span class="chip">no issues</span>`}
        </div>

        ${e.show_issues&&l.length?d`<div class="issues">${l.map(c=>this._issue(c))}</div>`:h}

        ${e.show_filters?d`<div class="filters">
              <div class="cats">
                <button class="pill ${!this._category&&this._notable?"on":""}"
                  @click=${()=>{this._category="",this._notable=!0}}>
                  <ha-icon icon="mdi:star-four-points-outline"></ha-icon>Notable</button>
                <button class="pill ${!this._category&&!this._notable?"on":""}"
                  @click=${()=>{this._category="",this._notable=!1}}>All</button>
                ${r.map(c=>{let p=Zt(c);return d`<button class="pill ${this._category===c?"on":""}" @click=${()=>this._category=this._category===c?"":c}>
                    <ha-icon icon=${p.icon}></ha-icon>${p.label}
                  </button>`})}
              </div>
              <div class="find">
                <input class="device" type="search" list="cmr-event-devices" placeholder="All devices"
                  aria-label="Device" .value=${this._device}
                  @input=${c=>this._device=c.target.value} />
                <datalist id="cmr-event-devices">
                  ${o.map(c=>d`<option value=${c}></option>`)}
                </datalist>
                <input type="search" placeholder="Search" .value=${this._search}
                  @input=${c=>this._search=c.target.value} />
              </div>
            </div>`:h}

        <div class="timeline">
          ${n.map((c,p)=>{let u=new Date(c.events[0].time),m=p?new Date(n[p-1].events[0].time):void 0,v=!m||m.toDateString()!==u.toDateString();return d`${v?d`<div class="day section-label">${this._dayLabel(u)}</div>`:h}${this._row(c)}`})}
          ${n.length?h:d`<div class="empty">No events${this._search||this._category||this._device?" match these filters":" yet"}.</div>`}
          ${i.length>this._limit?d`<button class="more" @click=${()=>this._limit+=50}>Show more (${i.length-this._limit})</button>`:h}
        </div>
      </ha-card>
    `}_issue(e){let t=e.device_name;return d`<div class="issue sev-${e.severity}">
      <ha-icon icon=${e.severity==="error"?"mdi:alert-octagon-outline":"mdi:alert-outline"}></ha-icon>
      <div class="body">
        <div class="title">${e.title}</div>
        <div class="detail">${e.detail}</div>
        <div class="meta">
          since ${this._time(new Date(e.since))} · ${e.count}×
          ${t&&e.device_id?d`· <a href="#" @click=${i=>{i.preventDefault(),A(`/config/devices/device/${e.device_id}`)}}>${t}</a>`:t?d`· ${t}`:h}
        </div>
      </div>
      ${this.hass.user?.is_admin?d`<button class="dismiss" title="Dismiss (comes back only on new occurrences)"
            @click=${()=>Me(this.hass,e.entry_id,e.key).catch(i=>console.error("cmr: dismiss",i))}>
            <ha-icon icon="mdi:close"></ha-icon></button>`:h}
    </div>`}_row(e){let t=e.events[0],i=t.id,n=this._open.has(i),r=e.events.length>1,o=e.events[e.events.length-1],l=new Map;for(let c of e.events){let p=String(c.data?.event??c.category);l.set(p,(l.get(p)??0)+1)}return d`
      <div class="row sev-${t.severity} ${n?"open":""}">
        <button class="line" @click=${()=>this._toggle(i)}>
          <span class="time">${this._time(new Date(t.time))}</span>
          <span class="dot-icon"><ha-icon icon=${zi(t)}></ha-icon></span>
          <span class="text">
            <span class="title">${t.title}</span>
            ${r?d`<span class="fold">${e.events.length} events since ${this._time(new Date(o.time))} ·
                  ${[...l].map(([c,p])=>`${p} ${c}`).join(", ")}</span>`:h}
          </span>
          ${t.device_name?d`<span class="device">${t.device_name}</span>`:h}
        </button>
        ${n?this._details(e):h}
      </div>
    `}_details(e){let t=e.events.slice(0,30);return d`<div class="details">
      ${t.map(i=>{let n=Object.entries(i.data??{}).filter(([r,o])=>o!=null&&o!==""&&!["event","key","rule_id"].includes(r));return d`<div class="detail-item">
          <div class="detail-head"><span class="mono">${new Date(i.time).toLocaleString(this.hass.language)}</span>
            <span class="muted">${i.source}${i.topics?.length?` \xB7 ${i.topics.join(",")}`:""}</span></div>
          ${i.message&&i.message!==i.title?d`<div class="raw mono">${i.message}</div>`:h}
          ${n.length?d`<div class="fields">${n.map(([r,o])=>d`<span class="chip">${r.replace(/_/g," ")}: ${typeof o=="object"?JSON.stringify(o):String(o)}</span>`)}</div>`:h}
        </div>`})}
      ${e.events.length>t.length?d`<div class="muted">…and ${e.events.length-t.length} more</div>`:h}
      ${e.events[0].device_id?d`<a class="open-device" href="#" @click=${i=>{i.preventDefault(),A(`/config/devices/device/${e.events[0].device_id}`)}}>
            <ha-icon icon="mdi:open-in-app"></ha-icon>Open ${e.events[0].device_name}</a>`:h}
    </div>`}_time(e){return e.toLocaleTimeString(this.hass.language,{hour:"2-digit",minute:"2-digit"})}_dayLabel(e){let t=new Date;t.setHours(0,0,0,0);let i=new Date(e);i.setHours(0,0,0,0);let n=Math.round((t.getTime()-i.getTime())/Ii);return n===0?"Today":n===1?"Yesterday":e.toLocaleDateString(this.hass.language,{weekday:"long",day:"numeric",month:"long"})}static{this.styles=[z,S`
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
    `]}};var Qt=8,Oi={offline:"mdi:lan-disconnect",pending:"mdi:link-variant-plus",alert:"mdi:bell-alert-outline",update:"mdi:update",ok:"mdi:check-circle-outline"},He=class extends T{constructor(){super();this._ruleDevices=new j(()=>this.requestUpdate());this._onLocation=()=>this._applyDeepLink();this._filter=new Set,this._status="",this._version="",this._alert="",this._search="",this._sort={key:"attention",desc:!1},this._limit=100,this._unfolded=!1,this._pairing=new Map,this._labelPicker=!1,this._labelSearch=""}static{this.properties={_filter:{state:!0},_status:{state:!0},_version:{state:!0},_alert:{state:!0},_search:{state:!0},_sort:{state:!0},_limit:{state:!0},_unfolded:{state:!0},_pairing:{state:!0},_labelPicker:{state:!0},_labelSearch:{state:!0}}}setConfig(e){this._config={show_filters:!0,show_search:!0,fold_after:50,page_size:100,deep_link:!0,...e},this._filter=new Set(e.labels??[]),this._status=e.status??"",this._version=e.version??"",this._alert=e.alert??"",this._limit=this._config.page_size??100,this._applyDeepLink()}static getConfigForm(){return{schema:[O,{name:"title",selector:{text:{}}},{name:"labels",selector:{text:{multiple:!0}}},{name:"status",selector:{select:{mode:"dropdown",options:oe.map(e=>({value:e,label:L[e]}))}}},{name:"show_filters",selector:{boolean:{}}},{name:"show_search",selector:{boolean:{}}},{name:"fold_after",selector:{number:{min:0,max:5e3,mode:"box"}}},{name:"compact",selector:{boolean:{}}}],computeLabel:D({entry_id:"Controller",title:"Title",labels:"Only devices with these labels",status:"Only devices with this status",show_filters:"Show filter chips",show_search:"Show search",fold_after:"Fold healthy devices above this many rows (0: never)",compact:"Overview mode: only devices needing attention, few rows"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 2+Math.min(this._entry?.devices.length??4,12)}connectedCallback(){super.connectedCallback(),window.addEventListener("location-changed",this._onLocation),this._applyDeepLink()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("location-changed",this._onLocation)}_applyDeepLink(){if(this._config?.deep_link===!1)return;let e=Ae();e.status&&(this._status=e.status),e.version&&(this._version=e.version),e.search&&(this._search=e.search),e.alert&&(this._alert=e.alert)}willUpdate(e){super.willUpdate(e),e.has("_entry")&&this._ruleDevices.invalidate()}_toggleLabel(e){let t=new Set(this._filter);t.has(e)?t.delete(e):t.add(e),this._filter=t}_setStatus(e){this._status=this._status===e?"":e,this._limit=this._config.page_size??100}_setSort(e){this._sort={key:e,desc:this._sort.key===e?!this._sort.desc:!1}}async _approve(e){this._pairing=new Map(this._pairing).set(e.key,"busy");try{await Pe(this.hass,this._entry.entry_id,e.key);let t=new Map(this._pairing);t.delete(e.key),this._pairing=t}catch(t){let i=t?.message??String(t);this._pairing=new Map(this._pairing).set(e.key,i)}}_sorted(e){let{key:t,desc:i}=this._sort,n=[...e].sort((r,o)=>{switch(t){case"device":return F(r,o);case"version":return(r.version??"").localeCompare(o.version??"",void 0,{numeric:!0});case"uptime":return(r.uptime??-1)-(o.uptime??-1);case"address":return(r.address??"").localeCompare(o.address??"",void 0,{numeric:!0});default:return oe.indexOf(M(r))-oe.indexOf(M(o))||F(r,o)}});return i?n.reverse():n}render(){let e=this._entry;if(!e)return this.renderWaiting();let t=!!this._config.compact,i=new Map;for(let b of e.devices)for(let E of b.labels)i.set(E,(i.get(E)??0)+1);let n=[...i.keys()].sort((b,E)=>i.get(E)-i.get(b)||b.localeCompare(E)),r=n.length>Qt+1?[...new Set([...n.slice(0,Qt),...this._filter])].sort((b,E)=>n.indexOf(b)-n.indexOf(E)):n,o=n.filter(b=>!r.includes(b)),l=this._labelSearch.trim().toLowerCase(),c=this._search.trim().toLowerCase(),p=this._alert?e.alerts.find(b=>b.id===this._alert):void 0,u=p&&p.devices_on>0?this._ruleDevices.get(this.hass,e.entry_id,p.id):p?[]:void 0,m=Array.isArray(u)?new Set(u):void 0,v=e.devices.filter(b=>[...this._filter].every(E=>b.labels.includes(E))&&(!this._version||b.version===this._version)&&(!m||m.has(b.key))&&Re(b,c)),g=new Map;for(let b of v)g.set(M(b),(g.get(M(b))??0)+1);let f=this._sorted(this._status?v.filter(b=>M(b)===this._status):v),x=this._config.fold_after??50,_=f.filter(b=>M(b)!=="ok"),$=f.length-_.length,w=!this._status&&!this._unfolded&&x>0&&f.length>x&&_.length>0&&$>0,y=t&&!this._status||w?_:f,k=y.slice(0,this._limit),C=this._config.views?.devices,P=b=>this._sort.key===b?d`<ha-icon class="sort" icon=${this._sort.desc?"mdi:arrow-down":"mdi:arrow-up"}></ha-icon>`:h;return d`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:router-network"></ha-icon>
          <span>${this._config.title??"Devices"}</span>
          <span class="chip">${f.length}${f.length!==e.devices.length?` of ${e.devices.length}`:""}</span>
          <div class="spacer"></div>
          ${t&&this._config.views?.devices?d`<button class="open-link" @click=${()=>A(U(this._config.views.devices))}>
                Open Devices <ha-icon icon="mdi:arrow-right"></ha-icon></button>`:h}
          ${this._config.show_search&&!t?d`<input class="search" type="search" placeholder="Search" .value=${this._search}
                @input=${b=>{this._search=b.target.value,this._limit=this._config.page_size??100}} />`:h}
        </div>
        ${this.renderStale(e)}
        ${this._config.show_filters?d`<div class="filters">
              <button class="pill ${this._status?"":"on"}" @click=${()=>this._setStatus("")}>All ${v.length}</button>
              ${oe.filter(b=>g.get(b)||b===this._status).map(b=>d`<button class="pill status-${b} ${this._status===b?"on":""}"
                  @click=${()=>this._setStatus(b)}>
                  <ha-icon icon=${Oi[b]}></ha-icon>${L[b]} ${g.get(b)??0}
                </button>`)}
              ${this._version?d`<button class="pill on" title="Clear the version filter" @click=${()=>this._version=""}>
                    <span class="mono">${this._version}</span> ✕</button>`:h}
              ${this._alert?d`<button class="pill on status-alert" title="Clear the alert filter" @click=${()=>this._alert=""}>
                    <ha-icon icon="mdi:bell-alert-outline"></ha-icon>${p?.name??"alert rule"}${u==="loading"?" \u2026":""} ✕</button>`:h}
              ${u==="unsupported"||u==="error"?d`<span class="muted small">${u==="unsupported"?"The controller lists a rule's devices only on its console, which the REST user may not use.":"Couldn't read the rule's device list from the controller."}</span>`:h}
              ${r.length&&!t?d`<span class="sep"></span>`:h}
              ${t?h:r.map(b=>d`<button class="pill ${this._filter.has(b)?"on":""}" @click=${()=>this._toggleLabel(b)}>
                      ${b}
                    </button>`)}
              ${o.length&&!t?d`<button class="pill more-labels ${this._labelPicker?"on":""}" aria-expanded=${this._labelPicker}
                    @click=${()=>this._labelPicker=!this._labelPicker}>
                    ${this._labelPicker?"Fewer labels":`+${o.length} more`}</button>`:h}
            </div>
            ${this._labelPicker&&o.length&&!t?d`<div class="picker">
                  <input class="search" type="search" placeholder="Find a label" .value=${this._labelSearch}
                    @input=${b=>this._labelSearch=b.target.value} />
                  <div class="picker-list">
                    ${o.filter(b=>!l||b.toLowerCase().includes(l)).sort().map(b=>d`<button class="pill ${this._filter.has(b)?"on":""}" @click=${()=>this._toggleLabel(b)}>
                          ${b} <span class="muted">${i.get(b)}</span>
                        </button>`)}
                  </div>
                </div>`:h}`:h}
        <div class="table" role="table">
          <div class="row head section-label" role="row">
            <button class="c-device" @click=${()=>this._setSort(this._sort.key==="device"?"attention":"device")}
              title="Click to sort by name; again for attention first">
              Device ${P("device")}${this._sort.key==="attention"?d`<ha-icon class="sort" icon="mdi:sort-variant" title="Attention first"></ha-icon>`:h}
            </button>
            <span class="c-labels">Labels</span>
            <button class="c-version" @click=${()=>this._setSort("version")}>Version ${P("version")}</button>
            <button class="c-uptime" @click=${()=>this._setSort("uptime")}>Uptime ${P("uptime")}</button>
            <button class="c-address" @click=${()=>this._setSort("address")}>Address ${P("address")}</button>
          </div>
          ${k.map(b=>this._row(b))}
          ${t&&!this._status&&$>0?d`<div class="fold static">
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                ${_.length?`${$} more`:`All ${$}`} device${$===1?"":"s"} online and up to date
              </div>`:h}
          ${w&&!t?d`<button class="fold" @click=${()=>this._unfolded=!0}>
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                ${$} device${$===1?"":"s"} online and up to date — show ${$===1?"it":"them"}
              </button>`:h}
          ${y.length>this._limit?t&&C?d`<button class="more" @click=${()=>A(U(C,this._status?{cmr_status:this._status}:{}))}>
                  ${y.length-this._limit} more — open Devices <ha-icon icon="mdi:arrow-right"></ha-icon></button>`:d`<button class="more" @click=${()=>this._limit+=this._config.page_size??100}>
                  Show more (${y.length-this._limit})</button>`:h}
          ${f.length?h:d`<div class="empty">${this._emptyText(e.devices.length)}</div>`}
        </div>
      </ha-card>
    `}_emptyText(e){return e?this._status?`No devices are ${L[this._status].toLowerCase()}.`:"No devices match these filters.":"The controller manages no devices yet."}_pairingCell(e,t){let i=this._pairing.get(e.key),n=e.pending&&!!this._entry?.actions&&!!this.hass.user?.is_admin;return d`<span class="offline" title=${Z(e)}>${L[t]}</span>
      ${n?d`<button class="approve" ?disabled=${i==="busy"}
            @click=${r=>{r.stopPropagation(),this._approve(e)}}>
            ${i==="busy"?"Approving\u2026":"Approve"}</button>`:h}
      ${i&&i!=="busy"?d`<span class="small offline">${i}</span>`:h}`}_uptimeCell(e,t){return t==="pending"?this._pairingCell(e,t):e.connected?d`${ge(e.uptime)}`:d`<span class="offline">${L[t]}</span>
        ${e.disconnected_since?d`<span class="muted small">since ${e.disconnected_since}</span>`:h}`}_row(e){let t=M(e);return d`
      <div class="row status-${t}" role="row"
        @click=${()=>R(this,(e.update_available?e.entities.update:void 0)??e.entities.connected)}>
        <div class="c-device">
          <div class="icon" title=${L[t]}>${Q(e,"thumb")}<i class="dot"></i></div>
          <div class="who">
            <div class="name">
              ${e.identity}
              ${e.controller?d`<ha-icon class="crown" icon="mdi:crown-outline" title="CMR controller"></ha-icon>`:h}
            </div>
            <div class="muted small">${q(e)}${fe(e)?d` · <span class="mono">${fe(e)}</span>`:h}</div>
          </div>
        </div>
        <div class="c-labels">${e.labels.map(i=>d`<span class="chip">${i}</span>`)}</div>
        <div class="c-version" title="Click to filter by this version">
          <button class="ver mono" @click=${i=>{i.stopPropagation(),this._version=this._version===e.version?"":e.version??""}}>
            ${e.version??"\u2013"}</button>
          ${e.update_available?d`<span class="update" title="Update available"><ha-icon icon="mdi:arrow-up-circle"></ha-icon><span class="mono">${e.available_version}</span></span>`:h}
        </div>
        <div class="c-uptime">${this._uptimeCell(e,t)}</div>
        <div class="c-address">
          ${e.address?d`<a class="mono" href=${Yt(e.address)} target="_blank" rel="noreferrer" @click=${i=>i.stopPropagation()}>${e.address}</a>`:d`<span class="muted">${e.controller?"local":"\u2013"}</span>`}
        </div>
      </div>
    `}static{this.styles=[z,S`
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
    `]}};var Ui=["devices","devices_online","updates_available","alerts_firing","network_issues"];function ji(a,s){let e=new Map;for(let[o,l]of Object.entries(a.entities??{})){if(l.platform!=="cmr"||!l.device_id||!Ui.includes(l.translation_key??"")||s&&!a.devices?.[l.device_id]?.config_entries?.includes(s))continue;let c=e.get(l.device_id)??new Map;c.set(l.translation_key,o),e.set(l.device_id,c)}let t=[...e.entries()].find(([,o])=>Number.isFinite(Number(a.states[o.get("devices_online")??""]?.state)));if(!t)return;let[i,n]=t,r=a.devices?.[i];return{name:r?.name_by_user||r?.name||"CMR controller",value:o=>Number(a.states[n.get(o)??""]?.state)||0}}var Ie=["var(--primary-color)","var(--cmr-update)","var(--cmr-pending)","var(--accent-color, #7e57c2)","var(--cmr-ok)","var(--cmr-muted)"],Oe=class extends T{constructor(){super();this._ruleDevices=new j(()=>this.requestUpdate());this._issues=[],this._pairing=new Map,this._openRule=""}static{this.properties={_panel:{state:!0},_version:{state:!0},_issues:{state:!0},_pairing:{state:!0},_openRule:{state:!0}}}willUpdate(e){super.willUpdate(e),e.has("_entry")&&this._ruleDevices.invalidate()}static getConfigForm(){return{schema:[O],computeLabel:D({entry_id:"Controller"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}getCardSize(){return 4}connectedCallback(){super.connectedCallback(),this._ticker=window.setInterval(()=>this.requestUpdate(),15e3)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._ticker),this._unsubscribeEvents?.(),this._unsubscribeEvents=void 0}_toggle(e,t){let i=this._panel===e&&(e!=="version"||this._version===t);this._panel=i?void 0:e,this._version=i?void 0:t,this._panel==="issues"&&!this._unsubscribeEvents?this._unsubscribeEvents=Se.subscribe(this.hass,this._config?.entry_id,(n,r)=>{this._issues=r}):this._panel!=="issues"&&this._unsubscribeEvents&&(this._unsubscribeEvents(),this._unsubscribeEvents=void 0)}async _approve(e){this._pairing=new Map(this._pairing).set(e.key,"busy");try{await Pe(this.hass,this._entry.entry_id,e.key);let t=new Map(this._pairing);t.delete(e.key),this._pairing=t}catch(t){this._pairing=new Map(this._pairing).set(e.key,t?.message??String(t))}}render(){let e=this._entry;if(!e)return this._renderFromSensors()??this.renderWaiting();let t=e.devices,i=t.find(_=>_.controller),n=t.filter(_=>_.connected).length,r=t.filter(_=>_.update_available).length,o=t.filter(_=>_.pending||_.remote_pending).length,l=e.alerts.filter(_=>_.devices_on>0).length,c=e.fleet_entities.network_issues?this.hass.states[e.fleet_entities.network_issues]?.state:void 0,p=Number(c)||0,u=t.length?n/t.length:0,m=new Map;t.forEach(_=>m.set(_.version??"unknown",(m.get(_.version??"unknown")??0)+1));let v=[...m.entries()].sort((_,$)=>$[1]-_[1]),g=26,f=2*Math.PI*g,x=_=>this._panel===_?"on":"";return d`
      <ha-card>
        <div class="hero">
          <div class="identity">
            ${i?.product?.image?d`<div class="logo photo"><img src=${i.product.image} alt=${i.product.name} referrerpolicy="no-referrer" /></div>`:d`<div class="logo"><ha-icon icon="mdi:router-network"></ha-icon></div>`}
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
            <button class="stat ring ${x("online")}" aria-pressed=${this._panel==="online"} @click=${()=>this._toggle("online")}>
              <svg viewBox="0 0 64 64" class=${n===t.length?"status-ok":"status-offline"}>
                <circle cx="32" cy="32" r=${g} class="track"></circle>
                <circle cx="32" cy="32" r=${g} class="value"
                  stroke-dasharray=${`${f*u} ${f}`} transform="rotate(-90 32 32)"></circle>
              </svg>
              ${t.length<100?d`<div class="ring-text"><b>${n}</b><span>/${t.length}</span></div>
                    <div class="label">online</div>`:d`<div class="ring-text"><b>${n}</b></div>
                    <div class="label">of ${t.length} online</div>`}
            </button>
            ${this._stat("updates","mdi:update",r,"updates",r?"update":"ok")}
            ${this._stat("alerts","mdi:bell-alert-outline",l,"alerts active",l?"alert":"ok")}
            ${this._stat("issues","mdi:stethoscope",p,p===1?"issue":"issues",p?"pending":"ok")}
            ${this._stat("pending","mdi:link-variant-plus",o,"to pair",o?"pending":"ok")}
          </div>
        </div>
        ${this.renderStale(e)}
        ${this._panel?this._renderPanel(e):h}

        <div class="bars">
          <div class="bar-title">
            <span>Versions</span>
            <span class="muted">updated ${ve(e.last_update)}</span>
          </div>
          <div class="bar">
            ${v.map(([_,$],w)=>d`<button class="seg ${this._panel==="version"&&this._version===_?"on":""}"
                title="${_}: ${$} — click to list them"
                style="flex:${$};background:${Ie[w%Ie.length]}"
                @click=${()=>this._toggle("version",_)}></button>`)}
          </div>
          <div class="keys">
            ${v.map(([_,$],w)=>d`<button class="key ${this._panel==="version"&&this._version===_?"on":""}"
                @click=${()=>this._toggle("version",_)}>
                <i style="background:${Ie[w%Ie.length]}"></i>
                <span class="mono">${_}</span> <span class="muted">×${$}</span></button>`)}
          </div>
        </div>
      </ha-card>
    `}_renderFromSensors(){if(this._error)return;let e=ji(this.hass,this._config?.entry_id);if(!e)return;let t=e.value("devices_online"),i=e.value("devices"),n=(c,p,u,m)=>d`<div class="stat static status-${m}"><ha-icon icon=${c}></ha-icon><b>${p}</b><div class="label">${u}</div></div>`,r=e.value("updates_available"),o=e.value("alerts_firing"),l=e.value("network_issues");return d`
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
            ${n("mdi:update",r,"updates",r?"update":"ok")}
            ${n("mdi:bell-alert-outline",o,"alerts active",o?"alert":"ok")}
            ${n("mdi:stethoscope",l,l===1?"issue":"issues",l?"pending":"ok")}
          </div>
        </div>
      </ha-card>
    `}_stat(e,t,i,n,r){return d`
      <button class="stat status-${r} ${this._panel===e?"on":""}" aria-pressed=${this._panel===e}
        @click=${()=>this._toggle(e)}>
        <ha-icon icon=${t}></ha-icon>
        <b>${i}</b>
        <div class="label">${n}</div>
      </button>
    `}_renderPanel(e){let t=this._panel,i=c=>[...c].sort(F),n="",r=[],o="",l;if(t==="online"){let c=i(e.devices.filter(p=>!p.connected));n=c.length?`${c.length} offline`:"All devices online",o="Every managed device is connected to the controller.",r=c.map(p=>this._deviceRow(p,p.disconnected_since?`since ${p.disconnected_since}`:"disconnected")),l={view:this._config.views?.devices,params:{cmr_status:"offline"}}}else if(t==="updates"){let c=i(e.devices.filter(p=>p.update_available));n=c.length?`${c.length} with an update`:"Everything is up to date",o="No device's channel offers a newer version.",r=c.map(p=>this._deviceRow(p,d`<span class="mono">${p.version}</span> → <span class="mono up">${p.available_version}</span>`,p.entities.update)),l={view:this._config.views?.devices,params:{cmr_status:"update"}}}else if(t==="alerts"){let c=e.alerts.filter(p=>p.devices_on>0).sort((p,u)=>u.devices_on-p.devices_on);n=c.length?`${c.length} alert rule${c.length>1?"s":""} active`:"No alert rule is active",o="All alert rules are quiet.",r=c.map(p=>this._ruleRow(p,e))}else if(t==="issues")n=this._issues.length?`${this._issues.length} detected issue${this._issues.length>1?"s":""}`:"No issues detected",o=this._unsubscribeEvents?"Nothing unusual in the events.":"Loading\u2026",r=this._issues.map(c=>d`<div class="item sev-${c.severity}">
          <ha-icon icon=${c.severity==="error"?"mdi:alert-octagon-outline":"mdi:alert-outline"}></ha-icon>
          <div class="text">
            <div class="t">${c.title}</div>
            <div class="muted small">${c.detail}</div>
          </div>
          ${c.device_name?d`<span class="chip">${c.device_name}</span>`:h}
          ${this.hass.user?.is_admin?d`<button class="dismiss" title="Dismiss (comes back only on new occurrences)"
                @click=${()=>Me(this.hass,c.entry_id,c.key).catch(p=>console.error("cmr: dismiss",p))}>
                <ha-icon icon="mdi:close"></ha-icon></button>`:h}
        </div>`),l={view:this._config.views?.events,params:{}};else if(t==="pending"){let c=i(e.devices.filter(p=>p.pending||p.remote_pending));n=c.length?`${c.length} waiting to pair`:"No device is waiting to pair",o="New devices appear here until their pairing is approved.",r=c.map(p=>this._pendingRow(p,e)),l={view:this._config.views?.devices,params:{cmr_status:"pending"}}}else{let c=i(e.devices.filter(p=>(p.version??"unknown")===this._version));n=`${c.length} on ${this._version}`,r=c.map(p=>this._deviceRow(p,p.update_available?d`update: <span class="mono up">${p.available_version}</span>`:q(p))),l={view:this._config.views?.devices,params:{cmr_version:this._version}}}return d`<div class="panel">
      <div class="panel-head">
        <span class="section-label">${n}</span>
        <span class="spacer"></span>
        ${l?.view?d`<button class="link" @click=${()=>A(U(l.view,l.params))}>
              Open in ${t==="issues"?"Events":"Devices"} <ha-icon icon="mdi:arrow-right"></ha-icon></button>`:h}
        <button class="close" title="Close" @click=${()=>this._toggle(t,this._version)}><ha-icon icon="mdi:close"></ha-icon></button>
      </div>
      ${r.length?r:d`<div class="muted small">${o}</div>`}
    </div>`}_deviceRow(e,t,i){return d`<button class="item status-${e.connected?e.update_available?"update":"ok":"offline"}"
      @click=${()=>R(this,i??e.entities.connected)}>
      ${Q(e,"thumb")}
      <div class="text">
        <div class="t">${e.identity}</div>
        <div class="muted small">${t}</div>
      </div>
    </button>`}_ruleRow(e,t){let i=this._openRule===e.id;return d`<button class="item sev-${e.severity} ${i?"open":""}" aria-expanded=${i}
        @click=${()=>this._openRule=i?"":e.id}>
        <ha-icon icon="mdi:bell-alert"></ha-icon>
        <div class="text">
          <div class="t">${e.name}</div>
          <div class="muted small">${e.severity} · ${e.categories.join(", ")||"uncategorised"} · fired ${e.fired}×</div>
        </div>
        <span class="chip alert">${e.devices_on}/${e.devices}</span>
        <ha-icon class="chev" icon=${i?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </button>
      ${i?Te(this,t,e,this._ruleDevices.get(this.hass,t.entry_id,e.id),this._config.views):h}`}_pendingRow(e,t){let i=this._pairing.get(e.key),n=e.pending&&t.actions&&!!this.hass.user?.is_admin;return d`<div class="item status-pending">
      ${Q(e,"thumb")}
      <div class="text">
        <div class="t">${e.identity}</div>
        <div class="muted small">${q(e)} · ${Z(e)}${i&&i!=="busy"?` \xB7 ${i}`:""}</div>
      </div>
      ${n?d`<button class="approve" ?disabled=${i==="busy"} @click=${()=>this._approve(e)}>
            ${i==="busy"?"Approving\u2026":"Approve"}</button>`:h}
    </div>`}static{this.styles=[z,Le,S`
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
    `]}};var ei=(a,s,e={})=>({type:"heading",heading:a,icon:s,heading_style:"title",...e});function Fi(a,s,e){return Promise.race([a,new Promise(t=>setTimeout(()=>t(e),s))])}function Wi(a,s,e){let t=r=>!!r&&!!s.states[r]&&s.states[r].state!=="unavailable",i=a.entities,n=[ei(a.identity,re(a),{heading_style:"subtitle",...a.device_id?{tap_action:{action:"navigate",navigation_path:`/config/devices/device/${a.device_id}`}}:{},badges:t(i.version)?[{type:"entity",entity:i.version,show_icon:!0}]:[]})];return t(i.connected)&&n.push({type:"tile",entity:i.connected,name:"Connection",state_content:["state","last_changed"]}),t(i.uptime)&&n.push({type:"tile",entity:i.uptime,name:"Up since"}),t(i.update)&&n.push({type:"tile",entity:i.update,name:"RouterOS",show_entity_picture:!0,grid_options:{columns:12}}),t(i.active_alerts)&&n.push({type:"tile",entity:i.active_alerts,name:"Alerts"}),e&&t(i.alert)&&n.push({type:"tile",entity:i.alert,name:"Last alert"}),{type:"grid",cards:n}}function Ki(a,s,e){let t=a.fleet_entities;return{title:"Network",path:"network",icon:"mdi:router-network",type:"sections",max_columns:3,badges:[[t.devices_online,"Online"],[t.updates_available,"Updates"],[t.alerts_firing,"Alerts active"],[t.network_issues,"Issues"]].filter(([i])=>i).map(([i,n])=>({type:"entity",entity:i,name:n,show_name:!0})),sections:[{type:"grid",column_span:3,cards:[{...s,type:"custom:cmr-status-card",views:{devices:"devices",events:"events",topology:"topology"}}]},{type:"grid",column_span:3,cards:[{...s,type:"custom:cmr-topology-card",link_style:e,height:480,views:{devices:"devices"},grid_options:{columns:"full"}}]},{type:"grid",column_span:2,cards:[{...s,type:"custom:cmr-fleet-card",compact:!0,page_size:8,views:{devices:"devices"},grid_options:{columns:"full"}},{...s,type:"custom:cmr-events-card",max_items:15,notable:!0,grid_options:{columns:"full"}}]},{type:"grid",cards:[{...s,type:"custom:cmr-alerts-card",views:{devices:"devices",topology:"topology"},grid_options:{columns:"full"}},{...s,type:"custom:cmr-upgrades-card",views:{devices:"devices"},grid_options:{columns:"full"}}]}]}}var Bi=24;function qi(a,s,e){let t=a.alerts.some(o=>o.webhook),i=[...a.devices].sort(F),n=i.length<=Bi,r=i.map(o=>o.entities.connected).filter(Boolean);return{title:"Devices",path:"devices",icon:"mdi:devices",type:"sections",max_columns:4,sections:[{type:"grid",column_span:4,cards:[{...e,type:"custom:cmr-fleet-card",grid_options:{columns:"full"}}]},...n?[{type:"grid",column_span:4,cards:[ei("Connectivity, last 24 hours","mdi:chart-timeline-variant"),{type:"history-graph",hours_to_show:24,entities:r,grid_options:{columns:"full"}}]},...i.map(o=>Wi(o,s,t))]:[]]}}function Vi(a){return{title:"Events",path:"events",icon:"mdi:timeline-text-outline",type:"sections",max_columns:2,sections:[{type:"grid",column_span:2,cards:[{...a,type:"custom:cmr-events-card",max_items:100,grid_options:{columns:"full"}}]}]}}function Yi(a,s){return{title:"Topology",path:"topology",icon:"mdi:sitemap-outline",type:"panel",cards:[{...a,type:"custom:cmr-topology-card",link_style:s,height:760,views:{devices:"devices"}}]}}function Ji(a){return{title:"Wi-Fi",path:"wifi",icon:"mdi:wifi",type:"sections",max_columns:2,sections:[{type:"grid",column_span:2,cards:[{...a,type:"custom:cmr-wifi-card",grid_options:{columns:"full"}}]}]}}function mt(a,s){return{title:a.title??"Network",views:[{title:"Network",path:"network",cards:[{type:"markdown",content:`## CMR
${s}`}]}]}}var Ue=class extends HTMLElement{static getCreateSuggestions(){return{title:"Network",icon:"mdi:router-network"}}static{this.configRequired=!0}static async getConfigElement(){return document.createElement("cmr-strategy-editor")}static async generate(s,e){try{let t=await Fi(Ce.once(e),8e3,[]),i=Ee(t,s.entry_id);if(!i&&s.entry_id&&t.length)return mt(s,"The controller this dashboard shows isn't loaded right now. If Home Assistant just started, reload in a moment; if the controller was removed, open *Edit dashboard* and pick another one.");if(!i)return mt(s,"No CMR controller is set up yet. Add the **CMR** integration under [Settings \u2192 Devices & services](/config/integrations/dashboard/add?domain=cmr).");let n=t.length>1||s.entry_id?{entry_id:i.entry_id}:{},r=s.link_style??"straight",o=Ki(i,n,r);return{title:s.title??i.title,views:[o,Vi(n),qi(i,e,n),Yi(n,r),Ji(n)]}}catch(t){return console.error("cmr: dashboard strategy failed",t),mt(s,`The dashboard couldn't be built (${String(t)}). Reload the page to try again.`)}}};var Fe={name:"link_style",selector:{select:{options:[{value:"straight",label:"Straight"},{value:"elbow",label:"Elbow (right angles)"}]}}};function ii(a,s){let e=[],t=a[0];for(let i=1;i<a.length;i++){let n=a[i],r=a[i+1],o=a[i-1],l=Math.hypot(n.x-o.x,n.y-o.y),c=r?Math.hypot(r.x-n.x,r.y-n.y):0,u=r&&(n.x-o.x)*(r.y-n.y)!==(n.y-o.y)*(r.x-n.x)?Math.min(s,l/2,c/2):0;if(u>0){let m={x:n.x-(n.x-o.x)*u/l,y:n.y-(n.y-o.y)*u/l},v={x:n.x+(r.x-n.x)*u/c,y:n.y+(r.y-n.y)*u/c};e.push({start:t,end:m},{start:m,corner:n,end:v}),t=v}else e.push({start:t,end:n}),t=n}return e}function vt(a,s=0){return a.length?`M ${a[0].x} ${a[0].y}`+ii(a,s).map(({corner:e,end:t})=>e?` Q ${e.x} ${e.y} ${t.x} ${t.y}`:` L ${t.x} ${t.y}`).join(""):""}function ft(a,s=0){if(s>0){let i=[a[0]];for(let{start:n,end:r,corner:o}of ii(a,s)){if(!o){i.push(r);continue}for(let l=1;l<=12;l++){let c=l/12,p=1-c;i.push({x:p*p*n.x+2*p*c*o.x+c*c*r.x,y:p*p*n.y+2*p*c*o.y+c*c*r.y})}}return ft(i)}let e=a.slice(1).map((i,n)=>Math.hypot(i.x-a[n].x,i.y-a[n].y)),t=e.reduce((i,n)=>i+n,0)/2;for(let i=0;i<e.length;i++){if(t<=e[i]&&e[i]){let n=t/e[i];return{x:a[i].x+n*(a[i+1].x-a[i].x),y:a[i].y+n*(a[i+1].y-a[i].y)}}t-=e[i]}return a[0]}function _e(a){let s=[];for(let e of a){let t=s.at(-1);if(t?.x===e.x&&t.y===e.y)continue;let i=s.at(-2);i&&t&&(i.x===t.x&&t.x===e.x||i.y===t.y&&t.y===e.y)&&s.pop(),s.push(e)}return s}function ti(a,s,e){return a.x===s.x?a.x>e.x0&&a.x<e.x1&&Math.max(a.y,s.y)>e.y0&&Math.min(a.y,s.y)<e.y1:a.y>e.y0&&a.y<e.y1&&Math.max(a.x,s.x)>e.x0&&Math.min(a.x,s.x)<e.x1}var gt=class{constructor(){this.items=[]}push(s){let e=this.items;e.push(s);let t=e.length-1;for(;t;){let i=t-1>>1;if(e[i].rank<=s.rank)break;e[t]=e[i],t=i}e[t]=s}pop(){let s=this.items,e=s[0],t=s.pop();if(s.length&&t){let i=0;for(;i*2+1<s.length;){let n=i*2+1;if(n+1<s.length&&s[n+1].rank<s[n].rank&&n++,s[n].rank>=t.rank)break;s[i]=s[n],i=n}s[i]=t}return e}},je=class{constructor(s,e=184,t=62){this.nodeWidth=e;this.nodeHeight=t;this.used=new Map;this.nodes=new Map(s.map(l=>[l.id,l]));let i=Math.min(0,...s.map(l=>l.x-e/2))-96,n=Math.min(0,...s.map(l=>l.y-t/2))-96,r=Math.max(0,...s.map(l=>l.x+e/2))+96,o=Math.max(0,...s.map(l=>l.y+t/2))+96;this.step=Math.max(24,Math.ceil(Math.sqrt((r-i)*(o-n)/12e4)),Math.ceil((r-i)/4096),Math.ceil((o-n)/4096)),this.x0=Math.floor(i/this.step)*this.step,this.y0=Math.floor(n/this.step)*this.step,this.cols=Math.ceil((r-this.x0)/this.step)+1,this.rows=Math.ceil((o-this.y0)/this.step)+1,this.blocked=new Uint8Array(this.cols*this.rows),this.boxes=new Map(s.map(l=>[l.id,{x0:l.x-e/2-10,x1:l.x+e/2+10,y0:l.y-t/2-10,y1:l.y+t/2+10}]));for(let l of this.boxes.values()){let c=Math.max(0,Math.ceil((l.x0-this.step/2-this.x0)/this.step)),p=Math.min(this.cols-1,Math.floor((l.x1+this.step/2-this.x0)/this.step)),u=Math.max(0,Math.ceil((l.y0-this.step/2-this.y0)/this.step)),m=Math.min(this.rows-1,Math.floor((l.y1+this.step/2-this.y0)/this.step));for(let v=u;v<=m;v++)for(let g=c;g<=p;g++)this.blocked[v*this.cols+g]=1}}routeAll(s){let e=new Map,t=new Map,i=new Map,n=new Map;for(let o of s){let l=this.nodes.get(o.node1),c=this.nodes.get(o.node2);if(!(!l||!c||l===c))for(let[p,u]of[[l,c],[c,l]])i.set(p.id,(i.get(p.id)??0)+1),n.has(p)||n.set(p,[]),n.get(p).push({peer:u,edge:o})}for(let[o,l]of n)for(let{peer:c,edge:p}of l){let u=Math.abs(c.x-o.x)>=this.nodeWidth+24?l.filter(_=>Math.abs(_.peer.x-c.x)<=24).length:0,m=Math.abs(c.y-o.y)>=this.nodeHeight+24?l.filter(_=>Math.abs(_.peer.y-c.y)<=16).length:0,v=u>=2&&u>m?!0:m>=2&&m>u?!1:Math.abs(c.x-o.x)>Math.abs(c.y-o.y),g=v?Math.sign(c.x-o.x):0,f=v?0:Math.sign(c.y-o.y),x=JSON.stringify([o.id,g,f]);t.has(x)||t.set(x,{node:o,dx:g,dy:f,edges:[]}),t.get(x).edges.push(p)}let r=[...t.values()].sort((o,l)=>i.get(l.node.id)-i.get(o.node.id)||o.node.id.localeCompare(l.node.id)||o.dx-l.dx||o.dy-l.dy);for(let o of r){let{node:l,dx:c,dy:p}=o,u=o.edges.filter(_=>!e.has(_.id)).sort((_,$)=>_.id.localeCompare($.id));if(u.length<2)continue;let m={x:l.x+c*this.nodeWidth/2,y:l.y+p*this.nodeHeight/2},v=u.map(_=>{let $=this.nodes.get(_.node1===l.id?_.node2:_.node1),w={x:$.x-c*this.nodeWidth/2,y:$.y-p*this.nodeHeight/2};return{edge:_,peer:$,end:w,gap:(w.x-m.x)*c+(w.y-m.y)*p}}).filter(_=>_.gap>=48);if(v.length<2)continue;let g=Math.min(...v.map(_=>_.gap)),f=[],x=1/0;for(let _ of[...new Set([Math.min(64,g/2),g/2,g/3,g*2/3])]){let $={x:m.x+c*_,y:m.y+p*_},w=v.flatMap(({edge:k,peer:C,end:P})=>{let b=_e([m,$,c?{x:$.x,y:P.y}:{x:P.x,y:$.y},P]);return this.clear(b,l,C)?[{edge:k,points:b}]:[]}),y=w.reduce((k,C)=>k+C.points.slice(1).reduce((P,b,E)=>P+Math.abs(b.x-C.points[E].x)+Math.abs(b.y-C.points[E].y),0),0);(w.length>f.length||w.length===f.length&&y<x)&&(f=w,x=y)}if(f.length>=2)for(let{edge:_,points:$}of f)e.set(_.id,_.node1===l.id?$:[...$].reverse())}for(let o of[...s].sort((l,c)=>l.id.localeCompare(c.id))){let l=this.nodes.get(o.node1),c=this.nodes.get(o.node2);!e.has(o.id)&&l&&c&&e.set(o.id,this.route(l,c))}return e}clear(s,e,t){return[...this.boxes].every(([i,n])=>{let r=i===e.id||i===t.id?{x0:n.x0+10,x1:n.x1-10,y0:n.y0+10,y1:n.y1-10}:n;return s.slice(1).every((o,l)=>!ti(s[l],o,r))})}alignedRoute(s,e){if(Math.abs(s.x-e.x)<=Math.min(24,this.nodeWidth/2)&&Math.abs(s.y-e.y)>=this.nodeHeight+24){let t=(s.x+e.x)/2,i=Math.sign(e.y-s.y),n=[{x:t,y:s.y+i*this.nodeHeight/2},{x:t,y:e.y-i*this.nodeHeight/2}];if(this.clear(n,s,e))return n}if(Math.abs(s.y-e.y)<=Math.min(16,this.nodeHeight/2)&&Math.abs(s.x-e.x)>=this.nodeWidth+24){let t=(s.y+e.y)/2,i=Math.sign(e.x-s.x),n=[{x:s.x+i*this.nodeWidth/2,y:t},{x:e.x-i*this.nodeWidth/2,y:t}];if(this.clear(n,s,e))return n}}point(s){return{x:this.x0+s%this.cols*this.step,y:this.y0+Math.floor(s/this.cols)*this.step}}exits(s){let e=[];for(let[t,i]of[[1,0],[-1,0],[0,1],[0,-1]]){let n={x:s.x+t*this.nodeWidth/2,y:s.y+i*this.nodeHeight/2},r=(v,g)=>g>0?Math.ceil(v):g<0?Math.floor(v):Math.round(v),o=r((n.x+t*(12+this.step)-this.x0)/this.step,t),l=r((n.y+i*(12+this.step)-this.y0)/this.step,i);if(o<0||o>=this.cols||l<0||l>=this.rows)continue;let c=l*this.cols+o;if(this.blocked[c])continue;let p=this.point(c),u=_e([n,t?{x:p.x,y:n.y}:{x:n.x,y:p.y},p]);if([...this.boxes].every(([v,g])=>v===s.id||u.slice(1).every((f,x)=>!ti(u[x],f,g)))){let v=u.at(-2);e.push({cell:c,points:u,direction:v.x===p.x?1:0})}}return e}simpleRoute(s,e){let t=r=>[[1,0],[-1,0],[0,1],[0,-1]].map(([o,l])=>({x:r.x+o*this.nodeWidth/2,y:r.y+l*this.nodeHeight/2,dx:o,dy:l})),i,n=1/0;for(let r of t(s))for(let o of t(e)){let l=(r.x+o.x)/2,c=(r.y+o.y)/2;for(let p of[[{x:r.x,y:o.y}],[{x:o.x,y:r.y}],[{x:l,y:r.y},{x:l,y:o.y}],[{x:r.x,y:c},{x:o.x,y:c}]]){let u=_e([r,...p,o]);if(u.length<2)continue;let m=u[1],v=u.at(-2);if((r.dx?m.y!==r.y||(m.x-r.x)*r.dx<=0:m.x!==r.x||(m.y-r.y)*r.dy<=0)||(o.dx?v.y!==o.y||(v.x-o.x)*o.dx<=0:v.x!==o.x||(v.y-o.y)*o.dy<=0))continue;let g=u.slice(1).reduce((f,x,_)=>f+Math.abs(x.x-u[_].x)+Math.abs(x.y-u[_].y),0)+(u.length-2)*20;g>=n||!this.clear(u,s,e)||(i=u,n=g)}}return i}route(s,e){let t=this.alignedRoute(s,e);if(t)return t;let i=this.simpleRoute(s,e);if(i)return i;let n=this.exits(s),r=this.exits(e),o=new Map(r.map(g=>[g.cell,g])),l=new gt,c=new Map,p=new Map,u=new Map,m=g=>{let f=this.point(g);return Math.min(...r.map(x=>{let _=this.point(x.cell);return Math.abs(f.x-_.x)+Math.abs(f.y-_.y)}))};for(let g of n){let f=g.cell*2+g.direction,x=Math.abs(s.x-this.point(g.cell).x)+Math.abs(s.y-this.point(g.cell).y);c.set(f,x),u.set(f,g),l.push({key:f,cost:x,rank:x+m(g.cell)})}for(let g=0;r.length&&g<3e4;g++){let f=l.pop();if(!f)break;if(c.get(f.key)!==f.cost)continue;let x=Math.floor(f.key/2),_=f.key%2,$=o.get(x);if($){let k=[x],C=f.key;for(;p.has(C);)C=p.get(C),k.push(Math.floor(C/2));let P=u.get(C);k.reverse();for(let b of k)this.used.set(b,(this.used.get(b)??0)+1);return _e([...P.points,...k.map(b=>this.point(b)),...[...$.points].reverse()])}let w=x%this.cols,y=Math.floor(x/this.cols);for(let[k,C,P]of[[1,0,0],[-1,0,0],[0,1,1],[0,-1,1]]){if(w+k<0||w+k>=this.cols||y+C<0||y+C>=this.rows)continue;let b=x+k+C*this.cols;if(this.blocked[b])continue;let E=b*2+P,ie=f.cost+this.step+(P===_?0:20)+(this.used.get(b)??0)*4;ie>=(c.get(E)??1/0)||(c.set(E,ie),p.set(E,f.key),l.push({key:E,cost:ie,rank:ie+m(b)}))}}let v=(s.x+e.x)/2;return _e([s,{x:v,y:s.y},{x:v,y:e.y},e])}};var Gi=[{name:"entry_id",selector:{config_entry:{integration:"cmr"}}},{name:"title",selector:{text:{}}},Fe],Xi=D({entry_id:"Controller (empty: the first one)",title:"Title shown in the dashboard header",link_style:"Map link style"}),We=class extends I{static{this.properties={hass:{attribute:!1},lovelace:{attribute:!1},_config:{state:!0}}}setConfig(s){this._config={link_style:"straight",...s}}connectedCallback(){super.connectedCallback(),Zi()}render(){return!this.hass||!this._config?d``:d`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${Gi}
      .computeLabel=${Xi}
      @value-changed=${this._changed}
    ></ha-form>`}_changed(s){s.stopPropagation();let e={...this._config,...s.detail.value,type:this._config.type};for(let t of["entry_id","title"])e[t]||delete e[t];this._config=e,ut(this,"config-changed",{config:e})}};async function Zi(){if(!customElements.get("ha-form"))try{await(await(await window.loadCardHelpers?.())?.createCardElement({type:"entities",entities:[]}))?.constructor?.getConfigElement?.()}catch{}}function si(a,s,e){let t=new Map,i=new Set;for(let n of[...e,...a]){if(i.has(n))continue;i.add(n);let r=[n];for(;r.length;){let o=r.shift();for(let l of s){let c=l.target_layout;l.layout!==o||!c||i.has(c)||(i.add(c),t.set(o,[...t.get(o)??[],c]),r.push(c))}}}return t}var Ke=class{constructor(s,e,t,i,n){this.entryId=s;this.layout=e;this.origin=t;this.moved=new Set;this.originals=new Map(i.filter(r=>r.layout===e).map(r=>[r.id,{...r}])),this.positions=new Map(n.filter(r=>r.restId).map(r=>[r.restId,{x:r.x+t.x,y:r.y+t.y}])),this.initialPositions=new Map(this.positions)}move(s,e,t,i=1){if(!this.originals.has(s)||!Number.isFinite(e)||!Number.isFinite(t))return;let n=r=>Math.max(-(2**31),Math.min(2**31-1,Math.round(r/i)*i));this.positions.set(s,{x:n(e),y:n(t)}),this.moved.add(s)}changes(){return[...this.moved].flatMap(s=>{let e=this.originals.get(s),t=this.positions.get(s),i=this.initialPositions.get(s);return(e.x==null||e.y==null)&&t.x===i?.x&&t.y===i.y?[]:e.x===t.x&&e.y===t.y?[]:[{id:s,revision:e.revision,...t}]})}acknowledge(s){for(let e of s){let t=this.originals.get(e.id);t&&this.originals.set(e.id,{...t,...e}),this.positions.set(e.id,{x:e.x,y:e.y}),this.moved.delete(e.id)}}};function _t(a,s,e){let t=new Map(a.nodes.map(n=>[`${n.layout}\0${n.name}`,n.device_key])),i=new Map;for(let n of a.links){let r=t.get(`${n.layout}\0${n.node1}`),o=t.get(`${n.layout}\0${n.node2}`),l=r===s.key?"a":o===s.key?"b":void 0;if(!l)continue;let c=l==="a"?o:r,p=c?e.get(c):void 0;for(let u of n.ports){let m=l==="a"?u.a:u.b;i.get(m.interface)?.up===void 0&&i.set(m.interface,{interface:m.interface,peer:p?.identity??(l==="a"?n.node2:n.node1),up:p?s.connected&&p.connected:void 0,poe:m.poe==="powered-on"})}}return[...i.values()].sort((n,r)=>n.interface.localeCompare(r.interface,void 0,{numeric:!0}))}var Qi=[[/^ether(\d+)/,"ether"],[/^combo(\d+)/,"combo"],[/^sfp-sfpplus(\d+)/,"sfp+"],[/^sfp28-(\d+)/,"sfp28"],[/^sfp56-(\d+)/,"sfp56"],[/^qsfpplus(\d+)/,"qsfp+"],[/^qsfp28-(\d+)/,"qsfp28"],[/^qsfp56-dd-(\d+)/,"qsfp56-dd"],[/^qsfp56-(\d+)/,"qsfp56"],[/^sfp(\d+)/,"sfp"]];function es(a,s){let e=a.toLowerCase();for(let[t,i]of Qi){let n=t.exec(e);if(!n)continue;if(i==="ether")return`ether:${n[1]}`;let r=s.cages.map(([l])=>l);if(r.includes(i))return`${i}:${n[1]}`;let o=i==="sfp"?"sfp+":i==="sfp+"?"sfp":void 0;return o&&r.includes(o)?`${o}:${n[1]}`:void 0}}var ts={sfp:"SFP","sfp+":"SFP+",combo:"combo",sfp28:"SFP28",sfp56:"SFP56","qsfp+":"QSFP+",qsfp28:"QSFP28",qsfp56:"QSFP56","qsfp56-dd":"QSFP56-DD"},ni=new Set(["qsfp+","qsfp28","qsfp56","qsfp56-dd"]),ee=10,is=15,ae=8,W=2,Be=10,ri=7;function ss(a,s){let e=a.ether.reduce((g,[,f])=>g+f,0),t=g=>a.poe_out.some(([f,x])=>g>=f&&g<=x),i=e>=14||/^CRS/i.test(s)&&/-IN$/i.test(s)&&e>=8,n=(g,f)=>!ni.has(g)&&f>2,r=i||a.cages.some(([g,f])=>n(g,f))?2:1,o=r===2?Be/2:0,l=[],c=0,p=(g,f,x)=>l.push({key:`ether:${g}`,label:String(g),cage:!1,x:f,y:x<0?o:x*Be,w:ee,flip:x===1,poeOut:t(g)}),u=g=>{c=g+ri},m=e,v=[];if(i&&e%2&&v.push(m--),a.mgmt&&v.push(e+1),v.length&&(v.sort((g,f)=>g-f).forEach((g,f)=>p(g,c+f*(ee+W),-1)),u(c+v.length*(ee+W)-W)),m){for(let f=0;f<m;f++)i?p(f+1,c+Math.floor(f/2)*(ee+W),f%2?0:1):p(f+1,c+f*(ee+W),-1);let g=i?Math.ceil(m/2):m;u(c+g*(ee+W)-W)}for(let[g,f]of a.cages){let x=ni.has(g)?is:ee,_=c;for(let $=0;$<f;$++){let w,y;if(n(g,f)){let k=Math.floor($/4);w=c+(k*2+Math.floor($%4/2))*(x+W)+k*W,y=$%2?0:1}else w=c+$*(x+W),y=-1;l.push({key:`${g}:${$+1}`,label:String($+1),cage:!0,x:w,y:y<0?o:y*Be,w:x,flip:y===1,poeOut:!1}),_=Math.max(_,w+x)}u(_)}return{cells:l,width:Math.max(0,c-ri),rows:r}}function yt(a){let s=[];a.ether.length&&s.push(`${a.ether.map(([e,t])=>`${t}\xD7 ${e}`).join(" + ")} Ethernet`),a.mgmt&&s.push("management port");for(let[e,t]of a.cages)s.push(`${t}\xD7 ${ts[e]}`);if(a.poe_out.length){let e=a.poe_out.map(([t,i])=>t===i?`ether${t}`:`ether${t}\u2013${i}`);s.push(`PoE out ${e.join(", ")}`)}return s.join(" \xB7 ")}var ns="M2.2 0 L0 2.9 H1.5 L1.1 5 L3.6 1.9 H2 Z",rs=276;function oi(a,s){let e=a.ports;if(!e)return h;let{cells:t,width:i,rows:n}=ss(e,a.code);if(!t.length)return h;let r=new Map;for(let _ of s){let $=es(_.interface,e);$&&r.set($,_)}let o=/RM$/i.test(a.code),l=3,c=o?8:0,p=-l-c,u=i+2*(l+c),m=(n===2?Be:0)+ae+2*l,v=Math.min(2.4,rs/u),g=v>=1.9,f=v>=.9,x=i+2*l;return d`<svg class="front" viewBox="${p} ${-l} ${u} ${m}" width=${u*v} height=${m*v}
      role="img" aria-label="Front panel: ${yt(e)}">
    ${o?H`<rect class="ear" x=${p} y=${-l} width=${c+1} height=${m} rx="1.5"></rect>
          <rect class="ear" x=${i+l-1} y=${-l} width=${c+1} height=${m} rx="1.5"></rect>
          <circle class="hole" cx=${p+c/2} cy=${m/2-l} r="1.3"></circle>
          <circle class="hole" cx=${i+l+c/2} cy=${m/2-l} r="1.3"></circle>`:h}
    <rect class="face" x=${-l} y=${-l} width=${x} height=${m} rx="2.5"></rect>
    ${t.map(_=>{let $=r.get(_.key),w=$?$.up===!1?"down":"on":"",y=_.flip;return H`<g class="p ${_.cage?"cage":"rj"} ${w} ${$?.poe?"poe":""}"
          transform="translate(${_.x} ${_.y})">
        <rect class="body" width=${_.w} height=${ae} rx="1.2"></rect>
        ${_.cage?H`<rect class="slot" x="2" y=${ae/2-1.2} width=${_.w-4} height="2.4" rx="0.6"></rect>`:H`<rect class="latch" x="1" y=${y?ae-1.8:.4} width="3.4" height="1.4" rx="0.4"></rect>`}
        ${f&&(_.poeOut||$?.poe)?H`<path class="bolt" d=${ns} transform="translate(${_.w-4.4} ${y?ae-5.6:.6})"></path>`:h}
        ${g?H`<text class="num" x="1.1" y=${y?4.4:ae-1.1}>${_.label}</text>`:h}
      </g>`})}
  </svg>`}var ai=S`
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
`;var os=.4,ci=.7,as=250,N=184,K=62,cs=48,te="__auto__",ls="mdi:map-marker-radius-outline",li={fiber:"Fiber (SFP)",copper:"Ethernet",wireless:"Wireless",logical:"Logical interface",uplink:"Link between layouts",unknown:"No ports detected"},ds=["copper","fiber","wireless","unknown"];function bt(a){return/^q?sfp/i.test(a)?"fiber":/^(ether|combo)/i.test(a)?"copper":/^(wifi|wlan|wl\d)/i.test(a)?"wireless":"logical"}function xt(a,s,e=3){return a.x0<s.x1+e&&s.x0<a.x1+e&&a.y0<s.y1+e&&s.y0<a.y1+e}function ps(a,s,e,t,i){let n=Math.hypot(e,t)||1,r=e/n,o=t/n,l=Math.min(r?N/2/Math.abs(r):1/0,o?K/2/Math.abs(o):1/0);return{x:a+r*(l+i),y:s+o*(l+i),ux:r,uy:o}}var qe=class extends T{constructor(){super();this._pointers=new Map;this._touch=!1;this._ruleDevices=new j(()=>this.requestUpdate());this._userMoved=!1;this._fittedFor="";this._fitK=1;this._onLocation=()=>{let e=Ae().alert;e&&(this._alert=e)};this._onKey=e=>{e.key==="Escape"&&(this._clearHover(),this._pinned=void 0)};this._clearHover=()=>{this._hover=void 0,this._hoverLink=void 0};this._beforeUnload=e=>{(this._saving||this._edit?.changes().length)&&(e.preventDefault(),e.returnValue="")};this._path=[],this._view={x:0,y:0,k:1},this._alert="",this._find="",this._copied=!1,this._saving=!1,this._snap=!0,this._editMessage=""}static{this.properties={_path:{state:!0},_hover:{state:!0},_hoverLink:{state:!0},_view:{state:!0},_autoHeight:{state:!0},_alert:{state:!0},_rebuild:{state:!0},_reboot:{state:!0},_pinned:{state:!0},_find:{state:!0},_copied:{state:!0},_edit:{state:!0},_saving:{state:!0},_editMessage:{state:!0},_snap:{state:!0}}}_nodeMatches(e,t){return e.name.toLowerCase().includes(t)||!!e.device&&Re(e.device,t)}setConfig(e){this._edit=void 0,this._memo=void 0,this._config={height:440,show_ports:!0,show_comments:!0,...e},this._path=e.layout?[e.layout]:[],this._userMoved=!1}static getConfigForm(){return{schema:[O,{name:"title",selector:{text:{}}},{name:"layout",selector:{text:{}}},{name:"height",selector:{number:{min:200,max:1400,step:20,mode:"box",unit_of_measurement:"px"}}},{name:"max_height",selector:{number:{min:200,max:3e3,step:20,mode:"box",unit_of_measurement:"px"}}},{name:"show_ports",selector:{boolean:{}}},{name:"show_comments",selector:{boolean:{}}},Fe],computeLabel:D({entry_id:"Controller",title:"Title",layout:"Start at layout (empty: the top layout)",height:"Height",show_ports:"Show port names on cables",show_comments:"Show link comments",link_style:"Link style"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6,min_rows:4}}getCardSize(){return Math.round((this._config?.height??440)/50)+1}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey),window.addEventListener("location-changed",this._onLocation),window.addEventListener("beforeunload",this._beforeUnload),this._onLocation()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey),window.removeEventListener("location-changed",this._onLocation),window.removeEventListener("beforeunload",this._beforeUnload),window.clearTimeout(this._openTimer),this._resize?.disconnect(),this._resize=void 0}_memoFor(e){let t=this._path.join("/");return(this._memo?.entry!==e||this._memo.path!==t)&&(this._memo={entry:e,path:t,byKey:new Map(e.devices.map(i=>[i.key,i])),devicesIn:new Map,cables:new Map}),this._memo}_rootLayouts(e){let t=new Set(e.nodes.map(r=>r.target_layout).filter(Boolean)),i=new Set(e.nodes.map(r=>r.layout)),n=e.layouts.map(r=>r.name).filter(r=>!t.has(r)&&i.has(r));return n.length?n:e.layouts.map(r=>r.name).filter(r=>i.has(r))}_currentLayout(e){return this._edit?.entryId===e.entry_id?this._edit.layout:this._path.length?this._path[this._path.length-1]:this._rootLayouts(e)[0]??te}_devicesIn(e,t){let i=this._memoFor(e),n=i.devicesIn.get(t);if(n)return n;i.children??=si(e.layouts.map(l=>l.name),e.nodes,this._rootLayouts(e));let r=new Map;for(let l of e.nodes){if(l.layout!==t)continue;let c=l.device_key?i.byKey.get(l.device_key):void 0;c&&r.set(c.key,c)}for(let l of i.children.get(t)??[])this._devicesIn(e,l).forEach(c=>r.set(c.key,c));let o=[...r.values()];return i.devicesIn.set(t,o),o}_scene(e){let t=this._memoFor(e);return t.scene||(t.scene=this._buildScene(e,t.byKey)),t.scene}_buildScene(e,t){let i=this._currentLayout(e),n,r;if(i===te)({nodes:n,links:r}=this._autoLayout(e));else{let g=this._edit?[...this._edit.originals.values()]:e.nodes.filter(w=>w.layout===i),f=g.filter(w=>w.x!=null&&w.y!=null),x=f.length?Math.max(...f.map(w=>w.y)):0,_=f.length?Math.min(...f.map(w=>w.x)):0,$=0;n=g.map(w=>{let y=w.x==null||w.y==null,k=this._edit?.positions.get(w.id),C=k?.x??(y?_+$*(N+40):w.x),P=k?.y??(y?x+K*2.4:w.y);if(y&&($+=1),w.target_layout){let E=this._devicesIn(e,w.target_layout),ie=E.filter(Ge=>Ge.connected).length,Je=E.map(M),vi=Je.includes("offline")?"offline":Je.includes("alert")?"alert":Je.includes("update")?"update":"ok",fi=e.layouts.find(Ge=>Ge.name===w.target_layout)?.comment??null;return{id:w.name,restId:w.id,name:w.name,x:C,y:P,kind:"site",target:w.target_layout,site:{online:ie,total:E.length,status:vi,comment:fi}}}let b=w.device_key?t.get(w.device_key):void 0;return{id:w.name,restId:w.id,name:b?.identity??w.name,x:C,y:P,kind:b?"device":"unknown",device:b}}),r=e.links.filter(w=>w.layout===i)}let o=n.map(g=>g.x),l=n.map(g=>g.y),c=cs+(this._config.link_style==="elbow"?96:0),p=this._edit?.origin.x??Math.min(...o,0)-N/2-c,u=this._edit?.origin.y??Math.min(...l,0)-K/2-c;for(let g of n)g.x-=p,g.y-=u;let m=Math.max(...n.map(g=>g.x),0)+N/2+c,v=Math.max(...n.map(g=>g.y),0)+K/2+c;return{layout:i,nodes:n,links:r,width:m,height:v,origin:{x:p,y:u}}}_autoLayout(e){let t=p=>p.controller?0:1,i=new Map;for(let p of e.devices){let u=t(p);i.set(u,[...i.get(u)??[],p])}let n=Math.max(4,Math.ceil(Math.sqrt(e.devices.length*2.2))),r=[],o=0;for(let p of[...i.keys()].sort()){let u=i.get(p).sort((m,v)=>m.identity.localeCompare(v.identity));for(let m=0;m<u.length;m+=n,o+=1){let v=u.slice(m,m+n),g=(Math.min(n,e.devices.length)-v.length)*(N+48)/2;v.forEach((f,x)=>r.push({id:f.key,name:f.identity,kind:"device",device:f,x:g+x*(N+48),y:o*(K+90)}))}}let l=e.devices.find(p=>p.controller),c=l?e.devices.filter(p=>!p.controller).map(p=>({id:p.key,layout:te,node1:l.key,node2:p.key,comment:null,ports:[]})):[];return{nodes:r,links:c}}willUpdate(e){super.willUpdate(e),this._edit&&this._entry&&this._edit.entryId!==this._entry.entry_id&&(this._edit=void 0,this._nodeDrag=void 0,this._memo=void 0),e.has("_entry")&&this._ruleDevices.invalidate()}updated(){let e=this.renderRoot.querySelector(".viewport");e&&!this._resize&&(this._resize=new ResizeObserver(()=>{this._sizeToLayout(),this._userMoved||this._fit()}),this._resize.observe(e)),this._sizeToLayout();let t=`${this._entry?.entry_id}|${this._path.join("/")}|${this._entry?this._scene(this._entry).nodes.length:0}`;this._entry&&!this._edit&&t!==this._fittedFor&&(this._fittedFor=t,this._userMoved=!1,this._fit())}_sizeToLayout(){if(this._edit)return;let e=this.renderRoot.querySelector(".viewport");if(!e||!this._entry)return;let{width:t,height:i}=this._scene(this._entry),n=e.clientWidth;if(!n||!t)return;let r=n<600,o=r?240:this._config?.height??440,l=r?Math.max(o,Math.round(window.innerHeight*.6)):Math.max(o,this._config?.max_height??Math.round(window.innerHeight*.85)),c=Math.round(Math.min(l,Math.max(o,n*i/t)));(this._autoHeight===void 0||Math.abs(c-this._autoHeight)>4)&&(this._autoHeight=c)}_fit(){let e=this.renderRoot.querySelector(".viewport");if(!e||!this._entry)return;let{width:t,height:i}=this._scene(this._entry),n=e.clientWidth,r=e.clientHeight;if(!n||!r)return;let o=Math.min(n/t,r/i,1.2),l=n<600?Math.max(o,Math.min(r/i,ci)):o;this._fitK=l;let c={k:l,x:t*l>n?0:(n-t*l)/2,y:(r-i*l)/2};(Math.abs(c.k-this._view.k)>.001||Math.abs(c.x-this._view.x)>.5||Math.abs(c.y-this._view.y)>.5)&&(this._view=c)}_onWheel(e){if(!e.ctrlKey&&!e.metaKey||(e.preventDefault(),this._nodeDrag))return;let t=e.currentTarget.getBoundingClientRect();this._zoomAt(e.clientX-t.left,e.clientY-t.top,Math.exp(-e.deltaY*.0018))}_zoomAt(e,t,i){let{x:n,y:r,k:o}=this._view,l=Math.min(4,Math.max(this._minK(),o*i));this._view={k:l,x:e-(e-n)*l/o,y:t-(t-r)*l/o},this._userMoved=!0,this._clearHover(),this._pinned=void 0}_minK(){return Math.min(.25,this._fitK*.8)}_zoomTo(e){let t=this.renderRoot.querySelector(".viewport");if(!t||!e.length)return;let i=40,n=Math.min(...e.map(m=>m.x))-N/2-i,r=Math.max(...e.map(m=>m.x))+N/2+i,o=Math.min(...e.map(m=>m.y))-K/2-i,l=Math.max(...e.map(m=>m.y))+K/2+i,c=t.clientWidth,p=t.clientHeight,u=Math.max(this._minK(),Math.min(c/(r-n),p/(l-o),1.2));this._view={k:u,x:c/2-(n+r)/2*u,y:p/2-(o+l)/2*u},this._userMoved=!0,this._clearHover(),this._pinned=void 0}_local(e){let t=e.currentTarget.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}_onPointerDown(e){if(e.pointerType==="mouse"&&e.button!==0||(this._touch=e.pointerType==="touch",e.target.closest(".tooltip.pinned, .controls, .find")))return;if(this._clearHover(),this._pointers.set(e.pointerId,this._local(e)),this._pointers.size===2){this._nodeDrag=void 0;let[n,r]=[...this._pointers.values()],{x:o,y:l,k:c}=this._view,p={x:(n.x+r.x)/2,y:(n.y+r.y)/2};this._pinch={dist:Math.hypot(n.x-r.x,n.y-r.y)||1,k:c,wx:(p.x-o)/c,wy:(p.y-l)/c},this._drag&&(this._drag.moved=!0),e.currentTarget.setPointerCapture(e.pointerId);return}let t=e.target.closest("[data-node-id]"),i=t?.dataset.nodeId;if(this._edit&&i){if(this._saving||!this._canEdit(this._entry,this._scene(this._entry)))return;let n=this._edit.positions.get(i);if(!n)return;this._nodeDrag={pointer:e.pointerId,id:i,x:e.clientX,y:e.clientY,start:n,moved:!1},t?.focus({preventScroll:!0}),e.currentTarget.setPointerCapture(e.pointerId);return}this._drag={id:e.pointerId,x:e.clientX,y:e.clientY,vx:this._view.x,vy:this._view.y,moved:!1}}_onPointerMove(e){e.pointerType==="mouse"&&(this._touch=!1),this._pointers.has(e.pointerId)&&this._pointers.set(e.pointerId,this._local(e));let t=this._pinch;if(t&&this._pointers.size>=2){let[l,c]=[...this._pointers.values()],p=Math.min(4,Math.max(this._minK(),t.k*Math.hypot(l.x-c.x,l.y-c.y)/t.dist)),u={x:(l.x+c.x)/2,y:(l.y+c.y)/2};this._view={k:p,x:u.x-t.wx*p,y:u.y-t.wy*p},this._userMoved=!0,this._pinned=void 0;return}let i=this._nodeDrag;if(i&&this._edit&&i.pointer===e.pointerId&&!this._saving){let l=e.clientX-i.x,c=e.clientY-i.y;if(!i.moved&&Math.hypot(l,c)<4)return;i.moved=!0,this._edit.move(i.id,i.start.x+l/this._view.k,i.start.y+c/this._view.k,this._snap?20:1),this._draftChanged();return}let n=this._drag;if(!n||n.id!==e.pointerId)return;let r=e.clientX-n.x,o=e.clientY-n.y;!n.moved&&Math.hypot(r,o)<4||(n.moved||e.currentTarget.setPointerCapture(e.pointerId),n.moved=!0,this._userMoved=!0,this._hover=void 0,this._pinned=void 0,this._view={...this._view,x:n.vx+r,y:n.vy+o})}_onPointerUp(e){if(this._pointers.delete(e.pointerId),this._nodeDrag?.pointer===e.pointerId){e.type==="pointercancel"&&this._nodeDrag.moved&&this._edit&&(this._edit.move(this._nodeDrag.id,this._nodeDrag.start.x,this._nodeDrag.start.y),this._draftChanged()),this._nodeDrag=void 0;return}if(this._pinch){if(this._pointers.size<2){this._pinch=void 0;let[t]=[...this._pointers.entries()],i=e.currentTarget.getBoundingClientRect();this._drag=t?{id:t[0],x:t[1].x+i.left,y:t[1].y+i.top,vx:this._view.x,vy:this._view.y,moved:!0}:void 0}return}this._drag?.moved&&e.type==="pointerup"?e.currentTarget?.addEventListener("click",t=>t.stopPropagation(),{capture:!0,once:!0}):!this._drag?.moved&&e.type==="pointerup"&&!e.target.closest(".node, .tooltip.pinned, .controls, .find")&&(this._pinned=void 0),this._drag=void 0}_zoom(e){let t=this.renderRoot.querySelector(".viewport");t&&this._zoomAt(t.clientWidth/2,t.clientHeight/2,e)}_onDoubleClick(e){if(this._edit&&e.target.closest(".node")||(window.clearTimeout(this._openTimer),e.target.closest(".controls, .tooltip.pinned, .find")))return;let t=e.currentTarget.getBoundingClientRect();this._zoomAt(e.clientX-t.left,e.clientY-t.top,2)}_resetView(){this._userMoved=!1,this._fit()}_click(e,t){t.stopPropagation(),!this._edit&&(window.clearTimeout(this._openTimer),this._openTimer=window.setTimeout(()=>this._open(e),as))}_open(e){this._edit||(e.kind==="site"&&e.target?(this._path=[...this._path.length?this._path:[this._currentLayout(this._entry)],e.target],this._hover=void 0,this._pinned=void 0):e.device&&(this._pinned={node:e,...this._placeBeside(e,56)},this._hover=void 0,this._copied=!1))}_goTo(e){this._leaveEdit()&&(this._path=this._path.slice(0,e+1),this._hover=void 0)}_selectRoot(e){this._leaveEdit()&&(this._path=[e],this._hover=void 0)}_onNodeKey(e,t){if(this._edit&&t.restId){let n={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(n){if(e.preventDefault(),e.stopPropagation(),this._saving||!this._canEdit(this._entry,this._scene(this._entry)))return;let r=this._edit.positions.get(t.restId),o=(this._snap?20:1)*(e.shiftKey?5:1);this._edit.move(t.restId,r.x+n[0]*o,r.y+n[1]*o,this._snap?20:1),this._draftChanged()}return}(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._open(t))}_showHover(e,t){this._edit||this._drag?.moved||this._touch||this._pinned||this.renderRoot.querySelector(".viewport")&&(this._hover={node:e,...this._placeBeside(e)},t.stopPropagation())}_placeBeside(e,t=0){let i=this.renderRoot.querySelector(".viewport"),{x:n,y:r,k:o}=this._view,l=300,c=e.device?.product,p=e.device?Math.min(9,_t(this._entry,e.device,this._memoFor(this._entry).byKey).length):0,u=(c?.image_large?340:230)+(c?.ports?70:0)+p*18+t,m=(e.x+N/2)*o+n+12,v=(e.x-N/2)*o+n-12-l,g=m+l<=i.clientWidth-8,f=e.y*o+r-u/2;return{x:Math.max(8,g||v<8?Math.min(m,i.clientWidth-l-8):v),y:Math.max(8,Math.min(f,i.clientHeight-u-8))}}render(){let e=this._entry,t=this._config?.height??440;if(!e)return this.renderWaiting(`height:${t}px`);let i=this._scene(e);this._prepareRoutes(i);let n=this._rootLayouts(e),r=this._path.length?this._path:[i.layout],o=new Map(i.nodes.map(y=>[y.id,y])),l=i.links.map(y=>this._linkInfo(y,o)).filter(y=>y!==void 0),c=ds.filter(y=>l.some(k=>k.kind===y)),{x:p,y:u,k:m}=this._view,v=e.layouts.find(y=>y.name===i.layout),g=this._alert?e.alerts.find(y=>y.id===this._alert):void 0,f=g?g.devices_on>0?this._ruleDevices.get(this.hass,e.entry_id,g.id):[]:void 0;this._lit=Array.isArray(f)?new Set(f):void 0;let x=this._find.trim().toLowerCase(),_=x?i.nodes.filter(y=>this._nodeMatches(y,x)):[];this._found=x?new Set(_.map(y=>y.id)):void 0;let $=i.nodes.filter(y=>y.device?M(y.device)!=="ok":y.site?y.site.status!=="ok":!1),w=this._edit?"lod-full editing":m<os?"lod-dot":m<ci?"lod-text":"lod-full";return d`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:sitemap-outline"></ha-icon>
          <div class="crumbs">
            ${this._config.title?d`<span class="title">${this._config.title}</span>`:h}
            ${r.map((y,k)=>d`
                ${k?d`<ha-icon class="sep" icon="mdi:chevron-right"></ha-icon>`:h}
                <button class="crumb ${k===r.length-1?"current":""}" @click=${()=>this._goTo(k)}>
                  ${y===te?"All devices":y}
                </button>
              `)}
          </div>
          <div class="spacer"></div>
          ${!this._edit&&this._canEdit(e,i)?d`<button class="tool edit-tool" @click=${this._startEdit}><ha-icon icon="mdi:pencil-outline"></ha-icon> Edit layout</button>`:h}
          ${!this._edit&&this._canRebuild(e,i)?d`<button class="tool" title="Rebuild links from detected ports" aria-label="Rebuild links"
                @click=${()=>this._rebuild={layout:i.layout,state:"confirm"}}>
                <ha-icon icon="mdi:cable-data"></ha-icon></button>`:h}
          ${n.length>1?d`<div class="roots">
                ${n.map(y=>d`<button class="pill ${r[0]===y?"on":""}" @click=${()=>this._selectRoot(y)}>${y}</button>`)}
              </div>`:h}
        </div>
        ${v?.comment?d`<div class="subtitle">${v.comment}</div>`:h}
        ${this._edit?this._renderEdit(e,i):this._editMessage?d`<div class="subtitle" role="status">${this._editMessage}</div>`:h}
        ${g?d`<div class="hl">
              <ha-icon icon="mdi:bell-alert-outline"></ha-icon>
              <span>${Array.isArray(f)?`${f.length} device${f.length===1?"":"s"} where "${g.name}" is active`:f==="loading"?`Finding the devices where "${g.name}" is active\u2026`:`The devices where "${g.name}" is active can't be listed (console access)`}</span>
              <span class="spacer"></span>
              <button class="hl-close" title="Show every device" @click=${()=>this._alert=""}><ha-icon icon="mdi:close"></ha-icon></button>
            </div>`:h}
        ${this._rebuild?.layout===i.layout?this._renderRebuild(this._rebuild):h}
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
            class="world ${w}"
            style="width:${i.width}px;height:${i.height}px;transform:translate(${p}px,${u}px) scale(${m});--inv:${1/m}"
          >
            <svg class="wires" width=${i.width} height=${i.height}>
              ${l.map(y=>this._renderLink(y))}
            </svg>
            ${this._config.show_ports?this._config.link_style==="elbow"?this._renderElbowPorts(l):l.map(y=>this._renderPorts(y)):h}
            ${this._config.show_comments?l.map(y=>this._renderComment(y)):h}
            ${i.nodes.map(y=>this._renderNode(y))}
          </div>
          ${i.nodes.length?h:d`<div class="nothing">${i.layout===te?"No devices on the controller yet.":"This layout has no nodes yet."}</div>`}
          ${this._pinned?this._renderTooltip(this._pinned,!0):h}
          ${this._hover&&!this._pinned?this._renderTooltip(this._hover):h}
          ${this._hoverLink&&!this._hover&&!this._pinned?this._renderLinkTooltip(this._hoverLink):h}
          ${i.nodes.length>1?d`<div class="find">
                <ha-icon icon="mdi:magnify"></ha-icon>
                <input type="search" placeholder="Find on map" aria-label="Find on map" .value=${this._find}
                  @input=${y=>this._find=y.target.value}
                  @keydown=${y=>{y.key==="Enter"&&this._zoomTo(_),y.key==="Escape"&&(this._find="")}} />
                ${x?d`<span class="hits">${_.length}</span>`:h}
              </div>`:h}
          <div class="controls">
            <button title="Zoom in (or double-click the map)" @click=${()=>this._zoom(1.6)}><ha-icon icon="mdi:plus"></ha-icon></button>
            <button title="Zoom out" @click=${()=>this._zoom(1/1.6)}><ha-icon icon="mdi:minus"></ha-icon></button>
            <button title="Show the whole map" @click=${this._resetView}><ha-icon icon="mdi:fit-to-screen-outline"></ha-icon></button>
            ${$.length?d`<button class="problems" title="Zoom to what needs attention (${$.length})" @click=${()=>this._zoomTo($)}>
                  <ha-icon icon="mdi:alert-circle-outline"></ha-icon></button>`:h}
          </div>
          <div class="legend">
            ${["ok","update","alert","offline"].map(y=>d`<span class="status-${y}"><i class="dot"></i>${L[y]}</span>`)}
            ${c.map(y=>d`<span><i class="wire-sample k-${y}"></i>${li[y]}</span>`)}
            ${l.some(y=>y.poe)?d`<span><i class="poe-sample"></i>PoE power</span>`:h}
          </div>
        </div>
      </ha-card>
    `}_prepareRoutes(e){if(this._config.link_style!=="elbow")return;let t=JSON.stringify([e.nodes.map(n=>[n.id,n.x,n.y]),e.links.map(n=>[n.id,n.node1,n.node2])]);if(this._routes?.key===t)return;let i=new je(e.nodes,N,K);this._routes={key:t,paths:i.routeAll(e.links)}}_route(e){return(this._config.link_style==="elbow"?this._routes?.paths.get(e.link.id):void 0)??[e.a,e.b]}_canEdit(e,t){return e.available&&e.actions&&!!this.hass.user?.is_admin&&t.layout!==te&&t.nodes.length>0&&e.nodes.filter(i=>i.layout===t.layout).every(i=>!!i.revision)}_startEdit(){let e=this._entry,t=this._scene(e);this._canEdit(e,t)&&(window.clearTimeout(this._openTimer),this._clearHover(),this._pinned=void 0,this._rebuild=void 0,this._edit=new Ke(e.entry_id,t.layout,t.origin,e.nodes,t.nodes),this._userMoved=!0,this._editMessage="",this._draftChanged())}_draftChanged(){this._memo=void 0,this.requestUpdate()}_cancelEdit(){this._saving||(this._edit=void 0,this._nodeDrag=void 0,this._editMessage="",this._draftChanged(),this.updateComplete.then(()=>this._fit()))}_leaveEdit(){return this._saving?!1:this._edit?.changes().length?(this._editMessage="Save or cancel your changes before opening another layout.",!1):(this._edit=void 0,this._memo=void 0,!0)}async _saveEdit(){let e=this._edit;if(!e||this._saving||!this._canEdit(this._entry,this._scene(this._entry)))return;let t=e.changes();if(t.length){if(t.length>500){this._editMessage="Save at most 500 changed nodes at a time.";return}this._saving=!0,this._editMessage="",this._nodeDrag=void 0;try{let i=await this.hass.connection.sendMessagePromise({type:"cmr/move_nodes",entry_id:e.entryId,layout:e.layout,nodes:t});if(this._edit!==e)return;if(e.acknowledge(i.saved),i.failed.length)this._editMessage=`${i.saved.length} saved; ${i.failed.length} failed. `+i.failed.map(n=>`${e.originals.get(n.id)?.name??n.id}: ${n.message}`).join("; ");else{this._edit=void 0,this._memo=void 0;let n=this._scene(this._entry).origin;this._view={...this._view,x:this._view.x+(n.x-e.origin.x)*this._view.k,y:this._view.y+(n.y-e.origin.y)*this._view.k},this._editMessage=`Saved ${i.saved.length} node position${i.saved.length===1?"":"s"} to CMR.`}this._draftChanged()}catch(i){this._edit===e&&(this._editMessage=i?.message??String(i))}finally{this._saving=!1}}}_renderEdit(e,t){let i=this._edit.changes().length;return d`<div class="edit-bar">
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
      ${this._canEdit(e,t)?h:d`<div role="status">Saving is unavailable. Check the connection and your action permissions.</div>`}
      ${this._editMessage?d`<div class="edit-message" role="status">${this._editMessage}</div>`:h}
    </div>`}_canRebuild(e,t){return e.actions&&!!this.hass.user?.is_admin&&t.layout!==te&&t.nodes.filter(i=>i.kind==="device").length>1}_renderRebuild(e){let t=d`<button class="hl-close" title="Close" @click=${()=>this._rebuild=void 0}>
      <ha-icon icon="mdi:close"></ha-icon></button>`;return e.state==="confirm"?d`<div class="hl rebuild">
        <ha-icon icon="mdi:cable-data"></ha-icon>
        <span>Create the links of <b>${e.layout}</b> from the ports the controller detected between its devices?</span>
        <span class="spacer"></span>
        <button class="pill on" @click=${()=>this._rebuildLinks(e.layout)}>Rebuild links</button>
        ${t}
      </div>`:d`<div class="hl rebuild ${e.state}">
      <ha-icon icon=${e.state==="error"?"mdi:alert-circle-outline":"mdi:cable-data"}></ha-icon>
      <span>${e.state==="busy"?`Rebuilding the links of ${e.layout}\u2026`:e.text}</span>
      <span class="spacer"></span>
      ${e.state==="busy"?h:t}
    </div>`}async _rebuildLinks(e){this._rebuild={layout:e,state:"busy"};try{await this.hass.connection.sendMessagePromise({type:"cmr/rebuild_links",entry_id:this._entry.entry_id,layout:e}),this._rebuild={layout:e,state:"done",text:"Links rebuilt. Connections the controller can't see (a VPN, a switch it doesn't manage) stay yours to draw."}}catch(t){this._rebuild={layout:e,state:"error",text:t?.message??String(t)}}}_linkState(e,t){let i=o=>o?.kind==="device"?o.device.connected:o?.kind==="site"?o.site.online>0:void 0,n=i(e),r=i(t);return n===!1||r===!1?"down":n===void 0||r===void 0?"unknown":"up"}_linkInfo(e,t){let i=t.get(e.node1),n=t.get(e.node2);if(!i||!n)return;let r=e.ports,o=[i.name,n.name],l=!1,c;!r.length&&i.kind==="site"&&n.kind==="site"&&(l=!0,c=this._cableBetween(i.target,n.target),c&&(r=c.ports,o=c.names));let p=r[0],u;if(p){let v=[bt(p.a.interface),bt(p.b.interface)];u=v.includes("fiber")?"fiber":v.includes("wireless")?"wireless":v.every(g=>g==="copper")?"copper":"logical"}else u=l&&!c?"uplink":"unknown";let m;return p?.a.poe==="powered-on"?m={from:i,to:n,port:p.a.interface}:p?.b.poe==="powered-on"&&(m={from:n,to:i,port:p.b.interface}),{link:e,a:i,b:n,state:this._linkState(i,n),kind:u,ports:r,endNames:o,poe:m}}_cableBetween(e,t){let i=this._entry,n=this._memoFor(i),r=`${e}\0${t}`;if(n.cables.has(r))return n.cables.get(r);let o=new Set(this._devicesIn(i,e).map(m=>m.key)),l=new Set(this._devicesIn(i,t).map(m=>m.key)),c=new Map(i.nodes.map(m=>[`${m.layout}\0${m.name}`,m.device_key])),p=n.byKey,u;for(let m of i.links){let v=c.get(`${m.layout}\0${m.node1}`),g=c.get(`${m.layout}\0${m.node2}`);if(!v||!g)continue;let f=o.has(v)&&l.has(g);if(!f&&!(o.has(g)&&l.has(v)))continue;let[x,_]=f?[v,g]:[g,v],$=f?m.ports:m.ports.map(y=>({a:y.b,b:y.a})),w={ports:$,names:[p.get(x)?.identity??x,p.get(_)?.identity??_]};(!u||$.length&&!u.ports.length)&&(u=w)}return n.cables.set(r,u),u}_renderLink(e){let{a:t,state:i,kind:n,poe:r}=e,o=this._route(e),l=this._config.link_style==="elbow"?10:0,c=vt(o,l),p=i==="up"&&n!=="unknown"&&n!=="logical";return H`
      <g class="link ${i} k-${n}"
         @mouseenter=${u=>this._showLinkHover(e,u)}
         @mouseleave=${()=>this._hoverLink=void 0}>
        <path class="hit" d=${c}></path>
        <path class="wire" d=${c}></path>
        ${n==="fiber"?H`<path class="core" d=${c}></path>`:h}
        ${p?H`<path class="flow" d=${c}></path>`:h}
        ${r&&i==="up"?H`<circle class="power" r="3.6">
              <animateMotion dur="2.2s" repeatCount="indefinite"
                path=${vt(r.from===t?o:[...o].reverse(),l)}></animateMotion>
            </circle>`:h}
      </g>
    `}_renderElbowPorts(e){let t=new Map;for(let n of e){let r=n.ports[0],o=this._route(n);if(!r||o.length<2)continue;let l=[{from:n.a,to:n.b,port:r.a,poe:n.poe?.from===n.a,route:o},{from:n.b,to:n.a,port:r.b,poe:n.poe?.from===n.b,route:[...o].reverse()}];for(let c of l){let[p,u]=c.route,m=JSON.stringify([c.from.id,p.x,p.y,Math.sign(u.x-p.x),Math.sign(u.y-p.y)]);t.has(m)||t.set(m,[]),t.get(m).push(c)}}let i=[];for(let n of t.values()){let{from:r,to:o,port:l,route:c}=n[0],p=[...new Set(n.map(f=>f.port.interface))].sort((f,x)=>f.localeCompare(x,void 0,{numeric:!0})),u=p.slice(0,3).join(", ")+(p.length>3?` +${p.length-3}`:""),m=n.map(f=>`${f.port.interface} \u2192 ${f.to.name}${f.poe?" (PoE out)":""}`).join("; "),v=f=>this._chip(r,o,{...l,interface:u},n.some(x=>x.poe),f,c,m),g=v();if(i.some(f=>xt(f.box,g.box))){for(let f of[-1,1])if(g=v(f),!i.some(x=>xt(x.box,g.box)))break}i.push(g)}return d`${i.map(n=>n.html)}`}_renderPorts(e){let t=e.ports[0];if(!t)return h;let{a:i,b:n}=e,r=this._config.link_style==="elbow"?this._route(e):void 0,o=r?[...r].reverse():void 0,l=[this._chip(i,n,t.a,e.poe?.from===i,void 0,r),this._chip(n,i,t.b,e.poe?.from===n,void 0,o)];return xt(l[0].box,l[1].box)&&(l=[this._chip(i,n,t.a,e.poe?.from===i,-1,r),this._chip(n,i,t.b,e.poe?.from===n,1,o)]),d`${l.map(c=>c.html)}`}_chip(e,t,i,n,r,o,l){let c=ps(e.x,e.y,t.x-e.x,t.y-e.y,r?4:8);if(o&&o.length>1){let w=Math.sign(o[1].x-o[0].x),y=Math.sign(o[1].y-o[0].y);c={x:o[0].x+w*8,y:o[0].y+y*8,ux:w,uy:y}}let p=i.interface.length*6.6+12+(n?13:0),u=18,m=Math.abs(c.ux)>=Math.abs(c.uy),v=Math.abs(c.ux)<.35?-.5:c.ux>0?0:-1,g=Math.abs(c.uy)<.35?-.5:c.uy>0?0:-1,f=0,x=0;r&&(m?(g=r<0?-1:0,x=r*3):(v=r<0?-1:0,f=r*4));let _=c.x+v*p+f,$=c.y+g*u+x;return{box:{x0:_,y0:$,x1:_+p,y1:$+u},html:d`<div class="port m-${bt(i.interface)} ${n?"poe":""}"
        style="left:${c.x+f}px;top:${c.y+x}px;transform:translate(${v*100}%,${g*100}%)"
        title=${l??(n?`${i.interface}: PoE out, powers ${t.name}`:`${i.interface} (${e.name})`)}>
        ${n?d`<ha-icon icon="mdi:flash"></ha-icon>`:h}${i.interface}
      </div>`}}_renderComment(e){let{link:t}=e,i=ft(this._route(e),this._config.link_style==="elbow"?10:0);return!t.comment||e.ports.length&&this._config.show_ports?h:d`<div class="comment" style="left:${i.x}px;top:${i.y}px" title=${t.comment}>
      ${t.comment}
    </div>`}_showLinkHover(e,t){if(this._edit||this._drag?.moved)return;let i=this.renderRoot.querySelector(".viewport");if(!i)return;let n=i.getBoundingClientRect();this._hoverLink={info:e,x:t.clientX-n.left,y:t.clientY-n.top+14}}_renderLinkTooltip(e){let{info:t}=e,{a:i,b:n,link:r,poe:o,ports:l,endNames:c}=t,p=u=>u.tx||u.rx?d`<span class="mono">↑ ${u.tx??"\u2013"} · ↓ ${u.rx??"\u2013"}</span>`:"\u2013";return d`<div class="tooltip" style="left:${Math.max(8,e.x-150)}px;top:${e.y}px">
      <div class="tt-title">${i.name} ↔ ${n.name}</div>
      ${r.comment?d`<div class="muted">${r.comment}</div>`:h}
      <table>
        <tr><td>Medium</td><td>${li[t.kind]}</td></tr>
        ${l.map(u=>d`
            <tr><td>${c[0]}</td><td class="mono">${u.a.interface}</td></tr>
            <tr><td>${c[1]}</td><td class="mono">${u.b.interface}</td></tr>
          `)}
        ${o?d`<tr><td>Power</td><td><ha-icon class="inline poe" icon="mdi:flash"></ha-icon>
              ${o.from===i?c[0]:c[1]} <span class="mono">${o.port}</span>
              powers ${o.to===i?c[0]:c[1]}</td></tr>`:h}
        ${l[0]?d`<tr><td>Traffic</td><td>${c[0]}: ${p(l[0].a)}<br />${c[1]}: ${p(l[0].b)}</td></tr>`:h}
      </table>
    </div>`}_renderNode(e){let t=`left:${e.x-N/2}px;top:${e.y-K/2}px;width:${N}px;height:${K}px`;if(e.kind==="site"){let o=e.site;return d`
        <div class="node site status-${o.status} ${this._found&&!this._found.has(e.id)?"dim":""}" style=${t} data-node-id=${e.restId??""}
             role="button" tabindex="0" aria-label="${e.name}, ${o.online} of ${o.total} online, ${this._edit?"use arrow keys to move":"open layout"}"
             @click=${l=>this._click(e,l)} @keydown=${l=>this._onNodeKey(l,e)}
             @mouseenter=${l=>this._showHover(e,l)} @mouseleave=${this._clearHover}
             @focus=${l=>this._showHover(e,l)} @blur=${this._clearHover}>
          <i class="pin"></i>
          <div class="badge"><ha-icon icon=${this._config.icons?.[e.name]??ls}></ha-icon></div>
          <div class="text">
            <div class="name">${e.name}</div>
            <div class="sub"><i class="dot"></i>${o.online}/${o.total} online</div>
          </div>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        </div>
      `}if(e.kind==="unknown"||!e.device)return d`
        <div class="node unknown ${this._found&&!this._found.has(e.id)?"dim":""}" style=${t} title="Not a CMR-managed device"
             data-node-id=${e.restId??""} tabindex=${this._edit?0:-1} role="button" aria-label=${e.name}
             @keydown=${o=>this._onNodeKey(o,e)}>
          <i class="pin"></i>
          <div class="badge"><ha-icon icon="mdi:help-network-outline"></ha-icon></div>
          <div class="text"><div class="name">${e.name}</div><div class="sub">Not managed</div></div>
        </div>
      `;let i=e.device,n=M(i),r=this._lit&&!this._lit.has(i.key)||this._found&&!this._found.has(e.id);return d`
      <div class="node device status-${n} ${i.controller?"controller":""} ${r?"dim":""}" style=${t} data-node-id=${e.restId??""}
           role="button" tabindex="0" aria-label="${i.identity}, ${L[n]}"
           @click=${o=>this._click(e,o)} @keydown=${o=>this._onNodeKey(o,e)}
           @mouseenter=${o=>this._showHover(e,o)} @mouseleave=${this._clearHover}
           @focus=${o=>this._showHover(e,o)} @blur=${this._clearHover}>
        <i class="pin"></i>
        ${Q(i)}
        <div class="text">
          <div class="name">${i.identity}</div>
          <div class="sub">${q(i)}</div>
          <div class="ver mono" title=${i.update_available?`${i.version} \u2192 ${i.available_version}`:""}>
            ${i.update_available?d`<span class="up"><ha-icon icon="mdi:arrow-up-circle"></ha-icon>${i.available_version}</span>`:i.version??"\u2013"}
          </div>
        </div>
        ${i.controller?d`<span class="crown" title="CMR controller"><ha-icon icon="mdi:crown-outline"></ha-icon></span>`:h}
        ${i.alerts?.on?d`<span class="count" title="Active alerts">${i.alerts.on}</span>`:h}
      </div>
    `}_renderTooltip(e,t=!1){let{node:i}=e,n;if(i.kind==="site"){let o=i.site;n=d`
        <div class="tt-title">${i.name}</div>
        ${o.comment?d`<div class="muted">${o.comment}</div>`:h}
        <div>${o.online} of ${o.total} devices online</div>
        <div class="muted">Click to open this layout</div>
      `}else if(i.device){let o=i.device,l=this._entry,c=_t(l,o,this._memoFor(l).byKey);n=d`
        <div class="tt-title">${o.identity}${o.controller?d` <span class="chip">controller</span>`:h}</div>
        ${o.product?.image_large?d`<div class="tt-photo"><img src=${o.product.image_large} alt="" referrerpolicy="no-referrer" /></div>`:h}
        <div class="muted">${[q(o),fe(o),o.arch].filter(Boolean).join(" \xB7 ")}</div>
        ${o.product?.ports?d`${oi(o.product,c)}<div class="muted tt-ports">${yt(o.product.ports)}</div>`:h}
        <table>
          <tr><td>Status</td><td class="status-${M(o)}"><i class="dot"></i> ${L[M(o)]}${Z(o)?` (${Z(o)})`:""}${o.stale?" \xB7 stale data":""}</td></tr>
          ${o.connected&&o.connected_time!=null?d`<tr><td>Connected</td><td>for ${ge(o.connected_time)}</td></tr>`:h}
          <tr><td>Version</td><td class="mono">${o.version??"\u2013"}</td></tr>
          <tr><td>Channel</td><td>${o.channel??"\u2013"}${o.available_version&&o.available_version!==o.version?d` <span class="muted">(${o.update_available?"update to":"offers"} <span class="mono">${o.available_version}</span>)</span>`:h}</td></tr>
          ${o.address?d`<tr><td>Address</td><td><span class="mono">${o.address}</span>${t&&navigator.clipboard?d`<button class="copy" title="Copy the address" @click=${()=>this._copy(o.address)}>
                    ${this._copied?"copied":d`<ha-icon icon="mdi:content-copy"></ha-icon>`}</button>`:h}</td></tr>`:h}
          <tr><td>Uptime</td><td>${ge(o.uptime)}</td></tr>
          ${o.labels.length?d`<tr><td>Labels</td><td>${o.labels.map(p=>d`<span class="chip">${p}</span> `)}</td></tr>`:h}
          ${o.alerts?d`<tr><td>Alerts</td><td>${o.alerts.on} active of ${o.alerts.total} rules</td></tr>`:h}
          ${c.length?d`<tr><td>Links</td><td>
                ${c.slice(0,8).map(p=>d`<div>
                    <span class="mono">${p.interface}</span>${p.poe?d` <ha-icon class="inline poe" icon="mdi:flash"></ha-icon>`:h}
                    → ${p.peer}${p.up===!1?d` <span class="muted">(down)</span>`:h}
                  </div>`)}
                ${c.length>8?d`<div class="muted">and ${c.length-8} more</div>`:h}
              </td></tr>`:h}
        </table>
        ${t?this._popoverActions(o):h}
      `}else return d``;let r=t?`;max-height:calc(100% - ${e.y+8}px)`:"";return d`<div class="tooltip ${t?"pinned":""}" style="left:${Math.max(8,e.x)}px;top:${e.y}px${r}"
        role=${t?"dialog":h} aria-label=${t?i.name:h}>
      ${t?d`<button class="pop-close" title="Close" @click=${()=>this._pinned=void 0}><ha-icon icon="mdi:close"></ha-icon></button>`:h}
      ${n}
    </div>`}_popoverActions(e){let t=this._config.views?.devices,i=e.entities,n=this._reboot?.key===e.key?this._reboot:void 0;return n?.state==="confirm"?d`<div class="pop-confirm">
        <span>Reboot <b>${e.identity}</b>? It is back in about a minute; its clients lose the connection meanwhile.</span>
        <div class="pop-actions">
          <button class="pill on" @click=${()=>this._rebootDevice(e.key,i.reboot)}><ha-icon icon="mdi:restart"></ha-icon>Reboot</button>
          <button class="pill" @click=${()=>this._reboot=void 0}>Cancel</button>
        </div>
      </div>`:d`${n?d`<div class="pop-note ${n.state}">${n.text}</div>`:h}
    <div class="pop-actions">
      ${e.update_available&&i.update?d`<button class="pill on" @click=${()=>R(this,i.update)}><ha-icon icon="mdi:arrow-up-circle"></ha-icon>Update</button>`:h}
      ${e.device_id?d`<button class="pill" @click=${()=>A(`/config/devices/device/${e.device_id}`)}>Device page</button>`:h}
      ${t?d`<button class="pill" @click=${()=>A(U(t,{cmr_search:e.identity}))}>In Devices</button>`:h}
      ${i.connected?d`<button class="pill" @click=${()=>R(this,i.connected)}>History</button>`:h}
      ${i.reboot&&e.connected&&!e.pending&&n?.state!=="busy"?d`<button class="pill" @click=${()=>this._reboot={key:e.key,state:"confirm"}}>
            <ha-icon icon="mdi:restart"></ha-icon>Reboot</button>`:h}
    </div>`}async _rebootDevice(e,t){this._reboot={key:e,state:"busy",text:"Asking the controller to reboot it\u2026"};try{await this.hass.callService("button","press",{entity_id:t}),this._reboot={key:e,state:"done",text:"Rebooting. It shows offline until it is back, in about a minute."}}catch(i){this._reboot={key:e,state:"error",text:i?.message??String(i)}}}async _copy(e){try{await navigator.clipboard.writeText(e),this._copied=!0}catch{this._copied=!1}}static{this.styles=[z,ai,S`
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
    `]}};var hs=12,us={done:"mdi:check-circle",failed:"mdi:close-circle",processing:"mdi:progress-upload","version check":"mdi:magnify","waiting devices":"mdi:timer-sand",queued:"mdi:tray-full","queued (busy)":"mdi:tray-full",scheduled:"mdi:calendar-clock",cancelled:"mdi:cancel"},$t=new Set(["processing","version check","waiting devices","queued","queued (busy)"]),di=new Set([...$t,"scheduled"]),ms=new Set(["processing","version check","waiting devices"]),gs=new Set(["long-term","stable","testing","development"]);function ye(a){return(a??"").split(",").map(s=>s.trim()).filter(Boolean)}function vs(a){let[s,e]=(a.success??"").split("/").map(Number);return a.state==="done"&&e&&s<e?"failed":a.state??"scheduled"}function fs(a){return(a??"").replace(/([a-z])(\d)/g,"$1 $2")}var Ve=class extends T{constructor(){super();this._jobDevices=new ke(()=>this.requestUpdate());this._open="",this._outcome={}}static{this.properties={_open:{state:!0},_confirm:{state:!0},_outcome:{state:!0}}}setConfig(e){this._config={jobs:5,...e}}static getConfigForm(){return{schema:[O,{name:"title",selector:{text:{}}},{name:"jobs",selector:{number:{min:0,max:30,mode:"box"}}}],computeLabel:D({entry_id:"Controller",title:"Title",jobs:"Recent jobs to show"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){return 6}render(){let e=this._entry;if(!e)return this.renderWaiting();let t=e.devices.filter(r=>r.update_available).length,i=e.upgrade_rules.filter(r=>r.dynamic!=="true"||e.devices.some(o=>o.upgrade_rule===r.name)),n=[...e.upgrade_jobs].sort((r,o)=>(o.schedule_time??"").localeCompare(r.schedule_time??"")).slice(0,this._config.jobs??5);return d`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:update"></ha-icon>
          <span>${this._config.title??"Upgrades"}</span>
          ${t?d`<span class="chip update">${t} available</span>`:d`<span class="chip">up to date</span>`}
        </div>
        ${this.renderStale(e)}

        ${i.length?i.map(r=>this._rule(e,r)):d`<div class="empty small">No upgrade rules. Devices are checked against their channel only.</div>`}

        ${n.length?d`<div class="section section-label">Recent jobs</div>
              <div class="jobs">${n.map(r=>this._job(e,r))}</div>`:h}
      </ha-card>
    `}_job(e,t){let i=vs(t),n=i==="failed"?"failed":$t.has(i)?"running":i==="scheduled"?"scheduled":i==="done"?"done":"other",r=i==="scheduled"&&t.starts_in?`starts in ${fs(t.starts_in)}`:`${t.schedule_time??""}${t.run_time?` \xB7 took ${t.run_time}`:""}`,o=!!t.id&&this._open===t.id,l=()=>{t.id&&(this._open=o?"":t.id,this._confirm=void 0)};return d`<div class="job js-${n} ${t.id?"opens":""} ${o?"open":""}" role="button" tabindex="0"
        aria-expanded=${o?"true":"false"} @click=${l}
        @keydown=${c=>(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),l())}>
        <ha-icon icon=${us[i]??"mdi:circle-outline"} title=${i}></ha-icon>
        <div class="what">
          <div>${ye(t.labels).length?d`<span class="mono">${t.channel??"?"}</span> → ${ye(t.labels).join(", ")}`:d`Install ${t.channel?d`<span class="mono">${t.channel}</span>`:"from each device's channel"}`}
            ${$t.has(i)?d`<span class="chip update">${i}</span>`:h}</div>
          <div class="muted small">${r}</div>
        </div>
        <div class="ok mono">${t.success||(i==="scheduled"?"":"\u2013")}</div>
        ${t.id?d`<ha-icon class="chev" icon=${o?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>`:h}
      </div>
      ${o?this._jobDetail(e,t,i):h}`}_jobDetail(e,t,i){let n=this._jobDevices.get(this.hass,e.entry_id,t),r=new Map(e.devices.map(m=>[m.key,m])),o;if(n==="loading")o=d`<div class="muted small">Loading the job's devices…</div>`;else if(n==="unsupported")o=d`<div class="muted small">This controller can't list a job's devices.</div>`;else if(n==="error")o=d`<div class="muted small">The job's devices couldn't be read.</div>`;else if(!n.length)o=d`<div class="muted small">${i==="scheduled"?"The controller lists the devices when the job starts.":"No devices."}</div>`;else{let m=!di.has(t.state??"scheduled"),v=!!t.channel&&!gs.has(t.channel);o=d`${n.map(g=>this._jobDevice(g,r.get(g.device_key??""),m))}
        ${n.some(g=>g.error==="no upgrade available")?d`<div class="muted small note">CMR counts <i>no upgrade available</i> as a failed upgrade: the
              device already ran the target version, or that version's packages weren't found.
              ${v?d`This job pins <span class="mono">${t.channel}</span>, and the controller installs a pinned
                    version only from packages it already has (its packages directory or cache). An upgrade through
                    the device's channel downloads them.`:h}</div>`:h}`}let l=t.state??"scheduled",c=[];e.actions&&this.hass.user?.is_admin&&(l==="scheduled"&&c.push("run_next"),di.has(l)&&c.push("cancel"));let p=this._outcome[t.id],u=this._confirm?.job===t.id?this._confirm.action:void 0;return d`<div class="job-detail">
      ${o}
      ${u?d`<div class="confirm">
            <span>${u==="run_next"?ye(t.labels).length?"Run this job now? It starts as a new job, and this one stays scheduled.":"Run this install now instead of at its scheduled time?":ms.has(l)?"Stop this job? Devices not upgraded yet are marked cancelled; an install already under way can still finish when its device reboots.":"Cancel this job?"}</span>
            <button class="pill on" @click=${()=>this._act(e,t.id,u)}>
              ${u==="run_next"?"Run now":"Cancel job"}</button>
            <button class="pill" @click=${()=>this._confirm=void 0}>Back</button>
          </div>`:c.length&&p!=="busy"?d`<div class="actions">
              ${c.map(m=>d`<button class="pill" @click=${()=>this._confirm={job:t.id,action:m}}>
                ${m==="run_next"?"Run now":"Cancel job"}</button>`)}
            </div>`:h}
      ${p?d`<div class="muted small">${p==="busy"?"Sending\u2026":p}</div>`:h}
    </div>`}_jobDevice(e,t,i){let n=i&&!e.error&&e.state==="rebooting"&&!!e.upgrade_version&&e.current_version===e.upgrade_version,r=e.error?"failed":e.state==="done"||n?"done":e.state==="cancelled"?"other":"running",o={failed:"mdi:alert-circle",done:"mdi:check-circle",other:"mdi:cancel",running:"mdi:progress-clock"}[r],l=e.upgrade_version&&e.upgrade_version!==e.current_version?`${e.current_version??"?"} \u2192 ${e.upgrade_version}`:e.current_version??"";return d`<div class="jd js-${r}">
      <ha-icon icon=${o}></ha-icon>
      ${t?.entities.update?d`<button class="name" @click=${()=>R(this,t.entities.update)}>${e.identity}</button>`:d`<span class="name">${e.identity}</span>`}
      <span class="mono muted">${l}</span>
      <span class="chip">${n?"upgraded":e.state??"?"}</span>
      ${e.error?d`<span class="reason">${e.error}</span>`:h}
      ${n?d`<span class="muted small">restarted before the job could record it</span>`:h}
    </div>`}async _act(e,t,i){this._confirm=void 0,this._outcome={...this._outcome,[t]:"busy"};let n;try{await qt(this.hass,e.entry_id,t,i),n=i==="run_next"?"Started as a new job.":"Job removed; the list updates on the next poll."}catch(r){n=r?.message??String(r)}this._outcome={...this._outcome,[t]:n}}_rule(e,t){let i=e.devices.filter(c=>c.upgrade_rule===t.name),n=ye(t.order),r=n.length?n.map(c=>({label:c,devices:i.filter(p=>p.labels.includes(c))})):[{label:ye(t.labels).join(", ")||"all",devices:i}],o=new Set(r.flatMap(c=>c.devices.map(p=>p.key))),l=i.filter(c=>!o.has(c.key));return l.length&&r.push({label:"other",devices:l}),d`
      <div class="rule">
        <div class="rule-head">
          <b>${t.name}</b>
          <span class="muted small">
            ${[t.channel&&`channel ${t.channel}`,t.strategy,t.fail_policy&&`on failure: ${t.fail_policy}`].filter(Boolean).join(" \xB7 ")}
          </span>
        </div>
        ${t.comment?d`<div class="muted small comment">${t.comment}</div>`:h}
        <div class="pipeline">
          ${r.map((c,p)=>d`
              ${p?d`<ha-icon class="arrow" icon="mdi:chevron-right"></ha-icon>`:h}
              <div class="step">
                <div class="step-label"><span class="n">${p+1}</span>${c.label}</div>
                ${c.devices.length>hs?this._summary(c.devices):d`<div class="devs">
                      ${c.devices.map(u=>d`<button class="dev status-${M(u)}" title="${u.identity} · ${u.version}"
                          @click=${()=>R(this,u.entities.update)}><ha-icon icon=${re(u)}></ha-icon></button>`)}
                      ${c.devices.length?h:d`<span class="muted small">none</span>`}
                    </div>`}
              </div>
            `)}
        </div>
      </div>
    `}_summary(e){let t=new Map,i=0;for(let r of e){!r.connected&&!r.controller&&i++;let o=r.version??"?",l=r.update_available?r.available_version??void 0:void 0,c=`${o}\0${l??""}`,p=t.get(c)??{from:o,to:l,count:0};p.count++,t.set(c,p)}let n=this._config.views?.devices;return d`<div class="summary">
      ${[...t.values()].sort((r,o)=>o.count-r.count||r.from.localeCompare(o.from)).map(r=>{let o=d`<b>${r.count}×</b> <span class="mono">${r.from}${r.to?` \u2192 ${r.to}`:""}</span>`,l=`trans ${r.to?"status-update":"status-ok"}`;return n?d`<button class=${l} title="Show these devices"
                @click=${()=>A(U(n,{cmr_version:r.from}))}>${o}</button>`:d`<span class=${l}>${o}</span>`})}
      ${i?d`<span class="trans status-offline"><b>${i}</b> offline</span>`:h}
    </div>`}static{this.styles=[z,S`
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
    `]}};var _s={be:"Wi-Fi 7",ax:"Wi-Fi 6",ac:"Wi-Fi 5",n:"Wi-Fi 4",g:"802.11g",a:"802.11a"};function ys(a){let s=/^(\d+)ghz-([a-z]+)$/.exec(a??"");if(!s)return a?[a]:[];let e=s[1]==="2"?"2.4":s[1],t=s[1]==="6"&&s[2]==="ax"?"Wi-Fi 6E":_s[s[2]]??s[2];return[`${e} GHz`,t]}function bs(a){if(!a)return null;if(!/^\d+$/.test(a))return`${a.replace(/,/g,", ")} MHz`;let s=Number(a),e=s===2484?14:s>=2412&&s<=2472?(s-2407)/5:s>=5e3&&s<=5900?(s-5e3)/5:s>=5955?(s-5950)/5:null;return e!==null&&Number.isInteger(e)?`channel ${e} (${s} MHz)`:`${s} MHz`}function xs(a){let s=n=>[...new Set(a.filter(r=>r.includes(n)).map(r=>r.match(/^wpa(\d?)/)?.[1]||"1"))].sort().map(r=>r==="1"?"WPA":`WPA${r}`),e=[],t=s("-psk"),i=s("-eap");return t.length&&e.push(`${t.join("/")} Personal`),i.length&&e.push(`${i.join("/")} Enterprise`),a.includes("owe")&&e.push("Enhanced Open"),e.join(" \xB7 ")||null}function pi(a){return a.length?d`${a.map(s=>d`<span class="chip band">${s} GHz</span>`)}`:d`<span class="chip band">All bands</span>`}function $s(a,s){return!a.length||!s.length||a.some(e=>s.includes(e))}var Ye=class extends T{static getConfigForm(){return{schema:[O,{name:"title",selector:{text:{}}}],computeLabel:D({entry_id:"Controller",title:"Title"})}}getGridOptions(){return{columns:"full",rows:"auto",min_columns:4}}getCardSize(){let s=this._entry?.wifi;return 2+2*((s?.networks.length??1)+(s?.radios.length??0))}render(){let s=this._entry;if(!s)return this.renderWaiting();let e=s.wifi,t=new Map(s.devices.map(o=>[o.key,o])),i=e?.networks.filter(o=>!o.disabled)??[],n=new Set(i.flatMap(o=>o.devices).filter(o=>t.get(o)?.wifi)),r;return e?!e.networks.length&&!e.radios.length?r=d`<div class="none">
        <ha-icon icon="mdi:wifi-cog"></ha-icon>
        <div>
          <div>CMR doesn't configure any Wi-Fi on this controller.</div>
          <div class="muted small">Networks and radio settings added under CMR › WiFi show up here, with the access points they apply to.</div>
        </div>
      </div>`:r=d`
        ${e.networks.length?d`<div class="section-label">Networks</div>
              <div class="items">${e.networks.map(o=>this._network(o,t))}</div>`:h}
        ${e.radios.length?d`<div class="section-label">Radio settings</div>
              <div class="items">${e.radios.map(o=>this._radio(o,i,t))}</div>`:h}`:r=d`<div class="empty">This controller's CMR has no WiFi menu.</div>`,d`<ha-card>
      <div class="card-header">
        <ha-icon icon="mdi:wifi"></ha-icon>
        <span>${this._config.title??"Wi-Fi"}</span>
        ${e?.networks.length?d`<span class="chip">${i.length} network${i.length===1?"":"s"}</span>
              <span class="chip">${n.size} access point${n.size===1?"":"s"}</span>`:h}
        <div class="spacer"></div>
      </div>
      ${this.renderStale(s)}
      ${r}
      ${e?d`<div class="foot muted small">Live access point and client counts aren't available from the controller's API yet.</div>`:h}
    </ha-card>`}_network(s,e){let i=[xs(s.authentication),s.vlan_id!==null?`VLAN ${s.vlan_id}`:null,s.fast_roaming?"Fast roaming":null,s.max_clients!==null?`up to ${s.max_clients} clients`:null].filter(Boolean),n=[];return!s.disabled&&s.vlan_id===null&&(s.mode??"ap")==="ap"&&n.push("No VLAN: CMR puts this network in no bridge, so its clients get no network access. Set a VLAN and carry it on the access points' uplink."),d`<div class="item ${s.disabled?"off":""}">
      <ha-icon class="kind" icon=${s.disabled?"mdi:wifi-off":s.hidden?"mdi:wifi-lock":"mdi:wifi"}></ha-icon>
      <div class="main">
        <div class="title">
          <span class="name">${s.ssid??"(no SSID)"}</span>
          ${pi(s.bands)}
          ${s.hidden?d`<span class="chip">Hidden</span>`:h}
          ${s.mlo?d`<span class="chip" title="Multi-Link Operation (Wi-Fi 7)">MLO</span>`:h}
          ${s.mode&&s.mode!=="ap"?d`<span class="chip">${s.mode}</span>`:h}
          ${s.disabled?d`<span class="chip">Off</span>`:h}
        </div>
        ${i.length||s.comment?d`<div class="muted small" title=${[...s.authentication,...s.encryption].join(", ")}>
              ${i.join(" \xB7 ")}${s.comment?d`${i.length?" \xB7 ":""}<i>${s.comment}</i>`:h}
            </div>`:h}
        ${this._targets(s.devices,s.selector,e,s.disabled)}
        ${s.disabled?h:n.map(r=>d`<div class="warn small"><ha-icon icon="mdi:alert-outline"></ha-icon>${r}</div>`)}
      </div>
    </div>`}_radio(s,e,t){let[i,n]=ys(s.band),r=s.chains?s.chains.split(",").filter(Boolean).length:0,o=[bs(s.frequency),s.width?s.width.replace(/mhz$/i," MHz"):null,s.tx_power!==null?`${s.tx_power} dBm`:null,r?`${r} chain${r===1?"":"s"}`:null,s.country].filter(Boolean),l=[];!s.disabled&&s.frequency&&!s.bands.length&&l.push("No band label: the channel goes to every radio, and a radio of another band is left with no available channel. Add +2ghz, +5ghz or +6ghz to its labels.");let c=e.some(u=>$s(u.bands,s.bands)&&u.devices.some(m=>s.devices.includes(m)));!s.disabled&&s.devices.length&&!c&&l.push("No enabled CMR network selects these radios, so these settings aren't applied.");let p=i?`${i}${n?` \xB7 ${n}`:""}`:s.bands.length?s.bands.map(u=>`${u} GHz`).join(", "):"All radios";return d`<div class="item ${s.disabled?"off":""}">
      <ha-icon class="kind" icon="mdi:access-point"></ha-icon>
      <div class="main">
        <div class="title">
          <span class="name">${p}</span>
          ${i?h:pi(s.bands)}
          ${s.disabled?d`<span class="chip">Off</span>`:h}
        </div>
        ${o.length||s.comment?d`<div class="muted small">
              ${o.join(" \xB7 ")}${s.comment?d`${o.length?" \xB7 ":""}<i>${s.comment}</i>`:h}
            </div>`:h}
        ${this._targets(s.devices,s.selector,t,s.disabled)}
        ${l.map(u=>d`<div class="warn small"><ha-icon icon="mdi:alert-outline"></ha-icon>${u}</div>`)}
      </div>
    </div>`}_targets(s,e,t,i){let n=s.map(c=>t.get(c)).filter(c=>!!c),r=n.filter(c=>c.wifi).sort(F),o=n.length-r.length,l=e.length?`labels ${e.join(", ")}`:"all devices";return n.length?d`<div class="aps">
      ${r.map(c=>d`<button class="ap status-${M(c)}" title=${L[M(c)]}
          @click=${()=>R(this,c.entities.connected)}><i class="dot"></i>${c.identity}</button>`)}
      <span class="muted small">${r.length?"":"No access point: "}${l}${o?` \xB7 ${o} device${o===1?"":"s"} without radios`:""}</span>
    </div>`:i?d`<div class="muted small">${l} · selects no device</div>`:d`<div class="warn small"><ha-icon icon="mdi:alert-outline"></ha-icon>Its ${l} select no device.</div>`}static{this.styles=[z,S`
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
    `]}};var hi="https://github.com/trakais/ha-cmr",ui=[["cmr-status-card",Oe,"CMR status","Controller, devices online, updates and alerts at a glance."],["cmr-topology-card",qe,"CMR topology","Live network map drawn from the controller's CMR layouts."],["cmr-fleet-card",He,"CMR devices","Every managed device with model, version, uptime and labels."],["cmr-alerts-card",De,"CMR alerts","Alert rules, which are active, and pushing alerts to Home Assistant."],["cmr-upgrades-card",Ve,"CMR upgrades","Upgrade rules as a rollout pipeline, plus recent jobs."],["cmr-events-card",Ne,"CMR events","Network timeline from the controller's log and changes, with detected issues."],["cmr-wifi-card",Ye,"CMR Wi-Fi","The Wi-Fi networks and radio settings CMR applies, and the access points they reach."]];function ws(){for(let[a,s]of ui)customElements.get(a)||customElements.define(a,s);customElements.get("ll-strategy-dashboard-cmr")||customElements.define("ll-strategy-dashboard-cmr",Ue),customElements.get("cmr-strategy-editor")||customElements.define("cmr-strategy-editor",We)}function mi(a,s=0){if(customElements.get("home-assistant")||s>=15e3){a();return}setTimeout(()=>mi(a,s+25),25)}mi(ws);window.customCards=window.customCards||[];for(let[a,,s,e]of ui)window.customCards.some(t=>t.type===a)||window.customCards.push({type:a,name:s,description:e,preview:!1,documentationURL:hi});window.customStrategies=window.customStrategies||[];window.customStrategies.some(a=>a.type==="cmr")||window.customStrategies.push({type:"cmr",strategyType:"dashboard",name:"MikroTik CMR network",description:"A complete network dashboard generated from your MikroTik CMR controller: status, topology, devices, alerts and upgrades.",documentationURL:hi});var wt=performance.getEntriesByType("resource").find(a=>a.name.includes("/cmr_static/cmr.js")),ks=wt?`fetched ${Math.round(wt.startTime)}\u2013${Math.round(wt.responseEnd)} ms, `:"";console.info("%c CMR %c cards loaded ","background:#3a6ea5;color:#fff;border-radius:3px 0 0 3px","background:#ddd;color:#333;border-radius:0 3px 3px 0",`${ks}script ran at ${Math.round(performance.now())} ms`);var Cs="Timeout waiting for strategy element ll-strategy-dashboard-cmr",kt="cmr-strategy-reloaded";function Ct(a,s=0){if(s>12)return!1;if(a instanceof Element&&a.shadowRoot&&Ct(a.shadowRoot,s+1))return!0;for(let e of Array.from(a.children))if(!(e.tagName==="SCRIPT"||e.tagName==="STYLE")&&(e.children.length===0&&e.textContent?.includes(Cs)||Ct(e,s+1)))return!0;return!1}function gi(a=0){if(!Ct(document)){if(a<6)setTimeout(()=>gi(a+1),2e3);else try{sessionStorage.removeItem(kt)}catch{}return}let s=!1;try{s=sessionStorage.getItem(kt)===location.pathname,sessionStorage.setItem(kt,location.pathname)}catch{s=a>0}if(s){console.warn("cmr: the dashboard strategy timed out again after a reload; not retrying");return}console.warn("cmr: the dashboard strategy timed out before this script registered it; reloading once"),location.reload()}gi();
