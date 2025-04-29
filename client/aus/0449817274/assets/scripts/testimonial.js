

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

function getTestimonials(){
    const api ="https://script.google.com/macros/s/AKfycbzn0wu6eDhK_bPLSvERWdhoWdcm6F-L69dgBBxdrKETtTiSt61AlPIaYDFxCX3w8zdp/exec";
    fetch(api)
        .then(function(response) {
            if (!response.ok) {
                alert("Failed to fetch testimonials.");
            }
            return response.json();
        })
        .then(function(response) {
            buildTestimonials(response.data);
        })
        .catch(function(error) {
            alert("Failed to fetch testimonials.");
            
        });
}

function buildTestimonials(data){
    $("#testimonialsLoading").hide();
    if(data){
        var div="<div class='alert alert-info' role='alert'>No testimonials to show.</div>";
        if(data.length>0){
            div="";
            data.forEach(testimonial => {
                let name = testimonial["Full Name"];
                let review = testimonial["Review"];
                let rating = parseInt(testimonial["Rating"]) || 0;

                let stars = '';
                for (let i = 1; i <= 5; i++) {
                    stars += i <= rating ? '★' : '☆';
                }

                let truncatedReview = review;
                if (review.length > 200) {
                    truncatedReview = review.substring(0, 200).trim() + '...';
                }

                div += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="card-body d-flex flex-column text-center">
                            <h5 class="card-title fw-bold">${name}</h5>
                            <p class="card-text fst-italic mt-2" title="${review.replace(/"/g, '&quot;')}">"${truncatedReview}"</p>
                            <div class="text-warning fs-5 mt-auto">
                                ${stars}
                            </div>
                        </div>
                    </div>
                </div>`;
            });
        }
        

        $("#testimonialsScroller").html(div);
    }
}


function testimonialformConfigDefinition(){
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

function initializeTestimonialForm(isBlank) {
    $("#submitTestimonial").addClass("disabled");
    $("#submitTestimonial").show();
    $("#testimonialForm").html("");
    $("#testimonialformProcessingStatus").hide();

    const formConfig = testimonialformConfigDefinition();

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
    const formConfig = testimonialformConfigDefinition();
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


$(document).on('click', '#submitTestimonial', function(event){

    if ($(this).hasClass('disabled')) {
        return; 
    }

    let formData = {};
    formData["Rating"] = $("#ratingValue").html();
    const formConfig = testimonialformConfigDefinition();

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
    var fetchURL = "https://script.google.com/macros/s/AKfycbzn0wu6eDhK_bPLSvERWdhoWdcm6F-L69dgBBxdrKETtTiSt61AlPIaYDFxCX3w8zdp/exec";
    $("#testimonialformProcessingStatus").show();
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
            $("#testimonialformProcessingStatus").hide();
            showTestimonialSuccess();
            
        }
        else{
            $("#testimonialformProcessingStatus").hide();
            showTestimonialFailure();
        }
    });
}

function showTestimonialSuccess(){
    $("#testimonialForm").html("<div class='alert alert-info' role='alert'>Your testimonial has been received successfully.</div>");
    $("#ratingstars").hide();
    $("#submitTestimonial").hide();
    
}

function showTestimonialFailure(){
    $("#testimonialForm").append("<div class='alert alert-danger' role='alert'>Sorry, something went wrong. Please try again.</div>");
}