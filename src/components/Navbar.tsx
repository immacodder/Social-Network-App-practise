import React from 'react'
import { Link } from 'react-router-dom'
import s from './styles/Navbar.module.css'
import add_circleI from './icons/add_circle.svg'
import account_boxI from './icons/account_box.svg'
import homeI from './icons/home.svg'
import friendsI from './icons/friends.svg'

const Navbar: React.FC<{
	active: 'home' | 'user' | 'friends' | 'addpost'
}> = ({ active }) => {
	return (
		<div className={s.container}>
			<Link to="/addpost">
				<img
					className={active === 'addpost' ? s.filterToPrimary : ''}
					src={add_circleI}
					alt=""
				/>
			</Link>
			<Link to="/friends">
				<img
					className={active === 'friends' ? s.filterToPrimary : ''}
					src={friendsI}
					alt=""
				/>
			</Link>
			<Link to="/user">
				<img
					className={active === 'user' ? s.filterToPrimary : ''}
					src={account_boxI}
					alt=""
				/>
			</Link>
			<Link className={s.home} to="/">
				<img
					className={active === 'home' ? s.filterToPrimary : ''}
					src={homeI}
					alt=""
				/>
			</Link>
		</div>
	)
}

export default Navbar
