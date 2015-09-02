# Launchpad Front End configuration files

# Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| config                | 1.0.0             | Launchpad        |


## Includes

- requirejs.conf.js



## Using reguirejs.conf

Using require.js for local development

- Install a new module

```javascript
paths: {
    ....
        'module-name': path + '/module-ng-sample/'+ dist +'scripts',
    ...
}

packages: [
    ...
    module-name
    ...
 ]
```

- Check the production module from the **dist/** folders 

```
var USEMIN = true;
```

- Make sure you add the dist folder to repo
