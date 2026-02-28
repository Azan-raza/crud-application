let selectedId = null;
const API_BASE_URLS = window.location.origin === "http://localhost:5000"
    ? [""]
    : ["http://localhost:5000", "http://127.0.0.1:5000"];

async function fetchApi(path, options) {
    let lastError;

    for (const baseUrl of API_BASE_URLS) {
        try {
            return await fetch(baseUrl + path, options);
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error("Cannot connect to API server.");
}

// ADD STUDENT
async function addStudent() {

    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let course = document.getElementById("course").value;

    if (!name || !age || !course) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const response = await fetchApi("/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                age: Number(age),
                course: course
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to add student.");
        }

        clearFields();
        await getStudents();
    } catch (error) {
        if (error.message === "Failed to fetch") {
            alert("Cannot connect to backend. Run: node server.js");
        } else {
            alert(error.message);
        }
        console.error("Add student error:", error);
    }
}


// GET STUDENTS
async function getStudents() {

    try {
        const response = await fetchApi("/students");
        if (!response.ok) {
            throw new Error("Failed to load students.");
        }
        const data = await response.json();

        var list = document.getElementById("list");
        list.innerHTML = "";

        data.forEach(function(student) {

            var li = document.createElement("li");

            li.innerHTML =
                student.name + " | " +
                student.age + " | " +
                student.course +
                "<br>" +
                "<button class='edit-btn' onclick='editStudent(\"" + student._id + "\", \"" + student.name + "\", \"" + student.age + "\", \"" + student.course + "\")'>Edit</button>" +
                "<button class='delete-btn' onclick='deleteStudent(\"" + student._id + "\")'>Delete</button>";

            list.appendChild(li);
        });
    } catch (error) {
        if (error.message === "Failed to fetch") {
            alert("Cannot connect to backend. Run: node server.js");
        } else {
            alert(error.message);
        }
        console.error("Get students error:", error);
    }
}


// EDIT STUDENT
function editStudent(id, name, age, course) {
    selectedId = id;

    document.getElementById("name").value = name;
    document.getElementById("age").value = age;
    document.getElementById("course").value = course;
}


// UPDATE STUDENT
async function updateStudent() {

    if (selectedId == null) {
        alert("Please select a student first");
        return;
    }

    var name = document.getElementById("name").value;
    var age = document.getElementById("age").value;
    var course = document.getElementById("course").value;

    try {
        const response = await fetchApi("/students/" + selectedId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                age: Number(age),
                course: course
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to update student.");
        }

        selectedId = null;
        clearFields();
        await getStudents();
    } catch (error) {
        if (error.message === "Failed to fetch") {
            alert("Cannot connect to backend. Run: node server.js");
        } else {
            alert(error.message);
        }
        console.error("Update student error:", error);
    }
}


// DELETE STUDENT
async function deleteStudent(id) {

    try {
        const response = await fetchApi("/students/" + id, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to delete student.");
        }

        await getStudents();
    } catch (error) {
        if (error.message === "Failed to fetch") {
            alert("Cannot connect to backend. Run: node server.js");
        } else {
            alert(error.message);
        }
        console.error("Delete student error:", error);
    }
}


// CLEAR INPUT FIELDS
function clearFields() {
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("course").value = "";
}


// LOAD DATA WHEN PAGE OPENS
getStudents();
