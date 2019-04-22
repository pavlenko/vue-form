VForm.validators.required = function (value) {
    if (typeof value === 'string') {
        return !!String(value).trim().length;
    } else {
        return !!value;
    }
};

VForm.validators.email = function (value) {
    return true;//TODO
};

VForm.validators.phone = function (value) {
    return true;//TODO
};

VForm.validators.min_length = function (value, options) {
    return true;//TODO
};

VForm.validators.max_length = function (value, options) {
    return true;//TODO
};

VForm.validators.min_value = function (value, options) {
    return true;//TODO
};

VForm.validators.max_value = function (value, options) {
    return true;//TODO
};
