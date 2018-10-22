jQuery(document).ready(function () {
    if (jQuery(window).width() < 1200) {
        jQuery("#topbar").css("display", "block");
        jQuery("#sidebar").css("display", "none");
    } else {
        jQuery("#topbar").css("display", "none");
        jQuery("#sidebar").css("display", "block");
    }
});
jQuery(window).resize(function () {
    if (jQuery(window).width() < 1200) {
        jQuery("#topbar").css("display", "block");
        jQuery("#sidebar").css("display", "none");
       
    } else {
        jQuery("#topbar").css("display", "none");
        jQuery("#sidebar").css("display", "block");
        
    }
});