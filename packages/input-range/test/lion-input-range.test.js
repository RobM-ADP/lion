import { expect, fixture, nextFrame } from '@open-wc/testing';

import '../lion-input-range.js';

describe('<lion-input-range>', () => {
  it('has a type = range', async () => {
    const el = await fixture(`<lion-input-range></lion-input-range>`);
    expect(el._inputNode.type).to.equal('range');
  });

  it('displays the modelValue and unit', async () => {
    const el = await fixture(`
      <ing-input-range .modelValue="${75}" unit="${`%`}"></ing-input-range>
    `);
    expect(el.shadowRoot.querySelector('.input-range__value')).to.equal(75);
    expect(el.shadowRoot.querySelector('.input-range__unit')).to.equal('%');
  });

  // todo: define what to display
  it("displays '' when no modelValue", async () => {
    const el = await fixture(`
      <ing-input-range></ing-input-range>
    `);
    expect(el.shadowRoot.querySelector('.input-range__value')).to.equal('');
  });

  it('displays 2 tick labels (min and max values) by default', async () => {
    const el = await fixture(`<lion-input-range min="100" max="200"></lion-input-range>`);
    expect(el.shadowRoot.querySelectorAll('.input-range__scale').length).to.equal(2);
    expect(el.shadowRoot.querySelectorAll('.input-range__scale')[0].innerText).to.equal(el.min);
    expect(el.shadowRoot.querySelectorAll('.input-range__scale')[1].innerText).to.equal(el.max);
  });

  it('update min and max attributes when min and max property change', async () => {
    const el = await fixture(`<lion-input-range min="100" max="200"></lion-input-range>`);
    el.min = '120';
    el.max = '220';
    await nextFrame();
    expect(el._inputNode.min).to.equal(el.min);
    expect(el._inputNode.max).to.equal(el.max);
  });

  it.skip('can change the amount of tick labels', async () => {
    const el = await fixture(
      `<lion-input-range min="100" max="200" .ticks="{{numberOfLabels: 3}}"></lion-input-range>`,
    );
    expect(el.shadowRoot.querySelectorAll('.input-range__scale').length).to.equal(3);
    expect(el.shadowRoot.querySelectorAll('.input-range__scale')[0].innerText).to.equal(100);
    expect(el.shadowRoot.querySelectorAll('.input-range__scale')[1].innerText).to.equal(150);
    expect(el.shadowRoot.querySelectorAll('.input-range__scale')[2].innerText).to.equal(200);
  });

  it('can hide the tick labels', async () => {
    const el = await fixture(`<lion-input-range min="100" max="200" noLabels"></lion-input-range>`);
    expect(el.shadowRoot.querySelectorAll('.input-range__scale').length).to.equal(0);
  });

  it.skip('can add ticks', async () => {
    const el = await fixture(
      `<lion-input-range min="100" max="200" .ticks="{{tickStep: 5}}"></lion-input-range>`,
    );
    expect(el.shadowRoot.querySelectorAll('.input-range__ticks').length).to.equal(20);
  });

  it('parser method should return a value parsed into a number format', async () => {
    const el = await fixture(
      `<lion-input-range min="100" max="200" modelValue="150"></lion-input-range>`,
    );
    const parsedValue = el.parser('160');
    expect(typeof parsedValue).to.equal('number');
  });

  it('is accessible', async () => {
    const el = await fixture(`<lion-input-range label="range"></lion-input-range>`);
    await expect(el).to.be.accessible();
  });

  it('is accessible when disabled', async () => {
    const el = await fixture(`<lion-input-range label="range" disabled></lion-input-range>`);
    await expect(el).to.be.accessible();
  });
});
