const fs = require("fs");
const os = require("os");

const fname = process.argv[2];

let pizza = [];
let results = [];
let R, C, L, H;

const readPizza = () => {
  const content = fs.readFileSync(`${fname}.in`, { encoding: "utf8" });
  const lines = content.split(os.EOL);
  const params = lines[0].split(" ");
  [R, C, L, H] = [Number(params[0]), Number(params[1]), Number(params[2]), Number(params[3])];
  lines.splice(R + 1, 1);
  lines.splice(0, 1);
  lines.forEach(l => (pizza = pizza.concat(l.split(""))));
};

const writePizza = () => {
  let slices = "";
  results.forEach(res => (slices += res.join(" ") + "\n"));
  const data = `${results.length}\n${slices}`;
  fs.writeFileSync(`${fname}.out`, data, { encoding: "utf8" });
};

const isValidCol = (col, ci) => col + ci <= C;
const isValidRow = (row, ri) => row + ri < R;
const isValidSize = (ri, ci) => (ri + 1) * ci <= H;

const isValidSlice = (row, col, ri, ci) => {
  let slc = [];
  for (let i = row; i <= row + ri; i++) {
    slc = slc.concat(pizza.slice(i * C + col, i * C + col + ci));
  }
  const z = slc.join("").replace(/[TM]/g, "").length;
  const t = slc.join("").replace(/[M]/g, "").length;
  const m = slc.join("").replace(/[T]/g, "").length;
  return z === 0 && ((t === L && m >= L) || (t >= L && m === L));
};

const getSlice = (row, col, ri = 0, ci = 1, last = false) => {
  if (!isValidCol(col, ci) || !isValidSize(ri, ci)) {
    if (ri > H) {
      return false;
    }
    return getSlice(row, col, ri + 1, 1, last);
  } else if (!isValidRow(row, ri)) {
    return last;
  } else {
    if (isValidSlice(row, col, ri, ci)) {
      return expandH(row, col, ri, ci + 1, [row, col, row + ri, col + ci - 1]);
    } else {
      return getSlice(row, col, ri, ci + 1, last);
    }
  }
};

const expandH = (row, col, ri, ci, last) => {
  if (!isValidCol(col, ci) || !isValidSize(ri, ci)) {
    return expandV(row, col, ri + 1, ci - 1 || 1 /*L*/, last);
  } else {
    if (isValidSlice(row, col, ri, ci)) {
      return expandH(row, col, ri, ci + 1, [row, col, row + ri, col + ci - 1]);
    } else {
      return expandV(row, col, ri + 1, ci - 1, last);
    }
  }
};

const expandV = (row, col, ri, ci, last) => {
  if (!isValidRow(row, ri) || !isValidSize(ri, ci)) {
    return last;
  } else {
    if (isValidSlice(row, col, ri, ci)) {
      return expandH(row, col, ri, ci + 1, [row, col, row + ri, col + ci - 1]);
    } else {
      return last;
    }
  }
};

const setZero = (row1, col1, row2, col2) => {
  for (let y = row1; y <= row2; y++) {
    for (let x = col1; x <= col2; x++) {
      pizza[y * C + x] = 0;
    }
  }
};

const nextValid = () => {
  const pos = pizza.findIndex(e => e !== 0);
  if (pos >= 0) {
    const row = Math.floor(pos / C);
    const col = pos % C;
    return [row, col];
  }
  return false;
};

const getSlices = (row = 0, col = 0, n = 0) => {
  if (n > 1000) {
    // memory stack !!
    // recursive threshold
    return [row, col];
  }

  const res = getSlice(row, col);
  if (res) {
    results.push(res);
    const [r0, c0, r1, c1] = res;
    setZero(r0, c0, r1, c1);
  } else {
    pizza[row * C + col] = 0;
  }

  const next = nextValid();
  if (next) {
    const [r, c] = next;
    return getSlices(r, c, n + 1);
  }
  return false;
};

readPizza();

let ret = getSlices();
while (ret) {
  ret = getSlices(ret[0], ret[1]);
}

writePizza();

const score = results.reduce((acc, res) => acc + (res[2] + 1 - res[0]) * (res[3] + 1 - res[1]), 0);
console.log("Score:", score);
