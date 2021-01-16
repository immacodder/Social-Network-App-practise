// import firebase from 'firebase'

export interface commentType {
	text: string
	fName: string
	sName: string
	authorUID: string
	profilePictureURL: string
	parentPostId: string
	likedBy: string[]
	dislikedBy: string[]
	createdAt: number
}

export interface postType {
	authorImage: string
	firstName: string
	secondName: string
	text: string
	imagesLinks: string[]
	authorUID: string
	likedBy: string[]
	dislikedBy: string[]
	comments: commentType[]
	createdAt: number
	searchTerms: string[]
}

export interface userType {
	avatar: string
	dateOfBirth: { day: number; month: number; year: number }
	firstName: string
	secondName: string
	gender: 'female' | 'male'
	aboutMe: string | null
	coverImageUrl: string | null
	friends: string[]
	searchTerms: string[]
}
