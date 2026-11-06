export const codeExamples = {
  python: 'print("Hello, world!")\n',
  java: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}\n',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}\n',
  javascript: 'console.log("Hello, world!");\n',
  csharp: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, world!");\n    }\n}\n',
};

export const codeRuntimes = {
  python: { compiler: 'cpython-3.13.8' },
  java: { compiler: 'openjdk-jdk-22+36' },
  cpp: { compiler: 'gcc-13.2.0' },
  javascript: { compiler: 'nodejs-20.17.0' },
  csharp: { compiler: 'mono-6.12.0.199' },
};

export const sourceFileNames = {
  python: 'main.py',
  java: 'Main.java',
  cpp: 'main.cpp',
  javascript: 'main.js',
  csharp: 'Program.cs',
};

export const sourceFileExtensions = {
  python: '.py',
  java: '.java',
  cpp: '.cpp',
  javascript: '.js',
  csharp: '.cs',
};

export const javaRunnerUrl = import.meta.env.VITE_JAVA_RUNNER_URL;

export const postExample = JSON.stringify({
  userId: 1,
  id: 1,
  title: 'Providing a solution while avoiding unnecessary complications',
  body: 'He offers support and assistance to achieve the desired outcome while avoiding unnecessary difficulties.',
});
