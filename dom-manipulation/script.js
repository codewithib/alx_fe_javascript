
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
    }
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
    quoteContainer.appendChild(quoteCategory)

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

}

// Function to export quotes

const exportQuotes = () => {
    if (savedQuotes.length === 0 ) {
        alert("No quotes available to export");
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

    // testing to read my blob file
    const reader = new FileReader();
    reader.onload = () => {
        console.log(this.result);
    }
    reader.readAsText(blob);
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

        } catch(error) {
            alert(error);
        }
    }

    reader.readAsText(file);
}

// Load quotes on page load

document.addEventListener("DOMContentLoaded", loadQuote);




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

importForm.addEventListener("submit", importQuote);
