// The Fisher-Yates algorith
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
//
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const arr = ["goat", "goat", "car"],
  getDOMSelectDoor = document.querySelectorAll(".container > div"),
  mode = document.getElementById("mode");
let changeWin = 0,
  notChangeWin = 0,
  changeLose = 0,
  notChangeLose = 0,
  totalGame = 0,
  openDoor,
  autoPlayMode = false;

shuffleArray(arr);

function start(selectDoor) {
  totalGame++;
  let verification = true;
  for (const key of getDOMSelectDoor.keys()) {
    if (key === selectDoor) {
      getDOMSelectDoor[key].innerHTML =
        '<img style="opacity:0.7" onclick="next(' +
        key +
        "," +
        selectDoor +
        ')" src="./assets/closed-door.png" alt="" />';
    } else {
      if (arr[key] === "goat" && verification) {
        getDOMSelectDoor[key].innerHTML =
          '<img style="cursor: none;" src="./assets/goat.png" alt="" />';
        openDoor = key;
        verification = false;
      } else {
        getDOMSelectDoor[key].innerHTML =
          '<img onclick="next(' +
          key +
          "," +
          selectDoor +
          ')" src="./assets/closed-door.png" alt="" />';
      }
    }
  }
}

function openAllDoor() {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == "goat") {
      getDOMSelectDoor[i].innerHTML =
        '<img style="cursor: none;" src="./assets/goat.png" alt="" />';
    } else {
      getDOMSelectDoor[i].innerHTML =
        '<img style="cursor: none;" src="./assets/car.png" alt="" />';
    }
  }
}
async function reset() {
  await sleep(2500);
  for (i = 0; i < getDOMSelectDoor.length; i++) {
    if (autoPlayMode !== true) {
      getDOMSelectDoor[i].innerHTML =
        '<img onclick="start(' +
        i +
        ')" src="./assets/closed-door.png" alt="" />';
    } else {
      getDOMSelectDoor[i].innerHTML =
        '<img style="cursor:none" src="./assets/closed-door.png" alt="" />';
    }
    shuffleArray(arr); //3x karıştırma :d
  }
}

async function next(secondChoice, firstChoice) {
  openAllDoor();
  if (secondChoice === firstChoice && arr[secondChoice] === "car") {
    notChangeWin++;
  } else if (secondChoice !== firstChoice && arr[secondChoice] === "car") {
    changeWin++;
  } else if (secondChoice === firstChoice && arr[secondChoice] !== "car") {
    notChangeLose++;
  } else if (secondChoice !== firstChoice && arr[secondChoice] !== "car") {
    changeLose++;
  }
  const statistics = document.querySelectorAll(
    ".statistics > table > tbody > tr:nth-child(2) > td"
  );
  if (autoPlayMode !== true) {
    if (arr[secondChoice] == "car") {
      var audio = new Audio("./assets/music/winner.mp3");
      audio.volume = 0.3;
      audio.play();
    } else {
      var audio = new Audio("./assets/music/lose.mp3");
      audio.volume = 0.3;
      audio.play();
    }
  }
  statistics[0].innerText =
    notChangeWin + "(" + ((notChangeWin / totalGame) * 100).toFixed(2) + "%)";
  statistics[1].innerText =
    changeWin + "(" + ((changeWin / totalGame) * 100).toFixed(2) + "%)";
  statistics[2].innerText =
    notChangeLose + "(" + ((notChangeLose / totalGame) * 100).toFixed(2) + "%)";
  statistics[3].innerText =
    changeLose + "(" + ((changeLose / totalGame) * 100).toFixed(2) + "%)";
  statistics[4].innerText = totalGame;
  reset();
}

var firstClick = true;

function handleClick() {
  if (firstClick) {
    var audio = new Audio("./assets/music/bg.mp3");
    audio.addEventListener("ended", function () {
      audio.currentTime = 0;
      audio.volume = 0.2;
      audio.play();
    });
    audio.volume = 0.2;
    audio.play();
    firstClick = false;
  }
}

if (autoPlayMode !== true) {
  for (let i = 0; i <= getDOMSelectDoor.length - 1; i++) {
    getDOMSelectDoor[i].removeAttribute("onclick");
  }
}

document.addEventListener("click", handleClick);

async function autoPlay(convertedNumber) {
  autoPlayMode = true;
  for (let j = 1; j <= convertedNumber; j++) {
    let randSelect = Math.floor(Math.random() * 3);
    start(randSelect);
    keyArr = [0, 1, 2];
    for (let i = keyArr.length - 1; i >= 0; i--) {
      if (keyArr[i] == randSelect || keyArr[i] == openDoor) {
        keyArr.splice(i, 1);
      }
    }
    await sleep(2);
    next(keyArr[0]);
    await sleep(1);
  }
}
function manual() {
  mode.style.display = "none";
}
async function auto() {
  mode.style.display = "none";
  let number = prompt("Kaç kez sizin yerinize oynamamı istersiniz ?");
  let convertedNumber = parseInt(number);
  if (
    !isNaN(convertedNumber) &&
    convertedNumber > 0 &&
    convertedNumber < 10000
  ) {
    await sleep(1000);
    autoPlay(convertedNumber);
  } else {
    alert("Yalnış Prompt!");
    auto();
  }
}
