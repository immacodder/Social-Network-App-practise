import React from 'react'
import ReactDOM from 'react-dom'
import PostSignUp from './components/PostSignUp'
import SignIn from './components/SignIn'

const App: React.FC = () => {
	return <PostSignUp />
}

ReactDOM.render(<App />, document.querySelector('#root'))
