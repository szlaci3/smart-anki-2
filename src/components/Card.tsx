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
    <div className="flashcard">
      <div>
        <div className="language-indicator">
          <span>EN → FR</span>
        </div>
        
        <div className="card-content">
          {card.sides.slice(0, revealCount + 1).map((side, index) => (
            <div key={index} className="side">
              <h2>{side}</h2>
            </div>
          ))}
        </div>

        <div className="controls">
          {card.sides.length - 1 > revealCount && (
            <button type="button" className="show-button" onClick={handleShowNextSide}>
              {revealCount ? 'Show Next Side' : 'Show Answer'}
            </button>
          )}

          {revealCount > 0 && (
            <div className="rating-buttons">
              <button type="button" onClick={() => handleRateCard('10minutes')}><div>10</div><div>min</div></button>
              <div className="interactive">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(ev) => setInputValue(Math.max(1, Math.min(999, +ev.target.value)))}
                  onFocus={() => setInputValue('')}
                  min={1}
                  max={999}
                />
                <button type="button" onClick={() => handleRateCard(inputValue)} className="interactive-button">
                  <div>{inputValue || "0"}</div><div>day{inputValue === '' || inputValue === 1 ? '' : 's'}</div>
                </button>
              </div>
              <button type="button" onClick={() => handleRateCard(option3)}><div>{option3}</div><div>day{option3 === '1' ? '' : 's'}</div></button>
              <button type="button" onClick={() => handleRateCard(option4)}><div>{option4}</div><div>days</div></button>
            </div>
          )}
          
          <div className="difficulty-dots">
            {[1, 2, 3].map((dot) => (
              <div key={dot} className="dot"></div>
            ))}
          </div>
          
          <button type="button" onClick={() => onEditCard(card)}>Edit</button>
        </div>
      </div>
    </div>
  );
}

export default Card;
