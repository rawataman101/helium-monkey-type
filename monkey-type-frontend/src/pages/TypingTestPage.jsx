import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TypingTestPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [text] = useState(
    "Typing tests like this one help analyze speed and accuracy under pressure."
  );
  const [input, setInput] = useState("");
  const [timer, setTimer] = useState(15);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState(null);
  const [typingDurations, setTypingDurations] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let interval;
    if (started && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setFinished(true);
      clearInterval(interval);
      calculateStats();
    }
    return () => clearInterval(interval);
  }, [started, timer]);

  const handleTyping = (e) => {
    if (!started) setStarted(true);
    const newInput = e.target.value;
    const now = Date.now();
    setTypingDurations((prev) => [...prev, now]);
    setInput(newInput);
  };

  const calculateStats = () => {
    const correct = input.split("").filter((ch, i) => ch === text[i]).length;
    const totalErrors = input.length - correct;
    const accuracy = ((correct / input.length) * 100).toFixed(2);
    const wpm = Math.round(input.length / 5 / (15 / 60));

    const errorWords = [];
    const typedWords = input.split(" ");
    const expectedWords = text.split(" ");
    for (let i = 0; i < typedWords.length; i++) {
      if (typedWords[i] !== expectedWords[i]) {
        errorWords.push(expectedWords[i]);
      }
    }

    const durations = typingDurations.map((time, i, arr) =>
      i === 0 ? 0 : (time - arr[i - 1]) / 1000
    );

    setStats({ wpm, accuracy, totalErrors, errorWords });

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/sessions`,
        {
          wpm,
          accuracy,
          totalErrors,
          errorWords,
          typingDurations: durations,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .catch(console.error);
  };

  const handleRestart = () => {
    setInput("");
    setTimer(15);
    setStarted(false);
    setFinished(false);
    setStats(null);
    setTypingDurations([]);
    setErrors([]);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center px-4 text-black">
      <div className="w-full max-w-2xl bg-white p-7 rounded shadow-md space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Typing Test</h2>
          <button
            onClick={handleLogout}
            className="text-sm text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-700 text-sm p-4 rounded bg-gray-100 rounded hover:bg-green-500 transition-colors duration-300 ease-in-out hover:bg-green-500 pointer">
          {text}
        </p>

        <textarea
          value={input}
          onChange={handleTyping}
          disabled={finished}
          className="w-full h-32 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Start typing here..."
        />

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Time Left: {timer}s</span>
          <button
            onClick={handleRestart}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Restart
          </button>
        </div>

        {finished && stats && (
          <div className="mt-4 bg-gray-50 p-4 rounded border text-sm">
            <p>
              <strong>WPM:</strong> {stats.wpm}
            </p>
            <p>
              <strong>Accuracy:</strong> {stats.accuracy}%
            </p>
            <p>
              <strong>Total Errors:</strong> {stats.totalErrors}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingTestPage;
