/*
Thinkful Engineering Flex, 4.10.2 (31.2), "Capstone: Flashcard app", 12/20/23

src/Layout/Home.js

route = /
"Shows a list of decks with options to create, study, view, or delete a deck"
user presumably begins here, and is returned here by clicking "Cancel" buttons on `CreateDeck` and on Restart prompt of `Study` screens
*/

import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { listDecks, deleteDeck } from "../utils/api/index.js";

function Home() {
  const [decks, setDecks] = useState([]);
  const history = useHistory();

  //------------------------------SIDE EFFECTS------------------------------

  useEffect(() => {
    const abortController = new AbortController(); // handle case of component unmounting before API call completes

    async function loadDecks() {
      try {
        const decks = await listDecks();
        setDecks(decks);
      } catch (error) {
        if (error.name !== "AbortError") { // this error would be expected
          throw error;
        }
      }
    }

    loadDecks(); // Call func to load decks once the component mounts

    return () => abortController.abort(); // Cleanup function to abort fetch if component unmounts
  }, []);

  //------------------------------HANDLERS------------------------------

  const deleteHandler = async (deckId) => {
    const confirmDelete = window.confirm("Delete this deck? You will not be able to recover it.");

    if (confirmDelete) {
      await deleteDeck(deckId); // make an API call to delete the deck
      history.go(0);            // Force reload
    }
  };

  //------------------------------RETURN------------------------------

  return (
    <div>
      <Link to="/decks/new">
        <button>Create Deck</button>
      </Link>
      <div>
        {decks.map((deck) => (
          <div key={deck.id}>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4>{deck.name}</h4>
              <div>{deck.cards.length}&nbsp;cards</div>
            </div>
            <p>{deck.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <button onClick={() => history.push(`/decks/${deck.id}`)}>View</button>
                <button onClick={() => history.push(`/decks/${deck.id}/study`)}>Study</button>
              </div>
              <button onClick={() => deleteHandler(deck.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default Home;
