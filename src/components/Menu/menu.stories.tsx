import React from 'react';
import { action } from '@storybook/addon-actions';
import Menu, { MenuMode } from './menu';
import '../../styles/index.scss';
import SubMenu from './sub-menu';
import MenuItem from './menu-item';

export default {
	component: Menu,
	title: 'Menu'
};

export const horizontalMenu = () => {
	const menuProps = {
		defaultIndex: '0',
		defaultExpandedVerticalSubMenus: [],
		mode: MenuMode.Horizontal,
		onSelect: action('selected')
	};

	return (
		<Menu {...menuProps}>
			<MenuItem>Active</MenuItem>
			<MenuItem disabled>Disabled</MenuItem>
			<MenuItem>Link</MenuItem>
			<SubMenu title="SubMenu">
				<MenuItem>Submenu Option 1</MenuItem>
				<MenuItem>Submenu Option 2</MenuItem>
				<MenuItem>Submenu Option 3</MenuItem>
			</SubMenu>
		</Menu>
	);
};

export const verticalMenu = () => {
	const menuProps = {
		defaultIndex: '0',
		defaultExpandedVerticalSubMenus: [],
		mode: MenuMode.Vertical,
		onSelect: action('selected')
	};

	return (
		<Menu {...menuProps}>
			<MenuItem>Active</MenuItem>
			<MenuItem disabled>Disabled</MenuItem>
			<MenuItem>Link</MenuItem>
			<SubMenu title="SubMenu">
				<MenuItem>Submenu Option 1</MenuItem>
				<MenuItem>Submenu Option 2</MenuItem>
				<MenuItem>Submenu Option 3</MenuItem>
			</SubMenu>
		</Menu>
	);
};
