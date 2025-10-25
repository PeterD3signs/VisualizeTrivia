import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { GroupedCategory } from '../data/categories';

interface Props {
    groupCategories: GroupedCategory[];
    displayMode: 'difficulty' | 'acceptance';
    selectedLevels: string[];
    selectedCategories: string[];
}

interface ChartData {
    category: string | null;
    easy?: number | null;
    medium?: number | null;
    hard?: number | null;
    all?: number | null;
    approved?: number | null;
    pending?: number | null;
    rejected?: number | null;
  }

const QuestionsChart: React.FC<Props> = ({ groupCategories, displayMode, selectedLevels, selectedCategories }) => {
    const data = groupCategories.flatMap(group =>
      group.list
        .filter(cat => selectedCategories.includes(cat.name || ''))
        .map(cat => {
          const entry: ChartData = { category: cat.name };
          if (displayMode === 'difficulty') {
            entry.easy = cat.total_easy_question_count;
            entry.medium = cat.total_medium_question_count;
            entry.hard = cat.total_hard_question_count;
            entry.all = (cat.total_easy_question_count || 0) + (cat.total_medium_question_count || 0) + (cat.total_hard_question_count || 0);
          } else {
            entry.approved = cat.total_num_of_verified_questions;
            entry.pending = cat.total_num_of_pending_questions;
            entry.rejected = cat.total_num_of_rejected_questions;
            entry.all = cat.total_num_of_questions;
          }
          return entry;
        })
    );
  
    const barKeys = displayMode === 'difficulty'
      ? ['easy', 'medium', 'hard', 'all'].filter(k => selectedLevels.includes(k))
      : ['approved', 'pending', 'rejected', 'all'].filter(k => selectedLevels.includes(k));
  
    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 20, left: 50, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="category" width={150} />
            <Tooltip />
            <Legend />
            {barKeys.map(key => (
              <Bar key={key} dataKey={key} fill={
                key === 'easy' || key === 'approved' ? '#34D399' :
                key === 'medium' || key === 'pending' ? '#60A5FA' :
                key === 'hard' || key === 'rejected' ? '#F87171' :
                '#FBBF24'
              } />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default QuestionsChart;