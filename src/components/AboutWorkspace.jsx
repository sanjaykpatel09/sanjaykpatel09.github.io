export default function AboutWorkspace() {
  return (
    <section className="about-workspace" id="about-panel" role="tabpanel" aria-labelledby="about-tab">
      <div className="about-intro">
        <span className="about-mark">{'{}'}</span>
        <div>
          <h2>About PrettyJSON</h2>
          <p>A simple set of tools for working with JSON and text.</p>
        </div>
      </div>
      <section className="search-content" aria-labelledby="search-content-title">
        <h2 id="search-content-title">What you can do</h2>
        <div className="search-content-features">
          <article>
            <h2>Format, minify, and validate JSON</h2>
            <p>
              Paste JSON to format it with readable indentation, minify it into compact JSON, or
              check whether the input is valid. Copy the result or download it as a JSON file.
            </p>
          </article>
          <article>
            <h2>Compare two JSON documents</h2>
            <p>
              Compare original and modified JSON side by side. PrettyJSON reports changed,
              added, and missing values by path, while ignoring object key order.
            </p>
          </article>
          <article>
            <h2>Count characters and words</h2>
            <p>
              Count characters, characters without whitespace, words, and lines in pasted or
              typed text.
            </p>
          </article>
          <article>
            <h2>Run code online</h2>
            <p>
              Write Python, Java, C++, JavaScript, and C# programs, provide standard input, and
              run them online. Code and input are sent to an online runner; do not submit
              sensitive information.
            </p>
          </article>
        </div>
        <h2>Frequently asked questions</h2>
        <details>
          <summary>Is PrettyJSON free to use?</summary>
          <p>Yes. PrettyJSON is free to use in your browser without creating an account.</p>
        </details>
        <details>
          <summary>Is my JSON uploaded or stored?</summary>
          <p>
            JSON formatting and comparison happen in your browser. Code and standard input are
            sent to the configured online runner; do not submit sensitive information.
          </p>
        </details>
      </section>
      <section className="about-contact" aria-labelledby="about-contact-title">
        <div className="about-contact-avatar" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="23" />
            <circle className="about-contact-avatar-head" cx="24" cy="18" r="7" />
            <path className="about-contact-avatar-body" d="M10 40c1.8-8 6.7-12 14-12s12.2 4 14 12" />
          </svg>
        </div>
        <div className="about-contact-copy">
          <span className="about-contact-label" id="about-contact-title">Created by</span>
          <h2>Sanjay Patel</h2>
          <p>Questions or feedback? Get in touch.</p>
          <a className="about-contact-email" href="mailto:sanjaykpatel09@gmail.com">
            sanjaykpatel09@gmail.com
          </a>
        </div>
        <a className="about-contact-link" href="mailto:sanjaykpatel09@gmail.com">
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="M3.5 5.5h13v9h-13z" />
            <path d="m4 6 6 5 6-5" />
          </svg>
          Email Sanjay
        </a>
      </section>
    </section>
  );
}
