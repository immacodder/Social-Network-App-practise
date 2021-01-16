import React, { createContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import firebase from '../firebase'
import { userType } from '../types'

export type userState = { user: userType; uid: string } | null | false

const db = firebase.firestore()

export const UserContext = createContext<userState>(null)

export const UserProvider: React.FC = ({ children }) => {
	const [user, setUser] = useState<userState>(null)
	const { push } = useHistory()
	useEffect(() => {
		const unsub = firebase.auth().onAuthStateChanged(async user => {
			if (!user) {
				setUser(false)
				return null
			}
			try {
				db.doc(`users/${user?.uid}`).onSnapshot(u => {
					const userData = u.data() as userType
					setUser({ user: userData, uid: user.uid })
				})
			} catch (e) {
				console.log('Error', e)
			}
		})

		return unsub
	}, [])

	if (user === false) push('/signin')
	return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
