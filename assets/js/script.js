$(document).ready(function(){
    $(".side-nav-toggle").on('click', function(event){
        $(".side-nav").toggleClass("navActive")
        $(".side-nav-content").toggleClass("show")
        $("#toggleCheck").prop("checked", !$("#toggleCheck").prop("checked"))
    });

    initializeForm(true);
    submit();
})

$(document).mouseup(function(e){
    if(!e.target.classList.contains('side-nav-toggle')){
        if($("#toggleCheck").prop("checked")){
            $(".side-nav-toggle").click()
        }            
    }
});

function formConfigDefinition(){
    return [
        {
            fields : 
            [
                {
                    id: 'firstName',
                    name : 'Given Name',
                    label: 'Given Name',
                    class: 'col-sm-12 col-md-6',
                    type: 'text',
                    placeholder: '',
                    required: true,
                    value : 'John',
                    validation: {
                        minLength: 2,
                        errorMessage: 'Given name must be at least 2 characters long.'
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
                        // regex: /^04\d{8}$/,
                        regex: /^.{10,}$/,
                        errorMessage: 'Enter a valid 10 digit mobile number (04xxxxxxxx).'
                    }
                },        
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

function initializeForm(isBlank) {
    $("#submitBtn").addClass("disabled");
    $("#submitBtn").show();
    $("#initializeFormBtn").hide();
    $("#dynamicForm").html("");
    $("#formProcessingStatus").hide();

    const formConfig = formConfigDefinition();

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

    // Add validation listeners and monitor input changes
    formConfig.forEach(fieldRow => {
        if (fieldRow.fields.length > 0) {
            fieldRow.fields.forEach(field => {
                const $input = $(`#${field.id}`);
                $input.on('input change', function () {
                    validateField($input, field.validation);
                    checkFormValidity(); // Check form validity on each change
                });
            });
        }
    });
}

function checkFormValidity() {
    const formConfig = formConfigDefinition();
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
        $("#submitBtn").removeClass("disabled"); // Enable button
    } else {
        $("#submitBtn").addClass("disabled"); // Disable button
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

function submit() {
    $('#submitBtn').click(function () {
        if ($(this).hasClass('disabled')) {
            return; // Prevent submission if button is disabled
        }

        let formData = {};
        const formConfig = formConfigDefinition();

        formConfig.forEach(fieldRow => {
            if (fieldRow.fields.length > 0) {
                fieldRow.fields.forEach(field => {
                    formData[field.name] = $(`#${field.id}`).val();
                });
            }
        });
        // Combine GivenName and Surname into Name
        if (formData['Given Name'] && formData['Surname']) {
            formData['Full Name'] = `${formData['Given Name']} ${formData['Surname']}`;
            delete formData['Given Name'];
            delete formData['Surname'];
        }

        let keyValuePair = [];
        const Name = "";
        for (let pair of Object.entries(formData)) {
            keyValuePair.push(pair[0] + '=' + encodeURIComponent(pair[1]));
        }
        let formDataString = keyValuePair.join('&');
        
        sendData(formDataString, false);
    });
}

function sendData(formDataString, debug){
    if(debug){
        console.log(formDataString);
        return;
    }
    var fetchURL = "https://script.google.com/macros/s/AKfycbxDSaIaP5VVCXt06ZSbI2fdsSN2kc7vb0uL3wl6jNo2WxE8_9Q4vgWPTYxOEQbggvBt/exec";
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
    $("#dynamicForm").html("<div class='alert alert-success' role='alert'>Your response has been received successfully.</div>");
    $("#submitBtn").hide();
    $("#initializeFormBtn").show();
}

function showFailure(){
    $("#dynamicForm").append("<div class='alert alert-danger' role='alert'>Sorry, something went wrong. Please try again.</div>");
}

function AppScript(){
    const DATA_ENTRY_SHEET_NAME = "Sheet1";

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_ENTRY_SHEET_NAME);

    const doPost = (request = {}) => {
    const {postData : {contents, type }= {} } = request;
    var data = parseFormData(contents);
    appendToGoogleSheet(data);
    return ContentService.createTextOutput(contents).setMimeType(ContentService.MimeType.JSON);
    };

    function parseFormData(postData){
    var data = [];
    var parameters = postData.split('&');
    for(var i = 0; i<parameters.length; i++){
        var keyValue = parameters[i].split('=');
        data[keyValue[0]] = decodeURIComponent(keyValue[1]);
    }
    return data;
    }

    function appendToGoogleSheet(data){
        var headers = sheet.getRange(1,1,1, sheet.getLastColumn()).getValues()[0];
        var rowData = headers.map(headerFld => data[headerFld]);
        sheet.appendRow(rowData);
    }
}

function colors(){
    return {
        "primary":"007bff",
        "secondary":"6c757d",
        "success":"28a745",
        "danger":"dc3545",
        "warning":"ffc107",
        "info":"17a2b8",
        "light":"f8f9fa",
        "dark":"343a40",
        "white":"ffffff",
    }
}



