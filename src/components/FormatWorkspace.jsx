import ActionIcon from './ActionIcon.jsx';

export default function FormatWorkspace({
  input,
  output,
  fileName,
  stats,
  kind,
  message,
  updateJsonInput,
  loadExample,
  clearAll,
  formatJson,
  minifyJson,
  validateJson,
  setFileName,
  copyOutput,
  downloadOutput,
  setOutput,
}) {
  return (
    <section className="workspace" id="format-panel" role="tabpanel" aria-labelledby="format-tab" aria-label="JSON formatter">
      <div className="panel">
        <div className="panel-heading format-panel-heading">
          <div><span className="step">01</span><h2>Input JSON</h2></div>
          <button className="text-button icon-text-button load-example-button" onClick={loadExample}>
            <svg aria-hidden="true" viewBox="0 0 16 16">
              <path d="M4.5 1.75h5l3 3v9.5h-8z" />
              <path d="M9.5 1.75v3h3M6.5 8.5l-1 1 1 1m3-2 1 1-1 1M8.75 8l-1.5 3" />
            </svg>
            Load post example
          </button>
        </div>
        <textarea
          aria-label="Input JSON"
          spellCheck="false"
          value={input}
          onChange={(event) => updateJsonInput(event.target.value)}
          placeholder={'Paste your JSON here…\n\n{"hello":"world"}'}
        />
        <div className="actions" aria-label="JSON actions">
          <button className="primary-button" onClick={formatJson}><span>✦</span> Format JSON</button>
          <button className="secondary-button" onClick={minifyJson}>Minify</button>
          <button className="secondary-button" onClick={validateJson}>Validate</button>
        </div>
        <div className="panel-footer">
          <span>{input.length.toLocaleString()} characters</span>
          <button className="text-button muted" onClick={clearAll}>Clear</button>
        </div>
      </div>

      <div className="panel output-panel">
        <div className="panel-heading">
          <div className="output-title">
            <span className="step">02</span>
            <h2>Output</h2>
            <label className="visually-hidden" htmlFor="download-filename">Download file name</label>
            <input
              className="filename-input"
              id="download-filename"
              type="text"
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              aria-describedby="filename-hint"
            />
            <span className="visually-hidden" id="filename-hint">The .json extension is added if omitted.</span>
          </div>
          <div className="output-actions">
            <button className="text-button icon-text-button" onClick={copyOutput} disabled={!output}>
              <ActionIcon name="copy" />
              Copy
            </button>
            <button className="text-button icon-text-button" onClick={downloadOutput} disabled={!output}>
              <ActionIcon name="download" />
              Download
            </button>
          </div>
        </div>
        <textarea
          aria-label="Formatted JSON output"
          spellCheck="false"
          value={output}
          onChange={(event) => setOutput(event.target.value)}
          placeholder="Your result will appear here…"
        />
        {output && (
          <div className="panel-footer output-stats">
            <span>{stats.lines} lines</span>
            <span>{stats.chars.toLocaleString()} characters</span>
          </div>
        )}
        <div className={`status ${kind}`} role="status">
          <span className="status-icon">{kind === 'success' ? '✓' : kind === 'error' ? '!' : 'i'}</span>
          {message}
        </div>
      </div>
    </section>
  );
}
