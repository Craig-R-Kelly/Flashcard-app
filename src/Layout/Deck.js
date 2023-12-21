/*
Thinkful Engineering Flex, 4.10.2 (31.2), "Capstone: Flashcard app", 12/18/23

src/Layout/Deck.js

route = /decks/:deckId
"Shows all of the information about a specified deck with options to edit or add cards to the deck, navigate to the study screen, or delete the deck"
user directed here by clicking "View" button on `Home` screen, "Submit" button on `CreateDeck` screen, "Cancel" button `EditDeck` screen, "Done" button on `AddCard` screen, and "Save" and "Cancel" buttons on `EditCard` screen
*/

import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../utils/api/index.js";


function Deck() {
  const [deck, setDeck] = useState({});
  const history = useHistory();
  const { deckId } = useParams();

  //------------------------------SIDE EFFECTS------------------------------

  /* Upon mounting and any change to `deckId`, load the deck */  
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

    return () => {
      abortController.abort();
    };
  }, [deckId]);

  //------------------------------HANDLERS------------------------------

  const deleteDeckHandler = async () => {
    const confirmDelete = window.confirm("Delete this deck? You will not be able to recover it.");

    if (confirmDelete) {
      await deleteDeck(deckId);
      history.push("/");                            // go home
    }
  };


  const deleteCardHandler = async (cardId) => {
    const confirmDelete = window.confirm("Delete this card? You will not be able to recover it.");

    if (confirmDelete) {
      await deleteCard(cardId);                     // delete card
      const updatedDeck = await readDeck(deckId);   // load updated info
      setDeck(updatedDeck);                         // re-render triggered by changing state variable
    }
  };

  //------------------------------RETURN------------------------------

  if (!deck.id) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ul style={{ listStyle: "none", display: "flex" }}>
          <li><Link to="/">Home</Link></li>
          <li>&nbsp;/&nbsp;</li>
          <li>{deck.name}</li>
        </ul>
      </nav>

      <div>
        <h4>{deck.name}</h4>
        <p>{deck.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Link to={`/decks/${deck.id}/edit`}>
              <button>Edit</button>
            </Link>
            <Link to={`/decks/${deck.id}/study`}>
              <button>Study</button>
            </Link>
            <Link to={`/decks/${deck.id}/cards/new`}>
              <button>Add Cards</button>
            </Link>
          </div>
          <button onClick={deleteDeckHandler}>Delete</button>
        </div>
      </div>

      <div>
        <br />
        <h2>Cards</h2>
        {deck.cards.map((card) => (
          <div key={card.id}>
            <hr />

            <div style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                <p>{card.front}</p>
              </div>
              <div style={{ flex: 1 }}>
                <p>{card.back}</p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link to={`/decks/${deck.id}/cards/${card.id}/edit`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => deleteCardHandler(card.id)}>Delete</button>
            </div>
          </div>
        ))}
        <hr />
      </div>
    </div>
  );
}


export default Deck;
