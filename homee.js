jQuery(document).ready(function () {
    if (jQuery(window).width() < 1200) {
        jQuery("#sidebar").css("display", "none");
    } else {
        jQuery("#sidebar").css("display", "block");
    }
});
jQuery(window).resize(function () {
    if (jQuery(window).width() < 1200) {
        jQuery("#sidebar").css("display", "none");
    } else {
        jQuery("#sidebar").css("display", "block");
    }
});