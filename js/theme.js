/* ==========================================================================
   PLANTPULSE - Centralized Theme Management API
   Provides a single authoritative source of truth for theme preference (light/dark),
   localStorage persistence, icon updates, and flash-free theme switching.
   ========================================================================== */

const PlantPulseTheme = {
    STORAGE_KEY: "plantpulse_theme",

    // Read current theme state
    getTheme() {
        return localStorage.getItem(this.STORAGE_KEY) || "dark";
    },

    // Set theme and apply globally
    setTheme(theme) {
        const validTheme = (theme === "light" || theme === "dark") ? theme : "dark";
        document.documentElement.setAttribute("data-theme", validTheme);
        localStorage.setItem(this.STORAGE_KEY, validTheme);
        this.updateUI(validTheme);
    },

    // Toggle between light and dark modes
    toggleTheme() {
        const current = this.getTheme();
        const next = current === "dark" ? "light" : "dark";
        
        // Enable theme transition class briefly for intentional user toggles
        document.documentElement.classList.add("theme-transitioning");
        this.setTheme(next);

        setTimeout(() => {
            document.documentElement.classList.remove("theme-transitioning");
        }, 300);

        if (typeof PlantPulseApp !== "undefined" && PlantPulseApp.showToast) {
            PlantPulseApp.showToast("Theme Switched", `Interface set to ${next.toUpperCase()} mode`, "info");
        }

        return next;
    },

    // Update icons and accessible ARIA attributes across all toggle buttons
    updateUI(theme) {
        const buttons = document.querySelectorAll("#themeToggleBtn, .theme-toggle-trigger");
        buttons.forEach(btn => {
            const icon = btn.querySelector("i");
            if (icon) {
                icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
            }
            const label = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
            btn.setAttribute("aria-label", label);
            btn.setAttribute("title", label);
        });
    },

    // Initialize UI elements once DOM is ready
    init() {
        const current = this.getTheme();
        document.documentElement.setAttribute("data-theme", current);
        this.updateUI(current);

        const buttons = document.querySelectorAll("#themeToggleBtn, .theme-toggle-trigger");
        buttons.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                this.toggleTheme();
            };
        });
    }
};

// Immediate early execution fallback if loaded synchronously
(function() {
    var theme = localStorage.getItem("plantpulse_theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
})();
