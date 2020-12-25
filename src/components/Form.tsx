import React from 'react'
import { Link } from 'react-router-dom'
import SignInWithProvider from './SignInWithProviderButton'
import styles from './styles/Form.module.css'

type setStr = (arg: string) => void
type event = React.FormEvent<HTMLFormElement>

interface signIn {
	onSignIn(e: event): void
	setEmail: setStr
	setPassword: setStr

	isSignUp: false
	disabled: boolean

	email: string
	password: string

	emailError: string
	passwordError: string
	errorMsg: string
}

interface signUp {
	onSignUp(e: event): void
	setEmail: setStr
	setPassword: setStr
	setPasswordRepeat: setStr

	isSignUp: true
	disabled: boolean

	email: string
	password: string
	passwordRepeat: string

	emailError: string
	passwordError: string
	passwordRepeatError: string
}

export const Form: React.FC<signIn | signUp> = p => (
	<>
		<div className={styles.background}></div>
		{!p.isSignUp && p.errorMsg && (
			<div className={styles.wrongCreds}>{p.errorMsg}</div>
		)}
		<form
			onSubmit={p.isSignUp ? p.onSignUp : p.onSignIn}
			className={styles.container}
		>
			<h1 className={styles.title}>Sign Up</h1>
			<div className={styles.fields}>
				<input
					value={p.email}
					onChange={e => p.setEmail(e.target.value)}
					placeholder="Email"
					type="email"
				/>
				{p.emailError && <div className={styles.error}>{p.emailError}</div>}
				<input
					value={p.password}
					onChange={e => p.setPassword(e.target.value)}
					placeholder="Password"
					type="password"
				/>
				{p.passwordError && (
					<div className={styles.error}>{p.passwordError}</div>
				)}
				{p.isSignUp && (
					<input
						value={p.passwordRepeat}
						onChange={e => p.setPasswordRepeat(e.target.value)}
						placeholder="Password confirmation"
						type="password"
					/>
				)}
				{p.isSignUp && p.passwordRepeatError && (
					<div className={styles.error}>{p.passwordRepeatError}</div>
				)}
			</div>
			<button
				disabled={p.disabled}
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
			<SignInWithProvider isSignIn={p.isSignUp ? true : false} type="google" />
			<SignInWithProvider
				isSignIn={p.isSignUp ? true : false}
				type="facebook"
			/>
			{p.isSignUp ? (
				<Link to="/signin">Sign In instead</Link>
			) : (
				<Link to="/signup">Sign Up instead</Link>
			)}
		</form>
	</>
)
