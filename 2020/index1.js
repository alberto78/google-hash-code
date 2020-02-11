const fs = require("fs");

const fname = process.argv[2];

let MAX, TYPES, PIZZAS, RESULT, BESTMAX, BESTRESULT;

const readData = () => {
  const content = fs.readFileSync(`${fname}.in`, { encoding: "utf8" });
  const lines = content.split("\n");
  const params = lines[0].split(" ");
  [MAX, TYPES] = [Number(params[0]), Number(params[1])];
  PIZZAS = lines[1].split(" ");
};

const writeData = () => {
  const data = `${BESTRESULT.length}\n${BESTRESULT.join(" ")}`;
  fs.writeFileSync(`${fname}.out`, data, { encoding: "utf8" });
};

const calcBest = () => {
  BESTMAX = 0;
  BESTRESULT = [];
  for (let i = PIZZAS.length - 1; i >= 0; i--) {
    RESULT = [i];
    let sum = Number(PIZZAS[i]);
    let missing = MAX - sum;
    for (let j = i - 1; j >= 0; j--) {
      let slices = Number(PIZZAS[j]);
      if (slices > missing) continue;
      if (slices + sum > MAX) continue;
      sum += slices;
      RESULT.unshift(j);
      if (sum > BESTMAX) {
        BESTMAX = sum;
        BESTRESULT = RESULT;
      }
    }
    if (sum == MAX) {
      BESTMAX = sum;
      BESTRESULT = RESULT;
      break;
    }
  }
  console.log("Score", BESTMAX);
};

readData();
calcBest();
writeData();
