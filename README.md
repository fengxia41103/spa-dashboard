This is a demo to build a SPA using ReactJS and YAML file as data
source. These YAML can be fetched from a server or a local file.

# development

1. Install [nvm][2]
2. Install node: `nvm install node`. As of writing, `node 9.4.0` works
   well.
3. Upgrade npm: `npm install --upgrade npm`
4. Install packages: `npm install`. Packages are listed in
   `package.json`.
5. Run dev server: `npm run dev`   

[2]: https://github.com/creationix/nvm

# build

Assuming a `remote folder` is being served by a web server such as
`nginx`:

1. Compile `bundle.js` build: `npm run build`
2. Switch to `dist` folder: `cd dist`
3. `rsync -azP dist <remote folder>
5. Verify on a browser.


