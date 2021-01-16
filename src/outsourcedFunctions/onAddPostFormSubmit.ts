import { postType, userType } from '../types'
import { imageObj } from '../components/CustomizableAreaForm'
import firebase from 'firebase'
import { userState } from '../contexts/UserContext'
import { v4 as uuid } from 'uuid'
import { getKeywords } from '.'

const db = firebase.firestore()
const rootRef = firebase.storage().ref()

export const onAddPostFormSubmit = async (
	imageURLs: imageObj[],
	areaText: string,
	userData: userState,
	historyObj: any
) => {
	if (!userData) return
	let links: string[] = []
	// returning a promise to make sure that i get all the link pushed to the array
	const putLinksInArr = new Promise<string>((resolve, reject) =>
		imageURLs.length
			? imageURLs.forEach(async ({ extension, value }, i) => {
					const ref = rootRef.child(`postImages/${uuid()}.${extension}`)
					await ref.putString(value, 'data_url')
					const link = await ref.getDownloadURL()
					if (!link) reject('')
					links.push(link)
					if (i === imageURLs.length - 1) resolve('Successful!')
			  })
			: resolve('No images')
	)
	// Get user's data
	const { avatar, firstName, secondName } = userData.user
	try {
		await putLinksInArr
	} catch {
		throw new Error("Can't get links")
	}
	const post: postType = {
		authorUID: userData.uid,
		authorImage: avatar,
		firstName,
		secondName,
		comments: [],
		createdAt: new Date().getTime(),
		dislikedBy: [],
		likedBy: [],
		imagesLinks: links,
		text: areaText,
		searchTerms: getKeywords(areaText)
	}
	console.log(post)
	try {
		await db.collection(`posts`).add(post)
	} catch (e) {
		throw new Error(e)
	}
	historyObj.push('/')
}
