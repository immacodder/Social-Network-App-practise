import React from 'react'

export const Spinner: React.FC<{ text?: string; align?: 'start' | 'center' | 'end' }> = p => (
	<div>
		<div
			className={`flex w-full h-screen justify-center items-${p.align || 'center'} ${
				p.align === 'start' ? 'mt-8' : ''
			} pb-48 sm:pb-32`}
		>
			<div className={`px-8 py-6 bg-white rounded-lg shadow-lg flex items-center`}>
				<div className="spinner mr-4" />
				<p className="text-xl">{p.text || 'Loading...'}</p>
			</div>
		</div>
	</div>
)
