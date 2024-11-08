function getList(){
    return [
        {
            title : "VSolutions sample website",
            client : "VSolutions",
            lastUpdated : "Nov 2024",
            source : "../client/aus/0449817274/sample1.html",
            url : "https://vijayhamal.com.np/client/aus/0449817274/sample1.html",
            class : "col-sm-12 col-md-6"
        },
        {
            title : "Personal Website",
            client : "Sanjay Hamal",
            lastUpdated : "Jun 2022",
            source : "https://hamalsanjay.com.np/",
            url : "https://hamalsanjay.com.np/",
            class : "col-sm-12 col-md-6"
        },

    ];
}

var width = 0;

function changeWidth(w){
    width = w;
    $("iframe").each(function() {
        $(this).attr("width", width + "px");
    });
   $(".viewChanger").removeClass("border-bottom-0");

   var view = width>1000 ? "Desktop" : width > 768 ? "Tablet" : "Mobile";
   $(".viewChanger").each(function(){
        const spanText = $(this).find("span").text().trim();
        if(spanText!=view){ $(this).addClass("border-bottom-0");}
   });
}

$(document).ready(function (){
    const list = getList();
    changeWidth(window.innerWidth-100);
    list.forEach(item=> {
        let div = $(`<div class="col-12 mt-5 mb-5 p-1">
            <div class="card border-secondary p-3 bg-dark my-3" >
            <div class="w-100 text-center"><iframe src="${item.source}" width="${width}px" height="500" class="text-center"></iframe></div>
              
              <div class="card-body bg-dark text-white">
                <h5 class="card-title text-uppercase fw-bold">${item.title}</h5>
                <h6 class="card-text ms-3">Client : ${item.client}</h6>
                <h6 class="card-text ms-3">Last Updated : ${item.lastUpdated}</h6>
                <a href="${item.url}" target="_blank" class="btn btn-secondary mt-4">Open in new tab</a>
              </div>
            </div>
          </div>`);

          $("#samples").append(div);
    });
});


