import React from 'react'
import s from './styles/ContextMenu.module.css'

export interface contextItem {
	name: string
	iconPath: string
	isDanger: boolean
}

interface Props {
	items: contextItem[]
	background?: string
	onItemClick(itemName: string): void
}

const ContextMenu: React.FC<Props> = ({ items, background, onItemClick }) => {
	if (!background) background = '#424242'

	return (
		<div style={{ backgroundColor: background }} className={s.container}>
			{items.map((item, i) => (
				<React.Fragment key={item.name}>
					<div
						style={items.length - 1 === i ? { margin: 0 } : {}}
						className={s.item}
						onClick={() => onItemClick(item.name)}
					>
						<img
							src={item.iconPath}
							className={item.isDanger ? s.danger : ''}
							alt=""
						/>
						<p style={item.isDanger ? { color: '#DE483E' } : {}}>{item.name}</p>
					</div>
					{items.length === 1 || items.length - 1 === i ? null : (
						<hr className={s.hr} />
					)}
				</React.Fragment>
			))}
		</div>
	)
}

export default ContextMenu
