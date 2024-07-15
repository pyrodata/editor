import{y as s,a3 as t,c as n,o as l,a2 as o}from"./chunks/framework.FtfTDG2u.js";const r=o(`<h1 id="pyrodata-editor" tabindex="-1">@pyrodata/editor <a class="header-anchor" href="#pyrodata-editor" aria-label="Permalink to &quot;@pyrodata/editor&quot;">​</a></h1><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Note that this is still in beta, so expect bugs and breaking changes until we reach v1</p></div><p>This editor is used on the <a href="https://pyrodata.com" target="_blank" rel="noreferrer">pyrodata.com</a> website to edit posts and pages. It is heavily inspired by the editor used on Reddit.</p><div id="editor"></div><h2 id="installation" tabindex="-1">Installation <a class="header-anchor" href="#installation" aria-label="Permalink to &quot;Installation&quot;">​</a></h2><p>Install the package with the package manager you are using.</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-gBDuP" id="tab-c1zy5ol" checked><label for="tab-c1zy5ol">npm</label><input type="radio" name="group-gBDuP" id="tab-Pn8rrFE"><label for="tab-Pn8rrFE">pnpm</label><input type="radio" name="group-gBDuP" id="tab-KSUueR2"><label for="tab-KSUueR2">yarn</label><input type="radio" name="group-gBDuP" id="tab-eNsjZEL"><label for="tab-eNsjZEL">bun</label></div><div class="blocks"><div class="language-bash vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @pyrodata/editor</span></span></code></pre></div><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @pyrodata/editor</span></span></code></pre></div><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @pyrodata/editor</span></span></code></pre></div><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bun</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @pyrodata/editor</span></span></code></pre></div></div></div><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to &quot;Usage&quot;">​</a></h2><p>To create a new <em>editor</em>, use the <code>createEditor</code> method as shown below:</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { createEditor } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@pyrodata/editor&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> element</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;editor&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> editor</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> createEditor</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(element)</span></span></code></pre></div><p>This code snippet initializes a new editor with the default <a href="./interfaces/config.html">configuration</a>. The <code>createEditor</code> method takes a DOM element as an argument, which in this case is the element with the ID &#39;editor&#39;.</p>`,11),p=[r],u=JSON.parse('{"title":"@pyrodata/editor","description":"","frontmatter":{},"headers":[],"relativePath":"index.md","filePath":"index.md"}'),d={name:"index.md"},k=Object.assign(d,{setup(h){return s(async()=>{const{createEditor:a}=await t(async()=>{const{createEditor:e}=await import("./chunks/index.093SnWB4.js");return{createEditor:e}},[]),i=document.getElementById("editor");a(i,{tiptap:{content:`
<h2>Pyodata Editor</h2>

<p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>

<h2>Header Level 2</h2>

<ol>
    <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
    <li>Aliquam tincidunt mauris eu risus.</li>
</ol>

<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote>

<h3>Header Level 3</h3>

<ul>
    <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
    <li>Aliquam tincidunt mauris eu risus.</li>
</ul>`}}),console.log(i)}),(a,i)=>(l(),n("div",null,p))}});export{u as __pageData,k as default};