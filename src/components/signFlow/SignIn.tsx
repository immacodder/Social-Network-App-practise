import React, { useContext, useEffect, useState } from 'react'
import styles from './styles/SignUp.module.css'
import SignInWithProvider from './SignInWithProviderButton'
import { Link, useHistory } from 'react-router-dom'
import { validate } from '../../sharedFunctions/validate'
import firebase from '../../firebase'
import { Form } from './Form'
import { UserContext } from '../../contexts/UserContext'

let disabled: boolean

const SignIn: React.FC = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [errorMsg, setErrorMsg] = useState('')
	const history = useHistory()
	const userObj = useContext(UserContext)

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
			.then(userCred => history.push('/'))
			.catch(error => {
				setErrorMsg('Please, try again!')
				console.log(error)
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
