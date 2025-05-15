var url = "https://script.google.com/macros/s/AKfycbxOZr4194GZ5GeNbmlqMn89_ENS_AYVElSTPk6v9HtvW7pWipQbacQNN2OD7ahvF3Eo/exec";

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

    //CONTACT
    initializeContactForm(true);

    //FOOTER
    document.getElementById("footer_year").innerHTML=new Date().getFullYear().toString();
    $("footer_year").html(`${new Date().getFullYear()}`);


});

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
    let db = await getData();
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
            `<div class='alert bg-brandcolor-lightest-50 border-0 text-brandcolor'>
                <p>
                    Sorry !! no position is available for now. But keep an eye as we are planning for positing new opportunities very soon.
                </p>
                <p>
                    You can also send your resume to <a class='fw-bold text-brandcolor jobs_email' href='mailto:${jobs_email}'>${jobs_email}</a>.
                </p>
            </div>
            `);
    }
    else{
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
    $("#dynamicForm").html("<div class='alert alert-brandcolor' role='alert'>Your response has been received successfully.</div>");
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
                "value": "https://www.linkedin.com/in/vijayhamal/"
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
                "value": "https://www.youtube.com/"
            },
            {
                "key": "instagram",
                "value": "https://www.instagram.com"
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
                "salary": "TBA",
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
            }
        ],
        "rating": [
            {
                "Full Name": "Alice Johnson",
                "Review": "Excellent service, very responsive and professional.",
                "Rating": 5,
                "received date": "2025-01-01 12:00:00",
                "active": "y"
            },
            {
                "Full Name": "Brian Smith",
                "Review": "The experience was smooth, but there’s room for improvement.",
                "Rating": 4,
                "received date": "2025-01-01 12:00:00",
                "active": "y"
            },
            {
                "Full Name": "Catherine Lee",
                "Review": "Not satisfied with the communication.",
                "Rating": 2,
                "received date": "2025-01-01 10:00:00",
                "active": "y"
            },
            {
                "Full Name": "David Martinez",
                "Review": "Great value for money, would definitely recommend.",
                "Rating": 5,
                "received date": "2025-01-01 12:00:00",
                "active": "y"
            },
            {
                "Full Name": "Emma Thompson",
                "Review": "Decent experience, but had to wait longer than expected.",
                "Rating": 3,
                "received date": "2025-01-01 12:00:00",
                "active": "y"
            },
            {
                "Full Name": "Faisal Ahmed",
                "Review": "Absolutely amazing! Quick turnaround and friendly support.",
                "Rating": 5,
                "received date": "2025-01-01 12:00:00",
                "active": "y"
            }
        ]
    }
};
}
