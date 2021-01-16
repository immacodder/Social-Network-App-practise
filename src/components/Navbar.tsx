import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { debounce } from 'lodash'
import { userType } from '../types'

const links: { icon: string; name: string; linkTo: string }[] = [
	{ icon: 'home', name: 'Home', linkTo: '/' },
	{ icon: 'add_circle', name: 'Create post', linkTo: '/addpost' },
	{ icon: 'group', name: 'Friends', linkTo: '/friends' }
]

const breakPoint = 1023

export const Navbar: React.FC = p => {
	const { pathname } = useLocation()
	const [isMenuActive, setIsMenuActive] = useState(false)
	const [width, setWidth] = useState(window.innerWidth)
	const userData = useContext(UserContext)
	const { push } = useHistory()
	const searchInput = useRef<HTMLInputElement>(null)

	useEffect(() => {
		const setCurrentWidth = debounce(() => setWidth(window.innerWidth), 150)
		window.addEventListener('resize', setCurrentWidth)
		return () => window.removeEventListener('resize', setCurrentWidth)
	}, [])

	const renderLinks = links.map(({ icon, name, linkTo }) => (
		<Link key={name} to={linkTo} onClick={() => setIsMenuActive(false)} className="flex items-center my-1">
			<i className={`material-icons text-4xl leading-none ${linkTo === pathname ? 'text-primary' : ''}`}>{icon}</i>
			<p className="mx-2">{name}</p>
		</Link>
	))
	const renderSearchInput = (
		<form
			onSubmit={e => {
				e.preventDefault()
				setIsMenuActive(false)
				push(`/search/${searchInput.current?.value}`)
			}}
			className="relative bg-white focus:ring-2 ring-primary rounded-lg mb-4 mt-2 lg:m-0 lg:h-8 lg:self-center lg:mr-4 lg:w-64"
		>
			<input
				ref={searchInput}
				className="bg-transparent w-full h-10 lg:h-8 text-black m-0"
				placeholder="Search for anything"
			/>
			<button type="submit" className="absolute h-full top-0 right-0 bg-transparent outline-none">
				<span className="material-icons flex h-full items-center text-black mr-2">search</span>
			</button>
		</form>
	)

	if (userData === null) return null
	if (userData === false) return <Redirect to="/signin" />
	const { user } = userData

	const renderUser = (user: userType) => (
		<>
			<span className={`${width < breakPoint ? 'order-2' : 'order-1'} mx-2`}>
				{user.firstName} {user.secondName}
			</span>
			<img
				className={`object-cover object-center rounded-full ${width < breakPoint ? 'order-1' : 'order-2'}`}
				style={{ width: '36px', height: '36px' }}
				alt="user"
				src={user.avatar}
			/>
		</>
	)

	return (
		<>
			<div
				className="h-12 text-gray-200 fixed top-0 right-0 w-full"
				style={{ backgroundColor: '#131313', zIndex: 1000 }}
			>
				<div
					className="max-w-screen-xl xl:p-0 flex mx-auto h-full px-4 items-center justify-between"
					style={{ backgroundColor: '#131313' }}
				>
					<Link to="/" className="text-2xl sm:text-3xl mr-8">
						Brand
					</Link>
					{width > breakPoint && (
						<div className="flex w-full">
							{renderSearchInput}
							<div className="flex mr-auto">{renderLinks}</div>
							<Link to="/self/user" className="flex items-center">
								{renderUser(user)}
							</Link>
						</div>
					)}
					<i
						className="material-icons text-3xl ml-auto lg:hidden select-none"
						onClick={() => setIsMenuActive(!isMenuActive)}
					>
						menu
					</i>
				</div>

				{width < breakPoint && (
					<div className={`relative navbar-menu bg-black p-4 ${isMenuActive ? 'open' : ''}`} style={{ zIndex: -1 }}>
						{renderSearchInput}
						<Link to="/self/user" onClick={() => setIsMenuActive(false)} className="flex items-center">
							{renderUser(user)}
						</Link>
						{renderLinks}
					</div>
				)}
			</div>
			<div className="pt-12">{p.children}</div>
		</>
	)
}
