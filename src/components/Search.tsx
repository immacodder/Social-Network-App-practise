import { formatDistanceToNowStrict } from 'date-fns'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce/lib'
import { UserContext } from '../contexts/UserContext'
import firebase from '../firebase'
import { postType, userType } from '../types'
import { postT } from './MainPage'
import { getKeywords } from '../outsourcedFunctions'
import Post from './Post'

const db = firebase.firestore()
type userT = { user: userType; uid: string }
export const Search: React.FC<{ initialSearchTerm?: string }> = p => {
	const [content, setContent] = useState('users')
	const [posts, setPosts] = useState<postT[]>([])
	const [users, setUsers] = useState<userT[]>([])
	const [order, setOrder] = useState('newest')
	const { defTerm }: { defTerm: string } = useParams()
	const [searchTerm, setSearchTerm] = useState(defTerm || '')
	const [debouncedSearchTerm] = useDebounce(searchTerm, 1000)
	const userState = useContext(UserContext)

	useEffect(() => {
		let keywords = getKeywords(debouncedSearchTerm)
		if (!debouncedSearchTerm) return
		if (content === 'posts') {
			const unsub = db
				.collection(content)
				.where('searchTerms', 'array-contains-any', keywords)
				.limit(10)
				.onSnapshot(
					res => {
						const tempArr: postT[] = []
						res.docs.forEach(doc => tempArr.push({ post: doc.data() as postType, postID: doc.id }))
						setPosts(tempArr)
					},
					e => console.error(e)
				)
			return unsub
		}
		if (content === 'users')
			db.collection(content)
				.where('searchTerms', 'array-contains-any', keywords)
				.limit(10)
				.get()
				.then(res => {
					const tempArr: userT[] = []
					res.docs.forEach(doc => tempArr.push({ user: doc.data() as userType, uid: doc.id }))
					setUsers(tempArr)
				})
				.catch(e => console.error(e))
	}, [debouncedSearchTerm, order, content])

	const renderNoResults = () => {
		if (searchTerm) {
			if ((content === 'posts' && !posts.length) || (content === 'users' && !users.length)) {
				return <div className="panel">No results :(</div>
			}
		}
	}

	return (
		<div className="m-4 md:mt-8	max-w-screen-sm sm:mx-auto">
			<div>
				<div className="relative bg-white focus:ring-2 ring-primary rounded-lg">
					<input
						onChange={e => {
							setSearchTerm(e.target.value)
						}}
						value={searchTerm}
						className="bg-transparent w-full h-10 text-black m-0"
						placeholder="Search for anything"
					/>
					<div className="absolute h-full top-0 right-0 pointer-events-none">
						<span className="material-icons flex h-full items-center text-black mr-2">search</span>
					</div>
				</div>
				<div className="mt-4">
					<select className="search-select" value={content} onChange={e => setContent(e.target.value)}>
						<option value="users">Users</option>
						<option value="posts">Posts</option>
					</select>
					<select
						className="search-select disabled:opacity-50"
						value={order}
						disabled={content !== 'posts' && true}
						onChange={e => setOrder(e.target.value)}
					>
						<option value="newest">Newest</option>
						<option value="oldest">Oldest</option>
					</select>
				</div>
			</div>
			{content === 'users' &&
				users.map(({ uid, user: u }) => {
					const { dateOfBirth: date } = u
					if (!userState || userState.uid === uid) return null
					return (
						<Link to={`/user/${uid}`} key={uid} className="flex p-4 mt-4 shadow-md bg-white rounded-xl items-center">
							<img src={u.avatar} className="profileImage w-24 h-24" />
							<div className="ml-4 font-bold">
								<p>{u.firstName + ' ' + u.secondName}</p>
								<p>
									{formatDistanceToNowStrict(new Date(date.year, date.month, date.day), { roundingMethod: 'floor' }) +
										' old'}
								</p>
								{u.aboutMe && <p className="text-sm font-normal">{u.aboutMe.slice(0, 55) + '...'}</p>}
							</div>
						</Link>
					)
				})}
			{content === 'posts' &&
				posts.map(({ post: p, postID }) => (
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
			{renderNoResults()}
		</div>
	)
}
