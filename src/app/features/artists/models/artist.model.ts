export interface Artist {
	id: string;
	name: string;
	bornCity?: string;
	birthdate?: string;
	img?: string;
	rating?: number;
	songs?: number[];
	songTitles?: string[];
}
