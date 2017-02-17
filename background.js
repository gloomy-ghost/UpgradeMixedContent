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
	log("UpgradeMixedContent: Triggered by HTTPS request");
	let CSPmissing = true;
	for (var header of e.responseHeaders) {
		if (header.name.toLowerCase() === "content-security-policy") {
			if (typeof header.value === 'string') {
				if(header.value.search("upgrade-insecure-requests") === -1) {
					header.value += ";upgrade-insecure-requests";
					log("UpgradeMixedContent: Added 'upgrade-insecure-requests' to server CSP");
				} else {
					log("UpgradeMixedContent: 'upgrade-insecure-requests' already present in unmodified server CSP");
				}
				CSPmissing = false;
			} else {
				log("UpgradeMixedContent: 'content-security-policy' header is not a UTF-8 string");
			}
		}
	}
	if (CSPmissing === true) {
		e.responseHeaders.push({name: "content-security-policy", value: "upgrade-insecure-requests"});
		CSPmissing = false;
		log("UpgradeMixedContent: Added 'upgrade-insecure-requests' CSP to server respose");
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

console.log("UpgradeMixedContent: Added modifyCSP listener to onHeadersReceived");
