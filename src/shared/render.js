import { codersRankLogo } from './codersrank-logo';

export const render = ({ data, preloader, branding, type } = {}) => {
  const { rows = [], years = [] } = data;

  const itemText = (item) => {
    if (item.end_col - item.start_col < 2) return '';
    if (type === 'workexperience') {
      return `${item.title} @ ${item.company}`;
    }
    if (type === 'portfolio') {
      return item.project_title || '';
    }
    if (type === 'technologies') {
      return `<img src="https://icon-widget.codersrank.io/api/${encodeURIComponent(
        item.name,
      )}">${item.name}`;
    }
    return '';
  };

  // prettier-ignore
  return /* html */ `
    <div class="codersrank-timeline ${preloader ? 'codersrank-timeline-loading' : ''}">
      ${preloader ? /* html */ `
      <div class="codersrank-timeline-preloader"></div>
      ` : ''}
      <div class="codersrank-timeline-wrap">
        <div class="codersrank-timeline-year-lines">
        ${years.map((year, yearIndex) => /* html */`
          <div class="codersrank-timeline-year-line" style="left: calc(var(--col-width) * ${12 * yearIndex})"></div>
        `).join('')}
        </div>
        <div class="codersrank-timeline-years">
          ${years.map((year) => /* html */`
            <div class="codersrank-timeline-year" style="width: calc(var(--col-width) * 12)">
              <span>${year}</span>
            </div>
          `).join('')}
        </div>
        <div class="codersrank-timeline-chart" style="height: calc(var(--row-height) * ${rows.length})">
          ${rows.map((row, rowIndex) => /* html */`
          <div class="codersrank-timeline-row">
            ${row.map((item) => /* html */`
              <div class="codersrank-timeline-item-wrap" style="left: calc(var(--col-width) * ${item.start_col}); width: calc(var(--col-width) * ${item.end_col - item.start_col}); height: var(--row-height); top: calc(var(--row-height) * ${rowIndex})">
                <div class="codersrank-timeline-item" data-id="${item.id}">
                  <span>${itemText(item)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}
        </div>
      </div>

      ${branding ? /* html */`
      <div class="codersrank-timeline-branding">
        <a href="https://codersrank.io" target="_blank" rel="noopener noreferrer">
          <span>Powered by </span>
          ${codersRankLogo}
        </a>
      </div>
      ` : ''}
    </div>
  `;
};
