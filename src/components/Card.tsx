import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Card({ card, onRateCard }) {
  const [revealCount, setRevealCount] = useState(0);
  const [inputValue, setInputValue] = useState<'' | number>(1);

  const navigate = useNavigate();

  const handleShowNextSide = () => {
    setRevealCount((prev) => prev + 1);
  };

  const handleRateCard = (rate) => {
    onRateCard(rate);
    setRevealCount(0);
  };

  const onEditCard = (card) => {
    navigate(`/editCard/${card.id}`);
  };

  const option3 = card.rate === '10minutes' ? 2 : card.rate || 2;
  const option4 = Math.max(3, Math.floor(option3 * 1.4));

  return (
    <div className="card">
      <div>
        {card.sides.slice(0, revealCount + 1).map((side, index) => (
          <div
            key={index}
            className={`card-side ${
              index === card.sides.length - 1 ? 'back' : 'front'
            }`}
          >
            <h2>{side}</h2>
          </div>
        ))}
      </div>
      <div>
        {card.sides.length - 1 > revealCount && (
          <button
            type="button"
            className="show-button"
            onClick={handleShowNextSide}
          >
            {revealCount ? 'Show Next Side' : 'Show Answer'}
          </button>
        )}
        {revealCount > 0 && (
          <div className="rating-buttons">
            <button type="button" onClick={() => handleRateCard('10minutes')}>
              10 minutes
            </button>
            <input
              type="number"
              onChange={(ev) =>
                setInputValue(Math.max(1, Math.min(999, +ev.target.value)))
              }
              onFocus={() => setInputValue('')}
              value={inputValue}
              min={1}
              max={999}
            />
            <button type="button" onClick={() => handleRateCard(inputValue)}>
              day{inputValue === 1 ? '' : 's'}
            </button>
            <button type="button" onClick={() => handleRateCard(option3)}>
              {option3} days
            </button>
            <button type="button" onClick={() => handleRateCard(option4)}>
              {option4} days
            </button>
          </div>
        )}
        <div>
          <button type="button" onClick={() => onEditCard(card)}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
