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

# github pages

1. From scratch, first add a `subtree`:

        ```shell
        $ git add dist && git commit -m "Initial dist subtree commit"           
        ```

2. Build: `npm run build`, this will create/update `dist/` folder.

3. Push to `pg-pages` branch:

        ```shell
        $ git subtree push --prefix dist origin gh-pages
        ```
4. Make sure to use `./bundle.js` in `index.html`. Otherwise, it won't
   find `bundle.js`. Strange.

5. Go to `https://fengxia41103.github.io/spa-dashboard/`. Enjoy.
