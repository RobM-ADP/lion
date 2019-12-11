import { dedupeMixin } from '@lion/core';
import { OverlayController } from './OverlayController.js';

/**
 * @type {Function()}
 * @polymerMixin
 * @mixinFunction
 */
export const OverlayMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow
    class OverlayMixin extends superclass {
      static get properties() {
        return {
          opened: {
            type: Boolean,
            reflect: true,
          },
        };
      }

      constructor() {
        super();
        this.opened = false;
        this.config = {};
      }

      get config() {
        return this.__config;
      }

      set config(value) {
        if (this._overlayCtrl) {
          this._overlayCtrl.updateConfig(value);
        }
        this.__config = value;
      }

      /**
       * @overridable method `_defineOverlay`
       * @desc returns an instance of a (dynamic) overlay controller
       * In case overriding _defineOverlayConfig is not enough
       * @returns {OverlayController}
       */
      // eslint-disable-next-line
      _defineOverlay({ contentNode, invokerNode }) {
        return new OverlayController({
          contentNode,
          invokerNode,
          ...this._defineOverlayConfig(), // wc provided in the class as defaults
          ...this.config, // user provided (e.g. in template)
          popperConfig: {
            ...(this._defineOverlayConfig().popperConfig || {}),
            ...(this.config.popperConfig || {}),
            modifiers: {
              ...((this._defineOverlayConfig().popperConfig &&
                this._defineOverlayConfig().popperConfig.modifiers) ||
                {}),
              ...((this.config.popperConfig && this.config.popperConfig.modifiers) || {}),
            },
          },
        });
      }

      /**
       * @overridable method `_defineOverlay`
       * @desc returns an object with default configuration options for your overlay component.
       * This is generally speaking easier to override than _defineOverlay method entirely.
       * @returns {OverlayController}
       */
      // eslint-disable-next-line
      _defineOverlayConfig() {
        return {
          placementMode: 'local',
        };
      }

      updated(changedProperties) {
        super.updated(changedProperties);

        if (changedProperties.has('opened')) {
          if (this._overlayCtrl) {
            this.__syncToOverlayController();
          }
        }
      }

      /**
       * @overridable
       * @desc use this method to setup your open and close event listeners
       * For example, set a click event listener on _overlayInvokerNode to set opened to true
       */
      // eslint-disable-next-line class-methods-use-this
      _setupOpenCloseListeners() {}

      /**
       * @overridable
       * @desc use this method to tear down your event listeners
       */
      // eslint-disable-next-line class-methods-use-this
      _teardownOpenCloseListeners() {}

      firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        // we setup in firstUpdated so we can use nodes from light and shadowDom
        this._setupOverlayCtrl();
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }
        if (this._overlayCtrl) {
          this._teardownOverlayCtrl();
        }
      }

      get _overlayInvokerNode() {
        return Array.from(this.children).find(child => child.slot === 'invoker');
      }

      get _overlayContentNode() {
        let contentNode;

        // FIXME: This should shadow outlet in between the host and the content slot, is a problem
        // Should simply be Array.from(this.children).find(child => child.slot === 'content')
        // Issue: https://github.com/ing-bank/lion/issues/382
        const shadowOutlet = Array.from(this.children).find(
          child => child.slot === '_overlay-shadow-outlet',
        );
        if (shadowOutlet) {
          contentNode = Array.from(shadowOutlet.children).find(child => child.slot === 'content');
        } else {
          contentNode = Array.from(this.children).find(child => child.slot === 'content');
        }

        if (contentNode) {
          this._cachedOverlayContentNode = contentNode;
        }
        return contentNode || this._cachedOverlayContentNode;
      }

      get _overlayContentNodeWrapper() {
        return this._overlayContentNode.parentElement;
      }

      _setupOverlayCtrl() {
        this._overlayCtrl = this._defineOverlay({
          contentNode: this._overlayContentNode,
          invokerNode: this._overlayInvokerNode,
        });
        this.__syncToOverlayController();
        this.__setupSyncFromOverlayController();

        this._setupOpenCloseListeners();
      }

      _teardownOverlayCtrl() {
        this._teardownOpenCloseListeners();
        this.__teardownSyncFromOverlayController();
        this._overlayCtrl.teardown();
      }

      __setupSyncFromOverlayController() {
        this.__onOverlayCtrlShow = () => {
          this.opened = true;
        };
        this.__onOverlayCtrlHide = () => {
          this.opened = false;
        };
        this.__onBeforeShow = () => {
          this.dispatchEvent(new Event('before-show'));
        };

        this._overlayCtrl.addEventListener('show', this.__onOverlayCtrlShow);
        this._overlayCtrl.addEventListener('hide', this.__onOverlayCtrlHide);
        this._overlayCtrl.addEventListener('before-show', this.__onBeforeShow);
      }

      __teardownSyncFromOverlayController() {
        this._overlayCtrl.removeEventListener('show', this.__onOverlayCtrlShow);
        this._overlayCtrl.removeEventListener('hide', this.__onOverlayCtrlHide);
        this._overlayCtrl.removeEventListener('before-show', this.__onBeforeShow);
      }

      __syncToOverlayController() {
        if (this.opened) {
          this._overlayCtrl.show();
        } else {
          this._overlayCtrl.hide();
        }
      }
    },
);
