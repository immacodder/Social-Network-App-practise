import firebase from 'firebase'
const db = firebase.firestore()

export const onLikeOrDislike = (
	docRefCollection: string,
	isLike: boolean,
	uid: string | null | false,
	isLikedByUser: boolean | null,
	subjectToChangeId: string,
	setIsLikedByUser: (arg: boolean | null) => void
) => {
	if (!uid) return
	const ref = db.doc(`${docRefCollection}/${subjectToChangeId}`)

	//if user liked
	if (isLike) {
		//ckeck wherher user already liked the post
		if (isLikedByUser) {
			//if so, unlike it
			ref.update({
				likedBy: firebase.firestore.FieldValue.arrayRemove(uid)
			})
			setIsLikedByUser(null)
		} else {
			setIsLikedByUser(true)
			ref.update({
				dislikedBy: firebase.firestore.FieldValue.arrayRemove(uid)
			})
			ref.update({
				likedBy: firebase.firestore.FieldValue.arrayUnion(uid)
			})
		}
	}
	// if user disliked
	else {
		//ckeck wherher user already disliked the post
		if (isLikedByUser === false) {
			//if so, undislike it
			ref.update({
				dislikedBy: firebase.firestore.FieldValue.arrayRemove(uid)
			})
			setIsLikedByUser(null)
		} else {
			setIsLikedByUser(false)
			ref.update({
				likedBy: firebase.firestore.FieldValue.arrayRemove(uid)
			})
			ref.update({
				dislikedBy: firebase.firestore.FieldValue.arrayUnion(uid)
			})
		}
	}
}
