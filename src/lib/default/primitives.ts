import type { TagAttributeValueRule } from "@/src/types/rules";

import {
  floatRegex,
  integerRegex,
  mimeTypeRegex,
  negativeFloatRegex,
  negativeIntegerRegex,
  nonNegativeFloatRegex,
  nonNegativeIntegerRegex,
  positiveFloatRegex,
  positiveIntegerRegex,
} from "./regexes";

// -----------------------------------------------------------------------------
// Boolean attributes
// -----------------------------------------------------------------------------

export const defaultBooleanAttribute: TagAttributeValueRule = {
  mode: "simple",
  value: true,
};

export const defaultNonBooleanAttribute: TagAttributeValueRule = {
  mode: "simple",
  value: false,
};

// -----------------------------------------------------------------------------
// Set attributes
// -----------------------------------------------------------------------------

export const defaultSetAttribute: TagAttributeValueRule = {
  delimiter: " ",
  mode: "set",
  values: "*",
};

// -----------------------------------------------------------------------------
// Integer attributes
// -----------------------------------------------------------------------------

export const defaultIntegerAttribute: TagAttributeValueRule = {
  mode: "simple",
  value: integerRegex,
};

export const defaultPositiveIntegerAttribute: TagAttributeValueRule = {
  mode: "simple",
  value: positiveIntegerRegex,
};

export const defaultNonNegativeIntegerAttribute: TagAttributeValueRule = {
  mode: "simple",
  value: nonNegativeIntegerRegex,
};

export const defaultNegativeIntegerAttribute: TagAttributeValueRule = {
  mode: "simple",
  value: negativeIntegerRegex,
};

// -----------------------------------------------------------------------------
// Float attributes
// -----------------------------------------------------------------------------

export const defaultFloatAttribute: TagAttributeValueRule = {
  mode: "simple",
  value: floatRegex,
};

export const defaultPositiveFloatAttribute: TagAttributeValueRule = {
  mode: "simple",
  value: positiveFloatRegex,
};

export const defaultNonNegativeFloatAttribute: TagAttributeValueRule = {
  mode: "simple",
  value: nonNegativeFloatRegex,
};

export const defaultNegativeFloatAttribute: TagAttributeValueRule = {
  mode: "simple",
  value: negativeFloatRegex,
};

// -----------------------------------------------------------------------------
// String attributes
// -----------------------------------------------------------------------------

export const defaultDateTimeAttribute: TagAttributeValueRule = {
  mode: "simple",
  value: (value) => !Number.isNaN(Date.parse(value)),
};

export const defaultMimeTypeAttribute: TagAttributeValueRule = {
  mode: "simple",
  value: mimeTypeRegex,
};
