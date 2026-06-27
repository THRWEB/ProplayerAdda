import { auth } from "./config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

export function checkAuth(onLogin) {
    onAuthStateChanged(auth, (user) => {

        if (user) {
            onLogin(user);
        } else {

            const page = location.pathname.split("/").pop();

            if (
                page !== "login.html" &&
                page !== "register.html"
            ) {
                window.location.href = "login.html";
            }
        }

    });
}

export async function logout() {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (err) {
        console.error("Logout Error:", err);
    }
}
