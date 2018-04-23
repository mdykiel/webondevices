webpackJsonp([0xa08e8c48f15c],{420:function(n,s){n.exports={data:{markdownRemark:{html:'<p>This is the second post in a series about logging sensor data from an Arduino with the help of Node.js and JavaScript.</p>\n<p>In <a href="/arduino-data-logger-into-file-nodejs-javascript">part one of the series</a>, we have uploaded a piece of code onto the Arduino responsible for performing the sensor measurements and passing that data through as JSON via the USB port. We then read the incoming serial messages from a JavaScript app and logged the data into a CSV file.</p>\n<p><img src="http://www.webondevices.com/posts/2018/dht22-data-logging.jpg" alt="AWS dynamodb data logging"></p>\n<p>If you wish to pick up the project from where we left it off last time, download the source from Github:\n<a href="https://github.com/webondevices/example-projects/tree/master/temp-log-csv">https://github.com/webondevices/example-projects/tree/master/temp-log-csv</a></p>\n<p><strong>In this second part, we will connect to Amazon Web Services and save our data into their noSQL database service called DynamoDB.</strong></p>\n<h3 id="getting-started-with-aws"><a href="#getting-started-with-aws" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Getting started with AWS</h3>\n<p><strong>Amazon Web Services</strong> is a collection of cloud services that lets you create and manage databases (<strong>DynamoDB</strong>), run cloud functions (<strong>Lamdba</strong>), build APIs (<strong>API Gateway</strong>), control IoT devices (<strong>AWS IoT Core</strong>), store files (<strong>S3</strong>), write Amazon Alexa skills (<strong>Alexa Skills Kit</strong>), access Machine Learning driven services like natural language processing, image and voice recognition or speech synthesis, and dozens of other useful services. Most importantly all of these have a JavaScript SDK so it\'s very easy to get started, even as a front-end developer.</p>\n<p>It\'s worth mentioning that AWS can have some cost implications but most of the services start from a free tier that you\'d probably only exceed if you are working at a commercial scale so getting started and playing around is usually free.</p>\n<p>To get started, first register an account:</p>\n<p><a href="https://portal.aws.amazon.com/billing/signup">https://portal.aws.amazon.com/billing/signup</a></p>\n<p>After logging into your new account you will be redirected to the console homepage.</p>\n<p>To work with AWS from Node.js, the AWS command line tool is recommended to be installed, especially to make the setup process easy.</p>\n<p>On <strong>Windows</strong> the MSI installer is the easiest way to get started:\n<a href="https://docs.aws.amazon.com/cli/latest/userguide/awscli-install-windows.html">https://docs.aws.amazon.com/cli/latest/userguide/awscli-install-windows.html</a></p>\n<p>On <strong>Macintosh</strong> pip is the recommended tool to install it:\n<a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html">https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html</a></p>\n<p>If you wish to install this on <strong>Linux</strong> or have any other issues, just refer to the rest of the installation guide:\n<a href="https://docs.aws.amazon.com/cli/latest/userguide/installing.html">https://docs.aws.amazon.com/cli/latest/userguide/installing.html</a></p>\n<p>To confirm that the installation was successful, run <code>aws --version</code> from the command line which should return the version number of the newly installed cli.</p>\n<p>Next step is creating a user in AWS that will receive some API keys. These keys will let us connect to the cloud services from our computer via that dev user. In your console select IAM from the Services drop down menu or search for it:</p>\n<p><img src="http://www.webondevices.com/posts/2018/aws-find-service.jpg" alt="console home page"></p>\n<p><strong>IAM</strong> (AWS Identity and Access Management) is a service that helps you securely control access to AWS resources. You use IAM to control who is authenticated (signed in) and authorised (has permissions) to use resources.</p>\n<p>We will create a new user with this tool and give it programmatic access which will generate an access key ID and a secret access key for the AWS API, CLI, SDK, and other development tools. Click Add user:</p>\n<p><img src="http://www.webondevices.com/posts/2018/aws-iam-home.jpg" alt="aws create new user"></p>\n<p>Fill out the name and select programmatic access. Next, you are asked to setup the permissions for the new user. On this page select "Attach existing policies directly" and choose "AdministratorAccess".</p>\n<p>Granting administrator rights to an IAM user is not best practice so in production apps you will want to narrow down the accessible resources but these settings will do the job for now.</p>\n<p>After creating the user you will have access to the <strong>Access key ID</strong> and the <strong>Secret access key</strong>. Make a note of these.</p>\n<p><img src="http://www.webondevices.com/posts/2018/aws-iam-new-user.jpg" alt="aws create new user"></p>\n<p>Let\'s now open up the command line and connect our newly created admin user to the AWS SDK. Run <code>aws configure</code> and copy your keys when prompted.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>AWS Access Key ID [None]: <copy your key>\nAWS Secret Access Key [None]: <copy your key>\nDefault region name [None]: <region you selected in the console>\nDefault output format [None]: <json or text or tabel></code></pre>\n      </div>\n<p>The default region should be the region you selected in the top right corner of your AWS console:</p>\n<p><img src="http://www.webondevices.com/posts/2018/aws-console-region.jpg" alt="aws create new user"></p>\n<p>The region codes can be found on this page:\n<a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html">https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html</a></p>\n<p>The default output format can be either json, text, or table. If you don\'t specify an output format, json will be used.</p>\n<p>And that\'s all there is to setting up the AWS SDK!</p>\n<h3 id="creating-a-dynamodb-table"><a href="#creating-a-dynamodb-table" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Creating a DynamoDB table</h3>\n<p>Let\'s now create a new table in our database for our data to be logged into. In the AWS console homepage select DynamoDB from the Services drop down menu or search for it.</p>\n<p>At this point, make sure you have the <strong>correct region selected</strong> for your service as your table will be created in and assigned to that very region and it will not be accessible if another region is selected. Next, you can click on the Create Table button.</p>\n<p><img src="http://www.webondevices.com/posts/2018/aws-dynamodb-home.jpg" alt="aws create new user"></p>\n<p>Name your table and add a partion key as a primary key. The primary key uniquely identifies each item in the table, so that no two items can have the same key. In our case we wouldn\'t want to use the temperature or humidity values, as two entries in our table can have the same value. Instead, we could use the datetime millisecond value which will always be unique.</p>\n<p>In other cases when you find it difficult to choose a unique primary key from your data, you can just simply use a uniquely generated ID.</p>\n<p><img src="http://www.webondevices.com/posts/2018/aws-create-dynamodb-table.jpg" alt="aws create new user"></p>\n<p>Click on create and you are now <strong>ready to submit your readings to the database</strong>!</p>\n<h3 id="sending-data-to-the-database-with-aws-dynamodb-for-nodejs"><a href="#sending-data-to-the-database-with-aws-dynamodb-for-nodejs" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Sending data to the database with AWS Dynamodb for Node.js</h3>\n<p>Again, if you wish to pick up the previous project from this point, download the source from Github:\n<a href="https://github.com/webondevices/example-projects/tree/master/temp-log-csv">https://github.com/webondevices/example-projects/tree/master/temp-log-csv</a></p>\n<p>The piece of Arduino code remains the same, we will only make changes to the JavaScript file. Firstly, we need to install the AWS NPM packages to connect to DynamoDB: <code>npm install --save aws-sdk dynamodb-doc</code></p>\n<p>When the installation is finished, load and initialise the new libraries in a new file called temp-log-aws.js:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> AWS <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'aws-sdk\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nAWS<span class="token punctuation">.</span>config<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">{</span>region<span class="token punctuation">:</span> <span class="token string">\'eu-west-2\'</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> doc <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'dynamodb-doc\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> dynamo <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">doc<span class="token punctuation">.</span>DynamoDB</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Note the region setting at the initialisation. If this setting is omitted, the default region setting will be used, the one you specified after the <code>aws configure</code> command. Remember that this will need to match the region you created your DynamoDB table in. Use this page to look up region codes: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html">https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html</a>.</p>\n<p>We are now ready to use the <code>dynamo.putItem()</code> method to submit new data to the table:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>dynamo<span class="token punctuation">.</span><span class="token function">putItem</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    TableName<span class="token punctuation">:</span> <span class="token string">\'sensor-measurements\'</span><span class="token punctuation">,</span>\n    Item<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        temperature<span class="token punctuation">:</span> temperature<span class="token punctuation">,</span>\n        humidity<span class="token punctuation">:</span> humidity<span class="token punctuation">,</span>\n        datetime<span class="token punctuation">:</span> moment<span class="token punctuation">.</span><span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> data<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>JSON<span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">\'  \'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Here, the two most important things to remember are that:</p>\n<ul>\n<li>the <strong>TableName</strong> will need to match the name of the table you created in DynamoDB,</li>\n<li>the <strong>Item</strong> object can have as many properties as you want with any data type you prefer, but you always have to include your partion key at least once and it has to match the datatype you specified when you created it, in our case this was the datetime property and we chose the Number type.</li>\n</ul>\n<p>This piece of code needs to be added into the callback function of the serialport event listener as we originally created it in <a href="/arduino-data-logger-into-file-nodejs-javascript">the first part of this series</a>.</p>\n<p>The final version of the code will have this function added in the callback:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> AWS <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'aws-sdk\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">// Change to the region of your DB</span>\nAWS<span class="token punctuation">.</span>config<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">{</span>region<span class="token punctuation">:</span> <span class="token string">\'eu-west-2\'</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> doc <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'dynamodb-doc\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> dynamo <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">doc<span class="token punctuation">.</span>DynamoDB</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> SerialPort <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'serialport\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> SerialPort <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'serialport\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// Add your USB port name</span>\n<span class="token keyword">const</span> port <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SerialPort</span><span class="token punctuation">(</span><span class="token string">\'/dev/xy\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n\tparser<span class="token punctuation">:</span> SerialPort<span class="token punctuation">.</span>parsers<span class="token punctuation">.</span><span class="token function">readline</span><span class="token punctuation">(</span><span class="token string">\'\\n\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> logIntervalMinutes <span class="token operator">=</span> <span class="token number">0.1</span><span class="token punctuation">;</span>\n<span class="token keyword">let</span> lastMoment <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">tryParseJson</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">try</span> <span class="token punctuation">{</span>\n        JSON<span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">return</span> JSON<span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\nport<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">\'open\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\tport<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">\'data\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">const</span> sensorData <span class="token operator">=</span> <span class="token function">tryParseJson</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\t<span class="token keyword">const</span> moment <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n\t\t<span class="token keyword">if</span> <span class="token punctuation">(</span>moment<span class="token punctuation">.</span><span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> lastMoment<span class="token punctuation">.</span><span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">></span> logIntervalMinutes <span class="token operator">*</span> <span class="token number">60</span> <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t\tlastMoment <span class="token operator">=</span> moment<span class="token punctuation">;</span>\n\n\t\t\tdynamo<span class="token punctuation">.</span><span class="token function">putItem</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n\t\t\t\tTableName<span class="token punctuation">:</span> <span class="token string">\'sensor-measurements\'</span><span class="token punctuation">,</span>\n\t\t\t\tItem<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n\t\t\t\t\ttemperature<span class="token punctuation">:</span> sensorData<span class="token punctuation">.</span>temperature<span class="token punctuation">,</span>\n\t\t\t\t\thumidity<span class="token punctuation">:</span> sensorData<span class="token punctuation">.</span>humidity<span class="token punctuation">,</span>\n\t\t\t\t\tdatetime<span class="token punctuation">:</span> moment<span class="token punctuation">.</span><span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\t\t\t\t<span class="token punctuation">}</span>\n\t\t\t<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> data<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t\t\t<span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t\t\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\t\t\t<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n\t\t\t\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>JSON<span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">\'  \'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\t\t\t<span class="token punctuation">}</span>\n\t\t\t<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\t<span class="token punctuation">}</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Saving this into a file called temp-log-aws.js and running <code>node temp-log-aws.js</code> will submit new sensor measurement readings to DynamoDB every 6 seconds.</p>\n<p>Well done on finishing this project! You are now fully set up to work with AWS from Node.js and Arduino and know how to save your sensor measurements to the cloud to later use it for analytics or trigger different actions or notifications.</p>\n<h3 id="validating-the-data-in-the-aws-console"><a href="#validating-the-data-in-the-aws-console" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Validating the data in the AWS console</h3>\n<p>There are two ways to validate or retreive the data that we\'ve just saved to DynamoDB. The easiest option is navigating to the DynamoDB service from the web console, then selecting "Tables", clicking on the name of your table and selecting the the Items tab.</p>\n<p><img src="http://www.webondevices.com/posts/2018/aws-dynamodb-table.jpg" alt="aws create new user"></p>\n<p>All our data is listed here as expected and you can export or filter it depending on your needs.</p>\n<h3 id="validating-the-data-by-scanning-dynamodb"><a href="#validating-the-data-by-scanning-dynamodb" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Validating the data by scanning DynamoDB</h3>\n<p>Second option for retreiving the data is programatically requesting it from JavaScript. Let\'s start with a simple example: download all data from the table. We can say we want to scan for entries with a datetime value lower than the current time. This essentially means all entries in the past.</p>\n<p>Please note that <strong>scanning and querying</strong> are different concepts in DyanmoDB. When you query, you have to include your primary key in the query. In our case this would mean query by the datetime value. Scanning gives you a lot more freedom (but could be slightly slower in bigger datasets) for this is what we will use for now.</p>\n<p>Add this into a new file called temp-read-aws.js:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> AWS <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'aws-sdk\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nAWS<span class="token punctuation">.</span>config<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">{</span>region<span class="token punctuation">:</span> <span class="token string">\'eu-west-2\'</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> doc <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'dynamodb-doc\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> dynamo <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">doc<span class="token punctuation">.</span>DynamoDB</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> date <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">;</span>\n\n<span class="token comment">// Return all items before current time</span>\n<span class="token keyword">const</span> params1 <span class="token operator">=</span> <span class="token punctuation">{</span>\n    TableName<span class="token punctuation">:</span> <span class="token string">"sensor-measurements"</span><span class="token punctuation">,</span>\n    ProjectionExpression<span class="token punctuation">:</span> <span class="token string">"#datetime, #temperature, #humidity"</span><span class="token punctuation">,</span>\n    FilterExpression<span class="token punctuation">:</span> <span class="token string">"#datetime &lt; :now"</span><span class="token punctuation">,</span>\n    ExpressionAttributeNames<span class="token punctuation">:</span><span class="token punctuation">{</span>\n        <span class="token string">"#temperature"</span><span class="token punctuation">:</span> <span class="token string">"temperature"</span><span class="token punctuation">,</span>\n        <span class="token string">"#datetime"</span><span class="token punctuation">:</span> <span class="token string">"datetime"</span><span class="token punctuation">,</span>\n        <span class="token string">"#humidity"</span><span class="token punctuation">:</span> <span class="token string">"humidity"</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    ExpressionAttributeValues<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        <span class="token string">":now"</span><span class="token punctuation">:</span> date<span class="token punctuation">.</span><span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\ndynamo<span class="token punctuation">.</span><span class="token function">scan</span><span class="token punctuation">(</span>params1<span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>err<span class="token punctuation">,</span> data<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> data<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>The <code>params1</code> object passed into the scan function has quite an interesting syntax, it looks quite arbitrary. Let\'s go through the query parameters line-by-line and try to understand what\'s going on.</p>\n<p><strong>TableName</strong> is obviously the name of the table we would like to scan in.</p>\n<p><strong>ProjectionExpression</strong> is the comma separated list of properties we would like the returned matching items to contain. If we only had "#temperature" in here, the response object would only contain a list of temperature values. Humidity and datetime would be missing.</p>\n<p>Also note the use of the # characters before the property names. This is essentially a substitution name that you can look up in the <strong>ExpressionAttributesNames</strong> object and it\'s necessary to be used as some names can be reserved words and would cause issues, datetime is one of them.</p>\n<p>The <strong>FilterExpression</strong> is where we actually define the query. The attribute value that we are comparing to (:now) will also need to be substituted to avoid reserved word conflicts. The lookup table for these can be found in the <strong>ExpressionAttributeValues</strong> object.</p>\n<p>Let\'s see another example where we want to return entries with temperature values over 21.5 degrees:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> params2 <span class="token operator">=</span> <span class="token punctuation">{</span>\n    TableName<span class="token punctuation">:</span> <span class="token string">"temp-data"</span><span class="token punctuation">,</span>\n    ProjectionExpression<span class="token punctuation">:</span> <span class="token string">"#datetime, #temperature, #humidity"</span><span class="token punctuation">,</span>\n    FilterExpression<span class="token punctuation">:</span> <span class="token string">"#temperature > :temp"</span><span class="token punctuation">,</span>\n    ExpressionAttributeNames<span class="token punctuation">:</span><span class="token punctuation">{</span>\n        <span class="token string">"#temperature"</span><span class="token punctuation">:</span> <span class="token string">"temperature"</span><span class="token punctuation">,</span>\n        <span class="token string">"#datetime"</span><span class="token punctuation">:</span> <span class="token string">"datetime"</span><span class="token punctuation">,</span>\n        <span class="token string">"#humidity"</span><span class="token punctuation">:</span> <span class="token string">"humidity"</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    ExpressionAttributeValues<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        <span class="token string">":temp"</span><span class="token punctuation">:</span> <span class="token number">21.5</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>And here is one final example that will return entries with humidity values between 52 and 53:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> params3 <span class="token operator">=</span> <span class="token punctuation">{</span>\n    TableName<span class="token punctuation">:</span> <span class="token string">"temp-data"</span><span class="token punctuation">,</span>\n    ProjectionExpression<span class="token punctuation">:</span> <span class="token string">"#datetime, #temperature, #humidity"</span><span class="token punctuation">,</span>\n    FilterExpression<span class="token punctuation">:</span> <span class="token string">"#humidity between :hummin and :hummax"</span><span class="token punctuation">,</span>\n    ExpressionAttributeNames<span class="token punctuation">:</span><span class="token punctuation">{</span>\n        <span class="token string">"#temperature"</span><span class="token punctuation">:</span> <span class="token string">"temperature"</span><span class="token punctuation">,</span>\n        <span class="token string">"#datetime"</span><span class="token punctuation">:</span> <span class="token string">"datetime"</span><span class="token punctuation">,</span>\n        <span class="token string">"#humidity"</span><span class="token punctuation">:</span> <span class="token string">"humidity"</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    ExpressionAttributeValues<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        <span class="token string">":hummin"</span><span class="token punctuation">:</span> <span class="token number">52</span><span class="token punctuation">,</span>\n        <span class="token string">":hummax"</span><span class="token punctuation">:</span> <span class="token number">53</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<h3 id="final-thoughts"><a href="#final-thoughts" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Final thoughts</h3>\n<p>I hope all this was exciting. I know we have covered a lot, but remember that now you are completely set up to work with Amazon Web Service and ready to use all the other services they offer. This is definitely something we will discover in the future, including setting up automatic notifications, triggering cloud functions and discovering AWS IoT Core to control electronic devices remotely.</p>',
timeToRead:10,excerpt:"This is the second post in a series about logging sensor data from an Arduino with the help of Node.js and JavaScript. In  part one of the…",frontmatter:{title:"Arduino Data Logger 2, save to AWS DynamoDB with Node.js and JavaScript",cover:"http://www.webondevices.com/posts/2018/dht22-data-logging.jpg",date:"17/04/2018",category:"moar",tags:["arduino","javascript"]},fields:{slug:"/arduino-data-logger-2-save-to-aws-dynamo-db-with-node-js-and-java-script"}}},pathContext:{slug:"/arduino-data-logger-2-save-to-aws-dynamo-db-with-node-js-and-java-script"}}}});
//# sourceMappingURL=path---arduino-data-logger-dynamosb-aws-nodejs-javascript-e7d5fa037f0588feefe2.js.map