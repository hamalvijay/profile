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
                case "contact_email" : 
                    $("#contact_email").html(c.value ?? '');
                    break;
                case "phone" : 
                    $("#phone").html(c.value ?? '');
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
                    $("#connection-icon-holder").append(getConnectionIcon(c.key, c.value));
                }
                break;
            }
        });
    }

    //CAREER
    var career = db?.data?.career;
    if(career==null || career?.length==0){
        $("#careerScroller").append("<p class='alert bg-brandcolor-lightest-50 border-0 text-brandcolor'>Sorry !! no position available for now. But keep an eye as we are planning for positing new opportunities very soon.</p>");
    }
    else{
        career.forEach(c=>{
            var div = `
            <div class="col-12 mb-4">
                <div class="card h-100 shadow-sm border-0 p-2 ">
                    <div class="card-body d-flex flex-column ">
                        <div class="d-flex flex-row justify-content-between align-items-baseline">
                            <h4 class="card-title fw-bold text-brandcolor">${c['title']}</h4>
                            <div class="card-text fw-bold">${c['job type']}</div>
                        </div>
                        
                        
                        <div class="text-muted fst-italic">📍 ${c['location']}</div>
                        <div class="mt-4 d-flex flex-row justify-content-between mt-2">
                            <small class="text-muted"><strong>Date :</strong> ${c['posted date']}</small>
                            <small class="text-muted"><strong>Apply before :</strong> ${c['expiry date']}</small>
                        </div>
                        
                        
                        <p class="card-text mt-4"><strong>Description :</strong></p>
                        <p class="card-text ms-3">${c['description']}</p>
                        
                        <p class="card-text mt-2"><strong>Details :</strong> </p>
                        <p class="card-text ms-3">${ c['details'].join("<br>") }</p>
                
                        
                                
                        <p class="mt-2"><strong>Requirements :</strong> </p>

                        <p class="card-text ms-3"><strong>Education : </strong>${c['education'] ?? 'NA'}</p>
                        <p class="card-text ms-3"><strong>Skills : </strong>${c['skills'] ?? 'NA'}</p>
                        <p class="card-text ms-3"><strong>Experience : </strong>${c['experience'] ?? 'NA'}</p>

                        <div class="text-brandcolor fs-5 m-2 ms-0 fst-italic">
                            <strong>Benefits :</strong> : ${c['salary'] ?? 'TBA'}
                        </div>
                        <p class="m-3 fst-italic">
                        If you are interested in this role, please send your <strong>Cover Letter</strong> & <strong>Resume</strong> to 
                        <strong><a class="text-brandcolor" href="mailto:${c['email']}">${c['email']}</a></strong> ${c['phone'] != null ? `or give us a call at 
                        <strong><a class="text-brandcolor pointer href="tel:${c['phone']}">${c['phone']}</a></strong>` : ``} and add below reference number in your subject line.<br>
                        <div class='fst-normal fw-bold'>Job reference no : ${c['id']}</div>
                        </p>
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
                <div class="brand-icon-holder pointer">
                    <div class="brand-icon rotate-neg45 brand-youtube bg-brandcolor w-100 h-100 d-flex flex-row justify-content-center align-items-center">
                        <div class="text-white rotate-45 fw-bold">⏵</div>
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
