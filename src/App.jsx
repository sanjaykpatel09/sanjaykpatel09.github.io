import React, { useEffect, useMemo, useState } from 'react';
import { estimateComplexity } from './complexity.js';
import {
  codeExamples,
  codeRuntimes,
  javaRunnerUrl,
  postExample,
  sourceFileExtensions,
  sourceFileNames,
} from './data/codeRunner.js';
import AboutWorkspace from './components/AboutWorkspace.jsx';
import CodeWorkspace from './components/CodeWorkspace.jsx';
import CompareWorkspace from './components/CompareWorkspace.jsx';
import CountWorkspace from './components/CountWorkspace.jsx';
import FakeDataWorkspace from './components/FakeDataWorkspace.jsx';
import FormatWorkspace from './components/FormatWorkspace.jsx';
import collectDifferences from './utils/collectDifferences.js';

const pageTitles = {
  format: 'JSON Formatter & Validator',
  compare: 'Compare JSON',
  count: 'Character Counter',
  code: 'Online Code Runner',
  'fake-data': 'Fake JSON Data',
  about: 'About',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('format');
  const [employeeUrlMessage, setEmployeeUrlMessage] = useState('');
  const [employeeCodeMessage, setEmployeeCodeMessage] = useState('');
  const [employeeCodeLanguage, setEmployeeCodeLanguage] = useState('python');
  const [countText, setCountText] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('formatted.json');
  const [message, setMessage] = useState('Paste JSON or load the example to get started.');
  const [kind, setKind] = useState('info');
  const [leftJson, setLeftJson] = useState('');
  const [rightJson, setRightJson] = useState('');
  const [comparison, setComparison] = useState(null);
  const [compareMessage, setCompareMessage] = useState('Enter two JSON values and compare them.');
  const [compareKind, setCompareKind] = useState('info');
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [javaVersion, setJavaVersion] = useState(javaRunnerUrl ? '8' : '22');
  const [code, setCode] = useState(codeExamples.python);
  const [sourceFileName, setSourceFileName] = useState(sourceFileNames.python);
  const [stdin, setStdin] = useState('');
  const [programOutput, setProgramOutput] = useState('');
  const [runMessage, setRunMessage] = useState('Ready to run your program.');
  const [runKind, setRunKind] = useState('info');
  const [isRunning, setIsRunning] = useState(false);
  const [runDurationMs, setRunDurationMs] = useState(null);
  const [complexityEstimate, setComplexityEstimate] = useState(null);

  useEffect(() => {
    document.title = `${pageTitles[activeTab]} | PrettyJSON`;
  }, [activeTab]);

  const employeesEndpoint = new URL('/employees/', window.location.origin).href;
  const employeeOrigin = new URL(employeesEndpoint).origin;
  const employeeByIdEndpoint = `${employeeOrigin}/employees/{id}/`;
  const employeeCodeSamples = {
    python: `from urllib.request import urlopen
import json

def get_employee(employee_id):
    with urlopen(f"${employeeOrigin}/employees/{employee_id}/") as response:
        return json.load(response)

employee = get_employee(1)
print(employee)`,
    java: `import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

public class EmployeeClient {
    public static void main(String[] args) throws Exception {
        System.out.println(getEmployee(1));
    }

    static Map<String, Object> getEmployee(int employeeId) throws Exception {
        var request = HttpRequest.newBuilder()
            .uri(URI.create("${employeeOrigin}/employees/" + employeeId + "/"))
            .GET()
            .build();
        var response = HttpClient.newHttpClient().send(
            request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new IllegalStateException("Request failed: " + response.statusCode());
        }
        return new ObjectMapper().readValue(
            response.body(), new TypeReference<Map<String, Object>>() {});
    }
}
`,
    springboot: `import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class EmployeeClient {
    private final WebClient client;

    public EmployeeClient(WebClient.Builder builder) {
        this.client = builder
            .baseUrl("${new URL(employeesEndpoint).origin}")
            .build();
    }

    public reactor.core.publisher.Mono<List<Map<String, Object>>> getEmployees() {
        return client.get()
            .uri("/employees/")
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<>() {});
    }

    public reactor.core.publisher.Mono<Map<String, Object>> getEmployee(int employeeId) {
        return client.get()
            .uri("/employees/{id}/", employeeId)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<>() {});
    }
}`,
    fastapi: `from fastapi import FastAPI, HTTPException
import httpx

app = FastAPI()
EMPLOYEES_URL = "${employeesEndpoint}"
EMPLOYEE_URL = "${employeeOrigin}/employees"

async def fetch_json(url):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Employee not found")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as error:
            raise HTTPException(
                status_code=502,
                detail="Could not fetch employee data",
            ) from error

@app.get("/employees")
async def get_employees():
    return await fetch_json(EMPLOYEES_URL)

@app.get("/employees/{employee_id}")
async def get_employee(employee_id: int):
    return await fetch_json(f"{EMPLOYEE_URL}/{employee_id}/")`,
    csharp: `using System.Net.Http.Json;
using System.Text.Json;

using var client = new HttpClient();
var employees = await client.GetFromJsonAsync<JsonElement[]>(
    "${employeesEndpoint}");
var employee = await client.GetFromJsonAsync<JsonElement>(
    "${employeeOrigin}/employees/1/");

Console.WriteLine(JsonSerializer.Serialize(employee, new JsonSerializerOptions
{
    WriteIndented = true
}));`,
    aspnetcore: `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient("fakeEmployees", client =>
    client.BaseAddress = new Uri("${employeeOrigin}"));

var app = builder.Build();

app.MapGet("/employees", async (IHttpClientFactory clients) =>
{
    var response = await clients.CreateClient("fakeEmployees")
        .GetAsync("/employees/");
    response.EnsureSuccessStatusCode();
    return Results.Content(
        await response.Content.ReadAsStringAsync(),
        "application/json");
});

app.MapGet("/employees/{id:int}", async (int id, IHttpClientFactory clients) =>
{
    var response = await clients.CreateClient("fakeEmployees")
        .GetAsync($"/employees/{id}/");
    if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        return Results.NotFound();
    response.EnsureSuccessStatusCode();
    return Results.Content(
        await response.Content.ReadAsStringAsync(),
        "application/json");
});

app.Run();`,
    nodejs: `const baseUrl = "${employeeOrigin}";

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(\`Request failed: \${response.status}\`);
  return response.json();
}

const employees = await getJson(\`\${baseUrl}/employees/\`);
const employee = await getJson(\`\${baseUrl}/employees/1/\`);
console.log({ employees, employee });`,
    express: `import express from "express";

const app = express();
const baseUrl = "${employeeOrigin}";

async function proxyJson(path, res) {
  try {
    const response = await fetch(\`\${baseUrl}\${path}\`);
    if (!response.ok) return res.sendStatus(response.status);
    return res.json(await response.json());
  } catch {
    return res.sendStatus(502);
  }
}

app.get("/employees", (_req, res) => proxyJson("/employees/", res));
app.get("/employees/:id", (req, res) =>
  proxyJson(\`/employees/\${req.params.id}/\`, res));

app.listen(3000);`,
    go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

const baseURL = "${employeeOrigin}"

func getJSON(path string, target any) error {
    response, err := http.Get(baseURL + path)
    if err != nil {
        return err
    }
    defer response.Body.Close()
    if response.StatusCode != http.StatusOK {
        return fmt.Errorf("request failed: %s", response.Status)
    }
    return json.NewDecoder(response.Body).Decode(target)
}

func main() {
    var employees []map[string]any
    var employee map[string]any
    if err := getJSON("/employees/", &employees); err != nil {
        panic(err)
    }
    if err := getJSON("/employees/1/", &employee); err != nil {
        panic(err)
    }
    fmt.Println(employees, employee)
}`,
    gin: `package main

import (
    "encoding/json"
    "net/http"

    "github.com/gin-gonic/gin"
)

const baseURL = "${employeeOrigin}"

func proxyJSON(path string, c *gin.Context) {
    response, err := http.Get(baseURL + path)
    if err != nil {
        c.JSON(http.StatusBadGateway, gin.H{"error": "Could not fetch employees"})
        return
    }
    defer response.Body.Close()
    if response.StatusCode != http.StatusOK {
        c.Status(response.StatusCode)
        return
    }
    var data any
    if err := json.NewDecoder(response.Body).Decode(&data); err != nil {
        c.JSON(http.StatusBadGateway, gin.H{"error": "Invalid JSON response"})
        return
    }
    c.JSON(http.StatusOK, data)
}

func main() {
    router := gin.Default()
    router.GET("/employees", func(c *gin.Context) {
        proxyJSON("/employees/", c)
    })
    router.GET("/employees/:id", func(c *gin.Context) {
        proxyJSON("/employees/"+c.Param("id")+"/", c)
    })
    router.Run(":8080")
}`,
    php: `<?php

function getJson(string $url): array
{
    $handle = curl_init($url);
    curl_setopt_array($handle, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
    ]);
    $body = curl_exec($handle);
    $status = curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
    if ($body === false || $status < 200 || $status >= 300) {
        throw new RuntimeException("Request failed: HTTP $status");
    }
    curl_close($handle);
    return json_decode($body, true, flags: JSON_THROW_ON_ERROR);
}

$baseUrl = "${employeeOrigin}";
$employees = getJson("$baseUrl/employees/");
$employee = getJson("$baseUrl/employees/1/");
print_r($employee);`,
    laravel: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Support\\Facades\\Http;

class EmployeeController extends Controller
{
    public function index()
    {
        return Http::get("${employeesEndpoint}")
            ->throw()
            ->json();
    }

    public function show(int $id)
    {
        return Http::get("${employeeOrigin}/employees/$id/")
            ->throw()
            ->json();
    }
}`,
    ruby: `require "json"
require "net/http"

BASE_URL = "${employeeOrigin}"

def get_json(path)
  uri = URI("#{BASE_URL}#{path}")
  response = Net::HTTP.get_response(uri)
  raise "Request failed: #{response.code}" unless response.is_a?(Net::HTTPSuccess)
  JSON.parse(response.body)
end

employees = get_json("/employees/")
employee = get_json("/employees/1/")
puts employee`,
    rails: `class EmployeesController < ApplicationController
  def index
    render json: fetch_json("${employeesEndpoint}")
  end

  def show
    render json: fetch_json("${employeeOrigin}/employees/#{params[:id]}/")
  end

  private

  def fetch_json(url)
    response = Net::HTTP.get_response(URI(url))
    unless response.is_a?(Net::HTTPSuccess)
      return head(response.code.to_i)
    end
    JSON.parse(response.body)
  rescue StandardError
    render json: { error: "Could not fetch employee data" },
           status: :bad_gateway
  end
end`,
  };
  const selectedEmployeeCode = employeeCodeSamples[employeeCodeLanguage];
  const stats = useMemo(() => ({
    chars: output.length,
    lines: output ? output.split('\n').length : 0,
  }), [output]);

  const textStats = useMemo(() => ({
    characters: Array.from(countText).length,
    charactersWithoutWhitespace: Array.from(countText).filter((character) => !/\s/u.test(character)).length,
    words: countText.trim() ? countText.trim().split(/\s+/u).length : 0,
    lines: countText ? countText.split(/\r\n|\r|\n/u).length : 0,
  }), [countText]);

  function parseInput() {
    if (!input.trim()) throw new Error('Enter some JSON first.');
    return JSON.parse(input);
  }

  function updateJsonInput(value) {
    setInput(value);

    if (!value.trim()) {
      setOutput('');
      setMessage('Paste JSON or load the example to get started.');
      setKind('info');
      return;
    }

    try {
      const result = JSON.stringify(JSON.parse(value), null, 2);
      setOutput(result);
      setMessage('Valid JSON — formatted with 2-space indentation.');
      setKind('success');
    } catch (error) {
      setOutput('');
      setMessage(error instanceof SyntaxError ? `Invalid JSON: ${error.message}` : error.message);
      setKind('error');
    }
  }

  function formatJson() {
    try {
      const value = parseInput();
      const result = JSON.stringify(value, null, 2);
      setOutput(result);
      setMessage('Valid JSON — formatted with 2-space indentation.');
      setKind('success');
    } catch (error) {
      setMessage(error instanceof SyntaxError ? `Invalid JSON: ${error.message}` : error.message);
      setKind('error');
    }
  }

  function minifyJson() {
    try {
      const result = JSON.stringify(parseInput());
      setOutput(result);
      setMessage('Valid JSON — minified successfully.');
      setKind('success');
    } catch (error) {
      setMessage(error instanceof SyntaxError ? `Invalid JSON: ${error.message}` : error.message);
      setKind('error');
    }
  }

  function validateJson() {
    try {
      parseInput();
      setMessage('Valid JSON — no syntax errors found.');
      setKind('success');
    } catch (error) {
      setMessage(error instanceof SyntaxError ? `Invalid JSON: ${error.message}` : error.message);
      setKind('error');
    }
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setMessage('Output copied to clipboard.');
      setKind('success');
    } catch {
      setMessage('Clipboard access was blocked by your browser. Select and copy the output.');
      setKind('error');
    }
  }

  async function copyEmployeeUrl(url) {
    try {
      await navigator.clipboard.writeText(url);
      setEmployeeUrlMessage('URL copied to clipboard.');
    } catch {
      setEmployeeUrlMessage('Could not access the clipboard. Select and copy the URL.');
    }
  }

  async function copyEmployeeCode() {
    try {
      await navigator.clipboard.writeText(selectedEmployeeCode);
      setEmployeeCodeMessage('Code copied to clipboard.');
    } catch {
      setEmployeeCodeMessage('Could not access the clipboard. Select and copy the code.');
    }
  }

  function downloadOutput() {
    if (!output) return;
    const trimmedFileName = fileName.trim();
    if (!trimmedFileName) {
      setMessage('Enter a file name before downloading.');
      setKind('error');
      return;
    }

    const downloadName = /\.json$/i.test(trimmedFileName)
      ? trimmedFileName
      : `${trimmedFileName}.json`;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadName;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setMessage(`Downloaded ${downloadName}.`);
    setKind('success');
  }

  function downloadSourceCode() {
    const sanitizedName = sourceFileName.trim().replace(/[<>:"/\\|?*\u0000-\u001F]/gu, '_');
    if (!sanitizedName) {
      setRunMessage('Enter a file name before downloading.');
      setRunKind('error');
      return;
    }

    const extension = sourceFileExtensions[codeLanguage];
    const downloadName = /\.(?:py|java|cpp|js|cs)$/iu.test(sanitizedName)
      ? sanitizedName.replace(/\.(?:py|java|cpp|js|cs)$/iu, extension)
      : `${sanitizedName}${extension}`;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadName;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setRunMessage(`Downloaded ${downloadName}.`);
    setRunKind('success');
  }

  function loadExample() {
    updateJsonInput(postExample);
  }

  function clearAll() {
    updateJsonInput('');
  }

  function compareJson() {
    try {
      if (!leftJson.trim() || !rightJson.trim()) {
        throw new Error('Enter JSON in both editors before comparing.');
      }

      const leftValue = JSON.parse(leftJson);
      const rightValue = JSON.parse(rightJson);
      const differences = collectDifferences(leftValue, rightValue);
      setComparison(differences);
      setCompareMessage(
        differences.length === 0
          ? 'The JSON values match.'
          : `Found ${differences.length} difference${differences.length === 1 ? '' : 's'}.`,
      );
      setCompareKind('success');
    } catch (error) {
      setComparison(null);
      setCompareMessage(error instanceof SyntaxError ? `Invalid JSON: ${error.message}` : error.message);
      setCompareKind('error');
    }
  }

  function updateCompareInput(setter, value) {
    setter(value);
    setComparison(null);
    setCompareMessage('JSON changed. Compare again to see the differences.');
    setCompareKind('info');
  }

  async function runCode() {
    const runStartedAt = performance.now();
    setComplexityEstimate(estimateComplexity(codeLanguage, code));
    setIsRunning(true);
    setProgramOutput('');
    setRunDurationMs(null);
    setRunMessage('Connecting to the online runner…');
    setRunKind('info');

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 60_000);

    try {
      if (codeLanguage === 'java' && javaRunnerUrl) {
        const response = await fetch(`${javaRunnerUrl.replace(/\/+$/u, '')}/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ script: code, stdin, version: javaVersion }),
          signal: controller.signal,
        });

        let result;
        try {
          result = await response.json();
        } catch {
          throw new Error('The Java runner returned an invalid response. Please try again.');
        }

        if (result === null || typeof result !== 'object' || Array.isArray(result)) {
          throw new Error('The Java runner returned an invalid response. Please try again.');
        }
        if (!response.ok) {
          throw new Error(typeof result.error === 'string' ? result.error : `The Java runner returned HTTP ${response.status}. Please try again.`);
        }
        if (typeof result.output !== 'string') {
          throw new Error('The Java runner did not return program output. Please try again.');
        }

        setProgramOutput(result.output);
        setRunMessage(`Java ${javaVersion} result received.`);
        setRunKind('info');
        return;
      }

      const runtime = codeRuntimes[codeLanguage];
      const codeToRun = codeLanguage === 'java'
        ? code.replace(/^(\s*)public\s+(?=class\s+Main\b)/m, '$1')
        : code;
      const response = await fetch('https://wandbox.org/api/compile.ndjson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compiler: runtime.compiler,
          code: codeToRun,
          stdin,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`The code runner returned HTTP ${response.status}. Please try again.`);
      }
      if (!response.body) {
        throw new Error('The online runner did not provide a readable response. Please try again.');
      }

      setRunMessage('Compiling and running…');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let pending = '';
      let output = '';
      let compilerError = '';
      let exitCode;
      let isFinished = false;

      function processEvent(line) {
        if (!line.trim()) return;

        const event = JSON.parse(line);
        if (event.type === 'StdOut' || event.type === 'StdErr' || event.type === 'CompilerMessage' || event.type === 'CompilerMessageE') {
          output += event.data;
          if (event.type === 'CompilerMessageE') compilerError += event.data;
          setProgramOutput(output.trimEnd());
        } else if (event.type === 'ExitCode') {
          exitCode = event.data;
          if (exitCode !== '0') {
            setRunMessage(compilerError ? 'Compilation failed.' : 'Program finished with an error.');
            setRunKind('error');
          } else {
            setRunMessage('Program is finishing…');
          }
        } else if (event.type === 'Control' && event.data === 'Finish') {
          isFinished = true;
        }
      }

      while (true) {
        const { done, value } = await reader.read();
        pending += decoder.decode(value, { stream: !done });

        const lines = pending.split('\n');
        pending = lines.pop() ?? '';
        for (const line of lines) processEvent(line);

        if (done) break;
      }
      processEvent(pending);

      if (exitCode === undefined || !isFinished) {
        throw new Error('The online runner ended before returning a complete result. Please try again.');
      }

      if (exitCode === '0') {
        setRunMessage('Program finished successfully.');
        setRunKind('success');
      }
    } catch (error) {
      setRunMessage(error instanceof Error && error.name === 'AbortError'
        ? 'The runner took longer than 60 seconds and was stopped. Please try again.'
        : error instanceof TypeError
          ? 'Could not reach the online runner. Check your connection and try again.'
          : error instanceof Error ? error.message : 'An unexpected error occurred while running your program.');
      setRunKind('error');
    } finally {
      window.clearTimeout(timeoutId);
      setRunDurationMs(performance.now() - runStartedAt);
      setIsRunning(false);
    }
  }

  function changeCodeLanguage(event) {
    const language = event.target.value;
    setCodeLanguage(language);
    setCode(codeExamples[language]);
    setSourceFileName(sourceFileNames[language]);
    setProgramOutput('');
    setRunDurationMs(null);
    setComplexityEstimate(null);
    setRunMessage('Ready to run your program.');
    setRunKind('info');
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">{'{}'}</span> PrettyJSON</div>
        <nav className="tabs" role="tablist" aria-label="Developer tools">
          <button
            className={`tab ${activeTab === 'format' ? 'active' : ''}`}
            id="format-tab"
            role="tab"
            aria-selected={activeTab === 'format'}
            aria-controls="format-panel"
            onClick={() => setActiveTab('format')}
          >
            <span className="tab-label-wide">Format JSON</span>
            <span className="tab-label-compact">Format</span>
          </button>
          <button
            className={`tab ${activeTab === 'compare' ? 'active' : ''}`}
            id="compare-tab"
            role="tab"
            aria-selected={activeTab === 'compare'}
            aria-controls="compare-panel"
            onClick={() => setActiveTab('compare')}
          >
            <span className="tab-label-wide">Compare JSON</span>
            <span className="tab-label-compact">Compare</span>
          </button>
          <button
            className={`tab ${activeTab === 'count' ? 'active' : ''}`}
            id="count-tab"
            role="tab"
            aria-label="Count Characters"
            aria-selected={activeTab === 'count'}
            aria-controls="count-panel"
            onClick={() => setActiveTab('count')}
          >
            <span className="tab-label-wide">Count Characters</span>
            <span className="tab-label-compact">Count</span>
          </button>
          <button
            className={`tab ${activeTab === 'code' ? 'active' : ''}`}
            id="code-tab"
            role="tab"
            aria-label="Code"
            aria-selected={activeTab === 'code'}
            aria-controls="code-panel"
            onClick={() => setActiveTab('code')}
          >
            <span className="tab-label-wide">Code</span>
            <span className="tab-label-compact">Code</span>
          </button>
          <button
            className={`tab ${activeTab === 'fake-data' ? 'active' : ''}`}
            id="fake-data-tab"
            role="tab"
            aria-selected={activeTab === 'fake-data'}
            aria-controls="fake-data-panel"
            aria-label="Fake(Json) Data"
            onClick={() => setActiveTab('fake-data')}
          >
            <span className="tab-label-wide">Fake(Json) Data</span>
            <span className="tab-label-compact">Data</span>
          </button>
          <button
            className={`tab ${activeTab === 'about' ? 'active' : ''}`}
            id="about-tab"
            role="tab"
            aria-label="About PrettyJSON"
            aria-selected={activeTab === 'about'}
            aria-controls="about-panel"
            onClick={() => setActiveTab('about')}
          >
            <span className="tab-label-wide">About</span>
            <span className="tab-label-compact">About</span>
          </button>
        </nav>
      </header>

      {activeTab === 'format' ? (
        <FormatWorkspace
          input={input}
          output={output}
          fileName={fileName}
          stats={stats}
          kind={kind}
          message={message}
          updateJsonInput={updateJsonInput}
          loadExample={loadExample}
          clearAll={clearAll}
          formatJson={formatJson}
          minifyJson={minifyJson}
          validateJson={validateJson}
          setFileName={setFileName}
          copyOutput={copyOutput}
          downloadOutput={downloadOutput}
          setOutput={setOutput}
        />
      ) : activeTab === 'compare' ? (
        <CompareWorkspace
          leftJson={leftJson}
          rightJson={rightJson}
          comparison={comparison}
          compareMessage={compareMessage}
          compareKind={compareKind}
          setLeftJson={setLeftJson}
          setRightJson={setRightJson}
          updateCompareInput={updateCompareInput}
          compareJson={compareJson}
        />
      ) : activeTab === 'count' ? (
        <CountWorkspace countText={countText} setCountText={setCountText} textStats={textStats} />
      ) : activeTab === 'code' ? (
        <CodeWorkspace
          codeLanguage={codeLanguage}
          code={code}
          sourceFileName={sourceFileName}
          stdin={stdin}
          programOutput={programOutput}
          runMessage={runMessage}
          runKind={runKind}
          isRunning={isRunning}
          runDurationMs={runDurationMs}
          complexityEstimate={complexityEstimate}
          javaRunnerUrl={javaRunnerUrl}
          setSourceFileName={setSourceFileName}
          downloadSourceCode={downloadSourceCode}
          runCode={runCode}
          setCode={setCode}
          setRunDurationMs={setRunDurationMs}
          setComplexityEstimate={setComplexityEstimate}
          setStdin={setStdin}
          changeCodeLanguage={changeCodeLanguage}
        />
      ) : activeTab === 'fake-data' ? (
        <FakeDataWorkspace
          employeesEndpoint={employeesEndpoint}
          employeeOrigin={employeeOrigin}
          employeeByIdEndpoint={employeeByIdEndpoint}
          employeeUrlMessage={employeeUrlMessage}
          employeeCodeMessage={employeeCodeMessage}
          employeeCodeLanguage={employeeCodeLanguage}
          selectedEmployeeCode={selectedEmployeeCode}
          copyEmployeeUrl={copyEmployeeUrl}
          copyEmployeeCode={copyEmployeeCode}
          setEmployeeCodeLanguage={setEmployeeCodeLanguage}
          setEmployeeUrlMessage={setEmployeeUrlMessage}
          setEmployeeCodeMessage={setEmployeeCodeMessage}
        />
      ) : (
        <AboutWorkspace />
      )}

    </main>
  );
}
