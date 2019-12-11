import { html, LitElement } from '@lion/core';
import { OverlayMixin } from '@lion/overlays';
import '../lion-tooltip-arrow.js';

export class LionTooltip extends OverlayMixin(LitElement) {

  constructor() {
    super();
    this.mouseActive = false;
    this.keyActive = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._overlayContentNode.setAttribute('role', 'tooltip');
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);

    this.__setupArrowElement();
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
      <slot name="arrow"></slot>
      <slot name="_overlay-shadow-outlet"></slot>
    `;
  }

  __setupArrowElement() {
    this.__arrowElement = this.querySelector('[slot~=arrow');
    if (!this.__arrowElement) {
      return;
    }
    this.__arrowElement.setAttribute('x-arrow', true);
    this._overlayContentNodeWrapper.appendChild(this.__arrowElement);
  }


  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return {
      placementMode: 'local',
      elementToFocusAfterHide: null,
      hidesOnEsc: true,
      popperConfig: {
        placement: 'top', // default
        modifiers: {
          keepTogether: {
            enabled: true,
          },
          arrow: {
            enabled: true,
          },
        },
        onCreate: (data) => {
          this.__syncFromPopperState(data);
        },
        onUpdate: (data) => {
          this.__syncFromPopperState(data);
        },
      },
    };
  }

  __syncFromPopperState(data) {
    if (!data) {
      return;
    }
    if (this.__arrowElement
      && data.placement !== this.__arrowElement.placement) {
      this.__arrowElement.placement = data.placement;
    }
  }

  _setupOpenCloseListeners() {
    this.__resetActive = this.__resetActive.bind(this);
    this._overlayCtrl.addEventListener('hide', this.__resetActive);

    this.addEventListener('mouseenter', this.__showMouse);
    this.addEventListener('mouseleave', this.__hideMouse);

    this.__showKey = this.__showKey.bind(this);
    this._overlayInvokerNode.addEventListener('focusin', this.__showKey);

    this.__hideKey = this.__hideKey.bind(this);
    this._overlayInvokerNode.addEventListener('focusout', this.__hideKey);
  }

  _teardownOpenCloseListeners() {
    this._overlayCtrl.removeEventListener('hide', this.__resetActive);
    this.removeEventListener('mouseenter', this.__showMouse);
    this.removeEventListener('mouseleave', this._hideMouse);
    this._overlayInvokerNode.removeEventListener('focusin', this._showKey);
    this._overlayInvokerNode.removeEventListener('focusout', this._hideKey);
  }

  __resetActive() {
    this.mouseActive = false;
    this.keyActive = false;
  };

  __showMouse() {
    if (!this.keyActive) {
      this.mouseActive = true;
      this.opened = true;
    }
  };

  __hideMouse() {
    if (!this.keyActive) {
      this.opened = false;
    }
  };

  __showKey() {
    if (!this.mouseActive) {
      this.keyActive = true;
      this.opened = true;
    }
  };

  __hideKey() {
    if (!this.mouseActive) {
      this.opened = false;
    }
  };
}
