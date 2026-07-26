export const CATEGORIES = [
  {
    label: "Sorting",
    items: [
      { id: "bubble_sort", name: "Bubble Sort" },
      { id: "quick_sort", name: "Quick Sort" },
      { id: "merge_sort", name: "Merge Sort" },
      { id: "insertion_sort", name: "Insertion Sort" },
      { id: "selection_sort", name: "Selection Sort" },
    ],
  },
  {
    label: "Searching",
    items: [
      { id: "linear_search", name: "Linear Search" },
      { id: "binary_search", name: "Binary Search" },
    ],
  },
  {
    label: "Graph",
    items: [
      { id: "bfs", name: "Breadth-First Search" },
      { id: "dfs", name: "Depth-First Search" },
      { id: "dijkstra", name: "Dijkstra's Algorithm" },
      { id: "floyd_warshall", name: "Floyd-Warshall" },
    ],
  },
];

export const ALL_ALGORITHMS = CATEGORIES.flatMap((c) => c.items);

export const ALGO_NAME = Object.fromEntries(ALL_ALGORITHMS.map((a) => [a.id, a.name]));

export const SORTING_IDS = new Set([
  "bubble_sort",
  "quick_sort",
  "merge_sort",
  "insertion_sort",
  "selection_sort",
]);

export const SEARCH_IDS = new Set(["linear_search", "binary_search"]);

export const GRAPH_IDS = new Set(["bfs", "dfs", "dijkstra", "floyd_warshall"]);
