export const hideElement = () => {
    const el = document.querySelector("warning");
    if (el) el.parentElement.removeChild(el);
};

export const showAlert = (msg) => {
    const markup = `<div class="warning"><p>You need to login first!!</p></div>`;
    document
        .querySelector(".overview-container")
        .insertAdjacentElement("afterbegin", markup);
    window.setTimeout(hideElement, 3000);
};
