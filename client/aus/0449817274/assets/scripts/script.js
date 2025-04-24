
$(document).ready(function(){
    const currentMenu = "home";
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
    
    //FORM
    initializeForm(true);
    submit();
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

function formConfigDefinition(){
    return {
        fields: [
            {
                id: 'fullname',
                name : 'Full Name',
                label: 'Full Name*',
                type: 'text',
                placeholder: 'John Citizen',
                required: true,
                value : 'John Citizen',
                validation: {
                    minLength: 3,
                    errorMessage: 'Full Name must be at least 3 characters long.'
                }
            },
            {
                id: 'email',
                name : 'Email address',
                label: 'Email address',
                type: 'email',
                placeholder: 'john.citizen@email.com.au',
                value : 'john.citizen@email.com.au',
                validation: {
                    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    errorMessage: 'Enter a valid email address.'
                }
            },
            {
                id: 'mobile',
                name : 'Mobile',
                label: 'Mobile*',
                type: 'text',
                placeholder: '04xxxxxxxx',
                required: true,
                value : '0452468331',
                validation: {
                    // regex: /^04\d{8}$/,
                    regex: /^.{10,}$/,
                    errorMessage: 'Enter a valid Australian mobile number (04xxxxxxxx).'
                }
            },
            {
                id: 'address',
                name : 'Address',
                label: 'Address',
                type: 'text',
                value : 'U1 123 Australian Road, Mytown NSW 2000',
                placeholder: 'U1 123 Australian Road, Mytown NSW 2000'
            },
            {
                id: 'enquire',
                name : 'Ask a question',
                label: 'Ask a question*',
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
    };
}

function initializeForm(isBlank){
    $("#submitBtn").show();
    $("#initializeFormBtn").hide();
    $("#dynamicForm").html("");
    $("#formProcessingStatus").hide();

    const formConfig = formConfigDefinition();
    formConfig.fields.forEach(field => {
        let formGroup = $('<div class="form-group my-3"></div>');
        formGroup.append(`<label for="${field.id}">${field.label}</label>`);
        
        let inputElement;
        if (field.type === 'textarea') {
            inputElement = $(`<textarea class="form-control" id="${field.id}" placeholder="${field.placeholder}" rows="${field.rows??5}">${isBlank ? '' : field.value ?? ''}</textarea>`);
        } else {
            inputElement = $(`<input type="${field.type}" class="form-control" id="${field.id}" placeholder="${field.placeholder}" value="${isBlank ? '' : field.value ?? ''}">`);
        }

        if (field.required) inputElement.prop('required', true);

        formGroup.append(inputElement);
        $('#dynamicForm').append(formGroup);
    });

    formConfig.fields.forEach(field => {
        $(`#${field.id}`).on('input', function() {
            validateField($(this), field.validation);
        });
    });
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

function submit(){
    $('#submitBtn').click(function() {
        let isFormValid = true;
        const formConfig = formConfigDefinition();
        formConfig.fields.forEach(field => {
            const input = $(`#${field.id}`);
            validateField(input, field.validation);

            if (input.hasClass('is-invalid')) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            let formData = {};
            formConfig.fields.forEach(field => {
                formData[field.name] = $(`#${field.id}`).val();
            });
            var keyValuePair = [];
            for (var pair of Object.entries(formData)) {
                keyValuePair.push(pair[0] + '=' + encodeURIComponent(pair[1]));
            }
            var formDataString = keyValuePair.join('&');
            sendData(formDataString, false);                       
        }
    });
}

function sendData(formDataString, debug){
    if(debug){
        console.log(formDataString);
        return;
    }

    var fetchURL = "https://script.google.com/macros/s/AKfycbzLW3CWAKXvS7NnOzhpt0hlINhxoaaqK7q86mFt5XUt9dnsZf3cLo2KET1q01AP9fpW/exec";
    
    $("#formProcessingStatus").show();
    fetch(fetchURL, 
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
    $("#dynamicForm").html("<div class='alert alert-success' role='alert'>Response successfully submitted.</div>");
    $("#submitBtn").hide();
    $("#initializeFormBtn").show();
}

function showFailure(){
    $("#dynamicForm").append("<div class='alert alert-danger' role='alert'>Sorry, something went wrong. Please try again.</div>");
}



