/*
Thinkful Engineering Flex, 4.10.2 (31.2), "Capstone: Flashcard app", 12/20/23

src/Layout/EditDeck.js

route = /decks/:deckId/edit
"Allows the user to modify information on an existing deck"
user directed here by clicking "Edit" [deck] button on `Deck` screen
*/
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readDeck, updateDeck } from "../utils/api/index.js";


function EditDeck() {
  const [deck, setDeck] = useState({ name: "", description: "" });
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const history = useHistory();
  const { deckId } = useParams();

  //------------------------------SIDE EFFECTS------------------------------

   /* Upon mounting and any change to `deckId` or `cardId`, load deck */
  useEffect(() => {
    const abortController = new AbortController();

    async function loadDeck() {
      try {
        const loadedDeck = await readDeck(deckId, abortController.signal);
        setDeck(loadedDeck);
        setDeckName(loadedDeck.name);
        setDeckDescription(loadedDeck.description);
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }

    loadDeck();

    return () => abortController.abort();
  }, [deckId]);


  /* Upon mounting, and at every change to deckName or deckDescription, assess their content and enable the submit button if either has data */
  useEffect(() => {
    setSubmitDisabled(!deckName && !deckDescription);
  }, [deckName, deckDescription]);

  //------------------------------HANDLERS------------------------------

  const handleCancel = () => history.push(`/decks/${deckId}`); // go to deck screen

  const handleSubmit = async () => {         // update deck, THEN go to deck screen
    try {
      const updatedDeck = { ...deck, name: deckName, description: deckDescription };
      await updateDeck(updatedDeck);
      history.push(`/decks/${deckId}`);
    } catch (error) {
      throw error;
    }
  };

  //------------------------------RETURN------------------------------

  return (
    <div>
      <form>
        <label htmlFor="deckName">Name</label>
        <input
          id="deckName"
          name="deckName"
          value={deckName}
          onChange={(event) => setDeckName(event.target.value)}
          style={{ width: "100%" }}
        />

        <label htmlFor="deckDescription">Description</label>
        <textarea
          id="deckDescription"
          name="deckDescription"
          value={deckDescription}
          onChange={(event) => setDeckDescription(event.target.value)}
          style={{ width: "100%" }}
          rows={3}
        ></textarea>

        <div>
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}


export default EditDeck;
