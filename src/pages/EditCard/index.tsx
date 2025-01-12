import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CardFromApi, CardType } from 'types/index';
import 'css/form.css';

const EditCard = () => {
  const [sides, setSides] = useState<string[]>(['', '']);
  const [card, setCard] = useState<CardType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams(); // Get the card ID from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVERIP}/cards/${id}`);
        setCard(response.data);
        setSides(JSON.parse(response.data.sides));
      } catch (err) {
        setError('Error fetching card data');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
      // remove empty sides
      const updatedSides = sides.filter((item) => !!item);

      const updatedCard: CardFromApi = {
        ...card!,
        sides: JSON.stringify(updatedSides),
      };

      await axios.put(`${import.meta.env.VITE_SERVERIP}/cards/${id}`, updatedCard);
    } catch (error) {
      console.error('Error updating card:', error);
    }
    navigate("/");
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
          <h1>Edit Card</h1>
        </div>
        
        {card && (
          <div className="card-form" key={id}>
            <h4 className="card-id">Card ID: {card.id}</h4>

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
        )}
      </div>
    </div>
  );
};

export default EditCard;