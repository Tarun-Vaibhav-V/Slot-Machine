document.addEventListener("DOMContentLoaded", function() {
    const ROWS = 3;
    const COLS = 3;
  
    const SYMBOLS_COUNT = {
      A: 2,
      B: 4,
      C: 6,
      D: 8,
    };
  
    const SYMBOL_VALUES = {
      A: 5,
      B: 4,
      C: 3,
      D: 2,
    };
  
    let balance = 0;
  
    const deposit = () => {
      const depositAmount = parseFloat(document.getElementById("deposit").value);
      if (isNaN(depositAmount) || depositAmount <= 0) {
        alert("Invalid deposit amount, try again.");
      } else {
        balance = depositAmount;
        document.getElementById("balance").innerText = `Balance: $${balance}`;
      }
    };
  
    const getNumberOfLines = () => {
      const lines = parseInt(document.getElementById("lines").value);
      if (isNaN(lines) || lines <= 0 || lines > 3) {
        alert("Invalid number of lines, try again.");
        return null;
      } else {
        return lines;
      }
    };
  
    const getBet = (lines) => {
      const bet = parseFloat(document.getElementById("bet").value);
      if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
        alert("Invalid bet, try again.");
        return null;
      } else {
        return bet;
      }
    };
  
    const spin = () => {
      const symbols = [];
      for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
          symbols.push(symbol);
        }
      }
  
      const reels = [];
      for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
          const randomIndex = Math.floor(Math.random() * reelSymbols.length);
          const selectedSymbol = reelSymbols[randomIndex];
          reels[i].push(selectedSymbol);
          reelSymbols.splice(randomIndex, 1);
        }
      }
  
      return reels;
    };
  
    const transpose = (reels) => {
      const rows = [];
      for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
          rows[i].push(reels[j][i]);
        }
      }
      return rows;
    };
  
    const printRows = (rows) => {
      const reelsDivs = document.querySelectorAll(".reel");
      rows.forEach((row, rowIndex) => {
        const reelDiv = reelsDivs[rowIndex];
        reelDiv.innerHTML = ""; // Clear previous symbols
        row.forEach((symbol) => {
          const symbolDiv = document.createElement("div");
          symbolDiv.className = "symbol";
          symbolDiv.innerText = symbol;
          reelDiv.appendChild(symbolDiv);
        });
      });
    };
  
    const getWinnings = (rows, bet, lines) => {
      let winnings = 0;
  
      for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
  
        for (const symbol of symbols) {
          if (symbol != symbols[0]) {
            allSame = false;
            break;
          }
        }
  
        if (allSame) {
          winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
      }
  
      return winnings;
    };
  
    document.getElementById("deposit-button").addEventListener("click", deposit);
  
    document.getElementById("spin-button").addEventListener("click", () => {
      if (balance <= 0) {
        alert("You have no money! Please deposit first.");
        return;
      }
  
      const numberOfLines = getNumberOfLines();
      if (numberOfLines === null) return;
  
      const bet = getBet(numberOfLines);
      if (bet === null) return;
  
      balance -= bet * numberOfLines;
      document.getElementById("balance").innerText = `Balance: $${balance}`;
  
      const reels = spin();
      const rows = transpose(reels);
      printRows(rows);
  
      const winnings = getWinnings(rows, bet, numberOfLines);
      balance += winnings;
  
      document.getElementById("winnings").innerText = `Winnings: $${winnings}`;
      document.getElementById("balance").innerText = `Balance: $${balance}`;
  
      if (balance <= 0) {
        alert("You ran out of money!");
      }
    });
  });
  