const C = 400;

module.exports = function elo(r1, r2, res, k = 32) {
  const t1 = 10 ** (r1 / C);
  const t2 = 10 ** (r2 / C);

  const tSum = t1 + t2;

  const e1 = t1 / tSum;
  const e2 = t2 / tSum;

  const n1 = r1 + k * (res - e1);
  const n2 = r2 + k * (1 - res - e2);

  return {
    r1,
    r2,
    n1,
    n2,
  };
};
