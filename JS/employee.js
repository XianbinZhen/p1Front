const greetingTag = document.getElementById("greeting");
const tableBody = document.getElementById("tableBody");
const amountInput = document.getElementById("amountInput");
const reasonTextArea = document.getElementById("reasonTextArea");
const submitExpenseBtn = document.getElementById("submitExpenseBtn");
const errorMessage = document.getElementById("errorMessage");

const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
const employeeId = 1;
const jwt = localStorage.getItem("jwt")

greetingTag.innerHTML = `welcome: ${userInfo.isManager? "manager" : "employee"} ${userInfo.firstName} ${userInfo.lastName}`;
submitExpenseBtn.addEventListener("click", createExpense)


async function getAllExpenseByEmployeeId(id) {
    const httpResponse = await fetch(`http://localhost:7000/expense?employeeId=${id}`);
    const allExpense = await httpResponse.json();
    
    let innerHtml = '';

    allExpense.forEach(element => {
        innerHtml += `<tr>
        <td>$ ${element.amount}</td>
        <td style="overflow: hidden">${element.reason}</td>
        <td>${element.status}</td>
        <td>${new Date(element.dateSubmitted * 1000).toLocaleString()}</td>
        <td>${new Date(element.dateProcessed * 1000).toLocaleString()}</td>
    </tr>`
    });
    tableBody.innerHTML = innerHtml;
}

async function createExpense() {
    const amount = parseFloat(amountInput.value);
    const reason = reasonTextArea.value;
    if (reason != "" && amount > 0) {
        const expense = {
            reason,
            amount,
            employeeId: employeeId,
            status: "PENDING"
        }
        const detail = {
            method: "POST",
            body: JSON.stringify(expense)
        }
        const httpResponse = await fetch("http://localhost:7000/expense", detail);
        if(httpResponse.status === 201){
            // alert("Your book was saved correctly")
            getAllExpenseByEmployeeId(employeeId);
            errorMessage.innerHTML = "";
        }else{
            errorMessage.innerHTML = "Cannot save to database."
        }
    } else {
        errorMessage.innerHTML = "Please fill out the form with correct data."
    }
}


getAllExpenseByEmployeeId(employeeId);
