import React, { useContext, useEffect, useState } from 'react'
import { onLikeOrDislike } from '../sharedFunctions/userLikedOrDisliked'
import { UserContext } from '../contexts/UserContext'
import ContextMenu, { contextItem } from './ContextMenu'
import firebase from '../firebase'

const db = firebase.firestore()

export type onEditClick = (currentText: string, uid: string) => void
interface Props {
	profilePictureURL: string
	text: string
	authorUID: string
	authorName: string
	likedBy: string[]
	dislikedBy: string[]
	commentId: string
	onReplyClick(userName: string): void
	onEditClick: onEditClick
	onDeleteComment(uid: string): void
}

const contextMenuConfig: contextItem[] = [
	{ icon: 'edit', name: 'Edit', isDanger: false },
	{ icon: 'delete', name: 'Delete', isDanger: true }
]

const Comment: React.FC<Props> = p => {
	const [isMenuActive, setIsMenuActive] = useState(false)
	const [isLikedByUser, setIsLikedByUser] = useState<boolean | null>(null)
	const user = useContext(UserContext)

	useEffect(() => {
		const handler = (e: any) => {
			if (e.target.classList.contains('more')) return
			else {
				setIsMenuActive(false)
			}
		}
		document.body.addEventListener('click', handler)
		const detach = () => document.body.removeEventListener('click', handler)

		return detach
	}, [])

	useEffect(() => {
		if (user) {
			if (p.likedBy.includes(user.uid)) setIsLikedByUser(true)
			if (p.dislikedBy.includes(user.uid)) setIsLikedByUser(false)
		}
	}, [user, p.likedBy, p.dislikedBy])

	// Methods
	const onLikeOrDislikeClick = (isLike: boolean) => {
		if (!user) return
		onLikeOrDislike('comments', isLike, user.uid, isLikedByUser, p.commentId, setIsLikedByUser)
	}

	const onContextItemClick = (name: string) => {
		if (name === 'Edit') {
			p.onEditClick(p.text, p.commentId)
		}
		if (name === 'Delete') {
			db.doc(`comments/${p.commentId}`)
				.delete()
				.then(() => p.onDeleteComment(p.commentId))
				.catch(e => console.log(e))
		}
	}

	return (
		<div className="flex m-4 relative">
			{user && user.uid === p.authorUID && (
				<span
					onClick={() => setIsMenuActive(!isMenuActive)}
					className="material-icons absolute right-2 top-2 more z-0 select-none"
				>
					more_vert
				</span>
			)}
			{isMenuActive && (
				<div className="absolute top-4 right-4">
					<ContextMenu onItemClick={onContextItemClick} items={contextMenuConfig} />
				</div>
			)}
			<img
				className="w-14 h-14 mr-2 object-cover object-center rounded-full "
				src={p.profilePictureURL}
				alt="profile"
			/>
			<div className="commentIcons bg-white rounded-2xl w-full p-3 shadow-md">
				<p className="text-sm">{p.authorName}</p>
				<p className="pb-2">{p.text}</p>
				<hr />
				<div className="flex justify-between mt-2 items-center">
					<div className="flex">
						<div className="flex mr-2" onClick={() => onLikeOrDislikeClick(true)}>
							<span className={`material-icons${isLikedByUser ? '' : '-outlined'}`}>thumb_up</span>
							<span className="ml-1">{p.likedBy.length}</span>
						</div>
						<div className="flex" onClick={() => onLikeOrDislikeClick(false)}>
							<i className={`material-icons${isLikedByUser === false ? '' : '-outlined'}`}>thumb_down</i>
							<span className="ml-1">{p.dislikedBy.length}</span>
						</div>
					</div>
					<div className="flex iconContainer" onClick={() => p.onReplyClick(p.authorName)}>
						<i className="material-icons text-primary">reply</i>
						<span>Reply</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Comment
