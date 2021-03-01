const greetingTag = document.getElementById("greeting");
const tableBody = document.getElementById("tableBody");
const idSortBtn = document.getElementById("idSortBtn");
const amountSortBtn = document.getElementById("amountSortBtn");
const statusSortBtn = document.getElementById("statusSortBtn");
const dateSortBtn = document.getElementById("dateSortBtn");


const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
const jwt = localStorage.getItem("jwt")
greetingTag.innerHTML = `welcome: ${userInfo.isManager? "manager" : "employee"} ${userInfo.firstName} ${userInfo.lastName}`;
const employeeId = userInfo.employeeId;
let expenseList;
let idSortAscBtn = false;

idSortBtn.addEventListener("click", () => {
    resetSortBtnStyle();
    if (idSortAscBtn) {
        expenseList.sort( (a, b) => a.expenseId > b.expenseId ? 1 : -1)
        idSortBtn.classList = "mx-1 fas fa-sort-up";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    } else {
        expenseList.sort( (a, b) => a.expenseId < b.expenseId ? 1 : -1)
        idSortBtn.classList = "mx-1 fas fa-sort-down";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    }
});

statusSortBtn.addEventListener("click", () => {
    resetSortBtnStyle();
    if (idSortAscBtn) {
        expenseList.sort( (a, b) => a.status > b.status ? 1 : -1)
        statusSortBtn.classList = "mx-1 fas fa-sort-up";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    } else {
        expenseList.sort( (a, b) => a.status < b.status ? 1 : -1)
        statusSortBtn.classList = "mx-1 fas fa-sort-down";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    }
});

dateSortBtn.addEventListener("click", () => {
    resetSortBtnStyle();
    if (idSortAscBtn) {
        expenseList.sort( (a, b) => a.dateSubmitted > b.dateSubmitted ? 1 : -1)
        dateSortBtn.classList = "mx-1 fas fa-sort-up";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    } else {
        expenseList.sort( (a, b) => a.dateSubmitted < b.dateSubmitted ? 1 : -1)
        dateSortBtn.classList = "mx-1 fas fa-sort-down";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    }
});

function resetSortBtnStyle() {
    idSortBtn.classList = "mx-1 fas fa-minus-circle";
    amountSortBtn.classList = "mx-1 fas fa-minus-circle";
    statusSortBtn.classList = "mx-1 fas fa-minus-circle";
    dateSortBtn.classList = "mx-1 fas fa-minus-circle";
}

amountSortBtn.addEventListener("click", () => {
    if (idSortAscBtn) {
        expenseList.sort( (a, b) => parseFloat(a.amount) > parseFloat(b.amount) ? 1 : -1)
        amountSortBtn.classList = "mx-1 fas fa-sort-up";
        idSortBtn.classList = "mx-1 fas fa-minus-circle";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    } else {
        expenseList.sort( (a, b) => parseFloat(a.amount) < parseFloat(b.amount) ? 1 : -1)
        amountSortBtn.classList = "mx-1 fas fa-sort-down";
        idSortBtn.classList = "mx-1 fas fa-minus-circle";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    }
});


function disPlayTable(expenseList) {
    let innerHtml = '';
    if (expenseList == null)
        return;
    expenseList.forEach(expense => {
        innerHtml += `<tr>
        <td class="align-middle">${expense.employeeId}</td>
        <td class="align-middle"><i class="fas fa-dollar-sign"></i> ${expense.amount}</td>
        <td class="align-middle">
            <span class="mr-2">${expense.status}</span>
            <button class="btn btn-sm btn-outline-success" onclick="approveExpense(${expense.expenseId}, true)">approve</button>
            <button class="btn btn-sm btn-outline-danger" onclick="approveExpense(${expense.expenseId}, false)">deny</button>
        </td>
        <td class="align-middle">
            <small>Submit on ${new Date(expense.dateSubmitted * 1000).toLocaleString()}</small>
            <br>
            <small>Process on ${new Date(expense.dateProcessed * 1000).toLocaleString()}</small>
        </td>
        <td class="align-middle">
            <textarea class="form-control" id="reasonTextArea${expense.expenseId}" rows="2">${expense.reason}</textarea>
        </td>
    </tr>`
    });
    tableBody.innerHTML = innerHtml;
}

async function getAllExpense() {
    const httpResponse = await fetch("http://localhost:7000/expense");
    const allExpense = await httpResponse.json();
    // expenseList = allExpense;
    // disPlayTable(allExpense);
    return allExpense;
}

async function approveExpense(expenseId, isApproved) {
    const expense = await getExpenseById(expenseId);
    const reasonTextArea = document.getElementById(`reasonTextArea${expenseId}`);
    expense.reason = reasonTextArea.value;
    expense.status = isApproved ? "APPROVED" : "DENIED";
    const detail = {
        method: "POST",
        headers: {
            Authorization: localStorage.getItem("jwt")
        },
        body: JSON.stringify(expense)
    }
    const httpResponse = await fetch(`http://localhost:7000/expense/${expenseId}`, detail);
    const resBody = await httpResponse.json();
    // console.log(resBody)
    expenseList = expenseList.map(e => {
        if(e.expenseId == expenseId)
            return resBody;
        else
            return e;
    })
    disPlayTable(expenseList);
}

async function getExpenseById(expenseId) {
    const httpResponse = await fetch(`http://localhost:7000/expense/${expenseId}`);
    const expense = await httpResponse.json();
    // console.log(expense);
    // console.log(expense.employeeId)
    return expense;
}

async function setUp() {
    expenseList = await getAllExpense();
    expenseList.sort( (a, b) => a.expenseId > b.expenseId ? 1 : -1)
    disPlayTable(expenseList);
}

setUp();