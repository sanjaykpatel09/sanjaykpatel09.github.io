import { useEffect, useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const languageExtensionLoaders = {
  python: () => import('@codemirror/lang-python').then(({ python }) => python()),
  java: () => import('@codemirror/lang-java').then(({ java }) => java()),
  cpp: () => import('@codemirror/lang-cpp').then(({ cpp }) => cpp()),
  javascript: () => import('@codemirror/lang-javascript').then(({ javascript }) => javascript()),
  csharp: () => import('@replit/codemirror-lang-csharp').then(({ csharp }) => csharp()),
};

const languageLabels = {
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  javascript: 'JavaScript',
  csharp: 'C#',
};

const codeHighlighting = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.definitionKeyword, tags.moduleKeyword], color: '#8b45c6', fontWeight: '600' },
  { tag: [tags.className, tags.typeName], color: '#2676b8', fontWeight: '600' },
  { tag: [tags.function(tags.variableName), tags.definition(tags.variableName)], color: '#167d83' },
  { tag: [tags.string, tags.special(tags.string)], color: '#218153' },
  { tag: [tags.number, tags.bool, tags.null], color: '#b45b18' },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: '#8a8e9d', fontStyle: 'italic' },
  { tag: [tags.operator, tags.punctuation, tags.bracket], color: '#596078' },
  { tag: [tags.propertyName, tags.variableName], color: '#39405b' },
]);

export default function CodeEditor({ language, code, onChange }) {
  const [languageExtension, setLanguageExtension] = useState(null);
  const [languageLoadFailed, setLanguageLoadFailed] = useState(false);

  useEffect(() => {
    let isCurrentLanguage = true;
    setLanguageExtension(null);
    setLanguageLoadFailed(false);

    languageExtensionLoaders[language]()
      .then((extension) => {
        if (isCurrentLanguage) setLanguageExtension(extension);
      })
      .catch(() => {
        if (isCurrentLanguage) setLanguageLoadFailed(true);
      });

    return () => {
      isCurrentLanguage = false;
    };
  }, [language]);

  const extensions = useMemo(
    () => [
      ...(languageExtension ? [languageExtension] : []),
      syntaxHighlighting(codeHighlighting),
    ],
    [languageExtension],
  );

  return (
    <>
      {languageLoadFailed && (
        <div className="editor-language-warning" role="status">
          {languageLabels[language]} syntax highlighting could not be loaded. You can still edit and run your code.
        </div>
      )}
      <CodeMirror
        className="source-code-editor"
        aria-label={`${languageLabels[language]} source code`}
        value={code}
        onChange={onChange}
        extensions={extensions}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          tabSize: 4,
        }}
      />
    </>
  );
}
