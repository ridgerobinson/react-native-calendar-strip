import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text } from "react-native";

import styles from "./Calendar.style.js";

import moment from 'moment';

class CalendarHeader extends Component {
  static propTypes = {
    calendarHeaderFormat: PropTypes.string.isRequired,
    calendarHeaderStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    datesForWeek: PropTypes.array.isRequired,
    calenderHeaderOnPress: PropTypes.func
  };

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  //Function that formats the calendar header
  //It also formats the month section if the week is in between months
  formatDayCalendarHeader(datesForWeek, calendarHeaderFormat) {
    if (!datesForWeek || datesForWeek.length === 0) {
      return "";
    }

    let firstDay = datesForWeek[0];
    let lastDay = datesForWeek[datesForWeek.length - 1];
    let monthFormatting = "";
    //Parsing the month part of the user defined formating
    if ((calendarHeaderFormat.match(/Mo/g) || []).length > 0) {
      monthFormatting = "Mo";
    } else {
      if ((calendarHeaderFormat.match(/M/g) || []).length > 0) {
        for (
          let i = (calendarHeaderFormat.match(/M/g) || []).length;
          i > 0;
          i--
        ) {
          monthFormatting += "M";
        }
      }
    }

    if (firstDay.month() === lastDay.month()) {
      return firstDay.format(calendarHeaderFormat);
    } else if (firstDay.year() !== lastDay.year()) {
      return `${firstDay.format(calendarHeaderFormat)} / ${lastDay.format(
        calendarHeaderFormat
      )}`;
    }

    return `${monthFormatting.length > 1
      ? firstDay.format(monthFormatting)
      : ""} ${monthFormatting.length > 1 ? "/" : ""} ${lastDay.format(
      calendarHeaderFormat
    )}`;
  }

  formatWeekCalendarHeader(selectedDate) {    
    let firstDate = moment(selectedDate).clone().startOf('isoWeek');
    let endDate = moment(selectedDate).clone().endOf('isoWeek');

    let firstDateYear = moment(firstDate).year();
    let endDateYear = moment(endDate).year();

    let withYear = 'MMM Do, YYYY';
    let withoutYear = 'MMM Do';

    return `${moment(firstDate).format(firstDateYear == endDateYear ? withoutYear:withYear)} - ${moment(endDate).format(withYear)}`;
  }

  render() {

    const headerText = this.props.calendarView == 'day' ?
      this.formatDayCalendarHeader(
      this.props.datesForWeek,
      this.props.calendarHeaderFormat
    )
      :
    this.formatWeekCalendarHeader(
      this.props.selectedDate
    );

    return (
      <Text
        style={[
          styles.calendarHeader,
          { fontSize: this.props.fontSize },
          this.props.calendarHeaderStyle
        ]}
        onPress={this.props.calenderHeaderOnPress}
      >
        {headerText}
      </Text>
    );
  }
}

export default CalendarHeader;
