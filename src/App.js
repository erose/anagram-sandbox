import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputWord, setInputWord] = useState('');
  const [remainingLetters, setRemainingLetters] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // Function to serialize selectedItems into a string
  const serializeSelectedItems = (items) => {
    return items
      .map((item) => (item.type === 'letter' ? item.value : '|'))
      .join('');
  };

  // Function to deserialize a string into selectedItems
  const deserializeSelectedItems = (str) => {
    const items = [];
    for (const char of str) {
      if (char === '|') {
        items.push({ type: 'linebreak', value: '⏎' });
      } else {
        items.push({ type: 'letter', value: char });
      }
    }
    return items;
  };

  // Function to update the URL with the current state
  const updateURL = (input, items) => {
    const params = new URLSearchParams();
    params.set('input', encodeURIComponent(input));
    params.set('anagram', encodeURIComponent(serializeSelectedItems(items)));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  };

  // Initialize state from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inputFromUrl = params.get('input');
    const anagramFromUrl = params.get('anagram');
    if (inputFromUrl && anagramFromUrl) {
      const decodedInput = decodeURIComponent(inputFromUrl);
      setInputWord(decodedInput);
      const lettersArray = decodedInput.replace(/\s+/g, '').toUpperCase().split('');
      const deserializedItems = deserializeSelectedItems(decodeURIComponent(anagramFromUrl));
      setSelectedItems(deserializedItems);

      // Remove selected letters from remainingLetters considering duplicates
      const selectedLetters = deserializedItems
        .filter((item) => item.type === 'letter')
        .map((item) => item.value);

      let newRemainingLetters = [...lettersArray];
      selectedLetters.forEach((selLetter) => {
        const index = newRemainingLetters.indexOf(selLetter);
        if (index !== -1) {
          newRemainingLetters.splice(index, 1);
        }
      });

      setRemainingLetters(newRemainingLetters);
    } else {
      // Initialize empty state
      setInputWord('');
      setRemainingLetters([]);
      setSelectedItems([]);
    }
  }, []);

  // Update remainingLetters when inputWord changes
  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setInputWord(newInput);
    const lettersArray = newInput.replace(/\s+/g, '').toUpperCase().split('');
    setRemainingLetters(lettersArray);
    setSelectedItems([]);
    // Update URL to reflect new input
    updateURL(newInput, []);
  };

  const selectLetter = (index) => {
    const letter = remainingLetters[index];
    const newSelectedItems = [...selectedItems, { type: 'letter', value: letter }];
    setSelectedItems(newSelectedItems);
    const newRemainingLetters = remainingLetters.filter((_, i) => i !== index);
    setRemainingLetters(newRemainingLetters);
    updateURL(inputWord, newSelectedItems);
  };

  const deselectItem = (index) => {
    const item = selectedItems[index];
    let newRemainingLetters = remainingLetters;
    if (item.type === 'letter') {
      newRemainingLetters = [...remainingLetters, item.value];
      setRemainingLetters(newRemainingLetters);
    }
    const newSelectedItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(newSelectedItems);
    updateURL(inputWord, newSelectedItems);
  };

  const addLineBreak = () => {
    const newSelectedItems = [...selectedItems, { type: 'linebreak', value: '⏎' }];
    setSelectedItems(newSelectedItems);
    updateURL(inputWord, newSelectedItems);
  };

  return (
    <div className="App">
      <input
        type="text"
        value={inputWord}
        onChange={handleInputChange}
        placeholder="Enter a word or phrase"
      />
      <div className="letters-container">
        <div className="selected-letters">
          {selectedItems.map((item, index) =>
            item.type === 'linebreak' ? (
              <React.Fragment key={`selected-${index}`}>
                <span
                  className="linebreak"
                  onClick={() => deselectItem(index)}
                >
                  {item.value}
                </span>
                <br />
              </React.Fragment>
            ) : (
              <span
                key={`selected-${index}`}
                className="letter selected"
                onClick={() => deselectItem(index)}
              >
                {item.value}
              </span>
            )
          )}

          {/* Add Line Break Button */}
          {selectedItems.length > 0 && (
            <button className="add-linebreak-button" onClick={addLineBreak}>
              ⏎
            </button>
          )}
        </div>
        <div className="remaining-letters">
          {remainingLetters.map((letter, index) => (
            <span
              key={`remaining-${index}`}
              className="letter"
              onClick={() => selectLetter(index)}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;