/*
    Modify the CSP
    Copyright (C) 2016 Pascal Ernster
    Copyright (C) 2017 ghost

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
'use strict';

let DEFAULT_LOG_LEVEL=2;
function log(str) {
    if (DEFAULT_LOG_LEVEL === 1) {
            console.log(str);
    }
}
console.log('DEFAULT_LOG_LEVEL=1 for more verbose logging');

let blacklist = localStorage;

function modifyCSP(e) {
	//Look up backlist
	let uri = document.createElement('a');
	uri.href = e.url;

	if (Number(blacklist[uri.hostname]) === 1) {
		log('[Blacklist] '+e.url);
		return;
	}

	let CSPMissing = true;
	for (let header of e.responseHeaders) {
		if (header.name.toLowerCase() === 'content-security-policy') {
			if (typeof header.value === 'string') {
				if (header.value.search('upgrade-insecure-requests') === -1) {
					header.value += ';upgrade-insecure-requests';
					log('[Added header to CSP] '+e.url);
				} else {
					log('[Header already present] '+e.url);
				}
				CSPMissing = false;
			} else {
				console.warn('[Header is not a UTF-8 string] '+e.url);
			}
		}
	}
	if (CSPMissing === true) {
		e.responseHeaders.push({name: 'content-security-policy', value: 'upgrade-insecure-requests'});
		log('[Added header to respose] '+e.url);
	}
	return {responseHeaders: e.responseHeaders};
}

chrome.webRequest.onHeadersReceived.addListener(modifyCSP,
	{urls: ['https://*/*'], types: ['main_frame', 'sub_frame']},
	['blocking', 'responseHeaders']);
