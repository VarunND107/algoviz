// Step shape: { array, checking: i|null, range: [lo, hi], found: i|null, eliminated: [indices] }

function baseStep(array, overrides = {}) {
  return {
    array: [...array],
    checking: null,
    range: [0, array.length - 1],
    found: null,
    eliminated: [],
    ...overrides,
  };
}

export function* linearSearch(input, target) {
  const array = [...input];
  const eliminated = [];

  for (let i = 0; i < array.length; i++) {
    yield baseStep(array, { checking: i, eliminated: [...eliminated] });
    if (array[i] === target) {
      yield baseStep(array, { found: i, eliminated: [...eliminated] });
      return;
    }
    eliminated.push(i);
  }
  yield baseStep(array, { found: -1, eliminated: [...eliminated] });
}

export function* binarySearch(input, target) {
  const array = [...input].sort((a, b) => a - b);
  let lo = 0;
  let hi = array.length - 1;
  const eliminated = [];

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    yield baseStep(array, { checking: mid, range: [lo, hi], eliminated: [...eliminated] });

    if (array[mid] === target) {
      yield baseStep(array, { found: mid, range: [lo, hi], eliminated: [...eliminated] });
      return;
    } else if (array[mid] < target) {
      for (let k = lo; k <= mid; k++) eliminated.push(k);
      lo = mid + 1;
    } else {
      for (let k = mid; k <= hi; k++) eliminated.push(k);
      hi = mid - 1;
    }
  }
  yield baseStep(array, { found: -1, range: [lo, hi], eliminated: [...eliminated] });
}

export const SEARCHERS = {
  linear_search: linearSearch,
  binary_search: binarySearch,
};
