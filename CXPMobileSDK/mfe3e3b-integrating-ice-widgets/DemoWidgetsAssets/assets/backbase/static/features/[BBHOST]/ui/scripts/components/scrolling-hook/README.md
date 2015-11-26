# Scrolling Hook

Directive attaches onscroll event to window, and toggles defined class on the element based on scroll top value.


## scrollingHook directive

```html
    <div class="navbar navbar-inverse"
         ng-class="{'navbar-fixed-top': navSticky}"
         scrolling-hook
         scroll-class="scrollSetting"
         scroll-distance="100"
         hook-callback="publishOffsetCorrection" role="navigation" element-resize="updateSize(data)">...</div>
```

## Attributes

- **scroll-class** {String} Class name to be added to element when scroll top passes distance parameted.
- **scroll-distance** {Number} Scroll top boundary value after which scroll-class is added/removed.
- **scroll-callback** {Function} Function defined on the controller scope. Called after every (debounced) onscroll event is detected. Accepts element jqLite/jQuery object.
