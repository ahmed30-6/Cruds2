// main.js
const titleInput = document.getElementById("titleInput");
const priceInput = document.getElementById("priceInput");
const taxInput = document.getElementById("taxInput");
const adsInput = document.getElementById("adsInput");
const categoryInput = document.getElementById("categoryInput");
const countInput = document.getElementById("countInput");
const tbody = document.getElementById("tbody");
const btn_add = document.getElementById("btn_add");
const btn_delete = document.getElementById("btn_delete");
const toggleDarkMode = document.getElementById("toggleDarkMode");
const table = document.querySelector(".table");

let arr = [];
let editIndex = -1; // To store the index of the item being edited

// Load Data from localStorage on Startup
function loadData() {
    const data = localStorage.getItem("items");
    if (data) {
        arr = JSON.parse(data);
        renderTable();
    }
}

// Save Data to localStorage
function saveData() {
    localStorage.setItem("items", JSON.stringify(arr));
}

// Render Table with Data
function renderTable() {
    tbody.innerHTML = ""; // Clear the table first

    arr.forEach((item, index) => {
        const total = (+item.price + +item.tax + +item.ads) * +item.count;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.title}</td>
            <td>${item.price}</td>
            <td>${item.tax}</td>
            <td>${item.ads}</td>
            <td>${item.category}</td>
            <td>${item.count}</td>
            <td>${total}</td>
            <td>
                <button onclick="decreaseCount(${index})" class="btn btn-outline-primary">-</button>
                <span>${item.count}</span>
                <button onclick="increaseCount(${index})" class="btn btn-outline-primary">+</button>
            </td>
            <td>
                <button onclick="editItem(${index})" class="btn btn-outline-primary btn-sm">Edit</button>
                <button onclick="deleteItem(${index})" class="btn btn-outline-danger btn-sm">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Add or Edit Item
btn_add.addEventListener("click", function (e) {
    e.preventDefault();

    if (
        !titleInput.value ||
        !priceInput.value ||
        !taxInput.value ||
        !adsInput.value ||
        !categoryInput.value ||
        !countInput.value ||
        countInput.value < 0
    ) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const item = {
        title: titleInput.value,
        price: priceInput.value,
        tax: taxInput.value,
        ads: adsInput.value,
        category: categoryInput.value,
        count: countInput.value,
    };

    if (editIndex === -1) {
        // Add new item
        arr.push(item);
    } else {
        // Edit existing item
        arr[editIndex] = item;
        btn_add.textContent = "Add";
        editIndex = -1;
    }

    renderTable();
    saveData();
    clearForm();
});

// Delete Item
function deleteItem(index) {
    if (confirm("Are you sure you want to delete this item?")) {
        arr.splice(index, 1);
        renderTable();
        saveData();
    }
}

// Edit Item
function editItem(index) {
    titleInput.value = arr[index].title;
    priceInput.value = arr[index].price;
    taxInput.value = arr[index].tax;
    adsInput.value = arr[index].ads;
    categoryInput.value = arr[index].category;
    countInput.value = arr[index].count;
    editIndex = index;
    btn_add.textContent = "Edit";
    scrollUp();
}

// Delete All Items
btn_delete.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all items?")) {
        arr = [];
        renderTable();
        saveData();
    }
});

// Clear Form Inputs
function clearForm() {
    titleInput.value = "";
    priceInput.value = "";
    taxInput.value = "";
    adsInput.value = "";
    categoryInput.value = "";
    countInput.value = "";
}

// Toggle Dark Mode
toggleDarkMode.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const icon = toggleDarkMode.querySelector("i");
    if (document.body.classList.contains("dark-mode")) {
        icon.classList.replace("ri-moon-fill", "ri-sun-fill");
        toggleDarkMode.querySelector("i").classList.add("text-dark", document.body.classList.contains("dark-mode"));
        localStorage.setItem("darkMode", "enabled");
    } else {
        toggleDarkMode.querySelector("i").classList.remove("text-dark", document.body.classList.contains("dark-mode"));
        toggleDarkMode.querySelector("i").classList.add("text-light", document.body.classList.contains("dark-mode"));
        icon.classList.replace("ri-sun-fill", "ri-moon-fill");
        localStorage.setItem("darkMode", "disabled");
    }

    // Apply dark mode to form inputs
    const inputs = document.querySelectorAll(".form-control");
    inputs.forEach(input => {
        input.classList.toggle("dark-mode-input", document.body.classList.contains("dark-mode"));
    });

    // Apply dark mode to buttons
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(button => {
        button.classList.toggle("dark-mode-btn", document.body.classList.contains("dark-mode"));
    });

    // Apply dark mode to table
    table.classList.toggle("table-dark", document.body.classList.contains("dark-mode"));
    
    
});

// Load Dark Mode Preference
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    toggleDarkMode.querySelector("i").classList.replace("ri-moon-fill", "ri-sun-fill");
    toggleDarkMode.querySelector("i").classList.remove("text-dark");
    toggleDarkMode.querySelector("i").classList.add("text-light");
    toggleDarkMode.querySelector("i").classList.add("text-dark", document.body.classList.contains("dark-mode"));
    // Apply dark mode to form inputs
    const inputs = document.querySelectorAll(".form-control");
    inputs.forEach(input => {
        input.classList.add("dark-mode-input");
    });
    // Apply dark mode to buttons
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(button => {
        button.classList.add("dark-mode-btn");
    });

    // Apply dark mode to table
    table.classList.add("table-dark");
}

// Scroll to Top
function scrollUp() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

// Increase Count
function increaseCount(index) {
    arr[index].count = +arr[index].count + 1;
    renderTable();
    saveData();
}

// Decrease Count
function decreaseCount(index) {
    if (arr[index].count > 0) {
        arr[index].count = +arr[index].count - 1;
        renderTable();
        saveData();
    }
}

// Load Data on Startup
loadData();