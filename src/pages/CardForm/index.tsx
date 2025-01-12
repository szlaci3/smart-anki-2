import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { CardFromApi } from 'types/index';
import 'css/form.css';

const CardForm = () => {
  const [sides, setSides] = useState<string[]>(['', '']);
  const [id, setId] = useState(() => uuidv4());

  const handleAddSide = () => {
    if (sides.length < 10) {
      setSides([...sides, '']);
    }
  };

  const handleSideChange = (index: number, value: string): void => {
    const updatedSides = [...sides];
    updatedSides[index] = value;
    setSides(updatedSides);
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const card: CardFromApi = {
        id,
        sides: JSON.stringify(sides),
        rate: null,
        reviewedAt: null,
      };

      await axios.post(`${import.meta.env.VITE_SERVERIP}/cards`, card);
    } catch (error) {
      console.error('Error creating card:', error);
      // Handle error
    }
    setSides(['', '']);
    setId(() => uuidv4());
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
          <h1>Create New Card</h1>
        </div>
        
        <div className="card-form" key={id}>
          <div className="sides-container">
            {sides.map((side, index) => {
              let label;
              switch (index) {
                case 0:
                  label = 'Front Side';
                  break;
                case 1:
                  label = 'Back Side';
                  break;
                default:
                  label = `Side ${index + 1}:`;
              }

              return (
                <div key={index} className="card-list">
                  <div className="input-group flashcard">
                    <label className="side-label">{label}</label>
                    <input
                      className="side-input"
                      type="text"
                      value={side}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleSideChange(index, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="button-group">
            <button className="action-button" type="button" onClick={handleAddSide}>
              Add Side
            </button>
            <button className="action-button primary" type="button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardForm;