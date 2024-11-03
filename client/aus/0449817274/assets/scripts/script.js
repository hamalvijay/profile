
$(document).ready(function(){
    const currentMenu = "Home";
    //choose default current menu
    changeMenu(currentMenu);
    //expand collapse menu
    $(".menu-btn").click(function(){
        $('.show, .hide').toggleClass('show hide');
        $(".nav-list-mobile").toggleClass("nav-list-mobile-show");
    });

    //change current menu
    $(".nav-list span, .nav-list-mobile span").click(function(){
        const menuText = $(this)[0].querySelector("a")?.textContent.trim().toLowerCase();
        changeMenu(menuText);
    });
    
});


function changeMenu(currentMenu){
    const navList = ['.nav-list span', '.nav-list-mobile span'];
    navList.forEach(function(nav){
        document.querySelectorAll(nav).forEach(function(menu) {
            if(menu.querySelector("a")?.textContent.trim().toLowerCase() == currentMenu.toLowerCase()){
                menu.classList.add("active");
            }
            else{
                menu.classList.remove("active");
            }
            if(currentMenu.toLowerCase() == "home"){
                window.scrollTo({top : 0, behavior: "smooth"});
            }
        });

        
    });
    var navMobileDiv =  document.querySelectorAll(".nav-mobile")[0];
    if(navMobileDiv.classList.contains("nav-list-mobile-show")){
        navMobileDiv.classList.remove("nav-list-mobile-show");
        var menuBtn = document.querySelector(".menu-btn");
        var showImage = menuBtn.querySelector(".show");
        var hideImage = menuBtn.querySelector(".hide");
        showImage.classList.remove("show");
        showImage.classList.add("hide");

        hideImage.classList.remove("hide");
        hideImage.classList.add("show");
    }
}