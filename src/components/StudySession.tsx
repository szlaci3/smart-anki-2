import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { StudySessionProps } from "src/types";
import { selectNextCard } from "utils/utils";
import Card from "./Card";

function StudySession({ cards, onRateCard }: StudySessionProps) {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const initialCardId = searchParams.get("cardId") || undefined;
	const [currentCardIndex, setCurrentCardIndex] = useState(0);

	const handleRateCard = (rating: number) => {
		onRateCard(cards[currentCardIndex], rating);

		// Remove initialCardId from URL after rating if it exists
		if (initialCardId) {
			navigate("/", { replace: true });
		}
	};

	const currentCard = cards[currentCardIndex];

	// Update card selection when cards list changes
	useEffect(() => {
		if (cards.length > 0) {
			// If we have an initialCardId, try to find and select that card
			if (initialCardId) {
				const cardIndex = cards.findIndex(
					(cardItem) => cardItem.id === initialCardId,
				);
				if (cardIndex >= 0) {
					setCurrentCardIndex(cardIndex);
					return;
				}
			}
			// Otherwise, use the normal selection algorithm
			setCurrentCardIndex(selectNextCard(cards));
		} else {
			setCurrentCardIndex(-1);
		}
	}, [cards, initialCardId]);

	return (
		<div className="card-list">
			{currentCard && <Card card={currentCard} onRateCard={handleRateCard} />}
		</div>
	);
}

export default StudySession;
