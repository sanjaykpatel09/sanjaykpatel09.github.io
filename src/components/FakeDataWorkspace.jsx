import ActionIcon from './ActionIcon.jsx';

const employeeCodeFiles = {
  python: 'employee_client.py',
  java: 'EmployeeClient.java',
  springboot: 'EmployeeClient.java',
  fastapi: 'main.py',
  csharp: 'EmployeeClient.cs',
  aspnetcore: 'EmployeesController.cs',
  nodejs: 'employee-client.js',
  express: 'employees.js',
  go: 'main.go',
  gin: 'main.go',
  php: 'employee-client.php',
  laravel: 'EmployeeController.php',
  ruby: 'employee_client.rb',
  rails: 'employees_controller.rb',
};

const employeeCodeKeywords = new Set([
  'async', 'await', 'break', 'class', 'const', 'def', 'else', 'export', 'extends',
  'false', 'for', 'func', 'if', 'import', 'in', 'let', 'new', 'null', 'package',
  'private', 'public', 'return', 'static', 'struct', 'this', 'throw', 'true', 'try',
  'var', 'void', 'while', 'with',
]);

function renderEmployeeCodeLine(line) {
  const tokenPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/.*|#.*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/g;
  const parts = [];
  let lastIndex = 0;

  for (const match of line.matchAll(tokenPattern)) {
    const [token] = match;
    const index = match.index;
    if (index > lastIndex) parts.push(line.slice(lastIndex, index));

    let tokenClass = '';
    if (/^["'`]/.test(token)) tokenClass = 'string';
    else if (/^(\/\/|#)/.test(token)) tokenClass = 'comment';
    else if (/^\d/.test(token)) tokenClass = 'number';
    else if (employeeCodeKeywords.has(token)) tokenClass = 'keyword';
    else if (/^(print|println|printf|console|System|json|JSON|HttpClient|WebClient)$/.test(token)) tokenClass = 'function';

    parts.push(tokenClass ? <span className={`token-${tokenClass}`} key={index}>{token}</span> : token);
    lastIndex = index + token.length;
  }

  if (lastIndex < line.length) parts.push(line.slice(lastIndex));
  return parts;
}

const languages = [
  ['python', 'Python'],
  ['java', 'Java'],
  ['springboot', 'Spring Boot'],
  ['fastapi', 'FastAPI'],
  ['csharp', 'C# (.NET)'],
  ['aspnetcore', 'ASP.NET Core'],
  ['nodejs', 'Node.js'],
  ['express', 'Express'],
  ['go', 'Go'],
  ['gin', 'Gin'],
  ['php', 'PHP'],
  ['laravel', 'Laravel'],
  ['ruby', 'Ruby'],
  ['rails', 'Rails'],
];

export default function FakeDataWorkspace({
  employeesEndpoint,
  employeeOrigin,
  employeeByIdEndpoint,
  employeeUrlMessage,
  employeeCodeMessage,
  employeeCodeLanguage,
  selectedEmployeeCode,
  copyEmployeeUrl,
  copyEmployeeCode,
  setEmployeeCodeLanguage,
  setEmployeeUrlMessage,
  setEmployeeCodeMessage,
}) {
  const selectedEmployeeCodeFile = employeeCodeFiles[employeeCodeLanguage];
  const selectedEmployeeCodeLines = selectedEmployeeCode.replace(/\n$/, '').split('\n');

  return (
    <section className="fake-data-workspace" id="fake-data-panel" role="tabpanel" aria-labelledby="fake-data-tab">
      <div className="about-intro">
        <span className="about-mark">{'{ }'}</span>
        <div>
          <h2>Fake(Json) Data</h2>
          <p>Free sample JSON for prototypes, demos, and development.</p>
        </div>
      </div>
      <article className="fake-data-card">
        <div className="fake-data-card-heading">
          <div>
            <span className="fake-data-method">GET</span>
            <h3>Employees</h3>
          </div>
          <span className="fake-data-count">10 records</span>
        </div>
        <p className="fake-data-description">A fixed list of fictional employees with contact, role, department, location, start date, and status fields.</p>
        <div className="fake-data-url">
          <a href={employeesEndpoint} target="_blank" rel="noopener noreferrer">{employeesEndpoint}</a>
          <button
            className="text-button icon-text-button"
            onClick={() => copyEmployeeUrl(employeesEndpoint)}
          >
            <ActionIcon name="copy" />
            Copy URL
          </button>
        </div>
        <p className="fake-data-description">Get one employee by ID:</p>
        <div className="fake-data-url">
          <a href={`${employeeOrigin}/employees/1/`} target="_blank" rel="noopener noreferrer">
            {employeeByIdEndpoint}
          </a>
          <div className="fake-data-url-actions">
            <span className="fake-data-count">IDs 1–10</span>
            <button
              className="text-button icon-text-button"
              onClick={() => copyEmployeeUrl(`${employeeOrigin}/employees/1/`)}
            >
              <ActionIcon name="copy" />
              Copy ID 1 URL
            </button>
          </div>
        </div>
        {employeeUrlMessage && <p className="fake-data-copy-message" role="status">{employeeUrlMessage}</p>}
        <div className="fake-data-examples-heading">
          <h3>Consume this JSON</h3>
        </div>
        <div className="fake-data-languages" aria-label="Code example language">
          {languages.map(([language, label]) => (
            <button
              className={`fake-data-language-button ${employeeCodeLanguage === language ? 'active' : ''}`}
              key={language}
              type="button"
              aria-pressed={employeeCodeLanguage === language}
              onClick={() => {
                setEmployeeCodeLanguage(language);
                setEmployeeUrlMessage('');
                setEmployeeCodeMessage('');
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="fake-data-editor">
          <div className="fake-data-editor-toolbar">
            <span className="fake-data-editor-controls" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="fake-data-editor-file">
              <span className="fake-data-editor-file-icon" aria-hidden="true" />
              {selectedEmployeeCodeFile}
            </span>
            {employeeCodeMessage && (
              <span className="fake-data-code-copy-message" role="status">
                {employeeCodeMessage}
              </span>
            )}
            <span className="fake-data-editor-readonly">READ ONLY</span>
            <button className="fake-data-editor-copy icon-text-button" type="button" onClick={copyEmployeeCode}>
              <ActionIcon name="copy" />
              Copy code
            </button>
          </div>
          <pre className="fake-data-code" aria-label={`${selectedEmployeeCodeFile} code example`}>
            <code>
              {selectedEmployeeCodeLines.map((line, index) => (
                <span className="fake-data-code-line" key={index}>
                  <span className="fake-data-line-number" aria-hidden="true">{index + 1}</span>
                  <span className="fake-data-line-content">{renderEmployeeCodeLine(line) || ' '}</span>
                </span>
              ))}
            </code>
          </pre>
          <div className="fake-data-editor-status">
            <span>{employeeCodeLanguage.toUpperCase()}</span>
            <span>{selectedEmployeeCodeLines.length} lines</span>
            <span>UTF-8</span>
          </div>
        </div>
        <p className="fake-data-note">
          Java needs Jackson Databind. Spring Boot uses <code>spring-boot-starter-webflux</code> for WebClient; the method returns a reactive <code>Mono</code>.
          FastAPI exposes a local <code>/employees</code> route that fetches this data; install <code>fastapi</code> and <code>httpx</code>.
          C# uses the built-in <code>System.Net.Http.Json</code> APIs. ASP.NET Core uses <code>IHttpClientFactory</code> to expose proxy endpoints.
          Node.js uses built-in <code>fetch</code>; Express, Gin, Laravel, and Rails examples expose local proxy routes.
          The Python example uses only the standard library.
        </p>
        <p className="fake-data-note">
          Read-only static JSON. Use <code>/employees/</code> for the full list and <code>/employees/{'{id}'}/</code> for a single record; IDs 1–10 are available. It does not support POST, PUT, PATCH, DELETE, or server-side filtering. All records are fictional and use example.com email addresses.
        </p>
      </article>
    </section>
  );
}
