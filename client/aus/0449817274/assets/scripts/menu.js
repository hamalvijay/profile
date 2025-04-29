$(document).ready(function(){
    hideMenu();
    $(document).on('click', '#menu-dropdown-toggle', function(event){
        if ($("#menu-dropdown-items").hasClass("l-0")) {
            hideMenu();
        } else {
            showMenu();
        }
    });

    $(document).on('click', '#menu-dropdown-items a', function(event){
        hideMenu();
    });

    function showMenu(){
        var $menu = $("#menu-dropdown-items");
        $menu.removeClass("l-none").addClass("l-0");
    }

    function hideMenu(){
        var $menu = $("#menu-dropdown-items");
        $menu.removeClass("l-0").addClass("l-none");
    }

});

