# Text Input Component

Directive builds an input field wrapped form-group container with corresponding label.

## Directives

- **lpTextInput**. Builds an input type text.
- **lpPasswordInput**. Builds an input type password.

## Attributes

- **ng-model**. The model that will be bind to input field.
- **ng-disabled**. {Expression} Expression which determines if inout should be disabled or not.
- **focus-id**. {String} Id to be used in `focusOn` service to focus this input field. See `focus` component for details.
- **on-change**. {Function} Function to be invoked on onchange event.
