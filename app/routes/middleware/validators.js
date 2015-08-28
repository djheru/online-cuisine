var _ = require('underscore'),
    isBson = function (val) {
    return val.match(/^[0-9a-fA-F]{24}$/);
};

module.exports = {
    isEmptyOrInt: function () {
        return (value === '' || !isNaN(parseInt(value)));
    },
    isEmptyOrNumber: function (value) {
        return (value === '' || !isNaN(parseFloat(value)));
    },
    isEmptyOrBsonOrBsonArray: function (value) {
        var isBsonArray = true;

        if (value === [] || value === null || value === '' || value === false || typeof value === 'undefined') {
            return true;
        }
        if (value.constructor !== Array) {
            value = [ value ];
        }
        _.each(value, function (supposedBson) {
            if (!isBson(supposedBson)) {
                isBsonArray = false;
            }
        });
        return isBsonArray;
    }
};
