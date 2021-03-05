const accountInput = document.getElementById("accountInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");

let isLogin = false;

loginBtn.addEventListener("click", login);
passwordInput.addEventListener("keyup", (e) => {
    if(e.code == 'NumpadEnter' || e.code == 'Enter') {
        login();
    }
});

async function login() {
    const username = accountInput.value;
    const password = passwordInput.value;
    let user = {
        username,
        password
    };

    // isLogin = user.username == username;

    

    const detail = {
        method: 'POST',
        body: JSON.stringify(user)
    }

    const httpResponse = await fetch("http://localhost:7000/users/login", detail);
    const jwt = await httpResponse.text();
    // console.log(jwt)
    if ( jwt != "Incorrect username or password") {
        user = JSON.parse(atob(jwt.split('.')[1]));
        localStorage.setItem("jwt", jwt);
        sessionStorage.setItem("jwt", jwt);
        sessionStorage.setItem("userInfo", JSON.stringify(user));
        // console.log(jwt);
        console.log(user)
        if (user.role == "manager")
            window.location.href = "../manager.html";
        else
            window.location.href = "../employee.html";

    } else {
        alert("Incorrect username or password")
    }
}

// async function checkUserpassword(username, password) {
//     const httpResponse = await fetch(`http://localhost:7000/employee?username=${username}&password=${password}`);
//     const user = await httpResponse.json();
//     console.log(user);
//     return user;
// }