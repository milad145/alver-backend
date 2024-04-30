exports.errorCode = (code) => {
    let error = {};

    // default
    error[400] = {message: "مقادیر ارسالی اشتباه است.", code: 400};
    error[401] = {message: "برای دسترسی به این اطلاعات ابتدا وارد حساب کاربری خود شوید.", code: 401};
    error[403] = {message: "عدم دسترسی", code: 403};
    error[404] = {message: "یافت نشد", code: 404};

    // app > 1100
    error[1001] = {
        message: "نسخه استفاده شده توسط شما پشتیبانی نمی‌شود. برای استفاده از برنامه لطفا آن را بروزرسانی نمایید.",
        code: 426
    };

    // category > 1100
    error[1101] = {message: "مقادیر ارسالی اشتباه می‌باشد.", code: 400};

    // field > 1200
    error[1201] = {message: "مقادیر ارسالی اشتباه می‌باشد.", code: 400};

    // post > 1300
    error[1301] = {message: "مقادیر ارسالی اشتباه می‌باشد.", code: 400};
    error[1302] = {message: "آگهی یافت نشد. امکان دارد که آگهی منقضی یا حذف شده باشد.", code: 404};
    error[1303] = {message: "آگهی یافت نشد.", code: 403};
    error[1304] = {
        message: "حداکثر ثبت آگهی رایگان برای یک روز ۵ آگهی می‌باشد.",
        code: 403
    };

    // file > 1500
    error[1501] = {message: "حجم فایل ارسال شده بیشتر از حجم تعیین شده است.", code: 400};
    error[1502] = {message: "فایل مورد نظر یافت نشد.", code: 404};

    // user > 2000
    error[2001] = {message: "The username or email is already registered", code: 409};
    error[2002] = {message: "required filed is necessary", code: 400};
    error[2003] = {message: "password must be at least 6 character", code: 406};
    error[2004] = {message: "کد تایید نادرست می‌باشد.", code: 404};
    error[2005] = {message: "Wrong email", code: 403};
    error[2006] = {message: "User not found", code: 404};
    error[2007] = {message: "مقادیر ارسالی اشتباه می‌باشد.", code: 400};
    error[2008] = {message: "تعداد درخواست های شما بیش از حد مجاز است.", code: 429};


    let response = error[code] || {};
    // return new Error(JSON.stringify({
    //     code: response.code || 500,
    //     message: response.message || '',
    //     messageCode: code || ''
    // }));
    let err = new Error();
    err["responseCode"] = response.code || 500;
    err["message"] = response.message || "";
    err["messageCode"] = code || "";
    return err;
};
