# Timer Component

Renders dynamic timer in the element. Behavior can be chnaged with configuration parameters.

## Directives

- **lpTimer**. Render a timer.

### Attributes

lpTimer directive looks for next configuration attributes.

- **millis**. Number of milliseconds to countdown.
- **delay-start**. Number of milliseconds to wait before starting.
- **autostart**. Whether countdown should start automatically (attribute is present) or not (no autostart attribute).
- **on-finish**. {Function} Callback function to be invoked when countdown is finishes.
- **on-tick**. {Function} Callback called on every animation tick.

## Events

Directive subscubes to several events that allows to control progress bar behavior.

- **timer-run**. Start timer. Makes sense if autostart is not used.
- **timer-pause**. Pause timer.
- **timer-resume**. Resume timer again.
- **timer-reset**. Set time to the beginning.
