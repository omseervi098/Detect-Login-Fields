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
  const options = ["sign in", "login", "submit", "next", "continue"];

  let ButtonTxt = element.innerText.toLowerCase();
  let ButtonVal = element.value.toLowerCase();
  let forButton = options.includes(ButtonTxt);
  let forInput = options.includes(ButtonVal);

  if (forButton || forInput) {
    return true;
  }
  return false;
}
function convert(input) {
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
    ImgText: "username",
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
    //check if page is login page
    if (
      passwordFields.length > 0 &&
      (textFields.length > 0 || emailFields.length > 0)
    ) {
      console.log("This page is a login page");
    } else {
      console.log("This page is not a login page");
      return loginFields;
    }
    for (let input of passwordFields) {
      if (input.type !== undefined) {
        loginFields.push(convert(input));
      }
    }
    for (let input of textFields) {
      if (input.type !== undefined) {
        if (input.hidden === true) {
          continue;
        } else {
          loginFields.push(convert(input));
        }
      }
    }
    for (let input of emailFields) {
      if (input.type !== undefined) {
        loginFields.push(convert(input));
      }
    }

    for (let input of submitFields) {
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
            ImgText: "username",
            ParentImageData: null,
          });
        }
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
            ImgText: "username",
            ParentImageData: null,
          });
        }
      }
    }
    //to save json file send it to server and save it there
    console.log(loginFields);
    await fetch("http://localhost:3000/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        url: window.location.href,
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
        SeleniumData: loginFields,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));

    return loginFields;
  }
  //call detectLoginFields function
  detectLoginFields();
}, 1500);
