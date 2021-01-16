import React, { useContext, useEffect, useState } from 'react'
import Post from './Post'
import firebase from 'firebase'
import { UserContext } from '../contexts/UserContext'
import { Redirect, useHistory } from 'react-router-dom'
import { commentType, postType } from '../types'
import { Navbar } from './Navbar'
import { Spinner } from './Spinner'

const db = firebase.firestore()

export interface postT {
	post: postType
	postID: string
}

const MainPage: React.FC = () => {
	const [posts, setPosts] = useState<postT[]>([])
	const user = useContext(UserContext)

	useEffect(() => {
		const unsub = db.collection('posts').onSnapshot(
			docs => {
				const posts: postT[] = []
				docs.forEach(doc => {
					posts.push({ post: doc.data() as postType, postID: doc.id })
				})
				setPosts(posts)
			},
			e => console.error(e.message, e.code)
		)
		return unsub
	}, [])

	if (user === null || !posts.length) return <Spinner />
	if (user === false) return <Redirect to="/signin" />
	return (
		<>
			{posts.map(({ post: p, postID }) => (
				<Post
					key={p.createdAt}
					pictures={p.imagesLinks}
					postId={postID}
					authorPicture={p.authorImage}
					createdAt={p.createdAt}
					dislikedBy={p.dislikedBy}
					firstName={p.firstName}
					likedBy={p.likedBy}
					secondName={p.secondName}
					text={p.text}
				/>
			))}
		</>
	)
}

export default MainPage
