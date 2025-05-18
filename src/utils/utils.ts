export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

/**
 * 
 * @param arr 
 * @description takes an array of strings and returns a sub array of random items from the array
 */
export function randomItemsFrom(arr: string[]){
	const randomItems = [];
	const randomCount = Math.floor(Math.random() * arr.length) + 1;
	for (let i = 0; i < randomCount; i++) {
		const randomIndex = Math.floor(Math.random() * arr.length);
		randomItems.push(arr[randomIndex]);
	}
	return randomItems;
}