import React, { useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-autosize-textarea/lib'
import PromiseFileReader from 'promise-file-reader'
import { v4 as uuid } from 'uuid'
import imageCompression from 'browser-image-compression'
import '../index.css'
import { RenderImages } from './RenderImages'
import { customizableAreaFormSubmit } from '..'
import { useHistory } from 'react-router-dom'

export type imageObj = {
	uid: string
	value: string
	isActive: boolean
	extension: string
	default?: true
}

interface Props {
	onSubmit: customizableAreaFormSubmit
	areaLength: number
	areaHeight: number
	addImageLabel?: string
	placeholder?: string
	defaultValue?: string
	defaultPictureUrl?: string
	isMultipleSelect: boolean
	discardButtonPushUrl: string
	maxImageMbSize?: number
	maxWidthOrHeight?: number
}

const CustomizableAreaForm: React.FC<Props> = p => {
	const [areaText, setAreaText] = useState(p.defaultValue || '')
	const [count, setCount] = useState(0)
	const fileRef = useRef<HTMLInputElement>(null)
	const [imageURLs, setImageURLs] = useState<imageObj[]>(
		p.defaultPictureUrl
			? [{ extension: '.jpg', isActive: false, uid: uuid(), value: p.defaultPictureUrl, default: true }]
			: []
	)
	const { push } = useHistory()
	useEffect(() => setCount(areaText.length), [areaText])

	const onCloseClick = (uid: string) => setImageURLs(prev => prev.filter(img => img.uid !== uid))

	const onAddImageChange = async () => {
		if (!fileRef.current?.files?.length) return null
		const tempArr: imageObj[] = []
		for (let i = 0; i < fileRef.current.files.length; i++) {
			const file = fileRef.current.files[i]
			const extension = file.name.split('.').pop()!
			const image = await imageCompression(file, {
				maxSizeMB: p.maxImageMbSize || 1,
				maxWidthOrHeight: p.maxWidthOrHeight || 1920
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
		if (p.isMultipleSelect) setImageURLs(prev => [...prev, ...tempArr])
		else setImageURLs(tempArr)
	}

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

	return (
		<form
			className="mx-4 mt-5 max-w-screen-sm md:mx-auto"
			onSubmit={e => {
				e.preventDefault()
				p.onSubmit(imageURLs, areaText)
			}}
		>
			<div className="rounded-xl border border-gray-800 focus-within:ring ring-primary focus-within:border-opacity-0">
				<TextareaAutosize
					className="w-full bg-transparent border-0 rounded-xl focus:outline-none p-3"
					style={{ minHeight: `${p.areaHeight}px` }}
					placeholder={p.placeholder || 'Describe your thoughts'}
					value={areaText}
					maxLength={p.areaLength}
					onChange={e => setAreaText(e.currentTarget.value)}
				/>
				<RenderImages
					isViewOnly={!p.isMultipleSelect}
					imageURLs={imageURLs}
					onCloseClick={onCloseClick}
					onImageClick={onImageClick}
				/>
				<hr />
				<div className="flex my-1 mx-1 items-center justify-between">
					<label className="flex items-center" htmlFor="inp">
						<i className="material-icons text-primary">add_photo_alternate</i>
						{p?.addImageLabel || 'Add Image'}
						<input
							className="hidden"
							onChange={onAddImageChange}
							ref={fileRef}
							multiple={p.isMultipleSelect}
							accept=".png,.jpg"
							type="file"
							id="inp"
						/>
					</label>
					<p className="mx-1">{`${count} / ${p.areaLength}`}</p>
				</div>
			</div>
			<div className="flex space-x-4 mt-4">
				<button type="submit" className="btnPrimary">
					Add
				</button>
				<button onClick={() => push(p.discardButtonPushUrl)} type="button" className="btnSecondary">
					Discard
				</button>
			</div>
		</form>
	)
}

export default CustomizableAreaForm
