import React from 'react'
import s from './styles/ContextMenu.module.css'

export interface contextItem {
	name: string
	icon: string
	isDanger: boolean
}

interface Props {
	items: contextItem[]
	background?: string
	onItemClick(itemName: string): void
}

const ContextMenu: React.FC<Props> = ({ items, onItemClick, background }) => {
	if (!background) background = 'white'

	return (
		<div style={{ backgroundColor: background }} className={s.container}>
			{items.map((item, i) => (
				<React.Fragment key={item.name}>
					<div
						style={items.length - 1 === i ? { margin: 0 } : {}}
						className={s.item}
						onClick={() => onItemClick(item.name)}
					>
						<i className={`material-icons ${item.isDanger ? 'text-red-400' : ''}`}>{item.icon}</i>
						<p className={item.isDanger ? 'text-red-400' : ''}>{item.name}</p>
					</div>
					{items.length === 1 || items.length - 1 === i ? null : <hr className={s.hr} />}
				</React.Fragment>
			))}
		</div>
	)
}

export default ContextMenu
