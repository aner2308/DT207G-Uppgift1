"use strict";

const errorMsgEl = document.getElementById("errorMsg");
const courseFormEl = document.getElementById("courseForm");

courseFormEl.addEventListener("submit", function(event) {
  const courseCodeEl = document.getElementById("courseCode").value;
  const courseNameEl = document.getElementById("courseName").value;
  const courseUrlEl = document.getElementById("courseUrl").value;

  if (!courseCodeEl.trim() || !courseNameEl.trim() || !courseUrlEl.trim()) {
    errorMsgEl.innerText = "*Vänligen fyll i alla obligatoriska fält.";
    event.preventDefault(); // Förhindra att formuläret skickas om fälten inte är ifyllda korrekt
  } else {
    errorMsgEl.innerText = ""; // Töm felmeddelandet om alla fält är ifyllda korrekt
  }
});