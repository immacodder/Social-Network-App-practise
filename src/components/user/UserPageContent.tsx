import format from 'date-fns/format'
import React from 'react'
import { userType } from '../../types'
import { postT } from '../MainPage'
import Post from '../Post'
import { Spinner } from '../Spinner'

interface selfUser {
	external: false
	user: userType
	userPosts: postT[]
	onCustomizeClick(): void
}
interface externalUser {
	external: true
	user: userType
	uid: string
	selfUser: userType
	userPosts: postT[]
	onAddFriendClick(): void
	onRemoveFriendClick(): void
}

type Props = selfUser | externalUser

const UserPageContent: React.FC<Props> = p => {
	const { year, month, day } = p.user.dateOfBirth
	return (
		<>
			<div className="relative w-full bg-white shadow-lg pb-48 sm:pb-36 text-center max-w-screen-lg lg:rounded-b-xl mx-auto">
				<div className="relative sm:px-4 sm:mx-auto max-w-screen-lg box-content">
					{p.user.coverImageUrl ? (
						<>
							<img
								className="object-cover object-center user-cover shadow-md rounded-b-xl"
								src={p.user.coverImageUrl}
							/>
							<div
								className="absolute top-0 h-full left-4 rounded-b-xl"
								style={{
									backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .2) 100%)',
									width: 'calc(100% - 2rem)'
								}}
							/>
						</>
					) : (
						<div
							className="shadow-md rounded-b-xl user-cover"
							style={{
								backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 0.25) 100%)'
							}}
						/>
					)}
				</div>
				<div className="absolute w-full left-0 right-0 bottom-4">
					<img src={p.user.avatar} className="shadow w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-2 profileImage" />
					<p className="text-lg">{p.user.firstName + ' ' + p.user.secondName}</p>
					<div className="flex align-middle justify-center">
						<i className="material-icons default text-primary">event</i>
						<p className="ml-1">{format(new Date(year, month, day), 'PPP')}</p>
					</div>
					<div className="flex justify-center">
						{p.external ? (
							<>
								<button className="btnPrimary user-btn">
									<i className="material-icons">chat</i>Message
								</button>
								{!p.selfUser.friends.includes(p.uid) ? (
									<button onClick={p.onAddFriendClick} className="btnPrimary user-btn">
										<i className="material-icons">{`person_add_alt_1`}</i>Add friend
									</button>
								) : (
									<button onClick={p.onRemoveFriendClick} className="btnPrimary user-btn">
										<i className="material-icons">person_remove</i>Delete friend
									</button>
								)}
							</>
						) : (
							<button onClick={p.onCustomizeClick} className="btnPrimary user-btn">
								<i className="material-icons mr-2 h-5 w-5 relative top-px">build</i> Customize
							</button>
						)}
					</div>
				</div>
			</div>
			{p.user.aboutMe && (
				<div className="px-4 text-center mt-4">
					<p className="text-lg mb-2">About Me</p>
					<div className="bg-white w-full p-4 rounded-2xl shadow-md sm:max-w-md sm:mx-auto">{p.user.aboutMe}</div>
				</div>
			)}
			{p.userPosts.map(({ post: p, postID }) => (
				<Post
					key={p.createdAt}
					pictures={p.imagesLinks}
					postId={postID}
					authorPicture={p.authorImage}
					createdAt={p.createdAt}
					dislikedBy={p.dislikedBy}
					firstName={p.firstName}
					likedBy={p.likedBy}
					secondName={p.secondName}
					text={p.text}
				/>
			))}
			{!p.userPosts.length && <Spinner text="Loading posts..." />}
		</>
	)
}

export default UserPageContent
