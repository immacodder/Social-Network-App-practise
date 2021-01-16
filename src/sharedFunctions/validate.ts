interface params {
	password: string
	email: string
}
type pe = '' | 'Password has to be at least 8 digits long'
type ee = '' | 'Invalid Email'
export const validate = ({ email, password }: params) => {
	let emailError: ee = ''
	let passwordError: pe = ''

	if (password && password.length < 8)
		passwordError = 'Password has to be at least 8 digits long'
	if (email && !email.includes('@')) emailError = 'Invalid Email'

	return [emailError, passwordError]
}
