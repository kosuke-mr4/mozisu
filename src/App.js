import { useState } from "preact/hooks";
import githubIcon from "./assets/github-mark.png";

function textCharaSplit(text) {
  const ZWJ = 0x200d; // Zero Width Joiner
  const VS_START1 = 0xfe00; // Variation Selector Start Range 1
  const VS_END1 = 0xfe0f; // Variation Selector End Range 1
  const VS_START2 = 0xe0100; // Variation Selector Start Range 2
  const VS_END2 = 0xe01ef; // Variation Selector End Range 2
  const EMOJI_MODIFIER_START = 0x1f3fb; // Emoji Modifier Start
  const EMOJI_MODIFIER_END = 0x1f3ff; // Emoji Modifier End
  const REGIONAL_INDICATOR_START = 0x1f1e6; // Regional Indicator Symbol Letter A
  const REGIONAL_INDICATOR_END = 0x1f1ff; // Regional Indicator Symbol Letter Z
  const TAG_BASE = 0x1f3f4; // Tag base
  const TAG_START = 0xe0020; // Tag Start
  const TAG_END = 0xe007f; // Tag End
  const CANCEL_TAG = 0xe007f; // Cancel Tag
  const KEYCAP_END = 0x20e3; // Combining Enclosing Keycap

  const charArr = [];
  let chara = [];
  let needCode = 0;
  let regionalIndicatorCount = 0;
  let inTagSequence = false;
  let inKeycapSequence = false;

  for (const c of text) {
    const cp = c.codePointAt(0);
    if (cp === ZWJ) {
      // ZWJ
      needCode += 1;
    } else if (
      (VS_START1 <= cp && cp <= VS_END1) ||
      (VS_START2 <= cp && cp <= VS_END2)
    ) {
      // Variation Selector
      // Do nothing, continue to next character
    } else if (EMOJI_MODIFIER_START <= cp && cp <= EMOJI_MODIFIER_END) {
      // Emoji Modifier
      // Do nothing, continue to next character
    } else if (REGIONAL_INDICATOR_START <= cp && cp <= REGIONAL_INDICATOR_END) {
      // Emoji Flag Sequence
      regionalIndicatorCount += 1;
      if (regionalIndicatorCount === 2) {
        charArr.push(chara.join("") + c);
        chara = [];
        regionalIndicatorCount = 0;
        continue;
      }
    } else if (cp === TAG_BASE) {
      // Emoji Tag Sequence
      inTagSequence = true;
      chara.push(c);
      continue;
    } else if (
      inTagSequence &&
      ((TAG_START <= cp && cp <= TAG_END) || cp === CANCEL_TAG)
    ) {
      chara.push(c);
      if (cp === CANCEL_TAG) {
        charArr.push(chara.join(""));
        chara = [];
        inTagSequence = false;
      }
      continue;
    } else if (/^[0-9#*]$/.test(c) && !inKeycapSequence) {
      // Keycap Sequence Start
      inKeycapSequence = true;
    } else if (inKeycapSequence && cp === KEYCAP_END) {
      // Keycap Sequence End
      chara.push(c);
      charArr.push(chara.join(""));
      chara = [];
      inKeycapSequence = false;
      continue;
    } else if (needCode > 0) {
      needCode -= 1;
    } else if (chara.length > 0) {
      charArr.push(chara.join(""));
      chara = [];
    }
    chara.push(c);
  }
  if (chara.length > 0) {
    charArr.push(chara.join(""));
  }
  return charArr;
}

function App() {
  const [text, setText] = useState("");
  const [countedText, setCountedText] = useState("");

  const handleInput = (e) => {
    const inputText = e.target.value;
    setText(inputText);

    const strippedText = inputText.replace(/[\n\s]/g, "");
    setCountedText(strippedText);
  };

  const graphemes = textCharaSplit(countedText);
  console.log(graphemes);

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
