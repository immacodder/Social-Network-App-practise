import { useEffect, useState } from 'react'
import { userState } from '../contexts/UserContext'
import firebase from 'firebase'
import { postType, userType } from '../types'
import { postT } from '../components/MainPage'
const db = firebase.firestore()

const useUserPosts = (uid: string | null | false) => {
	const [userPosts, setUserPosts] = useState<postT[]>([])
	useEffect(() => {
		if (!uid) return
		db.collection('posts')
			.where('authorUID', '==', uid)
			.limit(10)
			.onSnapshot(data => {
				const posts: postT[] = []
				data.forEach(post => posts.push({ post: post.data() as postType, postID: post.id }))
				setUserPosts(posts)
			})
	}, [uid])

	if (!uid) return []
	return userPosts
}

export default useUserPosts
