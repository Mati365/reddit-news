/**
 * It helps with filling all forms
 * @param form  Form data
 */
const fillForms = function(form) {
  for(let id in form) {
    if(!form.hasOwnProperty(id))
      continue;

    let parent = document.getElementById(id);
    if(!parent)
      continue;

    for(var name in form[id])
      if(form[id].hasOwnProperty(name))
        parent[name].value = form[id][name];
  }
};

/**
 * Fill in form when there is message from background
 */
chrome.runtime.onMessage.addListener(fillForms);