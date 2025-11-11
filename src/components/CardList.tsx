import { useEffect, useState } from "react";
import type { CardListProps } from "src/types";
import { rand } from "utils/utils";
import Card from "./Card";

function CardList({ cards, onRateCard }: CardListProps) {
	const [currentCardIndex, setCurrentCardIndex] = useState(0);

	const handleRateCard = (rating: number) => {
		onRateCard(cards[currentCardIndex], rating);
	};

	const currentCard = cards[currentCardIndex];

	useEffect(() => {
		setCurrentCardIndex((prev) => rand(cards.length, prev));
	}, [cards]);

	return (
		<div className="card-list">
			{currentCard && <Card card={currentCard} onRateCard={handleRateCard} />}
		</div>
	);
}

export default CardList;
