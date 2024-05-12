// src/App.js
import { useState } from "preact/hooks";

function App() {
  const [text, setText] = useState("");

  const handleInput = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4 text-center">mozisu</h1>
      <div className="text-center">
        <textarea
          value={text}
          onInput={handleInput}
          className="border border-gray-300 rounded-none py-4 px-6 w-full mb-8 text-2xl h-64 mx-4 sm:mx-0"
          placeholder="文字列を入力してください"
        />
        <p className="text-xl font-bold">
          文字数: {Array.from(text.replace(/[\n\s]/g, "")).length}
        </p>
      </div>
    </div>
  );
}

export default App;
