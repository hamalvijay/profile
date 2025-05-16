

document.querySelectorAll(".card, .spinner-item").forEach(card=>{
    card.addEventListener("mousemove", e=>{
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--y", `${e.clientY - rect.top}px`);
    })
});

$(document).ready(function() {
  //Years of experience
  $("#yearsofexperience").html(new Date().getFullYear()-2017);

  //HIDE MENU IF CLICK OUTSIDE IN DOM
  $(document).click(function (event) {
    !$(event.target).closest(".btn-menu").length && hideMenu();
  });

  //SHOW HIDE MENU
  $(".btn-menu").click(function() {
    $(".spinner-container").hasClass("show") ? hideMenu() : showMenu();
  });

  function showMenu() {
    $(".spinner-container, .backdrop").removeClass("hide").addClass("show");
    $(".spinner-item").each(function() {
        $(this).removeClass("appear");
        $(this).addClass("appear");
    });
    $(".btn-menu").addClass("open");
  }

  function hideMenu() {
    $(".btn-menu").removeClass("open");
    $(".spinner-container, .backdrop").removeClass("show").addClass("hide");
  }


  //INSERT CARD BACKGROUND IMAGE
  $(".card").each(function(){
    $(this).append(`<img src="assets/images/gradient.png" alt = "" class="card-bg-image">`);
  })


  //ANIMATE SQL and Table
  const rawText = 'SELECT * FROM [dbo].[tbl_process];';
  const delayPerCharMS = 100;
  const pauseBeforeTableMS = 1000;
  const pauseBeforeRestartMS = 5000;

  function animateQuery() {
    $('#sqlText').html('');
    $('#dbTableWrapper').fadeOut(300);

    let i = 0;
    const interval = setInterval(() => {
      $('#sqlText').html('<span>' + rawText.slice(0, i + 1) + '<span class="cursor-animated">&nbsp;|</span></span>');
      i++;
      if (i === rawText.length) {
        clearInterval(interval);

      setTimeout(() => {
        $('#dbTableWrapper').fadeIn(500);
        setTimeout(animateQuery, pauseBeforeRestartMS);
        }, pauseBeforeTableMS);
      }
    }, delayPerCharMS);
  }

  animateQuery();
  initializeContactForm(true);
});

//CONTACT FORM
function initializeContactForm(isBlank) {
    $(".btn-send-query").addClass("disabled");
    $(".btn-send-query").show();
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
        $(".btn-send-query").removeClass("disabled");
    } else {
        $(".btn-send-query").addClass("disabled");
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

$(document).on('click', '.btn-send-query', function(event){
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
    
    sendData(formDataString, true);
});


function sendData(formDataString, debug){
    if(debug){
        console.log(formDataString);
        showSuccess(); 
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
    $("#dynamicForm").html("<div class='text-success' role='alert'>Your response has been received successfully.</div>");
    $(".btn-send-query").hide();
}

function showFailure(){
    $("#dynamicForm").append("<div class='text-danger'  role='alert'>Sorry, something went wrong. Please try again.</div>");
}


function contactFormConfigDefinition(){
    return [
        {
            fields : 
            [
                {
                    id: 'name',
                    name : 'Name',
                    label  :"Name", 
                    class: 'col-12',
                    type: 'text',
                    placeholder: '',
                    required: true,
                    value : 'John',
                    validation: {
                        minLength: 2,
                        errorMessage: 'Too short name'
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
                label: 'Tell us about your query',
                type: 'textarea',
                placeholder: 'Type your query here',
                required: true,
                rows: 10,
                value : 'Start typing...',
                validation: {
                    minLength: 1,
                    errorMessage: 'You have not written your query'
                }
            }
            ]
        },
    ];        
}


