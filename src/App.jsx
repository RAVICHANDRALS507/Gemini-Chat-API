import { useState, useRef, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const answerRef = useRef(null);

  // Auto-resize the answer container and smooth scroll as the answer is being printed
  useEffect(() => {
    if (answerRef.current) {
      window.scrollTo({
        top: answerRef.current.offsetTop + answerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [answer]);

  async function generateAnswer(event) {
    event.preventDefault();
    setLoading(true);
    setAnswer("");

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDSw7wOeyw6-R1Z2ssHUlEnF3ZI3H2x828",
        method: "post",
        data: { "contents": [{ "parts": [{ "text": question }] }] },
      });

      let responseText = response.data.candidates[0].content.parts[0].text;

      // Process the response to add bold tags and line breaks
      let responseArray = responseText.split("**");
      let newArray = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newArray += responseArray[i];
        } else {
          newArray += "<br>"+"<br>"+"<b>" + responseArray[i] + "</b>"+"<br>";
        }
      }
      let newResponse = newArray.split("*").join("<br>");
      let newResponseArray = newResponse.split(" ");
      setAnswer(""); // Clear answer before starting the typing effect
      
      newResponseArray.forEach((word, index) => {
        setTimeout(() => {
          setAnswer(prev => prev + word + " ");
        }, 75 * index);
      });
    } catch (error) {
      console.error("Error fetching answer:", error);
      setAnswer("Error fetching answer.");
    } finally {
      setLoading(false);
    }
  }

// Copy the answer text to the clipboard and change the icon
const copyToClipboard = () => {
  const range = document.createRange();
  range.selectNode(answerRef.current);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  setCopied(true);                // Set copied state to true
  setTimeout(() => {
    setCopied(false);             // Reset copied state after a short delay
  }, 2000);                       // Reset after 2 seconds (adjust as needed)
};

  return (
    <div className="App">
      <header>
        <h1>AI Chat</h1>
      </header>
      <main>
        <form className="max-w-xl mx-auto" onSubmit={generateAnswer}> {/* Increase the width here */}
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
          
            <input type="search" id="default-search" value={question} onChange={(e) => setQuestion(e.target.value)} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
          </div>
        </form>
        {loading ? (
          <div className="load">
            <hr />
            <hr />
            <hr />
          </div>
        ) : (
          answer && (
            <div ref={answerRef} className="block w-full mt-4 p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-left relative">
              <button onClick={copyToClipboard} className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0V3H9v2m4 0h2V3h-2m-4 0v2H9V3m2 12h2v2h-2v-2zM9 15h2v2H9v-2z" />
                </svg>
              </button>
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </div>
          )
        )}
      </main>

      <footer className="mt-8 text-center">
        <p>Designed using Gemini API</p>
      </footer>
    </div>
  );
}

export default App;
