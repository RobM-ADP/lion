import { storiesOf, html } from '@open-wc/demoing-storybook';

import '../lion-input-range.js';

storiesOf('Forms | Input Range', module).add(
  'Default',
  () => html`
    <lion-input-range min="200" max="500" modelValue="300"></lion-input-range>
    <lion-input-range min="50" max="200" step="10" value="150"></lion-input-range>
  `,
);
