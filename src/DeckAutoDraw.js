import React, { useState, useEffect, useRef } from "react"
import Card from "./Card"
import axios from "axios";

const BASE_URL = "http://deckofcardsapi.com/api/deck"

const DeckAutoDraw = () => {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);

    //Load deck from API into state
    useEffect(function getDeckData() {
        async function shuffleDeck() {
            const deckRes = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`);
            console.log(deckRes.data);
            setDeck(deckRes.data);
        };
        shuffleDeck();
    }, [setDeck]);

    useEffect(() => {
        async function drawCard() {
            let { deck_id } = deck;

            try {
                let drawRes = await axios.get(`${BASE_URL}/${deck_id}/draw/?count=1`);
                console.log(drawRes.data.remaining)
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
        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await drawCard();
            }, 1000);
        }
        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    };

    const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ))

    return (
        <div>
            {deck ? (
                <button onClick={toggleAutoDraw}>{autoDraw ? "STOP!" : "KEEP DRAWING!"}</button>
            ): null}
            <div>{cards}</div>
        </div>
    )
}

export default DeckAutoDraw;