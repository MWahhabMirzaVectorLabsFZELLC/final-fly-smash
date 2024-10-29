import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import diamondImg from "../assets/diamond.png";

const TaskComponent = ({ score, setScore }) => {
const websiteURL = "https://final-fly-smash.vercel.app/"; // Replace with your website URL
  const initialTasks = [
    {
      id: 1,
      description: "Collect 5 💎",
      reward: 5,
      completed: false,
      type: "daily",
    },

    {
      id: 3,
      description: "Invite a friend",
      reward: 15,
      completed: false,
 share: true, // New field to indicate share option
      type: "daily",
    },
    {
      id: 4,
      description: "Subscribe to our YouTube channel",
      reward: 20,
      completed: false,
      action: "https://www.youtube.com/@MWahhabMirza-VectorLabsF-eq8qc",
      type: "one-time",
    },
    {
      id: 5,
      description: "Join our Telegram group",
      reward: 25,
      completed: false,
      action: "https://web.telegram.org/k/#@fly_smash_bot",
      type: "one-time",
    },
    {
      id: 6,
      description: "Follow us on Facebook",
      reward: 30,
      completed: false,
      action: "https://facebook.com/yourpage",
      type: "one-time",
    },
  
  ];

 const [tasks, setTasks] = useState(initialTasks);
  const [timers, setTimers] = useState({});

  useEffect(() => {
    const storedTasks = localStorage.getItem("completedTasks");
    const storedTimers = localStorage.getItem("taskTimers");

    const completedTasks = storedTasks ? JSON.parse(storedTasks) : [];
    const taskTimers = storedTimers ? JSON.parse(storedTimers) : {};

    const updatedTasks = initialTasks.map((task) => {
      if (Array.isArray(completedTasks) && completedTasks.includes(task.id)) {
        return { ...task, completed: true };
      }
      return task;
    });

    setTasks(updatedTasks);
    setTimers(taskTimers);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = { ...timers };
      tasks.forEach((task) => {
        if (task.type === "daily" && task.completed) {
          const timeLeft = newTimers[task.id]
            ? newTimers[task.id] - Date.now()
            : null;
          if (timeLeft && timeLeft <= 0) {
            setTasks((prevTasks) =>
              prevTasks.map((t) =>
                t.id === task.id ? { ...t, completed: false } : t
              )
            );
            delete newTimers[task.id];
          }
        }
      });
      setTimers(newTimers);
      localStorage.setItem("taskTimers", JSON.stringify(newTimers));
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, tasks]);

  const handleCompleteTask = (taskId, action, share) => {
    if (action) {
      window.open(action, "_blank");
    } else if (share) {
      
      const whatsappLink = `https://api.whatsapp.com/send?text=Check%20out%20this%20amazing%20website!%20${websiteURL}`;
      const discordLink = `https://discord.com/channels/@me`;

     
      window.open(whatsappLink, "_blank");
      window.open(discordLink, "_blank");
    }

    const completedTask = tasks.find((task) => task.id === taskId);
    if (completedTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );

      setScore(score + completedTask.reward);
      const storedTasks = localStorage.getItem("completedTasks");
      const completedTasks = storedTasks ? JSON.parse(storedTasks) : [];
      if (Array.isArray(completedTasks) && !completedTasks.includes(taskId)) {
        completedTasks.push(taskId);
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
      }

      if (completedTask.type === "daily") {
        const timerEnd = Date.now() + 24 * 60 * 60 * 1000;
        setTimers((prevTimers) => ({
          ...prevTimers,
          [taskId]: timerEnd,
        }));
      }
    }
  };

  const formatTimeLeft = (endTime) => {
    const timeLeft = endTime - Date.now();
    if (timeLeft <= 0) return "0s";
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="position-fixed w-100" style={{ top: "0px", left: "0", zIndex: 1000, color: "#333", height: "90vh", boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", backdropFilter: "blur(8.8px)", WebkitBackdropFilter: "blur(8.8px)" }}>
      <div className="p-3 d-flex justify-content-between align-items-center" style={{ borderBottom: "2px solid rgba(0, 0, 0, 0.1)", backgroundColor: "#fff", boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)" }}>
        <div className="font-weight-bold text-black" style={{ fontSize: "1.5em", fontWeight: "bold" }}>Score: {score} 💎</div>
        <h2 className="text-center" style={{ color: "#333", fontWeight: "bold" }}>Tasks</h2>
      </div>
      <div className="d-flex flex-column hide-scrollbar" style={{ maxHeight: "79vh", overflowY: "scroll", padding: "10px", msOverflowStyle: "none", scrollbarWidth: "none" }}>
        <ul className="list-unstyled">
          {tasks.map((task) => (
            <li key={task.id} className={`rounded d-flex align-items-center shadow-sm ${task.completed ? "text-muted" : ""}`} style={{ padding: "20px", marginBottom: "8px", backgroundColor: task.completed ? "#f0f0f0" : "#fff", border: task.completed ? "1px solid #ddd" : "1px solid #ececec" }}>
              <div style={{ width: "63%", fontWeight: task.completed ? "400" : "600" }}>
                {task.description} - <span className="text-info mr-3">Reward: {task.reward} <img src={diamondImg} alt="Diamond Image" style={{ height: "25px", width: "25px" }} /></span>
                {task.completed && timers[task.id] ? <span className="ml-3 text-danger font-weight-bold">{formatTimeLeft(timers[task.id])} left</span> : null}
              </div>
              {!task.completed ? (
                <button className="btn btn-success" style={{ height: "50px", width: "37%", borderRadius: "8px", backgroundColor: "#28a745", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", fontWeight: "bold", color: "#fff", transition: "all 0.3s ease", padding: "8px", textAlign: "center" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#218838")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#28a745")}
                  onClick={() => handleCompleteTask(task.id, task.action, task.share)}
                >
                  Complete Task
                </button>
              ) : (
                <span className="text-success">✅ Completed</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskComponent;
