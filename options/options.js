'use strict';
document.addEventListener('DOMContentLoaded', function() {
    const importButton = document.getElementById('importButton'),
    addButton = document.getElementById('addButton'),
    removeButton = document.getElementById('removeButton'),
    importURL = document.getElementById('importURL'),
    newWhitelistDomain = document.getElementById('newWhitelistDomain'),
    excludedDomainsBox = document.getElementById('excludedDomainsBox');
  
    function appendToListBox(boxId, text) {
        const elt = new Option();
        elt.text = text;
        elt.value = text;
        document.getElementById(boxId).appendChild(elt);
    }
    function removeFromListBox(boxId, text) {
        let list = document.getElementById(boxId);
        for (let i = 0; i < list.length; i++)
            if (list.options[i].value === text)
                list.remove(i--);
    }

    // existing state
    for (let i = 0 ; i < localStorage.length; i++){
        const domain = localStorage.key(i);
        if (Number(localStorage.getItem(domain)) === 1)
            appendToListBox('excludedDomainsBox', domain);
    }
  
    // click listener
    importButton.addEventListener('click', function () {
        const request = new XMLHttpRequest();
        request.open('GET', importURL.value, true);
        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                const data = JSON.parse(this.response);
                for (const domain in data)
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
        for (const domain of excludedDomainsBox.options){
            if (domain.selected){
                localStorage.removeItem(domain);
                removeFromListBox('excludedDomainsBox',domain);
            }
        }
    });
});
