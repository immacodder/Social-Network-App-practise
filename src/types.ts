import firebase from 'firebase'

export interface commentType {
	text: string
	authorUID: string
	parentPostId: string
	createdAt: firebase.firestore.FieldValue
}

export interface postType {
	text: string
	imagesLinks: string[]
	authorUID: string
	likedBy: string[]
	dislikedBy: string[]
	comments: commentType[]
	createdAt: firebase.firestore.FieldValue
}
