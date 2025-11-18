import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { CardFromApi, CardType } from "types/index";
import "css/App.css";

function List() {
	const [cards, setCards] = useState<CardType[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		async function loadCards() {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_SERVER_IP}/cards`,
				);
				const allCards: CardType[] = response.data.map(
					(card: Record<string, string>) => ({
						...card,
						rate: card.rate ? parseInt(card.rate, 10) : null,
						dueAt: card.dueAt ? parseInt(card.dueAt, 10) : null,
						sides: JSON.parse(card.sides),
					}),
				);
				setCards(allCards);
			} catch (error) {
				console.error("Error fetching cards:", error);
			}
		}
		loadCards();
	}, []);

	useEffect(() => {
		if (searchQuery.trim() === "") {
			setFilteredCards(cards);
		} else {
			const query = searchQuery.toLowerCase();
			const filtered = cards.filter((card) =>
				card.sides.some((side) => side.toLowerCase().includes(query)),
			);
			setFilteredCards(filtered);
		}
	}, [searchQuery, cards]);

	const formatDueAt = (dueAt: number | null | undefined): string => {
		if (dueAt === null || dueAt === undefined) {
			return "Not reviewed";
		}
		const date = new Date(dueAt);
		const month = date.toLocaleString("en-US", { month: "short" });
		const day = date.getDate();
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `Due: ${month} ${day}, ${hours}:${minutes}`;
	};

	const handleDeleteAll = async () => {
		if (
			confirm(
				"Are you sure you want to delete ALL cards? This action cannot be undone.",
			)
		) {
			try {
				await axios.delete(`${import.meta.env.VITE_SERVER_IP}/cards`);
				setCards([]);
			} catch (error) {
				console.error("Error deleting all cards:", error);
				alert("Failed to delete all cards. Please try again.");
			}
		}
	};

	const handleEdit = (cardId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		navigate(`/cardForm/${cardId}`);
	};

	const handleDelete = async (cardId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm("Are you sure you want to delete this card?")) {
			try {
				await axios.delete(`${import.meta.env.VITE_SERVER_IP}/cards/${cardId}`);
				setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
			} catch (error) {
				console.error("Error deleting card:", error);
				alert("Failed to delete card. Please try again.");
			}
		}
	};

	const handleCardClick = (cardId: string) => {
		navigate(`/?cardId=${cardId}`);
	};

	const handleExportDB = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_SERVER_IP}/cards/export`,
			);
			const dataStr = JSON.stringify(response.data, null, 2);
			const dataBlob = new Blob([dataStr], { type: "application/json" });
			const url = URL.createObjectURL(dataBlob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `card-database-backup-${new Date().toISOString().split("T")[0]}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error exporting database:", error);
			alert("Failed to export database. Please try again.");
		}
	};

	const handleImportDB = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const importedCards: CardFromApi[] = JSON.parse(text);

			if (!Array.isArray(importedCards)) {
				throw new Error("Invalid file format. Expected an array of cards.");
			}

			if (
				!confirm(
					`This will replace all existing cards with ${importedCards.length} cards from the backup. Are you sure?`,
				)
			) {
				event.target.value = "";
				return;
			}

			// Import cards via API
			await axios.post(`${import.meta.env.VITE_SERVER_IP}/cards/import`, {
				cards: importedCards,
			});

			// Reload cards
			const response = await axios.get(
				`${import.meta.env.VITE_SERVER_IP}/cards`,
			);
			const allCards: CardType[] = response.data.map(
				(card: Record<string, string>) => ({
					...card,
					rate: card.rate ? parseInt(card.rate, 10) : null,
					dueAt: card.dueAt ? parseInt(card.dueAt, 10) : null,
					sides: JSON.parse(card.sides),
				}),
			);
			setCards(allCards);

			alert(`Successfully imported ${importedCards.length} cards!`);
		} catch (error) {
			console.error("Error importing database:", error);
			alert(
				"Failed to import database. Please make sure the file is a valid JSON backup.",
			);
		} finally {
			// Reset the input so the same file can be selected again
			event.target.value = "";
		}
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
					<h1>Card List</h1>
					<div className="list-controls">
						<input
							type="text"
							placeholder="Search cards..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="search-input"
						/>
						<button
							type="button"
							onClick={handleDeleteAll}
							className="delete-all-button"
						>
							Delete All Cards
						</button>
						<button
							type="button"
							onClick={handleExportDB}
							className="export-button"
						>
							Export DB
						</button>
						<label htmlFor="import-db-input" className="import-button">
							Import DB
							<input
								id="import-db-input"
								type="file"
								accept=".json"
								onChange={handleImportDB}
								style={{ display: "none" }}
							/>
						</label>
					</div>
					<div className="card-count">
						Showing {filteredCards.length} of {cards.length} cards
					</div>
				</div>

				<div className="cards-list-container">
					{filteredCards.length === 0 ? (
						<div className="no-cards-message">
							{searchQuery.trim() === ""
								? "No cards found. Create your first card!"
								: "No cards match your search."}
						</div>
					) : (
						filteredCards.map((card) => (
							<div
								key={card.id}
								className="card-list-item"
								onClick={() => handleCardClick(card.id)}
								// biome-ignore lint/a11y/useSemanticElements: <Div has button children.>
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleCardClick(card.id);
									}
								}}
							>
								<div className="card-list-content">
									<div className="card-list-side">
										{card.sides[0] || "Empty card"}
									</div>
									<div className="card-list-rate">
										{formatDueAt(card.dueAt)}
									</div>
								</div>
								<div className="card-list-actions">
									<button
										type="button"
										onClick={(e) => handleEdit(card.id, e)}
										className="edit-button"
									>
										Edit
									</button>
									<button
										type="button"
										onClick={(e) => handleDelete(card.id, e)}
										className="delete-button"
									>
										Delete
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default List;
