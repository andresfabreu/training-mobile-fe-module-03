# Aria Component

Includes directives for ARIA functionality. At the moment only `lpAriaNumber`.

## Directives

- **lpAriaNumber**. Directive renders aria-hidden attribute on the element and inserts accessibility friendly tag after the element (`paymentOrder.accountDetails = 1231` is defined on scope).

```html
    <small class="text-muted" lp-aria-number="paymentOrder.accountDetails"></small>
```

Will produce two tags

```html
    <small class="text-muted" lp-aria-number="paymentOrder.accountDetails" aria-hidden="true">1231</small>
    <span class="sr-only">1 2 3 1</span>
```


