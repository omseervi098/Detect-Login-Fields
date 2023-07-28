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
        loginFields.push({
          id: input.id,
          name: input.name,
          type: input.type,
          xpath: absoluteXPath(input),
          class: input.className,
        });
      }
    }
    for (let input of textFields) {
      if (input.type !== undefined) {
        if (input.hidden === true) {
          continue;
        } else {
          loginFields.push({
            id: input.id,
            name: input.name,
            type: input.type,
            xpath: absoluteXPath(input),
            class: input.className,
          });
        }
      }
    }
    for (let input of emailFields) {
      if (input.type !== undefined) {
        loginFields.push({
          id: input.id,
          name: input.name,
          type: input.type,
          xpath: absoluteXPath(input),
          class: input.className,
        });
      }
    }
    for (let input of submitFields) {
      if (input.type !== undefined) {
        loginFields.push({
          id: input.id,
          name: input.name,
          type: input.type,
          value: input.value,
          xpath: absoluteXPath(input),
          class: input.className,
        });
      }
    }
    for (let input of buttonFields) {
      if (input.type !== undefined) {
        loginFields.push({
          id: input.id,
          name: input.name,
          type: input.type,
          value: input.innerText,
          xpath: absoluteXPath(input),
          class: input.className,
        });
      }
    }
    //to save json file send it to server and save it there
    console.log(loginFields);
    await fetch("http://localhost:3000/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        url: window.location.href,
        loginFields: loginFields,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));

    return loginFields;
  }
  //call detectLoginFields function
  detectLoginFields();
}, 1500);
