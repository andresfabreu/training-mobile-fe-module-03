#Theme

## Building

The CSS built for the theme should be committed as well. To rebuild the theme CSS run:

```
npm install && npm run build
```

## FAQ

 - If you get permission errors when trying to install the node modules, it is possible that some files in your npm directory are owned by root (often caused by doing a sudo npm install).
   See: http://stackoverflow.com/questions/16151018/npm-throws-error-without-sudo

   You can fix this (on \*nix) with this command:

   `sudo chown -R $(whoami) ~/.npm`
