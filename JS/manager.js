// Load google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

const piechart = document.getElementById("piechart");
const piechart2 = document.getElementById("piechart2");
const greetingTag = document.getElementById("greeting");
const tableBody = document.getElementById("tableBody");
const idSortBtn = document.getElementById("idSortBtn");
const amountSortBtn = document.getElementById("amountSortBtn");
const statusSortBtn = document.getElementById("statusSortBtn");
const dateSortBtn = document.getElementById("dateSortBtn");

const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
const jwt = localStorage.getItem("jwt")
greetingTag.innerHTML = `welcome: ${userInfo.role} ${userInfo.firstName} ${userInfo.lastName}`;
const employeeId = userInfo.employeeId;
let expenseList;
let pendingCount = 0;
let approvedCount = 0;
let deniedCount = 0;
let pendingAmount = 0;
let approvedAmount = 0;
let deniedAmount = 0;
let idSortAscBtn = false;

function drawChart() {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Status');
    data.addColumn('number', 'Count');
    data.addRows([
        ['PENDING', pendingCount],
        ['APPROVED', approvedCount],
        ['DENIED', deniedCount]
    ]);

    const data2 = new google.visualization.arrayToDataTable([
        ['Status', 'Amount', {role: 'style'}],
        ['PENDING', pendingAmount, 'color: gray' ],
        ['APPROVED', approvedAmount, 'color: green'],
        ['DENIED', deniedAmount, 'color: orange']
    ]);

    // Set chart options
    const options = {'title':'Expense Approval Rate',
        // is3D: true,
        'width':400,
        'height':300,
        pieHole: 0.3,
        slices: {
            0: { color: 'gray' },
            1: { color: 'green' },
            2: { color: 'orange' }
        }};
    const options2 = {'title':'Expense Approval Amount ($)',
        is3D: true,
        'width':400,
        'height':300,
        legend: 'none',
        bar: {groupWidth: "85%"},
    };
    // Instantiate and draw our chart, passing in some options.
    const chart = new google.visualization.PieChart(piechart);
    const chart2 = new google.visualization.BarChart(piechart2);
    chart.draw(data, options);
    chart2.draw(data2, options2);
}


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
    pendingCount = 0;
    approvedCount = 0;
    deniedCount = 0;
    pendingAmount = 0;
    approvedAmount = 0;
    deniedAmount = 0;
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
    </tr>`;
        if (expense.status == "PENDING") {
            pendingCount++;
            pendingAmount += expense.amount;
        } else if (expense.status == "DENIED") {
            deniedCount++;
            deniedAmount += expense.amount;
        } else {
            approvedCount++;
            approvedAmount += expense.amount;
        }
    });

    tableBody.innerHTML = innerHtml;
    drawChart();
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
    disPlayTable(expenseList);
}

setUp();