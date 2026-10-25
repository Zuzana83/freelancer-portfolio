import graphicPortfolio from "./graphicPortfolio.js";
const pageHeaderEl = document.querySelector(".page-header");
const openMenuBtnEl = document.getElementById("openMenu");
const pageNavigationEl = document.getElementById("pageNavigation");
const closeNavigationBtnEl = document.getElementById("closeMobileNav");
const graphicPortfolioGridEl = document.getElementById("graphicPortfolio");
const loadMoreBtnEl = document.getElementById("loadMoreBtn");
const contactFormEl = document.getElementById("contactForm");
const menoEl = document.getElementById("meno");
const priezviskoEl = document.getElementById("priezvisko");
const telefonEl = document.getElementById("telCislo");
const emailEl = document.getElementById("email");
const spravaEl = document.getElementById("sprava");
const submitBtnEl = document.getElementById("submitBtn");
const popupMsgEl = document.getElementById("popupMsg");
const popupMsgTitleEl = document.getElementById("msgTitle");
const popupMsgTextEl = document.getElementById("msgText");
const devProjectsArticles = document.querySelectorAll(".single-frontend-project");

const inputsArray = [menoEl, priezviskoEl, telefonEl, emailEl, spravaEl];
// Email address pattern 
const emailPattern = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
const INITIAL_COUNT = 11;
let popupTimer;

devProjectsArticles.forEach(article => article.classList.add("pre-animation"));

// Slide-in images observer
const slideInObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add("moved-in");
            slideInObserver.unobserve(entry.target);
        }
    })
}, {
    rootMargin: "0px 0px -40px 400px"
});

// MOBILE MENU 
function openNavigation() {
    pageNavigationEl.classList.add("open");
    openMenuBtnEl.setAttribute("aria-expanded", "true");
    closeNavigationBtnEl.focus();
}

function closeNavigation() {
    pageNavigationEl.classList.remove("open");
    openMenuBtnEl.setAttribute("aria-expanded", "false");
}

openMenuBtnEl.addEventListener("click", function(e) {
    openNavigation();
});

closeNavigationBtnEl.addEventListener("click", function(e) {
    closeNavigation();
    openMenuBtnEl.focus();
});

pageNavigationEl.addEventListener("click", function(e) {
    if(e.target.classList.contains("nav-link") || e.target.classList.contains("contact-btn")) {
        closeNavigation();
    }
});

window.addEventListener("click", function(e) {
    if(pageNavigationEl.classList.contains("open") && !pageNavigationEl.contains(e.target) && !openMenuBtnEl.contains(e.target)) {
        closeNavigation();
    }
});

// PORTFOLIO GRID
function createGridItem(item) {
    const {small, large, shape, alt} = item;
    return `<div class="portfolio-img shape-${shape}">
                <a data-fslightbox href="${large}">
                    <img src="${small}" alt="${alt}" class="pre-animation" loading="lazy" />
                </a>
            </div>`
}

function loadGraphicPortfolio(portfolioArr) {
    const html = portfolioArr.map(item => {
        return createGridItem(item);
    }).join("");
    graphicPortfolioGridEl.insertAdjacentHTML("beforeend",html);
    refreshFsLightbox();
    // Graphic designs observer
    const graphicPortfolioImages = document.querySelectorAll(".portfolio-img img");
    graphicPortfolioImages.forEach(img => slideInObserver.observe(img));
}

loadGraphicPortfolio(graphicPortfolio.slice(0, INITIAL_COUNT));

loadMoreBtnEl.addEventListener("click", function() {
    const isExpanded = loadMoreBtnEl.getAttribute("aria-expanded") === "true";
    const gridLength = graphicPortfolioGridEl.children.length;

    if(isExpanded) {
        loadMoreBtnEl.textContent = "Zobraziť viacej";
        loadMoreBtnEl.setAttribute("aria-expanded", String(!isExpanded));
        const gridChildren = [...graphicPortfolioGridEl.children];
        const extraChildren = gridChildren.slice(INITIAL_COUNT)
        extraChildren.forEach(child => child.remove());
        refreshFsLightbox();
        loadMoreBtnEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
        loadMoreBtnEl.textContent = "Zobraziť menej";
        loadMoreBtnEl.setAttribute("aria-expanded", String(!isExpanded));
        loadGraphicPortfolio(graphicPortfolio.slice(INITIAL_COUNT));
        const focusedEl = graphicPortfolioGridEl.children[gridLength];
        focusedEl.firstElementChild.focus();
    }
});

// FORM SUBMISSION
function showInputError(element, text) {
    element.classList.add("error");
    element.nextElementSibling.textContent = text;
    element.setAttribute("aria-invalid", "true");
}

function clearAllErrors() {
    const errorEls = document.querySelectorAll(".error");
    for(const err of errorEls) {
        err.classList.remove("error");
        err.nextElementSibling.textContent = ""
        err.removeAttribute("aria-invalid");
    }
}

function clearInputError(element) {
    element.classList.remove("error");
    element.nextElementSibling.textContent = "";
    element.removeAttribute("aria-invalid");
}

function checkEmptyInput(input) {
    const inputToCheck = input.value.trim();
    if(inputToCheck === "") {
        showInputError(input, "Vyplňte prosím povinný údaj");
        return false;
    }
    return true;
}

function validateEmail(email) {
    const value = email.value.trim();
    if(!emailPattern.test(value)) {
        showInputError(email, "Oops! Nesprávny formát emailu");
        return false;
    }
    return true;
}

function validateMessage(textarea) {
    const value = textarea.value.trim();

    if(value.length < 20) {
        showInputError(textarea, "Správa je príliš krátka, vyplňte prosím viacej info.");
        return false;
    }
    return true;
}

function validateTelNumber(telephone) {
    const value = telephone.value.trim();
    const regex = /^\d{10}$/;
    if(value === "") {
        return true;
    }
    if(!regex.test(value)) {
        showInputError(telephone, "Nesprávny formát tel. čísla");
        return false;
    };
    return true;
}

function showFormStatus(title, message, isError) {
    clearTimeout(popupTimer);
    popupMsgEl.classList.add("show");
    popupMsgTextEl.textContent = message;
    popupMsgTitleEl.textContent = title;

    if(isError) {
        popupMsgEl.classList.add("error");
        popupMsgEl.classList.remove("success");
    } else {
        popupMsgEl.classList.remove("error");
        popupMsgEl.classList.add("success");
        
        popupTimer = setTimeout(function() {
            popupMsgEl.classList.remove("show");
            popupMsgEl.classList.remove("error", "success");
        }, 3000);
    }
}

telefonEl.addEventListener("blur", function() {
    validateTelNumber(telefonEl);
});

contactFormEl.addEventListener("submit", async function(e) {
    e.preventDefault();
    clearAllErrors();

    const formData = new FormData(contactFormEl);
    const requestData = Object.fromEntries(formData);
    requestData.typPrace = formData.getAll("typPrace");

    let isMenoValid = checkEmptyInput(menoEl);
    let isPriezviskoValid = checkEmptyInput(priezviskoEl);
    let isSpravaValid = checkEmptyInput(spravaEl) && validateMessage(spravaEl);
    let isEmailValid = checkEmptyInput(emailEl) && validateEmail(emailEl);

    if(isMenoValid && isPriezviskoValid && isSpravaValid && isEmailValid) {
        submitBtnEl.disabled = true;
        try {
            const response = await fetch(e.target.action, {
                method: "POST",
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });
            if(!response.ok) {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    const errMessages = (data["errors"].map(error => error["message"]).join(", "));
                    showFormStatus("Oops!", errMessages, true);
                } else {
                    showFormStatus("Oops!","Vyskytla sa chyba. Skúste to neskôr.", true);
                }
                return;
            }
            showFormStatus("Ďakujem!","Čoskoro sa Vám ozvem.", false);
            contactFormEl.reset();
        } catch (error) {
            // needs handle server errors
            console.log(error);
            showFormStatus("Oops!", "Nepodarilo sa odoslať správu, skontrolujte prosim pripojenie!", true)
        } finally {
            submitBtnEl.disabled = false;
        }
    } else {
        console.log("Chyba pri overovaní formulára. Skontrolovať validáciu údajov!");
        const firstInvalidEl = document.querySelector(".error");
        if(firstInvalidEl) {
            firstInvalidEl.focus();
        }
    }
});

for(const input of inputsArray) {
    input.addEventListener("input", function(e) {
            clearInputError(e.target);
    });
}

devProjectsArticles.forEach(article => slideInObserver.observe(article));

