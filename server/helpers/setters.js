function setDateFields(yearMonthDay) {
  if (!yearMonthDay) {
    return;
  }

  const date = new Date(yearMonthDay + 'T00:00:00');
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    yearMonth: yearMonthDay.substr(0, 7),
  };
}

export { setDateFields };
