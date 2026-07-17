// data.js — Adri's program data (joint-conscious recomposition plan)
const PROGRAM = {
  name: "Adri's Recomposition Plan",
  days: [
    {
      id: "mon", label: "Monday", title: "Upper Body",
      exercises: [
        { id: "pushup", name: "Banded Push-ups (knees or incline)", target: "Chest / Triceps", sets: 3, reps: "10–12", rest: "45s" },
        { id: "ohp", name: "Banded Overhead Press", target: "Shoulders", sets: 3, reps: "10–12", rest: "60s" },
        { id: "pullapart", name: "Band Pull-Apart", target: "Rear Delts", sets: 3, reps: "12–15", rest: "45s" },
        { id: "seatedrow", name: "Banded Seated Row", target: "Back / Biceps", sets: 3, reps: "10–12", rest: "60s" },
        { id: "curl", name: "Banded Bicep Curl", target: "Biceps", sets: 3, reps: "12–15", rest: "45s" },
        { id: "pushdown", name: "Banded Tricep Pushdown", target: "Triceps", sets: 3, reps: "12–15", rest: "45s" }
      ]
    },
    {
      id: "tue", label: "Tuesday", title: "Lower Body — Joint-Friendly",
      exercises: [
        { id: "boxsquat", name: "Box / Chair Squat", target: "Quads / Glutes", sets: 3, reps: "10–12", rest: "60s" },
        { id: "glutebridge", name: "Banded Glute Bridge", target: "Glutes / Hamstrings", sets: 3, reps: "12–15", rest: "45s" },
        { id: "legcurl", name: "Standing Banded Leg Curl", target: "Hamstrings", sets: 3, reps: "10–12/side", rest: "45s" },
        { id: "latwalk", name: "Banded Lateral Walk", target: "Hip Abductors", sets: 3, reps: "10/side", rest: "45s" },
        { id: "wallsit", name: "Wall Sit", target: "Quads (isometric)", sets: 3, secs: "20–30s", rest: "45s" },
        { id: "deadbug", name: "Dead Bug", target: "Core", sets: 3, reps: "8–10/side", rest: "45s" }
      ]
    },
    {
      id: "wed", label: "Wednesday", title: "Pedal + Mobility",
      exercises: [
        { id: "pedal1", name: "Stationary Pedal — Easy/Moderate", target: "Cardio", sets: 1, secs: "20–30 min", rest: "—" },
        { id: "mobility", name: "Mobility Flow (hip flexor, cat-cow, child's pose, knee-to-chest)", target: "Recovery", sets: 1, secs: "10–15 min", rest: "—" }
      ]
    },
    {
      id: "thu", label: "Thursday", title: "Upper Body Hypertrophy",
      exercises: [
        { id: "chestfly", name: "Banded Chest Fly", target: "Chest", sets: 3, reps: "12–15", rest: "60s" },
        { id: "facepull", name: "Banded Face Pull", target: "Rear Delts / Traps", sets: 3, reps: "15", rest: "45s" },
        { id: "latpull", name: "Banded Lat Pulldown (kneeling)", target: "Lats", sets: 3, reps: "10–12", rest: "60s" },
        { id: "latraise", name: "Banded Lateral Raise", target: "Side Delts", sets: 3, reps: "12–15", rest: "45s" },
        { id: "hammer", name: "Banded Hammer Curl", target: "Biceps", sets: 3, reps: "12–15", rest: "45s" },
        { id: "ohext", name: "Banded Overhead Tricep Ext.", target: "Triceps", sets: 3, reps: "12–15", rest: "45s" }
      ]
    },
    {
      id: "fri", label: "Friday", title: "Lower Body — Joint-Friendly Strength",
      exercises: [
        { id: "sumo", name: "Banded Sumo Squat (shallow range)", target: "Inner Thigh / Glutes", sets: 3, reps: "12–15", rest: "60s" },
        { id: "hipthrust", name: "Banded Hip Thrust (bench-supported)", target: "Glutes", sets: 3, reps: "12–15", rest: "45s" },
        { id: "goodmorning", name: "Banded Good Morning (small range)", target: "Hamstrings", sets: 3, reps: "10–12", rest: "60s" },
        { id: "calfraise", name: "Standing Banded Calf Raise", target: "Calves", sets: 3, reps: "15–20", rest: "45s" },
        { id: "woodchop", name: "Standing Banded Woodchop", target: "Obliques", sets: 3, reps: "8/side", rest: "45s" },
        { id: "plank", name: "Plank (from knees if needed)", target: "Core", sets: 3, secs: "20–30s", rest: "45s" }
      ]
    },
    {
      id: "sat", label: "Saturday", title: "Pedal — Steady State",
      exercises: [
        { id: "pedal2", name: "Stationary Pedal — Steady State", target: "Cardio", sets: 1, secs: "30–45 min", rest: "—" }
      ]
    },
    { id: "sun", label: "Sunday", title: "Rest", exercises: [] }
  ]
};

// Progression rule shown in-app
const PROGRESSION_NOTE = "Increase band weight or reps first. Only increase range of motion (deeper squat, longer hinge) after load/reps have progressed for a couple of weeks — joints adapt on a slower timeline than muscle.";
