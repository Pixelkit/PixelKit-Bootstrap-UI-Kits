jQuery(document).ready(function() {
 	var $ = jQuery;
    var screenRes = $(window).width();

    $("[href=#]").click(function(event){
        event.preventDefault();
    });

// Remove outline in IE
	$("a, input, textarea").attr("hideFocus", "true").css("outline", "none");

// buttons
    $(".btn").not(".btn-hover").hover(function(){
        $(this).stop().animate({"opacity": 0.7});
    },function(){
        $(this).stop().animate({"opacity": 1});
    });
    $('a.btn, span.btn').on('mousedown', function(){
        $(this).addClass('active')
    });
    $('a.btn, span.btn').on('mouseup mouseout', function(){
        $(this).removeClass('active')
    });

// style Select, Radio, Checkbox
    if ($("select").hasClass("select_styled")) {
        cuSel({changedEl: ".select_styled", visRows: 10});
    }
    if ($("div,p").hasClass("input_styled")) {
        $(".input_styled input").customInput();
    }

// NavBar Parents Arrow
    $(".dropdown ul").parent("li").addClass("parent");
// NavBar
    $(".dropdown ul li:first-child, .cusel span:first-child").addClass("first");
    $(".dropdown ul li:last-child, .cusel span:last-child").addClass("last");

// Accordion
$('.panel').not(':even').addClass('even');
$('.panel').not(':odd').addClass('odd');
$('.panel:last-child').addClass('last');
$('.panel:last-child .accordion-heading .accordion-toggle').addClass('collapsed');

$('.accordion-toggle').click(function() {
    setTimeout(function () {
        $('.accordion-body').parent().removeClass('opened');
        $('.accordion-body.collapsing, .accordion-body.in').parent().addClass('opened');
    }, 0);
    setTimeout(function () {
    $('.accordion-body.collapse').parent().removeClass('opened');
    }, 400);
});

// Tabs
var $tabs_on_page = $('.tabs').length;
var $bookmarks = 0;

for(var i = 1; i <= $tabs_on_page; i++){
    $('.tabs').eq(i-1).addClass('tab_id'+i);
    $bookmarks = $('.tab_id'+i+' li').length;
    $('.tab_id'+i).addClass('bookmarks'+$bookmarks);
};

$('.tabs li, .payment-form .btn').click(function() {
    setTimeout(function () {
        for(var i = 1; i <= $tabs_on_page; i++){
            $bookmarks = $('.tab_id'+i+' li').length;
            for(var j = 1; j <= $bookmarks; j++){
                $('.tab_id'+i).removeClass('active_bookmark'+j);

                if($('.tab_id'+i+' li').eq(j-1).hasClass('active')){
                    $('.tab_id'+i).addClass('active_bookmark'+j);
                }
            }
        }
    }, 0)
});

// Payment Form
$('.payment-form #billing .btn-right, .payment-form #payment .btn-left').click(function() {
    $('a[href="#shipping"]').tab('show');
});
$('.payment-form #shipping .btn-left').click(function() {
    $('a[href="#billing"]').tab('show');
});
$('.payment-form #shipping .btn-right').click(function() {
    $('a[href="#payment"]').tab('show');
});

// Service List 2
$('.service_list_2 .service_item').not(':even').addClass('even');
$('.service_list_2 .service_item').not(':odd').addClass('odd');

// prettyPhoto lightbox, check if <a> has atrr data-rel and hide for Mobiles
    if($('a').is('[data-rel]') && screenRes > 600) {
        $('a[data-rel]').each(function() {
            $(this).attr('rel', $(this).data('rel'));
        });
        $("a[rel^='prettyPhoto']").prettyPhoto({social_tools:false});
    };

// Smooth Scroling of ID anchors
    function filterPath(string) {
        return string
            .replace(/^\//,'')
            .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
            .replace(/\/$/,'');
    }
    var locationPath = filterPath(location.pathname);
    var scrollElem = scrollableElement('html', 'body');

    $('a[href*=#].anchor').each(function() {
        $(this).click(function(event) {
            var thisPath = filterPath(this.pathname) || locationPath;
            if (  locationPath == thisPath
                && (location.hostname == this.hostname || !this.hostname)
                && this.hash.replace(/#/,'') ) {
                var $target = $(this.hash), target = this.hash;
                if (target && $target.length != 0) {
                    var targetOffset = $target.offset().top;
                    event.preventDefault();
                    $(scrollElem).animate({scrollTop: targetOffset}, 400, function() {
                        location.hash = target;
                    });
                }
            }
        });
    });

    // use the first element that is "scrollable"
    function scrollableElement(els) {
        for (var i = 0, argLength = arguments.length; i <argLength; i++) {
            var el = arguments[i],
                $scrollElement = $(el);
            if ($scrollElement.scrollTop()> 0) {
                return el;
            } else {
                $scrollElement.scrollTop(1);
                var isScrollable = $scrollElement.scrollTop()> 0;
                $scrollElement.scrollTop(0);
                if (isScrollable) {
                    return el;
                }
            }
        }
        return [];
    }

// Footer Divs
$('.footer_top_left, .footer_top_right').css("width", (screenRes-940)/2+'px');
$(window).resize(function() {
    screenRes = $(window).width();
    $('.footer_top_left, .footer_top_right').css("width", (screenRes-940)/2+'px');
});

// Audio Player
var $players_on_page = $('.jp-audio').length;
var $song_title = '';

for(var i = 1; i <= $players_on_page; i++){
    $('.jp-audio').eq(i-1).addClass('jp-audio'+i);
};

if($players_on_page > 0){
    for(var i = 1; i <= $players_on_page; i++){
        $('.jp-audio').eq(i-1).addClass('jp-audio'+i);
    };

    setTimeout(function () {
        for(var i = 1; i <= $players_on_page; i++){
            $song_title = $('.jp-audio'+i+' .jp-playlist ul li.jp-playlist-current span').html();
            $('.jp-audio'+i+' .song_title').html($song_title);
        };
    }, 500);

    function switchSong() {
        setTimeout(function () {
            for(var i = 1; i <= $players_on_page; i++){
                $('.jp-audio'+i+' .jp-previous, .jp-audio'+i+' .jp-next').removeClass('disabled');

                if ($('.jp-audio'+i+' .jp-playlist ul li:last-child').hasClass('jp-playlist-current')) {
                    $('.jp-audio'+i+' .jp-next').addClass('disabled');
                }
                if ($('.jp-audio'+i+' .jp-playlist ul li:first-child').hasClass('jp-playlist-current')) {
                    $('.jp-audio'+i+' .jp-previous').addClass('disabled');
                }
                $song_title = $('.jp-audio'+i+' .jp-playlist ul li.jp-playlist-current .jp-playlist-item').html();
                $('.jp-audio'+i+' .song_title').html($song_title);
            }
        }, 0)
    };

    $('.jp-previous, .jp-next, .jp-playlist ul').click(function() {
        switchSong()
    });
    $(".jp-jplayer").on($.jPlayer.event.ended, function(event) {
        switchSong()
    });
};

$(".widget-audio.style3 .jp-interface .song_title").click(function () {
    var $this = $(this);
    for(var i = 1; i <= $players_on_page; i++){
        if ($this.parents('.jp-audio').hasClass('jp-audio'+i)) {
            $('.jp-audio'+i+' .jp-playlist').slideToggle("slow");
        }
    }
});

// Scroll Bars
var $scrolls_on_page = $('.scrollbar.style6').length;
var $scroll_height = 0;

for(var i = 1; i <= $scrolls_on_page; i++){
    $('.scrollbar.style6').eq(i-1).addClass('id'+i);
};

setTimeout(function () {
    $(".jspTrack").append("<div class='jspProgress'></div>");
    $(document).on('jsp-scroll-y','.scrollbar.style6',function(){
        for(var i = 1; i <= $scrolls_on_page; i++){
            $scroll_height = $('.scrollbar.style6.id'+i+' .jspDrag').css('top');
            $('.scrollbar.style6.id'+i+' .jspDrag').siblings(".jspProgress").css({"height":parseInt($scroll_height, 10)+10+"px"});
        }
    });
}, 0);

// Placeholders
setTimeout(function () {
    if($("[placeholder]").size() > 0) {
		$.Placeholder.init({ color : "#ededed" });
	}	
}, 0);

// Rating Stars
$(".rating span.star").hover(
    function() {
        $('.rating span.star').removeClass('on').addClass('off');
        $(this).prevAll().addClass( 'over' );
    }
    , function() {
        $(this).removeClass( 'over' );
    }
);

$(".rating").mouseleave(function(){
    $(this).parent().find('.over')
        .removeClass('over');
});

$( ".rating span.star" ).click( function() {
    $(this).prevAll().removeClass('off').addClass('on');
    $(this).removeClass('off').addClass('on');
});


});