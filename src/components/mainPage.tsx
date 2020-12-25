import React, { useContext, useEffect, useState } from 'react'
import Post from './Post'
import firebase from 'firebase'
import { UserContext } from '../contexts/UserContext'
import { useHistory } from 'react-router-dom'
import { commentType, postType } from '../types'
import Navbar from './Navbar'

const db = firebase.firestore()

interface postT {
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
	postID: string
}

const MainPage: React.FC = () => {
	const [posts, setPosts] = useState<postT[]>([])

	const user = useContext(UserContext)
	const history = useHistory()

	useEffect(() => {
		const unsub = db.collection('posts').onSnapshot(
			docs => {
				const posts: postT[] = []
				docs.forEach(doc => {
					posts.push({ ...(doc.data() as postType), postID: doc.id })
				})
				setPosts(posts)
			},
			e => console.error(e.message, e.code)
		)
		return unsub
	}, [])

	if (user === null) history.push('/signin')
	return (
		<>
			{posts.map(p => (
				<div key={p.createdAt} style={{ marginTop: '25px' }}>
					<Post
						postId={p.postID}
						authorPicture={p.authorImage}
						createdAt={p.createdAt}
						dislikedBy={p.dislikedBy}
						firstName={p.firstName}
						likedBy={p.likedBy}
						secondName={p.secondName}
						text={p.text}
					/>
				</div>
			))}
			<Navbar active="home" />
		</>
	)
}

export default MainPage
