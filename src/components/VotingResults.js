import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const VotingResults = ({ proposal }) => {
  const data = proposal.options.map((option, index) => ({
    name: option.text,
    value: option.votes,
    color: COLORS[index % COLORS.length]
  }));

  const totalVotes = proposal.totalVotes;

  return (
    <div className="voting-results">
      <h3>Voting Results</h3>
      <p>Total Votes: {totalVotes}</p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="voting-details">
        {data.map((entry, index) => (
          <div key={index} className="voting-option">
            <span style={{ color: entry.color }}>[Color]</span>
            <span>{entry.name}: </span>
            <span>{entry.value} votes ({((entry.value / totalVotes) * 100).toFixed(2)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingResults;