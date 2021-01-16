import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { UserContext, userState } from '../../contexts/UserContext'
import useUserPosts from '../../customHooks/useUserPosts'
import UserPageContent from './UserPageContent'
import firebase from '../../firebase'
import { userType } from '../../types'
import { Spinner } from '../Spinner'
const db = firebase.firestore()

export const ExternalUserPage: React.FC = () => {
	const userState = useContext(UserContext)
	const { uid } = useParams<{ uid: string }>()
	const [targetUser, setTargetUser] = useState<userState | null>(null)
	const posts = useUserPosts(uid)
	const { push } = useHistory()

	useEffect(function () {
		db.doc(`users/${uid}`)
			.get()
			.then(res => setTargetUser({ user: res.data() as userType, uid: res.id }))
			.catch(e => console.error(e))
	}, [])

	if (!userState || !targetUser) return <Spinner />
	const { uid: currentUserUID } = userState

	const onAddFriendClick = (isRemoval: boolean) =>
		db
			.doc(`users/${currentUserUID}`)
			.update({ friends: firebase.firestore.FieldValue[isRemoval ? 'arrayRemove' : 'arrayUnion'](uid) })
			.then(() => push(`/friends`))

	return (
		<UserPageContent
			external
			onAddFriendClick={() => onAddFriendClick(false)}
			onRemoveFriendClick={() => onAddFriendClick(true)}
			userPosts={posts}
			user={targetUser.user}
			uid={targetUser.uid}
			selfUser={userState.user}
		/>
	)
}
