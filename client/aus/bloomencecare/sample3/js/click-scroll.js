var sectionArray = ["top", "about", "services", "career", "contact"];

// $.each(sectionArray, function(index, value){
//     $('.click-scroll').eq(index).click(function(e){
//         var offsetClick = $('#' + 'section_' + value).offset().top - 90;
//         e.preventDefault();
//         $('html, body').animate({
//             scrollTop: offsetClick
//         }, 300);
//     });
// });

$(document).scroll(function(){
    var docScroll = $(document).scrollTop() + 1;

    $.each(sectionArray, function(index, value){
        var offsetSection = $('#' + 'section_' + value).offset().top - 90;

        if (docScroll >= offsetSection) {
            $('.navbar-nav .nav-item .nav-link').removeClass('active').removeClass('fw-bold').addClass('inactive');
            $('.navbar-nav .nav-item .nav-link').eq(index).addClass('active').addClass('fw-bold').removeClass('inactive');
        }
    });
});
