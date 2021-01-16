import React from 'react'
import { imageObj } from './CustomizableAreaForm'

type imageViewOnly = { uid: string; value: string }

interface ViewAndEdit {
	isViewOnly: false
	imageURLs: imageObj[]
	onImageClick(uid: string): void
	onCloseClick(uid: string): void
}
interface ViewOnly {
	isViewOnly: true
	imageURLs: imageViewOnly[]
}

export const RenderImages: React.FC<ViewAndEdit | ViewOnly> = p => {
	const renderBase = (
		children: JSX.Element | null,
		uid: string,
		value: string
	) => (
		<div
			className={`relative ${
				p.imageURLs.length === 1 ? 'w-full' : 'w-1/2 h-32 md:h-52'
			}`}
			key={uid}
		>
			<img
				className="object-cover w-full h-full"
				draggable={false}
				onClick={() => !p.isViewOnly && p.onImageClick(uid)}
				src={value}
			/>
			{children}
		</div>
	)

	// p.imageURLs.filter(obj => obj.uid === uid)[0].isActive
	const renderSelectable = (arr: imageObj[]) => {
		if (p.isViewOnly) return null

		return arr.map(({ value, uid, isActive }) => {
			const jsxBlob =
				!p.isViewOnly && isActive ? (
					<>
						<div
							className="absolute top-0 pointer-events-none w-full h-full"
							style={{ background: 'rgba(0,0,0,.6)' }}
						/>
						<img />
						<i
							onClick={() => p.onCloseClick(uid)}
							className="material-icons line select-none text-red-400 absolute right-1 top-1 text-3xl md:text-4xl leading-none"
						>
							close
						</i>
					</>
				) : null
			return renderBase(jsxBlob, uid, value)
		})
	}

	return (
		<div
			className={`flex ${
				!p.isViewOnly ? 'border-t' : null
			} border-gray-700 flex-wrap`}
		>
			{p.isViewOnly
				? p.imageURLs.map(({ uid, value }) => renderBase(null, uid, value))
				: renderSelectable(p.imageURLs)}
		</div>
	)
}
