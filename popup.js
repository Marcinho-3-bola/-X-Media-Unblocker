document.getElementById("rescan").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      document
        .querySelectorAll("[data-xmu-processed]")
        .forEach((el) => el.removeAttribute("data-xmu-processed"));
      // dispara um evento de mutacao mexendo no DOM levemente, o observer cuida do resto
      document.body.dispatchEvent(new Event("xmu-rescan"));
      window.dispatchEvent(new Event("resize"));
    },
  });

  window.close();
});
