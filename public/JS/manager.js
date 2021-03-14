// Load google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

const logoutBtn = document.getElementById("logoutBtn");
const piechart = document.getElementById("piechart");
const piechart2 = document.getElementById("piechart2");
const greetingTag = document.getElementById("greeting");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const currentPage = document.getElementById("currentPage");
const tableBody = document.getElementById("tableBody");
const idSortBtn = document.getElementById("idSortBtn");
const amountSortBtn = document.getElementById("amountSortBtn");
const statusSortBtn = document.getElementById("statusSortBtn");
const dateSortBtn = document.getElementById("dateSortBtn");
const snackbar = document.getElementById("snackbar");
const spinner = document.getElementById("spinner");


const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
const jwt = localStorage.getItem("jwt")
greetingTag.innerHTML = `${userInfo.role.toUpperCase()} ${userInfo.firstName} ${userInfo.lastName}`;
const employeeId = userInfo.employeeId;
let expenseList;
let pendingCount = 0;
let approvedCount = 0;
let deniedCount = 0;
let pendingAmount = 0;
let approvedAmount = 0;
let deniedAmount = 0;
let idSortAscBtn = false;
const itemPerPage = 10;
let currentPageNumber = 0;

logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("jwt")
    sessionStorage.removeItem("userInfo");
    window.location.href = "index.html";
});

function drawChart() {
    const data = new google.visualization.arrayToDataTable([
        ['Status', 'Amount'],
        ['PENDING', pendingAmount],
        ['APPROVED', approvedAmount],
        ['DENIED', deniedAmount]
    ]);
    const data2 = new google.visualization.arrayToDataTable([
        ['Status', 'Count', {role: 'style'}],
        ['PENDING', pendingCount, 'color: gray' ],
        ['APPROVED', approvedCount, 'color: green'],
        ['DENIED', deniedCount, 'color: orange']
    ]);

    // Set chart options
    const options = {'title':'Expense Approved Amount ($)',
        // is3D: true,
        'width':400,
        'height':300,
        pieHole: 0.3,
        fontName: 'Contrail One',
        legendTextStyle: { color: '#FFF' },
        titleTextStyle: { color: '#FFF' },
        hAxis: {
            textStyle:{color: 'white'}
        },
        vAxis: {
            textStyle:{color: 'white'}
        },
        backgroundColor: {
            fill: 'black',
            fillOpacity: 0.6
        },
        slices: {
            0: { color: 'gray' },
            1: { color: 'green' },
            2: { color: 'orange' }
        }};
        
    const options2 = {
        ...options,
        'title':'Expense Approved Count',
        legend: 'none',
        legendTextStyle: { color: '#FFF' },
        titleTextStyle: { color: '#FFF' }
    };
    // Instantiate and draw our chart, passing in some options.
    const chart = new google.visualization.PieChart(piechart);
    const chart2 = new google.visualization.BarChart(piechart2);
    chart.draw(data, options);
    chart2.draw(data2, options2);
}


previousBtn.addEventListener("click", () => {
    if(currentPageNumber > 0) {
        currentPageNumber--;
        disPlayTable(expenseList);
    }
});

nextBtn.addEventListener("click", () => {
    if(currentPageNumber < Math.ceil(expenseList.length / itemPerPage) - 1) {
        currentPageNumber++;
        disPlayTable(expenseList);
    }
});

idSortBtn.addEventListener("click", () => {
    resetSortBtnStyle();
    if (idSortAscBtn) {
        expenseList.sort( (a, b) => a.employee.lastName > b.employee.lastName ? 1 : -1)
        idSortBtn.classList = "mx-1 fas fa-sort-up";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    } else {
        expenseList.sort( (a, b) => a.employee.lastName < b.employee.lastName ? 1 : -1)
        idSortBtn.classList = "mx-1 fas fa-sort-down";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    }
});

statusSortBtn.addEventListener("click", () => {
    resetSortBtnStyle();
    if (idSortAscBtn) {
        expenseList.sort( (a, b) => a.expense.status > b.expense.status ? 1 : -1)
        statusSortBtn.classList = "mx-1 fas fa-sort-up";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    } else {
        expenseList.sort( (a, b) => a.expense.status < b.expense.status ? 1 : -1)
        statusSortBtn.classList = "mx-1 fas fa-sort-down";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    }
});

dateSortBtn.addEventListener("click", () => {
    resetSortBtnStyle();
    if (idSortAscBtn) {
        expenseList.sort( (a, b) => a.expense.dateSubmitted > b.expense.dateSubmitted ? 1 : -1)
        dateSortBtn.classList = "mx-1 fas fa-sort-up";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    } else {
        expenseList.sort( (a, b) => a.expense.dateSubmitted < b.expense.dateSubmitted ? 1 : -1)
        dateSortBtn.classList = "mx-1 fas fa-sort-down";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    }
});

amountSortBtn.addEventListener("click", () => {
    resetSortBtnStyle();
    if (idSortAscBtn) {
        expenseList.sort( (a, b) => parseFloat(a.expense.amount) > parseFloat(b.expense.amount) ? 1 : -1)
        amountSortBtn.classList = "mx-1 fas fa-sort-up";
        idSortBtn.classList = "mx-1 fas fa-minus-circle";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    } else {
        expenseList.sort( (a, b) => parseFloat(a.expense.amount) < parseFloat(b.expense.amount) ? 1 : -1)
        amountSortBtn.classList = "mx-1 fas fa-sort-down";
        idSortBtn.classList = "mx-1 fas fa-minus-circle";
        idSortAscBtn = !idSortAscBtn;
        disPlayTable(expenseList);
    }
});


function resetSortBtnStyle() {
    idSortBtn.classList = "mx-1 fas fa-minus-circle";
    amountSortBtn.classList = "mx-1 fas fa-minus-circle";
    statusSortBtn.classList = "mx-1 fas fa-minus-circle";
    dateSortBtn.classList = "mx-1 fas fa-minus-circle";
    restPageNumbers();
}
function restPageNumbers() {
    currentPageNumber = 0;
}



function disPlayTable(expenseList) {
    const totalPages = Math.ceil(expenseList.length / itemPerPage);
    if(currentPageNumber < 1)
        previousBtn.disabled = true;
    else
        previousBtn.disabled = false;
    if(currentPageNumber >= totalPages - 1)
        nextBtn.disabled = true;
    else
        nextBtn.disabled = false;
    let innerHtml = '';
    pendingCount = 0;
    approvedCount = 0;
    deniedCount = 0;
    pendingAmount = 0;
    approvedAmount = 0;
    deniedAmount = 0;
    if (expenseList == null)
        return;
    expenseList.forEach(expense => {
        if (expense.expense.status == "PENDING") {
            pendingCount++;
            pendingAmount += expense.expense.amount;
        } else if (expense.expense.status == "DENIED") {
            deniedCount++;
            deniedAmount += expense.expense.amount;
        } else {
            approvedCount++;
            approvedAmount += expense.expense.amount;
        }
    });
    let endIndex = currentPageNumber * itemPerPage + itemPerPage;
    let expenseListCopy = expenseList.slice(currentPageNumber*itemPerPage, endIndex);
    expenseListCopy.forEach(expense => {
        innerHtml += `<tr>
        <td>${expense.employee.firstName} ${expense.employee.lastName}</td>
        <td><i class="fas fa-dollar-sign"></i> ${expense.expense.amount}</td>
        <td>
            <span class="mx-auto d-block">${expense.expense.status}</span>
            <button class="btn btn-sm btn-outline-success m-1" onclick="approveExpense(${expense.expense.expenseId}, true)">approve</button>
            <button class="btn btn-sm btn-outline-danger m-1" onclick="approveExpense(${expense.expense.expenseId}, false)">deny</button>
        </td>
        <td>
            <small>Submit on ${new Date(expense.expense.dateSubmitted * 1000).toLocaleString()}</small>
            <br>
            <small>Process on ${new Date(expense.expense.dateProcessed * 1000).toLocaleString()}</small>
        </td>
        <td>
            <textarea class="form-control" id="reasonTextArea${expense.expense.expenseId}" rows="2">${expense.expense.reason}</textarea>
        </td>
        <td>
            <a href="${expense.expense.imgUrl}" target="_blank">
                <img class="thumbnail" src="${expense.expense.imgUrl}" alt="No img" onerror="this.onerror=null; this.remove();">
            </a>
        </td>
    </tr>`;
    });

    tableBody.innerHTML = innerHtml;
    currentPage.innerHTML = `${currentPageNumber+1} / ${totalPages}`;
    drawChart();
}

async function getAllExpense() {
    const httpResponse = await fetch("http://35.202.169.35:7000/expenseJoinEmployee");
    const allExpense = await httpResponse.json();
    // expenseList = allExpense;
    // disPlayTable(allExpense);
    return allExpense;
}

async function approveExpense(expenseId, isApproved) {
    spinner.className = "visible";
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
    const httpResponse = await fetch(`http://35.202.169.35:7000/expense/${expenseId}`, detail);
    const resBody = await httpResponse.json();
    // console.log(resBody)
    expenseList = expenseList.map(e => {
        if(e.expense.expenseId == expenseId)
            return ({
                    ...e,
                    expense: resBody
                });
        else
            return e;
    });
    disPlayTable(expenseList);
    spinner.className = "invisible";
    showSnackbar("Status changed")
}

async function getExpenseById(expenseId) {
    const httpResponse = await fetch(`http://35.202.169.35:7000/expense/${expenseId}`);
    const expense = await httpResponse.json();
    // console.log(expense);
    // console.log(expense.employeeId)
    return expense;
}

async function setUp() {
    expenseList = await getAllExpense();
    disPlayTable(expenseList);
}

function showSnackbar(message) {
    snackbar.className = "show";
    snackbar.innerText = message;
    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}

setUp();