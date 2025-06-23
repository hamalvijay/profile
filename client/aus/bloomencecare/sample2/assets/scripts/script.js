var url = "https://script.google.com/macros/s/AKfycbxOZr4194GZ5GeNbmlqMn89_ENS_AYVElSTPk6v9HtvW7pWipQbacQNN2OD7ahvF3Eo/exec";

const DEBUG = false;
const MOCK_DATA = false;

$(document).ready(function(){
    useData();
    // MENU
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

    //SERVICES
    initializeCarousel();

    //CONTACT
    initializeContactForm(true);

    //FOOTER
    document.getElementById("footer_year").innerHTML=new Date().getFullYear().toString();
    $("footer_year").html(`${new Date().getFullYear()}`);


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
    })
}

async function getData(){
    try{
        let response = await fetch(`${url}?route=data`);
        if(!response.ok){
            alert("Website configuration error. Please notify administrator.");
        }
        let data = await response.json();
        return data;
    } catch(err){
        alert("Website configuration error. Please notify administrator.");
    }
    
}

async function useData(){
    let db = MOCK_DATA ? mockData() : await getData();
    $(".dataLoading").toggleClass("hide");
    
    //CONTACT ICONS
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
                case "jobs_email" : 
                    $(".jobs_email")
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
                    $("#connection-icon-holder").append(getConnectionIcon(c.key, c.value));
                }
                break;
            }
        });
    }

    //CAREER
    var career = db?.data?.career;
    var jobs_email = db?.data?.config?.find(x=> x.key=="jobs_email")?.value ?? "";
    var jobs_phone = db?.data?.config?.find(x => x.key == "jobs_phone")?.value ?? "";
    
    var careerParentDiv = "#careerScroller";
    if(career==null || career?.length==0){
        $(careerParentDiv).append(
            `<div class='alert bg-white border-0'>
                <p>
                    Currently, we have no positions available. But keep an eye as we are planning to post new opportunities very soon.
                </p>
                <p>
                    Alternatively, feel free to send your details to us at <a class='fw-bold text-brandcolor jobs_email' href='mailto:${jobs_email}'>${jobs_email}</a> with:
                    <div class='px-5 py-2 bullet'>
                        <div>Name</div>
                        <div>Email address</div>
                        <div>Resume (mandatory)</div>
                        <div>Cover letter (optional)</div>
                    </div>
                    <div class='fst-italic mt-3'>Please sepecify why you would want to work for us in not less than 100 words.</div>
                </p>
            </div>
            `);
    }
    else{
        $(careerParentDiv).append(`<h5 class='text-center text-brandcolor'>Opportunities available:</h5>`);
        career.forEach(c=>{
            var div = `
                    <div class="accordion-item border-0 shadow-sm">
                        <div class="accordion-header" id="heading${c['id']}">
                            <div class="accordion-button career-accordion-button border-0 collapsed d-flex align-items-center bg-transparent shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${c['id']}" aria-controls="collapse${c['id']}">
                                <div class="d-flex flex-column">
                                    <h5 class="fw-bold text-brandcolor">${c['title']}</h5>
                                    <span class="text-muted fst-italic">📍 ${c['location']}</span>
                                </div>
                                <span class="ms-auto text-muted">${c['job type']}</span>
                            </div>
                        </div>
                        <div id="collapse${c['id']}" class="accordion-collapse collapse" aria-labelledby="heading${c['id']}" data-bs-parent="${careerParentDiv}">
                            <div class="accordion-body">
                                <div class="d-flex flex-row justify-content-between">
                                    <small class="text-muted"><strong>Date :</strong> ${c['posted date']}</small>
                                    <small class="text-muted"><strong>Apply before :</strong> ${c['expiry date']}</small>
                                </div>

                                <p class="card-text mt-4"><strong>Description :</strong></p>
                                <p class="card-text ms-3">${c['description']}</p>

                                <p class="card-text mt-2"><strong>Details :</strong></p>
                                <p class="card-text ms-3">${ c['details'].join("<br>") }</p>

                                <p class="mt-2"><strong>Requirements :</strong></p>
                                
                                <div class="card-text ms-3 mb-2"><strong>Education:</strong>
                                    <div class="ms-2">
                                        ${Array.isArray(c['education']) 
                                            ? c['education'].join("<br>") 
                                            : (c['education'] ?? '')
                                        }
                                    </div>                                
                                </div>
                                <div class="card-text ms-3 mb-2"><strong>Experience:</strong>
                                    <div class="ms-2">
                                        ${Array.isArray(c['experience']) 
                                            ? c['experience'].join("<br>") 
                                            : (c['experience'] ?? '')
                                        }
                                    </div>                                
                                </div>
                                <div class="card-text ms-3 mb-2"><strong>Other requirements:</strong>
                                    <div class="ms-2">
                                        ${Array.isArray(c['other requirements']) 
                                            ? c['other requirements'].join("<br>") 
                                            : (c['other requirements'] ?? '')
                                        }
                                    </div>                                
                                </div>
                                <br>
                                <div class="text-brandcolor fs-6 m-2 ms-0 fst-italic">
                                    <strong>Salary Insights:</strong> ${c['salary'] ?? 'TBA'}
                                </div>

                                <div class="m-3 fst-italic">
                                    <p>
                                        If you are interested in this role, please send your <strong>Cover Letter</strong> & <strong>Resume</strong> to <strong><a class="text-brandcolor" href="mailto:${jobs_email}">${jobs_email}</a></strong> ${jobs_phone != "" ? `or give us a call at <strong><a class="text-brandcolor pointer" href="tel:${jobs_phone}">${jobs_phone}</a></strong>` : ``} and add below reference number in your subject line.
                                    </p>
                                    <p class="fst-normal fw-bold">Job reference no : ${c['id']}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    `;

            $("#careerScroller").append(div);
        })
    }
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

//CONTACT FORM
function initializeContactForm(isBlank) {
    $("#submitBtn").addClass("disabled");
    $("#submitBtn").show();
    $("#initializeContactFormBtn").hide();
    $("#dynamicForm").html("");
    $("#formProcessingStatus").hide();

    const formConfig = contactFormConfigDefinition();

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
    const formConfig = contactFormConfigDefinition();
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
    const formConfig = contactFormConfigDefinition();

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
    fetch(`${url}`, 
        {
            method : "POST",
            body : formDataString,
            headers : {
                "Content-Type" : "application/x-www-form-urlencoded"
            }
        }
    ).then(function(response){
        if(response){
            return response;
        }
        else{
            showFailure();
        }
    }).then(function (response){
        $("#initializeContactFormBtn").show(); 
        if(response.status == 200){
            $("#formProcessingStatus").hide();
            showSuccess();
        }
        else{
            $("#formProcessingStatus").hide();
            showFailure();
        }
    });
}

function showSuccess(){
    $("#dynamicForm").html(`
            <div class='alert alert-brandcolor text-center' role='alert'>
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

function contactFormConfigDefinition(){
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

function mockData(){
    return {
    "error": null,
    "data": {
        "config": [
            {
                "key": "primary_email",
                "value": "bloomencecareservices@gmail.com"
            },
            {
                "key": "noreply_email",
                "value": "no-reply@bloomencecare.com.au"
            },
            {
                "key": "info_email",
                "value": "info@bloomencecare.com.au"
            },
            {
                "key": "phone",
                "value": "0402280098"
            },
            {
                "key": "address",
                "value": [
                    "",
                    "4 Fisico Road",
                    "Kalkallo, 3064",
                    "Victoria, Australia"
                ]
            },
            {
                "key": "linkedin",
                "value": null
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
                "value": "www.youtube.com"
            },
            {
                "key": "instagram",
                "value": null
            },
            {
                "key": "jobs_email",
                "value": "jobs@bloomencecare.com.au"
            },
            {
                "key": "jobs_phone",
                "value": "0412345678"
            }
        ],
        "career": [
            {
                "id": "Bloomence0512",
                "posted date": "2025-05-12",
                "title": "NDIS Support Worker",
                "description": "We are seeking a compassionate and reliable NDIS Support Worker to join our growing team. In this role, you will support NDIS participants to work towards their individual goals and improve their quality of life.",
                "details": [
                    "Provide person-centered support aligned with NDIS goals and individual support plans",
                    "Assist participants with daily living tasks, community engagement, and personal care (if applicable)",
                    "Maintain accurate and timely documentation and progress notes",
                    "Communicate effectively with participants, families, and allied professionals",
                    "Ensure a safe, respectful, and inclusive support environment"
                ],
                "location": "Ballarat, VIC",
                "job type": "Casual",
                "salary": 100000,
                "experience": "Previous experience in disability support or a similar role",
                "education": "Relevant qualification (e.g., Certificate III or IV in Disability, Individual Support, Community Services)",
                "other requirements": [
                    "Valid NDIS Worker Screening Check (or willingness to obtain)",
                    "Working with Children Check (if required)",
                    "Current First Aid and CPR certificate",
                    "Valid driver’s license and reliable vehicle (if travel is involved)",
                    "COVID-19 vaccinations in line with government mandates"
                ],
                "expiry date": "2025-06-15",
                "active": "y"
            },
            {
                "id": "Bloomence0401",
                "posted date": "2025-04-01",
                "title": "Backend Developer",
                "description": "Responsible for building and maintaining server-side applications and APIs using Node.js and MongoDB.",
                "details": [
                    "Design, implement, and maintain RESTful APIs and backend services using Node.js and Express.js. Work with MongoDB and Mongoose to model, store, and retrieve data efficiently.",
                    "Implement robust authentication, authorization, and role-based access control using JSON Web Tokens (JWT) and OAuth.",
                    "Optimize backend performance through indexing, caching strategies (Redis), and query optimization. Ensure systems are scalable and maintainable for long-term growth.",
                    "Use Git, Docker, and CI/CD tools to automate deployment and testing workflows. Collaborate with DevOps to manage cloud-based infrastructure using AWS, Azure, or Google Cloud.",
                    "Participate in design reviews, sprint planning, and agile ceremonies to deliver reliable software on time."
                ],
                "location": "Remote",
                "job type": "Full-time",
                "salary": 50000,
                "experience": "3+ years backend",
                "education": "Bachelor's in Computer Science",
                "other requirements": "Node.js, MongoDB, REST API",
                "expiry date": "2025-06-20",
                "active": "y"
            }
        ],
        "rating": []
    }
};
}

function getCarouselData(){
    return [
        {
        "id":"services",
        "interval":3000,
        "items":[
            {
                "image":"assets/images/service1.jpg",
                "title":"Assistance with Self Care Activities",
                "subtitle":"We provide support in maintaining independence and well being"
            },
            {
                "image":"assets/images/service2.jpg",
                "title":"Access Community, Social and Recreational Activities",
                "subtitle":"We provide support in engaging in a wide range of activities from attending local events to joining sports clubs and any other activities in the community"
            },
            {
                "image":"assets/images/service3.jpg",
                "title":"Assistance with Personal Domestic Activities",
                "subtitle":"We provide support in daily living tasks within a home such as cleaning, laundry, meal preparation etc"
            },
            ]
        }
    ];
}
