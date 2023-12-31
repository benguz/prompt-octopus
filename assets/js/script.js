var isSelfHosting = document.getElementById('SELFHOST');
let essaySubmission = document.getElementById('essay-submission');
let additionalContent = '<button id="submit-essay" class="essay-button" onclick="submitMultiplePrompts()" contenteditable="false"><strong>Submit</strong></button><div class="overlay" id="loading-overlay" style="display: none;"></div>'
essaySubmission.addEventListener('input', function() {
    // Check if the innerHTML only contains the button
    if (this.innerHTML.trim() === additionalContent) {
        this.innerHTML = '&#8203;' + this.innerHTML; // Adds a zero-width space at the beginning
    } // else {
    //     console.log(this.innerHTML); 
    // }
});

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

if (!OPENAI_KEY && !isSelfHosting) {
    document.getElementById("onboarding").style.display = "block";
    keyForm.addEventListener('click', function(event) {
        OPENAI_KEY = keyInput.value; 
        localStorage.setItem('OPENAI_KEY', OPENAI_KEY);
        document.getElementById("onboarding").style.display = "none";
    });
}
if (!MODEL_NAME && !isSelfHosting) {
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
    });
    }
    
} 


modelForm.addEventListener('click', function(event) {
    MODEL_NAME = modelInput.value; 
    localStorage.setItem('MODEL_NAME', MODEL_NAME);
    document.getElementById("model-status").style.display = "block";
    document.getElementById("model-name").textContent = `Current model is ${MODEL_NAME}`;
});


function removeKey() {
    localStorage.removeItem('OPENAI_KEY')
    OPENAI_KEY = undefined;
    document.getElementById("key-status").style.display = "block";
}
// remove placeholder text on focus
const placeholderText = "\u200B" + "Paste your query here..."; 

essaySubmission.addEventListener("focus", function () {
    let clone = essaySubmission.cloneNode(true);

    // Remove all child elements (keep only text nodes)
    Array.from(clone.childNodes).forEach(node => {
        if (node.nodeType !== Node.TEXT_NODE) {
            clone.removeChild(node);
        }
    });
    let textContent = clone.textContent.trim();
    if (textContent === placeholderText) {
        essaySubmission.innerHTML = "\u200B" + additionalContent;
    } 
});

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
                    if (child.textContent === promptPlaceholderText) {
                        child.innerHTML = "\u200B";
                    } 
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

    // function renumber() {
        
    // }

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
        }
    });

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
                        if (child.textContent === promptPlaceholderText) {
                            child.innerHTML = "\u200B";
                        } 
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
    const engineeredPrompts = document.querySelectorAll('.engineered-prompt');
    let promptPlaceholderText = "\u200B" + "Enter a prompt here...";
    engineeredPrompts.forEach(engineeredPrompt => {
        engineeredPrompt.addEventListener("focus", function() {
            if (engineeredPrompt.textContent === promptPlaceholderText) {
                engineeredPrompt.innerHTML = "\u200B";
            } 
        });
    });

    function submitMultiplePrompts() {
        if (!OPENAI_KEY && !isSelfHosting) {
            document.getElementById("openAI-response").innerHTML = "You haven't added an API key - you can still do it in settings!";
            return;
        }
        let inputChat = document.getElementById("essay-submission").textContent;
        const submitIndex = inputChat.lastIndexOf("Submit");
        if (submitIndex !== -1 && submitIndex === inputChat.length - "Submit".length) {
            inputChat = inputChat.slice(0, submitIndex);
        }
        if (inputChat) {
            document.getElementById("openAI-loading").style.display = "inline-block";
            var overlay = document.createElement('div');
            overlay.className = 'overlay';
            document.getElementById("essay-submission").appendChild(overlay);

            const elements = document.querySelectorAll('.engineered-prompt');
            let promptData = Array.from(elements).map(element => element.textContent);

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
                }
                
                for (let i = 1; i <= numPrompts; i++) {
                    document.getElementById(`toggle-${i}-response`).style.display = "block";
                    document.getElementById(`toggle-${i}-prompt`).style.display = "none";
                }
                    
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById("openAI-loading").style.display = "none";
                overlay.remove();
                document.getElementById("openAI-response").innerHTML = "Ran into an error, sorry! Try again with a shorter prompt or email <a href='mailto:ben@fix.school?subject=ChatGPT Free Membership' style='display: inline-block'>ben@fix.school</a> with a message about your error.";
            }); 
        } else {
            document.getElementById("openAI-response").innerHTML = "Add text below, then hit submit!";

        }
}