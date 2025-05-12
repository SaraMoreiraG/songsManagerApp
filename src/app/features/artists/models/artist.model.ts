export interface Artist {
	id: string;
	name: string;
	bornCity?: string;
	birthDate?: string;
	img?: string;
	rating?: number;
	songs?: number[];
	songTitles?: string[];
}
