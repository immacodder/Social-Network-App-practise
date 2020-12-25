import React, { useEffect, useState } from 'react'
import styles from './styles/SignUp.module.css'
import SignInWithProvider from './SignInWithProviderButton'
import { Link, useHistory } from 'react-router-dom'
import { validate } from './sharedFunctions/validate'
import firebase from '../firebase'
import { Form } from './Form'

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

	const onSignIn = (event: React.FormEvent<HTMLFormElement>) => {
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
		<Form
			errorMsg={errorMsg}
			isSignUp={false}
			disabled={disabled}
			email={email}
			emailError={emailError}
			onSignIn={onSignIn}
			password={password}
			passwordError={passwordError}
			setEmail={setEmail}
			setPassword={setPassword}
		/>
	)
}
export {}

export default SignIn
