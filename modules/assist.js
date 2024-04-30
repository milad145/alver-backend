const path = require('path');
const appDir = path.dirname(require.main.filename);
const jalaali = require('jalaali-js');

exports.appDir = () => {
    return appDir
};

exports.time = () => {
    return Math.floor(Date.now())
};

exports.debug = (str) => {
    console.dir(str, {depth: null});
    console.log('----------------------------------------------------------------')
};

exports.getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
};

exports.getMicroTime = () => {
    let hrtime = process.hrtime();
    return (hrtime[0] * 1000000 + hrtime[1] / 1000) / 1000
};

exports.getMonthName = (n) => {
    let month = new Array(12);
    month[0] = 'January';
    month[1] = 'February';
    month[2] = 'March';
    month[3] = 'April';
    month[4] = 'May';
    month[5] = 'June';
    month[6] = 'July';
    month[7] = 'August';
    month[8] = 'September';
    month[9] = 'October';
    month[10] = 'November';
    month[11] = 'December';
    return month[n];
};

exports.iGetMonthName = (n) => {
    let month = new Array(12);
    month[0] = 'محرم';
    month[1] = 'صفر';
    month[2] = 'ربيع الاول';
    month[3] = 'ربيع الثاني';
    month[4] = 'جمادي الاول';
    month[5] = 'جمادي الثاني';
    month[6] = 'رجب';
    month[7] = 'شعبان';
    month[8] = 'رمضان';
    month[9] = 'شوال';
    month[10] = 'ذيقعده';
    month[11] = 'ذالحجه';
    return month[n];
};

exports.iGetWeekDayName = (n) => {
    let day = new Array(7);
    day[1] = 'دوشنبه';
    day[2] = 'سه‌شنبه';
    day[3] = 'چهارشنبه';
    day[4] = 'پنجشنبه';
    day[5] = 'جمعه';
    day[6] = 'شنبه';
    day[0] = 'یکشنبه';
    return day[n];
};

exports.jGetMonthName = (n) => {
    let month = new Array(12);
    month[1] = 'فروردین';
    month[2] = 'اردیبهشت';
    month[3] = 'خرداد';
    month[4] = 'تیر';
    month[5] = 'مرداد';
    month[6] = 'شهریور';
    month[7] = 'مهر';
    month[8] = 'آبان';
    month[9] = 'آذر';
    month[10] = 'دی';
    month[11] = 'بهمن';
    month[12] = 'اسفند';
    return month[n];
};

exports.jGetMonthNumber = (name) => {
    let month = new Array(12);
    month['فروردین'] = 1;
    month['اردیبهشت'] = 2;
    month['خرداد'] = 3;
    month['تیر'] = 4;
    month['مرداد'] = 5;
    month['شهریور'] = 6;
    month['مهر'] = 7;
    month['آبان'] = 8;
    month['آذر'] = 9;
    month['دی'] = 10;
    month['بهمن'] = 11;
    month['اسفند'] = 12;
    return month[name];
};

exports.toObj = (obj) => {
    if (obj === undefined) return {};
    return JSON.parse(JSON.stringify(obj));
};

exports.timestampToJalali = (time) => {
    let date = new Date(time);
    return jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

exports.timestampToFullJalali = (timestamp) => {
    let jdate = this.timestampToJalali(timestamp);
    let day = new Date(timestamp * 1000).getDay();
    let time = {};
    time.dayName = this.iGetWeekDayName(day);
    time.monthName = this.jGetMonthName(jdate.jm);
    time.month = jdate.jm;
    time.year = jdate.jy;
    time.day = jdate.jd;
    return time;
};

exports.DisplayTextWithoutMentions = (inputText) => {
    if (inputText === "") return "";
    const retLines = inputText.split("\n");
    let formattedText = "";
    retLines.forEach((retLine, rowIndex) => {
        const mentions = this.FindPatterns(retLine);
        if (mentions.length) {
            let lastIndex = 0;
            mentions.forEach((men, index) => {
                const initialStr = retLine.substring(lastIndex, men.start);
                lastIndex = men.end + 1;
                formattedText += initialStr;
                formattedText += `${men.type}${men.title}`;
                if (mentions.length - 1 === index) {
                    formattedText += retLine.substr(lastIndex); //remaining string
                }
            });
        } else {
            formattedText += retLine;
        }
        if (rowIndex < retLines.length - 1)
            formattedText += "\n";
    });
    return formattedText || "";
};

exports.FindPatterns = (val) => {
    /**
     * Both Mentions and Selections are 0-th index based in the strings
     * meaning their indexes in the string start from 0
     * findMentions finds starting and ending positions of mentions in the given text
     * @param val string to parse to find mentions
     * @returns list of found mentions
     */
    let reg = /([@|#|https]+?)\[title:([^\]]+?)\]/gim;
    let indexes = [];
    while ((match = reg.exec(val))) {
        indexes.push({
            start: match.index,
            end: reg.lastIndex - 1,
            type: match[1],
            title: match[2]
        });
    }
    return indexes;
};


exports.mobileNumberValidation = (phoneNumber) => {
    const re = /^09\d{9}$/;
    return re.test(String(phoneNumber));
};

exports.activeCodeValidation = (code) => {
    const re = /\d{6,7}$/;
    return re.test(String(code));
};

exports.listToTree = (list) => {
    let map = {}, node, roots = [], i;

    for (i = 0; i < list.length; i++) {
        map[list[i]._id] = i;
        list[i].children = [];
    }

    for (i = 0; i < list.length; i++) {
        node = list[i];
        if (node.parent === '0' || typeof node.parent === "undefined") roots.push(node);
        else list[map[node.parent]].children.push(node);
    }
    return roots;
}
