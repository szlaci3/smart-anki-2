import axios from "axios";
import CardList from "components/CardList";
import { useEffect, useRef, useState } from "react";
import type { CardFromApi, CardType } from "types/index";
import { calculateDueAt } from "utils/utils";
import { coldStartCards } from "./coldStartCards";

function RateCards() {
	const [cardList, setCardList] = useState<CardType[]>(coldStartCards);
	const apiCardList = useRef<CardType[]>([]);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_SERVER_IP}/cards`)
			.then((response) => {
				apiCardList.current = response.data.map((card: CardFromApi) => ({
					...card,
					rate: card.rate ? parseInt(card.rate, 10) : card.rate,
					sides: JSON.parse(card.sides),
				}));
			})
			.catch((error) => {
				console.error("Error fetching flashcards:", error);
			});
	}, []);

	const handleRateCard = (card: CardType, rate: number) => {
		let updatedCardList: CardType[];
		const dueAt = calculateDueAt(rate);

		if (apiCardList.current.length > 0) {
			updatedCardList = apiCardList.current;
			apiCardList.current = [];
		} else {
			updatedCardList = cardList.map((cardItem) =>
				card.id === cardItem.id ? { ...cardItem, rate, dueAt } : cardItem,
			);
		}

		axios
			.put(`${import.meta.env.VITE_SERVER_IP}/cards/${card.id}`, {
				...card,
				sides: JSON.stringify(card.sides),
				rate,
				dueAt,
			})
			.then(() => {
				setCardList(updatedCardList);
			})
			.catch((error) => {
				console.error("Error updating flashcard:", error);
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
						<span>Daily Streak: 0</span>
						<span>🔥</span>
					</div>
					<div className="progress-bar">
						<div className="progress-fill" />
					</div>
				</div>
				<CardList cards={cardList} onRateCard={handleRateCard} />
			</div>
		</div>
	);
}

export default RateCards;
