# PlantPulse - Viva Examination Guide & Q&A
**Evaluation Review:** LWP Review 01 & Stage 2 Preparation

---

## Part 1: HTML5 & Web Fundamentals

### Q1: What semantic HTML5 elements are used in PlantPulse and why?
**Answer:** We used semantic elements like `<aside>` for sidebar navigation, `<header>` for topbar controls, `<main>` for primary module content, `<nav>` for sidebar links, and `<section>`/`<article>` for cards. Semantic HTML improves code readability, SEO ranking, and screen-reader accessibility.

### Q2: How are forms validated in Stage 1?
**Answer:** Form validation is performed client-side using JavaScript prior to DOM insertion. Inputs check for mandatory fields (`required`), valid numerical bounds for telemetry (temperature, vibration, hours), and unique Asset IDs against `store.getAssetById()`. Error messages are rendered directly beneath invalid input fields.

---

## Part 2: CSS3 & Visual Design

### Q3: How is Dark/Light theme switching implemented without external libraries?
**Answer:** We defined design tokens as CSS Variables (`:root`) on the `<html>` root element. When the user toggles the theme, JavaScript updates the `data-theme` attribute on `<html>` to `"light"` or `"dark"`, which overrides the color variables. The preference is stored in `localStorage` for persistence.

### Q4: How is responsive layout achieved in PlantPulse?
**Answer:** Using CSS Flexbox and CSS Grid along with media queries (`@media (max-width: 1024px)` and `@media (max-width: 768px)`). On smaller screens, the sidebar collapses into an icon bar or drawer, tables gain horizontal scrolling, and multi-column grid forms stack vertically.

---

## Part 3: JavaScript ES6+ & DOM Manipulation

### Q5: How does client-side CRUD work without page reloads?
**Answer:** When a user creates, edits, or deletes a record (e.g. an Asset), the action invokes a method on `PlantPulseStore` (`js/store.js`). The store updates its internal array, serializes the updated state into `localStorage`, and triggers subscriber listeners. The page controller catches the event and immediately updates the DOM table or Kanban view using innerHTML rendering without reloading the browser.

### Q6: What is the purpose of `localStorage` in Stage 1?
**Answer:** `localStorage` allows client-side data persistence across browser sessions. Since Stage 1 does not use a backend database yet, storing the serialised JSON string in `localStorage` under `plantpulse_state_v1` ensures that user-created assets or work order status changes are preserved when the page is refreshed.

### Q7: Explain the simulated Predictive Maintenance scoring algorithm.
**Answer:** The predictive health score is computed deterministically in JavaScript using:
`Health Score = 100 - (VibrationPenalty + TempPenalty + HoursPenalty + StatusPenalty)`
- Vibration values > 5.0 mm/s deduct 4.5 points per unit.
- Temperatures > 70°C deduct 1.2 points per degree.
- Hours over 5,000 deduct 1.5 points per 1,000 hours.
- Risk classification (`LOW`, `MEDIUM`, `HIGH`) is assigned based on the resulting health score.

---

## Part 4: Stage 2 Preview (PHP & MySQL)

### Q8: How will Stage 1 client-side store evolve in Stage 2?
**Answer:** In Stage 2, methods in `js/store.js` will replace local array operations with `fetch()` HTTP requests (`GET`, `POST`, `PUT`, `DELETE`) pointing to PHP scripts in `/php/`. The PHP scripts will process inputs and execute SQL queries against a MySQL database.

### Q9: What is PDO and why use prepared statements in PHP?
**Answer:** PDO (PHP Data Objects) is a database access layer in PHP. Prepared statements separate SQL logic from user input data, completely eliminating SQL Injection vulnerabilities.

### Q10: How will user sessions be handled in Stage 2?
**Answer:** Using PHP native sessions (`session_start()`). Upon successful password validation via `password_verify()`, user identity and role attributes will be stored in `$_SESSION['user_id']` and `$_SESSION['role']`.
