$(document).ready(function () {
    let post = JSON.parse($("#postValue").val());

    $("#postTime").text(timeAgoTranslate(moment(post.createdAt).fromNow()));
    let price = "توافقی";
    if (post && post.fieldsValue && post.fieldsValue.price && post.fieldsValue.price.v) {
        price = post.fieldsValue.price.v;
        price = latinNumToPersianNum(DivideNumber3Digits(price)) + " تومان";
    }
    $("#priceValue").text(price);
});

function timeAgoTranslate(time) {
    time = time.replace("in a few", "a few");
    time = time.replace("a few", "چند");
    time = time.replace("a minute", "یک دقیقه");
    time = time.replace("an hour", "ساعت");
    time = time.replace("a day", "یک روز");
    time = time.replace("a month", "یک ماه");
    time = time.replace("a year", "یک سال");
    time = time.replace("seconds", "ثانیه");
    time = time.replace("minutes", "دقیقه");
    time = time.replace("hours", "ساعت");
    time = time.replace("days", "روز");
    time = time.replace("months", "ماه");
    time = time.replace("years", "سال");
    time = time.replace("ago", "پیش");
    return latinNumToPersianNum(time);
}

const persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"];
const latinNumbersMap = [/1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g, /0/g];

function latinNumToPersianNum(num = "") {
    num = num.toString();
    for (let i = 0; i < 10; i++) {
        num = num.replace(latinNumbersMap[i], persianNumbers[i]);
    }
    return num;
}

function DivideNumber3Digits(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
