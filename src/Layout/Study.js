/*
Thinkful Engineering Flex, 4.10.2 (31.2), "Capstone: Flashcard app", 12/20/23

src/Layout/Study.js

route = /decks/:deckId/study
"Allows the user to study the cards from a specified deck"
user directed here by clicking "Study" buttons on `Home` and `Deck` screens
*/

import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { readDeck } from "../utils/api";

function Study() {
  const history = useHistory();
  const [deck, setDeck] = useState({}); // Initialize deck as an empty object
  const [cardIndex, setCardIndex] = useState(0);
  const [showFront, setShowFront] = useState(true);
  const { deckId } = useParams(); // Get deckId from parameters

  //------------------------------SIDE EFFECTS------------------------------

  /* Upon mounting and at each change of `deckId`, load deck */
  useEffect(() => {
    const abortController = new AbortController(); // Handle component unmounting

    async function loadDeck() {
      try {
        const loadedDeck = await readDeck(deckId, abortController.signal);
        setDeck(loadedDeck); // Update state with loaded deck data
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error; // Handle errors except component unmounting
        }
      }
    }

    loadDeck();

    return () => {
      abortController.abort(); // Cleanup function to abort fetch if component unmounts
    };
  }, [deckId]);

  //------------------------------HANDLERS------------------------------

  const handleNext = () => {
    const nextIndex = cardIndex + 1;

    if (nextIndex < deck.cards.length) { // go to next card
      setCardIndex(nextIndex);
      setShowFront(true);
    } else {
      const confirmRestart = window.confirm("Restart cards? Click 'OK' to restart.");

      if (confirmRestart) {              // start over
        setCardIndex(0);
        setShowFront(true);
      } else {
        history.push("/");               // go home
      }
    }
  };

  //------------------------------RETURN------------------------------

  if (!deck.id) {
    return <p>Loading...</p>; // Display if deck is still loading
  }

  const totalCards = deck.cards.length;
  const currentCard = deck.cards[cardIndex];

  return (
    <div>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ul style={{ listStyle: "none", display: "flex" }}>
          <li><Link to="/">Home</Link></li>
          <li>&nbsp;/&nbsp;</li>
          <li>{deck.name}</li>
          <li>&nbsp;/&nbsp;</li>
          <li>Study</li>
        </ul>
      </nav>

      {totalCards < 3 ? (
        <div>
          <h2>{`${deck.name}: Study`}</h2>
          <h4>Not enough cards.</h4>
          <p>{`You need at least 3 cards to study. There are ${totalCards} cards in this deck.`}</p>
          <button onClick={() => history.push(`/decks/${deckId}/cards/new`)}>Add Cards</button>
        </div>
      ) : (
        <div>
          {(showFront && cardIndex === 0) ? (
            <h2>{`Study: ${deck.name}`}</h2>
          ) : (
            <h2>{`${deck.name}: Study`}</h2>
          )}
          <h4>{`Card ${cardIndex + 1} of ${totalCards}`}</h4>
          <div>
            <p>{showFront ? currentCard.front : currentCard.back}</p>
            <button onClick={() => setShowFront(!showFront)}>Flip</button>
            {!showFront && (
              <button onClick={() => handleNext()}>Next</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export default Study;
