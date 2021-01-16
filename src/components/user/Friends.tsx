import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { Spinner } from '../Spinner'
import firebase from '../../firebase'
import { userType } from '../../types'
const db = firebase.firestore()

export const Friends = () => {
	const userState = useContext(UserContext)
	const [userFriends, setUserFriends] = useState<userType[]>([])

	useEffect(() => {
		if (!userState) return
		if (!userState.user.friends.length) {
			setUserFriends([])
			return undefined
		}
		const unsub = db
			.collection('users')
			.where(firebase.firestore.FieldPath.documentId(), 'in', userState.user.friends)
			.onSnapshot(
				res => {
					const tempArr: userType[] = []
					res.docs.forEach(doc => tempArr.push(doc.data() as userType))
					setUserFriends(tempArr)
				},
				e => console.error(e)
			)

		return unsub
	}, [userState])

	if (!userState) return <Spinner align="start" />

	return (
		<div className="mx-4 max-w-screen-sm sm:mx-auto my-8">
			<p className="text-3xl font-bold mb-4">Friends</p>
			{userFriends.map(user => {
				return (
					<div key={user.avatar} className="flex">
						<img
							className="profileImage w-16 h-16 sm:w-20 sm:mt-0 sm:h-20 mt-2 mr-2 shadow-lg"
							alt="friend"
							src={user.avatar}
						/>
						<div className="p-4 bg-white shadow-lg rounded-2xl">
							<p>{user.firstName + ' ' + user.secondName}</p>
							<p>Replace me with previout chat message</p>
						</div>
					</div>
				)
			})}
			{!userFriends.length && userState.user.friends.length !== 0 && (
				<Spinner text="Loading friends..." align="start" />
			)}
			{userState.user.friends.length === 0 && <div className="panel">No friends</div>}
		</div>
	)
}
