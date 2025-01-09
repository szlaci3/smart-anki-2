import { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const CardForm = () => {
  const [sides, setSides] = useState<string[]>(['', '']);
  const [id, setId] = useState(() => uuidv4());

  const handleAddSide = () => {
    if (sides.length < 10) {
      setSides([...sides, '']);
    }
  };

  const handleSideChange = (index, value) => {
    const updatedSides = [...sides];
    updatedSides[index] = value;
    setSides(updatedSides);
  };

  const handleSubmit = async () => {
    try {
      const card = {
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
    <div className="card-form" key={id}>
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
          <div key={index}>
            <label>{label}</label>
            <input
              type="text"
              value={side}
              onChange={(e) => handleSideChange(index, e.target.value)}
            />
          </div>
        );
      })}

      <div>
        <button type="button" onClick={handleAddSide}>
          Add Side
        </button>
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default CardForm;