export interface Song {
	id: string;
	title: string;
	artist: string;
	artistName?: string;
	companyId?: number;
	year: number;
	duration: number;
	rating: number;
	genre: string[];
	poster: string;
}
