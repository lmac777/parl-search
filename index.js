import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('Elizabeth_May_Interventions_Master_Dataset.csv')
      .then(res => res.text())
      .then(text => {
        const rows = text.split('\n').slice(1).filter(Boolean);
        const parsed = rows.map(row => {
          const parts = row.split(',');
          return {
            date: parts[6],
            time: parts[7],
            text: parts[9],
            source: parts[10],
            url: `https://parlvu.parl.gc.ca/Harmony/en/PowerBrowser/PowerBrowserV2/${(parts[6] || '').replace(/-/g, '')}/-1`
          };
        });
        setData(parsed);
        setResults(parsed);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    setResults(data.filter(entry =>
      (entry.text || '').toLowerCase().includes(value) ||
      (entry.date || '').includes(value) ||
      (entry.source || '').toLowerCase().includes(value)
    ));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Search Elizabeth May's Interventions</h1>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by keyword, date (YYYY-MM-DD), or source file"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      {results.slice(0, 50).map((entry, i) => (
        <div key={i} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>{entry.date} at {entry.time}</div>
          <div>{entry.text}</div>
          <a href={entry.url} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', fontSize: '0.9rem' }}>
            View on ParlVu
          </a>
        </div>
      ))}
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);