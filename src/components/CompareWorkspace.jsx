import ActionIcon from './ActionIcon.jsx';

function formatDifferenceValue(value, exists) {
  return exists ? JSON.stringify(value, null, 2) : 'Missing';
}

export default function CompareWorkspace({
  leftJson,
  rightJson,
  comparison,
  compareMessage,
  compareKind,
  setLeftJson,
  setRightJson,
  updateCompareInput,
  compareJson,
}) {
  return (
    <section className="compare-workspace" id="compare-panel" role="tabpanel" aria-labelledby="compare-tab" aria-label="Compare JSON">
      <div className="compare-editors">
        <div className="panel compare-editor">
          <div className="panel-heading">
            <div><span className="step">A</span><h2>Original JSON</h2></div>
          </div>
          <textarea
            aria-label="Original JSON"
            spellCheck="false"
            value={leftJson}
            onChange={(event) => updateCompareInput(setLeftJson, event.target.value)}
            placeholder={'Paste the original JSON here…\n\n{"hello":"world"}'}
          />
          <div className="panel-footer"><span>{leftJson.length.toLocaleString()} characters</span></div>
        </div>
        <div className="panel compare-editor">
          <div className="panel-heading">
            <div><span className="step">B</span><h2>Modified JSON</h2></div>
          </div>
          <textarea
            aria-label="Modified JSON"
            spellCheck="false"
            value={rightJson}
            onChange={(event) => updateCompareInput(setRightJson, event.target.value)}
            placeholder={'Paste the modified JSON here…\n\n{"hello":"there"}'}
          />
          <div className="panel-footer"><span>{rightJson.length.toLocaleString()} characters</span></div>
        </div>
      </div>
      <div className="compare-controls">
        <button className="primary-button compare-button" onClick={compareJson}>
          <ActionIcon name="compare" />
          Compare JSON
        </button>
        <div className={`status ${compareKind}`} role="status">
          <span className="status-icon">{compareKind === 'success' ? '✓' : compareKind === 'error' ? '!' : 'i'}</span>
          {compareMessage}
        </div>
      </div>
      <div className="panel differences-panel">
        <div className="panel-heading">
          <div><span className="step">{comparison?.length ?? '—'}</span><h2>Differences</h2></div>
        </div>
        {comparison && comparison.length > 0 ? (
          <div className="differences-list">
            {comparison.map((difference) => (
              <article className="difference" key={difference.path}>
                <code className="difference-path">{difference.path}</code>
                <div className="difference-values">
                  <pre className={Object.hasOwn(difference, 'left') ? 'changed-value' : 'missing-value'}>
                    <span>Original</span>
                    {formatDifferenceValue(difference.left, Object.hasOwn(difference, 'left'))}
                  </pre>
                  <pre className={Object.hasOwn(difference, 'right') ? 'changed-value' : 'missing-value'}>
                    <span>Modified</span>
                    {formatDifferenceValue(difference.right, Object.hasOwn(difference, 'right'))}
                  </pre>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-differences">
            {comparison ? 'No differences found.' : 'Compare the JSON values to see changes here.'}
          </p>
        )}
      </div>
    </section>
  );
}
