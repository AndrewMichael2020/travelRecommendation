document.getElementById('btnSearch').addEventListener('click', () => {
  const query = document.getElementById('conditionInput').value.trim().toLowerCase();

  if (!query) {
    alert("Please enter a search keyword!");
    return;
  }

  // Fetch data from the JSON file
  fetch('./travel_recommendation_api.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    })
    .then(data => {
      handleSearch(query, data);
    })
    .catch(error => console.error("Error fetching data:", error));
});

function handleSearch(query, data) {
  const resultsContainer = document.getElementById('resultsContainer') || createResultsContainer();

  // Clear previous results
  resultsContainer.innerHTML = "";

  // Determine results based on query
  if (query.includes("beach")) {
    displayResults(data.beaches, resultsContainer);
  } else if (query.includes("temple")) {
    displayResults(data.temples, resultsContainer);
  } else {
    const matchedCountry = data.countries.find(country =>
      country.name.toLowerCase().includes(query)
    );
    if (matchedCountry) {
      displayResults(matchedCountry.cities, resultsContainer);
    } else {
      resultsContainer.innerHTML = "<p>No results found. Try another keyword.</p>";
    }
  }
}

function createResultsContainer() {
  const resultsContainer = document.createElement('div');
  resultsContainer.id = "resultsContainer";
  resultsContainer.style.marginTop = "20px";
  document.body.appendChild(resultsContainer);
  return resultsContainer;
}

function displayResults(items, container) {
  if (!items || items.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  items.slice(0, 2).forEach(item => {
    const card = document.createElement('div');
    card.classList.add('result-card');

    const image = document.createElement('img');
    image.src = item.imageUrl;
    image.alt = item.name;
    image.classList.add('result-image');

    const title = document.createElement('h3');
    title.textContent = item.name;

    const description = document.createElement('p');
    description.textContent = item.description;

    const localTime = document.createElement('p');
    localTime.textContent = "Loading local time...";

    // Append elements
    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(localTime);
    container.appendChild(card);

    // Fetch local time
    fetchLocalTime(item.name, localTime);
  });
}

function fetchLocalTime(city, element) {
  const cityTimeZones = {
    "Sydney": "Australia/Sydney",
    "Melbourne": "Australia/Melbourne",
    "Tokyo": "Asia/Tokyo",
    "Kyoto": "Asia/Tokyo",
    "Rio de Janeiro": "America/Sao_Paulo",
    "São Paulo": "America/Sao_Paulo",
    "Angkor Wat": "Asia/Phnom_Penh",
    "Taj Mahal": "Asia/Kolkata",
    "Bora Bora": "Pacific/Tahiti",
    "Copacabana": "America/Sao_Paulo"
  };

  const timezone = cityTimeZones[city.split(",")[0]];

  if (!timezone) {
    element.textContent = `Local time not available for ${city}`;
    return;
  }

  const now = new Date();
  const options = { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-US', options);

  // Update the element with the formatted time
  element.textContent = `Current local time at ${city}: ${formatter.format(now)}`;
}
