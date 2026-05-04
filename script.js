
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");

// تحميل المهام وتحديث العداد عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
    getLocalTasks();
    updateCounts();
});

function addTask() {
    const text = taskInput.value.trim();
    const priority = priorityInput.value;

    if (text === "") {
        alert("Please write something!");
        return;
    }

    const taskObj = { text, priority, completed: false };
    
    createTaskElement(taskObj);
    saveToLocal(taskObj);
    updateCounts();
    
    taskInput.value = "";
}

function createTaskElement(taskObj) {
    const li = document.createElement("li");
    li.classList.add(`priority-${taskObj.priority}`);
    if (taskObj.completed) li.classList.add("completed");

    li.innerHTML = `
        <span onclick="toggleComplete(this)">${taskObj.text}</span>
        <button class="delete-btn" onclick="removeTask(this)">×</button>
    `;
    
    taskList.appendChild(li);
}

function toggleComplete(span) {
    const li = span.parentElement;
    li.classList.toggle("completed");
    
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach(t => {
        if (t.text === span.innerText) t.completed = !t.completed;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateCounts();
}

function removeTask(btn) {
    const li = btn.parentElement;
    const text = li.querySelector("span").innerText;
    li.remove();

    let tasks = JSON.parse(localStorage.getItem("tasks"));
    const filteredTasks = tasks.filter(t => t.text !== text);
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    updateCounts();
}

function updateCounts() {
    let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
    const pending = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;

    document.getElementById("pendingCount").innerText = `Pending: ${pending}`;
    document.getElementById("completedCount").innerText = `Completed: ${completed}`;
}

function saveToLocal(task) {
    let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getLocalTasks() {
    let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
    tasks.forEach(task => createTaskElement(task));
}
// تفعيل زر Enter عند الكتابة في المربع
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    themeToggle.innerText = newTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    
    localStorage.setItem("theme", newTheme); // حفظ الاختيار
});

// عند تحميل الصفحة، تأكد من الثيم المحفوظ
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeToggle.innerText = savedTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
}