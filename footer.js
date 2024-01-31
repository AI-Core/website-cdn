  
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  const AICORE = (() => {
      // call init function when the page is ready
      if (document.readyState !== "loading") {
          init();
      } else {
          document.addEventListener("DOMContentLoaded", init);
      }
  
      // define global variables
      const NAV = document.querySelector(".nav");
        var NAV_MENU_BUTTON;
        var NAV_CLOSE
        if(NAV){
          NAV_MENU_BUTTON = NAV.querySelector(".nav-menu__btn");
          NAV_CLOSE = NAV.querySelector(".nav-close");
      }
  
      const QUIZ_CTA = document.querySelector(".quiz-cta__wrapper");
      const FOOTER_SPACER = document.querySelector(".footer-spacer");
  
      const SYNCED_SLIDERS = Array.from(document.querySelectorAll(".synced-slider"));
  
      const BP_DESKTOP = window.matchMedia("(min-width: 992px)");
      const BP_TABLET = window.matchMedia("(min-width: 768px)");
      const SUCCESS_STORIES = document.querySelector(".success-stories");
  
      const FORM_BUTTON_GROUPS = Array.from(document.querySelectorAll(".form-buttons"));
  
      // initial function
      function init() {
          prep();
          listeners();
          AICORE_DEFS();
      }
  
      function prep() {
          if (SYNCED_SLIDERS.length > 0) {
              createElement("script", document.body, {
                  src: "https://cdn.jsdelivr.net/npm/@splidejs/splide@4.0.7/dist/js/splide.min.js",
                  callback: initSyncedSliders
              });
          }
  
          if (QUIZ_CTA) resizeFooter();
  
          if (SUCCESS_STORIES) successPlacement();
      }
  
      function listeners() {
          window.onscroll = () => {
                if(NAV){
                    if (NAV.classList.contains("is--static")) return;
                if (window.scrollY >= 64) {
                    NAV.classList.add("is--scrolled");
                } else {
                    NAV.classList.remove("is--scrolled");
                }
              }
          };
  
          if (NAV_CLOSE) {
              NAV_CLOSE.onclick = () => {
                  NAV_MENU_BUTTON.click();
              };
          }
  
          if (QUIZ_CTA) {
              window.onresize = () => {
                  resizeFooter();
              };
          }
  
          if (SUCCESS_STORIES) {
              window.addEventListener("resize", () => {
                  successPlacement();
              });
          }
  
          FORM_BUTTON_GROUPS.forEach((group) => {
              group.firstElementChild.onclick = () => {
                  group.lastElementChild.click();
              };
          });
      }
  
      function resizeFooter() {
          let ctaHeight = QUIZ_CTA.offsetHeight;
          FOOTER_SPACER.style.height = `${ctaHeight}px`;
      }
  
      function initSyncedSliders() {
          SYNCED_SLIDERS.forEach((slider) => {
              const groups = slider.querySelectorAll(".splide");
  
              let main = new Splide(groups[0], {
                  focus: "center",
                  gap: "2.5rem",
                  type: "loop",
                  perPage: 3,
                  breakpoints: {
                      991: {
                          perPage: 2,
                          focus: 1
                      },
                      767: {
                          perPage: 1,
                          focus: "center"
                      }
                  }
              });
  
              let sub = new Splide(groups[1], {
                  // rewind: true,
                  isNavigation: true,
                  // gap: 10,
                  arrows: false,
                  focus: "center",
                  type: "loop",
                  gap: "0.25rem",
                  perPage: 21,
                  breakpoints: {
                      1440: {
                          perPage: 15,
                          focus: "center"
                      },
                      991: {
                          perPage: 13,
                          focus: 1
                      },
                      767: {
                          perPage: 11,
                          focus: "center"
                      },
                      479: {
                          perPage: 9,
                          focus: "center"
                      }
                  }
              });
  
              main.sync(sub);
              main.mount();
              sub.mount();
          });
      }
  
      function successPlacement() {
          // check if desktop
          let isTablet = BP_TABLET.matches;
  
          // get number of columns in grid
          let gridComputedStyle = window.getComputedStyle(SUCCESS_STORIES);
          let gridColumnCount = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ")
              .length;
  
          // if two columns and isTablet
          // make last item span full width
          // else let it be placed by Webflow
          if (gridColumnCount === 2 && isTablet) {
              SUCCESS_STORIES.lastElementChild.style.gridColumn = "1 / -1";
          } else {
              SUCCESS_STORIES.lastElementChild.style.removeProperty("grid-column");
          }
      }
  
      function createElement(type, location, options = {}) {
          let element = document.createElement(type);
  
          Object.entries(options).forEach(([key, value]) => {
              if (key === "class") {
                  element.classList.add(value);
                  return;
              }
  
              if (key === "dataset") {
                  Object.entries(value).forEach(([dataKey, dataValue]) => {
                      element.dataset[dataKey] = dataValue;
                  });
                  return;
              }
  
              if (key === "text") {
                  element.textContent = value;
                  return;
              }
  
              if (key === "callback") {
                  element.onload = value;
                  return;
              }
  
              element.setAttribute(key, value);
          });
  
          location.appendChild(element);
          return element;
      }
  
      return {
          createElement
      };
  })();
  
  const AICORE_DEFS = () => {
      // define global variables
      const DEFAULT_COUNTRY = "GB";
      let phone_number_formatter;
      let containsForms = document.querySelector("form");
      const QUIZ_TYPEFORM_WRAPPER = document.querySelector(".quiz-typeform-container");
        const PATHWAY_TYPEFORM_WRAPPER = document.querySelector(".pathway-quiz-typeform-container");
      const ANNOUNCEMENT_CONTAINER = document.querySelector("#announcement-container");
        const isPathwayPage = window.location.href.includes("/courses")
    
  
      // call init function when the page is ready
      if (document.readyState !== "loading") {
          init();
      } else {
          document.addEventListener("DOMContentLoaded", init);
      }
  
      // initial function
      function init() {
            captureParams();
            pathwayRecommendationSubmission();
        
      if (!containsForms && !QUIZ_TYPEFORM_WRAPPER && !PATHWAY_TYPEFORM_WRAPPER) return;
  
          prepForms();
          formSubmissions();
      }
      
      //show announcement container if in england
      if(ANNOUNCEMENT_CONTAINER){
          setTimeout(()=>{
              if(window.aiCoreParams.region=="England"){
                  ANNOUNCEMENT_CONTAINER.style.display = "flex";
              }
          }, 1000)	
      }
      
      
      function captureParams(){
        // get search parameters
          let urlParams = new URLSearchParams(window.location.search);
          window.aiCoreParams = {
              gclid: urlParams.get("gclid"),
              fbclid: urlParams.get("fbclid"),
              source: urlParams.get("utm_source"),
              campaign: urlParams.get("utm_campaign"),
              acquisition_channel: urlParams.get("aq_c"),
              affiliate: urlParams.get("aff"),
              referral: urlParams.get("referral"),
                li_fat_id: urlParams.get("li_fat_id"),
                country: localStorage.getItem('country'),
                countryCode: localStorage.getItem("countryCode"),
              currencyCode: localStorage.getItem("currencyCode"),
              region: localStorage.getItem("region")
          };
            
            // save and update all params
            for (let [key, value] of Object.entries(window.aiCoreParams)) {
                //save value in local storage if it exists
              if (value) {
                  window.localStorage.setItem(key, value);
              } else if(window.localStorage.getItem(key)){ //else get from local storage
                  window.aiCoreParams[key] = window.localStorage.getItem(key);
              }
          }
  
          let fbc = document.cookie
                  .split(";")
                  .filter((c) => c.includes("_fbc="))
                  .map((c) => c.split("_fbc=")[1])[0];
            if(!fbc && window.aiCoreParams.fbclid){
              fbc = `fb.1.${Date.now()}.${window.aiCoreParams.fbclid}`;
          }else{
            fbc=""
          }
  
          let fbp = document.cookie
              .split(";")
              .filter((c) => c.includes("_fbp="))
              .map((c) => c.split("_fbp=")[1])[0];
          if (!fbp) {fbp = "";}
  
          window.aiCoreParams.fbc = fbc;
          window.aiCoreParams.fbp = fbp;
        
            retrieveSID().then((sid) => {
               //set sid
              window.aiCoreParams.sid = sid;
          });
        
            // if value doesn't exist, replace with empty string instead so not null
          for (let [key, value] of Object.entries(window.aiCoreParams)) {
              if (!value) window.aiCoreParams[key] = ""
          }
      }
      function prepForms() {
            
            for (let [key, value] of Object.entries(window.aiCoreParams)) {
              // add value to any hidden inputs with the relevant name
                if(value){
                let inputs = document.querySelectorAll(`input[type="hidden"][name="${key}"]`);
                Array.from(inputs).forEach((input) => {
                    input.value = value;
                });
              }
          }

            AICORE.createElement("script", document.body, {
                src: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.16/build/js/intlTelInput.min.js",
                callback: validateInputs
            });
            
  
          retrieveSID().then((sid) => {
               //set sid
              window.aiCoreParams.sid = sid;
            
               // add sid value to any hidden inputs with the relevant name
               let inputs = document.querySelectorAll(`input[type="hidden"][name="sid"]`);
                Array.from(inputs).forEach((input) => {
                  input.value = sid;
                });
              
            
               //add typeform quiz
              if (QUIZ_TYPEFORM_WRAPPER){injectQuizTypeform();}
                if (PATHWAY_TYPEFORM_WRAPPER){injectPathwayQuizTypeform();}
          });
      }
  
      async function retrieveSID() {
          return new Promise(async (resolve, reject) => {
              let sid;
              let n_tries = 0;
              while (true) {
                  await new Promise((resolve, reject) => {
                      setTimeout(() => {
                          resolve();
                      }, 50);
                  });
                  try {
                      sid = analytics.user().anonymousId();
                      break;
                  } catch (e) {
                      if (n_tries > 150) {
                          sid = "";
                          break;
                      }
                  }
                  n_tries += 1;
              }
              resolve(sid);
          });
      }
  
      function formSubmissions() {
          // on form submission
          let brochureForm = document.querySelector("#wf-form-Brochure-form");
          if (brochureForm) {
              // open modal if needed
              let autoModal = window.localStorage.getItem("brochure_downloaded");
              if (!autoModal)
                  setTimeout(() => {
                      toggleModal(true);
                  }, 75000);
  
              // listen for submission
              $("#wf-form-Brochure-form").submit((e) => {
                  // save the current form for ease
                  let currentForm = e.target;
  
                  // get form values
                  // set to the same variable name as is sent to analytics
                  let firstName = currentForm.querySelector('input[name="forename"]').value;
                  let lastName = currentForm.querySelector('input[name="surname"]').value;
                  let email = currentForm.querySelector('input[name="email"]').value.toLowerCase();
                  let phone = currentForm.querySelector('input[name="phone"]').value;
                  let engaged_reason = currentForm.querySelector('select[name="engaged-reason"]').value;
  
                  // send to analytics
                  analytics.identify(email, {
                      email,
                      firstName,
                      lastName,
                      phone
                  });
                
                    // determine select value
                  let value;
                  switch (engaged_reason) {
                      case "I want to launch my career in Ai & Data":
                          value = 342.00;
                          break;
                      case "To learn if Ai & Data is right for me":
                          value = 243.98;
                          break;
                      case "For fun/other":
                          value = 178.87;
                          break;
                      default:
                          value = 172.06;
                  }
                
                    if(window.aiCoreParams.gclid){
                    value = value*1.3
                  }else if(window.aiCoreParams.fbclid){
                    value = value*0.5;
                  }
  
                  // track analytics
                  analytics.track("Brochure downloaded", {
                      engaged_reason: engaged_reason,
                      ...(window.aiCoreParams.fbc && {fbc: window.aiCoreParams.fbc}),
                      ...(window.aiCoreParams.fbp && {fbp: window.aiCoreParams.fbp}),
                    value,
                    currency: "GBP"
                  });
  
                  // events
                  gtag("event", "Brochure downloaded", { value, currency: "GBP"});
  
                  // open new window
                  window
                      .open(
                          "https://theaicore.com/brochure-download",
                          "_blank"
                      )
                      .focus();
  
                  // close modal and set downloaded to true
                  toggleModal(false);
                  window.localStorage.setItem("brochure_downloaded", "true");
              });
          }
      }
    
        function pathwayRecommendationSubmission(){
        if (window.location.href.includes("/courses")){
          let specialism_mapping = {
            "data-engineering": "Data engineering",
            "data-science": "Data science",
            "data-analytics": "Data analytics",
            "end-to-end": "End to end",
            "machine-learning-engineering": "Machine learning engineering"
          }
          let specialism
          for(let k in specialism_mapping){
            if(window.location.href.includes(k)){
              specialism = specialism_mapping[k]
            }
          }
            
          let urlParams = new URLSearchParams(window.location.search);
          let email = urlParams.get("rec_em")
  
          if(email){
            fetch("https://hooks.zapier.com/hooks/catch/7950914/36alfte/", {
              method: "POST",
              body: JSON.stringify({
                email,
                specialism
              })
            });
          }
  
          let goal = urlParams.get("q1")
          let career_status = urlParams.get("q2")
          let education_background = urlParams.get("q9")
  
          let map_goal = {
              "Launch my career in Ai": "launch",
              "Switch from my existing career to Ai": "switch",
              "Learn how to apply Ai": "learn",
              "Satisfy my intellectual curiosity or passion": "curiosity"
          }
          let map_career_status = {
              "I am younger than 18 years old": "under18",
              "I am currently studying at university": "studying",
               "I have recently graduated from university": "graduate",
                "I am currently working in Ai": "aidata_career",
                "I am established in a STEM career": "stem_career",
                "I am established in a non-STEM career": "nonstem_career"
          }
          let map_education_background = {
              "I didn": "nodegree",
              "Computer Science": "compsci",
                "STEM discipline": "stem",
                "Non-STEM discipline": "nonstem"
          }
  
          let value = 50
  
          try{
  
            for(let k in map_goal){
              if(goal.startsWith(k)){
                goal = map_goal[k]
              }
            }
            for(let k in map_career_status){
              if(career_status.startsWith(k)){
                career_status = map_career_status[k]
              }
            }
            for(let k in map_education_background){
              if(education_background.startsWith(k)){
                education_background = map_education_background[k]
              }
            }
  
            if(goal=="launch" || goal=="switch"){
              switch (career_status){
                  case "nonstem_career":
                  value = 150.96
                  if(educational_background=="nodegree"){
                      value = 0 //50.32
                  }else if(educational_background=="nonstem"){
                      value = 10 //75.48
                  }
                  break;
                case "graduate":
                  value = 166.7
                  break;
                case "studying":
                  value = 70.83
                  break;  
                case "stem_career":
                  value = 120.91
                  break;
                default:
  
              }
            }
          }catch(e){
              console.log("error", e)
          }
          
          if(window.aiCoreParams.gclid){
          }else if(window.aiCoreParams.fbclid){
            value = value*0.5;
          }
          gtag('event', 'Submitted pathway recommendation', {value, currency: "GBP"});
          fbq('track', 'Purchase', {value, currency: "GBP"});
        }
      }
  
      function validateInputs() {
          let inputs = document.querySelectorAll("input");
          Array.from(inputs).forEach((input) => {
              if (input.type === "tel") validatePhone(input);
              if (input.type === "email") validateEmail(input);
          });
      }
  
      function validatePhone(phoneInput) {
        var preferredCountries = ["US", "CA", "GB"]
        var iti = intlTelInput(phoneInput, {
          initialCountry: window.aiCoreParams.countryCode?window.aiCoreParams.countryCode:"us",
          hiddenInput: function(phone) {
            return "intl_phone"
          },
          preferredCountries,
          countrySearch: false,
          utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.1/build/js/utils.js"
        });
        
        var updateInputValue = function (event) {
               //dialCode.value = "+" + iti.getSelectedCountryData().dialCode;
        };
        //phoneInput.addEventListener('input', updateInputValue, false);
        //phoneInput.addEventListener('countrychange', updateInputValue, false);
      }
  
      function validateEmail(emailInput) {
          emailInput.addEventListener("input", function (event) {
              emailInput.value = emailInput.value.trim();
              let email = emailInput.value;
              let valid = String(email)
                  .toLowerCase()
                  .match(
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  );
              if (!valid) {
                  emailInput.setCustomValidity("Invalid email address.");
              } else {
                  let spelling_error =
                      email.endsWith(".con") ||
                      email.endsWith(".conm") ||
                      email.endsWith(".comn") ||
                      email.endsWith(".coml") ||
                      email.endsWith("ukuk") ||
                      email.endsWith(".ul") ||
                      email.endsWith(".k") ||
                      email.endsWith(".fom");
                  if (spelling_error) {
                      emailInput.setCustomValidity("Check email for spelling mistake.");
                  } else {
                      emailInput.setCustomValidity("");
                  }
              }
          });
      }
  
      function toggleModal(open) {
          if (open) {
              document.querySelector(".button.is--modal").click();
          } else {
              document.querySelector(".modal-close").click();
          }
      }
  
      async function injectQuizTypeform() {
          let form_container = document.querySelector(".quiz-typeform-container");
          let url = window.location.href;
          let split_on_hash = url.split("#");
          if (split_on_hash.length > 1) hidden_fields = split_on_hash[split_on_hash.length - 1];
  
          setTimeout(()=>{
            console.log('adding quiz', window.aiCoreParams)
            // add variables to typeform url
              form_container.innerHTML = `<div data-tf-disable-auto-focus data-tf-widget="JkXWqhUy" data-tf-iframe-props="title=AiCore Quiz" data-tf-medium="snippet" data-tf-hidden="sid=${window.aiCoreParams.sid},gclid=${window.aiCoreParams.gclid},fbclid=${window.aiCoreParams.fbc},referral=${window.aiCoreParams.referral},fbp=${window.aiCoreParams.fbp},affiliate=${window.aiCoreParams.affiliate},li_fat_id=${window.aiCoreParams.li_fat_id},country=${window.aiCoreParams.country},currency=${window.aiCoreParams.currencyCode},response_id=${uuidv4()}" style="width:100%;height:100%;"></div>`
            var s = document.createElement( 'script' );
            s.setAttribute( 'src', "//embed.typeform.com/next/embed.js");
            document.body.appendChild( s );
          }, 500)
      }
    
        async function injectPathwayQuizTypeform() {
          let form_container = document.querySelector(".pathway-quiz-typeform-container");
          let url = window.location.href;
          let split_on_hash = url.split("#");
          if (split_on_hash.length > 1) hidden_fields = split_on_hash[split_on_hash.length - 1];
        
  
          setTimeout(()=>{
            //console.log('adding quiz', window.aiCoreParams)
            // add variables to typeform url
              form_container.innerHTML += `<div data-tf-disable-auto-focus data-tf-opacity="0" data-tf-widget="HVqGnkwK" data-tf-iframe-props="title=Personalised learning path" data-tf-medium="snippet" data-tf-hidden="sid=${window.aiCoreParams.sid},gclid=${window.aiCoreParams.gclid},fbclid=${window.aiCoreParams.fbc},referral=${window.aiCoreParams.referral},fbp=${window.aiCoreParams.fbp},affiliate=${window.aiCoreParams.affiliate},li_fat_id=${window.aiCoreParams.li_fat_id},country=${window.aiCoreParams.country},currency=${window.aiCoreParams.currencyCode}" style="width:100%;height:100%;"></div>`
            var s = document.createElement( 'script' );
            s.setAttribute( 'src', "//embed.typeform.com/next/embed.js");
            document.body.appendChild( s );
          }, 500)
      }
  
      return {
          toggleModal
      };
  };
  
