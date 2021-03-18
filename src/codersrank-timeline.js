import { fetchData } from './shared/fetch-data';
import { render } from './shared/render';
import { renderError } from './shared/render-error';
import { renderLoading } from './shared/render-loading';
import { formatData } from './shared/format-data';
import { renderTooltip } from './shared/render-tooltip';

// eslint-disable-next-line
const COMPONENT_TAG = 'codersrank-timeline';
const STATE_IDLE = 0;
const STATE_LOADING = 1;
const STATE_ERROR = 2;
const STATE_SUCCESS = 3;

// eslint-disable-next-line
const STYLES = `$_STYLES_$`;

// eslint-disable-next-line
class CodersrankTimeline extends HTMLElement {
  constructor() {
    super();

    this.shadowEl = this.attachShadow({ mode: 'closed' });
    this.tempDiv = document.createElement('div');

    this.stylesEl = document.createElement('style');
    this.stylesEl.textContent = STYLES;
    this.shadowEl.appendChild(this.stylesEl);

    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onWidgetClick = this.onWidgetClick.bind(this);

    this.mounted = false;

    this.state = STATE_IDLE;

    this.data = null;
  }

  static get observedAttributes() {
    return ['username', 'type'];
  }

  get username() {
    return this.getAttribute('username');
  }

  set username(value) {
    this.setAttribute('username', value);
  }

  get type() {
    return this.getAttribute('type') || 'workexperience';
  }

  set type(value) {
    this.setAttribute('type', value);
  }

  get branding() {
    return this.getAttribute('branding') !== 'false';
  }

  set branding(value) {
    this.setAttribute('branding', value);
  }

  render() {
    const { username, mounted, state, shadowEl, data, type, branding } = this;
    const ctx = {
      data,
      type,
      branding,
    };

    if (!username || !mounted) return;
    if (state === STATE_SUCCESS) {
      this.tempDiv.innerHTML = render(ctx);
    } else if (state === STATE_ERROR) {
      this.tempDiv.innerHTML = renderError(ctx);
    } else if (state === STATE_IDLE || state === STATE_LOADING) {
      this.tempDiv.innerHTML = renderLoading(ctx);
    }

    let widgetEl = shadowEl.querySelector('.codersrank-timeline');
    if (widgetEl) {
      widgetEl.parentNode.removeChild(widgetEl);
    }
    widgetEl = this.tempDiv.querySelector('.codersrank-timeline');
    if (!widgetEl) return;
    this.widgetEl = widgetEl;
    this.detachEvents();
    this.attachEvents();
    shadowEl.appendChild(widgetEl);
  }

  loadAndRender() {
    const { username, type } = this;
    this.state = STATE_LOADING;
    this.render();
    fetchData(username, type)
      .then((items) => {
        this.data = formatData(items, type);
        this.state = STATE_SUCCESS;
        this.render();
      })
      .catch(() => {
        this.state = STATE_ERROR;
        this.render();
      });
  }

  tooltipText(id) {
    let item;
    this.data.rows.forEach((row) => {
      row.forEach((el) => {
        if (el.id === parseInt(id, 10)) item = el;
      });
    });
    if (!item) return '';
    return renderTooltip(item, this.type);
  }

  showTooltip(id) {
    if (!this.data || !id || !this.widgetEl) return;

    const itemEl = this.shadowEl.querySelector(`[data-id="${id}"]`);
    if (!itemEl) return;
    const tooltipText = this.tooltipText(id);
    if (!tooltipText) return;

    this.tempDiv.innerHTML = `
      <div class="codersrank-timeline-tooltip">
        <div class="codersrank-timeline-tooltip-content">
          ${tooltipText}
        </div>
        <div class="codersrank-timeline-tooltip-angle"></div>
      </div>
    `;
    const widgetElRect = this.getBoundingClientRect();
    const itemElRect = itemEl.getBoundingClientRect();
    const tooltipEl = this.tempDiv.querySelector('.codersrank-timeline-tooltip');
    const itemLeft =
      itemElRect.left - widgetElRect.left < 0 ? 0 : itemElRect.left - widgetElRect.left;
    let itemWidth = itemElRect.width;
    if (itemElRect.left < 0) {
      itemWidth = itemElRect.width + itemElRect.left - widgetElRect.left;
    }
    if (itemLeft + itemWidth > widgetElRect.width) {
      itemWidth = widgetElRect.width - itemLeft;
    }
    let left = itemLeft + itemWidth / 2;
    if (left < 0) left = 0;
    if (left > widgetElRect.width) left = widgetElRect.width;

    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${itemElRect.top - widgetElRect.top}px`;
    tooltipEl.querySelector('.codersrank-timeline-tooltip-angle');
    this.shadowEl.appendChild(tooltipEl);
    const tooltipRect = tooltipEl.getBoundingClientRect();
    if (tooltipRect.top < 0) {
      tooltipEl.classList.add('codersrank-timeline-tooltip-bottom');
    }
  }

  hideTooltip() {
    if (!this.widgetEl) return;
    const tooltipEl = this.shadowEl.querySelector('.codersrank-timeline-tooltip');
    if (!tooltipEl) return;
    this.shadowEl.removeChild(tooltipEl);
  }

  onDocumentClick(e) {
    if (e.target === this) return;
    this.hideTooltip();
  }

  onWidgetClick(e) {
    this.hideTooltip();
    const targetEl = e.target;
    const parentEl = targetEl && targetEl.parentElement;
    let itemEl;
    if (targetEl.classList && targetEl.classList.contains('codersrank-timeline-item')) {
      itemEl = targetEl;
    } else if (
      parentEl.classList &&
      parentEl.classList.contains('codersrank-timeline-item')
    ) {
      itemEl = parentEl;
    }
    if (itemEl) this.showTooltip(itemEl.getAttribute('data-id'));
  }

  attachEvents() {
    if (!this.widgetEl) return;
    document.addEventListener('click', this.onDocumentClick, true);
    this.widgetEl.addEventListener('click', this.onWidgetClick, true);
  }

  detachEvents() {
    if (!this.widgetEl) return;
    document.removeEventListener('click', this.onDocumentClick, true);
    this.widgetEl.removeEventListener('click', this.onWidgetClick, true);
  }

  attributeChangedCallback() {
    if (!this.mounted) return;
    this.loadAndRender();
  }

  connectedCallback() {
    this.width = this.offsetWidth;
    this.mounted = true;
    this.loadAndRender();
  }

  disconnectedCallback() {
    this.mounted = false;
    this.detachEvents();
  }
}

// EXPORT
