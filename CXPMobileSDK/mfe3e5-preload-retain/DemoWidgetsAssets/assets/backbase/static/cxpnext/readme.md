##CXP Next - Web environment.

An environment that mimics the webView on our BB CXP Mobile SDK;

 - Same template structure as the one used to load widgets in the webView;
 - Allows simple traditional development flow: edit,save,reload;
 - Add and helper navigation to load pages/children;
 - PubSub to navigate implemented by using the links model, including auto-magic behaviourMap creation based on link.name value;

###### Run it from a standalone web server or from your CXP "statics/"  
[http-server](https://www.npmjs.com/package/http-server) is a nice one if you don't have a favourite.


###### Enable CORS in maven

Useful if you run this from a different domain, no need for proxies.
Add this to your server POM file:

 		<!-- CORS -->
        <dependency>
            <groupId>com.thetransactioncompany</groupId>
            <artifactId>cors-filter</artifactId>
            <version>1.8</version>
        </dependency>

###### Guarantee: None!

This is concept the can be used as a tool for development cycle using our Mobile SDK.
The concept consists on a "run everywhere environment", widgets should run seamlessly across all browser enabled devices.

- Run at your own risk;
- Figure it out, the code is small and simple;
- Running it and developing on webkit, no minimum guarantee on other platforms(for now);
- Ask a question and I will reply;




        