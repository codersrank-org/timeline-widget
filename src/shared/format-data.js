import { differenceInMonths } from './difference-in-months';

export const formatData = (items = []) => {
  const rows = [];
  let startDate;
  let endDate;
  let totalCols;
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
