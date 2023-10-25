import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  transform(value: string, showHours: boolean = false): string {
    var timeStamp = '';
    var date = new Date().toISOString();
    var newDateNow = date.split('T')[0];
    var newDateItem = new Date(value).toISOString().split('T')[0];
    var dateArray = newDateNow.split('-');
    var dateArrayItem = newDateItem.split('-');

    let hours, minutes, seconds;

    let years, months, days;
    years = +dateArray[0] - +dateArrayItem[0];
    months = +dateArray[1] - +dateArrayItem[1];
    days = +dateArray[2] - +dateArrayItem[2];
    if (years > 0) {
      if (years === 1) timeStamp = `${years} year ago`;
      else timeStamp = `${years} years ago`;
    } else if (months > 0) {
      if (months === 1) timeStamp = `${months} month ago`;
      else timeStamp = `${months} months ago`;
    } else {
      if (days === 0) {
        if (showHours) {
          var time = date.split('T')[1];
          time = time.split('.')[0];
          var timeArr = time.split(':');

          var oldTime = value.split('T')[1];
          oldTime = oldTime.split('.')[0];
          var oldTimeArr = oldTime.split(':');
          hours = Math.abs(+time[0] - +oldTimeArr[0]);
          timeStamp = `${hours} hours ago`;
        } else {
          timeStamp = `Today`;
        }
      } else if (days === 1) {
        timeStamp = `Yesterday`;
      } else {
        timeStamp = `${days} days ago`;
      }
    }
    return timeStamp;
  }
}
