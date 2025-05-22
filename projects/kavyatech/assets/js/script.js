const DEBUG_MODE = false;
const BLANK_FORM = true;
const SEND_DATA = true;

$(document).ready(function() {
    //ABOUT SECTION TYPING EFFECT
    typeNextChar(DEBUG_MODE);

    //COG-WHEEL
    $('[id^="cog-wheel"]').each(function () {
        const $container = $(this);
        const id = $container.attr('id');

        const parts = id.split('-');
        const count = parseInt(parts[2]) || 12; 
        const directionFlag = parts[3];

        const $cogWheel = $('<div>')
            .addClass('cog-wheel')
            .css('--count', count);

        const $center = $('<div>').addClass('cog-center');
        $cogWheel.append($center);

        for (let i = 0; i < count; i++) {
            const $tooth = $('<div>')
            .addClass('tooth')
            .css('--i', i)
            .css('--count', count)
            .css('transform', `rotate(${(360 / count) * i}deg) translateY(calc(var(--cogwheel-height) / 2))`);
            $cogWheel.append($tooth);
        }

        $container.append($cogWheel);

        const teeth = $cogWheel.find('.tooth');
        teeth.each(function (i) {
            setTimeout(() => {
            $(this).addClass('visible');
            }, i * 150);
        });

        if (directionFlag === '1') {
            $cogWheel.addClass('rotate-clockwise');
        } else if (directionFlag === '0') {
            $cogWheel.addClass('rotate-anticlockwise');
        }
    });

    //HOVER EFFECT ON CARD
    $(".card, .spinner-item").on("mousemove", function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        $(this).css("--x", `${x}px`);
        $(this).css("--y", `${y}px`);
    });


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
        $('#dbTableWrapper').css("opacity",0);

        let i = 0;
        const interval = setInterval(() => {
            $('#sqlText').html('<span>' + rawText.slice(0, i + 1) + '<span class="cursor-animated">&nbsp;|</span></span>');
            i++;
            if (i === rawText.length) {
            clearInterval(interval);

            setTimeout(() => {
            $('#dbTableWrapper').css("opacity",1);
            setTimeout(animateQuery, pauseBeforeRestartMS);
            }, pauseBeforeTableMS);
            }
        }, delayPerCharMS);
    }

    animateQuery();
    
    //PROJECTS
    [ 
        {
            title : "Personal Website",
            client : "Sanjay Hamal",
            lastUpdated : "Jun 2022",
            source : "https://hamalsanjay.com.np/",
            url : "https://hamalsanjay.com.np/"
        },
        {
            title : "Company Website",
            client : "Bloomence Care Services",
            lastUpdated : "June 2025",
            source : "https://vijayhamal.com.np/client/aus/0449817274/sample1.html",
            url : "https://vijayhamal.com.np/client/aus/0449817274/sample1.html"
        }
    ].forEach(el=>{
        var html = `
            <div class="card project-card">
                <div class="project-card-top">
                    <h2 class="card-title">${el.title}</h2>
                    <div class="project-sample-iframe">
                        <iframe src="${el.source}"></iframe>
                    </div>
                </div>                        
                <div class="project-card-bottom">                           
                    <div>Client : ${el.client}</div>
                    <div>Last Updated : ${el.lastUpdated}</div>

                    <button class="btn flex flex-row justify-content-center align-items-center">                                
                        <a href="${el.source}" target="_blank" >
                            <i class="material-icons">open_in_new</i>
                            <span>&nbsp;&nbsp;Open in new tab</span>
                        </a>
                    </button>                            
                </div>
            </div>
            `;
        $(".project-display").append(html);
    });

    function updateProjectDisplay() {
        var $container = $('.project-display');
        if ($container[0].scrollWidth > $container[0].clientWidth) {
            $container.css('justify-content', 'start');
        } else {
            $container.css('justify-content', 'center');
        }
    }

    $(window).on('resize', updateProjectDisplay);
    updateProjectDisplay();
    
    initializeContactForm(BLANK_FORM);
});

//ABOUT US
const htmlLines = [
  `<h1 class="digitize">Kavya Tech </h1>`,
  `    <p>We are an innovative tech company founded on the base of over <span class="yearsofexpertise">${new Date().getFullYear() - 2017} years</span> of expertise in Information Technology.</p>`,
  `    <p>At Kavya Tech Solutions, we turn innovative ideas into reliable software solutions. Founded by <a class="profile-link" href="https://vijayhamal.com.np"><strong>Vijay Hamal</strong></a>, an experienced Software Engineer, we specialize in building scalable, robust, and user-friendly apps using modern tools and technologies.</p>`,
  `    <br>`,
  `<h2  class="core-values">Core Values</h2>`,
  `    <ul>`,
  `      <li><strong>Innovation:</strong> Delivering creative and effective solutions.</li>`,
  `      <li><strong>Quality:</strong> Building reliable and scalable software.</li>`,
  `      <li><strong>Integrity:</strong> Transparent and honest communication.</li>`,
  `      <li><strong>Customer Focus:</strong> Tailoring solutions to client needs.</li>`,
  `      <li><strong>Continuous Learning:</strong> Staying updated with the latest tech trends.</li>`,
  `    </ul>`,
  `    <br></br>`,
  `    <p><strong>We are committed to helping your business succeed through technology.</strong></p>`
];

function highlightHTML(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(&lt;\/?)(\w+)([^&]*?)(&gt;)/g, function(_, open, tag, attr, close) {
      const highlightedOpen = open.replace(/(&lt;)(\/?)/, function(_, lt, slash) {
        return `<span class="bracket">${lt}</span>` + (slash ? `<span class="slash">${slash}</span>` : '');
      });

      const highlightedAttrs = attr.replace(/(\w+)=["'](.*?)["']/g, function(_, name, val) {
        return `<span class="attr">${name}</span>=<span class="value">"${val}"</span>`;
      });

      const highlightedClose = `<span class="bracket">&gt;</span>`;
      return `${highlightedOpen}<span class="tag">${tag}</span>${highlightedAttrs}${highlightedClose}`;
    });
}

function typeNextChar(debug = false) {
  const $codeDisplay = $("#codeDisplay");
  const $renderedOutput = $("#renderedOutput");

  if (debug) {
    let lineCount = 1;
    $.each(htmlLines, function(_, line) {
      const $lineDiv = $("<div>").addClass("code-line");
      const $lineNum = $("<span>").addClass("line-number").text(lineCount++);
      const $codeContent = $("<span>").addClass("code-content").html(highlightHTML(line));

      $lineDiv.append($lineNum).append($codeContent);
      $codeDisplay.append($lineDiv);
      $renderedOutput.append(line + '\n');
    });
  } else {
    let lineIndex = 0;
    let charIndex = 0;
    let currentLine = '';
    let lineCount = 1;

    let $currentLineDiv = null;
    let $codeContent = null;

    function typeChar() {
      if (lineIndex >= htmlLines.length) return;

      const line = htmlLines[lineIndex];
      currentLine += line[charIndex];
      charIndex++;

      if (!$currentLineDiv) {
        $currentLineDiv = $("<div>").addClass("code-line");
        const $lineNum = $("<span>").addClass("line-number").text(lineCount);
        $codeContent = $("<span>").addClass("code-content");

        $currentLineDiv.append($lineNum).append($codeContent);
        $codeDisplay.append($currentLineDiv);
      }

      $codeContent.html(highlightHTML(currentLine));

      if (charIndex <= line.length) {
        setTimeout(typeChar, 5);
      } else {
        $renderedOutput.append(line + '\n');

        // Prepare next line
        currentLine = '';
        charIndex = 0;
        lineIndex++;
        lineCount++;

        $currentLineDiv = null;
        setTimeout(typeChar, 10);
      }
    }

    typeChar();
  }
}

//CONTACT FORM
function initializeContactForm(isBlank) {
    $(".btn-send-query").addClass("disabled");
    $(".btn-send-query").show();
    $("#dynamicForm").html("");
    $("#formProcessingStatus").hide();

    const formConfig = contactFormConfigDefinition();

    formConfig.forEach(fieldRow => {
        if (fieldRow.fields.length > 0) {
            let formRow = $('<div class="row w-100"></div>');
            fieldRow.fields.forEach(field => {
                let formGroup = $(`<div class="form-group ${field.class ?? 'col-12'}"></div>`);
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
    
    sendData(formDataString);
});

$(document).on('click', '.btn-send-another', function(event){
    initializeContactForm(BLANK_FORM);
});


function sendData(formDataString){
     $("#contact .radar").show();
    if(!SEND_DATA){
        console.log(formDataString);
        setTimeout(() => {
            $("#contact .radar").hide();
            showSuccess(); 
        }, 2000);
        return;
    }
   
    var url = "https://script.google.com/macros/s/AKfycbxM2J9pWwJB_YR0nxJ0aKCp1zgMVdfLHLJFQ1EzBm61mbOrl2SKNhGl1HkYVxiqTH-V/exec";
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
        $("#contact .radar").hide();
        response.status == 200 ? showSuccess() : showFailure();
        
    });
}

function showSuccess(){
    $("#dynamicForm").html("<div class='text-success' role='alert'>Your response has been received successfully.</div><button class='btn btn-send-another'>Send another</button>");
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
                    value : 'VIJAY HAMAL',
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
                    class: 'col-12 col-md-6',
                    type: 'email',
                    placeholder: 'john.citizen@email.com',
                    value : 'hamal.vijay@gmail.com',
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
                    class : 'col-12 col-md-6',
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
                value : 'U1 265 HPD North Gosford, 2250',
                
            }
            ]
        },
        {
            fields : [
            {
                id: 'enquire',
                name : 'Query',
                label: 'Tell us about your query',
                type: 'textarea',
                placeholder: 'Type your query here',
                required: true,
                rows: 10,
                value : 'This is a general enquire text. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
                validation: {
                    minLength: 1,
                    errorMessage: 'You have not written your query'
                }
            }
            ]
        },
    ];        
}


