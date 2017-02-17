"use strict";

console.log("UpgradeMixedContent: Web Extension loaded");

/* Logging function are from https-everywhere codebase */
console.log("Hey developer! Want to see more verbose logging?");
console.log("Type this into the console: DEFAULT_LOG_LEVEL=1");

let DEFAULT_LOG_LEVEL=2;
function log(str) {
    if (DEFAULT_LOG_LEVEL == 1) {
            console.log(str);
    }
}

/*
Modify the CSP
https://addons.mozilla.org/en-US/android/addon/upgrademixedcontent/
GPL3.0, Author: Pascal Ernster
*/
function modifyCSP(e) {
	let CSPmissing = true;
	for (var header of e.responseHeaders) {
		if (header.name.toLowerCase() === "content-security-policy") {
			if (typeof header.value === 'string') {
				if(header.value.search("upgrade-insecure-requests") === -1) {
					header.value += ";upgrade-insecure-requests";
					log("[Added header to CSP] "+e.url);
				} else {
					log("[Header already present] "+e.url);
				}
				CSPmissing = false;
			} else {
				console.warn("[Header is not a UTF-8 string] "+e.url);
			}
		}
	}
	if (CSPmissing === true) {
		e.responseHeaders.push({name: "content-security-policy", value: "upgrade-insecure-requests"});
		CSPmissing = false;
		log("[Added header to respose] "+e.url);
	}
	return {responseHeaders: e.responseHeaders};
}


/*
Add modifyCSP as a listener to onHeadersReceived,
Make it "blocking" so we can modify the headers.
*/
chrome.webRequest.onHeadersReceived.addListener(modifyCSP,
	{urls: ["https://*/*"]},
	["blocking", "responseHeaders"]);
console.log("Added modifyCSP listener to onHeadersReceived");
