chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "addLinkToGroup",
      title: "Add link to group",
      contexts: ["link"]
    });
    chrome.storage.sync.get({ groups: [] }, (data) => {
      data.groups.forEach(group => {
        chrome.contextMenus.create({
          id: `addLinkToGroup-${group}`,
          parentId: "addLinkToGroup",
          title: group,
          contexts: ["link"]
        });
      });
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const link = info.linkUrl;
    const groupId = info.menuItemId.split('-')[1];
    if (groupId) {
      chrome.storage.sync.get({ [groupId]: [] }, (data) => {
        const items = data[groupId];
        items.push(link);
        chrome.storage.sync.set({ [groupId]: items });
      });
    }
  });
  
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.groups) {
      const newGroups = changes.groups.newValue;
      chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
          id: "addLinkToGroup",
          title: "Add link to group",
          contexts: ["link"]
        });
        newGroups.forEach(group => {
          chrome.contextMenus.create({
            id: `addLinkToGroup-${group}`,
            parentId: "addLinkToGroup",
            title: group,
            contexts: ["link"]
          });
        });
      });
    }
  });
  