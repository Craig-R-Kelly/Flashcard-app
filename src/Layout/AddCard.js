/*
Thinkful Engineering Flex, 4.10.2 (31.2), "Capstone: Flashcard app", 12/20/23

src/Layout/AddCard.js

route = /decks/:deckId/cards/new
"Allows the user to add a new card to an existing deck"
user directed here by clicking "Add Cards" buttons on `Deck` screen and on "Not enough cards" message of `Study` screen
*/

import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { readDeck, createCard } from "../utils/api/index.js";
import CardForm from "./CardForm"; // Import the CardForm component


function AddCard() {
  const { deckId } = useParams();
  const history = useHistory();
  const [deck, setDeck] = useState({});
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  //------------------------------SIDE EFFECTS------------------------------

  /* Upon mounting and any change to `deckId`, load that deck's ID */ 
  useEffect(() => {
    const abortController = new AbortController();

    async function loadDeck() {
      try {
        const loadedDeck = await readDeck(deckId, abortController.signal);
        setDeck(loadedDeck);
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }

    loadDeck();

    return () => abortController.abort();
  }, [deckId]);


  /* Upon mounting and any change to `front` or `back`, check if either of these is not an empty string, then set `isSaveDisabled` to the opposite of the answer.  So: if either has content, `isSaveDisabled` is set to `false`.*/
  useEffect(() => {
    setIsSaveDisabled(!(front.trim() !== "" || back.trim() !== ""));
  }, [front, back]);

  //------------------------------HANDLERS------------------------------

  const handleDone = () => {            //go to Deck screen
    history.push(`/decks/${deckId}`);
  };

  const handleSave = async () => { // create card, clear content (& rerender)
    try {
      const newCard = { front, back, deckId };
      await createCard(deckId, newCard);
      setFront("");
      setBack("");
    } catch (error) {
      throw error;
    }
  };

  //------------------------------RETURN------------------------------

  return (
    <CardForm
      deck={deck}
      isAdding={true}
      front={front}
      setFront={setFront}
      back={back}
      setBack={setBack}
      handleDone={handleDone}
      handleSave={handleSave}
      isSaveDisabled={isSaveDisabled}
    />
  );
}

export default AddCard;
