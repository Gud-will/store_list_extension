document.addEventListener('DOMContentLoaded', function () {
    const groupInput = document.getElementById('groupInput');
    const addGroupButton = document.getElementById('addGroupButton');
    const groupList = document.getElementById('groupList');
    const groupSelect = document.getElementById('groupSelect');
    const noteGroupSelect = document.getElementById('noteGroupSelect');
    const viewGroupSelect = document.getElementById('viewGroupSelect');
    const linkInput = document.getElementById('linkInput');
    const addLinkButton = document.getElementById('addLinkButton');
    const noteInput = document.getElementById('noteInput');
    const addNoteButton = document.getElementById('addNoteButton');
    const itemList = document.getElementById('itemList');
  
    function renderGroups(groups) {
      groupList.innerHTML = '';
      groupSelect.innerHTML = '';
      noteGroupSelect.innerHTML = '';
      viewGroupSelect.innerHTML = '';
      groups.forEach(group => {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.textContent = group;
        groupList.appendChild(li);
  
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
        noteGroupSelect.appendChild(option.cloneNode(true));
        viewGroupSelect.appendChild(option.cloneNode(true));
      });
    }
  
    function renderItems(items) {
      itemList.innerHTML = '';
      items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.textContent = item;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
          items.splice(index, 1);
          const groupName = viewGroupSelect.value;
          chrome.storage.sync.set({ [groupName]: items });
          renderItems(items);
        });
        li.appendChild(deleteButton);
        itemList.appendChild(li);
      });
    }
  
    addGroupButton.addEventListener('click', () => {
      const group = groupInput.value.trim();
      if (group) {
        chrome.storage.sync.get({ groups: [] }, (data) => {
          const groups = data.groups;
          if (!groups.includes(group)) {
            groups.push(group);
            chrome.storage.sync.set({ groups }, () => {
              renderGroups(groups);
              groupInput.value = '';
            });
          }
        });
      }
    });
  
    addLinkButton.addEventListener('click', () => {
      const link = linkInput.value.trim();
      const groupName = groupSelect.value;
      if (link && groupName) {
        chrome.storage.sync.get({ [groupName]: [] }, (data) => {
          const items = data[groupName];
          items.push(link);
          chrome.storage.sync.set({ [groupName]: items }, () => {
            linkInput.value = '';
            if (viewGroupSelect.value === groupName) {
              renderItems(items);
            }
          });
        });
      }
    });
  
    addNoteButton.addEventListener('click', () => {
      const note = noteInput.value.trim();
      const groupName = noteGroupSelect.value;
      if (note && groupName) {
        chrome.storage.sync.get({ [groupName]: [] }, (data) => {
          const items = data[groupName];
          items.push(note);
          chrome.storage.sync.set({ [groupName]: items }, () => {
            noteInput.value = '';
            if (viewGroupSelect.value === groupName) {
              renderItems(items);
            }
          });
        });
      }
    });
  
    viewGroupSelect.addEventListener('change', () => {
      const groupName = viewGroupSelect.value;
      chrome.storage.sync.get({ [groupName]: [] }, (data) => {
        renderItems(data[groupName]);
      });
    });
  
    chrome.storage.sync.get({ groups: [] }, (data) => {
      renderGroups(data.groups);
    });
  
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'updateList') {
        chrome.storage.sync.get('linkList', (data) => {
          renderItems(data.linkList || []);
        });
      }
    });
  });
  