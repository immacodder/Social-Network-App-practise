import React, { createContext, useEffect, useState } from 'react'
import firebase from '../firebase'
import { userType } from '../types'

type user = null | { user: userType; uid: string } | false
const db = firebase.firestore()

export const UserContext = createContext<user>(false)

export const UserProvider: React.FC = ({ children }) => {
	const [user, setUser] = useState<user>(false)
	useEffect(() => {
		const unsub = firebase.auth().onAuthStateChanged(async user => {
			if (!user) {
				setUser(false)
				return null
			}
			const res = await db.doc(`users/${user?.uid}`).get()
			const userData = res.data() as userType
			setUser({ user: userData, uid: user.uid })
		})

		return unsub
	}, [])

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
