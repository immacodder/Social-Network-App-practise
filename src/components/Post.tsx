import React, { useContext, useEffect, useState } from 'react'
import s from './styles/Post.module.css'
import commentI from './icons/comment.svg'
import thumb_upI from './icons/thumb_up.svg'
import thumb_downI from './icons/thumb_down.svg'
import thumb_down_outlineI from './icons/thumb_down_outline.svg'
import thumb_up_outlineI from './icons/thumb_up_outline.svg'
import shareI from './icons/share.svg'
import Comment from './Comment'
import firebase from '../firebase'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { commentType, postType, userType } from '../types'
import { onLikeOrDislike } from './sharedFunctions/userLikedOrDisliked'

interface Props {
	firstName: string
	secondName: string
	createdAt: number
	text: string
	likedBy: string[]
	dislikedBy: string[]
	authorPicture: string
	postId: string
}

interface commentT {
	commentId: string
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

const db = firebase.firestore()

const Post: React.FC<Props> = p => {
	const [isCommentInputActive, setIsCommentInputActive] = useState(false)
	const [commentValue, setCommentValue] = useState('')
	const [comments, setComments] = useState<commentT[]>([])
	// null = user didn't like or dislike
	const [isLikedByUser, setIsLikedByUser] = useState<boolean | null>(null)

	const history = useHistory()
	const user = useContext(UserContext)

	useEffect(() => {
		const unsub = db
			.collection('comments')
			.where('parentPostId', '==', p.postId)
			.orderBy('createdAt')
			.onSnapshot(snaphot => {
				const comments: commentT[] = []
				snaphot.forEach(doc =>
					comments.push({ ...(doc.data() as commentType), commentId: doc.id })
				)
				setComments(comments)
			})
		return unsub
	}, [])

	useEffect(() => {
		if (user) {
			if (p.likedBy.includes(user.uid)) setIsLikedByUser(true)
			if (p.dislikedBy.includes(user.uid)) setIsLikedByUser(false)
		}
	}, [user])

	const onAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
		/* 
		TODO:
		make sure that when you create user, you also update the user object with full name (in PostSignUp.tsx)
		just not to make another useless request to the server here
		*/
		e.preventDefault()
		if (!user) return

		setCommentValue('')
		setIsCommentInputActive(false)
		const userInfo = await db.doc(`users/${user.uid}`).get()
		const { firstName, secondName, avatar } = userInfo.data() as userType
		const comment: commentType = {
			createdAt: new Date().getTime(),
			authorUID: user.uid,
			dislikedBy: [],
			likedBy: [],
			fName: firstName,
			sName: secondName,
			parentPostId: p.postId,
			text: commentValue,
			profilePictureURL: avatar
		}
		db.collection('comments')
			.add(comment)
			.catch(e => console.error(e))
	}

	const onLikeOrDislikeClick = (isLike: boolean) => {
		if (!user) return
		onLikeOrDislike(
			'posts',
			isLike,
			user.uid,
			isLikedByUser,
			p.postId,
			setIsLikedByUser
		)
	}
	const onReplyClick = (userName: string) => {
		setIsCommentInputActive(true)
		setCommentValue(`${userName}, `)
	}

	return (
		<div className={s.background}>
			<div className={s.postContainer}>
				<div className={s.topFlexbox}>
					<div className={s.user}>
						<div
							className={s.userImage}
							style={{
								backgroundImage: `url(${p.authorPicture})`,
								backgroundPosition: 'center',
								backgroundSize: 'cover'
							}}
						/>
						<p>
							{p.firstName}
							<br />
							{p.secondName}
						</p>
					</div>
					<p className={s.postTime}>
						{new Date(p.createdAt).toLocaleDateString()}
					</p>
				</div>
				<article className={s.article}>{p.text}</article>
				<hr className={s.hr} />
				<div className={s.bottomFlexbox}>
					<div className={s.separateContainer}>
						<div className={s.iconContainer}>
							<img
								onClick={() => onLikeOrDislikeClick(true)}
								src={isLikedByUser ? thumb_upI : thumb_up_outlineI}
							/>
							<span className={s.iconText}>{p.likedBy.length}</span>
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
							<span className={s.iconText}>{p.dislikedBy.length}</span>
						</div>
					</div>

					<div className={s.separateContainer}>
						<div
							onClick={() => setIsCommentInputActive(true)}
							className={s.iconContainer}
						>
							<img src={commentI} />
							<span>Comment</span>
						</div>
						<img src={shareI} />
					</div>
				</div>
			</div>

			<div className={s.commentSection}>
				{comments.map(comment => (
					<div key={comment.createdAt}>
						<Comment
							uid={comment.authorUID}
							onReplyClick={onReplyClick}
							commentId={comment.commentId}
							authorName={comment.fName + ' ' + comment.sName}
							dislikedBy={comment.dislikedBy}
							likedBy={comment.likedBy}
							profilePictureURL={comment.profilePictureURL}
							text={comment.text}
						/>
					</div>
				))}
				{isCommentInputActive && (
					<form onSubmit={onAddComment} className={s.addCommentForm}>
						<input
							autoFocus
							value={commentValue}
							onChange={e => setCommentValue(e.target.value)}
							placeholder="Describe your thoughts"
						/>
						<div>
							<button className={`btnPrimary`} type="submit">
								Add comment
							</button>
							<button
								type="button"
								onClick={() => setIsCommentInputActive(false)}
								className={`btnSecondary`}
							>
								Reject
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	)
}

export default Post
