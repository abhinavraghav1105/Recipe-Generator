import React, { useEffect, useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import logo from './logo.png'; // Import the logo image

const RecipeCard = ({ onSubmit }) => {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [cuisine, setCuisine] = useState("");
  const [cookingTime, setCookingTime] = useState("Less than 30 minutes");
  const [complexity, setComplexity] = useState("Beginner");

  const handleSubmit = () => {
    const recipeData = {
      ingredients,
      mealType,
      cuisine,
      cookingTime,
      complexity,
    };
    onSubmit(recipeData);
  };

  return (
    <div className="card w-100">
      <div className="card-body">
        {/* <h5 className="card-title text-center">Recipe Generator</h5> */}
        <div className="mb-3">
          <label htmlFor="ingredients" className="form-label">Ingredients</label>
          <input
            type="text"
            className="form-control"
            id="ingredients"
            placeholder="Enter ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mealType" className="form-label">Meal Type</label>
          <select
            className="form-select"
            id="mealType"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="cuisine" className="form-label">Cuisine Preference</label>
          <input
            type="text"
            className="form-control"
            id="cuisine"
            placeholder="e.g., Italian, Mexican"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cookingTime" className="form-label">Cooking Time</label>
          <select
            className="form-select"
            id="cookingTime"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          >
            <option value="Less than 30 minutes">Less than 30 minutes</option>
            <option value="30-60 minutes">30-60 minutes</option>
            <option value="More than 1 hour">More than 1 hour</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="complexity" className="form-label">Complexity</label>
          <select
            className="form-select"
            id="complexity"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className="text-center">
          <button
            className="btn btn-success"
            type="button"
            onClick={handleSubmit}
          >
            Generate Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [recipeData, setRecipeData] = useState(null);
  const [recipeText, setRecipeText] = useState("");

  const eventSourceRef = useRef(null);

  useEffect(() => {
    closeEventStream(); // Close any existing connection
  }, []);

  useEffect(() => {
    if (recipeData) {
      closeEventStream(); // Close any existing connection
      initializeEventStream(); // Open a new connection
    }
  }, [recipeData]);

  const initializeEventStream = () => {
    const recipeInputs = { ...recipeData };

    const queryParams = new URLSearchParams(recipeInputs).toString();
    const url = `http://localhost:3001/recipeStream?${queryParams}`;
    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.action === "close") {
        closeEventStream();
      } else if (data.action === "chunk") {
        setRecipeText((prev) => prev + data.chunk);
      }
    };

    eventSourceRef.current.onerror = () => {
      eventSourceRef.current.close();
    };
  };

  const closeEventStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const onSubmit = (data) => {
    setRecipeText("");
    setRecipeData(data);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light white-navbar">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src={logo} alt="Logo" style={{ height: '40px', width:'180px'}} />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link text-white" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">About Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <h2 className="text-center custom-margin-top">What do you want to eat?</h2>
        <div className="row w-100 mt-4">
          <div className="col-md-6">
            <RecipeCard onSubmit={onSubmit} />
          </div>
          <div className="col-md-6">
          
            <div className="card h-100">
           
              <div className="card-body overflow-auto">
              <h5 className="card-title text-center">Crafting your special meal..</h5>
                <pre className="text-muted">{recipeText}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;