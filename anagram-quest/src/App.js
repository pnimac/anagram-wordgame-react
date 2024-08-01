import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import anagramPairs from './data/anagramPairs.json';

function AnagramGame() {
  const [currentPair, setCurrentPair] = useState({});
  const [currentWord, setCurrentWord] = useState('');
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('fail');
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef(null); // Ref for the timer ID


  useEffect(() => {
    // Choose a random anagram pair
    const randomPair = anagramPairs[Math.floor(Math.random() * anagramPairs.length)];
    setCurrentPair(randomPair);
    setCurrentWord(randomPair.word);
    // Clean up timer on component unmount
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      // Time is up
      setMessage('Game Over! The correct answer is: ' + currentPair.anagram);
      setResult('Fail');
      clearTimeout(timerRef.current); // Clear timer
    }
  }, [timeLeft]);

  const handleChange = (e) => setInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toLowerCase() === currentPair.anagram.toLowerCase()) {
      setMessage('Well done, You found the anagram!');
      setResult('Success');
      clearTimeout(timerRef.current); // Stop the timer
    } else {
      setMessage('Not quite right. Give it another shot!');
      setResult('Fail');
    }
  };

  const handleSkip = () => {
    const randomPair = anagramPairs[Math.floor(Math.random() * anagramPairs.length)];
    setCurrentPair(randomPair);
    setCurrentWord(randomPair.word);
    setInput('');
    setMessage('');
    setShowHint(false);
    // Reset and restart the timer
    setTimeLeft(60); // Reset the timer
    clearTimeout(timerRef.current); // Clear any existing timer
    timerRef.current = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
  };

  const handleHint = () => setShowHint(true);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center border border-primary p-4 rounded bg-light shadow-sm" style={{ maxWidth: '600px' }}>

      <h1 className="bg-primary text-white p-3 rounded mb-3 d-flex align-items-center">
        <i className="bi bi-strava me-2" style={{ fontSize: '2rem' }}></i>
        Anagram Quest
      </h1>

      <div className="d-flex align-items-center mb-3">
        <i className="bi bi-clock text-primary me-2" style={{ fontSize: '24px' }}></i>
        <p className="mb-0" style={{ fontSize: '18px' }}>Time left: {timeLeft}</p>
      </div>
      
      <p className="bg-light text-primary fw-bold p-2 rounded mb-3" style={{ fontFamily: 'Courier New' }}>
        Your word: {currentWord}
      </p>

      <form onSubmit={handleSubmit} className="w-100">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            value={input}
            onChange={handleChange}
            placeholder="Enter the anagram"
          />
        </div>
       
        <div className="d-flex justify-content-between mt-3">
          <button type="submit" className="btn btn-primary" disabled={timeLeft === 0}>Submit</button>
          <button type="button" className="btn btn-warning" onClick={handleHint} disabled={timeLeft === 0}>Show Hint</button>
          <button type="button" className="btn btn-secondary" onClick={handleSkip}>New word</button>
       
        </div>      
      </form>
      
      {message && (
        <div className={`alert ${result === 'Success' ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
          {message}
        </div>
      )}
      
      {showHint && 
        <p className="text-center mt-3 text-info">
          Hint: {currentPair.hint}
        </p>
      }

    </div>
  );
}

export default AnagramGame;
