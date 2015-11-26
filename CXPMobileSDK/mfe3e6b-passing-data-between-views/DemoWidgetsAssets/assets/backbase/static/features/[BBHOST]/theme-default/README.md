# Launchpad Default Theme

The Launchpad Default theme is an example theme, which extends exactly the **[base
theme](https://stash.backbase.com/projects/LPM/repos/theme/browse)**.

You can see in the [bower.json](bower.json) that it's depending on the base Launchpad theme repo.

## Installing

```
bower install
npm install
```

## Building

```
npm run build
```

The theme is built with the [`bb-cli`](https://github.com/Backbase/bb-cli/tree/nightly) (nightly)
`bb theme-build` command.

So if you have the bb-cli nightly installed you can also build using `bb-cli`:

```
bb theme-build [--sourcemaps] [--base-path] [--edition].
```

## File Structure

The required folder structure is as follows:

```
  - bower.json
  - {path/to}/styles/{entry-file}
  - {path/to}/dist/styles/base.css
```

The rest is up to you.

The CLI tool will examine your bower.json and find the "main" section. In *this* theme there is
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

## Important Notes

### Source Maps

You can turn sourcemaps on by building with the sourcemaps flag.

`bb theme-build --sourcemaps`

### Edition

The base theme exposes 2 editions: **banking** and **universal**. The banking edition is required
for the **retail** collection of Launchpad widgets.

To compile with the banking edition, your theme should specify the edition as "banking" in the
base.less.

You can also specify this at build time, with `--edition` flag.

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
