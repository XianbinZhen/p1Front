const accountInput = document.getElementById("accountInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");

let isLogin = false;

loginBtn.addEventListener("click", login);

async function login() {
    
    isLogin = true;

    const body = {
        "firstName": "Marilou",
        "lastName": "Stan",
        "isManager": true
    }

    const detail = {
        method: 'POST',
        body: JSON.stringify(body)
    }

    const httpResponse = await fetch("http://localhost:7000/users/login", detail);
    const jwt = await httpResponse.text();
    localStorage.setItem("jwt", jwt);
    sessionStorage.setItem("jwt", jwt);
    sessionStorage.setItem("userInfo", JSON.stringify(body));
    // console.log(jwt);
    if (isLogin) {
        if (body.isManager)
            window.location.href = "../manager.html";
        else
            window.location.href = "../employee.html";
    } else {
        alert("please login")
    }
}