document.addEventListener('DOMContentLoaded', function () {
  const classifyButton = document.getElementById('classifyButton');
  const urlElement = document.getElementById('url');
  const resultElement = document.getElementById('result');

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    const currentUrl = currentTab.url;
    
    // Print the URL to console
    console.log('Current URL:', currentUrl);
    
    urlElement.textContent = `Current URL: ${currentUrl}`;
    
    classifyButton.addEventListener('click', function () {
      fetch('http://localhost:5000/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: currentUrl }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          return response.json();
        })
        .then(data => {
          const prediction = data.classification;
          console.log(prediction);
          if (prediction === "SAFE") {
            resultElement.textContent = "SAFE";
          } else if (prediction === "PHISHING") {
            resultElement.textContent = "PHISHING";
          } else {
            resultElement.textContent = "Unknown Classification";
          }
        })
        .catch(error => {
          console.error('Error:', error);
          resultElement.textContent = "Error fetching classification.";
        });
    });
  });
});
