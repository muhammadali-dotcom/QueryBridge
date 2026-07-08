"use client";

import { useState, useEffect } from "react";
import { runQuery, getSchema } from "../lib/api";

export default function Page() {
  const [text, setText] = useState("Display top 10 customers");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sql, setSql] = useState("");
  const [results, setResults] = useState(null);
  const [schema, setSchema] = useState({});
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getSchema();
        if (res.success && res.data?.schema) {
          setSchema(res.data.schema);
          setSelectedTable(Object.keys(res.data.schema)[0]);
        }
      } catch {}
    })();
  }, []);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setSql("");
    setResults(null);

    try {
      const res = await runQuery(text);
      if (!res.success) throw new Error(res.error || "Request failed");
      setSql(res.data.sql || "");
      setResults(res.data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "Display top 10 customers",
    "List customers who joined this year",
    "Show all jobs",
    "Show first name and email of customers",
  ];

  return (
    <main className="db-page">
      <nav className="db-nav">
        <div className="brand">
          <div className="brand-icon">▣</div>
          <span>QueryBridge</span>
        </div>
      </nav>

      <section className="query-box">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!loading && text.trim()) handleRun();
            }
          }}
          placeholder="Ask anything about your database..."
        />

        <button onClick={handleRun} disabled={loading}>
          {loading ? "Running..." : "➤"}
        </button>
      </section>

      <div className="suggestions">
        <span>Try asking:</span>
        {examples.map((item) => (
          <button key={item} onClick={() => setText(item)}>
            {item}
          </button>
        ))}
      </div>

      <section className="content-grid">
        <aside className="schema-card glass-card">
          <div className="card-header">
            <div>
              <h3>Database Schema</h3>
              <p>Search tables or columns</p>
            </div>
          </div>


          <div className="schema-layout">
            <div className="table-list">
              {Object.keys(schema).length ? (
                Object.entries(schema).map(([table, cols]) => (
                  <button
                    key={table}
                    className={`table-item ${
                      selectedTable === table ? "active" : ""
                    }`}
                    onClick={() => setSelectedTable(table)}
                  >
                    <span>{table}</span>
                    <small>{Object.keys(cols).length}</small>
                  </button>
                ))
              ) : (
                <p className="empty">No schema available</p>
              )}
            </div>

            <div className="column-list">
              {selectedTable ? (
                <>
                  <h4>{selectedTable}</h4>
                  {Object.entries(schema[selectedTable] || {}).map(([c, t]) => (
                    <div className="column-item" key={c}>
                      <span>{c}</span>
                      <small>{t}</small>
                    </div>
                  ))}
                </>
              ) : (
                <p className="empty">Select a table</p>
              )}
            </div>
          </div>
        </aside>

        <section className="result-card glass-card">
          <div className="card-header result-header">
            <div>
              <h3>Query Result</h3>
              <p>
                {results
                  ? `Returned ${results.length} rows`
                  : "Run a query to see output"}
              </p>
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          {sql && (
            <div className="sql-preview">
              <span>Generated SQL</span>
              <code>{sql}</code>
            </div>
          )}

          {results && results.length > 0 ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {Object.keys(results[0]).map((k) => (
                      <th key={k}>{k}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      {Object.values(r).map((v, ii) => (
                        <td key={ii}>
                          {v === null || v === undefined ? "" : String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !error && (
              <div className="empty-result">
                Ask a question and your database result will appear here.
              </div>
            )
          )}
        </section>
      </section>
    </main>
  );
}