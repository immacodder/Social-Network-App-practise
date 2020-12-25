import React, { useContext, useEffect, useReducer, useState } from 'react'
import s from './styles/UserPage.module.css'
import birthI from './icons/birthDate.svg'
import personAddI from './icons/person_add.svg'
import { UserContext } from '../contexts/UserContext'
import { Redirect } from 'react-router-dom'
import firebase from '../firebase'
import { userType } from '../types'

const db = firebase.firestore()

// WHAT I NEED

// backgroundImage?: string
// profileImage: string
// dateOfBirth: { year: number; month: number; day: number }
// userUid: string
// aboutMe?: string
const UserPage: React.FC = () => {
	const [userData, setUserData] = useState<userType | null>(null)
	const u = useContext(UserContext)
	if (u === false) return null
	if (u === null) return <Redirect to="/signin" />
	const { user } = u
	const { day, month, year } = u.user.dateOfBirth
	const date = new Date(year, month - 1, day)
	const longMonth = date.toLocaleString('en-us', { month: 'long' })
	console.log(longMonth)

	return (
		<div className={s.container}>
			{/* {p.backgroundImage && (
				<img
					className={s.backgroundImage}
					src={p.backgroundImage}
					alt="backgorund image"
				/>
			)} */}
			<div className={s.user}>
				<div
					className={s.userPicture}
					style={{
						backgroundImage: `url(${user.avatar})`,
						backgroundPosition: 'center',
						backgroundSize: 'cover'
					}}
				/>

				<p>{`${user.firstName} ${user.secondName}`}</p>

				<div className={s.birthDate}>
					<img src={birthI} alt="birth date" />
					<p>
						{day} {longMonth} {year}
					</p>
				</div>
			</div>
			<div className={s.actions}>
				<button className="btnPrimary">Message</button>
				<div className={s.addToFriends}>
					<img src={personAddI} alt="add to friends" />
				</div>
			</div>
			{/* {p.aboutMe && <p className={s.aboutMe}>{}</p>} */}
		</div>
	)
}

export default UserPage
