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

// Function to display Gantt Chart
function displayGanttChart() {
  let ganttChart = document.getElementById("ganttChart");
  ganttChart.innerHTML = "";
  
  processList.sort((a, b) => a.priority - b.priority);
  
  processList.forEach((process) => {
    let processBox = document.createElement("div");
    processBox.classList.add("process-box");
    processBox.textContent = `P${process.id}`;
    ganttChart.appendChild(processBox);
  });
}

document
  .getElementById("startSimulation")
  .addEventListener("click", function () {
    if (processList.length === 0) {
      alert("⚠️ No processes to simulate!");
      return;
    }
    displayGanttChart();
  });
