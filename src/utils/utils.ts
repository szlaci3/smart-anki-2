export const rand = (size: number, exclude: number | null = null) => {
	if (size === 1) {
		return 0;
	}
	let result: number;
	do {
		result = Math.floor(Math.random() * size);
	} while (result === exclude);
	return result;
};
