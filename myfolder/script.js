let processList = [];

// Handle process form submission
document
  .getElementById("processForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let pid = document.getElementById("pid").value;
    let burstTime = parseInt(document.getElementById("burstTime").value);
    let memoryReq = parseInt(document.getElementById("memoryReq").value);
    let priority = parseInt(document.getElementById("priority").value);

    if (!pid || burstTime <= 0 || memoryReq <= 0 || priority < 0) {
      showNotification(
        "❗ Please enter valid positive values for all fields.",
        "error"
      );
      return;
    }

    let process = { id: pid, burstTime, memoryReq, priority };
    processList.push(process);
    showNotification("✅ Process Added Successfully!", "success");
    resetForm();
    updateProcessCount();
    updatePlaceholder();
  });

// Handle simulation start
document
  .getElementById("startSimulation")
  .addEventListener("click", function () {
    if (processList.length === 0) {
      showNotification(
        "⚠️ Please add at least one process before starting simulation.",
        "warning"
      );
      return;
    }

    const button = this;
    button.disabled = true;
    const originalContent = button.innerHTML;
    button.innerHTML = `
    <div class="btn-content">
      <span class="btn-icon">⏳</span>
      Simulating...
    </div>
    <div class="btn-glow"></div>
  `;

    fetch("http://127.0.0.1:5000/processes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(processList),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("❗ Server responded with status " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Execution Order:", data.executionOrder);
        visualizeExecution(data.executionOrder);
        updateCharts(data.executionOrder);
        showNotification("✅ Simulation completed successfully!", "success");
      })
      .catch((error) => {
        console.error("Error fetching execution data:", error);
        showNotification(
          "⚠️ Could not connect to server. Please make sure the Flask server is running.\n\nError: " +
            error.message,
          "error"
        );
      })
      .finally(() => {
        button.disabled = false;
        button.innerHTML = originalContent;
      });
  });

// Function to visualize execution order (Gantt Chart)
function visualizeExecution(executionOrder) {
  let ganttChart = document.getElementById("ganttChart");
  ganttChart.innerHTML = "";

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "1rem";
  ganttChart.appendChild(container);

  executionOrder.forEach((proc, index) => {
    setTimeout(() => {
      let box = document.createElement("div");
      box.classList.add("process-box");
      box.innerHTML = `
        <div class="process-content">
          P${proc.id}
        </div>
      `;
      box.title = `Process ${proc.id}\nCPU: ${proc.allocatedCPU}%\nMemory: ${proc.allocatedMemory}MB`;

      // Add animation class
      box.style.opacity = "0";
      box.style.transform = "translateY(20px) scale(0.95)";
      container.appendChild(box);

      // Trigger animation
      requestAnimationFrame(() => {
        box.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        box.style.opacity = "1";
        box.style.transform = "translateY(0) scale(1)";
      });
    }, index * 200);
  });
}

// Function to update CPU & Memory Charts
function updateCharts(executionOrder) {
  let cpuUsage = executionOrder.map((proc) => proc.allocatedCPU);
  let memoryUsage = executionOrder.map((proc) => proc.allocatedMemory);
  let labels = executionOrder.map((proc) => "P" + proc.id);

  const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 20,
          color: "rgba(248, 250, 252, 0.8)",
          font: {
            size: 12,
            weight: "500",
            family: "Manrope",
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(248, 250, 252, 0.6)",
          font: {
            size: 11,
            family: "Manrope",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(248, 250, 252, 0.6)",
          font: {
            size: 11,
            family: "Manrope",
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeOutQuart",
    },
  };

  new Chart(document.getElementById("cpuChart").getContext("2d"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "CPU Utilization (%)",
          data: cpuUsage,
          borderColor: "#6d28d9",
          backgroundColor: "rgba(109, 40, 217, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#5b21b6",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: chartConfig,
  });

  new Chart(document.getElementById("memoryChart").getContext("2d"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Memory Allocation (MB)",
          data: memoryUsage,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#1d4ed8",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: chartConfig,
  });
}

// Helper Functions
function showNotification(message, type) {
  alert(message); // Using alert for simplicity
}

function resetForm() {
  document.getElementById("processForm").reset();
}

function updateProcessCount() {
  const badge = document.querySelector(".badge");
  if (badge) {
    badge.textContent = `${processList.length} Process${
      processList.length !== 1 ? "es" : ""
    } Configured`;
  }
}

function updatePlaceholder() {
  const ganttChart = document.getElementById("ganttChart");
  if (processList.length === 0) {
    ganttChart.innerHTML = `
      <div class="timeline-placeholder">
        <div class="placeholder-text">Awaiting Process Data</div>
        <div class="placeholder-animation">
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
        </div>
      </div>
    `;
  }
}

// Initialize placeholder
updatePlaceholder();
