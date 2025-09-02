'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Award, 
  BarChart3,
  Brain,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Trophy,
  Star,
  TrendingDown
} from 'lucide-react';

interface TopicScore {
  correct: number;
  total: number;
}

interface TopicScores {
  [topic: string]: TopicScore;
}

const Dashboard: React.FC = () => {
  const [topicScores, setTopicScores] = useState<TopicScores>({});

  useEffect(() => {
    const stored = localStorage.getItem('quizResults');
    if (stored) {
      setTopicScores(JSON.parse(stored));
    }
  }, []);

  const getOverallScore = () => {
    let totalCorrect = 0;
    let totalQuestions = 0;
    Object.values(topicScores).forEach(score => {
      totalCorrect += score.correct;
      totalQuestions += score.total;
    });
    return { correct: totalCorrect, total: totalQuestions };
  };

  const getScorePercentage = (correct: number, total: number) => {
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (percentage >= 80) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (percentage >= 70) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const getAreasToImprove = () => {
    const areas: string[] = [];
    Object.entries(topicScores).forEach(([topic, score]) => {
      const percentage = getScorePercentage(score.correct, score.total);
      if (percentage < 70) {
        areas.push(topic);
      }
    });
    return areas;
  };

  const getStrongAreas = () => {
    const areas: string[] = [];
    Object.entries(topicScores).forEach(([topic, score]) => {
      const percentage = getScorePercentage(score.correct, score.total);
      if (percentage >= 80) {
        areas.push(topic);
      }
    });
    return areas;
  };

  const getPreparationTips = (topic: string) => {
    const tips: { [key: string]: string[] } = {
      'Arrays': [
        'Practice array manipulation problems on LeetCode',
        'Master time complexities of different array operations',
        'Learn about dynamic arrays and their resizing mechanisms',
        'Study common algorithms like binary search and two-pointer technique'
      ],
      'Strings': [
        'Master string manipulation methods in your programming language',
        'Learn about string hashing and pattern matching algorithms',
        'Practice problems involving string parsing and validation',
        'Understand character encoding and Unicode handling'
      ],
      'Linked Lists': [
        'Implement all linked list operations from scratch',
        'Learn about different types: singly, doubly, circular',
        'Practice problems involving fast and slow pointers',
        'Master reversal and merging operations'
      ],
      'Trees': [
        'Practice tree traversal algorithms (inorder, preorder, postorder)',
        'Learn about balanced trees like AVL and Red-Black trees',
        'Master binary search tree operations',
        'Study tree construction and validation problems'
      ],
      'Graphs': [
        'Implement BFS and DFS algorithms',
        'Learn about shortest path algorithms (Dijkstra, Floyd-Warshall)',
        'Practice topological sorting and cycle detection',
        'Study minimum spanning tree algorithms'
      ]
    };
    return tips[topic] || [
      'Practice more problems in this specific topic',
      'Review fundamental concepts and definitions',
      'Solve coding challenges regularly on platforms like LeetCode',
      'Join study groups or online communities for discussion'
    ];
  };

  const overall = getOverallScore();
  const overallPercentage = getScorePercentage(overall.correct, overall.total);
  const performanceLevel = getPerformanceLevel(overallPercentage);
  const areasToImprove = getAreasToImprove();
  const strongAreas = getStrongAreas();

  if (overall.total === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-sm">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BarChart3 size={40} className="text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Progress Dashboard</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start taking quizzes to track your progress and identify areas for improvement in your Data Structures and Algorithms knowledge.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <Brain size={24} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Ready to Start Learning?</h3>
            </div>
            <p className="text-blue-700 text-sm">
              Take your first quiz to begin tracking your progress and get personalized recommendations.
            </p>
          </div>
          
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
            <a href="/quiz" className="flex items-center space-x-2">
              <Trophy size={20} />
              <span>Take Your First Quiz</span>
              <ArrowRight size={16} />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Performance Card */}
      <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-8 border border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Overall Performance</h2>
          </div>
          <div className={`px-4 py-2 rounded-xl border ${performanceLevel.bgColor} ${performanceLevel.borderColor}`}>
            <span className={`font-semibold ${performanceLevel.color}`}>
              {performanceLevel.level}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${overallPercentage}, 100`}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{overallPercentage}%</span>
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-900">{overall.correct}/{overall.total}</p>
            <p className="text-gray-600">Questions Answered Correctly</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{overall.total}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Target size={20} className="text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Topics Covered</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(topicScores).length}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Award size={20} className="text-purple-600" />
              <div>
                <p className="font-semibold text-gray-900">Strong Areas</p>
                <p className="text-2xl font-bold text-gray-900">{strongAreas.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <AlertTriangle size={20} className="text-orange-600" />
              <div>
                <p className="font-semibold text-gray-900">Need Improvement</p>
                <p className="text-2xl font-bold text-gray-900">{areasToImprove.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topic-wise Performance */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <BarChart3 size={24} className="text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Topic-wise Performance</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(topicScores).map(([topic, score]) => {
            const percentage = getScorePercentage(score.correct, score.total);
            const level = getPerformanceLevel(percentage);
            return (
              <div key={topic} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{topic}</h4>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${level.bgColor} ${level.color}`}>
                    {percentage}%
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{score.correct}/{score.total} correct</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {percentage >= 80 ? (
                    <Star size={16} className="text-yellow-500" />
                  ) : percentage >= 70 ? (
                    <TrendingUp size={16} className="text-blue-500" />
                  ) : (
                    <TrendingDown size={16} className="text-red-500" />
                  )}
                  <span className="text-sm text-gray-600">{level.level}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Areas to Improve */}
      {areasToImprove.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} className="text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-orange-900">Focus Areas</h3>
          </div>

          <p className="text-orange-700 mb-6">
            These topics need more attention. Focus your study time here for maximum improvement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {areasToImprove.map((area, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-3 flex items-center space-x-2">
                  <BookOpen size={16} />
                  <span>{area}</span>
                </h4>
                <ul className="space-y-2">
                  {getPreparationTips(area).slice(0, 3).map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start space-x-2 text-sm text-orange-700">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strong Areas */}
      {strongAreas.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Trophy size={24} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-900">Strong Areas</h3>
          </div>

          <p className="text-green-700 mb-6">
            Excellent work! You're performing well in these topics. Keep practicing to maintain your expertise.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {strongAreas.map((area, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Star size={20} className="text-green-600" />
                </div>
                <h4 className="font-semibold text-green-900">{area}</h4>
                <p className="text-sm text-green-600 mt-1">
                  {getScorePercentage(
                    topicScores[area].correct,
                    topicScores[area].total
                  )}% accuracy
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Lightbulb size={24} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-blue-900">Study Tips</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-blue-900">General Preparation:</h4>
            <ul className="space-y-2">
              {[
                'Practice consistently for 30-60 minutes daily',
                'Focus on understanding concepts, not just memorizing',
                'Implement algorithms from scratch to build muscle memory',
                'Join coding communities and participate in discussions'
              ].map((tip, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-blue-700">
                  <CheckCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-blue-900">Interview Preparation:</h4>
            <ul className="space-y-2">
              {[
                'Practice explaining your thought process out loud',
                'Time yourself while solving problems',
                'Learn to identify patterns in problem types',
                'Review and optimize your solutions for better complexity'
              ].map((tip, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-blue-700">
                  <Target size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
          <a href="/quiz" className="flex items-center space-x-2">
            <Trophy size={20} />
            <span>Take Another Quiz</span>
            <ArrowRight size={16} />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
