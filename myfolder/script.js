let processList = [];
let cpuChart, memoryChart;

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
  updateCharts();
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

// Initialize Charts
function initializeCharts() {
  const ctxCPU = document.getElementById("cpuChart").getContext("2d");
  const ctxMemory = document.getElementById("memoryChart").getContext("2d");

  cpuChart = new Chart(ctxCPU, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{ label: "CPU Usage", data: [], backgroundColor: "blue" }],
    },
    options: { responsive: true },
  });

  memoryChart = new Chart(ctxMemory, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{ label: "Memory Usage", data: [], backgroundColor: "green" }],
    },
    options: { responsive: true },
  });
}

// Update Charts with process data
function updateCharts() {
  cpuChart.data.labels = processList.map((p) => `P${p.id}`);
  cpuChart.data.datasets[0].data = processList.map((p) => p.burstTime);
  cpuChart.update();

  memoryChart.data.labels = processList.map((p) => `P${p.id}`);
  memoryChart.data.datasets[0].data = processList.map((p) => p.memoryReq);
  memoryChart.update();
}

document.addEventListener("DOMContentLoaded", initializeCharts);
