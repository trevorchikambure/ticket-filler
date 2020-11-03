// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
	let prereqs = { "SuperUser": false ,
					"Administrator": false ,
					"SQL": false ,
					"IIS": false ,
					"FileSystem": false};
	
	let prereqtext = { "SuperUser": "to log on with a SuperUser account" ,
						"Administrator": "to log on with an Administrator account" ,
						"SQL": "access to your site's SQL server" ,
						"IIS": "administrator access to your site's IIS server " ,
						"FileSystem": "administrator access to your site's File System"};
					
	let corsProxy = 'https://cors-anywhere.herokuapp.com/'
					
	let generate = function() {
	let kb = document.getElementById("kb").value;
	let header = kb;
	fetch(corsProxy + kb)
		.then(response => response.text())
		.then(text => {
			const parser = new DOMParser();
			const htmlDocument = parser.parseFromString(text, "text/html");
			let solPage = htmlDocument.documentElement.querySelector(".article-title");
			header = solPage && solPage.innerHTML ? solPage.innerHTML.trim() : header;
		})
		.catch(function(error) {
			console.log(error);
		})
		.then(() => {

            let greetings = '', solution = '', close = '', thanks = '';
            chrome.storage.sync.get('greetings', function(data) {
                greetings = data.greetings;
            });
            chrome.storage.sync.get('solution', function(data) {
                solution = data.solution;
            });
            chrome.storage.sync.get('close', function(data) {
                close = data.close;
            });
            chrome.storage.sync.get('thanks', function(data) {
                thanks = data.thanks;
            });

			let product = document.getElementById("product").value || "**PRODUCT**";
			let type = "Q";
			let customerName = document.getElementById("customerName").value || "**CUSTOMER**";
			let paraphrase = document.getElementById("paraphrase").value || "**FIX_YOUR_ISSUE**";
			
            let salutation = "<p>Dear " + customerName + ",</p>";
            
			let greetings1 = "<p>" + greetings.replace("{product}", product).replace("{paraphrase}", paraphrase) + "</p>";
            greetings1 = greetings1 || "<p>Thank you for contacting " + product + " Support today. I will be assisting you to " + paraphrase + ".</p>";
            
			let solution1 = "<p>" + solution.replace("{kb}", "<a href="+kb + ">"+header+"</a>").replace("{paraphrase}", paraphrase) + ".</p>";
            solution1 = solution1 || "<p>The <a href="+kb + ">"+header+"</a> article details how to " + paraphrase + ".</p>";
            
			let reqPrereq = Object.entries(prereqs).filter(([req, val]) => val)
			let prereq = "<p>";
			reqPrereq.forEach(([req, val]) => prereq += "Please note that you will need " + prereqtext[req] + " to apply this solution. ");
			prereq += "</p>";
            
            let close1 = "<p>" + close.replace("{paraphrase}", paraphrase) + "</p>"
			close1 = close1 || "<p>Please let me know if this does not help you " + paraphrase + " or if you require further assistance. The ticket will remain open for 7 days unless you reply with \"This ticket can be closed\" or update the status to Closed in the portal.</p>"
            
            let thanks1 = "<p>" + thanks + "</p>"
			thanks1 = thanks1 || "<p>Thank you.</p>"
			let signout = "<p>Best Regards,</p><p>Trevor Chikambure</p><p>" + product + " Support Team</p>"

			let splitter = '<p><br></p>';

			let resp = salutation + splitter + greetings1 + splitter + solution1 + splitter + (reqPrereq.length > 0 ? (prereq + splitter) : '') + close1 + splitter + thanks1 + splitter + signout;
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.executeScript(
					tabs[0].id,
					{code: 'document.querySelector(\'.editor.zendesk-editor--rich-text-comment\').innerHTML = \'' + resp + '\';'})
			  });
		})
	  .catch(function(error) {
	    console.log(error);
	  });
};
document.addEventListener('DOMContentLoaded', function() {
	let generator = document.querySelector('form#responses>a');
	generator.onclick = generate;
  
  let superU = document.querySelector('input[type=checkbox][name=SuperUser]');
	superU.addEventListener('change', function(event) {
	  if (event.target.checked) {
		prereqs["SuperUser"] = true;
	  } else {
		prereqs["SuperUser"] = false;
	  }
	});
  let admin = document.querySelector('input[type=checkbox][name=administrator]');
	admin.addEventListener('change', function(event) {
	  if (event.target.checked) {
		prereqs["Administrator"] = true;
	  } else {
		prereqs["Administrator"] = false;
	  }
	});
  let sql = document.querySelector('input[type=checkbox][name=SQL]');
	sql.addEventListener('change', function(event) {
	  if (event.target.checked) {
		prereqs["SQL"] = true;
	  } else {
		prereqs["SQL"] = false;
	  }
	});
  let iis = document.querySelector('input[type=checkbox][name=IIS]');
	iis.addEventListener('change', function(event) {
	  if (event.target.checked) {
		prereqs["IIS"] = true;
	  } else {
		prereqs["IIS"] = false;
	  }
	});
  let fs = document.querySelector('input[type=checkbox][name=FileSystem]');
	fs.addEventListener('change', function(event) {
	  if (event.target.checked) {
		prereqs["FileSystem"] = true;
	  } else {
		prereqs["FileSystem"] = false;
	  }
	});
}, false);