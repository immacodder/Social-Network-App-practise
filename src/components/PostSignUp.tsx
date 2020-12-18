import React, { useContext, useRef, useState } from 'react'
import styles from './styles/PostSignUp.module.css'
import _ from 'lodash'
import { UserContext } from '../contexts/UserContext'
import firebase from '../firebase'
import imageCompressor from 'browser-image-compression'

const db = firebase.firestore()
const rootRef = firebase.storage().ref()
const now = new Date()

const getDaysInMonth = (year: number, month: number) =>
	new Date(year, month, 0).getDate()

const getArraysOfDates = (year: number, month: number) => [
	_.range(1950, now.getFullYear() - 8),
	_.range(1, 13),
	_.range(1, getDaysInMonth(year, month))
]

const defUrl =
	'https://firebasestorage.googleapis.com/v0/b/social-network-app-dev.appspot.com/o/users%2Fanonymous.svg?alt=media&token=07138c31-d785-4cba-9356-c9ec5d804529'

const PostSignUp: React.FC = () => {
	//types
	//type names are short versions of states
	type fne = '' | 'You need to provide your first name'
	type sne = '' | 'You need to provide your second name'
	type ge = '' | 'You need to select gender'
	type dobe = '' | 'Please provide your date of birth'
	//states
	const [year, setYear] = useState(0)
	const [month, setMonth] = useState(0)
	const [day, setDay] = useState(0)
	const [fName, setFName] = useState('')
	const [sName, setSName] = useState('')
	const [avatar, setAvatar] = useState(defUrl)
	const [gender, setGender] = useState<'male' | 'female' | ''>('')
	//errors
	const [fNameError, setFNameError] = useState<fne>('')
	const [sNameError, setSNameError] = useState<sne>('')
	const [genderError, setGenderError] = useState<ge>('')
	const [dateOfBirthError, setDateOfBirthError] = useState<dobe>('')

	const fileInputRef = useRef<HTMLInputElement>(null)
	const user = useContext(UserContext)

	const [years, months, days] = getArraysOfDates(year, month)
	let isDayDisabled = year === 0 || month === 0

	//Methods
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
		fName
			? setFNameError('')
			: setFNameError('You need to provide your first name')
		sName
			? setSNameError('')
			: setSNameError('You need to provide your second name')
		gender ? setGenderError('') : setGenderError('You need to select gender')
		!year || !month || !day
			? setDateOfBirthError('Please provide your date of birth')
			: setDateOfBirthError('')
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

		//Check wherer or not user picked a profile picture
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

		userRef.set({
			dateOfBirth: { year, month, day },
			firstName: fName,
			secondName: sName,
			avatar: avatarURL,
			gender
		})
	}

	const onFileSelect = () => {
		if (!fileInputRef.current?.files?.length) return null
		const reader = new FileReader()
		reader.onload = e => setAvatar(reader.result as string)

		fileInputRef.current?.files &&
			reader.readAsDataURL(fileInputRef.current.files[0])
	}
	const onGenderClick = (isMale: boolean) =>
		isMale ? setGender('male') : setGender('female')

	return (
		<>
			<div className={styles.background}></div>
			<div className={styles.container}>
				<h1 className={styles.title}>
					Complete
					<br />
					Information
				</h1>
				<form onSubmit={onFormSubmit}>
					<div className={styles.fields}>
						<input
							onChange={e => setFName(e.target.value)}
							value={fName}
							placeholder="First name"
							type="text"
						/>
						{fNameError && <div className={styles.error}>{fNameError}</div>}
						<input
							onChange={e => setSName(e.target.value)}
							value={sName}
							placeholder="Second name"
							type="text"
						/>
						{sNameError && <div className={styles.error}>{sNameError}</div>}
					</div>
					<div className={styles.gender}>
						<p>You are:</p>
						<div className={styles.genderDiv}>
							<button
								onClick={() => onGenderClick(true)}
								className={gender === 'male' ? styles.active : ''}
								type="button"
							>
								Male
							</button>
							<button
								type="button"
								onClick={() => onGenderClick(false)}
								className={gender === 'female' ? styles.active : ''}
							>
								Female
							</button>
						</div>
						{genderError && <div className={styles.error}>{genderError}</div>}
					</div>
					<div className={styles.dateOfBirth}>
						<p>Date of Birth:</p>
						<div className={styles.div}>
							<select
								value={year}
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

							<select
								value={month}
								onChange={e => setMonth(parseInt(e.target.value))}
							>
								<option key="def" value={0} disabled hidden>
									Month
								</option>
								{months.map(v => (
									<option key={v} value={v}>
										{v}
									</option>
								))}
							</select>

							<select
								disabled={isDayDisabled}
								value={day}
								onChange={e => setDay(parseInt(e.target.value))}
							>
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
						{dateOfBirthError && (
							<div className={styles.error}>{dateOfBirthError}</div>
						)}
					</div>
					<div className={styles.avatarSelect}>
						<div
							className="avatar"
							style={{ backgroundImage: `url(${avatar})` }}
						/>
						<label htmlFor="fileInput">
							<p>Select Profile image</p>
							<input
								accept=".png,.jpg"
								onChange={onFileSelect}
								ref={fileInputRef}
								id="fileInput"
								type="file"
							/>
						</label>
					</div>
					<button type="submit" className={`btnPrimary ${styles.btn}`}>
						Continue
					</button>
				</form>
			</div>
		</>
	)
}

export {}
export default PostSignUp
