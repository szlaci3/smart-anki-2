import { useState, useEffect } from 'react';
import axios from 'axios';
import CardList from 'components/CardList';

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
      .get(`${import.meta.env.VITE_SERVERIP}/cards`)
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
      .put(`${import.meta.env.VITE_SERVERIP}/cards/${card.id}`, {
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
    <div className="app-container">
      <div className="background">
        <div className="background-base" />
        <div className="background-middle">
          <div className="diagonal-section-middle" />
        </div>
        <div className="background-top">
          <div className="diagonal-section-top" />
        </div>
      </div>

      <div className="content">
        <div className="header">
          <h1>SmartAnki Pro</h1>
          <div className="streak">
            <span>Daily Streak: 42</span>
            <span>🔥</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
        <CardList cards={cardList} onRateCard={handleRateCard} />
      </div>
    </div>
  );
}

export default RateCards;