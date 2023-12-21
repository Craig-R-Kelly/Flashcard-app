/*
Thinkful Engineering Flex, 4.10.2 (31.2), "Capstone: Flashcard app", 12/20/23

src/Layout/EditCard.js

route = /decks/:deckId/cards/:cardId/edit
"Allows the user to modify information on an existing card"
user directed here by clicking "Edit" [card] on `Deck` screen
*/

import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { readDeck, readCard, updateCard } from "../utils/api/index.js";
import CardForm from "./CardForm"; // Import the CardForm component


function EditCard() {
  const [deck, setDeck] = useState({});
  const [card, setCard] = useState({});
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const { deckId, cardId } = useParams();
  const history = useHistory();

  //------------------------------SIDE EFFECTS------------------------------

  /* Upon mounting and any change to `deckId` or `cardId`, load the deck and card */
  useEffect(() => {
    const abortController = new AbortController();

    async function loadData() {
      try {
        const loadedDeck = await readDeck(deckId, abortController.signal);
        const loadedCard = await readCard(cardId, abortController.signal);
        setDeck(loadedDeck);
        setCard(loadedCard);
        setFront(loadedCard.front);
        setBack(loadedCard.back);
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }

    loadData();

    return () => abortController.abort();
  }, [deckId, cardId]);

  //------------------------------HANDLERS------------------------------

  const handleCancel = () => {            // go to deck screen
    history.push(`/decks/${deckId}`);
  };

  const handleSubmit = async () => {
    try {
      const updatedCard = { ...card, front, back };
      await updateCard(updatedCard);      // save card, THEN
      history.push(`/decks/${deckId}`);   // go to deck screen
    } catch (error) {
      throw error;
    }
  };

  //------------------------------------------------------------

  /* finds place of card within its own deck.  I thought this index might be a more meaningful index to the user */
  const cardsIndexInOwnDeck = deck.cards
    ? deck.cards.findIndex((cardElement) => cardElement.id === card.id) + 1
    : 0;

  //------------------------------RETURN------------------------------

  return (
    <CardForm
      deck={deck}
      isAdding={false}
      cardsIndexInOwnDeck={cardsIndexInOwnDeck}
      front={front}
      setFront={setFront}
      back={back}
      setBack={setBack}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
    />
  );
}

export default EditCard;
