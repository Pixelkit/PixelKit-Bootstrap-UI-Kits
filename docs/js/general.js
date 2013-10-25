jQuery(document).ready(function() {
 	var $ = jQuery;
    var $window = $(window);
    var $body = $(document.body);

    $(".example:not(:has(.example-code))").addClass('no-code');
    $(".example:not(:has(.example-item))").addClass('no-item');

    // Remove Attributes 'hideFocus' and 'style' added in Kit
	$(".example-code a, .example-code input, .example-code textarea").removeAttr("hideFocus style");

    // ScrollSpy
    $body.scrollspy({
        target: '.sidebar-demo',
        offset: 100
    });
    $window.on('load', function() {
        setTimeout(function () {
            $body.scrollspy('refresh')
        }, 1000);
    });

    // Remove additional classes
    $(".example-code li").removeClass("first last parent");

});