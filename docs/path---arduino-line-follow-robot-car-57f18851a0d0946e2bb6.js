webpackJsonp([0xddcfecc133c1],{423:function(n,s){n.exports={data:{markdownRemark:{html:'<p>Last time <a href="/arduino-robot-car-obstacle-avoidance/">we built an Arduino robot car</a> with an ultrasonic distance sensor and added some logic to automatically steer away from obstacles. It could also be manually driven with a second Arduino from the joystick shield added to it. The two were communicating via NRF24 radio modules.</p>\n<p><strong>Today we extend this robot car with a line-follow sensor and add some new application logic. With this it will automatically drive along a black line (or a white line if you set it up differently).</strong></p>\n<p><a class="youtube-video" href="https://www.youtube.com/embed/k3L-TGgk8Ow" target="_blank">Click to see Youtube video</a></p>\n<p>If you are getting started from scratch, just go back to the previous post and follow the build instructions there. Please note that the pins will be connected to different outputs in this example, but everything remains the same.</p>\n<p>The final source code for the project can be found on Github:\n<a href="https://github.com/webondevices/example-projects/tree/master/car-line-follow">https://github.com/webondevices/example-projects/tree/master/car-line-follow</a></p>\n<p>And here\'s the source code for the obstacle avoiding logic:\n<a href="https://github.com/webondevices/example-projects/tree/master/car-obstacle-avoid">https://github.com/webondevices/example-projects/tree/master/car-obstacle-avoid</a></p>\n<h3 id="line-follow-sensor"><a href="#line-follow-sensor" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Line follow sensor</h3>\n<p>This simple analog sensor has three infrared LEDs facing downwards that can detect contrast differences in light. As a result, it will output 5 V and the code will report HIGH when one of the sensors detect black and 0 V and LOW when there\'s only a white sheet of paper under the sensor.</p>\n<p><img src="http://www.webondevices.com/posts/2018/line-follow.jpg" alt="Line follow sensor"></p>\n<p>This sensor module has three infrared LEDs and three output pins, so you will need to interpret the position of the black line by evaluating the values reported by all three infrared sensors at the same time.</p>\n<p>Here are some of the possible scenarios:</p>\n<ul>\n<li>all three sensors report LOW: only white background is visible</li>\n<li>LOW, HIGH, LOW: the black line is in the middle, under the centre inrared sensor</li>\n<li>HIGH, LOW, LOW: the black line is under the left infrared sensor</li>\n<li>LOW, lOW, HIGH: the black line is under the right infrared sensor</li>\n</ul>\n<p>Setting this sensor up in the Arduino code is very simple as the module exposes three digital output pins for the three infrared LED sensors. You simply connect these to 3 digital pins. I randomly picked D4, D3 and D2.</p>\n<p>The Arduino sketch to read and interpret the measurements is only a couple of lines of code:</p>\n<div class="gatsby-highlight">\n      <pre class="language-c"><code><span class="token keyword">int</span> lft <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">;</span>\n<span class="token keyword">int</span> ctr <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>\n<span class="token keyword">int</span> rgt <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>\n\n<span class="token keyword">void</span> <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Set all line follow pins as input</span>\n    <span class="token function">pinMode</span><span class="token punctuation">(</span>lft<span class="token punctuation">,</span> INPUT<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token function">pinMode</span><span class="token punctuation">(</span>ctr<span class="token punctuation">,</span> INPUT<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token function">pinMode</span><span class="token punctuation">(</span>rgt<span class="token punctuation">,</span> INPUT<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">void</span> <span class="token function">loop</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">int</span> left <span class="token operator">=</span> <span class="token function">digitalRead</span><span class="token punctuation">(</span>lft<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">int</span> centre <span class="token operator">=</span> <span class="token function">digitalRead</span><span class="token punctuation">(</span>ctr<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">int</span> right <span class="token operator">=</span> <span class="token function">digitalRead</span><span class="token punctuation">(</span>rgt<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 001</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>left <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> centre <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// Line under right sensor</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token comment">// 100</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>left <span class="token operator">==</span> <span class="token number">1</span> <span class="token operator">&amp;&amp;</span> centre <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// Line under left sensor</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token comment">// 000 or 010</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>left <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> centre <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">(</span>left <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> centre <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// Line under middle sensor or invisible</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>This is the most basic logic possible to work with the incoming signals. In the final version of the code we also have some logic to handle situations where the line is thicker than usual and it might be detected by two sensors at the same time.</p>\n<h3 id="steering"><a href="#steering" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Steering</h3>\n<p>The obstacle avoiding robot sketch had some higher level functions defined to help turning the car into direction: moveForward(), turnLeft(), turnRight();</p>\n<p>We can call these depending on the different line positions:</p>\n<ul>\n<li>If line is on the left side: turn right!</li>\n<li>If line is on the right side: turn left!</li>\n<li>If line is in the centre: go straight on!</li>\n</ul>\n<p> In the final version of the Arduino sketch, witch also takes some the edge cases into consideration, the motor drive functions are also called to take action:</p>\n<div class="gatsby-highlight">\n      <pre class="language-c"><code><span class="token keyword">int</span> left <span class="token operator">=</span> <span class="token function">digitalRead</span><span class="token punctuation">(</span>lft<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">int</span> centre <span class="token operator">=</span> <span class="token function">digitalRead</span><span class="token punctuation">(</span>ctr<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">int</span> right <span class="token operator">=</span> <span class="token function">digitalRead</span><span class="token punctuation">(</span>rgt<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 010</span>\n<span class="token keyword">if</span> <span class="token punctuation">(</span>left <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> centre <span class="token operator">==</span> <span class="token number">1</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">moveForward</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 011 || 001</span>\n<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>left <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> centre <span class="token operator">==</span> <span class="token number">1</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">(</span>left <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> centre <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">turnRight</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 110 || 100</span>\n<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>left <span class="token operator">==</span> <span class="token number">1</span> <span class="token operator">&amp;&amp;</span> centre <span class="token operator">==</span> <span class="token number">1</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">(</span>left <span class="token operator">==</span> <span class="token number">1</span> <span class="token operator">&amp;&amp;</span> centre <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">turnLeft</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 000</span>\n<span class="token keyword">if</span> <span class="token punctuation">(</span>left <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> centre <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> right <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">moveForward</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>Notice how in the "000" scenario the moveForward function is called with 0 passed in to move the motors forward with the speed of 0, which essentially means: stop the car.</p>\n<p>The complete code combined with the previously discussed motor drive logic can be found here on Github:\n<a href="https://github.com/webondevices/example-projects/tree/master/car-line-follow">https://github.com/webondevices/example-projects/tree/master/car-line-follow</a></p>\n<h3 id="future-improvements"><a href="#future-improvements" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Future improvements</h3>\n<p>Some complain that with this very basic logic the car goes along with a jittery back and forth steering movement. This happens even when the car is expected to go along a perfectly straight line.</p>\n<p>To improve this issue you could invest into a line follow sensor that has 5 ore more sensors. with this you could change the angle of steering depending on how far out the line is from the center.</p>\n<p>However, the best way to improve the application logic would be to make the car work with angles and curves. This would mean the car would start turning into a curve when the line is off center and it would increase the angle of the curve until the line is back in the middle. With this improved logic the car would carry on going along a curve after the line is back in the middle.</p>\n<p>If you manage to improve the steering logic, I will publish your solution on Web on Devices!</p>',timeToRead:4,excerpt:"Last time  we built an Arduino robot car  with an ultrasonic distance sensor and added some logic to automatically steer away from obstacles…",frontmatter:{title:"Building an Arduino line-follow Robot Car",cover:"http://www.webondevices.com/posts/2018/line-follow.jpg",date:"20/04/2018",category:"moar",tags:["arduino"]},fields:{slug:"/building-an-arduino-line-follow-robot-car"}}},pathContext:{slug:"/building-an-arduino-line-follow-robot-car"}}}});
//# sourceMappingURL=path---arduino-line-follow-robot-car-57f18851a0d0946e2bb6.js.map