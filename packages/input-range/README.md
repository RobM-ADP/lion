# Input range

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`ing-input-range` component is based on the generic text input field.
Its purpose is to provide a way for users to select one value from a range of values.

## Features

- based on [lion-input](../input)
- makes use of range [validators](https://gitlab.ing.net/TheGuideComponents/ing-web/packages/validate/docs/DefaultValidators.md) with corresponding error messages in different languages

## How to use

### Installation

```sh
npm i --save @lion/input-range
```

```js
import '@lion/input-range/ing-input-range.js';
```

### Example

```html
<lion-input-range name="mySelectedRange"></lion-input-range>
```
