const cellElements1 = document.querySelectorAll("[data-cell-1]");
const cellElements2 = document.querySelectorAll("[data-cell-2]");
const cellElements3 = document.querySelectorAll("[data-cell-3]");
const cellElements4 = document.querySelectorAll("[data-cell-4]");
const cellElements5 = document.querySelectorAll("[data-cell-5]");
const cellElements6 = document.querySelectorAll("[data-cell-6]");
const cellElements7 = document.querySelectorAll("[data-cell-7]");
const cellElements8 = document.querySelectorAll("[data-cell-8]");
const cellElements9 = document.querySelectorAll("[data-cell-9]");
const cellElements = [
  cellElements1,
  cellElements2,
  cellElements3,
  cellElements4,
  cellElements5,
  cellElements6,
  cellElements7,
  cellElements8,
  cellElements9,
];
const winnings = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const bigElements = [
  "empty-1",
  "empty-2",
  "empty-3",
  "empty-4",
  "empty-5",
  "empty-6",
  "empty-7",
  "empty-8",
  "empty-9",
];
const bigElementsSelector = document.querySelector("empty-1");
const x_class = "x";
const circle_class = "circle";
const restartButton = document.getElementById("restartButton");
const winningMessage = document.querySelector("[data-winning-message-text]");
const winningElement = document.getElementById("winning-message");
let img = document.createElement("img");
let circleTurn = false;
let circleWins = 0;
let xWins = 0;

restartButton.addEventListener("click", startGame);

// On restart: Reboots the game by resetting variables

function startGame() {
  circleTurn = false;
  cellElements.forEach((cellGroup) => {
    cellGroup.forEach((cell) => {
      cellId = cell.id;
      cell.classList.remove("x");
      cell.classList.remove("circle");
      document.getElementById(cellId).innerHTML = "<img src=''>";
      cell.removeEventListener("click", handleClick);
      cell.removeEventListener("mouseenter", handleHover);
      cell.removeEventListener("mouseleave", handleOut);
      cell.addEventListener("mouseenter", handleHover);
      cell.addEventListener("mouseleave", handleOut);
      cell.addEventListener("click", handleClick, { once: true });
    });
  });
  winningElement.classList.remove("show");
  for (let i = 1; i <= 9; i++) {
    const elementId = `empty-${i}`;
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove("hugeblock");
      element.classList.remove("x");
      element.classList.remove("circle");
      document.getElementById(elementId).innerHTML = "<img src=''>";
    }
  }
}

// Assigns IDs and event listeners to cells

let idCounter = 1;

cellElements.forEach((cellGroup) => {
  cellGroup.forEach((cell) => {
    // Assign an ID to each cell in reading order
    cell.id = idCounter++;

    cell.addEventListener("mouseenter", handleHover);
    cell.addEventListener("mouseleave", handleOut);
    cell.addEventListener("click", handleClick, { once: true });
  });
});

// Removes a hover image when moving mouse off

function handleOut(e) {
  const cell = e.target.id;
  const cell2 = e.target;
  if (!cell2.classList.contains("x") || !cell2.classList.contains("circle")) {
    document.getElementById(cell).innerHTML = "<img src=''>";
  }
}

// Handles the hover effect

function handleHover(e) {
  const cell = e.target.id;
  const cell2 = e.target;
  if (circleTurn) {
    img.src = "circle.png";
    document.getElementById(cell).innerHTML = "<img src='circle.png'>";
    // cell.appendChild(img);
  } else {
    img.src = "x.png";
    // cell.appendChild(img);
    document.getElementById(cell).innerHTML = "<img src='x.png'>";
  }
}

// Performs functions on click

function handleClick(e) {
  const cell = e.target.closest("[id]");
  const cellId = +cell.id;
  const currentClass = circleTurn ? circle_class : x_class;
  placeMark(cell, cellId, currentClass);
  if (checkSmallWin(cellId, currentClass)) {
    placeBigMark(cellId, true);
  }
  if (isSmallDraw(cellId, cell)) {
    placeBigMark(cellId, false);
  }
  blockAreas(cellId);
  if (checkWin(currentClass)) {
    console.log("win");
    endGame(false);
  }
  if (isDraw()) {
    endGame(true);
  }
  swapTurns();
}

// Ends the game if three in a row is detected

function endGame(draw) {
  if (draw) {
    winningMessage.innerText = "Draw!";
  } else {
    winningMessage.innerText = `${circleTurn ? "O" : "X"} Wins!`;
    if (circleTurn == false) {
      console.log("yes");
      xWins++;
      document.getElementById("xwin").innerHTML = `X Wins: ${xWins}`;
    } else {
      console.log("no");
      circleWins++;
      document.getElementById("circlewin").innerHTML = `O Wins: ${circleWins}`;
    }
  }
  winningElement.classList.add("show");
}

// Places a mark on the cell target

function placeMark(cell, cellId, currentClass) {
  if (currentClass == circle_class) {
    // I add classes so checkWin functions can work (i don't know an alternative way)
    document.getElementById(cellId).classList.add("circle");
    img.src = "circle.png";
    document.getElementById(cellId).innerHTML = "<img src='circle.png'>";
    // need to remove event listeners so it doesn't bug out
    cell.removeEventListener("mouseenter", handleHover);
    cell.removeEventListener("mouseleave", handleOut);
  } else {
    document.getElementById(cellId).classList.add("x");
    img.src = "x.png";
    document.getElementById(cellId).innerHTML = "<img src='x.png'>";
    cell.removeEventListener("mouseenter", handleHover);
    cell.removeEventListener("mouseleave", handleOut);
  }
}

// Places a big mark and blocks off the area permanently

function placeBigMark(cellId, draw) {
  if (cellId <= 9) {
    document.getElementById("empty-1").classList.remove("hugeblock");
    document.getElementById("empty-1").classList.add("hugeblock");
    if (draw) {
      if (circleTurn == false) {
        document.getElementById("empty-1").classList.add("x");
        document.getElementById("empty-1").innerHTML =
          "<img src='x.png' width='190px'>";
      } else {
        document.getElementById("empty-1").classList.add("circle");
        document.getElementById("empty-1").innerHTML =
          "<img src='circle.png' width='190px'>";
      }
    } else {
      document.getElementById("empty-1").classList.add("draw");
    }
  } else if (cellId <= 18) {
    document.getElementById("empty-2").classList.remove("hugeblock");
    document.getElementById("empty-2").classList.add("hugeblock");
    if (draw) {
      if (circleTurn == false) {
        document.getElementById("empty-2").classList.add("x");
        document.getElementById("empty-2").innerHTML =
          "<img src='x.png' width='190px'>";
      } else {
        document.getElementById("empty-2").classList.add("circle");
        document.getElementById("empty-2").innerHTML =
          "<img src='circle.png' width='190px'>";
      }
    } else {
      document.getElementById("empty-2").classList.add("draw");
    }
  } else if (cellId <= 27) {
    document.getElementById("empty-3").classList.remove("hugeblock");
    document.getElementById("empty-3").classList.add("hugeblock");
    if (draw) {
      if (circleTurn == false) {
        document.getElementById("empty-3").classList.add("x");
        document.getElementById("empty-3").innerHTML =
          "<img src='x.png' width='190px'>";
      } else {
        document.getElementById("empty-3").classList.add("circle");
        document.getElementById("empty-3").innerHTML =
          "<img src='circle.png' width='190px'>";
      }
    } else {
      document.getElementById("empty-3").classList.add("draw");
    }
  } else if (cellId <= 36) {
    document.getElementById("empty-4").classList.remove("hugeblock");
    document.getElementById("empty-4").classList.add("hugeblock");
    if (draw) {
      if (circleTurn == false) {
        document.getElementById("empty-4").classList.add("x");
        document.getElementById("empty-4").innerHTML =
          "<img src='x.png' width='190px'>";
      } else {
        document.getElementById("empty-4").classList.add("circle");
        document.getElementById("empty-4").innerHTML =
          "<img src='circle.png' width='190px'>";
      }
    } else {
      document.getElementById("empty-4").classList.add("draw");
    }
  } else if (cellId <= 45) {
    document.getElementById("empty-5").classList.remove("hugeblock");
    document.getElementById("empty-5").classList.add("hugeblock");
    if (draw) {
      if (circleTurn == false) {
        document.getElementById("empty-5").classList.add("x");
        document.getElementById("empty-5").innerHTML =
          "<img src='x.png' width='190px'>";
      } else {
        document.getElementById("empty-5").classList.add("circle");
        document.getElementById("empty-5").innerHTML =
          "<img src='circle.png' width='190px'>";
      }
    } else {
      document.getElementById("empty-5").classList.add("draw");
    }
  } else if (cellId <= 54) {
    document.getElementById("empty-6").classList.remove("hugeblock");
    document.getElementById("empty-6").classList.add("hugeblock");
    if (draw) {
      if (circleTurn == false) {
        document.getElementById("empty-6").classList.add("x");
        document.getElementById("empty-6").innerHTML =
          "<img src='x.png' width='190px'>";
      } else {
        document.getElementById("empty-6").classList.add("circle");
        document.getElementById("empty-6").innerHTML =
          "<img src='circle.png' width='190px'>";
      }
    } else {
      document.getElementById("empty-6").classList.add("draw");
    }
  } else if (cellId <= 63) {
    document.getElementById("empty-7").classList.remove("hugeblock");
    document.getElementById("empty-7").classList.add("hugeblock");
    if (draw) {
      if (circleTurn == false) {
        document.getElementById("empty-7").classList.add("x");
        document.getElementById("empty-7").innerHTML =
          "<img src='x.png' width='190px'>";
      } else {
        document.getElementById("empty-7").classList.add("circle");
        document.getElementById("empty-7").innerHTML =
          "<img src='circle.png' width='190px'>";
      }
    } else {
      document.getElementById("empty-7").classList.add("draw");
    }
  } else if (cellId <= 72) {
    document.getElementById("empty-8").classList.remove("hugeblock");
    document.getElementById("empty-8").classList.add("hugeblock");
    if (draw) {
      if (circleTurn == false) {
        document.getElementById("empty-8").classList.add("x");
        document.getElementById("empty-8").innerHTML =
          "<img src='x.png' width='190px'>";
      } else {
        document.getElementById("empty-8").classList.add("circle");
        document.getElementById("empty-8").innerHTML =
          "<img src='circle.png' width='190px'>";
      }
    } else {
      document.getElementById("empty-8").classList.add("draw");
    }
  } else if (cellId <= 81) {
    document.getElementById("empty-9").classList.remove("hugeblock");
    document.getElementById("empty-9").classList.add("hugeblock");
    if (draw) {
      if (circleTurn == false) {
        document.getElementById("empty-9").classList.add("x");
        document.getElementById("empty-9").innerHTML =
          "<img src='x.png' width='190px'>";
      } else {
        document.getElementById("empty-9").classList.add("circle");
        document.getElementById("empty-9").innerHTML =
          "<img src='circle.png' width='190px'>";
      }
    } else {
      document.getElementById("empty-9").classList.add("draw");
    }
  }
}

// Blocks areas when a mark is placed

// NOTE FOR TMR: FIX THE ISSUE REGARDING THE WIN CLASS NOT PROPERLY DELETING ALL HUGEBOXES

function blockAreas(cellId) {
  if (
    cellId == 1 ||
    cellId == 10 ||
    cellId == 19 ||
    cellId == 28 ||
    cellId == 37 ||
    cellId == 46 ||
    cellId == 55 ||
    cellId == 64 ||
    cellId == 73
  ) {
    if (
      document.getElementById("empty-1").classList.contains("x") ||
      document.getElementById("empty-1").classList.contains("circle") ||
      document.getElementById("empty-1").classList.contains("draw")
    ) {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.remove("hugeblock");
          if (
            document.getElementById(elementId).classList.contains("x") ||
            document.getElementById(elementId).classList.contains("circle") ||
            document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          if (
            !document.getElementById(elementId).classList.contains("x") &&
            !document.getElementById(elementId).classList.contains("circle") &&
            !document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
      document.getElementById("empty-1").classList.remove("hugeblock");
    }
  } else if (
    cellId == 2 ||
    cellId == 11 ||
    cellId == 20 ||
    cellId == 29 ||
    cellId == 38 ||
    cellId == 47 ||
    cellId == 56 ||
    cellId == 65 ||
    cellId == 74
  ) {
    if (
      document.getElementById("empty-2").classList.contains("x") ||
      document.getElementById("empty-2").classList.contains("circle") ||
      document.getElementById("empty-2").classList.contains("draw")
    ) {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.remove("hugeblock");
          if (
            document.getElementById(elementId).classList.contains("x") ||
            document.getElementById(elementId).classList.contains("circle") ||
            document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          if (
            !document.getElementById(elementId).classList.contains("x") &&
            !document.getElementById(elementId).classList.contains("circle") &&
            !document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
      document.getElementById("empty-2").classList.remove("hugeblock");
    }
  } else if (
    cellId == 3 ||
    cellId == 12 ||
    cellId == 21 ||
    cellId == 30 ||
    cellId == 39 ||
    cellId == 48 ||
    cellId == 57 ||
    cellId == 66 ||
    cellId == 75
  ) {
    if (
      document.getElementById("empty-3").classList.contains("x") ||
      document.getElementById("empty-3").classList.contains("circle") ||
      document.getElementById("empty-3").classList.contains("draw")
    ) {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.remove("hugeblock");
          if (
            document.getElementById(elementId).classList.contains("x") ||
            document.getElementById(elementId).classList.contains("circle") ||
            document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          if (
            !document.getElementById(elementId).classList.contains("x") &&
            !document.getElementById(elementId).classList.contains("circle") &&
            !document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
      document.getElementById("empty-3").classList.remove("hugeblock");
    }
  } else if (
    cellId == 4 ||
    cellId == 13 ||
    cellId == 22 ||
    cellId == 31 ||
    cellId == 40 ||
    cellId == 49 ||
    cellId == 58 ||
    cellId == 67 ||
    cellId == 76
  ) {
    if (
      document.getElementById("empty-4").classList.contains("x") ||
      document.getElementById("empty-4").classList.contains("circle") ||
      document.getElementById("empty-4").classList.contains("draw")
    ) {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.remove("hugeblock");
          if (
            document.getElementById(elementId).classList.contains("x") ||
            document.getElementById(elementId).classList.contains("circle") ||
            document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          if (
            !document.getElementById(elementId).classList.contains("x") &&
            !document.getElementById(elementId).classList.contains("circle") &&
            !document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
      document.getElementById("empty-4").classList.remove("hugeblock");
    }
  } else if (
    cellId == 5 ||
    cellId == 14 ||
    cellId == 23 ||
    cellId == 32 ||
    cellId == 41 ||
    cellId == 50 ||
    cellId == 59 ||
    cellId == 68 ||
    cellId == 77
  ) {
    if (
      document.getElementById("empty-5").classList.contains("x") ||
      document.getElementById("empty-5").classList.contains("circle") ||
      document.getElementById("empty-5").classList.contains("draw")
    ) {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.remove("hugeblock");
          if (
            document.getElementById(elementId).classList.contains("x") ||
            document.getElementById(elementId).classList.contains("circle") ||
            document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          if (
            !document.getElementById(elementId).classList.contains("x") &&
            !document.getElementById(elementId).classList.contains("circle") &&
            !document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
      document.getElementById("empty-5").classList.remove("hugeblock");
    }
  } else if (
    cellId == 6 ||
    cellId == 15 ||
    cellId == 24 ||
    cellId == 33 ||
    cellId == 42 ||
    cellId == 51 ||
    cellId == 60 ||
    cellId == 69 ||
    cellId == 78
  ) {
    if (
      document.getElementById("empty-6").classList.contains("x") ||
      document.getElementById("empty-6").classList.contains("circle") ||
      document.getElementById("empty-6").classList.contains("draw")
    ) {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.remove("hugeblock");
          if (
            document.getElementById(elementId).classList.contains("x") ||
            document.getElementById(elementId).classList.contains("circle") ||
            document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          if (
            !document.getElementById(elementId).classList.contains("x") &&
            !document.getElementById(elementId).classList.contains("circle") &&
            !document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
      document.getElementById("empty-6").classList.remove("hugeblock");
    }
  } else if (
    cellId == 7 ||
    cellId == 16 ||
    cellId == 25 ||
    cellId == 34 ||
    cellId == 43 ||
    cellId == 52 ||
    cellId == 61 ||
    cellId == 70 ||
    cellId == 79
  ) {
    if (
      document.getElementById("empty-7").classList.contains("x") ||
      document.getElementById("empty-7").classList.contains("circle") ||
      document.getElementById("empty-7").classList.contains("draw")
    ) {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.remove("hugeblock");
          if (
            document.getElementById(elementId).classList.contains("x") ||
            document.getElementById(elementId).classList.contains("circle") ||
            document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          if (
            !document.getElementById(elementId).classList.contains("x") &&
            !document.getElementById(elementId).classList.contains("circle") &&
            !document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
      document.getElementById("empty-7").classList.remove("hugeblock");
    }
  } else if (
    cellId == 8 ||
    cellId == 17 ||
    cellId == 26 ||
    cellId == 35 ||
    cellId == 44 ||
    cellId == 53 ||
    cellId == 62 ||
    cellId == 71 ||
    cellId == 80
  ) {
    if (
      document.getElementById("empty-8").classList.contains("x") ||
      document.getElementById("empty-8").classList.contains("circle") ||
      document.getElementById("empty-8").classList.contains("draw")
    ) {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.remove("hugeblock");
          if (
            document.getElementById(elementId).classList.contains("x") ||
            document.getElementById(elementId).classList.contains("circle") ||
            document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          if (
            !document.getElementById(elementId).classList.contains("x") &&
            !document.getElementById(elementId).classList.contains("circle") &&
            !document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
      document.getElementById("empty-8").classList.remove("hugeblock");
    }
  } else if (
    cellId == 9 ||
    cellId == 18 ||
    cellId == 27 ||
    cellId == 36 ||
    cellId == 45 ||
    cellId == 54 ||
    cellId == 63 ||
    cellId == 72 ||
    cellId == 81
  ) {
    if (
      document.getElementById("empty-9").classList.contains("x") ||
      document.getElementById("empty-9").classList.contains("circle") ||
      document.getElementById("empty-9").classList.contains("draw")
    ) {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.remove("hugeblock");
          if (
            document.getElementById(elementId).classList.contains("x") ||
            document.getElementById(elementId).classList.contains("circle") ||
            document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        const elementId = `empty-${i}`;
        const element = document.getElementById(elementId);
        if (element) {
          if (
            !document.getElementById(elementId).classList.contains("x") &&
            !document.getElementById(elementId).classList.contains("circle") &&
            !document.getElementById(elementId).classList.contains("draw")
          ) {
            element.classList.add("hugeblock");
          }
        }
      }
      document.getElementById("empty-9").classList.remove("hugeblock");
    }
  }
}

// Swaps turns

function swapTurns() {
  circleTurn = !circleTurn;
}

// Checks for a win in the current mini board

function checkSmallWin(cellId, currentClass) {
  return winnings.some((combination) => {
    return combination.every((index) => {
      if (cellId <= 9) {
        return cellElements1[index].classList.contains(currentClass);
      } else if (cellId <= 18) {
        return cellElements2[index].classList.contains(currentClass);
      } else if (cellId <= 27) {
        return cellElements3[index].classList.contains(currentClass);
      } else if (cellId <= 36) {
        return cellElements4[index].classList.contains(currentClass);
      } else if (cellId <= 45) {
        return cellElements5[index].classList.contains(currentClass);
      } else if (cellId <= 54) {
        return cellElements6[index].classList.contains(currentClass);
      } else if (cellId <= 63) {
        return cellElements7[index].classList.contains(currentClass);
      } else if (cellId <= 72) {
        return cellElements8[index].classList.contains(currentClass);
      } else if (cellId <= 81) {
        return cellElements9[index].classList.contains(currentClass);
      } else {
        console.error(cellId);
        return false;
      }
    });
  });
}

// Checks for a small draw

function isSmallDraw(cellId, cell) {
  if (cellId <= 9) {
    return [...cellElements1].every((cell) => {
      return (
        cell.classList.contains(x_class) ||
        cell.classList.contains(circle_class)
      );
    });
  } else if (cellId <= 18) {
    return [...cellElements2].every((cell) => {
      return (
        cell.classList.contains(x_class) ||
        cell.classList.contains(circle_class)
      );
    });
  } else if (cellId <= 27) {
    return [...cellElements3].every((cell) => {
      return (
        cell.classList.contains(x_class) ||
        cell.classList.contains(circle_class)
      );
    });
  } else if (cellId <= 36) {
    return [...cellElements4].every((cell) => {
      return (
        cell.classList.contains(x_class) ||
        cell.classList.contains(circle_class)
      );
    });
  } else if (cellId <= 45) {
    return [...cellElements5].every((cell) => {
      return (
        cell.classList.contains(x_class) ||
        cell.classList.contains(circle_class)
      );
    });
  } else if (cellId <= 54) {
    return [...cellElements6].every((cell) => {
      return (
        cell.classList.contains(x_class) ||
        cell.classList.contains(circle_class)
      );
    });
  } else if (cellId <= 63) {
    return [...cellElements7].every((cell) => {
      return (
        cell.classList.contains(x_class) ||
        cell.classList.contains(circle_class)
      );
    });
  } else if (cellId <= 72) {
    return [...cellElements8].every((cell) => {
      return (
        cell.classList.contains(x_class) ||
        cell.classList.contains(circle_class)
      );
    });
  } else if (cellId <= 81) {
    return [...cellElements9].every((cell) => {
      return (
        cell.classList.contains(x_class) ||
        cell.classList.contains(circle_class)
      );
    });
  }
}

function checkWin(currentClass) {
  return winnings.some((combination) => {
    return combination.every((index) => {
      return document
        .getElementById(`empty-${index + 1}`)
        .classList.contains(currentClass);
    });
  });
}

function isDraw() {
  return [...bigElements].every((id) => {
    let element = document.getElementById(id);
    return (
      element.classList.contains(x_class) ||
      element.classList.contains(circle_class) ||
      element.classList.contains("draw")
    );
  });
}
