export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

/**
 * 
 * @param arr 
 * @description takes an array of strings and returns a sub array of random items from the array
 */
export function randomItemsFrom(arr: string[]) {
	const arrCopy = [...arr];
	// Fisher-Yates shuffle
	for (let i = arrCopy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
	}
	const randomCount = Math.floor(Math.random() * arrCopy.length) + 1;
	return arrCopy.slice(0, randomCount);
}