// Each sorting generator yields step objects describing what to highlight next.
// Shape: { array, comparing: [i, j], swapping: [i, j], sorted: [indices], pivot: i|null }
// The visualizer just renders the latest step; play/pause/speed live in useAnimationPlayer.

function baseStep(array, overrides = {}) {
  return {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    pivot: null,
    ...overrides,
  };
}

export function* bubbleSort(input) {
  const array = [...input];
  const n = array.length;
  const sorted = [];

  for (let i = 0; i < n - 1; i++) {
    let swappedAny = false;
    for (let j = 0; j < n - 1 - i; j++) {
      yield baseStep(array, { comparing: [j, j + 1], sorted: [...sorted] });
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swappedAny = true;
        yield baseStep(array, { swapping: [j, j + 1], sorted: [...sorted] });
      }
    }
    sorted.unshift(n - 1 - i);
    if (!swappedAny) break;
  }
  for (let i = 0; i < n; i++) if (!sorted.includes(i)) sorted.push(i);
  yield baseStep(array, { sorted });
}

export function* selectionSort(input) {
  const array = [...input];
  const n = array.length;
  const sorted = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield baseStep(array, { comparing: [minIdx, j], sorted: [...sorted] });
      if (array[j] < array[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      yield baseStep(array, { swapping: [i, minIdx], sorted: [...sorted] });
    }
    sorted.push(i);
  }
  sorted.push(n - 1);
  yield baseStep(array, { sorted });
}

export function* insertionSort(input) {
  const array = [...input];
  const n = array.length;

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    yield baseStep(array, { comparing: [i, j], sorted: Array.from({ length: i }, (_, k) => k) });
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      yield baseStep(array, { swapping: [j, j + 1] });
      j--;
    }
    array[j + 1] = key;
  }
  yield baseStep(array, { sorted: array.map((_, i) => i) });
}

export function* mergeSort(input) {
  const array = [...input];

  function* mergeSortHelper(lo, hi) {
    if (hi - lo <= 1) return;
    const mid = Math.floor((lo + hi) / 2);
    yield* mergeSortHelper(lo, mid);
    yield* mergeSortHelper(mid, hi);

    const left = array.slice(lo, mid);
    const right = array.slice(mid, hi);
    let i = 0, j = 0, k = lo;

    while (i < left.length && j < right.length) {
      yield baseStep(array, { comparing: [lo + i, mid + j] });
      if (left[i] <= right[j]) {
        array[k++] = left[i++];
      } else {
        array[k++] = right[j++];
      }
      yield baseStep(array, { swapping: [k - 1] });
    }
    while (i < left.length) {
      array[k++] = left[i++];
      yield baseStep(array, { swapping: [k - 1] });
    }
    while (j < right.length) {
      array[k++] = right[j++];
      yield baseStep(array, { swapping: [k - 1] });
    }
  }

  yield* mergeSortHelper(0, array.length);
  yield baseStep(array, { sorted: array.map((_, i) => i) });
}

export function* quickSort(input) {
  const array = [...input];

  function* quickSortHelper(lo, hi, sortedAcc) {
    if (lo >= hi) {
      if (lo === hi) sortedAcc.push(lo);
      return;
    }
    const pivot = array[hi];
    let i = lo - 1;

    for (let j = lo; j < hi; j++) {
      yield baseStep(array, { comparing: [j, hi], pivot: hi, sorted: [...sortedAcc] });
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        yield baseStep(array, { swapping: [i, j], pivot: hi, sorted: [...sortedAcc] });
      }
    }
    [array[i + 1], array[hi]] = [array[hi], array[i + 1]];
    yield baseStep(array, { swapping: [i + 1, hi], sorted: [...sortedAcc] });
    sortedAcc.push(i + 1);

    yield* quickSortHelper(lo, i, sortedAcc);
    yield* quickSortHelper(i + 2, hi, sortedAcc);
  }

  const sortedAcc = [];
  yield* quickSortHelper(0, array.length - 1, sortedAcc);
  yield baseStep(array, { sorted: array.map((_, i) => i) });
}

export const SORTERS = {
  bubble_sort: bubbleSort,
  quick_sort: quickSort,
  merge_sort: mergeSort,
  insertion_sort: insertionSort,
  selection_sort: selectionSort,
};
