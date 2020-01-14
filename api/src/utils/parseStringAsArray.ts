export const parseStringAsArray = (arrayAsString: string): Array<string> => {
	return arrayAsString.split(',').map(item => item.trim())
}
