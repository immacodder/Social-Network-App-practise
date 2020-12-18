import React, { createContext, useEffect, useState } from 'react'
import firebase from '../firebase'
import 'firebase/auth'

export const UserContext = createContext<null | firebase.User>(null)

export const UserProvider: React.FC = ({ children }) => {
	const [user, setUser] = useState<null | firebase.User>(null)
	useEffect(() => {
		const unsub = firebase.auth().onAuthStateChanged(user => {
			user && setUser(user)
		})
		return unsub
	}, [])

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
