// get elements from the DOM
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const waterList = document.getElementById("waterList");
const zeroList = document.getElementById("zeroList");
const powerList = document.getElementById("powerList");
const waterLabel = document.getElementById("waterLabel");
const zeroLabel = document.getElementById("zeroLabel");
const powerLabel = document.getElementById("powerLabel");

// track attendance
let count = 0;
const maxCount = 50;
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
let goalReached = false;

// function to show celebration when goal is reached
function showCelebration() {
  const waterCount = parseInt(
    document.getElementById("waterCount").textContent,
  );
  const zeroCount = parseInt(document.getElementById("zeroCount").textContent);
  const powerCount = parseInt(
    document.getElementById("powerCount").textContent,
  );

  const maxTeamCount = Math.max(waterCount, zeroCount, powerCount);

  const winningTeams = [];
  if (waterCount === maxTeamCount) {
    winningTeams.push("Team Water Wise");
  }
  if (zeroCount === maxTeamCount) {
    winningTeams.push("Team Net Zero");
  }
  if (powerCount === maxTeamCount) {
    winningTeams.push("Team Renewables");
  }

  const teamNames = winningTeams.join(" and ");
  const celebrationMessage = `🎉 Goal Reached! Congratulations to ${teamNames}! 🎉`;

  greeting.textContent = celebrationMessage;
  greeting.classList.remove("success-message");
  greeting.classList.add("celebration-message");
  greeting.style.display = "block";
}

// handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // get values from the form
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.options[teamSelect.selectedIndex].text;
  console.log(name, team, teamName);

  // increment attendance
  count++;
  console.log("Total check-ins: " + count);

  // update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  attendeeCount.textContent = count;
  progressBar.style.width = percentage;
  console.log("Progress: " + percentage);

  // update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // add name to the team list
  const listItem = document.createElement("li");
  listItem.textContent = name;
  if (team === "water") {
    waterList.appendChild(listItem);
    waterLabel.style.display = "block";
  }
  if (team === "zero") {
    zeroList.appendChild(listItem);
    zeroLabel.style.display = "block";
  }
  if (team === "power") {
    powerList.appendChild(listItem);
    powerLabel.style.display = "block";
  }

  // show welcome message only if goal hasn't been reached
  if (!goalReached) {
    const message = `Welcome, ${name} from ${teamName}!`;
    greeting.textContent = message;
    greeting.classList.add("success-message");
    greeting.style.display = "block";
  }

  // check if goal is reached
  if (count === maxCount) {
    goalReached = true;
    showCelebration();
  }

  form.reset();
  saveProgress();
});

// function to save data to localStorage
function saveProgress() {
  const data = {
    count: count,
    goalReached: goalReached,
    waterCount: document.getElementById("waterCount").textContent,
    zeroCount: document.getElementById("zeroCount").textContent,
    powerCount: document.getElementById("powerCount").textContent,
    waterAttendees: Array.from(waterList.querySelectorAll("li")).map(
      function (li) {
        return li.textContent;
      },
    ),
    zeroAttendees: Array.from(zeroList.querySelectorAll("li")).map(
      function (li) {
        return li.textContent;
      },
    ),
    powerAttendees: Array.from(powerList.querySelectorAll("li")).map(
      function (li) {
        return li.textContent;
      },
    ),
  };
  localStorage.setItem("checkInData", JSON.stringify(data));
}

// function to load data from localStorage
function loadProgress() {
  const saved = localStorage.getItem("checkInData");
  if (saved) {
    const data = JSON.parse(saved);
    count = data.count;

    // restore count display
    attendeeCount.textContent = count;
    const percentage = Math.round((count / maxCount) * 100) + "%";
    progressBar.style.width = percentage;

    // restore team counters
    document.getElementById("waterCount").textContent = data.waterCount;
    document.getElementById("zeroCount").textContent = data.zeroCount;
    document.getElementById("powerCount").textContent = data.powerCount;

    // restore water team
    if (data.waterAttendees.length > 0) {
      data.waterAttendees.forEach(function (name) {
        const listItem = document.createElement("li");
        listItem.textContent = name;
        waterList.appendChild(listItem);
      });
      waterLabel.style.display = "block";
    }

    // restore zero team
    if (data.zeroAttendees.length > 0) {
      data.zeroAttendees.forEach(function (name) {
        const listItem = document.createElement("li");
        listItem.textContent = name;
        zeroList.appendChild(listItem);
      });
      zeroLabel.style.display = "block";
    }

    // restore power team
    if (data.powerAttendees.length > 0) {
      data.powerAttendees.forEach(function (name) {
        const listItem = document.createElement("li");
        listItem.textContent = name;
        powerList.appendChild(listItem);
      });
      powerLabel.style.display = "block";
    }

    // restore goalReached state and show celebration if needed
    if (data.goalReached) {
      goalReached = true;
      showCelebration();
    }
  }
}
