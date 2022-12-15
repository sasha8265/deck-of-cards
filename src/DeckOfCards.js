import React, { useState, useEffect } from "react"
import Card from "./Card"
import axios from "axios";

const BASE_URL = "http://deckofcardsapi.com/api/deck"

const DeckOfCards = () => {
    const [deck, setDeck] = useState(null);

    useEffect(function getDeckData() {
        async function shuffleDeck() {
            const deckRes = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`)
            console.log(deckRes.data)
            setDeck(deckRes.data);
        };
        shuffleDeck();
    }, []);

    return (
        <div>
            {/* <Card name={deck.name} image={deck.image} /> */}
        </div>
    )
}

export default DeckOfCards;