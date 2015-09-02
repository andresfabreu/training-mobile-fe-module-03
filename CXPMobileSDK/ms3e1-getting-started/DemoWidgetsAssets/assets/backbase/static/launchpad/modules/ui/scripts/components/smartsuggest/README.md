# Smartsuggest Component

Component provides services for autocomplete functionality for searching and selecting terms from the predefined set of data. Supports several predefined types of data.

## Services

- **SmartSuggestEngine**. Defines types of auto completion data and main suggestion engine.
- **SmartSuggestFormatter**. Formatting autosuggestion results depending on the data item type.

- **SmartSuggestConfig**. Config data and helpers methods.
- **SmartSuggestEngineBuiltInSuggesters**. Built in suggesters (extendable by *addSuggestFunction* method).
- **SmartSuggestEngineUtil**. Various suggesting utility functions.
- **SmartSuggestEngineUtilDatesAdvanced**. Extends date suggestions abilities (added search by month name)

### Types

- **DATE**. Rendering of date template.
- **AMOUNT** Rendering of money amount template.
- **ACCOUNT** Rendering of account template.
- **CONTACT** Rendering of contact template.
- **CATEGORY** Rendering of category template.
- **GENERAL** Rendering of general template.
- **TITLE** Rendering of title template.

### Tips

- single number input works for dates suggests, but only for current month. If you want to search by month, you should input month's name (first 3 letters at least) and suggester will return suggests for current and previous year.