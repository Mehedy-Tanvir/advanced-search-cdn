// Fetch data and render items
const fetchDataAndRenderItems = async () => {
  try {
    const siteId = document.querySelector("html").getAttribute("data-wf-site");
    const response = await fetch(
      `https://advanced-search-backend-production.up.railway.app/api/search/getSearchSettingsAndItems/${siteId}`
    );

    // Check if the response is okay
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json(); // Parse the JSON data

    renderItems(data); // Pass the data to the renderItems function
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Render items based on the fetched data
const renderItems = (data) => {
  const searchSettings = data.data.searchSettings[0]; // Assuming one search setting
  const items = data.data.items.results;

  console.log("search settings", searchSettings);

  // Get the container and card templates by class
  const itemContainer = document.querySelector(
    `#${searchSettings.itemContainerId}`
  );

  const itemCardTemplate = document.querySelector(
    `.${searchSettings.itemCardClass}`
  );

  if (!itemContainer || !itemCardTemplate) {
    console.error("Container or card template not found");
    return;
  }

  // Clear the container before appending new items
  itemContainer.innerHTML = "";

  // Hide the template to avoid displaying the original template
  itemCardTemplate.style.display = "none";

  // Loop through each item and create a new card based on the template
  items.forEach((item) => {
    // Clone the item card template for each item
    const itemCard = itemCardTemplate.cloneNode(true);

    // Ensure the cloned card is visible
    itemCard.style.display = "block";

    // Loop through the fields of the item object and populate the card
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        // Capitalize the first letter of the key to match the data-field format
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);

        // Find elements in the card with a data-field attribute matching the key or formatted key
        const fieldElements = [
          ...itemCard.querySelectorAll(`[data-field="${key}"]`),
          ...itemCard.querySelectorAll(`[data-field="${formattedKey}"]`),
        ];

        // Check if there are any elements that match the data-field attribute
        if (fieldElements.length > 0) {
          fieldElements.forEach((element) => {
            if (typeof item[key] === "object" && item[key] !== null) {
              // If the field is an object (e.g., featured-image), handle it appropriately
              if (item[key].url) {
                element.src = item[key].url; // Set image source
                element.alt = item[key].alt || ""; // Set alt text if available
              } else {
                console.warn(`URL is missing for key: ${key}`);
              }
            } else {
              element.textContent = item[key]; // Set text content for other fields
            }
          });
        } else {
          console.warn(
            `No elements found for data-field: ${key} or ${formattedKey}`
          );
        }
      }
    }

    // Append the populated card to the container
    itemContainer.appendChild(itemCard);
  });

  // Search submit button activity
  const searchSubmitButton = document.getElementById(
    searchSettings.searchSubmitId
  );
  const searchInput = document.getElementById(searchSettings.searchInputId);

  searchSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();
    // Clear the container before appending new items
    itemContainer.innerHTML = "";

    // Hide the template to avoid displaying the original template
    itemCardTemplate.style.display = "none";
    const searchTerm = searchInput.value;
    const siteId = document.querySelector("html").getAttribute("data-wf-site");
    // Send search request to API
    const apiUrl = `https://advanced-search-backend-production.up.railway.app/api/search/getSearchedItems/${siteId}?searchedItem=${encodeURIComponent(
      searchTerm
    )}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        console.log("Search Results:", data.data.hits);
        // You can process and display the search results here
        const searchResults = data.data.hits;

        // Loop through each item and create a new card based on the template
        searchResults.forEach((item) => {
          // Clone the item card template for each item
          const itemCard = itemCardTemplate.cloneNode(true);

          // Ensure the cloned card is visible
          itemCard.style.display = "block";

          // Loop through the fields of the item object and populate the card
          for (const key in item) {
            if (item.hasOwnProperty(key)) {
              // Capitalize the first letter of the key to match the data-field format
              const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);

              // Find elements in the card with a data-field attribute matching the key or formatted key
              const fieldElements = [
                ...itemCard.querySelectorAll(`[data-field="${key}"]`),
                ...itemCard.querySelectorAll(`[data-field="${formattedKey}"]`),
              ];

              // Check if there are any elements that match the data-field attribute
              if (fieldElements.length > 0) {
                fieldElements.forEach((element) => {
                  if (typeof item[key] === "object" && item[key] !== null) {
                    // If the field is an object (e.g., featured-image), handle it appropriately
                    if (item[key].url) {
                      element.src = item[key].url; // Set image source
                      element.alt = item[key].alt || ""; // Set alt text if available
                    } else {
                      console.warn(`URL is missing for key: ${key}`);
                    }
                  } else {
                    element.textContent = item[key]; // Set text content for other fields
                  }
                });
              } else {
                console.warn(
                  `No elements found for data-field: ${key} or ${formattedKey}`
                );
              }
            }
          }

          // Append the populated card to the container
          itemContainer.appendChild(itemCard);
        });
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  });
};

// Call the fetch and render function on page load or on an event
fetchDataAndRenderItems();
