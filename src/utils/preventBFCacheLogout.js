// src/utils/preventBFCacheLogout.js
export const preventBFCacheLogout = () => {
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      const hasToken =
        localStorage.getItem("e_access_token") ||
        sessionStorage.getItem("e_access_token") ||
        document.cookie.includes("e_access_token");

      if (!hasToken) {
        localStorage.clear();
        sessionStorage.clear();

        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });

        window.location.href = "/signin";
      }
    }
  });
};
