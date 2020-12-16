import React from 'react'
import styles from './styles/SignInWithProvider.module.css'
import google from './icons/google.svg'
import facebook from './icons/facebook.svg'

export interface Props {
	type: 'google' | 'facebook'
	isSignIn: boolean
}

const SignInWithProvider: React.FC<Props> = ({ type, isSignIn }) => {
	let buttonFilling = null
	if (type === 'google') {
		buttonFilling = (
			<>
				<img src={google} />
				<p>Sign {isSignIn ? 'in' : 'up'} with Google</p>
			</>
		)
	} else if (type === 'facebook') {
		buttonFilling = (
			<>
				<img src={facebook} />
				<p>Sign {isSignIn ? 'in' : 'up'} with Facebook</p>
			</>
		)
	}
	return <button className={styles.provider}>{buttonFilling}</button>
}

export default SignInWithProvider
