export const getKeywords = (str: string): string[] =>
	str
		.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
		.replace(/\s{2,}/g, ' ')
		.toLowerCase()
		.split(' ')
