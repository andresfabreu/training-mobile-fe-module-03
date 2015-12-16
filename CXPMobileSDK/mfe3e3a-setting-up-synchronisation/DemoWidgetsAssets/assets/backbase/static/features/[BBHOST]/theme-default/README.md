# Launchpad Default Theme

Launchpad comes with a default theme, called "theme-default", which is an extension of the base theme.

## Creating a Custom Theme

To make a custom theme, you can start by forking the theme-default repository. If you don't have
access to the git repository, you can usually find the theme-default in your project in
`statics/collection/bower_components/theme-default`.

Rename the folder from theme-default to the name of your theme, and update `bower.json`, `package.json`,
`model.xml`, and `info.json` with your theme name.

## Installing

The theme depends on bower and npm. If you don't have access to the git repositories (for bower)
then you will need to use the [`bb-bower-resolver`](https://www.npmjs.com/package/bb-bower-resolver)
to run the `bower install` successfully.

**Install Dependencies:**

```
bower install
npm install
```

## Building

```
npm run build
```

The theme is built with the [`bb-cli`](https://www.npmjs.com/package/bb-cli)
`bb theme-build` command.

So if you have the bb-cli installed you can also build using `bb-cli theme-build`:

```
bb theme-build [--sourcemaps] [--base-path] [--edition].
```

## Developing

Until a `--watch` option is added to the `bb theme-build` command, you need to rebuild the theme
after each change to the less files.

You shouild use the `bb import-item --watch` command to automatically import your theme into your
portal while developing.

## File Structure

The required folder structure of the theme is as follows:

```
  - bower.json
  - {path/to}/styles/{entry-file}
  - {path/to}/dist/styles/base.css
```

The rest is up to you.

The CLI tool will examine your bower.json and find the "main" section. In *theme-default* there is
a single "main" file listed (`styles/base.less`), but if you want to have multiple themes then
just create an array for your "main" and the CLI tool will build each one.

 > It is **required** that your less file is in a directory called **`styles`**.

 > This is because the Launchpad Page template has a hard-coded path to `{theme}/dist/styles/base.css`.

### Output Files

The CLI will create a `dist` folder at one directory back from the `styles` directory, and the
resulting CSS will be in `dist/styles/base.css`.

If you have multiple themes, for example `theme1/styles/base.less`, and `theme2/styles/base.less`,
then the CSS will be generated at `theme1/dist/styles/base.css`, and `theme2/styles/base.css`. This
is so that you can set a preference for your theme to `my-themes/theme1` and your CSS will be found
at `features/[BBHOST]/my-themes/theme1/dist/style/base.css`.

## Adding to Portal

The theme can be imported to your portal as a CXP Shared Feature. The recommended way to add the
theme to your portal is to add it to the project in `statics/collection/themes/<theme-name>`, then
update the `statics/collection/bower.json`:

```json
    ...
    "dependencies": {
      ...
      "<theme-name>": "./themes/<theme-name>"
      ...
    }
```

## Important Notes

### Source Maps

You can turn sourcemaps on by building with the sourcemaps flag.

`bb theme-build --sourcemaps`

### Edition

The base theme exposes 2 editions: **retail** and **universal**. The retail edition is required
for the **retail** collection of Launchpad widgets.

To compile with the retail edition, your theme should specify the edition as "retail" in the
base.less.

You can also specify this at build time, with `--edition` flag, which will override the variable
from base.less.

### Base-Path

There is another variable which is required in your `base.less` for `base-path`.

You can also specify this at build time, with `--base-path` flag.

The `base-path` is:

 > The relative path from the **CSS** file to the **base theme**.

The base theme will typically be installed into CXP in
`$(contextRoot)/static/features/[BBHOST]/theme` and your theme will be installed into
`$(contextRoot)/static/features/[BBHOST]/{theme-name}`. Therefore the relative path from
`{theme-name}/dist/styles/base.css` is `../../../theme`.

If your theme has a deeper folder structure, then you need to adjust the base-path variable
accordingly.

This is because the CSS will have links to assets that are stored in the base-theme, which need to
be resolved relative the location of the CSS file.
