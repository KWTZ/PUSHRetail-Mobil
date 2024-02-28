(function($){
	'use strict'

	$(document).ready(function(){

    $(document).on("click",".hamburger-menu",function() {
        $(this).parent().find('.main-menu').toggleClass('active');
    	  $(this).find('.burger').toggleClass('open');
        $('body').toggleClass('body-hide-menu');
    });

    setTimeout(function() {
        $(".wir-btn").addClass('blind', {}, 500);
        $(".network-inner").addClass('network-inner-blind', {}, 600);
    }, 5000);

    if ($('.owl-carousel').length) {

      $('.owl-carousel').each(function () {
        var owl = $('.owl-carousel');
        var loop_owl = ($(this).data('loop'))?$(this).data('loop'):false;
        $(this).owlCarousel({
          autoplayTimeout: $(this).data('autotime'),
          smartSpeed: $(this).data('speed'),
          autoplay: $(this).data('autoplay'),
          items: $(this).data('carousel-items'),
          nav: $(this).data('nav'),
          dots: $(this).data('dots'),
          loop: loop_owl,
          margin: $(this).data('margin'),

          responsive: {
            0: {
              items: $(this).data('mobile'),
            },
            480: {
              items: $(this).data('large-mobile'),
            },
            768: {
              items: $(this).data('tablet')
            },
            992: {
              items: $(this).data('items')
            }
          }
        });
      });
    }

	});

})(jQuery);