// ICONS
import replyI from './icons/reply.svg'
import thumb_downI from './icons/thumb_down.svg'
import thumb_upI from './icons/thumb_up.svg'
import thumb_down_outlineI from './icons/thumb_down_outline.svg'
import thumb_up_outlineI from './icons/thumb_up_outline.svg'
import moreI from './icons/more.svg'
import editI from './icons/edit.svg'
import deleteI from './icons/delete.svg'
////////////
import React, { useContext, useEffect, useState } from 'react'
import s from './styles/Comment.module.css'
import { onLikeOrDislike } from './sharedFunctions/userLikedOrDisliked'
import { UserContext } from '../contexts/UserContext'
import ContextMenu, { contextItem } from './ContextMenu'
import { v4 as uuid } from 'uuid'
import firebase from '../firebase'

const db = firebase.firestore()

interface Props {
	profilePictureURL: string
	text: string
	uid: string
	authorName: string
	likedBy: string[]
	dislikedBy: string[]
	commentId: string
	onReplyClick: (userName: string) => void
}

const contextMenuConfig: contextItem[] = [
	{ iconPath: editI, name: 'Edit', isDanger: false },
	{ iconPath: deleteI, name: 'Delete', isDanger: true }
]

const Comment: React.FC<Props> = p => {
	const [isMenuActive, setIsMenuActive] = useState(false)
	const [isLikedByUser, setIsLikedByUser] = useState<boolean | null>(null)
	const user = useContext(UserContext)

	// Effects
	useEffect(() => {
		const handler = (e: any) => {
			if (e.target.className === s.more) return
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
	}, [user])

	// Methods
	const onLikeOrDislikeClick = (isLike: boolean) => {
		if (!user) return
		onLikeOrDislike(
			'comments',
			isLike,
			user.uid,
			isLikedByUser,
			p.commentId,
			setIsLikedByUser
		)
	}

	const onContextItemClick = (name: string) => {
		if (name === 'Edit') {
		}
		if (name === 'Delete') {
			db.doc(`comments/${p.commentId}`)
				.delete()
				.then(() => console.log('Deleted'))
				.catch(e => console.log(e))
		}
	}

	return (
		<div className={s.container}>
			{isMenuActive && (
				<div className={s.contextMenuContainer}>
					<ContextMenu
						onItemClick={onContextItemClick}
						items={contextMenuConfig}
					/>
				</div>
			)}
			{user && user.uid === p.uid && (
				<img
					onClick={() => setIsMenuActive(!isMenuActive)}
					className={s.more}
					src={moreI}
				/>
			)}
			<div
				className={s.authorImage}
				style={{ backgroundImage: `url(${p.profilePictureURL})` }}
			/>
			<div className={s.content}>
				<p className={s.authorName}>{p.authorName}</p>
				<p className={s.comment}>{p.text}</p>
				<hr className={s.hr} />
				<div className={s.bottomFlexbox}>
					<div className={s.iconsLeftContainer}>
						<div
							onClick={() => onLikeOrDislikeClick(true)}
							className={s.iconContainer}
						>
							<img src={isLikedByUser ? thumb_upI : thumb_up_outlineI} />
							<span>{p.likedBy.length}</span>
						</div>
						<div
							onClick={() => onLikeOrDislikeClick(false)}
							className={s.iconContainer}
						>
							<img
								src={
									isLikedByUser === false ? thumb_downI : thumb_down_outlineI
								}
							/>
							<span>{p.dislikedBy.length}</span>
						</div>
					</div>
					<div
						onClick={() => p.onReplyClick(p.authorName)}
						className={s.iconContainer}
					>
						<img src={replyI} />
						<span>Reply</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Comment
