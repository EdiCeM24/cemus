const ctx = document.getElementById("myChart");

new Chart(ctx, {
  type: "line",
  data: data,
  // data: {
  //   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //   datasets: [
  //     {
  //       label: "# of Votes",
  //       data: [12, 19, 3, 5, 2, 3],
  //       borderWidth: 1,
  //     },
  //   ],
  // },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

//
//
document.addEventListener("DOMContentLoaded", () => {
  // 1. Revenue Line Chart Configuration
  const ctxRevenue = document.getElementById("revenueChart").getContext("2d");
  new Chart(ctxRevenue, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Monthly Revenue ($)",
          data: serverRevenue,
          borderColor: "#4f46e5", // Tailwind indigo-600
          backgroundColor: "rgba(79, 70, 229, 0.05)",
          fill: true,
          tension: 0.35, // Smooth curves
          borderWidth: 3,
          pointRadius: 2,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }, // Text descriptors handled in HTML UI
        tooltip: { padding: 12, cornerRadius: 8 },
      },
      scales: {
        y: {
          grid: { color: "#f1f5f9" }, // Tailwind slate-100
          ticks: {
            color: "#64748b", // Tailwind slate-500
            callback: (value) => "$" + value.toLocaleString(),
          },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#64748b" },
        },
      },
    },
  });

  // 2. Traffic Acquisition Doughnut Chart Configuration
  const ctxTraffic = document.getElementById("trafficChart").getContext("2d");
  new Chart(ctxTraffic, {
    type: "doughnut",
    data: {
      labels: ["Direct", "Organic Search", "Referrals"],
      datasets: [
        {
          data: serverTraffic,
          backgroundColor: [
            "#4f46e5", // Indigo-600
            "#0ea5e9", // Sky-500
            "#f59e0b", // Amber-500
          ],
          borderWidth: 4,
          borderColor: "#ffffff",
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 12, padding: 20, color: "#475569" },
        },
        tooltip: { padding: 12, cornerRadius: 8 },
      },
    },
  });
});
