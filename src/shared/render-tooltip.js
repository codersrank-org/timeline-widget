import { companyLogo } from './company-logo';
import { differenceInMonths } from './difference-in-months';
import { sanitizeDescription } from './sanitize-description';

export const renderTooltip = (item, type) => {
  const formatLocation = ({ location, is_remote }) => {
    if (location === 'Remote, Earth' || is_remote) return 'Remote';
    return location || '';
  };
  const formatDate = (date) => {
    if (!date) return '';
    const formatter = Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });
    return formatter.format(new Date(date));
  };

  const formatInterval = (months) => {
    let output = '';

    if (months === 0) return 'Less than a month';

    if (months >= 12) {
      output += Math.floor(months / 12);
      output += ' year';
      if (Math.floor(months / 12) !== 1) output += 's';
    }

    if (months % 12 !== 0) {
      if (months >= 12) output += ' ';
      output += months % 12;
      output += ' month';
      if (months % 12 !== 1) output += 's';
    }

    return output;
  };

  const calculateMonths = (startDate, endDate, is_current) => {
    const end = is_current ? new Date() : new Date(endDate);
    return differenceInMonths(new Date(startDate), end);
  };
  const dates = (showInterval = true) => {
    const startDate = formatDate(item.start_date || item.date_from);
    const endDate = item.is_current
      ? 'Present'
      : formatDate(item.end_date || item.date_to);
    if (!showInterval) {
      return `${startDate} - ${endDate}`;
    }
    return `${startDate} - ${endDate} (${formatInterval(
      calculateMonths(
        item.start_date || item.date_from,
        item.end_date || item.date_to,
        item.is_current,
      ),
    )})`;
  };
  const itemLogo = () => {
    return type === 'workexperience'
      ? companyLogo(item.company, item.company_logo)
      : companyLogo(item.project_title, item.image);
  };
  const itemTitle = () => {
    return type === 'workexperience' ? item.company : item.project_title;
  };
  const itemSubtitle = () => {
    return type === 'workexperience' ? item.title : item.role;
  };
  // prettier-ignore
  return /* html */`
    <div class="codersrank-timeline-tooltip-item">
      <div class="logo">
        ${itemLogo()}
      </div>
      <div class="content">
        <div class="title">
          ${itemTitle()}
        </div>
        ${itemSubtitle() ? /* html */`
        <div class="subtitle">
          ${itemSubtitle()}
        </div>
        ` : ''}
        <div class="details">
          <div>${dates(true)}</div>
          ${item.location ? /* html */`
          <div>${formatLocation(item)}</div>
          ` : ''}
        </div>
        ${item.description ? /* html */`
        <div class="description">
          <div>${sanitizeDescription(item.description)}</div>
        </div>
        ` : ''}
        ${item.highlighted_technologies || item.other_technologies ? /* html */`
        <div class="tags">
          ${item.highlighted_technologies.map((tech) => /* html */`
            <span class="tag"><span class="tag-star">★</span>${tech}</span>
          `).join('')}

          ${item.other_technologies.map((tech) => /* html */`
            <span class="tag">${tech}</span>
          `).join('')}
        </div>
      ` : ''}
      </div>
    </div>
  `;
};
