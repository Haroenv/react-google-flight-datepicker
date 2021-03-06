import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import dayjs from 'dayjs';

import MonthCalendar from './MonthCalendar';
import { getMonthInfo, getWeekDay } from '../../helpers';

const DialogContentMobile = ({
  fromDate,
  toDate,
  hoverDate,
  onSelectDate,
  onHoverDate,
  startWeekDay,
  minDate,
  maxDate,
  monthFormat,
  isSingle,
}) => {
  const [scrollToIndex, setScrollToIndex] = useState(0);
  const [rowCount, setRowCount] = useState(2400);
  const minYear = minDate ? dayjs(minDate).year() : 1900;
  const minMonth = minDate ? dayjs(minDate).month() : 0;

  useEffect(() => {
    const date = fromDate ? dayjs(fromDate) : dayjs();
    let monthDiff = date.diff(dayjs('1900-01-01'), 'month');

    if (minDate) {
      monthDiff = date.diff(dayjs(minDate), 'month');
    }
    setScrollToIndex(monthDiff + 1);

    if (maxDate) {
      const _minDate = minDate ? dayjs(minDate) : dayjs('1900-01-01');
      setRowCount(dayjs(maxDate).diff(_minDate, 'month') + 1);
    }
  }, []);

  function getMonthYearFromIndex(index) {
    const _index = index + minMonth;
    const year = minYear + Math.floor(_index / 12);
    const month = _index % 12;

    return { year, month };
  }

  // eslint-disable-next-line react/prop-types
  function rowRenderer({ key, index, style }) {
    const { year, month } = getMonthYearFromIndex(index);

    return (
      <div key={key} style={style}>
        <MonthCalendar
          month={month}
          year={year}
          onSelectDate={onSelectDate}
          onHoverDate={onHoverDate}
          fromDate={fromDate}
          toDate={toDate}
          hoverDate={hoverDate}
          startWeekDay={startWeekDay}
          minDate={minDate}
          maxDate={maxDate}
          monthFormat={monthFormat}
          isSingl={isSingle}
        />
      </div>
    );
  }

  function getRowHeight({ index }) {
    const { year, month } = getMonthYearFromIndex(index);
    const { totalWeek } = getMonthInfo(year, month, 'monday');

    return totalWeek.length * 48 + 34;
  }

  function renderMonthCalendars() {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={rowCount}
            rowHeight={getRowHeight}
            scrollToIndex={scrollToIndex}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    );
  }

  function generateWeekDay() {
    const arrWeekDay = getWeekDay(startWeekDay);

    return arrWeekDay.map((day, index) => (
      <div className="weekday" key={index}>{day}</div>
    ));
  }

  return (
    <div className="calendar-wrapper">
      <div className="calendar-content">
        <div className="weekdays mobile">
          {generateWeekDay()}
        </div>
        {renderMonthCalendars()}
      </div>
    </div>

  );
};

DialogContentMobile.propTypes = {
  fromDate: PropTypes.instanceOf(Date),
  toDate: PropTypes.instanceOf(Date),
  hoverDate: PropTypes.instanceOf(Date),
  onSelectDate: PropTypes.func,
  onHoverDate: PropTypes.func,
  startWeekDay: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  monthFormat: PropTypes.string,
  isSingle: PropTypes.bool,
};

DialogContentMobile.defaultProps = {
  fromDate: null,
  toDate: null,
  hoverDate: null,
  onSelectDate: () => {},
  onHoverDate: () => {},
  startWeekDay: null,
  minDate: null,
  maxDate: null,
  monthFormat: '',
  isSingle: false,
};

export default DialogContentMobile;
