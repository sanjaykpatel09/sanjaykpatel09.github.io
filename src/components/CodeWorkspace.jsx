import { lazy, Suspense } from 'react';
import ActionIcon from './ActionIcon.jsx';

const CodeEditor = lazy(() => import('../CodeEditor.jsx'));

function formatRunDuration(durationMs) {
  return durationMs < 1000
    ? `${Math.round(durationMs)} ms`
    : `${(durationMs / 1000).toFixed(2)} s`;
}

export default function CodeWorkspace({
  codeLanguage,
  code,
  sourceFileName,
  stdin,
  programOutput,
  runMessage,
  runKind,
  isRunning,
  runDurationMs,
  complexityEstimate,
  javaRunnerUrl,
  setSourceFileName,
  downloadSourceCode,
  runCode,
  setCode,
  setRunDurationMs,
  setComplexityEstimate,
  setStdin,
  changeCodeLanguage,
}) {
  return (
    <section className="code-workspace" id="code-panel" role="tabpanel" aria-labelledby="code-tab" aria-label="Online code runner">
      <div className="code-editors">
        <div className="panel code-editor">
          <div className="panel-heading">
            <div><span className="step">01</span><h2>Program</h2></div>
            <div className="code-header-controls">
              <label className="visually-hidden" htmlFor="code-language">Language</label>
              <select id="code-language" className="language-select" value={codeLanguage} onChange={changeCodeLanguage}>
                <option value="python">Python 3.13</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
                <option value="csharp">C#</option>
              </select>
              <div className="code-file-controls">
                <label className="visually-hidden" htmlFor="source-filename">Source file name</label>
                <input
                  className="source-filename-input"
                  id="source-filename"
                  type="text"
                  value={sourceFileName}
                  onChange={(event) => setSourceFileName(event.target.value)}
                  aria-label="Source file name"
                />
                <button className="text-button icon-text-button" onClick={downloadSourceCode} disabled={!code.trim()}>
                  <ActionIcon name="download" />
                  Download
                </button>
                <button className="primary-button code-run-button" onClick={runCode} disabled={isRunning || !code.trim()}>
                  <ActionIcon name={isRunning ? 'loading' : 'run'} />
                  {isRunning ? 'Running…' : 'Run Program'}
                </button>
              </div>
            </div>
          </div>
          <Suspense fallback={<div className="editor-loading">Loading code editor…</div>}>
            <CodeEditor
              language={codeLanguage}
              code={code}
              onChange={(value) => {
                setCode(value);
                setRunDurationMs(null);
                setComplexityEstimate(null);
              }}
            />
          </Suspense>
        </div>
        <div className="code-side">
          <div className="panel stdin-panel">
            <div className="panel-heading">
              <div><span className="step">02</span><h2>Input (stdin)</h2></div>
            </div>
            <textarea
              aria-label="Program input"
              spellCheck="false"
              value={stdin}
              onChange={(event) => {
                setStdin(event.target.value);
                setRunDurationMs(null);
              }}
              placeholder="Optional input passed to your program…"
            />
          </div>
          <div className="panel program-output-panel">
            <div className="panel-heading">
              <div><span className="step">03</span><h2>Output</h2></div>
            </div>
            <pre className="program-output" aria-live="polite">{programOutput || 'Your program output will appear here…'}</pre>
          </div>
        </div>
      </div>
      <div className="run-controls">
        <div className={`status ${runKind}`} role="status">
          <span className="status-icon">{runKind === 'success' ? '✓' : runKind === 'error' ? '!' : 'i'}</span>
          {runMessage}
        </div>
      </div>
      <div className="run-metrics" aria-label="Run metrics and complexity">
        <div className="run-metric">
          <span>Compile + execution</span>
          <strong>{runDurationMs === null ? (isRunning ? 'Running…' : '—') : formatRunDuration(runDurationMs)}</strong>
          <small>Browser-measured total time</small>
        </div>
        <div className="run-metric">
          <span>Time complexity</span>
          <strong>{complexityEstimate?.time ?? (isRunning ? 'Analyzing…' : 'Run to analyze')}</strong>
          <small>Static heuristic estimate</small>
        </div>
        <div className="run-metric">
          <span>Space complexity</span>
          <strong>{complexityEstimate?.space ?? (isRunning ? 'Analyzing…' : 'Run to analyze')}</strong>
          <small>Static heuristic estimate</small>
        </div>
      </div>
      <p className="runner-disclosure">
        Big-O values are rough local estimates based on loop nesting and common collection allocations; recursion and complex control flow may not be detected. Elapsed time includes network and runner startup. {javaRunnerUrl ? 'Java code and stdin are sent through your configured JDoodle runner; other languages are sent to Wandbox; ' : 'Code and stdin are sent to Wandbox; '}do not submit passwords, API keys, or other sensitive information.
      </p>
    </section>
  );
}
