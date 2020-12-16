import React from 'react'
import styles from './styles/SignUp.module.css'
import SignInWithProvider from './SignInWithProviderButton'

const SignUp: React.FC = () => {
	return (
		<div className={styles.background}>
			<div className={styles.container}>
				<h1 className={styles.title}>Sign Up</h1>
				<div className={styles.fields}>
					<input placeholder="Email" type="email" />
					<input placeholder="Password" type="password" />
					<input placeholder="Password confirmation" type="password" />
				</div>
				<button className={`btnPrimary ${styles.btn}`}>Continue</button>
				<div className={styles.or}>
					<hr />
					<p>OR</p>
					<hr />
				</div>
				<SignInWithProvider isSignIn={false} type="google" />
				<SignInWithProvider isSignIn={false} type="facebook" />
			</div>
		</div>
	)
}
export {}

export default SignUp
