exports.getDate = function () {
    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    // tell javascript to set the dateString
    var day = today.toLocaleDateString("en-US", options);
    return day;
}


exports.getDay = function () {
    var today = new Date();

    var options = {
        weekday: "long"
    }

    // tell javascript to set the dateString
    var day = today.toLocaleDateString("en-US", options);
    return day;
}