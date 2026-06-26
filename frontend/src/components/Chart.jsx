import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
  },
};

const Chart = ({ type = "bar", data }) => {
  if (type === "pie") return <Doughnut data={data} options={options} />;
  if (type === "line") return <Line data={data} options={options} />;
  return <Bar data={data} options={options} />;
};

export default Chart;
