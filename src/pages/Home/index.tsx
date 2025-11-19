import axios from "axios";
import CardList from "components/CardList";
import { useEffect, useRef, useState } from "react";
import type { CardFromApi, CardType } from "types/index";
import { calculateDueAt } from "utils/utils";
import { coldStartCards } from "./coldStartCards";

/*
RateCards waits 1s before showing coldStartCards, giving the API a chance to respond.
If the timer fires first, coldStartCards render and isUsingColdStart flips true.
If the API responds while coldStartCards are shown, the real deck is stored in
apiCardListRef (we keep showing coldStartCards). After the user rates that cold-start
card, we swap in the cached real deck, and show a real card next.
If the API responds before coldStartCards ever render, we cancel the timer and show
the real deck immediately.
*/
function RateCards() {
	const [cardList, setCardList] = useState<CardType[]>([]);
	const [isUsingColdStart, setIsUsingColdStart] = useState(false);
	const coldStartTimerRef = useRef<number | null>(null);
	const apiCardListRef = useRef<CardType[]>([]);
	const isUsingColdStartRef = useRef(false);

	useEffect(() => {
		isUsingColdStartRef.current = isUsingColdStart;
	}, [isUsingColdStart]);

	useEffect(() => {
		coldStartTimerRef.current = window.setTimeout(() => {
			setCardList(coldStartCards);
			setIsUsingColdStart(true);
			coldStartTimerRef.current = null;
		}, 1000);

		axios
			.get(`${import.meta.env.VITE_SERVER_IP}/cards`)
			.then((response) => {
				const normalizedCards: CardType[] = response.data.map(
					(card: CardFromApi) => ({
						...card,
						rate: card.rate ? parseInt(card.rate, 10) : card.rate,
						dueAt: card.dueAt ? parseInt(card.dueAt, 10) : card.dueAt,
						sides: JSON.parse(card.sides),
					}),
				);

				if (normalizedCards.length > 0) {
					if (coldStartTimerRef.current !== null) {
						clearTimeout(coldStartTimerRef.current);
						coldStartTimerRef.current = null;
					}

					if (isUsingColdStartRef.current) {
						apiCardListRef.current = normalizedCards;
					} else {
						setCardList(normalizedCards);
						setIsUsingColdStart(false);
					}
				}
			})
			.catch((error) => {
				console.error("Error fetching flashcards:", error);
			});

		return () => {
			if (coldStartTimerRef.current !== null) {
				clearTimeout(coldStartTimerRef.current);
			}
		};
	}, []);

	const handleRateCard = (card: CardType, rate: number) => {
		const dueAt = calculateDueAt(rate);

		const updatedCardList = cardList.map((cardItem) =>
			card.id === cardItem.id ? { ...cardItem, rate, dueAt } : cardItem,
		);

		const applyUpdatedCards = () => {
			setCardList(updatedCardList);
		};

		if (isUsingColdStart) {
			applyUpdatedCards();

			if (apiCardListRef.current.length > 0) {
				setCardList(apiCardListRef.current);
				setIsUsingColdStart(false);
				apiCardListRef.current = [];
			}

			return;
		}

		axios
			.put(`${import.meta.env.VITE_SERVER_IP}/cards/${card.id}`, {
				...card,
				sides: JSON.stringify(card.sides),
				rate,
				dueAt,
			})
			.then(() => {
				applyUpdatedCards();
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
