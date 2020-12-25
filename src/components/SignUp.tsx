import React, { useEffect, useState } from 'react'
import styles from './styles/SignUp.module.css'
import SignInWithProvider from './SignInWithProviderButton'
import { Link, useHistory } from 'react-router-dom'
import firebase from '../firebase'
import { validate } from './sharedFunctions/validate'
import { Form } from './Form'

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
		<Form
			isSignUp={true}
			onSignUp={onSignUp}
			disabled={disabled}
			email={email}
			emailError={emailError}
			password={password}
			passwordError={passwordError}
			passwordRepeat={passwordRepeat}
			passwordRepeatError={passwordRepeatError}
			setEmail={setEmail}
			setPassword={setPassword}
			setPasswordRepeat={setPasswordRepeat}
		/>
	)
}

export {}
export default SignUp
