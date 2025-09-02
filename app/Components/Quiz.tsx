'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Question {
  id: number
  type: 'mcq' | 'fill'
  question: string
  options?: string[]
  correctAnswer: string
  solution: string
}

interface Assignment {
  id: number
  questions: Question[]
}

interface TopicData {
  [topic: string]: Assignment[]
}

const quizData: TopicData = {
  'Arrays': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'What is the time complexity of accessing an element in an array by index?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctAnswer: 'O(1)',
          solution: 'Array elements can be directly accessed using their index, making it constant time O(1).'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'What is the space complexity of an array of size n?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctAnswer: 'O(n)',
          solution: 'An array of size n requires O(n) space to store n elements.'
        },
        {
          id: 3,
          type: 'fill',
          question: 'The maximum number of elements that can be stored in an array of size 10 is ___',
          correctAnswer: '10',
          solution: 'An array of size 10 can store exactly 10 elements, indexed from 0 to 9.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Which operation is NOT efficient in arrays?',
          options: ['Random access', 'Insertion at beginning', 'Memory locality', 'Cache performance'],
          correctAnswer: 'Insertion at beginning',
          solution: 'Insertion at the beginning requires shifting all existing elements, making it O(n).'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'What is the time complexity of finding the maximum element in an unsorted array?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctAnswer: 'O(n)',
          solution: 'Finding maximum in unsorted array requires checking all elements, giving O(n).'
        },
        {
          id: 6,
          type: 'mcq',
          question: 'In a 2D array arr[m][n], what is the total number of elements?',
          options: ['m + n', 'm - n', 'm × n', 'm / n'],
          correctAnswer: 'm × n',
          solution: 'A 2D array with m rows and n columns contains m × n total elements.'
        }
      ]
    }
  ],
  
  'Linked Lists': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'What is the time complexity of inserting a node at the beginning of a singly linked list?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctAnswer: 'O(1)',
          solution: 'Insertion at the beginning only requires updating the head pointer, making it O(1).'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'In a doubly linked list, each node contains:',
          options: ['Data and next pointer', 'Data, next and previous pointers', 'Only data', 'Data and two next pointers'],
          correctAnswer: 'Data, next and previous pointers',
          solution: 'Doubly linked lists have pointers to both next and previous nodes for bidirectional traversal.'
        },
        {
          id: 3,
          type: 'fill',
          question: 'In a circular linked list, the last node points to the ___ node',
          correctAnswer: 'first',
          solution: 'In circular linked lists, the last node\'s next pointer points back to the first node.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Which is an advantage of linked lists over arrays?',
          options: ['Random access', 'Cache locality', 'Dynamic size', 'Less memory usage'],
          correctAnswer: 'Dynamic size',
          solution: 'Linked lists can grow or shrink dynamically during runtime, unlike fixed-size arrays.'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'Time complexity of deleting a node from the middle of a linked list is:',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctAnswer: 'O(n)',
          solution: 'Finding the node to delete requires O(n) traversal in worst case.'
        }
      ]
    }
  ],
  
  'Stacks': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Stack follows which principle?',
          options: ['FIFO', 'LIFO', 'Random access', 'Priority based'],
          correctAnswer: 'LIFO',
          solution: 'Stack follows Last In First Out (LIFO) principle where the last element added is the first to be removed.'
        },
        {
          id: 2,
          type: 'fill',
          question: 'The operation to remove an element from stack is called ___',
          correctAnswer: 'pop',
          solution: 'Pop operation removes and returns the top element from the stack.'
        },
        {
          id: 3,
          type: 'mcq',
          question: 'Which of these applications uses stack?',
          options: ['BFS traversal', 'Function call management', 'Queue implementation', 'Hash table'],
          correctAnswer: 'Function call management',
          solution: 'Function calls use stack for managing local variables and return addresses.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Time complexity of push and pop operations in stack is:',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctAnswer: 'O(1)',
          solution: 'Both push and pop operations work on the top element, making them constant time O(1).'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'Which operation is used to check if stack is empty?',
          options: ['top()', 'isEmpty()', 'size()', 'peek()'],
          correctAnswer: 'isEmpty()',
          solution: 'isEmpty() operation returns true if stack has no elements, false otherwise.'
        }
      ]
    }
  ],
  
  'Queues': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Queue follows which principle?',
          options: ['LIFO', 'FIFO', 'Random access', 'Priority based'],
          correctAnswer: 'FIFO',
          solution: 'Queue follows First In First Out (FIFO) principle where the first element added is the first to be removed.'
        },
        {
          id: 2,
          type: 'fill',
          question: 'The operation to add an element to queue is called ___',
          correctAnswer: 'enqueue',
          solution: 'Enqueue operation adds an element to the rear of the queue.'
        },
        {
          id: 3,
          type: 'mcq',
          question: 'Which application commonly uses queue?',
          options: ['Function recursion', 'BFS traversal', 'Expression evaluation', 'Undo operations'],
          correctAnswer: 'BFS traversal',
          solution: 'Breadth-First Search uses queue to process nodes level by level.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'In a circular queue, when rear reaches the end, it:',
          options: ['Cannot add more elements', 'Moves to the beginning', 'Expands the queue', 'Throws an error'],
          correctAnswer: 'Moves to the beginning',
          solution: 'In circular queue, rear wraps around to the beginning to utilize empty spaces.'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'Priority queue is best implemented using:',
          options: ['Array', 'Linked List', 'Heap', 'Stack'],
          correctAnswer: 'Heap',
          solution: 'Heap provides efficient O(log n) insertion and O(log n) deletion for priority queue.'
        }
      ]
    }
  ],
  
  'Trees': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'What is the maximum number of nodes at level k in a binary tree?',
          options: ['k', '2^k', '2^(k-1)', '2^(k+1)'],
          correctAnswer: '2^k',
          solution: 'At level k, there can be at most 2^k nodes in a binary tree (0-indexed levels).'
        },
        {
          id: 2,
          type: 'fill',
          question: 'In a binary search tree, the left child is ___ than the parent',
          correctAnswer: 'smaller',
          solution: 'BST property: left subtree contains nodes with values less than the parent.'
        },
        {
          id: 3,
          type: 'mcq',
          question: 'Which tree is always balanced?',
          options: ['Binary tree', 'BST', 'AVL tree', 'Complete binary tree'],
          correctAnswer: 'AVL tree',
          solution: 'AVL trees maintain balance by ensuring height difference between subtrees is at most 1.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'What is the time complexity of search in a balanced BST?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctAnswer: 'O(log n)',
          solution: 'In balanced BST, search eliminates half the nodes at each step, giving O(log n).'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'Inorder traversal of BST gives:',
          options: ['Random order', 'Sorted order', 'Reverse sorted', 'Level order'],
          correctAnswer: 'Sorted order',
          solution: 'Inorder traversal of BST visits nodes in ascending sorted order.'
        },
        {
          id: 6,
          type: 'mcq',
          question: 'What is the height of a complete binary tree with n nodes?',
          options: ['log n', 'n', 'n/2', 'sqrt(n)'],
          correctAnswer: 'log n',
          solution: 'Complete binary tree has height O(log n) due to its balanced structure.'
        }
      ]
    }
  ],
  
  'Heaps': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'In a max heap, the parent node is:',
          options: ['Smaller than children', 'Greater than children', 'Equal to children', 'Random'],
          correctAnswer: 'Greater than children',
          solution: 'Max heap property: parent node is always greater than or equal to its children.'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'Time complexity of inserting an element in heap is:',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswer: 'O(log n)',
          solution: 'Insertion requires bubbling up the element, taking O(log n) time in worst case.'
        },
        {
          id: 3,
          type: 'fill',
          question: 'Heap sort has time complexity of ___',
          correctAnswer: 'O(n log n)',
          solution: 'Heap sort builds heap in O(n) and extracts n elements in O(n log n) total.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Heap is commonly used to implement:',
          options: ['Stack', 'Queue', 'Priority Queue', 'Hash Table'],
          correctAnswer: 'Priority Queue',
          solution: 'Heap provides efficient priority queue with O(log n) insert/delete operations.'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'In array representation of heap, left child of node at index i is at:',
          options: ['2i', '2i+1', '2i+2', 'i+1'],
          correctAnswer: '2i+1',
          solution: 'In 0-indexed array, left child of node at index i is at index 2i+1.'
        }
      ]
    }
  ],
  
  'Graphs': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'In an undirected graph with n vertices, the maximum number of edges is:',
          options: ['n', 'n-1', 'n(n-1)/2', 'n²'],
          correctAnswer: 'n(n-1)/2',
          solution: 'Complete undirected graph has n(n-1)/2 edges as each vertex connects to n-1 others.'
        },
        {
          id: 2,
          type: 'fill',
          question: 'A graph with no cycles is called a ___',
          correctAnswer: 'tree',
          solution: 'An acyclic connected graph is called a tree.'
        },
        {
          id: 3,
          type: 'mcq',
          question: 'Which representation is better for dense graphs?',
          options: ['Adjacency list', 'Adjacency matrix', 'Edge list', 'Incidence matrix'],
          correctAnswer: 'Adjacency matrix',
          solution: 'Adjacency matrix is more efficient for dense graphs due to O(1) edge lookup.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'What is the space complexity of adjacency matrix for n vertices?',
          options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(1)'],
          correctAnswer: 'O(n²)',
          solution: 'Adjacency matrix requires n×n space regardless of the number of edges.'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'A graph where every vertex has the same degree is called:',
          options: ['Complete graph', 'Regular graph', 'Bipartite graph', 'Planar graph'],
          correctAnswer: 'Regular graph',
          solution: 'Regular graph is one where all vertices have the same degree (number of edges).'
        }
      ]
    }
  ],
  
  'Hash Tables': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'What is the average time complexity of search in a hash table?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctAnswer: 'O(1)',
          solution: 'Hash tables provide O(1) average case search through direct index computation.'
        },
        {
          id: 2,
          type: 'fill',
          question: 'When two keys hash to the same index, it is called a ___',
          correctAnswer: 'collision',
          solution: 'Collision occurs when hash function maps different keys to the same table index.'
        },
        {
          id: 3,
          type: 'mcq',
          question: 'Which collision resolution technique uses linked lists?',
          options: ['Linear probing', 'Quadratic probing', 'Chaining', 'Double hashing'],
          correctAnswer: 'Chaining',
          solution: 'Chaining resolves collisions by maintaining linked lists at each table index.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'What is the load factor in hashing?',
          options: ['Number of keys', 'Table size', 'Keys/Table size', 'Collisions count'],
          correctAnswer: 'Keys/Table size',
          solution: 'Load factor is the ratio of number of keys to the hash table size.'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'Linear probing is a technique for:',
          options: ['Hash function design', 'Collision resolution', 'Load balancing', 'Memory optimization'],
          correctAnswer: 'Collision resolution',
          solution: 'Linear probing resolves collisions by checking next available slot linearly.'
        }
      ]
    }
  ],
  
  'Tries': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Trie is also known as:',
          options: ['Binary tree', 'Prefix tree', 'Hash tree', 'Search tree'],
          correctAnswer: 'Prefix tree',
          solution: 'Trie is called prefix tree because it stores strings as prefixes along paths.'
        },
        {
          id: 2,
          type: 'fill',
          question: 'Time complexity of searching a word of length m in trie is ___',
          correctAnswer: 'O(m)',
          solution: 'Search time depends only on the length of the word, not the number of words stored.'
        },
        {
          id: 3,
          type: 'mcq',
          question: 'What is the main advantage of trie over hash table for string storage?',
          options: ['Less memory', 'Faster search', 'Prefix matching', 'Simpler implementation'],
          correctAnswer: 'Prefix matching',
          solution: 'Tries excel at prefix-based operations like autocomplete and prefix matching.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'In worst case, space complexity of trie storing n words is:',
          options: ['O(n)', 'O(n×m)', 'O(n²)', 'O(m)'],
          correctAnswer: 'O(n×m)',
          solution: 'Worst case occurs when no prefixes are shared, requiring O(n×m) space for n words of length m.'
        }
      ]
    }
  ],

  'Disjoint Set Union': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Union-Find data structure is primarily used for:',
          options: ['Sorting', 'Dynamic connectivity', 'Shortest path', 'String matching'],
          correctAnswer: 'Dynamic connectivity',
          solution: 'Union-Find efficiently handles dynamic connectivity queries and union operations.'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'Time complexity of Union-Find with path compression and union by rank is:',
          options: ['O(1)', 'O(log n)', 'O(α(n))', 'O(n)'],
          correctAnswer: 'O(α(n))',
          solution: 'With optimizations, operations take inverse Ackermann time α(n), practically constant.'
        },
        {
          id: 3,
          type: 'fill',
          question: 'The operation to combine two sets in Union-Find is called ___',
          correctAnswer: 'union',
          solution: 'Union operation merges two disjoint sets into a single set.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Path compression in Union-Find:',
          options: ['Increases height', 'Flattens tree structure', 'Uses more memory', 'Slows down operations'],
          correctAnswer: 'Flattens tree structure',
          solution: 'Path compression makes all nodes point directly to root, flattening the tree.'
        }
      ]
    }
  ],

  'Segment Trees': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Segment tree is used for:',
          options: ['Sorting arrays', 'Range queries', 'Graph traversal', 'String matching'],
          correctAnswer: 'Range queries',
          solution: 'Segment trees efficiently answer range queries like sum, min, max in O(log n).'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'Time complexity of range query in segment tree is:',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswer: 'O(log n)',
          solution: 'Segment tree height is O(log n), so range queries take O(log n) time.'
        },
        {
          id: 3,
          type: 'fill',
          question: 'Space complexity of segment tree for array of size n is ___',
          correctAnswer: 'O(n)',
          solution: 'Segment tree requires approximately 4n space to store all internal nodes.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Lazy propagation in segment tree is used for:',
          options: ['Faster queries', 'Range updates', 'Memory optimization', 'Tree balancing'],
          correctAnswer: 'Range updates',
          solution: 'Lazy propagation efficiently handles range updates by deferring calculations.'
        }
      ]
    }
  ],

  'Bit Manipulation': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'What does the operation (n & (n-1)) do?',
          options: ['Sets rightmost bit', 'Clears rightmost set bit', 'Toggles all bits', 'Counts set bits'],
          correctAnswer: 'Clears rightmost set bit',
          solution: 'n & (n-1) removes the rightmost set bit in the binary representation of n.'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'Which operation checks if a number is power of 2?',
          options: ['n & 1', 'n | (n-1)', 'n & (n-1)', 'n ^ (n-1)'],
          correctAnswer: 'n & (n-1)',
          solution: 'A number is power of 2 if (n & (n-1)) equals 0 and n > 0.'
        },
        {
          id: 3,
          type: 'fill',
          question: 'XOR of a number with itself gives ___',
          correctAnswer: '0',
          solution: 'Any number XORed with itself results in 0 (a ^ a = 0).'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'To set the kth bit of number n, we use:',
          options: ['n | (1 << k)', 'n & (1 << k)', 'n ^ (1 << k)', 'n >> k'],
          correctAnswer: 'n | (1 << k)',
          solution: 'OR operation with (1 << k) sets the kth bit while preserving other bits.'
        }
      ]
    }
  ],

  'String Algorithms': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'KMP algorithm is used for:',
          options: ['String sorting', 'Pattern matching', 'String compression', 'Palindrome check'],
          correctAnswer: 'Pattern matching',
          solution: 'KMP (Knuth-Morris-Pratt) efficiently finds pattern occurrences in text.'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'Time complexity of KMP pattern matching is:',
          options: ['O(n²)', 'O(n + m)', 'O(n × m)', 'O(n log m)'],
          correctAnswer: 'O(n + m)',
          solution: 'KMP algorithm runs in O(n + m) time where n is text length and m is pattern length.'
        },
        {
          id: 3,
          type: 'fill',
          question: 'LPS array in KMP stands for ___',
          correctAnswer: 'Longest Proper Prefix which is also Suffix',
          solution: 'LPS helps skip characters during pattern matching by avoiding redundant comparisons.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Rabin-Karp algorithm uses:',
          options: ['Dynamic programming', 'Hashing', 'Backtracking', 'Greedy approach'],
          correctAnswer: 'Hashing',
          solution: 'Rabin-Karp uses rolling hash to efficiently compare pattern with text substrings.'
        }
      ]
    }
  ],

  'Two Pointers': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Two pointers technique is commonly used for:',
          options: ['Tree traversal', 'Array/String problems', 'Graph algorithms', 'Sorting only'],
          correctAnswer: 'Array/String problems',
          solution: 'Two pointers efficiently solve many array and string problems in linear time.'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'In two-sum problem for sorted array, two pointers approach has complexity:',
          options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
          correctAnswer: 'O(n)',
          solution: 'Two pointers traverse the sorted array once, giving O(n) time complexity.'
        },
        {
          id: 3,
          type: 'fill',
          question: 'To find pair with given sum in sorted array, we use ___ pointers',
          correctAnswer: 'two',
          solution: 'One pointer at start, one at end, moving based on sum comparison with target.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Fast and slow pointer technique is used to detect:',
          options: ['Sorting errors', 'Cycles in linked list', 'Binary search', 'Tree height'],
          correctAnswer: 'Cycles in linked list',
          solution: 'Floyd\'s cycle detection uses fast and slow pointers to detect cycles efficiently.'
        }
      ]
    }
  ],

  'Sliding Window': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Sliding window technique is used for:',
          options: ['Subarray/substring problems', 'Tree problems', 'Graph problems', 'Sorting problems'],
          correctAnswer: 'Subarray/substring problems',
          solution: 'Sliding window efficiently solves problems involving contiguous subarrays or substrings.'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'Time complexity of sliding window approach for fixed window size is:',
          options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(k×n)'],
          correctAnswer: 'O(n)',
          solution: 'Sliding window processes each element once, giving linear time complexity.'
        },
        {
          id: 3,
          type: 'fill',
          question: 'Maximum sum subarray of size k can be found using ___ technique',
          correctAnswer: 'sliding window',
          solution: 'Sliding window maintains sum of k elements and slides to find maximum sum.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Variable size sliding window is used when:',
          options: ['Window size is fixed', 'Window size changes based on condition', 'Array is sorted', 'Elements are unique'],
          correctAnswer: 'Window size changes based on condition',
          solution: 'Variable window expands/contracts based on problem-specific conditions.'
        }
      ]
    }
  ],
  
  'Linear Search': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'What is the time complexity of linear search?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctAnswer: 'O(n)',
          solution: 'Linear search checks each element sequentially, giving O(n) time complexity.'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'Linear search works on:',
          options: ['Only sorted arrays', 'Only unsorted arrays', 'Both sorted and unsorted arrays', 'Only linked lists'],
          correctAnswer: 'Both sorted and unsorted arrays',
          solution: 'Linear search can work on any sequence, regardless of whether it\'s sorted.'
        },
        {
          id: 3,
          type: 'fill',
          question: 'Best case time complexity of linear search is ___',
          correctAnswer: 'O(1)',
          solution: 'Best case occurs when the target element is found at the first position.'
        }
      ]
    }
  ],
  
  'Binary Search': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Binary search requires the array to be:',
          options: ['Unsorted', 'Sorted', 'Partially sorted', 'Any order'],
          correctAnswer: 'Sorted',
          solution: 'Binary search relies on the sorted property to eliminate half the search space.'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'Time complexity of binary search is:',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswer: 'O(log n)',
          solution: 'Binary search eliminates half the elements at each step, giving O(log n).'
        },
        {
          id: 3,
          type: 'fill',
          question: 'Space complexity of iterative binary search is ___',
          correctAnswer: 'O(1)',
          solution: 'Iterative binary search uses only a constant amount of extra space.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Binary search can be applied to find:',
          options: ['Only exact matches', 'Only first occurrence', 'First/last occurrence and bounds', 'Only in arrays'],
          correctAnswer: 'First/last occurrence and bounds',
          solution: 'Binary search variations can find lower bound, upper bound, first and last occurrences.'
        }
      ]
    }
  ],
  
  'Sorting Algorithms': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Which sorting algorithm has the best average case time complexity?',
          options: ['Bubble Sort', 'Insertion Sort', 'Selection Sort', 'Merge Sort'],
          correctAnswer: 'Merge Sort',
          solution: 'Merge sort consistently performs in O(n log n) time in all cases.'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'Which sorting algorithm is stable?',
          options: ['Selection Sort', 'Quick Sort', 'Heap Sort', 'Merge Sort'],
          correctAnswer: 'Merge Sort',
          solution: 'Stable sorting preserves relative order of equal elements; merge sort is stable.'
        },
        {
          id: 3,
          type: 'fill',
          question: 'Time complexity of bubble sort in worst case is ___',
          correctAnswer: 'O(n²)',
          solution: 'Bubble sort makes n-1 passes with up to n-1 comparisons each, giving O(n²).'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Which sort is best for nearly sorted arrays?',
          options: ['Quick Sort', 'Merge Sort', 'Insertion Sort', 'Heap Sort'],
          correctAnswer: 'Insertion Sort',
          solution: 'Insertion sort performs in O(n) time when array is nearly sorted.'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'Space complexity of merge sort is:',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctAnswer: 'O(n)',
          solution: 'Merge sort requires O(n) extra space for the temporary merge arrays.'
        },
        {
          id: 6,
          type: 'mcq',
          question: 'Quick sort worst case time complexity is:',
          options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
          correctAnswer: 'O(n²)',
          solution: 'Quick sort degrades to O(n²) when pivot is always the smallest or largest element.'
        }
      ]
    }
  ],
  
  'Graph Algorithms': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'BFS uses which data structure?',
          options: ['Stack', 'Queue', 'Priority Queue', 'Array'],
          correctAnswer: 'Queue',
          solution: 'BFS uses queue to process nodes level by level in FIFO order.'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'DFS uses which data structure?',
          options: ['Queue', 'Stack', 'Priority Queue', 'Deque'],
          correctAnswer: 'Stack',
          solution: 'DFS uses stack (or recursion) to explore as deep as possible before backtracking.'
        },
        {
          id: 3,
          type: 'fill',
          question: "Dijkstra's algorithm finds ___ path between vertices",
          correctAnswer: 'shortest',
          solution: "Dijkstra's algorithm finds shortest path from source to all other vertices."
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Which algorithm is used to find Minimum Spanning Tree?',
          options: ['Dijkstra', 'BFS', 'Kruskal', 'DFS'],
          correctAnswer: 'Kruskal',
          solution: "Kruskal's algorithm finds MST by selecting edges in increasing order of weights."
        },
        {
          id: 5,
          type: 'mcq',
          question: "Time complexity of Dijkstra's algorithm using binary heap is:",
          options: ['O(V²)', 'O(E log V)', 'O(V + E)', 'O(V log V)'],
          correctAnswer: 'O(E log V)',
          solution: 'With binary heap, each edge relaxation takes O(log V), giving O(E log V).'
        },
        {
          id: 6,
          type: 'mcq',
          question: 'Topological sorting works on:',
          options: ['Undirected graphs', 'Directed Acyclic Graphs', 'Cyclic graphs', 'Complete graphs'],
          correctAnswer: 'Directed Acyclic Graphs',
          solution: 'Topological sort is only possible for Directed Acyclic Graphs (DAGs).'
        }
      ]
    }
  ],
  
  'Recursion': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'What is essential for a recursive function?',
          options: ['Loop', 'Base case', 'Array', 'Pointer'],
          correctAnswer: 'Base case',
          solution: 'Base case prevents infinite recursion by providing termination condition.'
        },
        {
          id: 2,
          type: 'fill',
          question: 'Recursive calls are stored in ___',
          correctAnswer: 'stack',
          solution: 'Function call stack stores recursive calls and their local variables.'
        },
        {
          id: 3,
          type: 'mcq',
          question: 'Space complexity of recursive fibonacci is:',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctAnswer: 'O(n)',
          solution: 'Recursion depth for fibonacci is O(n), requiring O(n) stack space.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Which traversal naturally uses recursion?',
          options: ['BFS', 'Level order', 'DFS', 'Spiral traversal'],
          correctAnswer: 'DFS',
          solution: 'DFS explores deeply first, which naturally maps to recursive structure.'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'Tail recursion can be optimized to:',
          options: ['Use more stack space', 'Iterative solution', 'Slower execution', 'More memory usage'],
          correctAnswer: 'Iterative solution',
          solution: 'Tail recursion can be converted to iteration, eliminating stack overhead.'
        }
      ]
    }
  ],
  
  'Dynamic Programming': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Dynamic Programming is based on:',
          options: ['Divide and conquer', 'Greedy choice', 'Optimal substructure', 'Backtracking'],
          correctAnswer: 'Optimal substructure',
          solution: 'DP requires optimal substructure and overlapping subproblems properties.'
        },
        {
          id: 2,
          type: 'fill',
          question: 'DP technique that builds solution bottom-up is called ___',
          correctAnswer: 'tabulation',
          solution: 'Tabulation builds solution iteratively from smaller subproblems to larger ones.'
        },
        {
          id: 3,
          type: 'mcq',
          question: 'Which technique reduces time complexity of recursive fibonacci from O(2^n) to O(n)?',
          options: ['Greedy', 'Backtracking', 'Memoization', 'Divide and conquer'],
          correctAnswer: 'Memoization',
          solution: 'Memoization stores computed results to avoid redundant calculations.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Longest Common Subsequence is a classic example of:',
          options: ['Greedy algorithm', 'Dynamic programming', 'Backtracking', 'Divide and conquer'],
          correctAnswer: 'Dynamic programming',
          solution: 'LCS exhibits optimal substructure and overlapping subproblems, perfect for DP.'
        },
        {
          id: 5,
          type: 'mcq',
          question: '0/1 Knapsack problem uses:',
          options: ['Greedy approach', 'Dynamic programming', 'Brute force only', 'Linear search'],
          correctAnswer: 'Dynamic programming',
          solution: '0/1 Knapsack has overlapping subproblems and optimal substructure, solved by DP.'
        }
      ]
    }
  ],
  
  'Greedy Algorithms': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Greedy algorithm makes:',
          options: ['Global optimal choice', 'Local optimal choice', 'Random choice', 'All possible choices'],
          correctAnswer: 'Local optimal choice',
          solution: 'Greedy algorithms make locally optimal choices hoping to find global optimum.'
        },
        {
          id: 2,
          type: 'fill',
          question: 'Activity selection problem is solved using ___ algorithm',
          correctAnswer: 'greedy',
          solution: 'Activity selection can be optimally solved by selecting activities with earliest finish time.'
        },
        {
          id: 3,
          type: 'mcq',
          question: 'Which property must hold for greedy algorithm to work?',
          options: ['Optimal substructure', 'Greedy choice property', 'Overlapping subproblems', 'Both A and B'],
          correctAnswer: 'Both A and B',
          solution: 'Greedy algorithms require both optimal substructure and greedy choice property.'
        },
        {
          id: 4,
          type: 'mcq',
          question: "Huffman coding is an example of:",
          options: ['Dynamic programming', 'Greedy algorithm', 'Backtracking', 'Divide and conquer'],
          correctAnswer: 'Greedy algorithm',
          solution: 'Huffman coding greedily merges nodes with minimum frequencies.'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'Fractional Knapsack uses:',
          options: ['Dynamic programming', 'Greedy approach', 'Backtracking', 'Brute force'],
          correctAnswer: 'Greedy approach',
          solution: 'Fractional knapsack greedily picks items with highest value-to-weight ratio.'
        }
      ]
    }
  ],
  
  'Divide and Conquer': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Divide and conquer strategy involves:',
          options: ['Only dividing', 'Only conquering', 'Divide, conquer, and combine', 'Random processing'],
          correctAnswer: 'Divide, conquer, and combine',
          solution: 'D&C divides problem, solves subproblems, then combines solutions.'
        },
        {
          id: 2,
          type: 'mcq',
          question: 'Which algorithm uses divide and conquer?',
          options: ['Linear search', 'Bubble sort', 'Merge sort', 'Insertion sort'],
          correctAnswer: 'Merge sort',
          solution: 'Merge sort divides array, sorts subarrays, then merges them.'
        },
        {
          id: 3,
          type: 'fill',
          question: 'Master theorem is used to analyze ___ algorithms',
          correctAnswer: 'divide and conquer',
          solution: 'Master theorem provides framework for analyzing divide and conquer recurrences.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Time complexity of typical divide and conquer algorithm is:',
          options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
          correctAnswer: 'O(n log n)',
          solution: 'Many D&C algorithms have O(log n) levels with O(n) work per level.'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'Maximum subarray problem can be solved using:',
          options: ['Greedy only', 'DP only', 'Divide and conquer', 'All of the above'],
          correctAnswer: 'All of the above',
          solution: 'Maximum subarray has multiple solution approaches with different complexities.'
        }
      ]
    }
  ],
  // Add these new topics to your existing quizData object:

'Matrix Problems': [
  {
    id: 1,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Time complexity of rotating a matrix by 90 degrees is:',
        options: ['O(n)', 'O(n²)', 'O(n³)', 'O(log n)'],
        correctAnswer: 'O(n²)',
        solution: 'Matrix rotation requires visiting each element once, giving O(n²) complexity for n×n matrix.'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'To find element in row-wise and column-wise sorted matrix, best approach is:',
        options: ['Linear search', 'Binary search on each row', 'Start from top-right corner', 'BFS'],
        correctAnswer: 'Start from top-right corner',
        solution: 'Starting from top-right, we can eliminate either row or column in each step, giving O(m+n).'
      },
      {
        id: 3,
        type: 'fill',
        question: 'In spiral matrix traversal, we maintain ___ boundaries',
        correctAnswer: 'four',
        solution: 'We maintain top, bottom, left, and right boundaries to traverse matrix spirally.'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'Space complexity of in-place matrix transpose is:',
        options: ['O(1)', 'O(n)', 'O(n²)', 'O(n log n)'],
        correctAnswer: 'O(1)',
        solution: 'In-place transpose swaps elements without using extra space.'
      },
      {
        id: 5,
        type: 'mcq',
        question: 'Maximum sum rectangle in matrix can be found using:',
        options: ['Greedy approach', 'Kadane\'s algorithm', 'Dynamic programming', 'Backtracking'],
        correctAnswer: 'Kadane\'s algorithm',
        solution: 'We apply Kadane\'s algorithm on column-wise sums for each row pair combination.'
      }
    ]
  }
],

'Prefix Sum': [
  {
    id: 1,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Time complexity of range sum query using prefix sum is:',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
        correctAnswer: 'O(1)',
        solution: 'After O(n) preprocessing, each range sum query takes constant time.'
      },
      {
        id: 2,
        type: 'fill',
        question: 'Sum of elements from index i to j using prefix sum is: prefix[j+1] - ___',
        correctAnswer: 'prefix[i]',
        solution: 'Range sum from i to j is prefix[j+1] - prefix[i] in 0-indexed array.'
      },
      {
        id: 3,
        type: 'mcq',
        question: '2D prefix sum preprocessing takes time complexity of:',
        options: ['O(n)', 'O(n²)', 'O(n³)', 'O(n log n)'],
        correctAnswer: 'O(n²)',
        solution: '2D prefix sum requires computing cumulative sum for each cell in O(n²) time.'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'Prefix sum technique is used to solve:',
        options: ['Sorting problems', 'Range query problems', 'Graph problems', 'String problems'],
        correctAnswer: 'Range query problems',
        solution: 'Prefix sum efficiently answers multiple range sum queries in constant time.'
      }
    ]
  }
],

'Binary Indexed Tree': [
  {
    id: 1,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Binary Indexed Tree is also known as:',
        options: ['Segment Tree', 'Fenwick Tree', 'AVL Tree', 'B-Tree'],
        correctAnswer: 'Fenwick Tree',
        solution: 'BIT was invented by Peter Fenwick and is commonly called Fenwick Tree.'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'Time complexity of update and query operations in BIT is:',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 'O(log n)',
        solution: 'BIT height is O(log n), so both update and prefix sum query take O(log n) time.'
      },
      {
        id: 3,
        type: 'fill',
        question: 'BIT uses ___ representation to efficiently compute prefix sums',
        correctAnswer: 'binary',
        solution: 'BIT uses binary representation of indices to determine parent-child relationships.'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'Space complexity of Binary Indexed Tree is:',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 'O(n)',
        solution: 'BIT requires exactly n+1 space to store the tree structure.'
      }
    ]
  }
],

'Advanced Graph Algorithms': [
  {
    id: 1,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Floyd-Warshall algorithm finds:',
        options: ['Single source shortest path', 'All pairs shortest path', 'Minimum spanning tree', 'Topological order'],
        correctAnswer: 'All pairs shortest path',
        solution: 'Floyd-Warshall computes shortest paths between all pairs of vertices.'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'Time complexity of Floyd-Warshall algorithm is:',
        options: ['O(V²)', 'O(V³)', 'O(E log V)', 'O(VE)'],
        correctAnswer: 'O(V³)',
        solution: 'Floyd-Warshall uses three nested loops over all vertices, giving O(V³).'
      },
      {
        id: 3,
        type: 'fill',
        question: 'Tarjan\'s algorithm is used to find ___ in a graph',
        correctAnswer: 'strongly connected components',
        solution: 'Tarjan\'s algorithm efficiently finds SCCs using DFS and low-link values.'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'Bellman-Ford algorithm can detect:',
        options: ['Positive cycles', 'Negative cycles', 'Euler paths', 'Hamiltonian cycles'],
        correctAnswer: 'Negative cycles',
        solution: 'Bellman-Ford can detect negative weight cycles in the graph.'
      },
      {
        id: 5,
        type: 'mcq',
        question: 'A* search algorithm uses:',
        options: ['BFS only', 'DFS only', 'Heuristic function', 'Random selection'],
        correctAnswer: 'Heuristic function',
        solution: 'A* uses heuristic function to guide search towards goal efficiently.'
      }
    ]
  }
],

'Number Theory': [
  {
    id: 1,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Euclidean algorithm is used to find:',
        options: ['Prime numbers', 'GCD of two numbers', 'LCM of two numbers', 'Perfect squares'],
        correctAnswer: 'GCD of two numbers',
        solution: 'Euclidean algorithm efficiently computes Greatest Common Divisor using repeated division.'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'Time complexity of Euclidean algorithm is:',
        options: ['O(1)', 'O(log min(a,b))', 'O(max(a,b))', 'O(a×b)'],
        correctAnswer: 'O(log min(a,b))',
        solution: 'Euclidean algorithm takes logarithmic time in the smaller of the two numbers.'
      },
      {
        id: 3,
        type: 'fill',
        question: 'Sieve of Eratosthenes is used to find all ___ up to n',
        correctAnswer: 'prime numbers',
        solution: 'Sieve of Eratosthenes efficiently finds all prime numbers up to a given limit.'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'Modular exponentiation a^b mod m can be computed in:',
        options: ['O(b)', 'O(log b)', 'O(a×b)', 'O(m)'],
        correctAnswer: 'O(log b)',
        solution: 'Using binary exponentiation, we can compute modular exponentiation in O(log b) time.'
      },
      {
        id: 5,
        type: 'mcq',
        question: 'Fermat\'s Little Theorem states that if p is prime and a is not divisible by p:',
        options: ['a^p ≡ a (mod p)', 'a^(p-1) ≡ 1 (mod p)', 'a^2 ≡ 1 (mod p)', 'a ≡ p (mod p)'],
        correctAnswer: 'a^(p-1) ≡ 1 (mod p)',
        solution: 'Fermat\'s Little Theorem: if p is prime and gcd(a,p)=1, then a^(p-1) ≡ 1 (mod p).'
      }
    ]
  }
],

'Game Theory': [
  {
    id: 1,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Nim game is an example of:',
        options: ['Zero-sum game', 'Cooperative game', 'Perfect information game', 'All of the above'],
        correctAnswer: 'All of the above',
        solution: 'Nim is zero-sum, non-cooperative, and has perfect information for both players.'
      },
      {
        id: 2,
        type: 'fill',
        question: 'In Nim game, winning strategy is based on ___ of pile sizes',
        correctAnswer: 'XOR',
        solution: 'Player in winning position when XOR of all pile sizes is non-zero.'
      },
      {
        id: 3,
        type: 'mcq',
        question: 'Grundy number is used in:',
        options: ['Sorting algorithms', 'Impartial games', 'Graph coloring', 'Matrix operations'],
        correctAnswer: 'Impartial games',
        solution: 'Grundy numbers help analyze impartial games and determine winning positions.'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'In game theory, a position where current player will lose with optimal play is called:',
        options: ['Winning position', 'Losing position', 'Draw position', 'Neutral position'],
        correctAnswer: 'Losing position',
        solution: 'Losing position means current player loses if both players play optimally.'
      }
    ]
  }
],

'Advanced String Algorithms': [
  {
    id: 1,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Z-algorithm is used for:',
        options: ['String sorting', 'Pattern matching', 'String compression', 'Palindrome detection'],
        correctAnswer: 'Pattern matching',
        solution: 'Z-algorithm finds all occurrences of pattern in text in linear time.'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'Time complexity of building suffix array using naive approach is:',
        options: ['O(n)', 'O(n log n)', 'O(n² log n)', 'O(n³)'],
        correctAnswer: 'O(n² log n)',
        solution: 'Naive suffix array construction sorts n suffixes, each comparison takes O(n) time.'
      },
      {
        id: 3,
        type: 'fill',
        question: 'Manacher\'s algorithm is used to find all ___ in linear time',
        correctAnswer: 'palindromes',
        solution: 'Manacher\'s algorithm finds all palindromic substrings in O(n) time.'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'Rolling hash is primarily used in:',
        options: ['Sorting', 'String matching', 'Graph traversal', 'Tree construction'],
        correctAnswer: 'String matching',
        solution: 'Rolling hash enables efficient string comparison in algorithms like Rabin-Karp.'
      },
      {
        id: 5,
        type: 'mcq',
        question: 'Longest Common Prefix (LCP) array is used with:',
        options: ['Hash tables', 'Suffix arrays', 'Tries only', 'Binary trees'],
        correctAnswer: 'Suffix arrays',
        solution: 'LCP array stores longest common prefixes between adjacent suffixes in suffix array.'
      }
    ]
  }
],

'Computational Geometry': [
  {
    id: 1,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Convex Hull algorithms like Graham Scan have time complexity:',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
        correctAnswer: 'O(n log n)',
        solution: 'Graham Scan sorts points by angle, then processes in linear time, giving O(n log n).'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'To check if point lies inside a polygon, we can use:',
        options: ['Ray casting algorithm', 'Convex hull', 'Dijkstra\'s algorithm', 'Binary search'],
        correctAnswer: 'Ray casting algorithm',
        solution: 'Ray casting counts intersections of ray from point with polygon edges.'
      },
      {
        id: 3,
        type: 'fill',
        question: 'Cross product of two 2D vectors gives the ___ of parallelogram',
        correctAnswer: 'area',
        solution: 'Cross product magnitude equals area of parallelogram formed by the vectors.'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'Closest pair of points problem can be solved in:',
        options: ['O(n²)', 'O(n log n)', 'O(n³)', 'O(n log² n)'],
        correctAnswer: 'O(n log n)',
        solution: 'Divide and conquer approach solves closest pair problem in O(n log n) time.'
      }
    ]
  }
],

'Advanced Dynamic Programming': [
  {
    id: 1,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Digit DP is used to solve problems involving:',
        options: ['Arrays', 'Strings', 'Number ranges', 'Graphs'],
        correctAnswer: 'Number ranges',
        solution: 'Digit DP counts numbers in range satisfying certain digit-based constraints.'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'Bitmask DP is effective when:',
        options: ['n is very large', 'n ≤ 20', 'Working with strings', 'Memory is unlimited'],
        correctAnswer: 'n ≤ 20',
        solution: 'Bitmask DP uses 2^n states, practical only for small n (typically ≤ 20).'
      },
      {
        id: 3,
        type: 'fill',
        question: 'Matrix exponentiation is used to optimize DP recurrences with ___ complexity',
        correctAnswer: 'logarithmic',
        solution: 'Matrix exponentiation reduces linear recurrence from O(n) to O(log n).'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'Convex Hull Optimization (CHT) optimizes DP transitions from:',
        options: ['O(n) to O(1)', 'O(n²) to O(n log n)', 'O(n³) to O(n²)', 'O(2^n) to O(n²)'],
        correctAnswer: 'O(n²) to O(n log n)',
        solution: 'CHT reduces quadratic DP transition to O(n log n) using convex hull of lines.'
      },
      {
        id: 5,
        type: 'mcq',
        question: 'Divide and Conquer DP is applicable when:',
        options: ['Quadrilateral inequality holds', 'Problem has cycles', 'Memory is limited', 'n is small'],
        correctAnswer: 'Quadrilateral inequality holds',
        solution: 'D&C DP optimizes certain 2D DP problems satisfying quadrilateral inequality.'
      }
    ]
  }
],

'Network Flow': [
  {
    id: 1,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Ford-Fulkerson algorithm is used to find:',
        options: ['Shortest path', 'Maximum flow', 'Minimum spanning tree', 'Strongly connected components'],
        correctAnswer: 'Maximum flow',
        solution: 'Ford-Fulkerson finds maximum flow from source to sink in flow network.'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'Time complexity of Edmonds-Karp algorithm is:',
        options: ['O(V²E)', 'O(VE²)', 'O(V³)', 'O(E³)'],
        correctAnswer: 'O(VE²)',
        solution: 'Edmonds-Karp uses BFS to find augmenting paths, giving O(VE²) complexity.'
      },
      {
        id: 3,
        type: 'fill',
        question: 'Maximum bipartite matching can be solved using ___ flow',
        correctAnswer: 'maximum',
        solution: 'Bipartite matching reduces to maximum flow with unit capacity edges.'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'Min-cut Max-flow theorem states that:',
        options: ['Min cut < Max flow', 'Min cut > Max flow', 'Min cut = Max flow', 'No relation'],
        correctAnswer: 'Min cut = Max flow',
        solution: 'The value of maximum flow equals capacity of minimum cut in any flow network.'
      }
    ]
  }
]
,
  'Backtracking': [
    {
      id: 1,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'Backtracking is used to solve:',
          options: ['Optimization problems', 'Constraint satisfaction problems', 'Sorting problems', 'Search problems'],
          correctAnswer: 'Constraint satisfaction problems',
          solution: 'Backtracking systematically explores solution space for constraint satisfaction.'
        },
        {
          id: 2,
          type: 'fill',
          question: 'N-Queens problem is solved using ___',
          correctAnswer: 'backtracking',
          solution: 'N-Queens uses backtracking to place queens while avoiding conflicts.'
        },
        {
          id: 3,
          type: 'mcq',
          question: 'When does backtracking abandon a partial solution?',
          options: ['When solution is complete', 'When constraint is violated', 'When time limit exceeded', 'Randomly'],
          correctAnswer: 'When constraint is violated',
          solution: 'Backtracking prunes search space when partial solution violates constraints.'
        },
        {
          id: 4,
          type: 'mcq',
          question: 'Sudoku solver typically uses:',
          options: ['Greedy approach', 'Dynamic programming', 'Backtracking', 'Divide and conquer'],
          correctAnswer: 'Backtracking',
          solution: 'Sudoku solver tries values and backtracks when constraints are violated.'
        },
        {
          id: 5,
          type: 'mcq',
          question: 'Time complexity of backtracking is generally:',
          options: ['Polynomial', 'Exponential', 'Logarithmic', 'Linear'],
          correctAnswer: 'Exponential',
          solution: 'Backtracking explores exponential search space in worst case scenarios.'
        }
      ]
    }
  ]
}

const Quiz: React.FC = () => {
  const router = useRouter()
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [topicScores, setTopicScores] = useState<{ [topic: string]: { correct: number, total: number } }>({})

  useEffect(() => {
    const stored = localStorage.getItem('quizResults')
    if (stored) {
      setTopicScores(JSON.parse(stored))
    }
  }, [])

  const selectTopic = (topic: string) => {
    setSelectedTopic(topic)
    setSelectedAssignment(null)
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
  }

  const selectAssignment = (assignmentId: number) => {
    setSelectedAssignment(assignmentId)
    setCurrentQuestion(0)
    const assignment = quizData[selectedTopic!].find(a => a.id === assignmentId)
    setAnswers(new Array(assignment!.questions.length).fill(''))
    setShowResults(false)
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    const assignment = quizData[selectedTopic!].find(a => a.id === selectedAssignment!)
    if (currentQuestion < assignment!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const assignment = quizData[selectedTopic!].find(a => a.id === selectedAssignment!)
    let correct = 0

    assignment!.questions.forEach((q, index) => {
      if (answers[index].toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        correct++
      }
    })

    setScore(correct)

    const newTopicScores = { ...topicScores }
    if (!newTopicScores[selectedTopic!]) {
      newTopicScores[selectedTopic!] = { correct: 0, total: 0 }
    }
    newTopicScores[selectedTopic!].correct += correct
    newTopicScores[selectedTopic!].total += assignment!.questions.length

    setTopicScores(newTopicScores)
    localStorage.setItem('quizResults', JSON.stringify(newTopicScores))
    setShowResults(true)
  }

  const resetQuiz = () => {
    setSelectedTopic(null)
    setSelectedAssignment(null)
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setScore(0)
  }

  // Calculate total questions
  const totalQuestions = Object.values(quizData).reduce((total, assignments) => {
    return total + assignments.reduce((sum, assignment) => sum + assignment.questions.length, 0)
  }, 0)

  if (!selectedTopic) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card-border p-6">
          <div className="flex justify-end mb-4">
            <Button onClick={() => router.push('/')} variant="outline">Close</Button>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-center">Data Structures & Algorithms Quiz</h2>
          <p className="text-center text-gray-600 mb-8">Master DSA concepts with comprehensive practice questions</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.keys(quizData).map((topic) => {
              const topicQuestions = quizData[topic].reduce((sum, assignment) => sum + assignment.questions.length, 0)
              const topicScore = topicScores[topic]
              const percentage = topicScore ? Math.round((topicScore.correct / topicScore.total) * 100) : 0
              
              return (
                <Button
                  key={topic}
                  onClick={() => selectTopic(topic)}
                  className="btn-primary h-24 text-sm font-semibold flex flex-col justify-center items-center gap-1 relative"
                >
                  <span className="text-center leading-tight">{topic}</span>
                  <span className="text-xs opacity-80">({topicQuestions} questions)</span>
                  {topicScore && (
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded absolute top-1 right-1">
                      {percentage}%
                    </span>
                  )}
                </Button>
              )
            })}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600 mb-2">
              <strong>Total Questions:</strong> {totalQuestions} | <strong>Topics:</strong> {Object.keys(quizData).length}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>🔹 Arrays & Linked Lists</span>
              <span>🔹 Trees & Graphs</span>
              <span>🔹 Sorting & Searching</span>
              <span>🔹 Dynamic Programming</span>
              <span>🔹 Advanced Data Structures</span>
              <span>🔹 Number Theory</span>
              <span>🔹 Graph Algorithms</span>

            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!selectedAssignment) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card-border p-6">
          <div className="flex justify-end mb-4">
            <Button onClick={() => router.push('/')} variant="outline">Close</Button>
          </div>
          <h2 className="text-2xl font-bold mb-4">{selectedTopic} Practice</h2>
          <p className="text-gray-600 mb-6">Select a practice set to begin</p>
          
          <div className="grid grid-cols-1 gap-4">
            {quizData[selectedTopic].map((assignment) => (
              <Button
                key={assignment.id}
                onClick={() => selectAssignment(assignment.id)}
                className="btn-primary h-16 text-lg flex justify-between items-center"
              >
                <span>Practice Set {assignment.id}</span>
                <span className="text-sm opacity-80">({assignment.questions.length} Questions)</span>
              </Button>
            ))}
          </div>
          
          <Button onClick={resetQuiz} variant="outline" className="mt-6 w-full">
            ← Back to Topics
          </Button>
        </div>
      </div>
    )
  }

  if (showResults) {
    const assignment = quizData[selectedTopic].find(a => a.id === selectedAssignment!)
    const percentage = Math.round((score / assignment!.questions.length) * 100)
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card-border p-6">
          <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
          
          <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <p className="text-5xl font-bold text-primary mb-2">{score}/{assignment!.questions.length}</p>
            <p className="text-xl text-gray-700">Score: {percentage}%</p>
            <div className="mt-4">
              {percentage >= 90 && <p className="text-green-600 font-semibold">🎉 Excellent! Master level!</p>}
              {percentage >= 70 && percentage < 90 && <p className="text-blue-600 font-semibold">👏 Good job! Keep practicing!</p>}
              {percentage >= 50 && percentage < 70 && <p className="text-yellow-600 font-semibold">📚 Not bad! Review the concepts!</p>}
              {percentage < 50 && <p className="text-red-600 font-semibold">💪 Keep learning! Practice more!</p>}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">📖 Detailed Solutions:</h3>
            <div className="space-y-4">
              {assignment!.questions.map((q, index) => {
                const isCorrect = answers[index]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
                return (
                  <div key={q.id} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    <p className="font-semibold mb-2">Q{index + 1}: {q.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <p className="text-green-700">✅ <strong>Correct:</strong> {q.correctAnswer}</p>
                      <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {isCorrect ? '✅' : '❌'} <strong>Your Answer:</strong> {answers[index] || 'Not answered'}
                      </p>
                    </div>
                    <p className="text-gray-700 mt-2 text-sm italic">{q.solution}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={resetQuiz} className="btn-primary flex-1">
              🏠 Back to Topics
            </Button>
            <Button onClick={() => setSelectedAssignment(null)} variant="outline" className="flex-1">
              📝 Try Another Practice Set
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const assignment = quizData[selectedTopic].find(a => a.id === selectedAssignment!)
  const question = assignment!.questions[currentQuestion]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-border p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600 font-medium">
              Question {currentQuestion + 1} of {assignment!.questions.length}
            </p>
            <div className="text-right">
              <p className="text-sm text-gray-600">{selectedTopic}</p>
              <p className="text-xs text-gray-500">Practice Set {selectedAssignment}</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestion + 1) / assignment!.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6 leading-relaxed">{question.question}</h3>

          {question.type === 'mcq' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={answers[currentQuestion] === option ? "default" : "outline"}
                  className="w-full text-left justify-start p-4 h-auto hover:bg-blue-50 transition-colors"
                  onClick={() => handleAnswer(option)}
                >
                  <span className="font-bold mr-4 text-blue-600 min-w-[24px]">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-gray-800">{option}</span>
                </Button>
              ))}
            </div>
          )}

          {question.type === 'fill' && (
            <div className="space-y-3">
              <Label htmlFor="answer" className="text-lg font-medium">Your Answer:</Label>
              <Input
                id="answer"
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="text-lg p-4 border-2 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            variant="outline"
            className="px-6 py-2"
          >
            ← Previous
          </Button>
          
          <span className="text-sm text-gray-500">
            {answers.filter(a => a && a.trim()).length} / {assignment!.questions.length} answered
          </span>
          
          <Button
            onClick={nextQuestion}
            disabled={!answers[currentQuestion] || !answers[currentQuestion].trim()}
            className="btn-primary px-6 py-2"
          >
            {currentQuestion === assignment!.questions.length - 1 ? 'Finish Quiz 🎯' : 'Next →'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Quiz
