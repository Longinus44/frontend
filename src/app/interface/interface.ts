export interface ICoordinator {
	id: string
	name: string
	location: string
	price: number
	profilephoto: string
	bio: string
	availability: string[]
	__v?: number
}

export interface IBookingFormData {
	name: string
	email: string
	weddingdate: string
	guestscount: string
}
export type Props = {
	params: Promise<{ id: string }>;
};