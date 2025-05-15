//--------------------------------------------------------------
// W04 - Deliver Registration View activity - Show/Hide Password
//--------------------------------------------------------------

const passwdBtn = document.querySelector("#passwdBtn")
passwdBtn.addEventListener("click", function () {
    let passwdInput = document.getElementById("password")
    let type = passwdInput.getAttribute("type")
    if (type == "password") {
        passwdInput.setAttribute("type", "text")
        passwdBtn.innerHTML = "Hide Password"
    } else {
        passwdInput.setAttribute("type", "password")
        passwdBtn.innerHTML = "Show Password"
    }
})