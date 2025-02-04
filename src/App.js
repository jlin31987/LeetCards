import React, { useState, useEffect } from "react";
import "./App.css";

const createBlanks = (sentence, numBlanks = 1) => {
  const tokens = sentence.match(/\S+|\s+/g) || [];
  const wordIndices = tokens
    .map((token, index) => (/\S+/.test(token) ? index : null))
    .filter((index) => index !== null);

  let blankIndices = new Set();
  numBlanks = Math.max(1, Math.min(numBlanks, wordIndices.length));

  while (blankIndices.size < numBlanks) {
    let randomIndex = wordIndices[Math.floor(Math.random() * wordIndices.length)];
    blankIndices.add(randomIndex);
  }

  let blanks = [];
  let modifiedSentence = tokens.map((token, index) => {
    if (blankIndices.has(index)) {
      blanks.push(token);
      return "_____";
    }
    return token;
  });

  return { answerTemplate: modifiedSentence, blanks, blankIndices: [...blankIndices] };
};

const Flashcard = ({ question, body, example, fullAnswer, numBlanks }) => {
  const [userInputs, setUserInputs] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [answerTemplate, setAnswerTemplate] = useState([]);
  const [blanks, setBlanks] = useState([]);
  const [blankIndices, setBlankIndices] = useState([]);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  useEffect(() => {
    const { answerTemplate, blanks, blankIndices } = createBlanks(fullAnswer, numBlanks);
    setAnswerTemplate(answerTemplate);
    setBlanks(blanks);
    setBlankIndices(blankIndices);
    setUserInputs(Array(blanks.length).fill(""));
    setShowCorrectAnswer(false);
  }, [fullAnswer, numBlanks]);

  const handleChange = (index, value) => {
    const updatedInputs = [...userInputs];
    updatedInputs[index] = value;
    setUserInputs(updatedInputs);
  };

  const handleCheckAnswer = () => {
    const isAllCorrect = blanks.every(
      (blank, index) => userInputs[index]?.trim().toLowerCase() === blank.toLowerCase()
    );
    setIsCorrect(isAllCorrect);
    setShowCorrectAnswer(!isAllCorrect);
  };

  return (
    <div className="flashcard">
      <h2>{question}</h2>
      <h3 className="body-text">
        {body.split("`").map((part, index) =>
          index % 2 === 1 ? <code key={index}>{part}</code> : part
        )}
      </h3>

      {example && (
        <div className="example-box">
          <p><strong>Example:</strong></p>
          <pre><code>{example}</code></pre>
        </div>
      )}

      <pre className="code-block">
        <code>
          {answerTemplate.map((token, index) =>
            blankIndices.includes(index) ? (
              <input
                key={index}
                type="text"
                className="code-input"
                value={userInputs[blankIndices.indexOf(index)] || ""}
                onChange={(e) => handleChange(blankIndices.indexOf(index), e.target.value)}
                aria-label={`Blank ${blankIndices.indexOf(index) + 1}`}
              />
            ) : (
              <span key={index}>{token}</span>
            )
          )}
        </code>
      </pre>

      <button onClick={handleCheckAnswer}>Submit</button>

      {isCorrect !== null && (
        <p className={`result-message ${isCorrect ? "result-correct" : "result-incorrect"}`}>
          {isCorrect ? "Correct!" : "Incorrect. Try again!"}
        </p>
      )}

      {showCorrectAnswer && (
        <div className="mt-3 text-sm text-gray-700">
          <p><strong>Correct Answer:</strong></p>
          <pre className="bg-gray-200 p-2 rounded-md text-left font-mono">
            {blanks.join(" ")}
          </pre>
        </div>
      )}
    </div>
  );
};


const App = () => {
  const flashcards = [
    { 
      question: "1.Two Sum", 
      body: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.', 
      fullAnswer: `
def twoSum(self, nums: List[int], target: int) -> List[int]:
    num_dict = {} 
    for i, num in enumerate(nums): 
        complement = target - num
        if complement in num_dict:
            return [num_dict[complement], i ]
        num_dict[num] = i 
    return []`, 
      numBlanks: 2 
    },
    { 
      question: "217. Contains Duplicate",
      body: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
      fullAnswer: `
def containsDuplicate(self, nums: List[int]) -> bool:
    seen = set()  
    for num in nums:
        if num in seen:  
            return True
        seen.add(num)  
    return False`, 
      numBlanks: 1 
    },
    {
      question: "1768. Merge Strings Alternately",
      body: 'You are given two strings `word1` and `word2`. Merge the strings by adding letters in alternating order, starting with `word1`. If a string is longer than the other, append the additional letters onto the end of the merged string. Return *the merged string.*',
      fullAnswer: `
def mergeAlternately(self, word1: str, word2: str) -> str:
        result = []
        i = 0
        while i < len(word1) or i < len(word2):
            if i < len(word1):
                result.append(word1[i])
            if i < len(word2):
                result.append(word2[i])
            i += 1
        return ''.join(result)`, 
      numBlanks: 1
    },
    {
      question: "121. Best Time to Buy and Sell Stock",
      body: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing a single day to buy one stock and a different day in the future to sell it. Return the maximum profit you can achieve from this transaction. If no profit is possible, return `0`.",
      fullAnswer: `
    def maxProfit(self, prices: List[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            if price < min_price:
                min_price = price
            elif price - min_price > max_profit:
                max_profit = price - min_price
        return max_profit`,
      numBlanks: 2
    }, 
    {
      question: "409. Longest Palindrome",
      body: "Given a string `s` which consists of lowercase or uppercase letters, return the length of the longest palindrome that can be built with those letters.",
      fullAnswer: `
    def longestPalindrome(self, s: str) -> int:
        counts = collections.Counter(s)
        length = 0
        odd_found = False
        for count in counts.values():
            length += count // 2 * 2
            if count % 2 == 1:
                odd_found = True
        return length + 1 if odd_found else length`,
      numBlanks: 2
    }, 
    {
      question: "704. Binary Search",
      body: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search for `target` in `nums`. If `target` exists, return its index. Otherwise, return `-1`.",
      fullAnswer: `
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1`,
      numBlanks: 3
    }, 
    {
    question: "53. Maximum Subarray",
      body: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
      fullAnswer: `
    def max_subarray(nums):
    max_sum = float('-inf')
    current_sum = 0
    for num in nums:
        current_sum += num
        max_sum = max(max_sum, current_sum)
        if current_sum < 0:
            current_sum = 0
    return max_sum`,
      numBlanks: 3
    }
  
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">LeetCards</h1>
      <Flashcard
        key={currentIndex}
        question={flashcards[currentIndex].question}
        body={flashcards[currentIndex].body}
        example={flashcards[currentIndex].example}
        fullAnswer={flashcards[currentIndex].fullAnswer}
        numBlanks={flashcards[currentIndex].numBlanks}
      />
      
      <div className="nav-container">
        <button className="nav-button" onClick={prevCard}>
          ← Previous
        </button>
        <button className="nav-button" onClick={nextCard}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default App;
