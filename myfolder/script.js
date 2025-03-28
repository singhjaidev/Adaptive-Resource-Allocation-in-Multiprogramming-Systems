document
  .getElementById("processForm")
  .addEventListener("submit", async function (event) {
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

    try {
      let response = await fetch("http://localhost:5000/add_process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(process),
      });

      let data = await response.json();
      if (response.ok) {
        alert("✅ Process Added!");
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      alert("⚠️ Failed to connect to the server.");
    }
  });

// Function to fetch and display Gantt Chart from the server
async function displayGanttChart() {
  try {
    let response = await fetch("http://localhost:5000/get_processes");
    let processList = await response.json();

    if (processList.length === 0) {
      alert("⚠️ No processes to display!");
      return;
    }

    let ganttChart = document.getElementById("ganttChart");
    ganttChart.innerHTML = "";

    processList.sort((a, b) => a.priority - b.priority);

    processList.forEach((process) => {
      let processBox = document.createElement("div");
      processBox.classList.add("process-box");
      processBox.textContent = `P${process.id}`;
      ganttChart.appendChild(processBox);
    });
  } catch (error) {
    alert("⚠️ Failed to fetch process list.");
  }
}

document
  .getElementById("startSimulation")
  .addEventListener("click", displayGanttChart);
