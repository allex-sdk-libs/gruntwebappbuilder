## Fields of protoboard.json that affect the build process

### actualtarget
Array of filesystem path steps to reach the actual target, measured from the protoboard.json location
For example,
```json
"actualtarget": ["dist", "release", "allex_nggridwebcomponent.js"]
```

### additionaltargets
Object that can have `'css'` and/or `'js'` properties.
Each of the properties is an Array of Arrays of filesystem path steps to reach the additional target, measured from the protoboard.json location
For example,
```json
"additionaltargets": {
  "js": [
    ["dist", "lib.js"]
  ],
  "css": [
    ["dist", "css", "mystyle.css"]
  ]
}
```
