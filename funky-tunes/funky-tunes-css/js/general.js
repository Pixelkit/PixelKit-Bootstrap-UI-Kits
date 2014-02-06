jQuery(document).ready(function() {
 	var $ = jQuery;
    var screenRes = $(window).width(),
        screenHeight = $(window).height(),
        html = $('html');

// IE<8 Warning
    if (html.hasClass("ie7")) {
        $("body").empty().html('Please, Update your Browser to at least IE8');
    }

// Disable Empty Links
    $("[href=#]").click(function(event){
        event.preventDefault();
    });

// Body Wrap
    $(".body-wrap").css("min-height", screenHeight);
    $(window).resize(function() {
        screenHeight = $(window).height();
        $(".body-wrap").css("min-height", screenHeight);
    });

// Remove outline in IE
	$("a, input, textarea").attr("hideFocus", "true").css("outline", "none");

// buttons
	$('a.btn, span.btn').on('mousedown', function(){
		$(this).addClass('active')
	});
	$('a.btn, span.btn').on('mouseup mouseout', function(){
		$(this).removeClass('active')
	});

// styled Select, Radio, Checkbox
    if ($("select").hasClass("select_styled")) {
        cuSel({changedEl: ".select_styled", visRows: 8, scrollArrows: true});
    }
    if ($("div,p").hasClass("input_styled")) {
        $(".input_styled input").customInput();
    }

// Menu
    $(".menu ul").parents("li").addClass("parent");

    $(".menu li").hover(function(){
        $(this).addClass('hover');
    },function(){
        $(this).removeClass('hover');
    });

// Tabs
    var $tabs_on_page = $('.tabs').length;
    var $bookmarks = 0;

    for(var i = 1; i <= $tabs_on_page; i++){
        $('.tabs').eq(i-1).addClass('tab-id'+i);
        $bookmarks = $('.tab-id'+i+' li').length;
        $('.tab-id'+i).addClass('bookmarks'+$bookmarks);
    };

    $('.tabs li, .payment-form .btn').click(function() {
        setTimeout(function () {
            for(var i = 1; i <= $tabs_on_page; i++){
                $bookmarks = $('.tab-id'+i+' li').length;
                for(var j = 1; j <= $bookmarks; j++){
                    $('.tab-id'+i).removeClass('active-bookmark'+j);

                    if($('.tab-id'+i+' li').eq(j-1).hasClass('active')){
                        $('.tab-id'+i).addClass('active-bookmark'+j);
                    }
                }
            }
        }, 0)
    });

// Post Tabs
    var postTabsLenght = $('.post-tabs').length,
        tabHeight;

    function tabsHeight() {
        if(postTabsLenght > 0) {
            for(var i = 1; i <= postTabsLenght; i++) {
                $('.post-tabs').eq(i-1).attr('id', 'post-tabs'+i);
                tabHeight = $('#post-tabs'+i+' .post-item.active').height();
                $('#post-tabs'+i+' .post-tabs-bookmarks ul').css('height', tabHeight);
            }
        }
    }

    $(window).load(function() {
        tabsHeight()
    });
    $(window).resize(function() {
        tabsHeight()
    });

    $('.post-tabs-bookmarks li').click(function() {
        var $this = $(this),
            index = $this.index();
        $this.parents().children().removeClass('active');
        $this.addClass('active');
        $this.parents(".post-tabs").children(".post-tabs-content").children().removeClass('active');
        $this.parents(".post-tabs").children(".post-tabs-content").children().eq(index).addClass('active');

        tabHeight = $this.parents(".post-tabs").children(".post-tabs-content").children(".post-item.active").height();
        $this.parents('.post-tabs-bookmarks ul').css('height', tabHeight);
    });

// Chart Tabs
    $('.chart-links .music').click(function() {
        $('.widget-top3chart .video').removeClass('active');
        $('.widget-top3chart .music').addClass('active');
    });
    $('.chart-links .video').click(function() {
        $('.widget-top3chart .music').removeClass('active');
        $('.widget-top3chart .video').addClass('active');
    });

// Payment Form
    $('.payment-form #billing .btn-next, .payment-form #payment .btn-prev').click(function() {
        $('a[href="#shipping"]').tab('show');
    });
    $('.payment-form #shipping .btn-prev').click(function() {
        $('a[href="#billing"]').tab('show');
    });
    $('.payment-form #shipping .btn-next').click(function() {
        $('a[href="#payment"]').tab('show');
    });
    // Reinit Expiration date fields
    $('#payment, .btn-prev, .btn-next').click(function(){
        cuSelRefresh({
            refreshEl: "#expiration-month, #expiration-year",
            visRows: 8
        });
    });

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
    };

// Audio Player
    var playersOnPage = $('.jp-audio').length,
        songTitle = '',
        songImage = '',
        songImageHeight = 0;

    if(playersOnPage > 0){
        for(var i = 1; i <= playersOnPage; i++){
            $('.jp-audio').eq(i-1).addClass('jp-audio'+i);
        };

        $(window).load(function () {
            for(var i = 1; i <= playersOnPage; i++) {
                songTitle = $('.jp-audio'+i+' .jp-playlist ul li.jp-playlist-current .jp-playlist-item .item-title').html();
                songImage = $('.jp-audio'+i+' .jp-playlist ul li.jp-playlist-current .jp-playlist-item .item-image').html();
                $('.jp-audio'+i+' .song-title').html(songTitle);
                $('.jp-audio'+i+' .song-image').html(songImage);

                songImageHeight = $('.jp-audio'+i+' .song-image').width()*0.545;
                $('.jp-audio'+i+' .song-image').css('min-height', songImageHeight);
            };
        });

        $(window).resize(function() {
            for(var i = 1; i <= playersOnPage; i++) {
                songImageHeight = $('.jp-audio'+i+' .song-image').width()*0.545;
                $('.jp-audio'+i+' .song-image').css('min-height', songImageHeight);
            };
        });

        // Switch Song
        function switchSong() {
            setTimeout(function () {
                for(var i = 1; i <= playersOnPage; i++) {
                    $('.jp-audio'+i+' .jp-previous, .jp-audio'+i+' .jp-next').removeClass('disabled');

                    if ($('.jp-audio'+i+' .jp-playlist ul li:last-child').hasClass('jp-playlist-current')) {
                        $('.jp-audio'+i+' .jp-next').addClass('disabled');
                    }
                    if ($('.jp-audio'+i+' .jp-playlist ul li:first-child').hasClass('jp-playlist-current')) {
                        $('.jp-audio'+i+' .jp-previous').addClass('disabled');
                    }
                    songTitle = $('.jp-audio'+i+' .jp-playlist ul li.jp-playlist-current .jp-playlist-item .item-title').html();
                    songImage = $('.jp-audio'+i+' .jp-playlist ul li.jp-playlist-current .jp-playlist-item .item-image').html();
                    $('.jp-audio'+i+' .song-title').html(songTitle);
                    $('.jp-audio'+i+' .song-image').html(songImage);
                }
            }, 0)
        };

        $('.jp-previous, .jp-next, .jp-playlist ul').click(function() {
            switchSong();
            $(".albums-item, .chart-item").removeClass("active");
            $(this).closest(".albums-item, .chart-item").addClass("active");
        });
        $('.jp-play, .cp-play').click(function() {
            $(".albums-item, .chart-item").removeClass("active");
            $(this).closest(".albums-item, .chart-item").addClass("active");
        });
        $(".jp-jplayer").on($.jPlayer.event.ended, function(event) {
            switchSong()
        });

        // Toggle Playlist
        $(".jp-playlist-toggle").click(function () {
            var $this = $(this);
            for(var i = 1; i <= playersOnPage; i++){
                if ($this.parents('.jp-audio').hasClass('jp-audio'+i)) {
                    $('.jp-audio'+i+' .jp-playlist').slideToggle("slow");
                }
            }
        });
    };

// Rating Stars
    var star = $(".rating span.star");

    star.hover(
        function() {
            $(this).addClass("over");
            $(this).prevAll().addClass("over");
        }
        , function() {
            $(this).removeClass("over");
            $(this).prevAll().removeClass("over");
        }
    );
    star.click( function() {
        $(this).parent().children(".star").removeClass("voted");
        $(this).prevAll().addClass("voted");
        $(this).addClass("voted");
    });

// Crop Images in Image Slider

    // adds .naturalWidth() and .naturalHeight() methods to jQuery for retrieving a normalized naturalWidth and naturalHeight.
    (function($){
        var
            props = ['Width', 'Height'],
            prop;

        while (prop = props.pop()) {
            (function (natural, prop) {
                $.fn[natural] = (natural in new Image()) ?
                    function () {
                        return this[0][natural];
                    } :
                    function () {
                        var
                            node = this[0],
                            img,
                            value;

                        if (node.tagName.toLowerCase() === 'img') {
                            img = new Image();
                            img.src = node.src,
                                value = img[prop];
                        }
                        return value;
                    };
            }('natural' + prop, prop.toLowerCase()));
        }
    }(jQuery));

    var
        carousels_on_page = $('.carousel-inner').length,
        carouselWidth,
        carouselHeight,
        ratio,
        imgWidth,
        imgHeight,
        imgRatio,
        imgMargin,
        this_image,
        images_in_carousel;

    for(var i = 1; i <= carousels_on_page; i++){
        $('.carousel-inner').eq(i-1).addClass('id'+i);
    }

    function imageSize() {
        setTimeout(function () {
            for(var i = 1; i <= carousels_on_page; i++){
                carouselWidth = $('.carousel-inner.id'+i+' .item').width();
                carouselHeight = $('.carousel-inner.id'+i+' .item').height();
                ratio = carouselWidth/carouselHeight;

                images_in_carousel = $('.carousel-inner.id'+i+' .item img').length;

                for(var j = 1; j <= images_in_carousel; j++){
                    this_image = $('.carousel-inner.id'+i+' .item img').eq(j-1);
                    imgWidth = this_image.naturalWidth();
                    imgHeight = this_image.naturalHeight();
                    imgRatio = imgWidth/imgHeight;

                    if(ratio <= imgRatio){
                        imgMargin = parseInt((carouselHeight/imgHeight*imgWidth-carouselWidth)/2, 10);
                        this_image.css("cssText", "height: "+carouselHeight+"px; margin-left:-"+imgMargin+"px;");
                    }
                    else{
                        imgMargin = parseInt((carouselWidth/imgWidth*imgHeight-carouselHeight)/2, 10);
                        this_image.css("cssText", "width: "+carouselWidth+"px; margin-top:-"+imgMargin+"px;");
                    }
                }
            }
        }, 0);
    }

    $(window).load(function(){
        imageSize();
    });
    $(window).resize(function() {
        $('.carousel-indicators li:first-child').click();
        imageSize();
    });

});