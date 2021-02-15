import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import MonacoEditor from "@monaco-editor/react";
import { UnControlled as CodeMirror } from "react-codemirror2";

const AceEditor = dynamic(
  async () => {
    const ace = await import("react-ace");
    await import("ace-builds/src-noconflict/mode-javascript");
    await import("ace-builds/src-noconflict/theme-github");
    return ace;
  },
  {
    ssr: false
  }
);

// dynamic(import("ace-builds/src-noconflict/mode-javascript"), { ssr: false });
// dynamic(import("ace-builds/src-noconflict/theme-github"), { ssr: false });

if (typeof navigator != typeof undefined)
  require("codemirror/mode/javascript/javascript");

const EDITOR_OPTIONS_LOADING_STATE = {
  value: "loading...",
  language: "javascript"
};

export default function Home() {
  const [gameFile, setGameFile] = useState(null);
  const [testFile, setTestFile] = useState(null);
  const [activeFileName, changeActiveFileName] = useState("game.js");
  const [editorOptions, setEditorOptions] = useState(
    EDITOR_OPTIONS_LOADING_STATE
  );
  const [activeEditor, changeEditor] = useState("MonacoEditor");

  useEffect(() => {
    const fetchGameFile = async () => {
      const gameFile = await fetch("/game.js");
      setGameFile(await gameFile.text());
    };
    fetchGameFile();
  }, []);

  useEffect(() => {
    const fetchTestFile = async () => {
      const testFile = await fetch("/tests.js");
      setTestFile(await testFile.text());
    };
    fetchTestFile();
  }, []);

  useEffect(() => {
    switch (activeFileName) {
      case "game.js":
        if (gameFile)
          setEditorOptions({
            path: "game.js",
            language: "javascript",
            value: gameFile
          });
        else setEditorOptions(EDITOR_OPTIONS_LOADING_STATE);
        break;
      case "tests.js":
        if (testFile)
          setEditorOptions({
            path: "tests.js",
            language: "javascript",
            value: testFile
          });
        else setEditorOptions(EDITOR_OPTIONS_LOADING_STATE);
        break;
    }
  }, [activeFileName, gameFile, testFile]);

  const handleFileSelectChange = e => changeActiveFileName(e.target.value);
  const handleEditorSelectChange = e => changeEditor(e.target.value);

  return (
    <div className={styles.container}>
      <Head>
        <title>IDE Spike</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <select value={activeFileName} onChange={handleFileSelectChange}>
          <option value="game.js">game.js</option>
          <option value="tests.js">tests.js</option>
        </select>
        <select value={activeEditor} onChange={handleEditorSelectChange}>
          <option value="MonacoEditor">MonacoEditor</option>
          <option value="CodeMirror">CodeMirror</option>
          <option value="ACE">ACE</option>
        </select>

        {activeEditor == "MonacoEditor" && (
          <MonacoEditor
            path={editorOptions.path}
            defaultLanguage={editorOptions.language}
            defaultValue={editorOptions.value}
          />
        )}
        {activeEditor == "CodeMirror" && (
          <CodeMirror
            value={editorOptions.value}
            options={{
              mode: editorOptions.language,
              theme: "material",
              lineNumbers: true
            }}
          />
        )}
        {activeEditor == "ACE" && (
          <AceEditor
            value={editorOptions.value}
            mode={editorOptions.language}
            theme="github"
            height="100%"
            width="100%"
          />
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
