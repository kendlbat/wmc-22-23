const toastConfig = {
    container: document.querySelector(".toast-container"),
    autoClose: 5000,
    autoRemove: 500
};

const toastTypes = {
    success: {
        img: "/assets/toastTypes/success.svg",
        headline: "Success"
    },
    error: {
        img: "/assets/toastTypes/error.svg",
        headline: "Error"
    },
    warning: {
        img: "/assets/toastTypes/warning.svg",
        headline: "Warning"
    },
    info: {
        img: "/assets/toastTypes/info.svg",
        headline: "Info"
    }
}

const createToast = (type, message) => {
    const toast = document.createElement("div");
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    toast.classList.add("toast");
    toast.classList.add("fade");
    toast.classList.add("show");

    // get current time in format hh:mm
    const now = new Date();
    const hh = now.getHours();
    const mm = now.getMinutes();
    const time = `${hh < 10 ? "0" + hh : hh}:${mm < 10 ? "0" + mm : mm}`;

    toast.innerHTML = `
        <div class="toast-header">
            <img src="${type?.img}" class="feather feather-file-text align-text-bottom me-1" />
            <strong class="me-auto">${type?.headline}</strong>
            <small>${time}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>`;

    toast.timeoutId = setTimeout(() => removeToast(toast), toastConfig.autoClose);
    toastConfig.container.prepend(toast);
}

const removeToast = (toast) => {
    toast.classList.remove("show");
    clearTimeout(toast.timeoutId);
    setTimeout(() => toast.remove(), toastConfig.autoRemove);
}

// createToast(toastTypes.success, "Toastify is awesome!");