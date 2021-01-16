import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext, userState } from '../../contexts/UserContext'
import { Redirect, Route, Router, Switch, useHistory, useLocation, useParams } from 'react-router-dom'
import firebase from '../../firebase'
import CustomizableAreaForm from '../CustomizableAreaForm'
import { Spinner } from '../Spinner'
import { customizableAreaFormSubmit } from '../..'
import UserPageContent from './UserPageContent'
import useUserPosts from '../../customHooks/useUserPosts'

const db = firebase.firestore()
const ref = firebase.storage().ref()
const CUSTOMIZE_USER_PATH = '/self/user/customizeuser'

export const SelfUserPage: React.FC<{ external?: true }> = p => {
	const { push } = useHistory()
	const userData = useContext(UserContext)
	const userPosts = useUserPosts(userData ? userData.uid : userData)

	if (userData === null || userPosts === null) return <Spinner />
	if (userData === false) return <Redirect to="/signin" />
	const { user } = userData

	const onSubmit: customizableAreaFormSubmit = async (imageURLs, areaText) => {
		let imageLink = ''
		if (imageURLs[0]) {
			const { extension, value, uid } = imageURLs[0]
			if ('default' in imageURLs[0]) {
			} else {
				let imageRef: firebase.storage.Reference
				if (user.coverImageUrl) imageRef = firebase.storage().refFromURL(user.coverImageUrl)
				else imageRef = ref.child(`users/${uid}.${extension}`)
				await imageRef.putString(value, 'data_url')
				try {
					imageLink = await imageRef.getDownloadURL()
				} catch (e) {
					console.error(e)
				}
			}
		}
		const updateObj: { aboutMe: string; coverImageUrl?: string } = { aboutMe: areaText }
		if (imageLink) updateObj.coverImageUrl = imageLink
		await db.doc(`users/${userData.uid}`).update(updateObj)
		push('/self/user')
	}

	return (
		<Switch>
			<Route exact path={['/self/user']}>
				<UserPageContent
					external={false}
					onCustomizeClick={() => push(CUSTOMIZE_USER_PATH)}
					userPosts={userPosts}
					user={user}
				/>
			</Route>
			<Route exact path={CUSTOMIZE_USER_PATH}>
				<CustomizableAreaForm
					discardButtonPushUrl="/self/user"
					areaHeight={150}
					areaLength={240}
					isMultipleSelect={false}
					onSubmit={onSubmit}
					addImageLabel="Add/Replace cover image"
					placeholder="Describe yourself"
					defaultValue={userData.user.aboutMe || ''}
					defaultPictureUrl={user.coverImageUrl || undefined}
				/>
			</Route>
		</Switch>
	)
}
