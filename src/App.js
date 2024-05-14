// src/App.js
import { useState } from "preact/hooks";
import githubIcon from "./assets/github-mark.png";
import GraphemeSplitter from "grapheme-splitter";

function App() {
  const [text, setText] = useState("");
  const [countedText, setCountedText] = useState("");

  const handleInput = (e) => {
    const inputText = e.target.value;
    setText(inputText);

    const strippedText = inputText.replace(/[\n\s]/g, "");
    setCountedText(strippedText);
  };

  const splitter = new GraphemeSplitter();
  const graphemes = splitter.splitGraphemes(countedText);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4 text-center">mozisu</h1>
      <div className="text-center mx-4">
        <textarea
          value={text}
          onInput={handleInput}
          className="border border-gray-300 rounded-none py-4 px-6 w-full mb-8 text-2xl"
          placeholder="文字列を入力してください"
        />
        <p className="text-xl font-bold">文字数: {graphemes.length}</p>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 flex justify-center items-center h-16">
        <a
          href="https://github.com/kosuke-mr4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={githubIcon} alt="GitHub" className="h-8" />
        </a>
      </footer>
    </div>
  );
}

export default App;
