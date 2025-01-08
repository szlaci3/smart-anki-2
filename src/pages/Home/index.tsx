import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardList from '@/components/CardList';

type Card = {
  id: number;
  sides: string[];
  rate: '10minutes' | number | null;
  reviewedAt: number | null;
};

function RateCards() {
  const [cardList, setCardList] = useState<Card[]>([]);

  useEffect(() => {
    axios
      .get(`${SERVERIP}/cards`)
      .then((response) => {
        setCardList(
          response.data.map((card) => ({
            ...card,
            sides: JSON.parse(card.sides),
          })),
        );
      })
      .catch((error) => {
        console.error('Error fetching flashcards:', error);
      });
  }, []);

  const handleRateCard = (card, rate) => {
    const updatedCardList = cardList.map((cardItem) => {
      if (card.id === cardItem.id) {
        return { ...cardItem, rate, reviewedAt: Date.now() };
      }
      return cardItem;
    });

    axios
      .put(`${SERVERIP}/cards/${card.id}`, {
        ...card,
        sides: JSON.stringify(card.sides),
        rate,
        reviewedAt: Date.now(),
      })
      .then(() => {
        setCardList(updatedCardList);
      })
      .catch((error) => {
        console.error('Error updating flashcard:', error);
      });
  };

  return (
    <div className="App">
      <h1>SmartAnki</h1>
      <h3>Flashcard App</h3>
      <CardList cards={cardList} onRateCard={handleRateCard} />
    </div>
  );
}

export default RateCards;
