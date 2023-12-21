/*
Thinkful Engineering Flex, 4.10.2 (31.2), "Capstone: Flashcard app", 12/20/23

src/Layout/CreateDeck.js

route = /decks/new
"Allows the user to create a new deck"
user directed here by clicking "Create Deck" button on `Home` screen
*/

import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { createDeck } from "../utils/api/index.js";


function CreateDeck() {
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const history = useHistory();

  //------------------------------SIDE EFFECTS------------------------------

  /* Upon mounting and any change to `deckName`, set boolean `isSubmitDisabled` to correspond with emptiness of `deckName` */
  useEffect(() => { 
    setIsSubmitDisabled(deckName.trim().length === 0);
  }, [deckName]);

  //------------------------------HANDLERS------------------------------

  const handleCancel = () => {        // go home
    history.push("/");
  };


  const handleSubmit = async () => {  // create deck then go to its deck screen
    try {
      const newDeck = { name: deckName, description: deckDescription, cards: [] };
      const createdDeck = await createDeck(newDeck);
      history.push(`/decks/${createdDeck.id}`);
    } catch (error) {
        throw error;
    }
  };
  
  //------------------------------RETURN------------------------------
  
  return (
    <div>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ul style={{ listStyle: "none", display: "flex" }}>
          <li><Link to="/">Home</Link></li>
          <li>&nbsp;/&nbsp;</li>
          <li>Create Deck</li>
        </ul>
      </nav>

      <h2>Create Deck</h2>

      <form>
        <label htmlFor="deckName">Name</label>
        <input
          id="deckName"
          name="deckName"
          placeholder="Deck Name"
          value={deckName}
          onChange={(event) => setDeckName(event.target.value)}
          style={{ width: "100%" }}
        />

        <label htmlFor="deckDescription">Description</label>
        <textarea
          id="deckDescription"
          name="deckDescription"
          placeholder="Brief description of the deck"
          value={deckDescription}
          onChange={(event) => setDeckDescription(event.target.value)}
          style={{ width: "100%" }}
          rows={4}
        ></textarea>

        <div>
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitDisabled}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}


export default CreateDeck;
