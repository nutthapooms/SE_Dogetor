jQuery(document).ready(function () {
    if (jQuery(window).width() < 1200) {
        jQuery("#topbar").css("display", "block");
        jQuery("#sidebar").css("display", "none");
        jQuery("#dayacro").css("display", "table-row");
        jQuery("#dayfull").css("display", "none");
    } else {
        jQuery("#topbar").css("display", "none");
        jQuery("#sidebar").css("display", "block");
        jQuery("#dayfull").css("display", "table-row");
        jQuery("#dayacro").css("display", "none");
    }
});
jQuery(window).resize(function () {
    if (jQuery(window).width() < 1200) {
        jQuery("#topbar").css("display", "block");
        jQuery("#sidebar").css("display", "none");
        jQuery("#dayacro").css("display", "table-row");
        jQuery("#dayfull").css("display", "none");
       
    } else {
        jQuery("#topbar").css("display", "none");
        jQuery("#sidebar").css("display", "block");
        jQuery("#dayfull").css("display", "table-row");
        jQuery("#dayacro").css("display", "none");
        
    }
});



