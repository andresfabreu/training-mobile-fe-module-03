# List Component

The idea of the list component is to provide mostly wrapping around grid formatting, such as
that provided by flexbox or bootstrap grid. Currently it's using twitter bootstrap grid, but
this will provide us with a flexible way to switch to a different grid implementation later.

The other idea is to provide a set of directives that can be used to provide additional behaviour
or presentation. For example a "lp-item-toggle" directive could add the behaviour for
show/hiding a detail view for each item.

## References

* http://ui-grid.info/
* http://bazalt-cms.com/ng-table/
* http://ionicframework.com/docs/api/directive/ionList/
* https://github.com/ptb/flexgrid
* http://getbootstrap.com/css/#grid

## Directives

- **lpList**. Wrapes into HTML structure that represents a grid.
- **lpItem**. Wrapes into HTML structure that represents a row.
- **lpItemCell**. Wrapes into HTML structure that represents a row cell.
