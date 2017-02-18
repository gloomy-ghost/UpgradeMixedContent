document.addEventListener('DOMContentLoaded', function() {
	let importButton = document.getElementById('importButton'),
	addButton = document.getElementById('addButton'),
	removeButton = document.getElementById('removeButton'),
	importURL = document.getElementById('importURL'),
	newWhitelistDomain = document.getElementById('newWhitelistDomain'),
	excludedDomainsBox = document.getElementById('excludedDomainsBox');
  
	function appendToListBox(boxId, text) {
		let elt = new Option();
		elt.text = text;
		elt.value = text;
		document.getElementById(boxId).appendChild(elt);
	}
	function removeFromListBox(boxId, text) {
		let list = document.getElementById(boxId);
		for (let i = 0; i < list.length; i++)
			if (list.options[i].value == text)
				list.remove(i--);
	}

	// existing state
	for(let i = 0 ; i < localStorage.length; i++){
		domain = localStorage.key(i);
		if (Number(localStorage.getItem(domain)) === 1)
			appendToListBox('excludedDomainsBox', domain);
	}
  
	// click listener
	importButton.addEventListener('click', function () {
		let request = new XMLHttpRequest();
		request.open('GET', importURL.value, true);
		request.onload = function() {
		  if (this.status >= 200 && this.status < 400) {
			let data = JSON.parse(this.response);
			for (let domain in data)
				localStorage[domain] = data[domain];
			location.reload();
		  } else {
			alert('Something Happened.');
		  }
		};
		request.send();
	});

	addButton.addEventListener('click', function () {
		localStorage[newWhitelistDomain.value] = 1;
		appendToListBox('excludedDomainsBox', newWhitelistDomain.value);
		newWhitelistDomain.value = '';
	});

	removeButton.addEventListener('click', function () {
		let remove = [];
		for (let i = 0; i < excludedDomainsBox.length; i++)
			if (excludedDomainsBox.options[i].selected)
				remove.push(excludedDomainsBox.options[i].value);
		if (!remove.length)
			return;

		for (let i = 0; i < remove.length; i++){
			localStorage[remove[i]] = 0;
			removeFromListBox('excludedDomainsBox', remove[i]);
		}
	});
});
