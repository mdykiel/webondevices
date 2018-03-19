webpackJsonp([76941420914516],{429:function(n,s){n.exports={data:{markdownRemark:{html:'<p><strong>We’ve been drinking Nespresso Capsule coffees for a while and it’s an absolute pain choosing from all the variations available. Yes, the names are written on the capsules but not everyone knows what “fortissio lungo” tastes like.</strong></p>\n<p>Being a creative technologist in the office, I was instantly looking for ways to automatically identify the capsules with a clever Arduino or JavaScript hack. The unique colour of the capsules gave me the idea to scan theme somehow. First, I bought an <a href="http://image4.buyincoins.com/bicv2/product/s0/1401270782_8105.jpg">Arduino colour scanner</a> module which worked well but later I decided to create something people can carry around and use on their phones.</p>\n<p>Here’s how the finished demo looked like:</p>\n<p><a class="youtube-video" href="https://www.youtube.com/embed/b1e7GIfczwo" target="_blank">Click to see Youtube video</a></p>\n<p>For this solution I used <a href="http://trackingjs.com/">Tracking.js</a>. Tracking.js can track images, camera streams and videos and can recognise colours and faces in them.</p>\n<h3 id="scanning-colours"><a href="#scanning-colours" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Scanning Colours</h3>\n<p>I started the project off by creating a capsule colour and tasting note definition object. This is what I use to lookup the flavours from.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// Flavour and colour definition object</span>\n\napp<span class="token punctuation">.</span>flavours <span class="token operator">=</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n        colourName<span class="token punctuation">:</span> <span class="token string">\'Vanilio\'</span><span class="token punctuation">,</span>\n        red<span class="token punctuation">:</span> <span class="token number">245</span><span class="token punctuation">,</span>\n        green<span class="token punctuation">:</span> <span class="token number">235</span><span class="token punctuation">,</span>\n        blue<span class="token punctuation">:</span> <span class="token number">175</span><span class="token punctuation">,</span>\n        treshold<span class="token punctuation">:</span> <span class="token number">30</span><span class="token punctuation">,</span>\n        notes<span class="token punctuation">:</span> <span class="token string">"Full flavoured rich blend, with velvety vanilla aroma."</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span><span class="token punctuation">{</span><span class="token operator">...</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>When the application is opened the camera image of the Android phone or laptop appears in an HTML video element through the <a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaStream">MediaStream API</a>. Tracking.js then starts watching the image and looking for large areas appearing filled with colours that match our definition. The simplest form of this would be something along these lines:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// Detecting colours from a video</span>\n\n<span class="token keyword">var</span> colors <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">tracking<span class="token punctuation">.</span>ColorTracker</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'magenta\'</span><span class="token punctuation">,</span> <span class="token string">\'cyan\'</span><span class="token punctuation">,</span> <span class="token string">\'yellow\'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    \ncolors<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">\'track\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>event<span class="token punctuation">.</span>data<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// No colours were detected in this frame.</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n        event<span class="token punctuation">.</span>data<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>rect<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>rect<span class="token punctuation">.</span>x<span class="token punctuation">,</span> rect<span class="token punctuation">.</span>y<span class="token punctuation">,</span> rect<span class="token punctuation">.</span>height<span class="token punctuation">,</span> rect<span class="token punctuation">.</span>width<span class="token punctuation">,</span> rect<span class="token punctuation">.</span>color<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// pick the video element to watch</span>\ntracking<span class="token punctuation">.</span><span class="token function">track</span><span class="token punctuation">(</span><span class="token string">\'#myVideo\'</span><span class="token punctuation">,</span> colors<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Registering new colours into Tracking.js wasn’t straight forward. Here’s the piece of code from the documentation which unfortunately didn’t work with thresholds:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// Defining new colours to track</span>\n\ntracking<span class="token punctuation">.</span>ColorTracker<span class="token punctuation">.</span><span class="token function">registerColor</span><span class="token punctuation">(</span><span class="token string">\'green\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>r<span class="token punctuation">,</span> g<span class="token punctuation">,</span> b<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>r <span class="token operator">&lt;</span> <span class="token number">50</span> <span class="token operator">&amp;&amp;</span> g <span class="token operator">></span> <span class="token number">200</span> <span class="token operator">&amp;&amp;</span> b <span class="token operator">&lt;</span> <span class="token number">50</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Here\'s what I had to do to extend it with threshold functionality:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// Defining new colours to track with threshold</span>\n\ntracking<span class="token punctuation">.</span>ColorTracker<span class="token punctuation">.</span><span class="token function">registerColor</span><span class="token punctuation">(</span>settings<span class="token punctuation">.</span>colourName<span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>r<span class="token punctuation">,</span> g<span class="token punctuation">,</span> b<span class="token punctuation">)</span><span class="token punctuation">{</span>\n    <span class="token keyword">if</span><span class="token punctuation">(</span> <span class="token punctuation">(</span> r <span class="token operator">>=</span> settings<span class="token punctuation">.</span>red   <span class="token operator">-</span> settings<span class="token punctuation">.</span>treshold <span class="token punctuation">)</span>\n     <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span> r <span class="token operator">&lt;=</span> settings<span class="token punctuation">.</span>red   <span class="token operator">+</span> settings<span class="token punctuation">.</span>treshold <span class="token punctuation">)</span>\n     <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span> g <span class="token operator">>=</span> settings<span class="token punctuation">.</span>green <span class="token operator">-</span> settings<span class="token punctuation">.</span>treshold <span class="token punctuation">)</span>\n     <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span> g <span class="token operator">&lt;=</span> settings<span class="token punctuation">.</span>green <span class="token operator">+</span> settings<span class="token punctuation">.</span>treshold <span class="token punctuation">)</span>\n     <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span> b <span class="token operator">>=</span> settings<span class="token punctuation">.</span>blue  <span class="token operator">-</span> settings<span class="token punctuation">.</span>treshold <span class="token punctuation">)</span>\n     <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span> b <span class="token operator">&lt;=</span> settings<span class="token punctuation">.</span>blue  <span class="token operator">+</span> settings<span class="token punctuation">.</span>treshold <span class="token punctuation">)</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>After this Tracking.js fires an event and calls a function each time a colour from that camera image is matched with a colour from the capsule definition. When this happens a panel slides in with the image of the capsule and reads the tasting notes using the <a href="http://updates.html5rocks.com/2014/01/Web-apps-that-talk---Introduction-to-the-Speech-Synthesis-API">WebSpeech API</a>.</p>\n<p>I know the WebSpeech API might be a little bit too much but it ALWAYS gives that wow factor to my projects. People love talking apps and robots. Take <a href="http://www.webondevices.com/george-the-talking-javascript-plant/">Geroge, the talking plant</a> for instance who was an instant hit in the office.</p>\n<p>Here’s how the Nespresso Scanner speaks:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// Reading the tasting notes up</span>\n\n<span class="token comment">// Speech synthesizer init</span>\napp<span class="token punctuation">.</span>speech <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SpeechSynthesisUtterance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// Select british voice</span>\n<span class="token keyword">var</span> voices <span class="token operator">=</span> window<span class="token punctuation">.</span>speechSynthesis<span class="token punctuation">.</span><span class="token function">getVoices</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\napp<span class="token punctuation">.</span>speech<span class="token punctuation">.</span>lang <span class="token operator">=</span> <span class="token string">\'en-GB\'</span><span class="token punctuation">;</span>\napp<span class="token punctuation">.</span>speech<span class="token punctuation">.</span>voice <span class="token operator">=</span> voices<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>voice<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> voice<span class="token punctuation">.</span>name <span class="token operator">==</span> <span class="token string">\'English United Kingdom\'</span><span class="token punctuation">;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\napp<span class="token punctuation">.</span>speech<span class="token punctuation">.</span>rate <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>\n\n<span class="token comment">// Read the definition from the tasting notes object</span>\napp<span class="token punctuation">.</span>speech<span class="token punctuation">.</span>text <span class="token operator">=</span> <span class="token string">"This is a "</span> <span class="token operator">+</span> app<span class="token punctuation">.</span>flavours<span class="token punctuation">[</span>selected<span class="token punctuation">]</span><span class="token punctuation">.</span>cName<span class="token punctuation">;</span>\nspeechSynthesis<span class="token punctuation">.</span><span class="token function">speak</span><span class="token punctuation">(</span>app<span class="token punctuation">.</span>speech<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<h3 id="future-plans"><a href="#future-plans" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Future plans</h3>\n<p>The main problem with the current implementation is that colours appearing in the camera stream are different when light conditions change. They might look brighter or darker but the biggest problem is white balance. You know when you take a photo and everything looks slightly blue or slightly red. This obviously all affect Trakcing.js.</p>\n<p><img src="http://www.webondevices.com/posts/nespresso-capsules.jpg" alt="Nespresso capsules"></p>\n<p>The current implementation could be improved by adding a \'global white balance reference colour\' that would be used to calibrate the app. In perfect light conditions the grey colour has equal amounts of red, green and blue in it, for example: 150, 150, 150. If the grey colour is 180, 130, 150 under another light condition then each colour has to be adjusted by the same amount: red + 30, green - 20, blue + 0. With this solution you would still need to re-calibrate the app each time but instead of re-calibrating all the colours you only do one.</p>\n<p>At one point I might also build the Arduino powered scanner with my colour recognition module. The good thing about that are the 4 bright LEDs which cancels out the tinted environmental light so colours always look the same.</p>',timeToRead:4,excerpt:"We’ve been drinking Nespresso Capsule coffees for a while and it’s an absolute pain choosing from all the variations available. Yes, the…",frontmatter:{title:"Scanning Nespresso Capsules with JavaScript",cover:"http://www.webondevices.com/posts/nespresso-capsules.jpg",date:"24/07/2015",category:"moar",tags:["javascript","project idea"]},fields:{slug:"/scanning-nespresso-capsules-with-java-script"}}},pathContext:{slug:"/scanning-nespresso-capsules-with-java-script"}}}});
//# sourceMappingURL=path---scanning-nespresso-capsules-with-javascript-75a18ad76a6b1732bb9d.js.map