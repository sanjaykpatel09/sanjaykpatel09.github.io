export default function CountWorkspace({ countText, setCountText, textStats }) {
  return (
    <section className="count-workspace" id="count-panel" role="tabpanel" aria-labelledby="count-tab" aria-label="Count characters">
      <div className="panel count-panel">
        <div className="panel-heading">
          <div><span className="step">Aa</span><h2>Text to count</h2></div>
          <button className="text-button muted" onClick={() => setCountText('')}>Clear</button>
        </div>
        <textarea
          aria-label="Text to count"
          value={countText}
          onChange={(event) => setCountText(event.target.value)}
          placeholder="Type or paste text here…"
        />
      </div>
      <div className="count-summary" aria-live="polite">
        <div className="count-card"><span>Characters</span><strong>{textStats.characters.toLocaleString()}</strong></div>
        <div className="count-card"><span>Without whitespace</span><strong>{textStats.charactersWithoutWhitespace.toLocaleString()}</strong></div>
        <div className="count-card"><span>Words</span><strong>{textStats.words.toLocaleString()}</strong></div>
        <div className="count-card"><span>Lines</span><strong>{textStats.lines.toLocaleString()}</strong></div>
      </div>
    </section>
  );
}
