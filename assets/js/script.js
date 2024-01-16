var isSelfHosting = document.getElementById('SELFHOST');
let essaySubmission = document.getElementById('essay-submission');
let additionalContent = '<div class="overlay" id="loading-overlay" style="display: none;"></div>'

// ensure textbox can always be clicked
essaySubmission.addEventListener('input', function(event) {
    // Check if the innerHTML only contains the button
    if (this.innerHTML.trim() === additionalContent) {
        this.innerHTML = '&#8203;' + this.innerHTML; // Adds a zero-width space at the beginning
        essaySubmission.style.color = "black";
    } 
    
});

// remove placeholder text on focus
const placeholderText = "\u200B" + "Write your message here..."; 
// const onboardingPlaceholder = "\u200B" + "Write your message here... try \"What should my new years resolution be as an aspiring prompt engineer?\""
const onboardingPlaceholder = "\u200B" + "Write a message here... you'll get a response for each of your prompts"
essaySubmission.addEventListener("focus", function () {
    let clone = essaySubmission.cloneNode(true);

    // Remove all child elements (keep only text nodes)
    Array.from(clone.childNodes).forEach(node => {
        if (node.nodeType !== Node.TEXT_NODE) {
            clone.removeChild(node);
        }
    });
    let textContent = clone.textContent.trim();
    if (textContent === placeholderText || textContent === onboardingPlaceholder) {
        essaySubmission.innerHTML = "\u200B" + additionalContent;
        essaySubmission.style.color = "black";
    } 
});

// Reload with last used prompts in place
let promptHist = localStorage.getItem("usageHistory");
        if (promptHist) {
            promptArr = JSON.parse(promptHist);
            for (let i = 0; i < 3; i++) {
                if (promptArr[i][0]) {
                    document.getElementById(`toggle-${3 - i}-prompt`).innerText = "\u200B" + promptArr[i][0];
                }
            }
        }

// Settings menu
function toggleSettings() {
    let settings = document.getElementById("settings");
    if (settings.style.display === "block") {
        settings.style.display = "none";
        document.getElementById("key-status").style.display = "none";
        document.getElementById("model-status").style.display = "none";
    } else {
        document.getElementById("model-name").textContent = `Current model is ${MODEL_NAME}`;
        settings.style.display = "block";
    }
}
var slider = document.getElementById('myRange');
if (slider && essaySubmission) {
    slider.addEventListener('input', function() {
        var sliderValue = this.value;
        var newHeight = 'calc(' + sliderValue + 'vh - 4em)';
        essaySubmission.style.height = newHeight;
    });
} else {
    console.error('Slider or essay submission element not found.');
}

var keyForm = document.getElementById('key-form');
var keyInput = document.getElementById('key');
var modelForm = document.getElementById('model-form');
var modelInput = document.getElementById('model-input');

var OPENAI_KEY = localStorage.getItem('OPENAI_KEY');
var MODEL_NAME = localStorage.getItem('MODEL_NAME');


// the onboarding case
if (!OPENAI_KEY && !MODEL_NAME) {
    essaySubmission.style.color = "rgb(96 96 96)";
    document.querySelectorAll('.prompt-toggle').forEach(toggle => {toggle.classList.add('covered'); toggle.style.display = "none"});
    
}

if (!OPENAI_KEY && !isSelfHosting) {
    document.getElementById("onboarding").style.display = "block";
    keyForm.addEventListener('click', function(event) {
        OPENAI_KEY = keyInput.value; 
        localStorage.setItem('OPENAI_KEY', OPENAI_KEY);
        document.getElementById("onboarding").style.display = "none";
        let firstBox = "response-1";
        if (window.screen.width < 720) {// if is mobile
            firstBox = "response-3"
        } 
        document.getElementById(firstBox).classList.add('animate-background');
        document.getElementById(firstBox).addEventListener('click', function(e) {
            e.currentTarget.classList.remove('animate-background');
        })
        settingsHint();
    });
}
if (!MODEL_NAME && !isSelfHosting) {
    MODEL_NAME = "gpt-3.5-turbo";
    localStorage.setItem('MODEL_NAME', "gpt-3.5-turbo");
} else if (!MODEL_NAME && isSelfHosting) {
    MODEL_NAME = "gpt-4-1106-preview";
    localStorage.setItem('MODEL_NAME', "gpt-4-1106-preview");
}


if (isSelfHosting) {
    document.getElementById("remove-key").style.display = "none";
    
    if (!MODEL_NAME) {
        document.getElementById("onboarding").style.display = "block";
        modelOnboard = document.getElementById("model-form-onboard");
        modelOnboard.addEventListener('click', function(event) {
            MODEL_NAME = document.getElementById("model-input-onboard").value; 
            localStorage.setItem('MODEL_NAME', MODEL_NAME);
            document.getElementById("model-name").textContent = `Current model is ${MODEL_NAME}`;
            document.getElementById("onboarding").style.display = "none";
            settingsHint()
    });
    }
} 

function settingsHint() {
    document.getElementById("settings-button").classList.add("expand");

    info = document.createElement("button");
    info.classList.add("settings-toggle", "essay-button", "info", "extra");
    info.textContent = "Change settings";
    setTimeout(() => {
        document.getElementById("document-body").classList.add("hide-scroll");
        document.getElementById("document-body").prepend(info);
        info.addEventListener("click", toggleSettings);
    }, 8000);
    setTimeout(() => {
        info.style.opacity = '1';
        info.style.transform = 'translateX(0)';
    }, 8100);
    setTimeout(() => {
        document.getElementById("settings-button").classList.remove("expand");
        info.style.transition = "opacity 1s, transform 1s;"

        info.style.opacity = '0';
        info.style.transform = 'translateX(50%)';
    }, 11000)
    setTimeout(() => {
        info.remove();
        document.getElementById("document-body").classList.remove("hide-scroll");

    }, 12000)
}

modelForm.addEventListener('click', function(event) {
    MODEL_NAME = modelInput.value; 
    localStorage.setItem('MODEL_NAME', MODEL_NAME);
    document.getElementById("model-status").style.display = "block";
    document.getElementById("model-name").textContent = `Current model is ${MODEL_NAME}`;
});

// unsave key
function removeKey() {
    localStorage.removeItem('OPENAI_KEY')
    OPENAI_KEY = undefined;
    document.getElementById("key-status").style.display = "block";
}

// history of usage
function showHistory() {
    let historyDiv = document.getElementById("prompt-history");
    
    if (historyDiv.style.display === "block") {
        historyDiv.style.display = "none";
    } else {
        document.getElementById("settings").style.display = "none";
        historyDiv.style.display = "block";
        let usageHistory = localStorage.getItem("usageHistory");
        if (usageHistory) {
            usageArray = JSON.parse(usageHistory);
            console.log(usageArray);
            let fullHistory = `<button class="essay-button" style="position: absolute; top: 10px; right: 10px;" onclick="this.parentElement.style.display = 'none';">x</button>`
            let queries = [];
            for (let i = 0; i < usageArray.length; i++) {
                if (queries.length > 0 && queries[queries.length - 1].includes(usageArray[i][2])) {
                    fullHistory = fullHistory + `<p><strong>Prompt:</strong> ${usageArray[i][0]}</p>
                    <p><strong>Response:</strong> ${usageArray[i][1]}</p>
                    <div style="width: 90%; margin: auto; height: 1px; background-color: grey"></div>`;
                } else {
                    queries.push(usageArray[i][2])
                    fullHistory = fullHistory + `<div style="width: 90%; margin: auto; height: 3px; background-color: rgb(211, 214, 238)"></div>
                    <p style="font-size:13pt"><strong>Message: ${usageArray[i][2]}</strong></p>`;
                    fullHistory = fullHistory + `<p><strong>Prompt:</strong> ${usageArray[i][0]}</p>
                    <p><strong>Response:</strong> ${usageArray[i][1]}</p>
                    <div style="width: 90%; margin: auto; height: 1px; background-color: grey"></div>`;
                }
            }
            historyDiv.innerHTML = fullHistory
        } else {
            historyDiv.innerHTML = "<p>You haven't tried any prompts yet. Hit submit and current prompts will be saved to your cache!</p>"
        }
    }
    
}

var numRows = 1;
var numPrompts = 3; 
function addRow() {
    let lastRow = document.getElementById(`row-${numRows}`);
    let newRow = lastRow.cloneNode(true);
    lastRow.parentNode.appendChild(newRow);
    let promptsPerRow = numPrompts/numRows
    lastResponse = document.getElementById(`response-${numPrompts}`);
    newResponse = lastResponse.cloneNode(true);
    Array.from(newRow.querySelectorAll('[id^="toggle-"]')).forEach(child => {
        child.id = incrementId(child.id, promptsPerRow, true);
        if (child.classList.contains('prompt-toggle')) {
            toggleResponse(child);
        } else if (child.classList.contains('engineered-prompt')) {
            child.addEventListener("focus", function() {
                if (promptPlaceholderTexts.includes(child.textContent)) {
                    child.innerHTML = "\u200B";
                } 
                child.parentElement.querySelector('.prompt-toggle').classList.add('covered');
            });
            child.addEventListener("focusout", function() {
                child.parentElement.querySelector('.prompt-toggle').classList.remove('covered')
            });
        }
    });
    Array.from(newRow.querySelectorAll('[id^="response-"]')).forEach(child => {
        child.id = incrementId(child.id, promptsPerRow, true);

    });
    newRow.id = `row-${numRows + 1}`
    numPrompts = numPrompts + promptsPerRow;
    numRows++;
}

// WIP
function removeRow() {
    document.getElementById(`row-${numRows}`).remove();
    renumber();
    numPrompts = numPrompts - (numPrompts/numRows);
    numRows--;
}
// WIP
function removeCol() {
    let promptsPerRow = numPrompts/numRows;
    for (let i = 1; i <= numRows; i++) {
        document.getElementById(`response-${i*promptsPerRow}`).remove();
    }
    document.getElementById(`row-${numRows}`).remove();
    renumber();
    numPrompts = numPrompts - numRows;
}

function renumber() {
    
}

// Hotkeys
let pastMessage = -1;
document.addEventListener('keydown', function(event) {
    // Check if 'B' is pressed along with 'Ctrl' or 'Command'
    if (event.key === 'b' || event.key === 'B') {
        if (event.ctrlKey || event.metaKey) {
            // Prevent the default action to stop things like opening the bookmarks bar
            event.preventDefault();

            // Call your function here
            addResponse();
        }
    } else if (event.key === 'e' || event.key === 'E') {
        if (event.ctrlKey || event.metaKey) {
            // Prevent the default action to stop things like opening the bookmarks bar
            event.preventDefault();

            // Call your function here
            addRow();
        }
    } else if (event.key === 'm' || event.key === 'M') {
        if (event.ctrlKey || event.metaKey) {
            // Prevent the default action to stop things like opening the bookmarks bar
            event.preventDefault();

            // Call your function here
            showHistory();
        }
    } else if (event.key === "ArrowUp" && document.activeElement === essaySubmission) {
        // scroll through past messages with arrow keys
        lastQuery = previousQuery(1);
        if (lastQuery) {
            essaySubmission.innerHTML = '&#8203;' + lastQuery;
        }
    } else if (event.key === 'ArrowDown' && pastMessage != -1 && pastMessage != 0 && document.activeElement === essaySubmission) {
        lastQuery = previousQuery(-1);
        if (lastQuery) {
            essaySubmission.innerHTML = '&#8203;' + lastQuery;
        }
    }
});

function previousQuery(bool) {
    let queryHist = localStorage.getItem("usageHistory");
    if (queryHist) {
        let queryArr = JSON.parse(queryHist);
        pastMessage = pastMessage + bool;
        let showMessage = pastMessage * numPrompts;
        if (showMessage < queryArr.length) {    
            return queryArr[showMessage][2];     
        }
    } 
    return "";
}

function addResponse() {
    for (let i = 1; i <= numRows; i++) {
        let thisRow = document.getElementById(`row-${i}`);
        let lastResponse = document.getElementById(`response-${numPrompts}`);
        let newResponse = lastResponse.cloneNode(true);
        Array.from(newResponse.querySelectorAll('[id^="toggle-"]')).forEach(child => {
            child.id = incrementId(child.id, numPrompts + 1, false);
            if (child.id===`toggle-${numPrompts + 1}`) {
                toggleResponse(child);
            } else if (child.id===`toggle-${numPrompts + 1}-prompt`) {
                child.addEventListener("focus", function() {
                    if (promptPlaceholderTexts.includes(child.textContent)) {
                        child.innerHTML = "\u200B";
                    } 
                    child.parentElement.querySelector('.prompt-toggle').classList.add('covered');
                });
                child.addEventListener("focusout", function() {
                    child.parentElement.querySelector('.prompt-toggle').classList.remove('covered')
                });
            }
        });
        newResponse.id = `response-${numPrompts + 1}`;
        thisRow.appendChild(newResponse);
        numPrompts++;
    }
}

// either increments by value (if incrementBool) or replaces to be value
function incrementId(id, value, incrementBool) {
    if (incrementBool) {
        return id.replace(/\d+/, match => parseInt(match, 10) + value);
    } else {
        return id.replace(/\d+/, value);
    }
}

// toggle prompt/response button
function toggleResponse(button) {
    button.addEventListener('click', function() {
        let current = button.id;
        let prompt = document.getElementById(`${current}-prompt`);
        if (prompt.style.display === "block") {
            document.getElementById(`${current}-response`).style.display = 'block';
            prompt.style.display = 'none';
        } else {
            prompt.style.display = 'block';
            document.getElementById(`${current}-response`).style.display = 'none';
        }
    });
}
const toggles = document.querySelectorAll('.prompt-toggle');
toggles.forEach(toggle => {
    toggleResponse(toggle);
});

// removes placeholder text on focus
const engineeredPrompts = document.querySelectorAll('.engineered-prompt');
let promptPlaceholderTexts = [
    "\u200B" + "Write a prompt here...",
    "\u200B" + "Write another prompt here...",
    "\u200B" + "Write another version of the same prompt here",
    "\u200B" + "Write another version here...",
    "\u200B" + "Write a prompt here, like \"Act as an experienced therapist\"",
    "\u200B" + "Write a prompt here, try \"Answer with specific details\"",
    "\u200B" + "Write a prompt here, try \"Answer like my mom\"",
    "\u200B" + "Write a similar one here, like \"Give advice like the Dalai Lama\"",
    "\u200B" + "Write a prompt here, try \"Answer with specific details\"",
    "\u200B" + "Write a prompt here, try \"Answer like my mom\""
]
engineeredPrompts.forEach(engineeredPrompt => {
    engineeredPrompt.addEventListener("focus", function() {
        if (promptPlaceholderTexts.includes(engineeredPrompt.textContent)) {
            engineeredPrompt.innerHTML = "\u200B";
        } 
        engineeredPrompt.parentElement.querySelector('.prompt-toggle').classList.add('covered');
    });
    engineeredPrompt.addEventListener("focusout", function() {
        engineeredPrompt.parentElement.querySelector('.prompt-toggle').classList.remove('covered')
    });
});

errorMessage = document.getElementById("openAI-response");
errorContent = document.getElementById("error-content");
// main function - handles prompts
function submitMultiplePrompts() {
    if (!OPENAI_KEY && !isSelfHosting) {
        errorMessage.style.display = "block";
        errorContent.innerHTML =  "You haven't added an API key - you can still do it in settings!";
        return;
    }
    let inputChat = document.getElementById("essay-submission").innerText;
    const submitIndex = inputChat.lastIndexOf("Submit");
    if (submitIndex !== -1 && submitIndex === inputChat.length - "Submit".length) {
        inputChat = inputChat.slice(0, submitIndex);
    }
    if (inputChat && inputChat != "\u200B") {
        document.getElementById("openAI-loading").style.display = "inline-block";
        var overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.getElementById("essay-submission").appendChild(overlay);

        const elements = document.querySelectorAll('.engineered-prompt');
        let promptData = Array.from(elements).map(element => element.innerText);

        let fetchLink = "https://ai.fix.school/multiple_prompts";
        if (isSelfHosting) {
            fetchLink = "/multiple_prompts";
            OPENAI_KEY = "NA";
        }
        fetch(fetchLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompts: promptData, input: inputChat, key: OPENAI_KEY, model: MODEL_NAME})
            })
        .then(response => response.json())  // Parse the JSON from the response
        .then(data => {
            document.getElementById("openAI-loading").style.display = "none";
            overlay.remove();
            
            responseData = data;
            const responseDivs = document.querySelectorAll(".engineered-response");

            let promptsAndResponses = [];
            let i = 0;
            responseDivs.forEach(div => {
                div.innerHTML = responseData[i];
                promptsAndResponses[i] = [promptData[i], responseData[i], inputChat];
                i++;
            });

            let usageHistory = localStorage.getItem("usageHistory");
            if (usageHistory) {
                usageArray = JSON.parse(usageHistory);
                console.log(usageHistory);
                for (let j = 0; j < promptsAndResponses.length; j++) {
                    usageArray.unshift(promptsAndResponses[j]);
                }
                localStorage.setItem("usageHistory", JSON.stringify(usageArray));
                
            } else {
                localStorage.setItem("usageHistory", JSON.stringify(promptsAndResponses));
                // onboard toggle back and forth
                document.getElementById("toggle-1").classList.add("expand");

                info = document.createElement("button");
                info.id = "toggle-1";
                info.classList.add("prompt-toggle", "essay-button", "info");
                info.textContent = "flip back to prompt";
                info.style.opacity = 0;
                document.getElementById("response-1").appendChild(info);
                toggleResponse(info);
                setTimeout(() => {
                    info.style.opacity = '1';
                    info.style.transform = 'translateX(0)';
                }, 2000);
                setTimeout(() => {
                    document.getElementById("toggle-1").classList.remove("expand");
                    info.style.transition = "opacity 1s, transform 1s;"

                    info.style.opacity = '0';
                    info.style.transform = 'translateX(50%)';
                }, 5000)
                setTimeout(() => {
                    info.remove();
                }, 6000)
            }
            // flip to responses
            for (let i = 1; i <= numPrompts; i++) {
                document.getElementById(`toggle-${i}-response`).style.display = "block";
                document.getElementById(`toggle-${i}-prompt`).style.display = "none";
            }
            // ensure toggle is shown - from initial onboarding
            document.querySelectorAll('.prompt-toggle').forEach(toggle => {toggle.style.display = "inline-block"});
    
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("openAI-loading").style.display = "none";
            overlay.remove();
            errorContent.innerHTML = "Ran into an error, sorry! Try again with a shorter prompt or email <a href='mailto:ben@fix.school?subject=ChatGPT Free Membership' style='display: inline-block'>ben@fix.school</a> with a message about your error.";
            errorMessage.style.display = "block";

        }); 
    } else {
        errorContent.innerHTML = "Add text below, then hit submit!";
        errorMessage.style.display = "block";

    }
}

// difference check
function pickTwo () {
    let picked = [];
    function allowPicking(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('animate-background');
        e.currentTarget.style.backgroundColor = "rgb(211, 214, 238)";
        picked.push(e.currentTarget.querySelector('.engineered-response'));

        if (picked.length === 2) {
            diffCheck(picked[0], picked[1]);
            Array.from(document.querySelectorAll('[id^="response-"]')).forEach(child => {
                child.removeEventListener("click", allowPicking);
                child.classList.remove('animate-background');
            });

            return;
        }
    } 

    Array.from(document.querySelectorAll('[id^="response-"]')).forEach(child => {
        let randomDelay = Math.random() * 500; // Random delay up to 500ms
        child.style.animationDelay = `${randomDelay}ms`;
        child.classList.add('animate-background');
        child.addEventListener("click", allowPicking); 
    });

}
function diffCheck(response1, response2) {
    const data = {
        text1: response1.textContent,
        text2: response2.textContent
    };
    // Make a POST request
    let fetchLink = "https://ai.fix.school/difference";
    if (isSelfHosting) {
        fetchLink = "/difference";
    }
    console.log(fetchLink)

    fetch(fetchLink, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log(response1.innerHTML + " " + response2.innerHTML)
        response1.innerHTML = data.text1;
        response2.innerHTML = data.text2;

        response1.parentElement.style.backgroundColor = " #f5f5f5";
        response2.parentElement.style.backgroundColor = " #f5f5f5";
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
