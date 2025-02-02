import React, { useState, useMemo } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// 📌 Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MAX_POINTS = 50; // Limit data points for performance

const InfluxDataFetcher = () => {
  const [measurement, setMeasurement] = useState("mqtt_data");
  const [timeValue, setTimeValue] = useState(3);
  const [timeUnit, setTimeUnit] = useState("mo");

  const [parsedRecords, setParsedRecords] = useState([]);
  const [usr1FlowRates, setUsr1FlowRates] = useState([]);

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:8080/api/data", {
        params: { measurement, timeValue, timeUnit },
      });

      const records = response.data; // Already parsed JSON from backend
      setParsedRecords(records);

      let flowRates = records.map(
        (record) => record?.uplink_message?.decoded_payload?.usr1_flowRate || 0
      );

      // Limit data points for better performance
      if (flowRates.length > MAX_POINTS) {
        flowRates = flowRates.slice(-MAX_POINTS);
      }

      console.log("📊 Limited usr1FlowRates:", flowRates);
      setUsr1FlowRates(flowRates);
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
  }

  // 📊 Optimize chart data using useMemo()
  const chartData = useMemo(() => ({
    labels: usr1FlowRates.map((_, index) => `Data ${index + 1}`),
    datasets: [
      {
        label: "usr1_flowRate",
        data: usr1FlowRates,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  }), [usr1FlowRates]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500, // Speed up animation
      easing: "easeOutQuad",
    },
    elements: {
      line: { tension: 0.3 },
      point: { radius: 2 },
    },
    scales: {
      y: { beginAtZero: false },
    },
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>InfluxDataFetcher</h2>

      {/* --- User Input Fields --- */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Measurement:</label>
        <input
          value={measurement}
          onChange={(e) => setMeasurement(e.target.value)}
          style={{ margin: "0 1rem 0 0.5rem" }}
        />
        <label>Value:</label>
        <select
          value={timeValue}
          onChange={(e) => setTimeValue(Number(e.target.value))}
          style={{ margin: "0 1rem 0 0.5rem" }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
        <label>Unit:</label>
        <select
          value={timeUnit}
          onChange={(e) => setTimeUnit(e.target.value)}
          style={{ margin: "0 1rem 0 0.5rem" }}
        >
          <option value="s">Seconds</option>
          <option value="m">Minutes</option>
          <option value="h">Hours</option>
          <option value="d">Days</option>
          <option value="mo">Months</option>
        </select>

        <button onClick={fetchData}>Fetch Data</button>
      </div>

      {/* 📈 Line Chart */}
      <h3>usr1_flowRate Line Chart</h3>
      <div style={{ width: "100%", maxWidth: "600px", height: "300px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default InfluxDataFetcher;
