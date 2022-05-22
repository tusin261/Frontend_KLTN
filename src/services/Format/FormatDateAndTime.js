
const milliseconds_per_day = 1000 * 60 * 60 * 24;
const today = new Date();
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    //var ampm = hours >= 12 ? 'PM' : 'AM';
    //hours = hours % 12;
    //hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    //var strTime = hours + ':' + minutes + ' ' + ampm;
    var strTime = hours + ':' + minutes;
    return strTime;
}


function formatDate(value1) {
    const v1 = new Date(value1);
    const diffTime = Math.abs(today - v1);
    const rs = Math.ceil(diffTime / milliseconds_per_day);

    if (rs > 7) {
        return v1.toLocaleDateString("vi-VN");
    } else if (rs <= 1) {
        //return "Hom nay, " + formatAMPM(v1);
        return formatAMPM(v1);
    } else {
        return `${rs} ngay truoc`;
    }
}

const fulldays = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Thang 12"];

function formatDateTime(t) {
    let dt = new Date(t);
    const date = dt.getDate();
    const month = months[dt.getMonth()];
    const diffDays = new Date().getDate() - date;
    const diffMonths = new Date().getMonth() - dt.getMonth();
    const diffYears = new Date().getFullYear() - dt.getFullYear();
    if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
        return getTime(t);
    } else if (diffDays === -1) {
        return getTime(t);
    } else if (diffYears === 0 && diffDays === 1) {
        return "Hôm qua";
    } else if (diffYears === 0 && (diffDays > 1 && diffDays < 7)) {
        return fulldays[dt.getDay()];
    } else if (diffYears >= 1) {
        return dt.getDate() + '-' + (dt.getMonth() + 1) + '-' + dt.getFullYear();
    } else {
        return date + " " + month;
    }
}

function formatDateTimeMessage(t) {
    let dt = new Date(t);
    const date = dt.getDate();
    const month = months[dt.getMonth()];
    const diffDays = new Date().getDate() - date;
    const diffMonths = new Date().getMonth() - dt.getMonth();
    const diffYears = new Date().getFullYear() - dt.getFullYear();
    if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
        return getTime(t);
    } else if (diffDays === -1) {
        return getTime(t);
    } else if (diffYears === 0 && diffDays === 1) {
        return `Hôm qua, ${getTime(t)}`;
    } else if (diffYears === 0 && (diffDays > 1 && diffDays < 7)) {
        return `${fulldays[dt.getDay()]},  ${getTime(t)}`;
    } else if (diffYears >= 1) {
        return dt.getDate() + '-' + (dt.getMonth() + 1) + '-' + dt.getFullYear();
    } else {
        return date + " " + month;
    }
}


function getTime(myDate) {
    const time = new Date(myDate.toString()).toLocaleTimeString('en-US', {
        timeStyle: 'short',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh'
    });
    return time;
}




module.exports = { formatAMPM, formatDate, formatDateTime, getTime,formatDateTimeMessage };
