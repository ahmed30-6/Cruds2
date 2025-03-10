// تحديد العناصر
const UserNameInput = document.getElementById("UserNameInput");
const emailInput = document.getElementById("emailInput");
const tbody = document.getElementById("tbody");
const btn_add = document.getElementById("btn_add");
const toggleDarkMode = document.getElementById("toggleDarkMode");
const table = document.querySelector(".table");
const btn_delete = document.getElementById("btn_delete");
const countInput = document.getElementById("count")
let arr = [];
let editIndex = -1;  // لتخزين فهرس المستخدم الذي يتم تعديله

// تحميل البيانات من localStorage عند بدء التشغيل
function loadData() {
    const data = localStorage.getItem("users");
    if (data) {
        arr = JSON.parse(data);
        Show();
    }
}

// حفظ البيانات في localStorage
function saveData() {
    localStorage.setItem("users", JSON.stringify(arr));
}

// عرض البيانات في الجدول
function Show() {
    tbody.innerHTML = "";  // أفرغ الجدول أولاً

    // قم بإضافة الصفوف مع انيميشن التغيير
    arr.forEach((user, index) => {
        const row = document.createElement("tr");
        row.classList.add("table-row");  // إضافة فئة للتحديد

        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.UserName}</td>
        <td>${user.email}</td>
        <td>
            <button onclick="decreaseCount(${index})" class="btn btn-outline-primary">-</button>
            <span>${user.count}</span>
            <button onclick="increaseCount(${index})" class="btn btn-outline-primary">+</button>
        </td>
        <td>
            <button onclick="Delete(${index})" class="btn btn-outline-danger">Delete</button>
        </td>
        <td>
            <button onclick="Edit(${index}) ,scrollUp()" class="btn btn-outline-primary">Edit</button>
        </td>
        `;

        tbody.appendChild(row);

        // Trigger fade-in animation for the row
        // setTimeout(() => {
        //     row.classList.add("tr-visible");
        // }, 100);
    });
}

// إضافة أو تعديل مستخدم
btn_add.onclick = function () {
    if (UserNameInput.value === "" || emailInput.value === "" || countInput.value === "") {
        alert("Please fill in all fields");
        return;
    }

    if (editIndex === -1) {
        // إذا كان editIndex -1، فهذا يعني أننا نضيف مستخدم جديد
        let user = {
            UserName: UserNameInput.value,
            email: emailInput.value,
            count: countInput.value
        };
        arr.push(user);
    } else {
        // إذا كان editIndex يحتوي على قيمة، فهذا يعني أننا نقوم بتعديل المستخدم
        arr[editIndex] = {
            UserName: UserNameInput.value,
            email: emailInput.value
        };
        btn_add.textContent = "Add";  // إعادة النص إلى "إضافة" بعد التعديل
        editIndex = -1;  // إعادة فهرس التعديل إلى -1
    }

    Show();
    saveData();
};

// حذف مستخدم
function Delete(index) {
    if (confirm("Are you sure you want to delete this user?")) {
        // قم بحذف الصف مع الانيميشن
        const row = tbody.querySelectorAll("tr")[index];
        row.classList.add("fade-out");

        setTimeout(() => {
            arr.splice(index, 1);
            Show();
            saveData();
        }, 500); // تأخير 500 ملي ثانية للسماح للانيميشن بالعمل
    }
}

// تعديل مستخدم
function Edit(index) {
    UserNameInput.value = arr[index].UserName;
    emailInput.value = arr[index].email;
    editIndex = index;  // حفظ فهرس المستخدم الذي يتم تعديله
    btn_add.textContent = "Edit";  // تغيير النص إلى "تعديل"
}

// تبديل الوضع بين الفاتح والداكن
toggleDarkMode.onclick = function () {
    document.body.classList.toggle("dark-mode");

    // تغيير الأيقونة بناءً على الوضع
    const icon = toggleDarkMode.querySelector("i");
    if (document.body.classList.contains("dark-mode")) {
        icon.classList.remove("ri-moon-fill");
        icon.classList.add("ri-sun-fill");
        icon.style.color = "#343a40";  // تغيير لون الأيقونة إلى الأسود في الوضع الداكن
        localStorage.setItem("darkMode", "enabled");
        toggleDarkMode.style.background = "#f8f9fa";  // تغيير اللون للزر في الوضع الداكن
    } else {
        icon.classList.remove("ri-sun-fill");
        icon.classList.add("ri-moon-fill");
        icon.style.color = "#f8f9fa";  // تغيير لون الأيقونة إلى الأبيض في الوضع الفاتح
        localStorage.setItem("darkMode", "disabled");
        toggleDarkMode.style.background = "#000000";  // تغيير اللون للزر في الوضع الفاتح
    }

    toggleDarkMode.classList.toggle("active");

    // تطبيق التغييرات على الحقول والجدول
    UserNameInput.classList.toggle("text-light", document.body.classList.contains("dark-mode"));
    UserNameInput.classList.toggle("bg-dark", document.body.classList.contains("dark-mode"));
    emailInput.classList.toggle("text-light", document.body.classList.contains("dark-mode"));
    emailInput.classList.toggle("bg-dark", document.body.classList.contains("dark-mode"));
    countInput.classList.toggle("text-white", document.body.classList.contains("dark-mode"));
    countInput.classList.toggle("bg-dark", document.body.classList.contains("dark-mode"));
    table.classList.toggle("table-dark", document.body.classList.contains("dark-mode"));
    location.reload();
};

// تحميل الوضع المحدد مسبقًا
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    toggleDarkMode.querySelector("i").classList.remove("ri-moon-fill");
    toggleDarkMode.querySelector("i").classList.add("ri-sun-fill");
    toggleDarkMode.querySelector("i").style.color = "#343a40";  // تغيير لون الأيقونة إلى الأسود عند تحميل الوضع الداكن
    toggleDarkMode.style.background = "#f8f9fa";  // تغيير اللون للزر في الوضع الداكن
    UserNameInput.classList.add("text-light", "bg-dark");
    countInput.classList.add("text-light", "bg-dark");
    emailInput.classList.add("text-light", "bg-dark");
    table.classList.add("table-dark");

}

function scrollUp() {
    if (scrollY > 50) {
        scroll({
            top: 10,
            behavior: "smooth",
        })
    }
}

// زيادة قيمة count
function increaseCount(index) {
    arr[index].count = +arr[index].count + 1;
    Show();
    saveData();
}

// تقليل قيمة count
function decreaseCount(index) {
    if (arr[index].count > 0) {
        arr[index].count = +arr[index].count - 1;
        Show();
        saveData();
    }
}


function deleteAll() {
    if (confirm("Are you sure you want to delete all ?")) {
        setTimeout(() => {
            localStorage.clear();
            arr.splice(0);
            Show();
            saveData();
        }, 500); // تأخير 500 ملي ثانية للسماح للانيميشن بالعمل
    }

};
//endDeleteAll






// تحميل البيانات عند بدء التشغيل
loadData();

