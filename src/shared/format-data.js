import { differenceInMonths } from './difference-in-months';

export const formatData = (items = [], type) => {
  const rows = [];
  let startDate;
  let endDate;
  let totalCols;
  const datesOverlap = (start1, end1, start2, end2) => {
    if (start1 <= start2 && start2 <= end1) return true; // b starts in a
    if (start1 <= end2 && end2 <= end1) return true; // b ends in a
    if (start2 < start1 && end1 < end2) return true; // a in b
    return false;
  };
  const techItems = [];
  const addTechItem = (tech, start, end, item) => {
    techItems.push({
      name: tech,
      start_date: start,
      end_date: end,
      items: [item],
    });
  };
  const processTechItem = (tech, item) => {
    const { start_date, end_date, is_current } = item;
    const techStart = start_date ? new Date(start_date) : new Date();
    const techEnd = end_date && !is_current ? new Date(end_date) : new Date();
    const similarTechs = techItems.filter(
      (t) => t.name.toLowerCase() === tech.toLowerCase(),
    );
    if (!similarTechs.length) {
      addTechItem(tech, techStart, techEnd, item);
    } else {
      let overlap;
      similarTechs.forEach((otherTech) => {
        if (overlap) return;
        const otherTechStart = otherTech.start_date
          ? new Date(otherTech.start_date)
          : new Date();
        const otherTechEnd = otherTech.end_date
          ? new Date(otherTech.end_date)
          : new Date();
        if (datesOverlap(techStart, techEnd, otherTechStart, otherTechEnd)) {
          overlap = true;
          /* eslint-disable */
          otherTech.start_date = new Date(Math.min(techStart, otherTechStart));
          otherTech.end_date = new Date(Math.max(techEnd, otherTechEnd));
          /* eslint-enable */
          otherTech.items.push(item);
        }
      });
      if (!overlap) {
        addTechItem(tech, techStart, techEnd, item);
      }
    }
  };
  if (type === 'technologies') {
    items.forEach((item) => {
      const techs = [...(item.highlighted_technologies || [])];
      techs.forEach((tech) => {
        processTechItem(tech, item);
      });
    });
    // eslint-disable-next-line
    items = techItems;
  }
  const setStartDate = (d = '') => {
    startDate = new Date(d);
    startDate.setMonth(0, 1);
  };
  const setEndDate = (d = '') => {
    endDate = new Date(d);
  };
  setStartDate(new Date());

  items.forEach((item) => {
    const itemStartDate = new Date(item.start_date);
    const itemEndDate = item.is_current ? new Date() : new Date(item.end_date);
    if (itemStartDate < startDate) setStartDate(itemStartDate);
    if (!endDate || itemEndDate > endDate) setEndDate(itemEndDate);
  });

  const itemsWithCols = [];

  items.forEach((item, index) => {
    const itemStartDate = new Date(item.start_date);
    const itemEndDate = item.is_current ? new Date() : new Date(item.end_date);
    const itemStartCol = differenceInMonths(startDate, itemStartDate);
    const itemEndCol = itemStartCol + differenceInMonths(itemStartDate, itemEndDate);
    if (!totalCols || itemEndCol > totalCols) totalCols = itemEndCol;

    itemsWithCols.push({
      start_col: itemStartCol,
      end_col: itemEndCol,
      id: index,
      ...item,
    });
  });
  itemsWithCols.sort((a, b) => {
    return a.start_col > b.start_col ? 1 : -1;
  });

  const getRowIndex = (item, rowIndex) => {
    const { start_col } = item;
    if (!rows[rowIndex]) return rowIndex;
    const previousItems = rows[rowIndex].slice(0, itemsWithCols.indexOf(item));
    const hasClash = previousItems.filter((el) => el.end_col > start_col).length > 0;
    if (hasClash) {
      // eslint-disable-next-line
      rowIndex += 1;
      return getRowIndex(item, rowIndex);
    }
    return rowIndex;
  };

  itemsWithCols.forEach((item) => {
    const rowIndex = getRowIndex(item, 0);

    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }

    rows[rowIndex].push(item);
  });

  const getYears = () => {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const years = [startYear];
    if (endYear > startYear) {
      for (let i = 1; i <= endYear - startYear; i += 1) {
        years.push(startYear + i);
      }
    }
    return years;
  };

  return {
    rows,
    years: getYears(),
  };
};
