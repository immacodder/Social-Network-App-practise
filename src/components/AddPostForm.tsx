import React, { useContext, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-autosize-textarea/lib'
import styles from './styles/addPostForm.module.css'
import addImageSVG from './icons/addPhoto.svg'
import PromiseFileReader from 'promise-file-reader'
import { v4 as uuid } from 'uuid'
import closeSVG from './icons/close.svg'
import imageCompression from 'browser-image-compression'
import firebase from '../firebase'
import { postType } from '../types'
import { UserContext } from '../contexts/UserContext'

const db = firebase.firestore()
const rootRef = firebase.storage().ref()

const AddPostForm: React.FC = () => {
	type imageObj = {
		uid: string
		value: string
		isActive: boolean
		extension: string
	}

	const [areaText, setAreaText] = useState('')
	const [count, setCount] = useState(0)
	const fileRef = useRef<HTMLInputElement>(null)
	const [imageURLs, setImageURLs] = useState<imageObj[]>([])
	const user = useContext(UserContext)
	useEffect(() => setCount(areaText.length), [areaText])

	const onAddImageChange = async () => {
		if (!fileRef.current?.files?.length) return null
		const tempArr: imageObj[] = []
		for (let i = 0; i < fileRef.current.files.length; i++) {
			const file = fileRef.current.files[i]
			const extension = file.name.split('.').pop()!
			const image = await imageCompression(file, {
				maxSizeMB: 1,
				maxWidthOrHeight: 1920
			})
			const urlImage = await PromiseFileReader.readAsDataURL(image)
			if (imageURLs.filter(img => img.value === urlImage).length) return
			tempArr.push({
				uid: uuid(),
				value: urlImage,
				isActive: false,
				extension: extension
			})
		}
		fileRef.current.value = ''
		setImageURLs(prev => [...prev, ...tempArr])
	}

	const getActive = (uid: string) => imageURLs.filter(obj => obj.uid === uid)[0]
	const onImageClick = (uid: string) => {
		setImageURLs(i => [
			...i.map(img =>
				img.uid === uid
					? {
							isActive: !img.isActive,
							uid,
							value: img.value,
							extension: img.extension
					  }
					: img
			)
		])
	}

	const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!user) return
		let links: string[] = []
		// returning a promise to make sure that i get all the link pushed to the array
		const putLinksInArr = new Promise<string>((resolve, reject) =>
			imageURLs.forEach(async ({ extension, value }, i) => {
				const ref = rootRef.child(`postImages/${uuid()}.${extension}`)
				await ref.putString(value, 'data_url')
				const link = await ref.getDownloadURL()
				if (!link) reject('')
				links.push(link)
				if (i === imageURLs.length - 1) resolve('Successful!')
			})
		)
		try {
			await putLinksInArr
		} catch {
			throw new Error("Can't get links")
		}
		const post: postType = {
			authorUID: user.uid,
			comments: [],
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			dislikedBy: [],
			likedBy: [],
			text: areaText,
			imagesLinks: links
		}
		try {
			const response = await db.collection(`posts`).add(post)
			response.get().then(data => console.log(data.id))
		} catch (e) {
			throw new Error(e)
		}
	}

	const renderImages = () => {
		const getHalfArray = (arr: imageObj[]) => {
			const remainder = arr.length % 2
			const firstArr = arr.slice(0, (arr.length + remainder) / 2)
			const secondArr = arr.slice((arr.length + remainder) / 2)
			return [firstArr, secondArr]
		}

		const render = (arr: imageObj[]) => {
			return arr.map(({ uid, value }) => {
				const isActive = getActive(uid).isActive
				return (
					<div key={uid} className={styles.imageContainer}>
						<img
							onClick={() => onImageClick(uid)}
							className={`${styles.image} ${isActive && styles.active}`}
							src={value}
						/>
						{isActive && (
							<>
								<div className={styles.backdrop} />
								<img
									onClick={() =>
										setImageURLs(prev => prev.filter(img => img.uid !== uid))
									}
									className={styles.close}
									src={closeSVG}
								/>
							</>
						)}
					</div>
				)
			})
		}

		if (imageURLs.length >= 2) {
			const [firstArr, secondArr] = getHalfArray(imageURLs)
			return (
				<div className={styles.columnsContainer}>
					<div className={styles.twoColumnImageContainer}>
						{render(firstArr)}
					</div>
					<div className={styles.twoColumnImageContainer}>
						{render(secondArr)}
					</div>
				</div>
			)
		}

		return <div className={styles.imagesContainer}>{render(imageURLs)}</div>
	}

	return (
		<form onSubmit={onFormSubmit}>
			<div className={styles.container}>
				<TextareaAutosize
					className={styles.textArea}
					placeholder="Describe your thoughts"
					value={areaText}
					maxLength={5000}
					onChange={e => setAreaText(e.currentTarget.value)}
				/>
				{renderImages()}
				<hr className={styles.hr} />
				<div className={styles.bottomOfForm}>
					<label htmlFor="inp" className={styles.addImage}>
						<img alt="" src={addImageSVG} />
						Add Image
						<input
							onChange={onAddImageChange}
							ref={fileRef}
							multiple
							hidden
							accept=".png,.jpg"
							type="file"
							id="inp"
						/>
					</label>
					<p>{`${count} / 5000`}</p>
				</div>
			</div>
			<div className={styles.buttons}>
				<button className="btnPrimary">Add</button>
				<button className="btnSecondary">Discard</button>
			</div>
		</form>
	)
}

export default AddPostForm
