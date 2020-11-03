// Copyright 2018 Trevor Chikambure. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let page = document.getElementById('buttonDiv');
let settings = document.getElementById('settingsDiv')

let greetings = "Thank you for contacting {product} Support today. I will be assisting you to {paraphrase}.";
let solution = "The {kb} article details how to {paraphrase}.";
let close = "Please let me know if this does not help you {paraphrase} or if you require further assistance. The ticket will remain open for 7 days unless you reply with \"This ticket can be closed\" or update the status to Closed in the portal."
let thanks = "Thank you."

const sentences = [greetings, solution, close, thanks];
const varToString = varObj => Object.keys(varObj)[0];

let settingsDiv = document.getElementById('settingsDiv');


function setDefaults(name, sentence) {

    let nextContainer = document.createElement('div');
    let nextLabel = document.createElement('LABEL')
    nextLabel.innerHTML = name;
    console.log(name);
    let nextInput = document.createElement('textArea');
    nextInput.id = name;
    nextInput.cols = 100;
    nextInput.rows = 3;
    nextInput.value = sentence;
    nextContainer.appendChild(nextLabel);
    nextContainer.appendChild(document.createElement('br'));
    nextContainer.appendChild(nextInput);

    let storeObj = {};
    storeObj[name] = sentence

    chrome.storage.sync.set(storeObj, function() {
        console.log('name: ' + sentence);
    })

    let button = document.createElement('button');
    button.id = name + 'Button';
    button.innerHTML = 'Save'
    button.addEventListener('click', function() {
        let updObj = {};
        updObj[name] = document.getElementById(name).value;
        chrome.storage.sync.set(updObj, function() {
            console.log('name: ' + sentence);
        })
    });
    nextContainer.appendChild(button);

    settingsDiv.append(nextContainer);
}

setDefaults('greetings', greetings);
setDefaults('solution', solution);
setDefaults('close', close);
setDefaults('thanks', thanks);