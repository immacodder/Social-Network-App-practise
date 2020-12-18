import React, { useEffect, useState } from 'react'
import styles from './styles/SignUp.module.css'
import SignInWithProvider from './SignInWithProviderButton'
import { Link, useHistory } from 'react-router-dom'
import { validate } from './sharedFunctions/validate'
import firebase from '../firebase'

let disabled: boolean

const SignIn: React.FC = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [errorMsg, setErrorMsg] = useState('')
	const history = useHistory()

	useEffect(() => {
		const [emailError, passwordError] = validate({ email, password })
		setEmailError(emailError)
		setPasswordError(passwordError)
	}, [password, email])

	if (!password || !email || passwordError || emailError) disabled = true
	else disabled = false

	const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(userCred => {
				console.log(userCred.user?.displayName)
				history.push('/')
			})
			.catch(error => {
				setErrorMsg('Please, try again!')
				setTimeout(() => setErrorMsg(''), 1500)
			})
	}

	return (
		<>
			<div className={styles.background} />
			{errorMsg && <div className={styles.wrongCreds}>{errorMsg}</div>}
			<form onSubmit={onFormSubmit} className={styles.container}>
				<h1 className={styles.title}>Sign In</h1>
				<div className={styles.fields}>
					<input
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder="Email"
						type="email"
					/>
					{emailError && <div className={styles.error}>{emailError}</div>}
					<input
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder="Password"
						type="password"
					/>
					{passwordError && <div className={styles.error}>{passwordError}</div>}
				</div>
				<button
					disabled={disabled}
					type="submit"
					className={`btnPrimary ${styles.btn}`}
				>
					Continue
				</button>
				<div className={styles.or}>
					<hr />
					<p>OR</p>
					<hr />
				</div>
				<SignInWithProvider isSignIn={true} type="google" />
				<SignInWithProvider isSignIn={true} type="facebook" />
				<Link to="/signup">Sign Up instead</Link>
			</form>
		</>
	)
}
export {}

export default SignIn
