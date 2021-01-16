import React from 'react'
import google from '../../icons/google.svg'
import facebook from '../../icons/facebook.svg'

export interface Props {
	type: 'google' | 'facebook'
	isSignIn: boolean
}

const SignInWithProvider: React.FC<Props> = ({ type, isSignIn }) => {
	let src
	if (type === 'google') src = google
	if (type === 'facebook') src = facebook

	return (
		<button
			type="button"
			className="flex items-center md:justify-center w-full h-12 rounded-md bg-gray-100 border mb-4 border-blue-800"
		>
			<>
				<img className="w-10 mx-4" src={src} />
				<p className="md:pr-10">
					Sign {isSignIn ? 'in' : 'up'} with <span className="capitalize">{type}</span>
				</p>
			</>
		</button>
	)
}

export default SignInWithProvider
