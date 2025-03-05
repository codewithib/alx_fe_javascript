
// Grabbng my element from dom
const quoteDisplay = document.querySelector("#quoteDisplay");

const showQuoteBtn = document.getElementById("newQuote");

const userForm = document.querySelector(".user-form");
const quoteInput = document.querySelector("#quote-text");
const catInput = document.querySelector("#quote-category");
const addQuoteBtn = document.querySelector(".add-quote");

const downloadContainer = document.querySelector(".download-quotes");

const downloadBtn = document.querySelector(".download-btn");

const fileInput = document.querySelector("#import-quote");

const uploadBtn = document.querySelector(".upload-btn");

const importForm = document.querySelector(".import-form");

// Grabbing my filter-form details from DOM

const filterForm = document.querySelector(".filter-form");
const categoryFilter = document.querySelector("#category-filter");

// Array of quotes

let savedQuotes = [
    {
        text: "Hardwork pays if you never stop putting in the energy",
        category: "Motivational Quotes"
    },

    {  
        text: "Life is what happens when you're busy making other plans.",
        category: "Life Quotes"
    },

    {  
        text: "Do what you can, with what you have, where you are.",
        category: "Inspiration Quotes"
    },

    {  
        text: "Don’t be afraid to give up the good to go for the great.",
        category: "Success Quotes"
    },

    {  
        text: "Knowing yourself is the beginning of all wisdom.",
        category: "Wisdom Quotes"
    },

    {  
        text: "You only live once, but if you do it right, once is enough",
        category: "Life Quotes"
    }
];



// Function to display random quote

const showRandomQuote = () => {
    if (savedQuotes.length === 0) {
        alert("Nothing to display");
        return;
    }

    // createQuoteElement(savedQuotes);
    
    let random = Math.floor(Math.random() * savedQuotes.length)
    let randomQuote = savedQuotes[random];

    quoteDisplay.innerHTML = "";

    // Quote container
    const quoteContainer = document.createElement("div");
    quoteContainer.classList.add("quote-container");

    // Element to display quote text
    const quoteText = document.createElement("p");
    quoteText.classList.add("quote-text");
    quoteText.textContent = randomQuote.text;

    // // Element to display quote category
    const quoteCategory = document.createElement("p");
    quoteCategory.classList.add("quote-category");
    quoteCategory.textContent = randomQuote.category;

    quoteDisplay.appendChild(quoteContainer);
    quoteContainer.appendChild(quoteText);
    quoteContainer.appendChild(quoteCategory);

    console.log(savedQuotes);

}

// Function to save quote to localStorage

const saveQuote = () => {
    localStorage.setItem("quotes", JSON.stringify(savedQuotes));
}

// Function to load quote from localStorage

const loadQuote = () => {
    let storageQuote = JSON.parse(localStorage.getItem("quotes") || "[]");
    if (storageQuote.length > 0 ) {
        savedQuotes = storageQuote;
    } 
    
    console.log(savedQuotes);
}

// Function to create quote form if empty or allow user to enter their quote

const createAddQuoteForm = (e) => {
    if (e) e.preventDefault();
    const userQuoteText = quoteInput.value.trim();
    const userQuoteCat = catInput.value.trim();

    if (userQuoteText === "" || userQuoteCat === "") {
        alert("Please enter your quote and category");
        return;
    }

    savedQuotes.push({
        text: `${userQuoteText}`,
        category: `${userQuoteCat}`
    });
    console.log(savedQuotes);

   

    saveQuote();
    loadQuote();

    quoteInput.value = "";
    catInput.value = "";
    populateCategories();


}

// Function to export quotes

const exportQuotes = () => {
    if (savedQuotes.length === 0 ) {
        alert("No quotes available to export");
        return;
    }

    // Convert quotes to JSON string
    const jsonQuote = JSON.stringify(savedQuotes, null, 2);
    const blob = new Blob([jsonQuote], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    // Creating a tag and assigning my blob url to it
    const a = document.createElement("a");
    downloadContainer.appendChild(a);
    a.href = url;
    a.download = "Quotes.json";
    a.click();
    downloadContainer.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(url);

}

// Function to import quotes, read it, and update the quote array

const importQuote = (event) => {
    const file = event.target.files[0];
    if(!file) {
        alert("Please select a file!");
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            console.log("File Content:", e.target.result);
            const importedQuotes = JSON.parse(e.target.result);
            savedQuotes.push(...importedQuotes);
            saveQuote();
            populateCategories();
            filterQuotes();

        } catch(error) {
            alert(error);
        }
    }

    reader.readAsText(file);
}

// Function to populate category dynamically

const populateCategories = () => {
    const uniqueCategories = [...new Set (savedQuotes.map(quote => quote.category))];
    console.log(uniqueCategories);

    categoryFilter.innerHTML = `<option value="">All Categories</option>`;

    for (let singleCat of uniqueCategories) {
        const option = document.createElement("option");
        categoryFilter.appendChild(option);
        option.textContent = singleCat;
        option.value = singleCat;
        console.log(singleCat);

    }
}

// Function to filter quotes based on selected category

const filterQuotes = () => {
    const selectedCategory = categoryFilter.value;

    const filteredQuotes = savedQuotes.filter(quote => 
        selectedCategory === "" || quote.category === selectedCategory
    );

    localStorage.setItem("selectedCategory", selectedCategory);

    quoteDisplay.innerHTML = "";
    for (let quote of filteredQuotes) {
        const quoteContainer = document.createElement("div");
        quoteContainer.classList.add("quote-container");

        const quoteText = document.createElement("p");
        quoteText.classList.add("quote-text");
        quoteText.textContent = quote.text;

        const quoteCategory = document.createElement("p");
        quoteCategory.classList.add("quote-category");
        quoteCategory.textContent = `Category: ${quote.category}`;

        quoteContainer.appendChild(quoteText);
        quoteContainer.appendChild(quoteCategory);
        quoteDisplay.appendChild(quoteContainer);
    }
    console.log(selectedCategory);
}

categoryFilter.addEventListener("change", filterQuotes);

// Load quotes on page load

document.addEventListener("DOMContentLoaded", () => {
    loadQuote();
    populateCategories();
    const lastSelectedCategory = localStorage.getItem("selectedCategory");
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
        filterQuotes();
    }
});

const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API for testing

// Fetch quotes from the server
const fetchQuotesFromServer = async () => {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();
        
        if (serverQuotes.length > 0) {
            resolveConflicts(serverQuotes);
        }
    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
};

// Sync local quotes to the server
const syncQuotesToServer = async () => {
    try {
        for (let quote of savedQuotes) {
            await fetch(API_URL, {
                method: "POST",
                body: JSON.stringify(quote),
                headers: { "Content-Type": "application/json" }
            });
        }
        console.log("Quotes synced to server.");
    } catch (error) {
        console.error("Error syncing quotes:", error);
    }
};

// Resolve conflicts by ensuring server data takes precedence
const resolveConflicts = (serverQuotes) => {
    let localQuotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    
    // Compare local and server quotes
    const isDifferent = JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes);
    
    if (isDifferent) {
        // Notify user of conflicts
        alert("Data has changed on the server. Updating local data...");
        
        // Server data takes precedence
        savedQuotes = serverQuotes;
        localStorage.setItem("quotes", JSON.stringify(savedQuotes));
        
        // Refresh UI
        populateCategories();
        filterQuotes();
    }
};

// Periodically fetch and sync data
setInterval(fetchQuotesFromServer, 5000); // Fetch every 5 seconds
setInterval(syncQuotesToServer, 10000); // Sync every 10 seconds




// Adding event listener to buttons

showQuoteBtn.addEventListener("click", showRandomQuote);

// addQuoteBtn.addEventListener("click", createAddQuoteForm);

userForm.addEventListener("submit", createAddQuoteForm);

downloadBtn.addEventListener("click", exportQuotes);

// fileInput.onchange = function(e) {
//     let file = this.files[0];
//     console.log("name:", file.name);
//     console.log("size:", file.size);
//     console.log("type:", file.type);
// }

fileInput.addEventListener("change", importQuote);
