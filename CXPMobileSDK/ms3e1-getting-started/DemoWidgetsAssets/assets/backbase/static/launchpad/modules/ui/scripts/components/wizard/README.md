# Wizard Component

Display steps with related views.


## Usage

It is possible to expose wizard methods with two ways:

### 1. With configuration object:

By passing an object from the controller which will be extended with following methods:

* nextStep
* getActiveStep
* previousStep
* goToStep

```html
<div lp-wizard="myCtrl.wizard" title="Title">
    <div lp-wizard-step="lp-wizard-step" heading="Step1">
        ...
    </div>
    <div lp-wizard-step="lp-wizard-step" heading="Step2">
        ...
    </div>
</div>
```


### 2. With attributes:

Attribute value will be extended with appropriate wizard method

```html
<div lp-wizard="lp-wizard" title="Title"
	next-step="myCtrl.nextStep"
	get-active-step="myCtrl.getActiveStep"
	previous-step="myCtrl.previousStep"
	go-to-step="myCtrl.goToStep">
	<div lp-wizard-step="lp-wizard-step" heading="Step1">
		...
	</div>
	<div lp-wizard-step="lp-wizard-step" heading="Step2">
		...
	</div>
</div>
```

