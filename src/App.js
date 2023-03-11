import ClipboardJS from "clipboard";
import { useEffect, useRef, useState } from "react";
import './App.css';

function App() {
  const buttonRef = useRef(null);
  const [inputData, setInputData] = useState('');
  const [readData, setReadData] = useState('');
  const [copied, setCopied] = useState(false);

  const linkShorten = (link) => {
    const accessToken = process.env.BITLY_URI;

    fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({ 'long_url': link, 'domain': 'bit.ly', 'group_guid': 'Ba1bc23dE4F' })
      body: JSON.stringify({ 'long_url': link })
    })
      .then((response) => response.json())
      .then((data) => setReadData(data.link))
      .catch((err) => console.log(err));
  };

  /*
  const dummyFunction = (link) => {
    setReadData(link);
  };
  */

  const onChange = (event) => {
    setInputData(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // dummyFunction(inputData);
    linkShorten(inputData)
  };

  useEffect(() => {
    if (readData) {
      const clipboard = new ClipboardJS(buttonRef.current, {
        text: () => readData
      });

      clipboard.on('success', (e) => {
        setCopied(true);
        // e.clearSelection();
      });
      clipboard.on('error', () => {
        console.error('Failed to copy text');
      });
    }

    setCopied(false);

  }, [readData]);

  /* const handleClick = () => {  // With clipboardJS but no useEffect use..
    if (readData) {
      const clipboard = new ClipboardJS(buttonRef.current, {
        text: () => readData
      });

      clipboard.on('success', (e) => {
        setCopied(true);
        e.clearSelection();
      });

      clipboard.on('error', () => {
        console.error('Failed to copy text');
      });
    } else {
      console.error('No text to copy');
    }
  };
  */

  /* const handleClick = () => {  // without ClipboardJS
    if (!readData) {
      console.error('No text to copy');
      return;
    }

    const selection = window.getSelection();
    selection.removeAllRanges();

    const range = document.createRange();
    range.selectNode(buttonRef.current);
    selection.addRange(range);

    document.execCommand('copy');
    setCopied(true);
    selection.removeAllRanges();

  };
  */

  const handleClick = async () => {
    if (readData) {
      try {
        await navigator.clipboard.writeText(readData);
        setCopied(true);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    } else {
      console.error('No text to copy');
    }
  };


  return (
    <div className="App">
      <h1>Link Shortener</h1>
      <div className="link--shortener_input">
        <input className="userInput" type="url" name="inputData" value={inputData} onChange={onChange} placeholder={'Paste Your Link'} />
        <button type="submit" onClick={handleSubmit}>Shorten</button>
      </div>
      <div className="link--shortener_output">
        <input className="userOutput" type="url" name="readData" readOnly value={readData} placeholder={'Shortened Link'} />
        <button ref={buttonRef} onClick={handleClick}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

export default App;