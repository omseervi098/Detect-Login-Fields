//function to get absolute xpath of an element
function absoluteXPath(element) {
  if (!(element instanceof Element)) return "";
  const paths = [];
  while (element.nodeType === Node.ELEMENT_NODE) {
    let index = 0;
    let hasFollowingSiblings = false;
    let sibling = element.previousSibling;
    while (sibling) {
      if (
        sibling.nodeType !== Node.DOCUMENT_TYPE_NODE &&
        sibling.nodeName === element.nodeName
      ) {
        index++;
      }
      sibling = sibling.previousSibling;
    }
    sibling = element.nextSibling;
    while (sibling) {
      if (sibling.nodeName === element.nodeName) {
        hasFollowingSiblings = true;
        break;
      }
      sibling = sibling.nextSibling;
    }
    const tagName = element.nodeName.toLowerCase();
    const pathIndex = index || hasFollowingSiblings ? `[${index + 1}]` : "";
    paths.unshift(tagName + pathIndex);
    element = element.parentNode;
  }
  return paths.length ? `/${paths.join("/")}` : "";
}

//function to check if button is a login button
function checkButton(element) {
  const options = [
    "sign in",
    "login",
    "submit",
    "next",
    "continue",
    "continue with email",
  ];

  let ButtonTxt = element.innerText.toLowerCase();
  let ButtonVal = element.value.toLowerCase();
  let forButton = options.includes(ButtonTxt);
  let forInput = options.includes(ButtonVal);

  if (forButton || forInput) {
    return true;
  }
  return false;
}
function convert(input, username) {
  return {
    Type: input.type,
    Id: input.id,
    Name: input.name,
    Event: "",
    Value: input.value,
    ClassName: input.className,
    xpath: absoluteXPath(input),
    IdentifierType: "selenium",
    ExeName: "",
    Image_Score: "0.5",
    IdentifierValue: "",
    IsModifier: false,
    Comp_Type: null,
    ImgText: username ? "username" : "",
    ParentImageData: null,
  };
}

//wait for page to load and then detect login fields
setTimeout(function () {
  async function detectLoginFields() {
    console.log("DOM fully loaded and parsed");
    const loginFields = [];
    //check if it contains password,text,email,submit,button fields
    const passwordFields = document.querySelectorAll('input[type="password"]');
    const textFields = document.querySelectorAll('input[type="text"]');
    const emailFields = document.querySelectorAll('input[type="email"]');
    const submitFields = document.querySelectorAll('input[type="submit"]');
    const buttonFields = document.querySelectorAll('button[type="submit"]');
    let isLoginPage = false;
    //check if page is login page
    if (
      passwordFields.length > 0 &&
      (textFields.length > 0 || emailFields.length > 0)
    ) {
      console.log("This page is a login page");

      isLoginPage = true;
    } else {
      console.log("This page is not a login page");
      isLoginPage = false;
      return loginFields;
    }
    if (isLoginPage) {
      //create popup to ask user if he wants to save the login fields
      const iframe = document.createElement("iframe");
      iframe.id = "popup-frame-1";
      document.body.appendChild(iframe);
      iframe.contentDocument.write(
        `
          <div style="width: 100%; height: auto; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <h1 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Do you want to save the login fields?</h1>
            <div style="display: flex;flex-direction:column; justify-content: space-between; width: 100%;" id="detected-fields-12121">
            </div>
            <div style="display: flex; justify-content: space-between; width: 100%;margin-top:4px;">
              <button id="yes-12121" style="width: 100px; height: 40px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Yes</button>
              <button id="no-12121" style="width: 100px; height: 40px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">No</button>
            </div>
          </div>
       `
      );
      iframe.style.position = "fixed";
      iframe.style.top = "2%";
      iframe.style.right = "2%";
      iframe.style.width = "300px";
      iframe.style.minHeight = "280px";
      iframe.style.maxHeight = "500px";
      iframe.style.backgroundColor = "white";
      iframe.style.border = "1px solid black";
      iframe.style.zIndex = "9999";
      iframe.style.borderRadius = "5px";
      iframe.style.boxShadow = "0px 0px 10px 0px rgba(0,0,0,0.75)";

      for (let input of passwordFields) {
        if (input.type !== undefined) {
          loginFields.push(convert(input, false));
        }
      }
      for (let input of textFields) {
        if (input.type !== undefined) {
          if (input.hidden === true) {
            continue;
          } else {
            loginFields.push(convert(input, true));
          }
        }
      }
      for (let input of emailFields) {
        if (input.type !== undefined) {
          loginFields.push(convert(input, true));
        }
      }

      for (let input of submitFields) {
        if (input.type !== undefined) {
          loginFields.push({
            Type: input.type,
            Id: input.id,
            Name: input.name,
            Event: "click",
            Value: input.value,
            ClassName: input.className,
            xpath: absoluteXPath(input),
            IdentifierType: "selenium",
            ExeName: "",
            Image_Score: "0.5",
            IdentifierValue: "",
            IsModifier: false,
            Comp_Type: null,
            ImgText: "",
            ParentImageData: null,
          });
        }
      }
      for (let input of buttonFields) {
        if (input.type !== undefined) {
          if (checkButton(input)) {
            loginFields.push({
              Type: input.type,
              Id: input.id,
              Name: input.name,
              Event: "click",
              Value: input.value,
              ClassName: input.className,
              xpath: absoluteXPath(input),
              IdentifierType: "selenium",
              ExeName: "",
              Image_Score: "0.5",
              IdentifierValue: "",
              IsModifier: false,
              Comp_Type: null,
              ImgText: "",
              ParentImageData: null,
            });
          }
        }
      }
      //add login fields to created iframe
      const detectedFields = iframe.contentWindow.document.querySelector(
        "#detected-fields-12121"
      );
      let processedFields = [];
      let id = 0;
      for (let field of loginFields) {
        const fieldDiv = document.createElement("div");
        fieldDiv.style.display = "flex";
        fieldDiv.style.margin = "5px";
        fieldDiv.style.flexDirection = "column";
        fieldDiv.style.border = "1px solid black";
        fieldDiv.style.borderRadius = "5px";
        fieldDiv.style.backgroundColor = "#f1f1f1";
        fieldDiv.style.boxShadow = "0px 0px 10px 0px rgba(0,0,0,0.75)";
        fieldDiv.innerHTML = `
          <div style="display: flex; align-items: center; width: 100%; height: 100%;" id="field-${id++}">
          <input type="checkbox" style="width: 20px; height: 20px; margin-right: 10px; cursor: pointer;">
          <div style="display: flex; flex-direction: column; justify-content: space-between; width: 100%; height: 100%;">
          <p style="font-size: 15px; font-weight: 600; margin: 0px;">Type: ${
            field.Type
          }</p>
          <p style="font-size: 15px; font-weight: 600; margin: 0px;">Id: "${
            field.Id
          }"</p>
        
          <p style="font-size: 15px; font-weight: 600; margin: 0px;">ClassName: "${
            field.ClassName
          }"</p>
          </div>
            </div>
            `;
        //add event listener to checkbox
        fieldDiv.addEventListener("click", function () {
          const checkbox = fieldDiv.querySelector("input");
          //get the field by xpath
          const element = document.evaluate(
            field.xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
          //if checkbox is checked then add field to processed fields else remove it
          if (checkbox.checked) {
            processedFields.push(field);
            element.style.border = "2px solid red";
          } else {
            processedFields = processedFields.filter(
              (item) => item.Id !== field.Id
            );
            element.style.border = "none";
          }
        });

        detectedFields.appendChild(fieldDiv);
      }

      //to save json file send it to server and save it there
      iframe.contentWindow.document
        .getElementById("no-12121")
        .addEventListener("click", function () {
          iframe.remove();
        });
      iframe.contentWindow.document
        .getElementById("yes-12121")
        .addEventListener("click", function () {
          console.log(processedFields);
          fetch("http://localhost:3000/api/json", {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              URL: window.location.href,
              Driver: "chrome",
              LaunchType: "",
              WaitTime: 1,
              JSWaitTime: 500,
              ProcessName: "chrome",
              ThreadWait: 1000,
              ElementSearchCount: 0,
              PageLoadWait: 1000,
              path: "",
              RunAsDifferentUser: "",
              SeleniumData: processedFields,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              iframe.remove();
            });
        });
      return loginFields;
    }
  }
  //call detectLoginFields function
  detectLoginFields();
}, 1500);
