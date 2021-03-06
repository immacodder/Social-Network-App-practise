import React, { useContext, useRef, useState } from 'react'
import _ from 'lodash'
import { UserContext } from '../../contexts/UserContext'
import firebase from '../../firebase'
import imageCompressor from 'browser-image-compression'
import { userType } from '../../types'
import { useHistory } from 'react-router-dom'
import s from '../styles/PostSignUp.module.css'
import { getKeywords } from '../../outsourcedFunctions'

const db = firebase.firestore()
const rootRef = firebase.storage().ref()
const now = new Date()

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate()

const getArraysOfDates = (year: number, month: number) => [
	_.range(1950, now.getFullYear() - 8),
	_.range(1, 13),
	_.range(1, getDaysInMonth(year, month))
]

const defUrl =
	'https://firebasestorage.googleapis.com/v0/b/social-network-app-dev.appspot.com/o/User.svg?alt=media&token=f4337005-ebf9-4362-9799-9593c37f2684'

const PostSignUp: React.FC = () => {
	//type names are short versions of states
	type fne = '' | 'You need to provide your first name'
	type sne = '' | 'You need to provide your second name'
	type ge = '' | 'You need to select gender'
	type dobe = '' | 'Please provide your date of birth'

	const [year, setYear] = useState(0)
	const [month, setMonth] = useState(0)
	const [day, setDay] = useState(0)
	const [fName, setFName] = useState('')
	const [sName, setSName] = useState('')
	const [avatar, setAvatar] = useState(defUrl)
	const [gender, setGender] = useState<'male' | 'female' | ''>('')

	const [fNameError, setFNameError] = useState<fne>('')
	const [sNameError, setSNameError] = useState<sne>('')
	const [genderError, setGenderError] = useState<ge>('')
	const [dateOfBirthError, setDateOfBirthError] = useState<dobe>('')

	const fileInputRef = useRef<HTMLInputElement>(null)
	const user = useContext(UserContext)
	const history = useHistory()

	const [years, months, days] = getArraysOfDates(year, month)
	let isDayDisabled = year === 0 || month === 0

	const getCompressedImage = async () => {
		if (fileInputRef.current?.files) {
			const image = await imageCompressor(fileInputRef.current.files[0], {
				maxSizeMB: 0.1,
				maxWidthOrHeight: 400
			})
			return image
		} else throw new Error('There is no image, dumb ass')
	}

	const validate = (): void => {
		fName ? setFNameError('') : setFNameError('You need to provide your first name')
		sName ? setSNameError('') : setSNameError('You need to provide your second name')
		gender ? setGenderError('') : setGenderError('You need to select gender')
		!year || !month || !day ? setDateOfBirthError('Please provide your date of birth') : setDateOfBirthError('')
	}

	const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!fName || !sName || !gender || !year || !month || !day) {
			validate()
			return null
		}

		if (!user) throw new Error('For some reason, there is no user')

		let avatarURL: string = ''
		const userRef = db.collection('users').doc(user.uid)

		//Check whether or not user picked a profile picture
		try {
			// @ts-ignore
			const extension = fileInputRef.current.files[0].name.split('.').pop()
			const compressedImage = await getCompressedImage()
			const avatarRef = rootRef.child(`users/${user.uid}.${extension}`)
			await avatarRef.put(compressedImage)
			avatarURL = await avatarRef.getDownloadURL()
		} catch {
			avatarURL = defUrl
		}
		const userInfo: userType = {
			dateOfBirth: { year, month, day },
			firstName: fName,
			secondName: sName,
			avatar: avatarURL,
			gender,
			aboutMe: null,
			coverImageUrl: null,
			friends: [],
			searchTerms: getKeywords(fName + ' ' + sName)
		}

		await userRef.set(userInfo)
		history.push('/addpost')
	}

	const onFileSelect = () => {
		if (!fileInputRef.current?.files?.length) return null
		const reader = new FileReader()
		reader.onload = e => setAvatar(reader.result as string)

		fileInputRef.current?.files && reader.readAsDataURL(fileInputRef.current.files[0])
	}
	const onGenderClick = (isMale: boolean) => (isMale ? setGender('male') : setGender('female'))

	return (
		<div className="px-4 mx-auto mt-8 sm:max-w-lg sm:mt-32 text-center ">
			<h1 className="text-xl">
				Complete
				<br />
				Information
			</h1>
			<form onSubmit={onFormSubmit}>
				<div className="sm:pt-4">
					<input onChange={e => setFName(e.target.value)} value={fName} placeholder="First name" type="text" />
					{fNameError && <div className="error">{fNameError}</div>}
					<input onChange={e => setSName(e.target.value)} value={sName} placeholder="Second name" type="text" />
					{sNameError && <div className="error">{sNameError}</div>}
				</div>
				<div className={`sm:flex sm:items-center`}>
					<p className="text-lg mt-4 sm:mt-0 sm:text-left sm:mr-2 sm:w-3/12">You are:</p>
					<div className="my-2">
						<button
							onClick={() => onGenderClick(true)}
							className={`${s.genderButton} mr-4 ${gender === 'male' ? 'text-primary' : ''}`}
							type="button"
						>
							Male
						</button>
						<button
							type="button"
							className={`${s.genderButton} ${gender === 'female' ? 'text-primary' : ''}`}
							onClick={() => onGenderClick(false)}
						>
							Female
						</button>
					</div>
					{genderError && <div className="error">{genderError}</div>}
				</div>
				<div className={`sm:flex sm:items-center mt-2`}>
					<p className="text-lg mb-2 sm:mb-0 sm:text-left sm:w-3/12">Date of Birth:</p>
					<div className={`${s.selectContainer}`}>
						<select
							value={year}
							// className="py-2 px-4 bg-white shadow text-red rounded focus:outline-none"
							onChange={e => setYear(parseInt(e.target.value))}
						>
							<option key="def" value={0} disabled hidden>
								Year
							</option>
							{years.map(v => (
								<option key={v} value={v}>
									{v}
								</option>
							))}
						</select>

						<select value={month} onChange={e => setMonth(parseInt(e.target.value))}>
							<option key="def" value={0} disabled hidden>
								Month
							</option>
							{months.map(v => (
								<option key={v} value={v}>
									{v}
								</option>
							))}
						</select>

						<select disabled={isDayDisabled} value={day} onChange={e => setDay(parseInt(e.target.value))}>
							<option key="def" value={0} disabled hidden>
								Day
							</option>
							{days.map(v => (
								<option key={v} value={v}>
									{v}
								</option>
							))}
						</select>
					</div>
					{dateOfBirthError && <div className="error">{dateOfBirthError}</div>}
				</div>
				<div className="flex my-4">
					<img className="w-24 h-24 profileImage" alt="profile" src={avatar} />
					<label className="shadow self-center flex items-center rounded px-4 py-2 ml-4 bg-white" htmlFor="fileInput">
						<p>Select Profile image</p>
						<input
							className="hidden"
							accept=".png,.jpg"
							onChange={onFileSelect}
							ref={fileInputRef}
							id="fileInput"
							type="file"
						/>
					</label>
				</div>
				<button type="submit" className="btnPrimary">
					Continue
				</button>
			</form>
		</div>
	)
}

export {}
export default PostSignUp
