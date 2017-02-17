document.addEventListener('DOMContentLoaded', function() {
	let addButton = document.getElementById('addButton'),
	removeButton = document.getElementById('removeButton'),
	newWhitelistDomain = document.getElementById('newWhitelistDomain'),
	excludedDomainsBox = document.getElementById('excludedDomainsBox');
  
	function appendToListBox(boxId, text) {
		let elt = new Option();
		elt.text = text;
		elt.value = text;
		document.getElementById(boxId).appendChild(elt);
	}
	function removeFromListBox(boxId, text) {
		var list = document.getElementById(boxId);
		for (var i = 0; i < list.length; i++)
			if (list.options[i].value == text)
				list.remove(i--);
	}

	// existing state
	for(var i = 0 ; i < localStorage.length; i++){
		domain = localStorage.key(i);
		if (Number(localStorage.getItem(domain)) === 1)
			appendToListBox('excludedDomainsBox', domain);
	}
  
	// click listener
	addButton.addEventListener('click', function () {
		localStorage[newWhitelistDomain.value] = 1;
		appendToListBox('excludedDomainsBox', newWhitelistDomain.value);
		newWhitelistDomain.value = '';
	});

	removeButton.addEventListener('click', function () {
		let remove = [];
		for (var i = 0; i < excludedDomainsBox.length; i++)
			if (excludedDomainsBox.options[i].selected)
				remove.push(excludedDomainsBox.options[i].value);
		if (!remove.length)
			return;

		for (var i = 0; i < remove.length; i++){
			localStorage[remove[i]] = 0;
			removeFromListBox('excludedDomainsBox', remove[i]);
		}
	});
});
