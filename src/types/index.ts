interface BaseCard {
	id: string;
}

export interface CardFromApi extends BaseCard {
	sides: string; // JSON string from API
	rate?: string | null;
	dueAt?: string | null;
}

export interface CardType extends BaseCard {
	sides: string[]; // Parsed array
	rate?: number | null;
	dueAt?: number | null;
}

export interface CardProps {
	card: CardType;
	onRateCard: (rate: number) => void;
}

export interface CardListProps {
	cards: CardType[];
	onRateCard: (card: CardType, rate: number) => void;
}
