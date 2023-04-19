import React, { useState } from 'react';
import openai from './api';
import './App.css';
import logo from './OpenAI_Logo.png';

const App = () => {
  const [aiResponse, setAiResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSuggestions, setNewSuggestions] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [firstSubmit, setFirstSubmit] = useState(false);
  const [showSubCategories, setShowSubCategories] = useState(false);


  const fetchAiResponse = async (input) => {
    setLoading(true);
    

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `User: ${input}\nAI:`,
      max_tokens: 100,
      temperature: 0.7,
    });
  
    const subCategoryPrompt = `Please provide 3 sub-categories related to "${response.data.choices[0].text}" but each sub-category needs to be 3 words or less:\n1. `;
    const subCategoryResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: subCategoryPrompt,
      max_tokens: 100,
      n: 1,
      temperature: 0.7,
    });
  
    const subCategories = subCategoryResponse.data.choices[0].text.split('\n')
      .filter((item) => item.trim() !== '') // Remove empty strings
      .map((item) => item.replace(/^\d+\.\s*/, '')); // Remove numbering
    console.log(subCategories)
    
    setLoading(false);

  
    return { responseText: response.data.choices[0].text, subCategories };
  };
  


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setAiResponse('Loading...');


  setSuggestions([]); // Clear previous suggestions
  setNewSuggestions([]); // Clear previous new suggestions

  setAiResponse('Loading...'); // Set loading message

  const { responseText, subCategories: fetchedSubCategories } = await fetchAiResponse(userInput);
  setAiResponse(responseText);

  setNewSuggestions(fetchedSubCategories); // Set the new suggestions
  setSubCategories(fetchedSubCategories); // Update the subCategories state variable

  setLoading(false);
  
  setUserInput(''); // Clear user input field
  if (!firstSubmit) {
    setFirstSubmit(true);
    setShowSubCategories(true);
  }

  // // Use async/await to wait for the above state updates to complete
  // await new Promise((resolve) => setTimeout(resolve, 0));

  // setUserInput(''); // Clear user input field
};




const handleSubCategoryClick = async (subCategory) => {
  setUserInput(subCategory);

  console.log(subCategory)
  handleSubmit({
    preventDefault: () => {}, // Create a dummy preventDefault function
  });

  
};


  const handleReset = () => {
    setAiResponse('');
    setUserInput('');
    setSuggestions([]);
    setShowSubCategories(false);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <img src={logo} alt="logo" className="logo" />
          <div className="card mb-3">
            <p className="ai-label">AI says:</p>
            <div className="card-body">
              {loading ? <p>Loading...</p> : <p>{aiResponse || 'Hi, how may I help you?'}</p>}
            </div>

          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask the AI something..."
              className="form-control mb-3"
            />

            <div className="subcategories">
              {
              //showSubCategories &&
                subCategories.map((subCategory, index) => (
                <button 
                  key={index} 
                  className="button-5"
                  onClick={() => handleSubCategoryClick(subCategory)}
                  >
                  {subCategory}
                </button>
              ))}

            </div>
            
            <button type="submit" className="btn btn-primary mb-3 submit-button">
              Submit
            </button>
            
          </form>
          <button onClick={handleReset} className="btn btn-danger mb-3 start-over-button">
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
  


};

export default App;

