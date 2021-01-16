import React, { useContext, useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Redirect, Route, Switch, useHistory } from 'react-router-dom'
import SignIn from './components/signFlow/SignIn'
import SignUp from './components/signFlow/SignUp'
import { UserContext, UserProvider } from './contexts/UserContext'
import PostSignUp from './components/signFlow/PostSignUp'
import CustomizableAreaForm, { imageObj } from './components/CustomizableAreaForm'
import { SelfUserPage } from './components/user/SelfUserPage'
import './index.css'
import MainPage from './components/MainPage'
import { onAddPostFormSubmit } from './outsourcedFunctions/onAddPostFormSubmit'
import { Navbar } from './components/Navbar'
import { Spinner } from './components/Spinner'
import { Search } from './components/Search'
import { ExternalUserPage } from './components/user/ExternalUserPage'
import { Friends } from './components/user/Friends'

export type customizableAreaFormSubmit = (imageURLs: imageObj[], areaText: string) => void

const App: React.FC = () => {
	const userData = useContext(UserContext)
	const history = useHistory()

	const onAddPostSubmit: customizableAreaFormSubmit = (imageURLs, areaText) =>
		onAddPostFormSubmit(imageURLs, areaText, userData, history)

	return (
		<Switch>
			<Route path={'/self/user'}>
				<Navbar>
					<SelfUserPage />
				</Navbar>
			</Route>
			<Route path={'/user/:uid'}>
				<Navbar>
					<ExternalUserPage />
				</Navbar>
			</Route>
			<Route path="/search/:defTerm">
				<Navbar>
					<Search />
				</Navbar>
			</Route>
			<Route path="/friends">
				<Navbar>
					<Friends />
				</Navbar>
			</Route>
			<Route path="/signin">
				<SignIn />
			</Route>
			<Route path="/signup">
				<SignUp />
			</Route>
			<Route path="/postsignup">
				<PostSignUp />
			</Route>
			<Route path="/addpost">
				<Navbar>
					<CustomizableAreaForm
						discardButtonPushUrl="/"
						isMultipleSelect={true}
						areaHeight={200}
						areaLength={3000}
						onSubmit={onAddPostSubmit}
					/>
				</Navbar>
			</Route>
			<Route path="/">
				<Navbar>
					<MainPage />
				</Navbar>
			</Route>
		</Switch>
	)
}

ReactDOM.render(
	<BrowserRouter>
		<UserProvider>
			<App />
		</UserProvider>
	</BrowserRouter>,
	document.querySelector('#root')
)
