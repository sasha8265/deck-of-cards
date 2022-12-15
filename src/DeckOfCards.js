import React, { useState, useEffect } from "react"
import Card from "./Card"
import axios from "axios";

const BASE_URL = "http://deckofcardsapi.com/api/deck"

const DeckOfCards = () => {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([])

    useEffect(function getDeckData() {
        async function shuffleDeck() {
            const deckRes = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`)
            console.log(deckRes.data)
            setDeck(deckRes.data);
        };
        shuffleDeck();
    }, []);

    async function drawCard() {
        let {deck_id} = deck;

        try {
            let drawRes = await axios.get(`${BASE_URL}/${deck_id}/draw/?count=1`);
            if (drawRes.data.remaining === 0) {
                throw new Error("no cards remaining!");
            };
            const card = drawRes.data.cards[0];

            setDrawn(d => [
                ...d,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image
                }
            ]);
        } catch (err) {
            alert(err);
        };
    }

    const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ))

    return (
        <div>
            <button onClick={drawCard}>Draw</button>
            <div>{cards}</div>
        </div>
    )
}

export default DeckOfCards;