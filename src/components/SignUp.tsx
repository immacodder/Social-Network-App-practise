import React, { useEffect, useState } from 'react'
import styles from './styles/SignUp.module.css'
import SignInWithProvider from './SignInWithProviderButton'
import { Link, useHistory } from 'react-router-dom'
import firebase from '../firebase'
import { validate } from './sharedFunctions/validate'

let disabled: boolean

const SignUp: React.FC = () => {
	type pre = '' | 'Passwords must be the same'

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordRepeat, setPasswordRepeat] = useState('')
	const [emailError, setEmailError] = useState<string>('')
	const [passwordError, setPasswordError] = useState<string>('')
	const [passwordRepeatError, setPasswordRepeatError] = useState<pre>('')

	const history = useHistory()

	//validation
	useEffect(() => {
		if (password && passwordRepeat && password !== passwordRepeat)
			setPasswordRepeatError('Passwords must be the same')
		else setPasswordRepeatError('')
		const [emailError, passwordError] = validate({ email, password })
		setEmailError(emailError)
		setPasswordError(passwordError)
	}, [password, passwordRepeat, email])

	if (
		!password ||
		!passwordRepeat ||
		!email ||
		passwordError ||
		passwordRepeatError ||
		emailError
	)
		disabled = true
	else disabled = false

	//METHODS
	const onSignUp = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(user => history.push('/postsignup'))
	}

	return (
		<>
			<div className={styles.background}></div>

			<form onSubmit={onSignUp} className={styles.container}>
				<h1 className={styles.title}>Sign Up</h1>
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
					<input
						value={passwordRepeat}
						onChange={e => setPasswordRepeat(e.target.value)}
						placeholder="Password confirmation"
						type="password"
					/>
					{passwordRepeatError && (
						<div className={styles.error}>{passwordRepeatError}</div>
					)}
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
				<SignInWithProvider isSignIn={false} type="google" />
				<SignInWithProvider isSignIn={false} type="facebook" />
				<Link to="/signin">Sign In instead</Link>
			</form>
		</>
	)
}

export {}
export default SignUp
