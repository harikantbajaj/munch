'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Clock, 
  TrendingUp, 
  Code, 
  BookOpen, 
  Star, 
  CheckCircle2,
  PlayCircle,
  Copy,
  ExternalLink
} from 'lucide-react'

interface Solution {
  code: string
  explanation: string
  timeComplexity: string
  spaceComplexity: string
  approach: string
  keyPoints: string[]
  variations?: string[]
}

interface Problem {
  id: number
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  tags: string[]
  frequency: number // Interview frequency 1-5
  companies: string[]
  solutions: { [language: string]: Solution }
  hints: string[]
  followUp: string[]
  similar: number[]
}

const problems: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'Easy',
    category: 'Array',
    tags: ['Hash Table', 'Array'],
    frequency: 5,
    companies: ['Amazon', 'Google', 'Apple', 'Microsoft', 'Facebook'],
    hints: [
      'Try using a hash map to store numbers and their indices',
      'For each number, check if its complement (target - number) exists in the map',
      'Return immediately when complement is found'
    ],
    followUp: [
      'What if the array is sorted?',
      'What if we need to return all pairs?',
      'What about Three Sum problem?'
    ],
    similar: [15, 167, 170],
    solutions: {
      'Python': {
        code: `def twoSum(nums, target):
    """
    Hash Map Approach - Single Pass
    Time: O(n), Space: O(n)
    """
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        # Check if complement exists in our hash map
        if complement in seen:
            return [seen[complement], i]
        
        # Store current number and its index
        seen[num] = i
    
    return []  # No solution found

# Alternative: Brute Force O(n²)
def twoSumBruteForce(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
        explanation: 'We use a hash map to store each number with its index as we iterate. For each number, we calculate its complement (target - current number) and check if it exists in our map. If found, we return both indices immediately.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        approach: 'Hash Map - Single Pass',
        keyPoints: [
          'Hash map provides O(1) average lookup time',
          'We only need one pass through the array',
          'Store numbers as keys, indices as values',
          'Check complement before storing current number'
        ],
        variations: [
          'Two Sum II - Input array is sorted (use two pointers)',
          'Two Sum III - Data structure design',
          'Two Sum IV - Input is a BST'
        ]
      },
      'Java': {
        code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        
        // Check if complement exists
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        
        // Store current number and index
        map.put(nums[i], i);
    }
    
    return new int[0]; // No solution
}

// Using Java 8 Streams (less efficient but functional)
public int[] twoSumStreams(int[] nums, int target) {
    Map<Integer, Integer> map = IntStream.range(0, nums.length)
        .boxed()
        .collect(Collectors.toMap(i -> nums[i], i -> i, (a, b) -> b));
    
    return IntStream.range(0, nums.length)
        .filter(i -> map.containsKey(target - nums[i]) && 
                    map.get(target - nums[i]) != i)
        .mapToObj(i -> new int[]{i, map.get(target - nums[i])})
        .findFirst()
        .orElse(new int[0]);
}`,
        explanation: 'HashMap in Java provides efficient key-value storage. We iterate once, checking if each number\'s complement exists in the map before adding the current number.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        approach: 'Hash Map - Single Pass',
        keyPoints: [
          'HashMap.containsKey() is O(1) average case',
          'Use boxed arrays for return type',
          'Handle edge cases with proper return values',
          'Map.put() returns previous value if key existed'
        ],
        variations: [
          'Use TreeMap for sorted order (O(log n) operations)',
          'Use primitive collections for better performance',
          'Stream API for functional programming style'
        ]
      },
      'JavaScript': {
        code: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        // Check if complement exists
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        // Store current number and index
        map.set(nums[i], i);
    }
    
    return []; // No solution
}

// ES6 Alternative with reduce
const twoSumReduce = (nums, target) => {
    const map = new Map();
    
    return nums.reduce((result, num, i) => {
        if (result.length) return result;
        
        const complement = target - num;
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(num, i);
        return result;
    }, []);
};

// Using Object instead of Map (slightly less efficient)
function twoSumObject(nums, target) {
    const seen = {};
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (complement in seen) {
            return [seen[complement], i];
        }
        
        seen[nums[i]] = i;
    }
    
    return [];
}`,
        explanation: 'Map object provides better performance than plain objects for frequent additions/deletions. We use has() and get() methods for clean code.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        approach: 'Hash Map - Single Pass',
        keyPoints: [
          'Map vs Object: Map allows any key type',
          'Map.has() is more explicit than "in" operator',
          'Destructuring can make code more concise',
          'Consider using reduce for functional style'
        ],
        variations: [
          'Use WeakMap if nums contains objects',
          'Use Set for existence checking only',
          'Functional programming with reduce/filter'
        ]
      },
      'C++': {
        code: `#include <unordered_map>
#include <vector>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> seen;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            // Check if complement exists
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            
            // Store current number and index
            seen[nums[i]] = i;
        }
        
        return {}; // No solution
    }
    
    // Alternative using count() method
    std::vector<int> twoSumCount(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> seen;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (seen.count(complement)) {
                return {seen[complement], i};
            }
            
            seen[nums[i]] = i;
        }
        
        return {};
    }
};`,
        explanation: 'unordered_map provides average O(1) lookup time. We use find() != end() or count() to check existence, then access the value.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        approach: 'Hash Map - Single Pass',
        keyPoints: [
          'unordered_map vs map: former is hash table, latter is tree',
          'find() returns iterator, check against end()',
          'count() returns 0 or 1 for unique keys',
          'Brace initialization for return vector'
        ],
        variations: [
          'Use std::map for ordered traversal',
          'Use std::pair for cleaner return type',
          'Template function for generic types'
        ]
      },
      'C#': {
        code: `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        Dictionary<int, int> seen = new Dictionary<int, int>();
        
        for (int i = 0; i < nums.Length; i++) {
            int complement = target - nums[i];
            
            // Check if complement exists
            if (seen.ContainsKey(complement)) {
                return new int[] { seen[complement], i };
            }
            
            // Store current number and index
            seen[nums[i]] = i;
        }
        
        return new int[0]; // No solution
    }
    
    // Using LINQ (less efficient but more readable)
    public int[] TwoSumLinq(int[] nums, int target) {
        var indexed = nums.Select((value, index) => new { value, index })
                         .ToArray();
        
        var lookup = indexed.ToLookup(x => x.value, x => x.index);
        
        return indexed
            .Where(x => lookup.Contains(target - x.value))
            .Where(x => lookup[target - x.value].Any(idx => idx != x.index))
            .Select(x => new int[] { 
                x.index, 
                lookup[target - x.value].First(idx => idx != x.index) 
            })
            .FirstOrDefault() ?? new int[0];
    }
    
    // Using TryGetValue (slightly more efficient)
    public int[] TwoSumTryGet(int[] nums, int target) {
        Dictionary<int, int> seen = new Dictionary<int, int>();
        
        for (int i = 0; i < nums.Length; i++) {
            int complement = target - nums[i];
            
            if (seen.TryGetValue(complement, out int complementIndex)) {
                return new int[] { complementIndex, i };
            }
            
            seen[nums[i]] = i;
        }
        
        return new int[0];
    }
}`,
        explanation: 'Dictionary<TKey, TValue> is C#\'s hash table implementation. ContainsKey() checks existence, while TryGetValue() is more efficient for get operations.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        approach: 'Hash Map - Single Pass',
        keyPoints: [
          'Dictionary vs Hashtable: former is generic and type-safe',
          'TryGetValue avoids double lookup',
          'LINQ provides functional programming style',
          'out parameter for TryGetValue'
        ],
        variations: [
          'Use SortedDictionary for ordered keys',
          'Use ConcurrentDictionary for thread safety',
          'LINQ methods for functional approach'
        ]
      },
      'Ruby': {
        code: `# Hash approach
def two_sum(nums, target)
    seen = {}
    
    nums.each_with_index do |num, i|
        complement = target - num
        
        # Check if complement exists
        return [seen[complement], i] if seen.key?(complement)
        
        # Store current number and index
        seen[num] = i
    end
    
    [] # No solution
end

# Alternative with select and find
def two_sum_functional(nums, target)
    indexed_nums = nums.each_with_index.to_a
    seen = {}
    
    result = indexed_nums.find do |num, i|
        complement = target - num
        if seen.key?(complement)
            return [seen[complement], i]
        end
        seen[num] = i
        false
    end
    
    []
end

# Using inject/reduce
def two_sum_reduce(nums, target)
    nums.each_with_index.inject({}) do |seen, (num, i)|
        complement = target - num
        return [seen[complement], i] if seen.key?(complement)
        seen.merge(num => i)
    end
    []
end`,
        explanation: 'Ruby Hash provides key-value storage. We use key?() method to check existence and each_with_index for iteration with indices.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        approach: 'Hash Map - Single Pass',
        keyPoints: [
          'each_with_index provides both value and index',
          'key?() method checks key existence',
          'Return from block exits the method',
          'inject/reduce for functional style'
        ],
        variations: [
          'Use symbols as keys for better performance',
          'Use OpenStruct for object-like access',
          'Functional programming with select/find'
        ]
      }
    }
  },
  // Adding more comprehensive problems...
  {
    id: 11,
    title: 'Container With Most Water',
    description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container that can hold the most water.',
    difficulty: 'Medium',
    category: 'Array',
    tags: ['Two Pointers', 'Array', 'Greedy'],
    frequency: 4,
    companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    hints: [
      'Use two pointers, one at the beginning and one at the end',
      'The area is determined by the shorter line',
      'Move the pointer pointing to the shorter line inward'
    ],
    followUp: [
      'What if we need to find the container with exactly k lines?',
      'Can you solve it in O(n) time with O(1) space?'
    ],
    similar: [42, 84],
    solutions: {
      'Python': {
        code: `def maxArea(height):
    """
    Two Pointers Approach
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        # Calculate current area
        width = right - left
        current_height = min(height[left], height[right])
        current_area = width * current_height
        
        # Update maximum area
        max_water = max(max_water, current_area)
        
        # Move pointer with shorter height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water

# Alternative: More explicit version
def maxAreaExplicit(height):
    max_area = 0
    left, right = 0, len(height) - 1
    
    while left < right:
        # Calculate area with current boundaries
        area = min(height[left], height[right]) * (right - left)
        max_area = max(max_area, area)
        
        # Move the pointer with smaller height
        if height[left] <= height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area`,
        explanation: 'We use two pointers starting from both ends. The area is limited by the shorter line, so we always move the pointer at the shorter line inward, hoping to find a taller line.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        approach: 'Two Pointers - Greedy',
        keyPoints: [
          'Area = min(height[left], height[right]) * (right - left)',
          'Always move the pointer with shorter height',
          'This greedy approach ensures we don\'t miss the optimal solution',
          'Single pass through the array'
        ],
        variations: [
          'Find all containers with area >= k',
          'Return the indices of the optimal container',
          '3D version with multiple dimensions'
        ]
      },
      'Java': {
        code: `public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxWater = 0;
    
    while (left < right) {
        // Calculate current area
        int width = right - left;
        int currentHeight = Math.min(height[left], height[right]);
        int currentArea = width * currentHeight;
        
        // Update maximum
        maxWater = Math.max(maxWater, currentArea);
        
        // Move pointer with shorter height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}

// Optimized version avoiding redundant calculations
public int maxAreaOptimized(int[] height) {
    int left = 0, right = height.length - 1;
    int maxWater = 0;
    
    while (left < right) {
        int leftHeight = height[left];
        int rightHeight = height[right];
        int width = right - left;
        
        // Calculate area and update max
        maxWater = Math.max(maxWater, 
            Math.min(leftHeight, rightHeight) * width);
        
        // Move the shorter pointer
        if (leftHeight < rightHeight) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}`,
        explanation: 'Java implementation using the same two-pointer technique. We store heights in variables to avoid repeated array access.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        approach: 'Two Pointers - Greedy',
        keyPoints: [
          'Math.min() and Math.max() for cleaner code',
          'Store array values in variables to reduce access',
          'Clear variable naming improves readability',
          'Single while loop with clear termination condition'
        ]
      }
    }
  },
  {
    id: 15,
    title: '3Sum',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.',
    difficulty: 'Medium',
    category: 'Array',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    frequency: 5,
    companies: ['Facebook', 'Amazon', 'Microsoft', 'Apple', 'Google'],
    hints: [
      'Sort the array first to handle duplicates',
      'For each number, find two numbers that sum to its negative',
      'Use two pointers to find the two numbers',
      'Skip duplicates to avoid duplicate triplets'
    ],
    followUp: [
      'What about 4Sum?',
      'How to handle very large arrays?',
      'Can you solve without sorting?'
    ],
    similar: [1, 16, 18, 259],
    solutions: {
      'Python': {
        code: `def threeSum(nums):
    """
    Sort + Two Pointers
    Time: O(n²), Space: O(1) excluding output
    """
    if len(nums) < 3:
        return []
    
    nums.sort()  # Sort to handle duplicates and use two pointers
    result = []
    
    for i in range(len(nums) - 2):
        # Skip duplicate values for the first number
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        left, right = i + 1, len(nums) - 1
        target = -nums[i]  # We need two numbers that sum to this
        
        while left < right:
            current_sum = nums[left] + nums[right]
            
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates for second and third numbers
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                
                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    
    return result

# Alternative: Using set for deduplication (less efficient)
def threeSumSet(nums):
    if len(nums) < 3:
        return []
    
    nums.sort()
    result_set = set()
    
    for i in range(len(nums) - 2):
        left, right = i + 1, len(nums) - 1
        
        while left < right:
            triplet_sum = nums[i] + nums[left] + nums[right]
            
            if triplet_sum == 0:
                result_set.add((nums[i], nums[left], nums[right]))
                left += 1
                right -= 1
            elif triplet_sum < 0:
                left += 1
            else:
                right -= 1
    
    return [list(triplet) for triplet in result_set]`,
        explanation: 'We sort the array first, then for each number, use two pointers to find pairs that sum to its negative. Careful duplicate handling ensures unique triplets.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        approach: 'Sort + Two Pointers',
        keyPoints: [
          'Sorting enables duplicate skipping and two-pointer technique',
          'For each nums[i], find nums[j] + nums[k] = -nums[i]',
          'Skip duplicates at all three positions',
          'Two pointers converge based on sum comparison'
        ]
      }
    }
  },
  {
    id: 42,
    title: 'Trapping Rain Water',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    difficulty: 'Hard',
    category: 'Array',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    frequency: 4,
    companies: ['Google', 'Amazon', 'Facebook', 'Microsoft', 'Apple'],
    hints: [
      'Water level at position i is min(max_left[i], max_right[i])',
      'Use two pointers to avoid extra space',
      'Keep track of maximum heights seen so far'
    ],
    followUp: [
      'What if the array is very large and doesn\'t fit in memory?',
      'Can you solve it with one pass?'
    ],
    similar: [11, 84, 85],
    solutions: {
      'Python': {
        code: `def trap(height):
    """
    Two Pointers Approach
    Time: O(n), Space: O(1)
    """
    if not height or len(height) < 3:
        return 0
    
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water_trapped = 0
    
    while left < right:
        if height[left] < height[right]:
            # Process left side
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water_trapped += left_max - height[left]
            left += 1
        else:
            # Process right side
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water_trapped += right_max - height[right]
            right -= 1
    
    return water_trapped

# Alternative: DP approach (easier to understand)
def trapDP(height):
    """
    Dynamic Programming Approach
    Time: O(n), Space: O(n)
    """
    if not height:
        return 0
    
    n = len(height)
    left_max = [0] * n
    right_max = [0] * n
    
    # Fill left_max array
    left_max[0] = height[0]
    for i in range(1, n):
        left_max[i] = max(left_max[i-1], height[i])
    
    # Fill right_max array
    right_max[n-1] = height[n-1]
    for i in range(n-2, -1, -1):
        right_max[i] = max(right_max[i+1], height[i])
    
    # Calculate trapped water
    water = 0
    for i in range(n):
        water_level = min(left_max[i], right_max[i])
        if water_level > height[i]:
            water += water_level - height[i]
    
    return water

# Stack-based approach
def trapStack(height):
    """
    Stack Approach
    Time: O(n), Space: O(n)
    """
    stack = []
    water = 0
    
    for i in range(len(height)):
        while stack and height[i] > height[stack[-1]]:
            top = stack.pop()
            
            if not stack:
                break
            
            distance = i - stack[-1] - 1
            bounded_height = min(height[i], height[stack[-1]]) - height[top]
            water += distance * bounded_height
        
        stack.append(i)
    
    return water`,
        explanation: 'The two-pointer approach maintains left_max and right_max while moving inward. Water at position i equals min(left_max, right_max) - height[i] if positive.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        approach: 'Two Pointers',
        keyPoints: [
          'Water level = min(max height to left, max height to right)',
          'Two pointers avoid need for extra arrays',
          'Always move pointer with smaller height',
          'Stack approach finds water by layers'
        ]
      }
    }
  },
  {
    id: 121,
    title: 'Best Time to Buy and Sell Stock',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.',
    difficulty: 'Easy',
    category: 'Array',
    tags: ['Array', 'Dynamic Programming'],
    frequency: 5,
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple'],
    hints: [
      'Track the minimum price seen so far',
      'For each price, calculate profit if sold today',
      'Keep track of maximum profit'
    ],
    followUp: [
      'What if you can make multiple transactions?',
      'What if there\'s a transaction fee?',
      'What if you can only hold one stock at a time?'
    ],
    similar: [122, 123, 188, 309, 714],
    solutions: {
      'Python': {
        code: `def maxProfit(prices):
    """
    Single Pass - Track minimum price
    Time: O(n), Space: O(1)
    """
    if not prices or len(prices) < 2:
        return 0
    
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        # Update minimum price if current price is lower
        if price < min_price:
            min_price = price
        # Calculate profit if we sell today
        elif price - min_price > max_profit:
            max_profit = price - min_price
    
    return max_profit

# Alternative: More explicit version
def maxProfitExplicit(prices):
    if not prices:
        return 0
    
    min_price = prices[0]
    max_profit = 0
    
    for i in range(1, len(prices)):
        current_price = prices[i]
        
        # If current price is lower, update min_price
        if current_price < min_price:
            min_price = current_price
        else:
            # Calculate potential profit
            profit = current_price - min_price
            max_profit = max(max_profit, profit)
    
    return max_profit

# Kadane's algorithm style
def maxProfitKadane(prices):
    """
    Similar to maximum subarray problem
    """
    if not prices:
        return 0
    
    max_profit = 0
    min_price = prices[0]
    
    for price in prices[1:]:
        max_profit = max(max_profit, price - min_price)
        min_price = min(min_price, price)
    
    return max_profit`,
        explanation: 'We track the minimum price seen so far and calculate the maximum profit possible if we sell at the current price. The key insight is we only need one pass.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        approach: 'Single Pass - Greedy',
        keyPoints: [
          'Only one pass needed through the array',
          'Track minimum price encountered so far',
          'For each price, calculate profit if sold today',
          'Keep maximum profit seen so far'
        ]
      }
    }
  },
  // Continue with more problems...
  {
    id: 206,
    title: 'Reverse Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    difficulty: 'Easy',
    category: 'Linked List',
    tags: ['Linked List', 'Recursion'],
    frequency: 5,
    companies: ['Amazon', 'Microsoft', 'Google', 'Apple', 'Facebook'],
    hints: [
      'Use three pointers: previous, current, and next',
      'Can also be solved recursively',
      'Think about the base case for recursion'
    ],
    followUp: [
      'Can you do it recursively?',
      'What about reversing only a portion of the list?',
      'How would you reverse a doubly linked list?'
    ],
    similar: [92, 25, 234],
    solutions: {
      'Python': {
        code: `# Definition for singly-linked list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    """
    Iterative approach with three pointers
    Time: O(n), Space: O(1)
    """
    prev = None
    current = head
    
    while current:
        # Store next node
        next_temp = current.next
        
        # Reverse the link
        current.next = prev
        
        # Move pointers forward
        prev = current
        current = next_temp
    
    return prev  # prev is now the new head

# Recursive approach
def reverseListRecursive(head):
    """
    Recursive approach
    Time: O(n), Space: O(n) due to call stack
    """
    # Base case
    if not head or not head.next:
        return head
    
    # Recursively reverse the rest
    reversed_head = reverseListRecursive(head.next)
    
    # Reverse the current connection
    head.next.next = head
    head.next = None
    
    return reversed_head

# Alternative recursive with helper
def reverseListHelper(head):
    def reverse_helper(node, prev):
        if not node:
            return prev
        
        next_node = node.next
        node.next = prev
        return reverse_helper(next_node, node)
    
    return reverse_helper(head, None)`,
        explanation: 'The iterative approach uses three pointers to reverse links one by one. The recursive approach reverses the rest of the list first, then fixes the current connection.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1) iterative, O(n) recursive',
        approach: 'Three Pointers / Recursion',
        keyPoints: [
          'Iterative: maintain prev, current, and next pointers',
          'Recursive: reverse rest first, then fix current link',
          'Be careful not to lose references to nodes',
          'Return the new head (originally the tail)'
        ]
      }
    }
  },
  {
    id: 20,
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets in the correct order.',
    difficulty: 'Easy',
    category: 'Stack',
    tags: ['String', 'Stack'],
    frequency: 5,
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple'],
    hints: [
      'Use a stack to keep track of opening brackets',
      'When you see a closing bracket, check if it matches the most recent opening bracket',
      'The stack should be empty at the end'
    ],
    followUp: [
      'What if the string contains other characters?',
      'How would you handle nested structures like JSON?',
      'Can you solve without using a stack?'
    ],
    similar: [22, 32, 301, 1541],
    solutions: {
      'Python': {
        code: `def isValid(s):
    """
    Stack-based approach
    Time: O(n), Space: O(n)
    """
    # Mapping of closing to opening brackets
    mapping = {')': '(', ']': '[', '}': '{'}
    stack = []
    
    for char in s:
        if char in mapping:
            # Closing bracket: check if it matches
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            # Opening bracket: push to stack
            stack.append(char)
    
    # Valid if stack is empty
    return not stack

# Alternative: More explicit version
def isValidExplicit(s):
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for char in s:
        if char in pairs:  # Opening bracket
            stack.append(char)
        elif char in pairs.values():  # Closing bracket
            if not stack or pairs[stack.pop()] != char:
                return False
    
    return len(stack) == 0

# One-liner using reduce (advanced)
from functools import reduce

def isValidOneLiner(s):
    def process_char(stack, char):
        mapping = {')': '(', ']': '[', '}': '{'}
        if char in mapping:
            return stack[:-1] if stack and stack[-1] == mapping[char] else [None]
        return stack + [char]
    
    return reduce(process_char, s, []) == []`,
        explanation: 'We use a stack to keep track of opening brackets. For each closing bracket, we check if it matches the most recent opening bracket. The string is valid if the stack is empty at the end.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        approach: 'Stack - LIFO Pattern',
        keyPoints: [
          'Stack stores opening brackets',
          'Dictionary maps closing to opening brackets',
          'Pop and compare when closing bracket found',
          'Empty stack at end indicates valid string'
        ]
      }
    }
  }
  // ... Continue adding more problems
];

const languages = ['Python', 'Java', 'C++', 'JavaScript', 'C#', 'Ruby'];

const LeetCodeProblems: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(problems[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Python');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showHints, setShowHints] = useState<boolean>(false);
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());

  // Memoized filtered problems
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
      const matchesSearch = searchTerm === '' || 
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchTerm]);

  // Get unique categories and sort
  const categories = useMemo(() => {
    return ['All', ...new Set(problems.map(p => p.category))].sort();
  }, []);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Utility functions
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Array': 'bg-blue-100 text-blue-700',
      'String': 'bg-purple-100 text-purple-700',
      'Linked List': 'bg-green-100 text-green-700',
      'Stack': 'bg-orange-100 text-orange-700',
      'Dynamic Programming': 'bg-pink-100 text-pink-700',
      'Binary Search': 'bg-indigo-100 text-indigo-700',
      'Tree': 'bg-emerald-100 text-emerald-700',
      'Graph': 'bg-cyan-100 text-cyan-700',
      'Hash Table': 'bg-violet-100 text-violet-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getFrequencyStars = (frequency: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${i < frequency ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const markAsSolved = (problemId: number) => {
    setSolvedProblems(prev => new Set(prev).add(problemId));
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      {/* Enhanced Header */}
      <div className="text-center">
        <h1 className="text-5xl font-bold gradient-text mb-4">
          🚀 LeetCode Mastery Hub
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Master coding interviews with comprehensive solutions, detailed explanations, and expert insights
        </p>
        
        {/* Stats */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
            <div className="text-2xl font-bold text-blue-600">{problems.length}</div>
            <div className="text-sm text-gray-600">Problems</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
            <div className="text-2xl font-bold text-green-600">{languages.length}</div>
            <div className="text-sm text-gray-600">Languages</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
            <div className="text-2xl font-bold text-purple-600">{solvedProblems.size}</div>
            <div className="text-sm text-gray-600">Solved</div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Filter size={14} /> Category:
              </span>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Difficulty:</span>
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Enhanced Problem List */}
        <div className="xl:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Problems</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {filteredProblems.length}
              </span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
              {filteredProblems.map((problem) => (
                <div
                  key={problem.id}
                  onClick={() => setSelectedProblem(problem)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                    selectedProblem.id === problem.id
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      {solvedProblems.has(problem.id) && (
                        <CheckCircle2 size={16} className="text-green-600" />
                      )}
                      {problem.id}. {problem.title}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <div className="flex items-center gap-1">
                      {getFrequencyStars(problem.frequency)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(problem.category)}`}>
                      {problem.category}
                    </span>
                    <div className="flex gap-1">
                      {problem.companies.slice(0, 2).map((company) => (
                        <span key={company} className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Problem Details */}
        <div className="xl:col-span-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-sm">
            {/* Enhanced Problem Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedProblem.id}. {selectedProblem.title}
                  </h2>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(selectedProblem.difficulty)}`}>
                      {selectedProblem.difficulty}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(selectedProblem.category)}`}>
                      {selectedProblem.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {getFrequencyStars(selectedProblem.frequency)}
                      <span className="text-xs text-gray-500 ml-1">frequency</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => markAsSolved(selectedProblem.id)}
                    size="sm"
                    variant={solvedProblems.has(selectedProblem.id) ? "default" : "outline"}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle2 size={16} />
                    {solvedProblems.has(selectedProblem.id) ? 'Solved' : 'Mark Solved'}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProblem.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Companies</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProblem.companies.map((company) => (
                      <span key={company} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {selectedProblem.description}
              </p>

              {/* Hints Section */}
              <div className="mb-6">
                <Button
                  onClick={() => setShowHints(!showHints)}
                  variant="outline"
                  size="sm"
                  className="mb-3"
                >
                  💡 {showHints ? 'Hide' : 'Show'} Hints ({selectedProblem.hints.length})
                </Button>
                
                {showHints && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <ul className="space-y-2">
                      {selectedProblem.hints.map((hint, index) => (
                        <li key={index} className="flex items-start gap-2 text-yellow-800">
                          <span className="font-semibold text-yellow-600">{index + 1}.</span>
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Language Tabs */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Code size={20} />
                Choose Language:
              </h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    variant={selectedLanguage === lang ? "default" : "outline"}
                    size="sm"
                    className="font-medium"
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </div>

            {/* Enhanced Solution Section */}
            {selectedProblem.solutions[selectedLanguage] && (
              <div className="space-y-8">
                {/* Approach and Complexity */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <BookOpen size={20} />
                    Solution Analysis
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/60 rounded-lg p-4 text-center">
                      <div className="text-sm text-blue-600 font-medium mb-1">Approach</div>
                      <div className="font-bold text-blue-900">
                        {selectedProblem.solutions[selectedLanguage].approach}
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4 text-center">
                      <div className="text-sm text-green-600 font-medium mb-1">
                        <Clock size={14} className="inline mr-1" />
                        Time
                      </div>
                      <div className="font-bold text-green-900">
                        {selectedProblem.solutions[selectedLanguage].timeComplexity}
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4 text-center">
                      <div className="text-sm text-purple-600 font-medium mb-1">
                        <TrendingUp size={14} className="inline mr-1" />
                        Space
                      </div>
                      <div className="font-bold text-purple-900">
                        {selectedProblem.solutions[selectedLanguage].spaceComplexity}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 rounded-lg p-4 mb-4">
                    <h5 className="font-semibold text-blue-900 mb-2">Algorithm Explanation</h5>
                    <p className="text-blue-800 leading-relaxed">
                      {selectedProblem.solutions[selectedLanguage].explanation}
                    </p>
                  </div>

                  {/* Key Points */}
                  <div className="bg-white/80 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-900 mb-3">Key Points</h5>
                    <ul className="space-y-2">
                      {selectedProblem.solutions[selectedLanguage].keyPoints?.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-blue-800">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Enhanced Code Solution */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <PlayCircle size={20} />
                      Solution in {selectedLanguage}
                    </h4>
                    <Button
                      onClick={() => copyCode(selectedProblem.solutions[selectedLanguage].code)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Copy size={14} />
                      Copy
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-xl px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">
                        {selectedLanguage} Solution
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        <ExternalLink size={12} className="mr-1" />
                        Run
                      </Button>
                    </div>
                    
                    <div className="bg-gray-900 text-gray-100 p-6 rounded-b-xl font-mono text-sm overflow-x-auto">
                      <pre className="whitespace-pre-wrap">
                        {selectedProblem.solutions[selectedLanguage].code}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Variations */}
                {selectedProblem.solutions[selectedLanguage].variations && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200/50">
                    <h4 className="text-lg font-semibold text-purple-900 mb-3">Variations & Extensions</h4>
                    <ul className="space-y-2">
                      {selectedProblem.solutions[selectedLanguage].variations.map((variation, index) => (
                        <li key={index} className="flex items-start gap-2 text-purple-800">
                          <span className="text-purple-600 font-bold">→</span>
                          <span>{variation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow-up Questions */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200/50">
                  <h4 className="text-lg font-semibold text-orange-900 mb-3">Follow-up Questions</h4>
                  <ul className="space-y-2">
                    {selectedProblem.followUp.map((question, index) => (
                      <li key={index} className="flex items-start gap-2 text-orange-800">
                        <span className="text-orange-600 font-bold">?</span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Similar Problems */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200/50">
                  <h4 className="text-lg font-semibold text-emerald-900 mb-3">Similar Problems</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProblem.similar.map((problemId) => {
                      const similarProblem = problems.find(p => p.id === problemId);
                      return similarProblem ? (
                        <Button
                          key={problemId}
                          onClick={() => setSelectedProblem(similarProblem)}
                          variant="outline"
                          size="sm"
                          className="text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                        >
                          {problemId}. {similarProblem.title}
                        </Button>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeProblems;
