/* eslint-disable import/no-extraneous-dependencies */
import { LocalizeMixin, formatNumber } from '@lion/localize';
import { FieldCustomMixin } from '@lion/field';
import { LionInput } from '@lion/input';
import { html } from '@lion/core';

/**
 * LionInputRange: extension of lion-input
 *
 * @customElement `lion-input-range`
 * @extends LionInput
 */
export class LionInputRange extends FieldCustomMixin(LocalizeMixin(LionInput)) {
  static get properties() {
    return {
      min: Number,
      max: Number,
      unit: String,
      step: {
        type: Number,
        reflect: true,
      },
    };
  }

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();
    this.type = 'range';
  }

  constructor() {
    super();
    this.parser = value => parseFloat(value);
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('min')) {
      this._inputNode.min = this.min;
    }

    if (changedProperties.has('max')) {
      this._inputNode.max = this.max;
    }

    if (changedProperties.has('modelValue')) {
      this._inputNode.value = this.modelValue;
    }

    if (changedProperties.has('step')) {
      this._inputNode.step = this.step;
    }
  }

  inputGroupTemplate() {
    return html`
      <div>
        <span class="input-range__value">${formatNumber(this.formattedValue)}</span>
        <span class="input-range__unit">${this.unit}</span>
      </div>
      <div class="input-group">
        ${this.inputGroupBeforeTemplate()}
        <div class="input-group__container">
          ${this.inputGroupPrefixTemplate()} ${this.inputGroupInputTemplate()}
          ${this.inputGroupSuffixTemplate()}
        </div>
        ${this.inputGroupAfterTemplate()}
      </div>
    `;
  }

  inputGroupInputTemplate() {
    return html`
      <div class="input-group__input">
        <slot name="input"></slot>
        <div class="input-range__limits">
          <span>${formatNumber(this.min)}</span>
          <span>${formatNumber(this.max)}</span>
        </div>
      </div>
    `;
  }
}
