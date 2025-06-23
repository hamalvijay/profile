var url = "https://script.google.com/macros/s/AKfycbxOZr4194GZ5GeNbmlqMn89_ENS_AYVElSTPk6v9HtvW7pWipQbacQNN2OD7ahvF3Eo/exec";
const DEBUG = false;
const MOCK_DATA = true;

var appData = null;

(function ($) {
  
  "use strict";

    // CUSTOM LINK
    $('.smoothscroll').click(function(){
    var el = $(this).attr('href');
    var elWrapped = $(el);
    var header_height = $('.navbar').height();

    scrollToDiv(elWrapped,header_height);
    return false;

    function scrollToDiv(element,navheight){
      var offset = element.offset();
      var offsetTop = offset.top;
      var totalScroll = offsetTop-navheight;

      $('body,html').animate({
      scrollTop: totalScroll
      }, 300);
    }
});
    
  })(window.jQuery);


$(document).ready(function(){
  $(".loading-data").html("<img src='images/loading.gif'>");
  notBusy();
  // MENU
  hideMenu();
  initContactForm();
  $(document).on('click', '.navbar-toggler', function(event){
      
      if ($(".navbar-toggler").hasClass("collapsed")) {
          hideMenu();
      } else {
          showMenu();
      }
  });

  $(document).on('click', '.nav-link', function(event){
      $(".navbar-toggler").click();
  });

  function showMenu(){
      $(".navbar-toggler").removeClass("collapsed");
      $(".navbar-collapse").addClass("show");
  }

  function hideMenu(){
      $(".navbar-toggler").addClass("collapsed");
      $(".navbar-collapse").removeClass("show");
  }

  $("#footer_year").html(`${new Date().getFullYear()}`);
});

function initContactForm() {  
  const formDef = contactFormConfig();
  const $container = $("#" + formDef.containerId);
  $container.html("");

  if ($container.length) {
    $container.append(`<h2>${formDef.title}</h2>`);
    $container.append(`<p>${formDef.subtitle}</p>`);
    $container.append(`<div id='${formDef.id+'_information'}'></div>`);
    
    const fieldRows = formDef.fieldRows ?? [];
    if (fieldRows.length > 0) {
      let form = `<form id="${formDef.id}" class="custom-form contact-form">`;

      fieldRows.forEach(fr => {
        if (Array.isArray(fr.fieldColumns)) {
          form += `<div class="row">`;
          fr.fieldColumns.forEach(fc => {
            form += `<div class="${fc.class}">${getFieldProps(fc)}</div>`;
          });
          form += `</div>`;
        } else {
          form += `<div class="${fr.class ?? ''}">${getFieldProps(fr)}</div>`;
        }
      });

      if (formDef.actions?.length) {
        form += "<div class='row'>";
        formDef.actions.forEach(action => {
          form += `<button 
              class="${action.class}" 
              id="${action.id}" 
              type="${action.type}" 
              ${action.disabled ? 'disabled' : ''}
              
              >${action.text}</button>`;
        });
        form += "</div>";
      }

      form += "</form>";

      $container.append(form);

      // Now OnClick action bind to DOM
      formDef.actions?.forEach(action => {
        if (action.onClick && typeof window[action.onClick] === 'function') {
          $(`#${action.id}`).on("click", function (e) {
            e.preventDefault(); // prevent default form submission
            window[action.onClick](); // call the function by name
          });
        }
      });

      //Now Bind validation to each fields
      fieldRows.forEach(fr => {
        if (Array.isArray(fr.fieldColumns)) {
          fr.fieldColumns.forEach(bindFieldValidation);
        } else {
          bindFieldValidation(fr);
        }
      });
    }
  }
  useData();
}

function getFieldProps(field){
  return `<${field.type=="textarea" ? "textarea" : "input"}
    class="form-control" id="${field.id}" 
    placeholder="${field.placeholder}" 
    name="${field.name}" 
    ${field.required ? 'required': ''} 
    ${field.type=="textarea" ? "rows="+field.rows??2 : ""} 
    ${field.type=="textarea" ? "></textarea>" : ">"}`;
}

function bindFieldValidation(field) {
  const $input = $(`#${field.id}`);
  if ($input.length) {
    $input.on('input change', function () {
      validateField($input, field.validation);
      checkFormValidity();
    });
  }
}

function checkFormValidity() {
    const formConfig = contactFormConfig();
    let isFormValid = true;

    formConfig.fieldRows.forEach(row => {
        if (Array.isArray(row.fieldColumns)) {
            // Multiple columns in one row
            row.fieldColumns.forEach(field => {
                const $input = $(`#${field.id}`);
                validateField($input, field.validation);
                if ($input.hasClass('is-invalid')) {
                    isFormValid = false;
                }
            });
        } else {
            // Single field directly in the row
            const $input = $(`#${row.id}`);
            validateField($input, row.validation);
            if ($input.hasClass('is-invalid')) {
                isFormValid = false;
            }
        }
    });

    // Enable/disable submit button
    const $submitBtn = $("#submit_contact_form");
    $submitBtn.prop("disabled", !isFormValid);
}

function validateField(input, validation) {
    input.removeClass('is-valid is-invalid');
    input.next('.invalid-feedback').remove();

    if (!validation) return;

    let isValid = true;
    const value = input.val().trim();

    // Check minLength
    if (validation.minLength && value.length < validation.minLength) {
        isValid = false;
    }

    // Check regex pattern
    if (validation.regex && !validation.regex.test(value)) {
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

async function submitData(){
  busy();
  const formData = {};
  $("#contact_form").serializeArray().forEach(({ name, value }) => {
    formData[name] = value;
  });
  //Combine names
  formData["Full Name"] = formData["First name"]+" "+formData["Surname"];
  //Join for API
  let keyValuePair = [];
  for (let pair of Object.entries(formData)) {
      keyValuePair.push(pair[0] + '=' + encodeURIComponent(pair[1]));
  }
  let formDataString = keyValuePair.join('&');
  //Call API
  console.log("Form submitted with:", formDataString);
  if(MOCK_DATA){
    await new Promise(resolve => setTimeout(resolve, 500));
    notBusy();
  }

  const formDef = contactFormConfig();
  const $container = $("#" + formDef.containerId);
  $("#" + formDef.id + "_information").html("<p>Thank you for contacting us. Your response is received successfully.</p>");

  $container.find("form").remove();

  $container.append(`<button type="submit" class="custom-btn" onClick="initContactForm()">Send another</button>`);

}

async function useData(){
  busy();
  if(!appData) {await getAppData();}
  let db = appData;
  var config = db?.data?.config;
  $(".message-from-ceo").html("At Your Company name, employees will be at the forefront of what we do. The employes will be directly involved in the services we provide to our clients and hence will be the face of the organization. We are looking for employees who are committed to work with us during our journey of providing unconditional support and care to our clients. In turn, our organization will be committed to work towards the benefits of all the employees by providing adequate renumeration and support for their progression and growth");

  if(config!=null){
    const socialKeys = new Set(["linkedin", "facebook", "twitter", "youtube", "instagram"]);
    $(".social-icon").html("");
    config.forEach(c=>{
      switch(c.key){
        case "info_email" : 
          $(".data_info_email")
              .html(c.value ?? '')
              .prop("href", `mailto:${c.value}`);                    
          break;

        case "address" : 
          var data_address="";
          (c.value || []).forEach(address => {
              data_address += address+" ";
          });
          $(".data_address").html(data_address);
          $(".data_address_direction").prop("href","https://www.google.com/maps/dir//"+data_address.replace(/[ ,\.]+/g, "+").replace(/^\+|\+$/g, ""));
          $(".data_address_map").attr("src", `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3156.534776021353!2d144.9469!3d-37.6209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad69b37d4b4b9e1%3A0x5dc6d0b0f3a7c9b3!2s${data_address}!5e0!3m2!1sen!2sau!4vXXXXXXXXXXXX`);
          break;

        case "phone" : 
          $(".data_phone")
              .html(c.value ?? '')
              .prop("href", `tel:${c.value}`);
          break;

        case "jobs_email" : 
          $(".data_job_email")
              .html(c.value ?? '')
              .prop("href", `mailto:${c.value}`);                    
          break;            
          
        default:                
          if (socialKeys.has(c.key) && c.value) {
            $(".social-icon").append(
            `
            <li class="social-icon-item">
              <a href="${c.value}" class="social-icon-link bi-${c.key}"></a>
            </li>
            `
            );
          }
          break;
      }
    });
  }
    
  //CAREER
  var career = db?.data?.career?.filter(c=>{
    const listed = new Date(`${c["posted date"]}T00:00:00`);
    const expired = new Date(`${c["expiry date"]}T23:59:59`);
    const isActive = String(c.active || "").toLowerCase() === "y";
    return new Date() >= listed && new Date() <= expired && isActive;
  });

  var jobs_email = db?.data?.config?.find(x=> x.key=="jobs_email")?.value ?? "";
  var jobs_phone = db?.data?.config?.find(x => x.key == "jobs_phone")?.value ?? "";
  
  var careerParentDiv = "#careerParentDiv";
  $(careerParentDiv).html("");
  if(career==null || career?.length==0){
    var checklist = ["Name","Email address","Resume (mandatory)","Cover letter (optional)"];
    $(careerParentDiv).append(
      `<div class="custom-block-body text-center">
        <p>
            Currently, we have no positions available. But keep an eye as we are planning to post new opportunities very soon.
        </p>
        <p>
            Alternatively, feel free to send your details to us at <a class="fw-bold data_job_email" href="mailto:${jobs_email}">${jobs_email}</a> with:
        </p>
        <ul class="custom-list mt-2">
            ${
              checklist.map(list=>
                `<li class="custom-list-item d-flex"><i class="bi-check custom-text-box-icon me-2"></i>${list}</li>`
              ).join('')}
        </ul>
        <p>
            Please sepecify why you would want to work for us in not less than 100 words.
        </p>
      </div>`
      );
  }
  else{
    $(careerParentDiv).append(`<h5 class='text-start'>Opportunities available:</h5>`);
    career.forEach(c=>{
      var div = `
        <div class="accordion-item border-0 shadow-sm p-3 ">
          <div class="accordion-header" id="heading${c['id']}">
            <div class="position-relative accordion-button career-accordion-button border-0 collapsed d-flex align-items-center bg-transparent shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${c['id']}" aria-controls="collapse${c['id']}">
              <div class="d-flex flex-column">
                <strong class="text-secondary">${c['title']}</strong>
                <p class="text-muted fst-italic">
                  <i class="bi-geo-alt me-2"></i>
                  <span>${c['location']}</span>
                </p>
              </div>
              <span class="position-absolute top-0 end-0 badge job-type">${c['job type']}</span>
            </div>
          </div>

          <div id="collapse${c['id']}" class="accordion-collapse collapse" aria-labelledby="heading${c['id']}" data-bs-parent="${careerParentDiv}">
            <div class="accordion-body">
              <div class="d-flex flex-row justify-content-between">
                <small class="text-muted"><strong>Date :</strong> ${c['posted date']}</small>
                <small class="text-muted"><strong>Apply before :</strong> ${c['expiry date']}</small>
              </div>

              <p class="card-text mt-4"><strong>Description</strong></p>
              <p class="card-text ms-3">
                ${c['description']}
              </p>

              <p class="card-text mt-2"><strong>Details</strong></p>
              <p class="card-text ms-3">
                ${ c['details'].join("<br>") }
              </p>

              <p class="mt-2"><strong>Requirements</strong></p>
                        
              <div class="card-text ms-3 mb-2">
                <p class="fw-bold">Education</p>
                <p class="ms-2">
                  ${Array.isArray(c['education']) 
                      ? c['education'].join("<br>") 
                      : (c['education'] ?? '')
                  }
                </p>                                
              </div>

              <div class="card-text ms-3 mb-2">
                <p class="fw-bold">Experience</p>
                <p class="ms-2">
                  ${Array.isArray(c['experience']) 
                      ? c['experience'].join("<br>") 
                      : (c['experience'] ?? '')
                  }
                </p>                                
              </div>

              <div class="card-text ms-3 mb-2">
                <p class="fw-bold">Other requirements</p>
                <p class="ms-2">
                  ${Array.isArray(c['other requirements']) 
                      ? c['other requirements'].join("<br>") 
                      : (c['other requirements'] ?? '')
                  }
                </p>                                
              </div>

              <br>

              <div class="text-brandcolor fs-6 m-2 ms-0 fst-italic">
                <p><strong>Salary Insights:</strong> ${c['salary'] ?? 'TBA'}
                </p>
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
      $(careerParentDiv).append(div);
    });
  }
  notBusy();
}

function busy(){
  $(".backdrop").show();
}

function notBusy(){
  $(".backdrop").hide();
}

async function getAppData(){
  if(MOCK_DATA){
    await new Promise(resolve => setTimeout(resolve, 500));
    appData = getMockData();
    return;
  }
  try{
    let response = await fetch(`${url}?route=data`);
    if(!response.ok){
      alert("Website configuration error. Please notify administrator.");
    }
    let data = await response.json();
    appData = data;
  } catch(err){
    alert("Website configuration error. Please notify administrator.");
  }
}

function contactFormConfig(){
  return {
    id:"contact_form",
    containerId : "contact_form_holder",
    title:"Contact form",
    subtitle:"Or, you can just send an email: <a class='data_info_email'></a>",
    actions:[
      {
        id:"submit_contact_form",
        class : "form-control",
        text : "Send message",
        type: "submit",
        disabled : true,
        onClick : "submitData",
      }      
    ],
    fieldRows:
      [
        {
          "fieldColumns": [
            {
              id: 'firstName',
              name : 'First name',
              label: 'First name',
              class: 'col-sm-12 col-md-6',
              type: 'text',
              placeholder: 'First name',
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
              placeholder: 'Surname',
              required: true,
              value : 'Citizen',
              validation: {
                minLength: 2,
                errorMessage: 'Surame must be at least 2 characters long.'
              }
            }
          ]
        },
        {
          id: 'email',
          name : 'Email address',
          label: 'Email address',
          class: 'col-12',
          type: 'email',
          placeholder: 'Email address',
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
          class : 'col-12',
          placeholder: 'Mobile',
          required: true,
          value : '0452468331',
          validation: {
            regex: /^.{10,}$/,
            errorMessage: 'Enter a valid 10 digit mobile number (04xxxxxxxx).'
          }
        },
        {
        id: 'address',
        name : 'Address',
        label: 'Address',
        type: 'text',
        class : 'col-12',
        placeholder: 'Address',
        required: false,
        value : ''
      },
      {
        id: 'enquire',
        name : 'Enquire',
        label: 'How can we help you?',
        type: 'textarea',
        placeholder: 'How can we help you?',
        required: true,
        rows: 10,
        value : 'How can we help you',
        validation: {
          minLength: 1,
          errorMessage: 'Please ask a question.'
        }
      }
      ]
  };        
}

function getMockData(){
  return {
  "error": null,
  "data": {
    "config": [
      {
        "key": "primary_email",
        "value": "yourdomain.com@gmail.com"
      },
      {
        "key": "noreply_email",
        "value": "no-reply@yourdomain.com"
      },
      {
        "key": "info_email",
        "value": "info@yourdomain.com"
      },
      {
        "key": "jobs_email",
        "value": "jobs@yourdomain.com"
      },
      {
        "key": "admin_email",
        "value": "admin@yourdomain.com"
      },
      {
        "key": "phone",
        "value": "0400000000"
      },
      {
        "key": "jobs_phone",
        "value": "0400000000"
      },
      {
        "key": "address",
        "value": [
          "Level 1234",
          "255 George St",
          "The Rocks",
          "NSW, Australia"
        ]
      },
      {
        "key": "linkedin",
        "value": "www.linkedin.com"
      },
      {
        "key": "facebook",
        "value": "www.facebook.com"
      },
      {
        "key": "twitter",
        "value": "www.twitter.com"
      },
      {
        "key": "youtube",
        "value": "www.youtube.com"
      },
      {
        "key": "instagram",
        "value": "www.instagram.com"
      }
    ],
    "career": [
      {
        "id": "Job0512",
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
        "salary": null,
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
        "id": "Job0401",
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
    ]
  }
};
}




