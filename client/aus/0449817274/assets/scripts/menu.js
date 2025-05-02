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
        $("#menu-dropdown-items").removeClass("l-none").addClass("l-0");
        $("#menu-dropdown-toggle").addClass("open");
    }

    function hideMenu(){
        $("#menu-dropdown-items").removeClass("l-0").addClass("l-none");
        $("#menu-dropdown-toggle").removeClass("open");
    }



});

