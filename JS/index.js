const accountInput = document.getElementById("accountInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");

let isLogin = false;

loginBtn.addEventListener("click", login);

async function login() {
    const username = accountInput.value;
    const password = passwordInput.value;
    let user = await checkUserpassword(username, password);

    isLogin = user.username == username;

    

    const detail = {
        method: 'POST',
        body: JSON.stringify(user)
    }

    const httpResponse = await fetch("http://localhost:7000/users/login", detail);
    const jwt = await httpResponse.text();
    localStorage.setItem("jwt", jwt);
    sessionStorage.setItem("jwt", jwt);
    sessionStorage.setItem("userInfo", JSON.stringify(user));
    // console.log(jwt);
    if (isLogin) {
        if (user.isManager)
            window.location.href = "../manager.html";
        else
            window.location.href = "../employee.html";
    } else {
        alert("please login")
    }
}

async function checkUserpassword(username, password) {
    const httpResponse = await fetch(`http://localhost:7000/employee?username=${username}&password=${password}`);
    const user = await httpResponse.json();
    console.log(user);
    return user;
}