import React from 'react'
import styles from './styles/SignUp.module.css'
import SignInWithProvider from './SignInWithProviderButton'

const SignIn: React.FC = () => {
	return (
		<div className={styles.background}>
			<div className={styles.container}>
				<h1 className={styles.title}>Sign In</h1>
				<div className={styles.fields}>
					<input placeholder="Email" type="email" />
					<input placeholder="Password" type="password" />
				</div>
				<button className={`btnPrimary ${styles.btn}`}>Continue</button>
				<div className={styles.or}>
					<hr />
					<p>OR</p>
					<hr />
				</div>
				<SignInWithProvider isSignIn={true} type="google" />
				<SignInWithProvider isSignIn={true} type="facebook" />
			</div>
		</div>
	)
}
export {}

export default SignIn
