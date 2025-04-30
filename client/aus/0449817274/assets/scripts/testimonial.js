

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

function getTestimonials(showFront){
const api ="https://script.google.com/macros/s/AKfycbzn0wu6eDhK_bPLSvERWdhoWdcm6F-L69dgBBxdrKETtTiSt61AlPIaYDFxCX3w8zdp/exec?limit=100";
fetch(api)
   .then(function(response) {
       if (!response.ok) {
           alert("Failed to fetch testimonials.");
       }
       return response.json();
   })
   .then(function(response) {
       buildTestimonials(response.data, showFront);
   })
   .catch(function(error) {
       alert("Failed to fetch testimonials.");
       
   });
}

function buildTestimonials(data, showFront){
$(".testimonialsLoading").hide();
if(data){
   var divFront="<div class='alert alert-info' role='alert'>No testimonials to show.</div>";
   var divModal=divFront;
   if(data.length>0){
       divFront="";
       divModal="";
       for(var i = 0; i<data.length; i++){
           var testimonial = data[i];
           let name = testimonial["Full Name"];
           let review = testimonial["Review"];
           let rating = parseInt(testimonial["Rating"]) || 0;
           let received = formatDateTime(testimonial["Received"]);

           let stars = '';
           for (let i = 1; i <= 5; i++) {
               stars += i <= rating ? '★' : '☆';
           }

           let truncatedReview = review;
           if (review.length > 200) {
               truncatedReview = review.substring(0, 200).trim() + '...';
           }

           if(i<showFront){
               divFront += `
               <div class="col-12 col-md-4 mb-4">
                   <div class="card h-100 shadow-sm border-0">
                       <div class="card-body d-flex flex-column text-center">
                           <h5 class="card-title fw-bold">${name}</h5>
                           <p class="card-text"><small class="text-muted">${received}</small></p>
                           
                           <p class="card-text fst-italic mt-2" title="${review.replace(/"/g, '&quot;')}">"${truncatedReview}"</p>
                           <div class="text-warning fs-5 mt-auto">
                               ${stars}
                           </div>
                       </div>
                   </div>
               </div>`;
           }


           divModal +=`<div class="col-12 mb-4">
               <div class="card h-100 shadow border-0">
                   <div class="card-body d-flex flex-column text-start">
                       <div class="d-flex flex-row justify-content-between ms-2">
                           <h5 class="card-title fw-bold">${name}</h5>
                           <p class="text-warning fs-5"> ${stars}</p>
                       </div>
                       <p class="card-text"><small class="text-muted">${received}</small></p>
                       <p class="card-text fst-italic ms-2" title="${review.replace(/"/g, '&quot;')}">"${truncatedReview}"</p>                            
                   </div>
               </div>
           </div>`;
       }
      
   }
   

   $("#testimonialsScroller").html(divFront);
   $("#testimonials_modal").html(divModal);
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