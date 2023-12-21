/*
Thinkful Engineering Flex, 4.10.2 (31.2), "Capstone: Flashcard app", 12/20/23

src/Layout/CardForm.js

Called by both `AddCard.js` and `EditCard.js`, which each send props to be conditionally rendered depending on value of `IsAdding`.  Admittedly clunky with so many props.
*/

import React from "react";
import { Link } from "react-router-dom";

function CardForm({
  isAdding,
  cardId,
  deck,
  cardsIndexInOwnDeck,
  front,
  setFront,
  back,
  setBack,
  handleDone,
  handleCancel,
  handleSave,
  handleSubmit,
  isSaveDisabled,
}) {
  return (
    <div>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ul style={{ listStyle: "none", display: "flex" }}>
          <li><Link to="/">Home</Link></li>
          <li>&nbsp;/&nbsp;</li>
          <li>{deck.name}</li>
          <li>&nbsp;/&nbsp;</li>
          <li>
            {isAdding ? "Add Card" : `Edit Card ${cardId}`}
          </li>
        </ul>
      </nav>
  
      <h4>
        {isAdding ? `${deck.name}: Add Card` : "Edit Card"}
      </h4>
      {isAdding ? null : (
        <p>
          {`(card ${cardsIndexInOwnDeck} in this deck)`}
        </p>
      )}
  
      <form>
        <label htmlFor="front">Front</label>
        <textarea
          id="front"
          name="front"
          placeholder={isAdding ? "Front side of card" : undefined}
          value={front}
          onChange={(event) => setFront(event.target.value)}
          style={{ width: "100%" }}
          rows={3}
        ></textarea>
  
        <label htmlFor="back">Back</label>
        <textarea
          id="back"
          name="back"
          placeholder={isAdding ? "Back side of card" : undefined}
          value={back}
          onChange={(event) => setBack(event.target.value)}
          style={{ width: "100%" }}
          rows={3}
        ></textarea>
  
        <div>
          <button type="button" onClick={isAdding ? handleDone : handleCancel}>
            {isAdding ? `Done` : `Cancel`}
          </button>
          <button 
            type="button" 
            onClick={isAdding ? handleSave : handleSubmit}
            disabled={isSaveDisabled}
          >
            {isAdding ? `Save` : `Submit`}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CardForm;