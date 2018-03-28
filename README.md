# Burin
> hands-free cli tool
## Usage
```
npm install burin -g
```
cd to your project and create .burin directory then

```
burin MODULE_NAME
```

for example `burin Production`, the generated files are determined by your templates in `.burin`
there's an example `.burin` fold
```
.
├── context.js
└── template
    ├── containers
    │   └── MODULE_NAME
    │       ├── index.js.njk
    │       └── style
    │           └── index.scss.njk
    └── redux
        └── MODULE_NAME
            └── index.js.njk
```
note that all templates end with `.njk`

## TODO
- [ ] add eslint
- [ ] add husky
- [ ] need tests
