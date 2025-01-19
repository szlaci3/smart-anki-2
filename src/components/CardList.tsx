import { useState } from "react";
import type { CardListProps } from "src/types";
import { rand } from "utils/utils";
import Card from "./Card";

function CardList({ cards, onRateCard }: CardListProps) {
	const [currentCardIndex, setCurrentCardIndex] = useState(() =>
		rand(cards.length),
	);

	const handleRateCard = (rating: number) => {
		onRateCard(cards[currentCardIndex], rating);
		setCurrentCardIndex((prev) => rand(cards.length, prev));
	};

	const currentCard = cards[currentCardIndex];

	return (
		<div className="card-list">
			{currentCard && <Card card={currentCard} onRateCard={handleRateCard} />}
		</div>
	);
}

export default CardList;
