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

function setDefaults(sentences) {

    for (let sentence of sentences) {
        let name = varToString(sentence).toLowerCase();

        let nextInput = document.createElement('input');
        nextInput.id = varToString(sentence);
        nextInput.value = sentence;
        settingsDiv.appendChild(nextInput);

        let button = document.createElement('button');
        button.id = name + 'Button';
        button.addEventListener('click', function() {
            chrome.storage.sync.set({name: sentence}, function() {
                console.log('name: ' + sentence);
            })
        });
        page.appendChild(button);
    }
}

setDefaults(sentences);