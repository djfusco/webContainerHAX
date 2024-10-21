export const files = {
  "index.js": {
    "file": {
      "contents": "const haxcms = require('@haxtheweb/haxcms-nodejs');\nhaxcms.startServer();"
    }
  },
  "package.json": {
    "file": {
      "contents": "{\n    \"name\": \"haxcms-stackblitz\",\n    \"version\": \"1.0.0\",\n    \"description\": \"HAXcms StackBlitz Demo\",\n    \"main\": \"index.js\",\n    \"scripts\": {\n      \"start\": \"npx @haxtheweb/haxcms-nodejs\"\n    },\n    \"dependencies\": {\n      \"@haxtheweb/haxcms-nodejs\": \"latest\"\n    }\n  }\n  "
    }
  }
}