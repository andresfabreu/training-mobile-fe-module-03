# module-polyfills
A polyfill (or polyfiller) is downloadable code which provides facilities that are not built into a web browser. It implements technology that a developer expects the browser to provide natively, providing a more uniform API landscape.

# Includes

- [es5-shim](https://github.com/es-shims/es5-shim) 4.1.10
- [html5shiv](https://github.com/afarkas/html5shiv) 3.7.3
- [html5shiv](https://github.com/afarkas/html5shiv) 3.7.3
- [jquery](https://github.com/jquery/jquery/tree/1.11.3) 1.11.3
- [angularjs-custom](https://github.com/fergaldoyle/angular.js-ie8-builds) 1.4.0
- [JSON 3](https://github.com/bestiejs/json3) 3.3.2
- [custom angularjs elements](https://code.angularjs.org/1.2.27/docs/guide/ie)

```
'lp-template',
'lp-accounts-select',
'lp-bar-chart',
'lp-donut-chart',
'lp-card',
'lp-line-chart',
'lp-donut-chart',
'lp-color-picker',
'lp-payee-account-select',

// ng custom elements
'ng-pluralize',
'ng-view',
'ng-inject'
```
# HOWTO
```html
<!--[if lt IE 9]>
    <script src="<path-to-feature>/html5shiv/dist/html5shiv.js"></script>
    <script src="<path-to-feature>/es5-shim/es5-shim.min.js"></script>
    <script src="<path-to-feature>/es5-shim/es5-sham.min.js"></script>
<![endif]-->
```
or use from `scripts` folder inside the repo:

```html
<!--[if lt IE 8]>
    <script src="<path-to-feature>/scripts/html5shiv/dist/html5shiv.js"></script>
    <script src="<path-to-feature>/scripts/es5-shim/es5-shim.min.js"></script>
    <script src="<path-to-feature>/scripts/es5-shim/es5-sham.min.js"></script>
<![endif]-->
```
## IE8 support and angularjs 1.4.x.
Add the following tags and polyfill in the **&lt;head&gt;** page, remember: ** THE ORDER IS IMPORTANT **

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
```
Use conditional comments for IE to load script tags

```html
....
<!--[if gte IE 9]>-->
    <script src="<features-path>/jquery/dist/jquery.min.js"></script>
    <script src="<features-path>/angular/angular.min.js"></script>
<!--<![endif]-->

<!--[if IE 8]>
    <script src="<features-path>/module-polyfills/scripts/html5shiv/dist/html5shiv.js"></script>
    <script src="<features-path>/module-polyfills/scripts/es5-shim/es5-shim.min.js"></script>
    <script src="<features-path>/module-polyfills/scripts/es5-shim/es5-sham.min.js"></script>

    <script src="<features-path>/module-polyfills/scripts/jquery/dist/jquery.min.js"></script>
    <script src="<features-path>/module-polyfills/scripts/angularjs-ie8-build/dist/angular.min.js"></script>
    <script src="<features-path>/module-polyfills/scripts/ng-custom-elements.js"></script>

    <script type="text/javascript">
        document.createElement('my-custom-element');
    </script>
<![endif]-->

<!-- add requirejs and config after the shims -->
<script src="<features-path>/requirejs/require.js"></script>
<script src="<features-path>/config/requirejs.conf.js"></script>
...
```

- Things to look be watch for in IE8 :

When using Promises methods **catch** or **finally** in IE8 use bracket notation instead of dot notation. IE8 does not like dot notation with these reserved words.

```javascript
// no
promise.catch(function(){});

// yes
promise['catch'](function(){});
```

- Other stuff

Custom elements, you need to make IE8 aware of them first, e.g. document.createElement(&#39;ng-view&#39;);
Use ng-style instead of style=&quot;{{ someCss }}&quot;
Check any additional angular or third party modules you are using for reserved words described above. If you find any, use a search and replace to change from dot notation to bracket notation

**NOTE**
** Can&#39;t guarantee that everything will work, but at least is a decent way to keep our code up to date with evergreen browsers.**

# Resources

- https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills

