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

    initializeCarousel();
    initializeTeam();
    initializeContact();
    initializeContactForm();
    initializeTestimonials();
    initializeTestimonialForm();
});


function initializeCarousel(){
    var carouselData = getCarouselData();
    carouselData.forEach(data=>{
        var sectionId = data["id"];
        if ($('#' + sectionId).length) {
            var carouselId = "carousel_interval_"+sectionId;
            var carouselIndicators = '<div class="carousel-indicators">';
            var carouselInner = '<div class="carousel-inner">';
            
            data["items"].forEach((item,index)=>{
                carouselIndicators += `<button type="button" data-bs-target="#carousel_captions_${sectionId}" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" ${index === 0 ? 'aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>`;
            
                carouselInner += `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}" data-bs-interval="${data.interval}">
                        <img src="${item.image}" class="d-block w-100" alt="...">
                        <div class="carousel-caption d-none d-md-block">
                            <h1 >${item.title}</h1>
                            <p >${item.subtitle}</p>
                        </div>
                        <div class="text-center p-3 d-block d-md-none ">
                            <h1>${item.title}</h1>
                            <p >${item.subtitle}</p>
                        </div>
                    </div>
                `;
            });
            
            carouselIndicators += '</div>';
            carouselInner += '</div>';

            var carouselButtonPrev = `
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                        </button>`;
            var carouselButtonNext = `            
                        <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                        </button>
            `;

            $('#' + carouselId).append(carouselIndicators);
            $('#' + carouselId).append(carouselInner);
            $('#' + carouselId).append(carouselButtonPrev);
            $('#' + carouselId).append(carouselButtonNext);
        }
    });
}

function initializeTeam(){
    var teamData = getTeamData();
    var sectionId = "team";
    if ($('#' + sectionId).length) {
        teamData.forEach(team=>{
            var teamHolderDiv = $('#'+sectionId+' .team-holder');
            var div = `
            <div class="col-md-12 col-lg-4 mt-5">
                <div class="d-flex flex-column align-items-center flex-wrap">
                    <div class="team-image">
                        <img src="${team['image']}">
                    </div>
                    <h3 class="mt-4">${team['name']}</h3>
                    <h6>${team['position']}</h6>
                    <div>${team['occupation']}</div>
                    <div class="my-2"></div>
                    <a 
                        class="d-flex flex-row justify-content-center pointer text-decoration-none text-brandcolor py-1"
                        href="mailto:${team['email']}"
                    >
                        <div class="me-3">🖂</div>                            
                        <div class="flex-grow-1 text-break text-center">${team['email']}</div>
                    </a>
                    <a 
                        class="d-flex flex-row justify-content-center pointer text-decoration-none text-brandcolor py-1"
                        href="tel:${team['phone']}"
                    >
                        <div class="icon me-3">☏</div>                            
                        <div class="flex-grow-1 text-break text-center">${team['phone']}</div>
                    </a>
                    
                </div>
            </div>
            `;

            teamHolderDiv.append(div);
        });
    }
}

//CONTACT DETAILS

function initializeContact(){
    let db = getWebsiteData();
    var config = db?.data?.config;
    if(config!=null){
        const socialKeys = new Set(["linkedin", "facebook", "twitter", "youtube", "instagram"]);
        config.forEach(c=>{
            switch(c.key){
                case "info_email" : 
                    $(".info_email")
                        .html(c.value ?? '')
                        .prop("href", `mailto:${c.value}`);                    
                    break;
                case "phone" : 
                    $(".phone")
                        .html(c.value ?? '')
                        .prop("href", `tel:${c.value}`);
                    break;
                case "address" : 
                    var div = "";
                    (c.value || []).forEach(address => {
                        div += `<div>${address}</div>`;
                    });
                    $("#address").append(div);
                    break;
                default:
                if (socialKeys.has(c.key) && c.value) {
                    $("#connection-div").show();
                    $(".connection-icon-holder").append(getConnectionIcon(c.key, c.value));
                }
                break;
            }
        });
    }
}

// CONTACT FORM
function initializeContactForm(isBlank) {
    $("#submitBtn").addClass("disabled");
    $("#submitBtn").show();
    $("#initializeContactFormBtn").hide();
    $("#dynamicForm").html("");
    $("#formProcessingStatus").hide();

    const formConfig = getContactFormConfigDefinition();

    formConfig.forEach(fieldRow => {
        if (fieldRow.fields.length > 0) {
            let formRow = $('<div class="row"></div>');
            fieldRow.fields.forEach(field => {
                let formGroup = $(`<div class="form-group my-2 ${field.class ?? 'col-12'}"></div>`);
                formGroup.append(`<label for="${field.id}">${field.label} ${field.required ? '*' : ''}</label>`);

                let inputElement;
                if (field.type === 'textarea') {
                    inputElement = $(`<textarea class="form-control" id="${field.id}" placeholder="${field.placeholder}" rows="${field.rows ?? 5}">${isBlank ? '' : field.value ?? ''}</textarea>`);
                } else {
                    inputElement = $(`<input type="${field.type}" class="form-control" id="${field.id}" placeholder="${field.placeholder}" value="${isBlank ? '' : field.value ?? ''}">`);
                }

                if (field.required) inputElement.prop('required', true);

                formGroup.append(inputElement);
                formRow.append(formGroup);
            });
            $('#dynamicForm').append(formRow);
        }
    });

    
    formConfig.forEach(fieldRow => {
        if (fieldRow.fields.length > 0) {
            fieldRow.fields.forEach(field => {
                const $input = $(`#${field.id}`);
                $input.on('input change', function () {
                    validateField($input, field.validation);
                    checkFormValidity();
                });
            });
        }
    });
}

function checkFormValidity() {
    const formConfig = getContactFormConfigDefinition();
    let isFormValid = true;

    formConfig.forEach(fieldRow => {
        if (fieldRow.fields.length > 0) {
            fieldRow.fields.forEach(field => {
                const $input = $(`#${field.id}`);
                validateField($input, field.validation);

                if ($input.hasClass('is-invalid')) {
                    isFormValid = false;
                }
            });
        }
    });

    if (isFormValid) {
        $("#submitBtn").removeClass("disabled");
    } else {
        $("#submitBtn").addClass("disabled");
    }
}

function validateField(input, validation) {
    input.removeClass('is-valid is-invalid');
    input.next('.invalid-feedback').remove();

    if (validation) {
        let isValid = true;

        // Check minLength
        if (validation.minLength && input.val().length < validation.minLength) {
            isValid = false;
        }

        // Check regex pattern
        if (validation.regex && !validation.regex.test(input.val())) {
            isValid = false;
        }

        // Display validation result
        if (isValid) {
            input.addClass('is-valid');
        } else {
            input.addClass('is-invalid');
            input.after(`<div class="invalid-feedback">${validation.errorMessage}</div>`);
        }
    }
}

$(document).on('click', '#submitBtn', function(event){
    if ($(this).hasClass('disabled')) {
        return; 
    }

    let formData = {};
    const formConfig = getContactFormConfigDefinition();

    formConfig.forEach(fieldRow => {
        if (fieldRow.fields.length > 0) {
            fieldRow.fields.forEach(field => {
                formData[field.name] = $(`#${field.id}`).val();
            });
        }
    });
    
    if (formData['First Name'] && formData['Surname']) {
        formData['Full Name'] = `${formData['First Name']} ${formData['Surname']}`;
        delete formData['First Name'];
        delete formData['Surname'];
    }

    formData['route']="contact";

    let keyValuePair = [];
    const Name = "";
    for (let pair of Object.entries(formData)) {
        keyValuePair.push(pair[0] + '=' + encodeURIComponent(pair[1]));
    }
    let formDataString = keyValuePair.join('&');
    
    sendData(formDataString, false);
});


function sendData(formDataString, debug){
    if(debug){
        console.log(formDataString);
        showSuccess();
        $("#initializeContactFormBtn").show(); 
        return;
    }
    $("#formProcessingStatus").show();

    setTimeout(function (){
        $("#formProcessingStatus").hide();
        $("#initializeContactFormBtn").show();
        showSuccess();
    },2000);
}

function showSuccess(){
    $("#dynamicForm").html(`
            <div class='alert alert-brandcolor text-center' role='alert'>
                <div>Please note that this site does not send any of the data during demo, but in reality, it sends your query to the domain's data server and generates below response.</div>
                <div>Thank you. Your response has been received.</div>
                <div>A confirmation email has been sent.</div>
                <div>If you don’t see it within an hour, please check your <strong>spam</strong> folder.</div>
            </div>
        `);
    $("#submitBtn").hide();
}

function showFailure(){
    $("#dynamicForm").append("<div class='alert alert-danger' role='alert'>Sorry, something went wrong. Please try again.</div>");
}

// TESTIMONIALS
$(document).on('click', '.star', function(event){
    var rating = $(this).data('value');

    $("#ratingValue").text(rating);

    // Highlight the stars
    $(".star").each(function() {
        if ($(this).data('value') <= rating) {
            $(this).text('★'); 
        } else {
            $(this).text('☆'); // empty star
        }
    });
});


function initializeTestimonials(){
    $(".testimonialsLoaded").hide();
    const data = getTestimonialData();
    buildTestimonials(data);
}

function buildTestimonials(data){
    $(".testimonialsLoading").hide();
    $(".testimonialsLoaded").show();
    if(data){
        var div="<div class='w-100 text-center text-brandcolor' role='alert'>No testimonials to show.</div>";
        if(data.length>0){
            div="";
            for(var i = 0; i<data.length; i++){
                var item = data[i];
                let name = item["Full Name"];
                let testimonial = item["Testimonial"];
                let rating = parseInt(item["Rating"]) || 0;
                let received = formatDateTime(item["Received"]);

                let stars = '';
                for (let i = 1; i <= 5; i++) {
                    stars += i <= rating ? '★' : '☆';
                }

                let truncatedTestimonial = testimonial;
                if (testimonial.length > 200) {
                    truncatedTestimonial = testimonial.substring(0, 200).trim() + '...';
                }

                div += `
                <div class="col-12 col-md-5">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="card-body d-flex flex-column text-center">
                            <h5 class="card-title fw-bold">${name}</h5>
                            <p class="card-text"><small class="text-muted">${received}</small></p>
                            
                            <p class="card-text fst-italic mt-2" title="${testimonial.replace(/"/g, '&quot;')}">"${truncatedTestimonial}"</p>
                            <div class="text-warning fs-5 mt-auto">
                                ${stars}
                            </div>
                        </div>
                    </div>
                </div>`;                
            }           
        }       

        $("#testimonialsScroller").html(div);
    }
}

function formatDateTime(dateString) {
    const date = new Date(dateString);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    return date.toLocaleString('en-US', options);
}

// TESTIMONIAL FORM

function initializeTestimonialForm(isBlank) {
    $("#submitTestimonial").addClass("disabled");
    $("#submitTestimonial").show();
    $("#testimonialForm").html("");
    $("#testimonialformProcessingStatus").hide();

    const formConfig = getTestimonialformConfigDefinition();

    formConfig.forEach(fieldRow => {
        if (fieldRow.fields.length > 0) {
            let formRow = $('<div class="row"></div>');
            fieldRow.fields.forEach(field => {
                let formGroup = $(`<div class="form-group my-2 ${field.class ?? 'col-12'}"></div>`);
                formGroup.append(`<label for="${field.id}">${field.label} ${field.required ? '*' : ''}</label>`);

                let inputElement;
                if (field.type === 'textarea') {
                    inputElement = $(`<textarea class="form-control" id="${field.id}" placeholder="${field.placeholder}" rows="${field.rows ?? 5}">${isBlank ? '' : field.value ?? ''}</textarea>`);
                } else {
                    inputElement = $(`<input type="${field.type}" class="form-control" id="${field.id}" placeholder="${field.placeholder}" value="${isBlank ? '' : field.value ?? ''}">`);
                }

                if (field.required) inputElement.prop('required', true);

                formGroup.append(inputElement);
                formRow.append(formGroup);
            });
            $('#testimonialForm').append(formRow);
        }
    });

    
    formConfig.forEach(fieldRow => {
        if (fieldRow.fields.length > 0) {
            fieldRow.fields.forEach(field => {
                const $input = $(`#${field.id}`);
                $input.on('input change', function () {
                    validateField($input, field.validation);
                    checkTestimonialFormValidity();
                });
            });
        }
    });
}

function checkTestimonialFormValidity() {
    const formConfig = getTestimonialformConfigDefinition();
    let isFormValid = true;

    formConfig.forEach(fieldRow => {
        if (fieldRow.fields.length > 0) {
            fieldRow.fields.forEach(field => {
                const $input = $(`#${field.id}`);
                validateField($input, field.validation);

                if ($input.hasClass('is-invalid')) {
                    isFormValid = false;
                }
            });
        }
    });

    if (isFormValid) {
        $("#submitTestimonial").removeClass("disabled");
    } else {
        $("#submitTestimonial").addClass("disabled");
    }
}

$(document).on('click', '#submitTestimonial', function(event){

    if ($(this).hasClass('disabled')) {
        return; 
    }

    let formData = {};
    formData["Rating"] = $("#ratingValue").html();
    const formConfig = getTestimonialformConfigDefinition();

    formConfig.forEach(fieldRow => {
        if (fieldRow.fields.length > 0) {
            fieldRow.fields.forEach(field => {
                formData[field.name] = $(`#${field.id}`).val();
            });
        }
    });
    
    let keyValuePair = [];
    const Name = "";
    for (let pair of Object.entries(formData)) {
        keyValuePair.push(pair[0] + '=' + encodeURIComponent(pair[1]));
    }

    
    let formDataString  = keyValuePair.join('&');
    sendTestimonialData(formDataString, false);
});


function sendTestimonialData(formDataString, debug){
    if(debug){
        console.log(formDataString);
        showTestimonialSuccess();
        return;
    }
    $("#testimonialformProcessingStatus").show();
    setTimeout(function (){
        $("#testimonialformProcessingStatus").hide();
        showTestimonialSuccess();
    },2000);

    
}

function showTestimonialSuccess(){
    $("#testimonialForm").html(`
            <div class='alert alert-brandcolor text-center' role='alert'>
                <div>Please note that this site does not send any of the data during demo, but in reality, it sends your testimonial to the domain's data server and generates below response.</div>
                <div>Thank you. Your testimonial has been received successfully.</div>
                </div>
            </div>
        `);

    $("#ratingstars").hide();
    $("#submitTestimonial").hide();
    
}

function showTestimonialFailure(){
    $("#testimonialForm").append("<div class='alert alert-danger' role='alert'>Sorry, something went wrong. Please try again.</div>");
}

//CONNECTION ICONS
function getConnectionIcon(type, href){
    switch(type.toLowerCase()){
        case "linkedin" : 
            return `
            <a class="container text-decoration-none" href="${href}" target="_blank" >
                <div class="brand-icon-holder pointer">
                    <div class="brand-icon brand-linkedin bg-brandcolor w-100 h-100 d-flex flex-row justify-content-center align-items-center">
                        <div class="text-white fw-bold text-decoration-none">in</div>
                    </div>
                </div>  
            </a>
            `;
        case "facebook" :
            return `
            <a class="container text-decoration-none" href="${href}" target="_blank"> 
                <div class="brand-icon-holder pointer">
                    <div class="brand-icon brand-facebook bg-brandcolor w-100 h-100 d-flex flex-row justify-content-center align-items-center">
                        <div class="text-white fw-bold">f</div>
                    </div>
                </div>
            </a>
            `;
        case "twitter" :
            return `
            <a class="container text-decoration-none" href="${href}" target="_blank">
                <div class="brand-icon-holder pointer">
                    <div class="brand-icon brand-twitter bg-brandcolor w-100 h-100 d-flex flex-row justify-content-center align-items-center">
                        <div class="text-white fw-bold">X</div>
                    </div>
                </div>
            </a>
            `;
        case "youtube" :
            return `
            <a class="container text-decoration-none" href="${href}" target="_blank" >
                <div class="brand-icon-holder pointer relative">                
                    <div class="brand-icon rotate-neg45 brand-youtube bg-brandcolor w-100 h-100  overflow-hidden">  
                        <div class="absolute brand-youtube-centre rotate-45 bg-brandcolor w-100 h-100">
                            <div class="brand-icon-youtube-triangle absolute bg-white rotate-neg45"></div>
                            <div class="absolute bg-brandcolor w-50 h-100 "></div>
                        </div> 
                    </div>
               </div>
            </a>
            `;
        case "instagram" :
            return `
            <a class="container text-decoration-none" href="${href}" target="_blank" >
                <div class="brand-icon-holder pointer">
                    <div class="brand-icon brand-instagram bg-brandcolor w-100 h-100 d-flex flex-row justify-content-center align-items-center relative">
                        <div class="absolute brand_instagram_circle"></div>
                        <div class="absolute brand_instagram_circle brand_instagram_circle_small"></div>
                    </div>
                </div>
            </a>
            `;
        default : return "";
    }                           
}


//DUMMY DATA
function getCarouselData(){
    return [
        {
        "id":"services",
        "interval":3000,
        "items":[
            {
                "image":"assets/images/service4.jpg",
                "title":"Disablity care",
                "subtitle":"We provide individually tailored personal care."
            },
            {
                "image":"assets/images/service5.jpg",
                "title":"Nursing care",
                "subtitle":"We provide nursing care to patients."
            },
            {
                "image":"assets/images/service6.jpg",
                "title":"Consultation",
                "subtitle":"We provide nursing and health consultation."
            },
            ]
        }
    ];
}

function getTeamData(){
    return [
        {
            "name":"Richard Lincon",
            "position":"Chief Executive Officer",
            "occupation":"Registered Nurse",
            "email":"richard.lincon@kavyatech.com.au",
            "phone":"+61-400000000",
            "image":"assets/images/team1.jpg"
        },
        {
            "name":"Harry Ming",
            "position":"Chief Financial Officer",
            "occupation":"Chartered Accountant",
            "email":"harry.ming@kavyatech.com.au",
            "phone":"+61-400000000",
            "image":"assets/images/team2.jpg"
        },
        {
            "name":"Joseph Wood",
            "position":"Chief Planning Executive",
            "occupation":"Masters in Business",
            "email":"joseph.wood@kavyatech.com.au",
            "phone":"+61-400000000",
            "image":"assets/images/team3.jpg"
        }       
    ];
}

function getWebsiteData(){
    return {
    "error": null,
    "data": {
        "config": [            
            {
                "key": "info_email",
                "value": "info@kavyatech.com.au"
            },
            {
                "key": "phone",
                "value": "0400000000"
            },
            {
                "key": "address",
                "value": [
                    "",
                    "255 George St",
                    "The Rocks, 2000",
                    "New South Wales, Australia"
                ]
            },
            {
                "key": "linkedin",
                "value": "https://www.linkedin.com/vijayhamal"
            },
            {
                "key": "facebook",
                "value": "https://www.facebook.com/"
            },
            {
                "key": "twitter",
                "value": "https://x.com/i/flow/login"
            },
            {
                "key": "youtube",
                "value": "https://www.youtube.com"
            },
            {
                "key": "instagram",
                "value": "https://www.instagram.com"
            }
        ]
        }
    };
}

function getContactFormConfigDefinition(){
    return [
        {
            fields : 
            [
                {
                    id: 'firstName',
                    name : 'First Name',
                    label: 'First Name',
                    class: 'col-sm-12 col-md-6',
                    type: 'text',
                    placeholder: '',
                    required: true,
                    value : 'John',
                    validation: {
                        minLength: 2,
                        errorMessage: 'First Name must be at least 2 characters long.'
                    }
                },
                {
                    id: 'lastName',
                    name : 'Surname',
                    label: 'Surname',
                    class: 'col-sm-12 col-md-6',
                    type: 'text',
                    placeholder: '',
                    required: true,
                    value : 'Citizen',
                    validation: {
                        minLength: 2,
                        errorMessage: 'Surame must be at least 2 characters long.'
                    }
                },
            ]
        },
        {
            fields : 
            [
                {
                    id: 'email',
                    name : 'Email address',
                    label: 'Email address',
                    class: 'col-sm-12 col-md-6',
                    type: 'email',
                    placeholder: 'john.citizen@email.com',
                    value : 'john.citizen@email.com',
                    required : true,
                    validation: {
                        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        errorMessage: 'Enter a valid email address.'
                    }
                },
                {
                    id: 'mobile',
                    name : 'Mobile',
                    label: 'Mobile',
                    type: 'text',
                    class : 'col-sm-12 col-md-6',
                    placeholder: '',
                    required: true,
                    value : '0452468331',
                    validation: {
                        regex: /^.{10,}$/,
                        errorMessage: 'Enter a valid 10 digit mobile number (04xxxxxxxx).'
                    }
                },        
            ]
        },
        {
            fields : [
            {
                id: 'address',
                name : 'Address',
                label: 'Address',
                type: 'text',
                class : 'col-12',
                placeholder: '',
                required: false,
                value : '',
                
            }
            ]
        },
        {
            fields : [
            {
                id: 'enquire',
                name : 'Ask a question',
                label: 'Ask a question',
                type: 'textarea',
                placeholder: 'Type your question here',
                required: true,
                rows: 10,
                value : 'This is my question',
                validation: {
                    minLength: 1,
                    errorMessage: 'Please ask a question.'
                }
            }
            ]
        },
    ];        
}

function getTestimonialData(){
    return [
        {
            "Full Name": "Peter Parker",
            "Testimonial": "This is one of the best software companies to work with. Very friendly staff who takes care of individualized need for customer to convert an idea into code. I would recommend anyone to work with this company.",
            "Rating": "5",
            "Received": "2025-05-01T10:00:00"
        },
        {
            "Full Name": "Jessica Nguyen",
            "Testimonial": "The team went above and beyond to deliver our project ahead of schedule. Communication was excellent and the quality exceeded our expectations.",
            "Rating": "5",
            "Received": "2025-04-25T14:32:00"
        },
        {
            "Full Name": "Liam O'Connor",
            "Testimonial": "Reliable, innovative, and genuinely invested in our success. I've worked with several tech firms and this one stands out in every way.",
            "Rating": "5",
            "Received": "2025-03-18T09:15:00"
        },
        {
            "Full Name": "Amira Hassan",
            "Testimonial": "From concept to completion, the process was smooth and professional. They understood our needs perfectly and delivered a fantastic product.",
            "Rating": "5",
            "Received": "2025-05-12T11:45:00"
        },
        {
            "Full Name": "Diego Morales",
            "Testimonial": "Their attention to detail and commitment to quality are unmatched. We are thrilled with the results and look forward to working with them again.",
            "Rating": "5",
            "Received": "2025-04-05T16:20:00"
        },
        {
            "Full Name": "Chloe Bennett",
            "Testimonial": "Fantastic experience from start to finish. They were responsive, creative, and totally aligned with our vision. Highly recommended!",
            "Rating": "5",
            "Received": "2025-05-28T13:10:00"
        }
    ];
}

function getTestimonialformConfigDefinition(){
    return [
        {
            fields : 
            [
                {
                    id: 'fullname',
                    name : 'Full Name',
                    label: 'Full Name',
                    class: 'col-12',
                    type: 'text',
                    placeholder: '',
                    required: true,
                    value : '',
                    validation: {
                        minLength: 2,
                        errorMessage: 'Full name must include at least Firstname and Surname.'
                    }
                },                
            ]
        },
        {
            fields : 
            [
                {
                    id: 'review',
                    name : 'Review',
                    label: 'Your Review',
                    class: 'col-12',
                    type: 'textarea',
                    rows : 5,
                    value : '',
                    placeholder: '',
                    required : true,
                    validation: {
                        minLength: 1,
                        maxLength : 200,
                        errorMessage: 'Please fill your review.'
                    }
                },  
            ]
        },
        
    ];
    
}


// HORIZONTAL SCROLL BEHAVIOUR
$(function () {
    const $scroll = $('.horizontal-scroll');
    let isDown = false;
    let startX, scrollStart;

    $scroll.on('mousedown', function (e) {
      isDown = true;
      $scroll.addClass('active');
      startX = e.pageX;
      scrollStart = $scroll.scrollLeft();
    });

    $(document).on('mouseup', function () {
      isDown = false;
      $scroll.removeClass('active');
    });

    $(document).on('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX;
      const walk = (x - startX) * 2; // adjust multiplier for speed
      $scroll.scrollLeft(scrollStart - walk);
    });
});