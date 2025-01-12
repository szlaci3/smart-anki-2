interface BaseCard {
    id: string;
    rate: number | null;
    reviewedAt: number | null;
}

export interface CardFromApi extends BaseCard {
    sides: string; // JSON string from API
}

export interface CardType extends BaseCard {
    sides: string[]; // Parsed array
}

export interface CardProps {
    card: CardType;
    onRateCard: (rate: number) => void;
}

export interface CardListProps {
    cards: CardType[];
    onRateCard: (card: CardType, rate: number) => void;
}
