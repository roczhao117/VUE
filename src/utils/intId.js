export const rid = (() => {

  const m = 1000;
  const n = 0;
  return Math.random() * (m - n - 1) + n + 1;

})