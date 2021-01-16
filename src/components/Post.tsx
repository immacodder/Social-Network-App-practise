import React, { useContext, useEffect, useState } from 'react'
import Comment, { onEditClick } from './Comment'
import firebase from '../firebase'
import { UserContext } from '../contexts/UserContext'
import { commentType, userType } from '../types'
import { onLikeOrDislike } from '../sharedFunctions/userLikedOrDisliked'
import { RenderImages } from './RenderImages'
import { v4 as uuid } from 'uuid'

interface Props {
	firstName: string
	secondName: string
	createdAt: number
	text: string
	likedBy: string[]
	dislikedBy: string[]
	authorPicture: string
	postId: string
	pictures: string[]
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
	const [isAddCommentInputActive, setIsAddCommentInputActive] = useState(false)
	const [isEditCommentInputActive, setIsEditCommentInputActive] = useState(false)
	const [commentValue, setCommentValue] = useState('')
	const [comments, setComments] = useState<commentT[]>([])
	const [isLikedByUser, setIsLikedByUser] = useState<boolean | null>(null)
	const [confirmButtonLabel, setConfirmButtonLabel] = useState('Add comment')
	const [editCommentUID, setEditCommentUID] = useState('')
	const user = useContext(UserContext)

	useEffect(() => {
		const unsub = db
			.collection('comments')
			.where('parentPostId', '==', p.postId)
			.orderBy('createdAt')
			.onSnapshot(snaphot => {
				const comments: commentT[] = []
				snaphot.forEach(doc => comments.push({ ...(doc.data() as commentType), commentId: doc.id }))
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

	const onAddComment = async () => {
		if (!user) return

		setCommentValue('')
		setIsAddCommentInputActive(false)
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
		onLikeOrDislike('posts', isLike, user.uid, isLikedByUser, p.postId, setIsLikedByUser)
	}
	const onReplyClick = (userName: string) => {
		setIsEditCommentInputActive(false)
		setIsAddCommentInputActive(true)
		setConfirmButtonLabel('Add comment')
		setCommentValue(`${userName}, `)
	}
	const onEditClick: onEditClick = (currentText, uid) => {
		setIsAddCommentInputActive(false)
		setIsEditCommentInputActive(true)
		setConfirmButtonLabel('Edit comment')
		setCommentValue(currentText)
		setEditCommentUID(uid)
	}
	const onCommentEditSubmit = (commentUID: string) =>
		db
			.doc(`comments/${commentUID}`)
			.update({ text: commentValue })
			.then(() => setIsEditCommentInputActive(false))
			.catch(e => console.error(e))

	return (
		<div className="max-w-screen-sm sm:mx-auto my-6">
			<div
				className="bg-white
			 p-4 sm:rounded-xl"
				style={{ boxShadow: '0px 5px 15px -3px rgba(0,0,0,0.2)' }}
			>
				<div className="flex justify-between">
					<div className="flex items-center">
						<img src={p.authorPicture} className="w-20 h-20 rounded-full object-cover object-center" />
						<p className="ml-2">
							{p.firstName}
							<br />
							{p.secondName}
						</p>
					</div>
					<p className="mt-4 text-sm">{new Date(p.createdAt).toLocaleDateString()}</p>
				</div>
				<article className="my-4">{p.text}</article>
				<hr />

				<RenderImages
					isViewOnly={true}
					imageURLs={p.pictures.map(picture => ({
						value: picture,
						uid: uuid()
					}))}
				/>

				{/* Icons container */}
				<div className="flex justify-between mt-4">
					{/* Like/dislike icons */}
					<div className="flex">
						<div className="flex mr-2 items-center" onClick={() => onLikeOrDislikeClick(true)}>
							<i className={`material-icons${isLikedByUser ? '' : '-outlined'}`}>thumb_up</i>
							<span className="ml-1">{p.likedBy.length}</span>
						</div>

						<div className="flex items-center" onClick={() => onLikeOrDislikeClick(false)}>
							<i className={`material-icons${isLikedByUser === false ? '' : '-outlined'}`}>thumb_down</i>
							<span className="ml-1">{p.dislikedBy.length}</span>
						</div>
					</div>
					{/* Share/Comment icons */}
					<div className="flex">
						<div
							className="flex items-center mr-2 iconContainer"
							onClick={() => {
								setIsAddCommentInputActive(true)
								setConfirmButtonLabel('Add comment')
							}}
						>
							<i className="material-icons text-primary mr-1">comment</i>
							<span>Comment</span>
						</div>
						<i className="material-icons">share</i>
					</div>
				</div>
			</div>

			{/* Comment section */}
			<div className="">
				{comments.map(comment => (
					<div key={comment.createdAt}>
						<Comment
							authorUID={comment.authorUID}
							onReplyClick={onReplyClick}
							onEditClick={onEditClick}
							onDeleteComment={uid => {
								if (uid === editCommentUID) {
									setIsEditCommentInputActive(false)
									setCommentValue('')
								}
							}}
							commentId={comment.commentId}
							authorName={comment.fName + ' ' + comment.sName}
							dislikedBy={comment.dislikedBy}
							likedBy={comment.likedBy}
							profilePictureURL={comment.profilePictureURL}
							text={comment.text}
						/>
					</div>
				))}

				{(isAddCommentInputActive || isEditCommentInputActive) && (
					<form
						className="w-full px-4 "
						onSubmit={e => {
							e.preventDefault()
							isAddCommentInputActive ? onAddComment() : onCommentEditSubmit(editCommentUID)
						}}
					>
						<input
							autoFocus
							value={commentValue}
							onChange={e => setCommentValue(e.target.value)}
							placeholder="Describe your thoughts"
						/>
						<div className="flex justify-between space-x-4 sm:w-1/2 sm:justify-start">
							<button className="btnPrimary" type="submit">
								{confirmButtonLabel}
							</button>
							<button
								type="button"
								className="btnSecondary"
								onClick={() =>
									isAddCommentInputActive ? setIsAddCommentInputActive(false) : setIsEditCommentInputActive(false)
								}
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
