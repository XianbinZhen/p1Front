
// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDXYgAR6kVbM_9IPUUVPDYhDFOkKEhvibc",
    authDomain: "zhen-305115.firebaseapp.com",
    databaseURL: "https://zhen-305115-default-rtdb.firebaseio.com",
    projectId: "zhen-305115",
    storageBucket: "zhen-305115.appspot.com",
    messagingSenderId: "144990151322",
    appId: "1:144990151322:web:1623397d7a8738d6e37523",
    measurementId: "G-KC010JGBK6"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const logoutBtn = document.getElementById("logoutBtn");
const greetingTag = document.getElementById("greeting");
const tableBody = document.getElementById("tableBody");
const amountInput = document.getElementById("amountInput");
const uploader = document.getElementById("uploader")
const fileButton = document.getElementById("fileButton");
const reasonTextArea = document.getElementById("reasonTextArea");
const submitExpenseBtn = document.getElementById("submitExpenseBtn");
const errorMessage = document.getElementById("errorMessage");
const snackbar = document.getElementById("snackbar");
const spinner = document.getElementById("spinner");

const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
const employeeId = userInfo.employeeId;
const jwt = localStorage.getItem("jwt")
let file = null;
let imgUrl;
greetingTag.innerHTML = `${userInfo.role.toUpperCase()} ${userInfo.firstName} ${userInfo.lastName}`;

logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("jwt")
    sessionStorage.removeItem("userInfo");
    window.location.href = "index.html";
});

fileButton.addEventListener("change", e => {
    file = e.target.files[0];
});

submitExpenseBtn.addEventListener("click", createExpense);

async function getAllExpenseByEmployeeId(id) {
    const httpResponse = await fetch(`http://35.202.169.35:7000/expense?employeeId=${id}`);
    const allExpense = await httpResponse.json();
    let innerHtml = '';

    allExpense.forEach(expense => {
        innerHtml += `<tr>
        <td><i class="fas fa-dollar-sign"></i> ${expense.amount}</td>
        <td>${expense.status}</td>
        <td>
        <small>Submit on ${new Date(expense.dateSubmitted * 1000).toLocaleString()}</small>
        <br>
        <small>Process on ${new Date(expense.dateProcessed * 1000).toLocaleString()}</small>
        </td>
        <td style="overflow: hidden">${expense.reason}</td>
        <td>
            <a href="${expense.imgUrl}" target="_blank">
                <img class="thumbnail" src="${expense.imgUrl}" alt="No img" onerror="this.onerror=null; this.remove();">
            </a>
        </td>
    </tr>`
    });
    tableBody.innerHTML = innerHtml;
};

async function createExpense() {
    spinner.className = "visible";
    const amount = parseFloat(amountInput.value);
    const reason = reasonTextArea.value;
    if (reason != "" && amount > 0) {
        if (file != null) {
            spinner.className = "visible";
            let storageRef = firebase.storage().ref(`Images/${file.name}`);
            let task = storageRef.put(file);
            task.on("state_change",
            function progress(snapshot) {
                let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploader.value = percentage;
            },
            function error(err) {
                console.log(err);
                spinner.className = "invisible";
            },
            function complete(){
                task.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                    imgUrl = downloadURL;
                    // console.log('File available at', downloadURL);
                    const expense = {
                        reason,
                        amount,
                        employeeId: employeeId,
                        status: "PENDING",
                        imgUrl
                    };
                    uploadData(expense);
                });
            });
        } else {
            const expense = {
                reason,
                amount,
                employeeId: employeeId,
                status: "PENDING",
                imgUrl
            };
            uploadData(expense);
        }
    } else {
        errorMessage.innerHTML = "Please fill out the form with correct data."
        showSnackbar("Incorrect field.")
        spinner.className = "invisible";
    }
};

async function uploadData(expense) {
    const detail = {
        method: "POST",
        body: JSON.stringify(expense)
    }
    const httpResponse = await fetch("http://35.202.169.35:7000/expense", detail);
    if(httpResponse.status === 201){
        clearInput(); 
        // alert("Your book was saved correctly")
        getAllExpenseByEmployeeId(employeeId);
        errorMessage.innerHTML = "";
        showSnackbar("Your expense is submitted successfully."); 
        spinner.className = "invisible";   
    } else {
        errorMessage.innerHTML = "Cannot save to database."
        showSnackbar(`Error: ${httpResponse.status}`)
        spinner.className = "invisible";
    };
    spinner.className = "invisible";
};

function clearInput() {
    reasonTextArea.value = "";
    amountInput.value = "";
    fileButton.value = "";
    uploader.value = 0;
};

function showSnackbar(message) {
    snackbar.className = "show";
    snackbar.innerText = message;
    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}

getAllExpenseByEmployeeId(employeeId);
