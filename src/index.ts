import type { SchemaOptions } from "./types/schema";
import type { Htmlparser2TreeAdapterMap } from "parse5-htmlparser2-tree-adapter";

import { parseFragment, serialize } from "parse5";
import { adapter } from "parse5-htmlparser2-tree-adapter";

import { handleTagChildrenError } from "./lib/handlers/direct";
import { walkNode } from "./lib/walker";

/**
 * Enforces a schema on HTML content by removing or modifying elements and attributes
 * that do not conform to the provided rules.
 *
 * This function parses the input HTML, applies schema rules based on the provided options,
 * and returns a conformed version of the HTML. It handles tag validation, attribute filtering,
 * nesting limits, and error handling according to the configuration.
 *
 * @param html - The HTML string to enforce the schema on
 * @param options - Configuration options that define the schema rules and behavior
 * @returns The conformed HTML string
 *
 * @example
 * ```typescript
 * import { enforceHtml } from './index';
 * import type { SchemaOptions } from './types/schema';
 *
 * const options: SchemaOptions = {
 *   preserveComments: false,
 *   errorHandling: {
 *     tag: "discardElement",
 *     attribute: "discardAttribute"
 *   },
 *   tags: {
 *     "div": {
 *       attributes: {
 *         "class": {
 *           mode: "set",
 *           delimiter: " ",
 *           values: ["container", "row", "col"],
 *           maxLength: 100
 *         },
 *         "id": {
 *           mode: "simple",
 *           value: /^[a-zA-Z][a-zA-Z0-9-_]*$/,
 *           required: false
 *         }
 *       },
 *       limits: {
 *         children: 20,
 *         nesting: 5
 *       }
 *     },
 *     "a": {
 *       attributes: {
 *         "href": {
 *           mode: "simple",
 *           value: /^https?:\/\//,
 *           required: true
 *         }
 *       }
 *     }
 *   },
 *   topLevelLimits: {
 *     children: 100,
 *     nesting: 10
 *   }
 * };
 *
 * const html = '<div class="container"><a href="javascript:alert(1)">Click me</a></div>';
 * const conformed = enforceHtml(html, options);
 * console.log(conformed); // '<div class="container"></div>'
 * ```
 *
 * @example
 * ```typescript
 * // Basic usage with minimal configuration
 * const basicOptions: SchemaOptions = {
 *   tags: {
 *     "p": {
 *       attributes: {
 *         "class": {
 *           mode: "simple",
 *           value: "*" // Allow any class value
 *         }
 *       }
 *     }
 *   }
 * };
 *
 * const html = '<p class="text-center">Hello World</p><script>alert("xss")</script>';
 * const conformed = enforceHtml(html, basicOptions);
 * console.log(conformed); // '<p class="text-center">Hello World</p>'
 * ```
 *
 * @throws {Error} May throw errors if error handling is configured to "throwError" mode
 * and validation failures occur during processing.
 */
export function enforceHtml(html: string, options: SchemaOptions): string {
  if (html === "") {
    return "";
  }

  const frag: Htmlparser2TreeAdapterMap["documentFragment"] = parseFragment(
    html,
    { treeAdapter: adapter },
  );

  if (
    options.topLevelLimits?.children &&
    frag.children.length > options.topLevelLimits.children
  ) {
    if (
      !handleTagChildrenError(
        frag,
        options.topLevelLimits.children,
        options.errorHandling?.tagChildren,
      )
    ) {
      return "";
    }
  }

  let child = frag.firstChild;
  while (child) {
    const next = child.nextSibling;
    walkNode(child, options, { rootNesting: 0, tagNesting: [] });
    child = next;
  }

  return serialize(frag, { treeAdapter: adapter });
}
