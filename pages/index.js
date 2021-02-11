import React, { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Editor from "@monaco-editor/react";

const EDITOR_LOADING_STATE = {
  value: "loading...",
  language: "javascript"
};

export default function Home() {
  const [gameFile, setGameFile] = useState(null);
  const [testFile, setTestFile] = useState(null);
  const [activeFileName, changeActiveFileName] = useState("game.js");
  const [editor, setEditor] = useState(EDITOR_LOADING_STATE);

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
          setEditor({
            path: "game.js",
            language: "javascript",
            value: gameFile
          });
        else setEditor(EDITOR_LOADING_STATE);
        break;
      case "tests.js":
        if (testFile)
          setEditor({
            path: "tests.js",
            language: "javascript",
            value: testFile
          });
        else setEditor(EDITOR_LOADING_STATE);
        break;
    }
  }, [activeFileName, gameFile, testFile]);

  const handleFileSelectChange = e => changeActiveFileName(e.target.value);

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

        <Editor
          path={editor.path}
          defaultLanguage={editor.language}
          defaultValue={editor.value}
        />
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
