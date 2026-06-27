const outlet = document.getElementById("app-outlet");
const loader = document.getElementById("router-loader");

async function loadPage(page) {

    if (loader) {
        loader.style.display = "flex";
        loader.style.opacity = "1";
    }

    try {

        const response = await fetch(`${page}.html`);

        if (!response.ok) {
            throw new Error("Page not found");
        }

        const html = await response.text();

        outlet.innerHTML = html;

        // Execute page scripts
        outlet.querySelectorAll("script").forEach(oldScript => {

            const script = document.createElement("script");

            if (oldScript.type === "module") {
                script.type = "module";
            }

            if (oldScript.src) {
                script.src = oldScript.src;
            } else {
                script.textContent = oldScript.textContent;
            }

            document.body.appendChild(script);
            script.remove();

        });

    } catch (err) {

        console.error(err);

        outlet.innerHTML = `
        <div style="
            padding:60px 20px;
            text-align:center;
            color:white;
        ">
            <h2>404</h2>
            <p>Page Not Found</p>
        </div>
        `;

    }

    if (loader) {

        setTimeout(() => {

            loader.style.opacity = "0";

            setTimeout(() => {

                loader.style.display = "none";

            },300);

        },300);

    }

}

function updateNav(page){

    document.querySelectorAll(".nav-btn").forEach(btn=>{

        btn.classList.remove("active");

        if(btn.dataset.route===page){

            btn.classList.add("active");

        }

    });

}

export const router={

    async navigate(page){

        if(location.hash!==`#${page}`){

            history.pushState(null,"",`#${page}`);

        }

        updateNav(page);

        await loadPage(page);

    }

};

window.addEventListener("popstate",()=>{

    const page=location.hash.replace("#","")||"home";

    router.navigate(page);

});
