# Navigation Icons Component

Directive renders glyphicon icons in the element it is applied to.

## Directives

- **navIcon**. Directive renders glyphicon icons besed on the resolved value of the `nav-icon` or `icon` attributes defined on the element. Since both attributes renders the same result, it's better is to avoid redundant `icon` attribute and use `nav-icon` itself:

Both attributes can accept any glyphicon icon name *without* "glyphicon" prefix.

For backward compatibility old "arrow-left" predefined value can be used for glyphicon-chevron-left icon, so `nav-icon="'arrow-left'"` is the same as `nav-icon="'chevron-left'"` (and the same as `nav-icon icon="chevron-left"`).

