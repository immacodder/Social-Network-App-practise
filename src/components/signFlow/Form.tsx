import React from 'react'
import { Link } from 'react-router-dom'
import SignInWithProvider from './SignInWithProviderButton'

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
		{!p.isSignUp && p.errorMsg && <div>{p.errorMsg}</div>}
		<form
			className="text-center md:max-w-md mt-12 w-10/12 mx-auto md:mt-36"
			onSubmit={p.isSignUp ? p.onSignUp : p.onSignIn}
		>
			<h1 className="text-2xl mb-8 font-bold">{p.isSignUp ? 'Sign Up' : 'Sign In'}</h1>
			<div>
				<input value={p.email} onChange={e => p.setEmail(e.target.value)} placeholder="Email" type="email" />
				{p.emailError && <div className="error">{p.emailError}</div>}
				<input
					value={p.password}
					onChange={e => p.setPassword(e.target.value)}
					placeholder="Password"
					type="password"
				/>
				{p.passwordError && <div className="error">{p.passwordError}</div>}
				{p.isSignUp && (
					<input
						value={p.passwordRepeat}
						onChange={e => p.setPasswordRepeat(e.target.value)}
						placeholder="Password confirmation"
						type="password"
					/>
				)}
				{p.isSignUp && p.passwordRepeatError && <div className="error">{p.passwordRepeatError}</div>}
			</div>
			<button
				className="w-full bg-primary rounded-md h-12 focus:outline-none focus:ring ring-blue-300 disabled:opacity-50"
				disabled={p.disabled}
				type="submit"
			>
				Continue
			</button>
			<div className="flex items-center my-4">
				<hr className="w-full border-black" />
				<p className="mx-2">OR</p>
				<hr className="w-full border-black" />
			</div>
			<SignInWithProvider isSignIn={p.isSignUp ? true : false} type="google" />
			<SignInWithProvider isSignIn={p.isSignUp ? true : false} type="facebook" />
			{p.isSignUp ? <Link to="/signin">Sign In instead</Link> : <Link to="/signup">Sign Up instead</Link>}
		</form>
	</>
)
