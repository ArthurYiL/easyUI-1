import React, { FC, useState, ChangeEvent, KeyboardEvent, ReactElement, useEffect, useRef } from 'react';
import Input, { IInputProps } from '../Input/input';
import Icon from '../Icon/icon';
import useDebounce from '../../hooks/useDebounce';
import classNames from 'classnames';
import useClickOutsideComponent from '../../hooks/useClickOutsideComponent';

interface IDataSourceObject {
	value: string;
}

export type DataSourceType<T = {}> = T & IDataSourceObject;

export interface IAutoCompleteProps extends Omit<IInputProps, 'onSelect'> {
	fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
	onSelect?: (item: DataSourceType) => void;
	renderOption?: (item: DataSourceType) => ReactElement;
}

const AutoComplete: FC<IAutoCompleteProps> = props => {
	const { fetchSuggestions, onSelect, value, renderOption, ...restProps } = props;

	const [inputValue, setInputValue] = useState((value as string) || '');
	const [suggestions, setSuggestions] = useState<DataSourceType[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [highlightIndex, setHighlightIndex] = useState(-1);
	const debouncedValue = useDebounce<string>(inputValue, 500);
	const triggerSearchRef = useRef(false);
	const autoCompleteComponentRef = useRef<HTMLDivElement>(null);

	/** Hide the suggestion list when user clicks outside of the component */
	useClickOutsideComponent(autoCompleteComponentRef, () => {
		setSuggestions([]);
	});

	useEffect(() => {
		// Use useRef to keep track of whether a search should be performed
		const shouldTriggerSearch = triggerSearchRef.current;

		if (debouncedValue && shouldTriggerSearch) {
			const results = fetchSuggestions(debouncedValue);

			// Handle asynchronously if the results is a Promise
			if (results instanceof Promise) {
				setIsLoading(true);

				results.then(data => {
					setSuggestions(data);
					setIsLoading(false);
				});
			} else {
				setSuggestions(results);
			}
		} else {
			setSuggestions([]);
		}

		// Reset hightlight item every time a new suggestion list is generated
		setHighlightIndex(-1);
	}, [debouncedValue, fetchSuggestions]);

	/** Change handler for input */
	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value.trim();

		setInputValue(inputValue);

		// Any change to the input value should trigger a search
		triggerSearchRef.current = true;
	};

	/** Calculate which item should be highlighted */
	const highlight = (index: number) => {
		if (index < 0) {
			index = 0;
		}

		if (index >= suggestions.length) {
			index = suggestions.length - 1;
		}

		setHighlightIndex(index);
	};

	/** Keydown handler for input */
	const handleKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
		switch (event.keyCode) {
			case 13: // Enter key
				if (suggestions[highlightIndex]) {
					handleItemSelect(suggestions[highlightIndex]);
				}

				break;
			case 38: // Up key
				highlight(highlightIndex - 1);
				break;
			case 40: // Down key
				highlight(highlightIndex + 1);
				break;
			case 27: // ESC key
				setSuggestions([]);
				break;
			default:
				break;
		}
	};

	/** Click handler for suggestion list item */
	const handleItemSelect = (item: DataSourceType) => {
		// Set selected item to be input value
		setInputValue(item.value);

		// Empty the suggestion menu
		setSuggestions([]);

		// Call onSelect function if it's provided
		if (onSelect) {
			onSelect(item);
		}

		// Select an item from the suggestion list should not trigger a search
		triggerSearchRef.current = false;
	};

	/** Render a custom template if it's provided, otherwise, plain value will be rendered */
	const renderTemplate = (item: DataSourceType) => {
		return renderOption ? renderOption(item) : item.value;
	};

	/** Generate suggestion list */
	const generateSuggestionList = () => {
		return (
			<ul>
				{suggestions.map((item, index) => {
					const classes = classNames('suggestion-item', {
						'item-highlighted': index === highlightIndex
					});

					return (
						<li key={index} className={classes} onClick={() => handleItemSelect(item)}>
							{renderTemplate(item)}
						</li>
					);
				})}
			</ul>
		);
	};

	return (
		<div className="auto-complete" ref={autoCompleteComponentRef}>
			<Input value={inputValue} onChange={handleInputChange} onKeyDown={handleKeydown} {...restProps} />

			{isLoading && (
				<ul>
					<Icon icon="spinner" spin />
				</ul>
			)}
			{suggestions.length > 0 && generateSuggestionList()}
		</div>
	);
};

export default AutoComplete;
