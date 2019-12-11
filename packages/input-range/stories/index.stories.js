import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';

import '../lion-input-range.js';

const rangeDemoStyle = css`
  .demo-range {
    max-width: 400px;
  }
`;

storiesOf('Forms | Input Range', module)
  .add(
    'Default',
    () => html`
      <style>
        ${rangeDemoStyle}
      </style>

      <lion-input-range
        class="demo-range"
        min="200"
        max="500"
        modelValue="300"
        label="Input range"
      ></lion-input-range>
    `,
  )
  .add(
    'Help text',
    () => html`
      <style>
        ${rangeDemoStyle}
      </style>

      <lion-input-range
        class="demo-range"
        min="200"
        max="500"
        modelValue="300"
        label="Input range"
        help-text="A help text can show additional hints"
      ></lion-input-range>
    `,
  )
  .add(
    'Units',
    () => html`
      <style>
        ${rangeDemoStyle}
      </style>

      <lion-input-range
        class="demo-range"
        min="0"
        max="100"
        modelValue="50"
        unit="%"
        label="Input range"
      ></lion-input-range>
    `,
  )
  .add(
    'With steps',
    () => html`
      <style>
        ${rangeDemoStyle}
      </style>

      <lion-input-range
        class="demo-range"
        min="200"
        max="500"
        step="50"
        modelValue="300"
        label="Input range"
        help-text="This slider uses increments of 50"
      ></lion-input-range>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <style>
        ${rangeDemoStyle}
      </style>

      <lion-input-range
        class="demo-range"
        min="200"
        max="500"
        modelValue="300"
        disabled
        label="Input range"
      ></lion-input-range>
    `,
  );
