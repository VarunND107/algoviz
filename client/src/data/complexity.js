export const COMPLEXITY_DATA = [
  { id: "bubble_sort", name: "Bubble Sort", category: "Sorting", best: "O(n)", average: "O(n^2)", worst: "O(n^2)", space: "O(1)", stable: true },
  { id: "quick_sort", name: "Quick Sort", category: "Sorting", best: "O(n log n)", average: "O(n log n)", worst: "O(n^2)", space: "O(log n)", stable: false },
  { id: "merge_sort", name: "Merge Sort", category: "Sorting", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: true },
  { id: "insertion_sort", name: "Insertion Sort", category: "Sorting", best: "O(n)", average: "O(n^2)", worst: "O(n^2)", space: "O(1)", stable: true },
  { id: "selection_sort", name: "Selection Sort", category: "Sorting", best: "O(n^2)", average: "O(n^2)", worst: "O(n^2)", space: "O(1)", stable: false },
  { id: "linear_search", name: "Linear Search", category: "Searching", best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)", stable: null },
  { id: "binary_search", name: "Binary Search", category: "Searching", best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1)", stable: null },
  { id: "bfs", name: "Breadth-First Search", category: "Graph", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)", stable: null },
  { id: "dfs", name: "Depth-First Search", category: "Graph", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)", stable: null },
  { id: "dijkstra", name: "Dijkstra's Algorithm", category: "Graph", best: "O((V + E) log V)", average: "O((V + E) log V)", worst: "O((V + E) log V)", space: "O(V)", stable: null },
  { id: "floyd_warshall", name: "Floyd-Warshall", category: "Graph", best: "O(V^3)", average: "O(V^3)", worst: "O(V^3)", space: "O(V^2)", stable: null },
  { id: "pathfinding_grid", name: "Grid Pathfinding (Dijkstra/A*)", category: "Pathfinding", best: "O(E log V)", average: "O(E log V)", worst: "O(E log V)", space: "O(V)", stable: null },
];
