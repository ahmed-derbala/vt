/**
 * DATE AND TIME
 */
exports.convertDateToTime = date => {
    return date.slice(16, 21);
}

exports.convertTimestampToHours = time => {
    return parseInt(time.slice(0, 2));
}

exports.convertTimestampToMinutes = time => {
    return parseInt(time.slice(3, 5));
}

//converting minutes to hours
let convertMinutestingoHours = exports.convertMinutestingoHours = (minutes, display) => {
    if (!display || display == 'hours') {
        if (minutes > 59) {
            if (minutes % 60 == 0) {
                return minutes / 60
            } else {
                return Math.floor(minutes / 60)
            }
        } else {
            return minutes
        }
    }
    if (display == 'json') {
        if (minutes > 59) {
            var hours = Math.floor(minutes / 60);
            minutes = minutes - hours * 60;
            return { hours, minutes }
        } else {
            return { hours: 0, minutes }
        }
    }
}

//check if a given day is the current day or not
exports.isToDay = date => {
    const toDay = new Date();
    const dateConvertedToDate = new Date(date);
    if (
        dateConvertedToDate.getFullYear() == toDay.getFullYear() &&
        dateConvertedToDate.getMonth() == toDay.getMonth() &&
        dateConvertedToDate.getDate() == toDay.getDate()
    ) {
        return true;
    } else {
        return false;
    }
}

exports.durationInDays = (date1, date2) => {
    if (!date1 || !date2) return 0
    return Math.ceil((Math.abs((new Date(date2)).getTime() - (new Date(date1)).getTime())) / (1000 * 60 * 60 * 24)) + 1;
}

//calculates duration in minutes between two times in 24h format
exports.durationOfTimesInMinutes = (time1, time2) => {
    let h1 = parseInt(time1.slice(0, 2))
    let m1 = parseInt(time1.slice(3, 5))
    let h2 = parseInt(time2.slice(0, 2))
    let m2 = parseInt(time2.slice(3, 5))

    let hourDuration = (h2 - h1) * 60
    if (m1 < m2) {
        hourDuration = hourDuration + (m2 - m1)
    }
    if (m1 > m2) {
        hourDuration = hourDuration - (m1 - m2)
    }
    return Math.abs(hourDuration)
}

//calculates duration in minutes between two times in 24h format
let durationOfDatesInMinutes = exports.durationOfDatesInMinutes = (time1, time2) => {
    let h1 = time1.getHours()
    let m1 = time1.getMinutes()
    let h2 = time2.getHours()
    let m2 = time2.getMinutes()

    if (h1 > h2) return false
    let hourDuration = (h2 - h1) * 60
    if (m1 < m2) {
        hourDuration = hourDuration + (m2 - m1)
    }
    if (m1 > m2) {
        hourDuration = hourDuration - (m1 - m2)
    }

    return Math.abs(hourDuration)
}

var getNextMondayOfTheWeek = exports.getNextMondayOfTheWeek = (dayName, excludeToday = true, refDate = new Date()) => {
    const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
        .indexOf('mon'.slice(0, 3).toLowerCase());
    if (dayOfWeek < 0) {
        return;
    }
    refDate.setHours(1, 0, 0, 0);
    refDate.setDate(refDate.getDate() + !!excludeToday + (dayOfWeek + 7 - refDate.getDay() - !!excludeToday) % 7);
    return refDate;
}

var getNextSunday = exports.getNextSunday = (dayName, excludeToday = true, refDate = new Date()) => {
    const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
        .indexOf('sun'.slice(0, 3).toLowerCase());
    if (dayOfWeek < 0) {
        return;
    }
    refDate.setHours(1, 0, 0, 0);
    refDate.setDate(refDate.getDate() + !!excludeToday + (dayOfWeek + 7 - refDate.getDay() - !!excludeToday) % 7);
    // console.log('next sunday');

    //console.log(refDate);

    return refDate;
}

exports.getNextDayOfTheWeek = (dayName, excludeToday = true, refDate = new Date()) => {
    const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
        .indexOf(dayName.slice(0, 3).toLowerCase());
    if (dayOfWeek < 0) {
        return;
    }
    refDate.setHours(1, 0, 0, 0);
    //refDate.setDate(refDate.getDate() + !!excludeToday +(dayOfWeek + 7 - refDate.getDay() - !!excludeToday) % 7);
    refDate.setDate(getNextSunday().getDate() + !!excludeToday + (dayOfWeek + 7 - getNextSunday().getDay() - !!excludeToday) % 7);
    //console.log(refDate);

    //refDate.setDate(getNextMondayOfTheWeek().getDate() + !!excludeToday + (dayOfWeek + 7 - getNextMondayOfTheWeek().getDay() - !!excludeToday) % 7);
    //console.log(refDate);

    return refDate;
}

//get date based on dayName, weekNumber and year
let dateOf = exports.dateOf = function (dayName, weekNumber, year) {
    if (!dayName) throw ('dayName should not be null')
    if (!weekNumber) weekNumber = (new Date()).getWeek()
    if (!year) year = (new Date()).getFullYear()

    const day = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(dayName.slice(0, 3).toLowerCase());

    let simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    let dow = simple.getDay();
    let ISOweekStart = simple;

    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + day);
    else
        ISOweekStart.setDate(simple.getDate() + 7 + day - simple.getDay());

    ISOweekStart.setHours(1, 0, 0, 0);
    return ISOweekStart;
}
//for week, get monday date and sunday date
exports.getDateRangeOfWeek = (weekNo) => {
    let d1 = new Date();
    let numOfdaysPastSinceLastMonday = (d1.getDay() - 1);
    //numOfdaysPastSinceLastMonday = eval(d1.getDay() - 1);
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    let weekNoToday = d1.getWeek();
    //i detected a weeknumber calc error so i added -1
    let weeksInTheFuture = ((weekNo - weekNoToday) - 1);
    //var weeksInTheFuture = eval(weekNo - weekNoToday);
    d1.setDate(d1.getDate() + (7 * weeksInTheFuture));
    //d1.setDate(d1.getDate() + eval(7 * weeksInTheFuture));
    let rangeIsFrom = d1.getFullYear() + "-" + (d1.getMonth() + 1) + "-" + d1.getDate();
    // let rangeIsFrom = d1.getFullYear() + "-" + eval(d1.getMonth() + 1) + "-" + d1.getDate();
    d1.setDate(d1.getDate() + 6);
    let rangeIsTo = d1.getFullYear() + "-" + (d1.getMonth() + 1) + "-" + d1.getDate();
    //let rangeIsTo = d1.getFullYear() + "-" + eval(d1.getMonth() + 1) + "-" + d1.getDate();
    console.log(rangeIsFrom + " to " + rangeIsTo);

    return rangeIsFrom + " to " + rangeIsTo;
};

//get range of dates between two given dates
exports.dateRange = (start, end) => {
    start = (new Date(start))
    end = (new Date(end))

    let dates = []
    while (start <= end) {
        dates.push(start.getTheDate());
        start.setDate(start.getDate() + 1)
    }
    return dates;
}

exports.getNextDay = (dayName, excludeToday = true, refDate = new Date()) => {
    let tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
    return new Date((tomorrow).getTime() - ((tomorrow).getTimezoneOffset() * 60000)).toISOString().split("T")[0];
}

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86401000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

//return hours and minutes of a date
Date.prototype.getHoursMinutes = function () {
    let hours = this.getHours()
    let minutes = this.getMinutes()

    if (parseInt(this.getHours()) < 10) {
        hours = `0${this.getHours().toString()}`
    }

    if (parseInt(this.getMinutes()) < 10) {
        minutes = `0${this.getMinutes().toString()}`
    }
    return `${hours}:${minutes}`
}

//returns yyyy-mm-dd of 2019-10-21T08:00:00.000Z like format
Date.prototype.getTheDate = function () {
    let month = this.getMonth()
    let day = parseInt(this.getDate())

    if (parseInt(this.getMonth()) == 9) {
        month = (`10`)
    }
    if (parseInt(this.getMonth()) < 9) {
        month = parseInt(this.getMonth()) + 1
        month = (`0${month}`)
    }
    if (parseInt(this.getMonth()) > 9) {
        month = parseInt(this.getMonth()) + 1
    }
    if (day <= 9) {
        day = `0${day}`
    }
    return `${this.getFullYear()}-${month}-${day}`
}

//returns the name of day of a date
Date.prototype.getTheDay = function () {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[this.getDay()];
}
// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function () {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}

Date.prototype.toDateOnly = function () {
    return new Date(this.getTime() - (this.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
}

Date.prototype.betweenDates = function (date1, date2) {

    if (this.toDateOnly >= date1 && this.toDateOnly <= date2) return true;
    return false
}

let getHourFromTime = exports.getHourFromTime = function (time) {
    if (!time || time.indexOf(':') == -1) return '00:00'
    time = time.slice(0, time.indexOf(':'))
    if (time.length == 0) time = `00`
    if (time.length == 1) time = `0${time}`
    if (time.length > 2) time = `00`
    return time
}

let getMinuteFromTime = exports.getMinuteFromTime = function (time) {
    if (!time || time.indexOf(':') == -1) return '00:00'
    time = time.slice(time.lastIndexOf(':') + 1, time.length)
    if (time.length == 0) time = `00`
    if (time.length == 1) time = `0${time}`
    if (time.length > 2) time = `00`
    return time
}

//insure the time format (lack of 0), for example front sends 8:2 instead of 08:02
exports.insureTime = function (time) {
    if (!time) return `00:00`
    return `${getHourFromTime(time)}:${getMinuteFromTime(time)}`
}

exports.timeElapsed = (date, format) => {
    let minutes = 0, hours = 0, days = 0, duration = ''
    let serverRun = Math.floor((((Math.abs(new Date() - new Date(date))) / 1000) / 60))

    if (serverRun >= 1440) {
        days = Math.floor((serverRun / 60) / 24)
        serverRun = serverRun - days * 24 * 60
    }
    if (serverRun > 60 && serverRun < 1440) {
        hours = Math.floor(serverRun / 60)
        serverRun = serverRun - hours * 60
    }

    minutes = serverRun

    if (format == 'text') {
        if (days > 0) duration = duration.concat(`${days} days, `)
        if (hours > 0) duration = duration.concat(`${hours} hours, `)
        if (duration.length == 0) {
            duration = duration.concat(`${minutes} minutes`)
        } else {
            if (minutes > 0) duration = duration.concat(`${minutes} minutes`)
        }
        return duration
    } else {
        return { minutes, hours, days }
    }
}