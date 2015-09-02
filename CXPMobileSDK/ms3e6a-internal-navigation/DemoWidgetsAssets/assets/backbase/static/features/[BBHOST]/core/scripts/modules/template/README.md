#template

Launchpad Template Module

##Table of content

- [Providers](#providers)
    - [lpCoreTemplate](#lpCoreTemplate)
- [Directives](#directives)
    - [lpTemplate](#lpTemplate)

##Content

###Providers

####<a name="lpCoreTemplate"></a>lpCoreTemplate


Helper service used by lpTemplate directive.

######Methods

#####`config(options) :Object`

Set provider options.

Params:

| Param| Type| Description|
| :----| :----| :----|
| options| Object| Default options for lpCoreTemplate service.|


<br>

###Directives

####<a name="lpTemplate"></a>lpTemplate


Wrapper around [ngInclude][1] directive. Fetches, compiles and includes an external HTML fragment.

##### Attributes

###### src

lpTemplate uses `src` attribute as template path. The value of the attribute should be valid Angular expression. For static paths string literal should be used.

If `src` is not provided `lp-template` attribute is used.

Below two examples using string literals are equivalent:

```
<lp-template src="'templates/accounts.html'"></lp-template>
<div lp-template="'template/accounts.html'"></div>
```

Template path could be configured in controller, in this case quotes are not needed:

```
<lp-template src="templates.iban"></lp-template>
```

###### name

`lpTemplate` can also accept optional argument `name`. If provided, it is used for identifing template for customization with template path property. See next section for details.

If `name` attribute is missing (in most cases) then template key is extracted from resolved template path as substring between last `/` and before `.html` strings. For example, if template path (result of evaluation of the expression for src) is `templates/accounts-header.html` then corresponding template key is `accounts-header`.

##### Template keys

`lpTemplate` directive uses unique identifiers in order to provide a way to overwrite template path with custom preference. Special proprty name must conform the following format:

```
widgetTemplate_{template key}
```

Every widget that uses `lpTemplate` and allows template cutomization should describe template keys it provides.

In above example with accounts-header key corresponding property would be `widgetTemplate_accounts-header`.

[1]: https://docs.angularjs.org/api/ng/directive/ngInclude


<br>

