import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputWord, setInputWord] = useState('');
  const [remainingLetters, setRemainingLetters] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const lettersArray = inputWord.replace(/\s+/g, '').toUpperCase().split('');
    setRemainingLetters(lettersArray);
    setSelectedItems([]);
  }, [inputWord]);

  const handleInputChange = (e) => {
    setInputWord(e.target.value);
  };

  const selectLetter = (index) => {
    const letter = remainingLetters[index];
    setSelectedItems([...selectedItems, { type: 'letter', value: letter }]);
    setRemainingLetters(remainingLetters.filter((_, i) => i !== index));
  };

  const deselectItem = (index) => {
    const item = selectedItems[index];
    if (item.type === 'letter') {
      setRemainingLetters([...remainingLetters, item.value]);
    }
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const insertSpace = (index) => {
    const newSelectedItems = [
      ...selectedItems.slice(0, index),
      { type: 'space', value: ' ' },
      ...selectedItems.slice(index),
    ];
    setSelectedItems(newSelectedItems);
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
          {selectedItems.map((item, index) => (
            <React.Fragment key={`selected-${index}`}>
              <span
                className={`letter selected ${item.type}`}
                onClick={() => deselectItem(index)}
              >
                {item.value}
              </span>
            </React.Fragment>
          ))}

          {/* Insert newline button */}
          {(selectedItems.length > 0 && <
            button className="insert-space-button" onClick={() => insertSpace(selectedItems.length)}>
              +
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