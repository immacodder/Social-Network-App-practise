import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { UserProvider } from './contexts/UserContext'
import PostSignUp from './components/PostSignUp'
import AddPostForm from './components/AddPostForm'

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<UserProvider>
				<Switch>
					<Route path="/signin">
						<SignIn />
					</Route>
					<Route path="/signup">
						<SignUp />
					</Route>
					<Route path="/postsignup">
						<PostSignUp />
					</Route>
					<Route path="/">
						<AddPostForm />
					</Route>
				</Switch>
			</UserProvider>
		</BrowserRouter>
	)
}

ReactDOM.render(<App />, document.querySelector('#root'))
