let processList = [];

document
  .getElementById("processForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let pid = document.getElementById("pid").value;
    let burstTime = parseInt(document.getElementById("burstTime").value);
    let memoryReq = parseInt(document.getElementById("memoryReq").value);
    let priority = parseInt(document.getElementById("priority").value);

    if (!pid || burstTime <= 0 || memoryReq <= 0 || priority < 0) {
      alert("❗ Please enter valid positive values for all fields.");
      return;
    }

    let process = { id: pid, burstTime, memoryReq, priority };
    processList.push(process);
    alert("✅ Process Added!");
  });
