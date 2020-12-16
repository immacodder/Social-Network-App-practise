import React, { useRef, useState } from 'react'
import styles from './styles/PostSignUp.module.css'
import _ from 'lodash'

const now = new Date()

const getDaysInMonth = (year: number, month: number) =>
	new Date(year, month, 0).getDate()

const getArraysOfDates = (year: number, month: number) => [
	_.range(1950, now.getFullYear() - 8),
	_.range(1, 13),
	_.range(1, getDaysInMonth(year, month))
]

const PostSignUp: React.FC = () => {
	const [year, setYear] = useState(0)
	const [month, setMonth] = useState(0)
	const [day, setDay] = useState(0)
	const [fName, setFName] = useState('')
	const [sName, setSName] = useState('')
	const [avatar, setAvatar] = useState('')
	const [gender, setGender] = useState<'male' | 'female' | ''>('')
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [years, months, days] = getArraysOfDates(year, month)
	let isDayDisabled = year === 0 || month === 0

	let isSubmitDisabled: boolean
	if (!month || !day || !year || !fName.trim() || !sName.trim())
		isSubmitDisabled = true
	else isSubmitDisabled = false

	//Methods
	const onFileSelect = () => {
		const reader = new FileReader()
		reader.onload = e => {
			console.log(reader.result)
			setAvatar(reader.result as string)
		}
		fileInputRef.current?.files &&
			reader.readAsDataURL(fileInputRef.current.files[0])
	}
	const onGenderClick = (isMale: boolean) =>
		isMale ? setGender('male') : setGender('female')

	console.log(gender)
	return (
		<div className={styles.background}>
			<div className={styles.container}>
				<h1 className={styles.title}>
					Complete
					<br />
					Information
				</h1>
				<form
					onSubmit={e => {
						e.preventDefault()
						console.log(fName, sName, year, month, day)
					}}
				>
					<div className={styles.fields}>
						<input
							onChange={e => setFName(e.target.value)}
							value={fName}
							placeholder="First name"
							type="text"
							required
						/>
						<input
							onChange={e => setSName(e.target.value)}
							value={sName}
							placeholder="Second name"
							type="text"
							required
						/>
					</div>
					<div className={styles.gender}>
						<p>You are:</p>
						<div>
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
					</div>
					<div className={styles.dateOfBirth}>
						<p>Date of Birth:</p>
						<div>
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
					</div>
					<div className={styles.avatarSelect}>
						<div
							className="avatar"
							style={{ backgroundImage: `url(${avatar})` }}
						/>
						<label htmlFor="fileInput">
							<p>Select Avatar</p>
							<input
								onChange={onFileSelect}
								ref={fileInputRef}
								id="fileInput"
								type="file"
							/>
						</label>
					</div>
					<button
						disabled={isSubmitDisabled}
						type="submit"
						className={`btnPrimary ${styles.btn}`}
					>
						Continue
					</button>
				</form>
			</div>
		</div>
	)
}
export {}

export default PostSignUp
