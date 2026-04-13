# domschema

Declarative schema-based HTML attribute validation. Define which tags, attributes, and values are allowed and enforce them.

## Not a sanitizer replacement

domschema is **not** a sanitizer and does not aim to replace tools like [DOMPurify](https://github.com/cure53/DOMPurify). DOMPurify is excellent at removing malicious content and protecting against XSS. domschema solves a different problem: **structural conformance**. Use them together, DOMPurify to sanitize, domschema to enforce your schema.

## Features

All rules are defined per tag, giving you fine-grained control over exactly what each element is allowed to contain and how violations are handled.

### Tag Allowlisting

Only the tags you explicitly define are permitted. Everything else is handled according to your error strategy: silently discarded, unwrapped (children kept, tag removed), or thrown as an error.

```typescript
const options: SchemaOptions = {
  errorHandling: { tag: "discardElement" },
  tags: {
    div: { ... },
    p: { ... },
    a: { ... },
  },
};
```

### Attribute Allowlisting

Each tag defines exactly which attributes it accepts. Unlisted attributes are discarded, and a `"*"` wildcard rule can serve as a catch-all fallback for any attribute not explicitly named.

```typescript
tags: {
  div: {
    attributes: {
      class: { mode: "simple", value: "*" },
      id: { mode: "simple", value: /^[a-zA-Z][a-zA-Z0-9-_]*$/ },
      "*": { mode: "simple", value: "*", maxLength: 100 }, // catch-all
    },
  },
}
```

### Attribute Value Validation

Three validation modes cover every attribute shape:

- **`simple`**: validates a single value against a string, regex, array of allowed values, boolean flag, or custom function
- **`set`**: validates delimiter-separated multi-values (e.g. `class="btn btn-primary"`)
- **`record`**: validates key-value pair collections (e.g. `data-config="id:1;theme:dark"`)

```typescript
// Simple: one of a fixed list
{ mode: "simple", value: ["left", "center", "right"] }

// Simple: regex
{ mode: "simple", value: /^https?:\/\// }

// Simple: custom function
{ mode: "simple", value: (v) => !Number.isNaN(Date.parse(v)) }

// Set: space-separated CSS classes from an allowlist
{ mode: "set", delimiter: " ", values: ["btn", "btn-primary", "btn-large"] }

// Record: structured key-value pairs
{ mode: "record", entrySeparator: ";", keyValueSeparator: ":", values: { id: /^\d+$/, theme: ["light", "dark"] } }
```

### Default Values & Required Attributes

Attributes can be marked as required. When missing or invalid, a `defaultValue` can be applied instead of discarding the element outright.

```typescript
{
  mode: "simple",
  value: /^https?:\/\//,
  required: true,
  defaultValue: "https://example.com",
}
```

### Value Length Limits

Cap attribute values to a maximum character length. Oversized values can be trimmed or treated as errors.

```typescript
{ mode: "simple", value: "*", maxLength: 200 }
```

### Collection Size Limits

For `set` and `record` attributes, limit how many entries are allowed. Excess entries can be dropped or treated as errors.

```typescript
{ mode: "set", delimiter: " ", values: /^\S+$/, maxEntries: 5 }
```

### Tag Nesting Limits

Prevent elements from nesting beyond a configured depth. Useful for preventing deeply nested structures that could impact rendering or processing performance.

```typescript
tags: {
  div: {
    limits: { nesting: 4 },
  },
}
```

### Children Limits

Limit how many direct children an element may have. Excess children can be trimmed from the front, trimmed from the back, or cause the element to be discarded.

```typescript
tags: {
  ul: {
    limits: { children: 20 },
  },
}
```

### Top-Level Document Limits

Apply children and nesting limits to the root of the fragment itself, independent of any specific tag rule.

```typescript
const options: SchemaOptions = {
  topLevelLimits: { children: 50, nesting: 10 },
};
```

### Flexible Error Handling

Every class of violation has its own configurable error handling mode. Mix and match strategies per error type.

| Error type                  | Available modes                                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Disallowed tag              | `discardElement`, `unwrapElement`, `throwError`                                                                 |
| Disallowed attribute        | `discardAttribute`, `discardElement`, `throwError`                                                              |
| Invalid attribute value     | `applyDefaultValue`, `discardAttribute`, `discardElement`, `throwError`                                         |
| Value too long              | `trimExcess`, `applyDefaultValue`, `discardAttribute`, `discardElement`, `throwError`                           |
| Too many collection entries | `dropExtra`, `applyDefaultValue`, `discardAttribute`, `discardElement`, `throwError`                            |
| Duplicate record keys       | `keepFirst`, `keepLast`, `dropDuplicates`, `keepDuplicates`, `discardAttribute`, `discardElement`, `throwError` |
| Too many children           | `discardFirsts`, `discardLasts`, `discardElement`, `throwError`                                                 |
| Nesting too deep            | `discardElement`, `throwError`                                                                                  |

### Comment Stripping

HTML comments are stripped by default. Pass `preserveComments: true` to retain them.

### Built-in Default Rules

domschema ships with ready-made rules for all standard HTML global attributes, shared attributes, and common value types (integers, floats, URLs, MIME types, BCP 47 language tags, dates, and more) so you don't have to write them from scratch.

```typescript
import { defaultGlobalAttributes, defaultOtherAttributes } from "domschema/defaults";

tags: {
  a: {
    attributes: {
      ...defaultGlobalAttributes,
      href: defaultOtherAttributes.url,
      target: defaultOtherAttributes.target,
      rel: defaultSharedAttributes.rel,
    },
  },
}
```

### URL Allowlisting

The built-in URL rule builder lets you restrict URLs to specific protocols and/or hosts, with optional support for relative paths.

```typescript
import { buildAllowedUrlRegex } from "domschema/utils/url";

// Only allow https links to your own domain, plus relative paths
const value = buildAllowedUrlRegex(["https"], ["example.com"], true);
```

## Installation

```bash
npm install domschema
```

## Quick Start

In this example, a `<div>` with an unknown `onclick` attribute and a `<p>` with disallowed class values are both cleaned up according to the schema.

```typescript
import { enforceHtml } from "domschema";

const html = `
  <div class="container wrapper" onclick="evil()">
    <p class="text-center text-danger">Hello</p>
    <a href="https://example.com" target="_blank" rel="noopener">Link</a>
  </div>
`;

const result = enforceHtml(html, {
  errorHandling: {
    tag: "discardElement",
    attribute: "discardAttribute",
    attributeSetValue: "dropValue",
  },
  tags: {
    div: {
      attributes: {
        // only "container" and "row" are allowed class values
        class: { mode: "set", delimiter: " ", values: ["container", "row"] },
      },
    },
    p: {
      attributes: {
        // only "text-center" and "text-muted" are allowed class values
        class: {
          mode: "set",
          delimiter: " ",
          values: ["text-center", "text-muted"],
        },
      },
    },
    a: {
      attributes: {
        href: { mode: "simple", value: /^https?:\/\// },
        target: { mode: "simple", value: ["_blank", "_self"] },
        rel: {
          mode: "set",
          delimiter: " ",
          values: ["noopener", "noreferrer", "nofollow"],
        },
      },
    },
  },
});

console.log(result);
// <div class="container">       onclick was discarded (no rule for it)
//   <p class="text-center">    "text-danger" was dropped (not in allowlist)
//   <a href="https://example.com" target="_blank" rel="noopener">Link</a>
// </div>
```
