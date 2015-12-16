# Focus Component

Set of directives that brings simple element focus behavior. Set focus on element by its name or autofocus.

## Directives

- **lpFocusOn**. Use this directive to set up a listener on the arbitrary HTML element. Later this element can be focused with the help of `lpFocus` service by the key provided.

- **lpFocusId**. Similar as `lpFocusOn` but the name of the event being subscribed to is fixed string "lpFocusId".

- **autofocus**. If autofocus attribute is not supported natively, this custom directive pollyfills it.

## Services

- **lpFocus**. Service is used to focus element which uses `lpFocusOn` directive. Remember to inject `lpFocus` service in controller: `lpFocus('lp.login-multifactor.errors');`
