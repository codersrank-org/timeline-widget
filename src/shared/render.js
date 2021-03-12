import { codersRankLogo } from './codersrank-logo';

export const render = ({ data, preloader, branding, type } = {}) => {
  const { rows = [], years = [] } = data;
  const colWidth = 24;
  const rowHeight = 36;

  const itemText = (item) => {
    if (item.end_col - item.start_col < 2) return '';
    if (type === 'workexperience') {
      return `${item.title} @ ${item.company}`;
    }
    if (type === 'portfolio') {
      return item.project_title || '';
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
          <div class="codersrank-timeline-year-line" style="left: ${colWidth * 12 * yearIndex}px"></div>
        `).join('')}
        </div>
        <div class="codersrank-timeline-years">
          ${years.map((year) => /* html */`
            <div class="codersrank-timeline-year" style="width: ${colWidth * 12}px">
              <span>${year}</span>
            </div>
          `).join('')}
        </div>
        <div class="codersrank-timeline-chart" style="height: ${rows.length * rowHeight}px">
          ${rows.map((row, rowIndex) => /* html */`
          <div class="codersrank-timeline-row">
            ${row.map((item) => /* html */`
              <div class="codersrank-timeline-item-wrap" style="left: ${item.start_col * colWidth}px; width: ${(item.end_col - item.start_col) * colWidth}px; height: ${rowHeight}px; top: ${rowIndex * rowHeight}px">
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
