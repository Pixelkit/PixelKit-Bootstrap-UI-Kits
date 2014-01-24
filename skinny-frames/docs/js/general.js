jQuery(document).ready(function() {
 	var $ = jQuery;
    var $window = $(window);
    var $body = $(document.body);

    $(".example-item").addClass("gradient");

    $(".example:not(:has(.example-code))").addClass('no-code');
    $(".example:not(:has(.example-item))").addClass('no-item');

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

});