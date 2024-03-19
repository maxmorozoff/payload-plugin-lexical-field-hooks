# Payload Plugin Fix Lexical Hooks

A plugin for Payload that resolves issues with richtext-lexical field-level hooks

## Background

More info: [payloadcms/payload/discussions/4351](https://github.com/payloadcms/payload/discussions/4351)

### How to install a plugin

To install any plugin, simply add it to your payload.config() in the Plugin array.

```ts
import lexicalFieldHooks from '@maxmorozoff/payload-plugin-lexical-field-hooks';

export const config = buildConfig({
  plugins: [
    // You can pass options to the plugin
    lexicalFieldHooks({
		  enabled: true,
    }),
  ]
});
```
