(() => {
	/* --- Theme Switcher --- */

	/**
	 * Set specified theme
	 * @param {string} themeName Name of the theme
	 */
	function setTheme(themeName) {
		localStorage.setItem('todo-theme', themeName);
		document.documentElement.className = themeName;
	}

	/**
	 * Checks for saved theme (if any) and sets theme accordingly when toggling theme
	 */
	function toggleTheme() {
		if (localStorage.getItem('todo-theme') === 'theme-light') {
			setTheme('theme-dark');
		} else {
			setTheme('theme-light');
		}
	}

	/**
	 * Checks for saved theme (if any) and set theme accordingly on window load
	 * @param {Event} e Window load event data
	 */
	function getSelectedTheme(e) {
		const savedTheme = localStorage.getItem('todo-theme');

		if (!savedTheme) {
			if (e.target.checked) {
				setTheme('theme-dark');
			} else {
				setTheme('theme-light');
			}
		} else {
			setTheme(savedTheme);
		}
	}

	document.querySelector('#theme-toggle-checkbox').addEventListener('change', toggleTheme);
	window.addEventListener('load', getSelectedTheme);

	/* --- Todo App --- */

	const todoList = document.querySelector('#todo-list');
	let filterMethod = 'all';
	let entriesActiveCount = 0;
	let entriesCreatedCount = 0;

	/**
	 * Updates the active entries count
	 */
	function updateEntriesActiveCount() {
		document.querySelector('#entries-active-count').innerText = entriesActiveCount;
	}

	/**
	 * Generates and shows 'No entries' message
	 */
	function showNoEntries() {
		const listEntry = document.createElement('li');
		listEntry.className = 'todo-list-entry no-entries';
		listEntry.innerText = 'No entries found';
		todoList.appendChild(listEntry);
	}

	/**
	 * Updates todo list based on user-specified filtering method
	 */
	function updateList() {
		// Track visible entries to determine if "No entries" message needs to be shown
		let entriesVisible = 0;

		{
			// Remove this entry so that the entries count can be dealt with more ease
			const noEntriesObj = todoList.querySelector('.no-entries');
			if (noEntriesObj !== null) {
				todoList.removeChild(noEntriesObj);
			}
		}

		switch (filterMethod) {
			case 'all':
				for (let i = 0; i < todoList.children.length; ++i) {
					todoList.children[i].classList.remove('hidden');
					entriesVisible++;
				}
				break;
			case 'active':
				for (let i = 0; i < todoList.children.length; ++i) {
					if (todoList.children[i].dataset.completed === 'true') {
						todoList.children[i].classList.add('hidden');
					} else {
						todoList.children[i].classList.remove('hidden');
						entriesVisible++;
					}
				}
				break;
			case 'completed':
				for (let i = 0; i < todoList.children.length; ++i) {
					if (todoList.children[i].dataset.completed === 'true') {
						todoList.children[i].classList.remove('hidden');
						entriesVisible++;
					} else {
						todoList.children[i].classList.add('hidden');
					}
				}
				break;
		}

		if (entriesVisible === 0) {
			showNoEntries();
		}
	}

	/**
	 * Set filtering method based on user selection
	 * @param {Event} e Radio button click event data
	 */
	function setFilterMethod(e) {
		filterMethod = e.target.value;
		updateList();
	}

	/**
	 * Saves todo list data into local storage
	 */
	function saveData() {
		let entriesArray = [];

		const entriesCompleted = todoList.querySelectorAll('.todo-list-entry-checkbox');
		const entriesLabelText = todoList.querySelectorAll('.todo-list-entry-label');

		for (let i = 0; i < entriesCompleted.length; ++i) {
			entriesArray.push([entriesLabelText[i].innerText, entriesCompleted[i].checked]);
		}
		localStorage.setItem('todo-list', JSON.stringify(entriesArray));
	}

	/**
	 * Clears todo list of completed entries
	 */
	function clearCompleted() {
		// Remove completed entries
		// Done in reverse order to avoid potential issues with removing children while looping
		for (let i = todoList.children.length - 1; i >= 0; --i) {
			if (todoList.children[i].dataset.completed === 'true') {
				todoList.removeChild(todoList.children[i]);
			}
		}

		saveData();

		updateList();
	}

	/**
	 * Sets todo entry as completed
	 * @param {Event} e Checkbox selected event data
	 */
	function setCompleted(e) {
		e.target.parentNode.setAttribute('data-completed', e.target.checked);
		entriesActiveCount = (e.target.checked ? entriesActiveCount - 1 : entriesActiveCount + 1);
		filterMethod = document.querySelector('input[name="todo-filter"]:checked').value;
		if (filterMethod === 'active') {
			e.target.parentNode.classList.add('hidden');
		}
		updateEntriesActiveCount();

		saveData();
	}

	/**
	 * Deletes a user-specified todo entry
	 * @param {Event} e Button click event data
	 */
	function deleteEntry(e) {
		if (e.currentTarget.parentNode.dataset.completed === 'false') {
			entriesActiveCount--;
			updateEntriesActiveCount();
		}
		todoList.removeChild(e.currentTarget.parentNode);

		saveData();

		updateList();
	}

	let entryDragged = undefined;
	let entryEntered = undefined;

	/**
	 * When user begins dragging todo entry
	 * @param {Event} e Drag event data
	 */
	function dragStart(e) {
		entryDragged = this;
		e.dataTransfer.effectAllowed = 'move';
		this.style.opacity = '0.4';
	}

	/**
	 * When user finishes dragging todo entry
	 * @param {Event} e Drag event data
	 */
	function dragEnd(e) {
		if (entryEntered) {
			entryEntered.classList.remove('drag-over');
		}
		entryDragged.style.opacity = '1';
		todoList.insertBefore(entryDragged, entryEntered);
		entryDragged = undefined;

		saveData();
	}

	/**
	 * When user drags todo entry into another element
	 * @param {Event} e Drag event data
	 */
	function dragEnter(e) {
		if (this.classList.contains('todo-list-entry')) {
			if (entryEntered !== undefined && this !== entryEntered) {
				entryEntered.classList.remove('drag-over');
			}
			entryEntered = this;
			this.classList.add('drag-over');
		}
	}

	/**
	 * When user drags todo entry over another element
	 * @param {Event} e Drag event data
	 */
	function dragOver(e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	}

	/**
	 * When user drops todo entry over another element
	 * @param {Event} e Drag event data
	 */
	function dragDrop(e) {
		e.preventDefault();
	}

	/**
	 * Generates and shows new todo entry
	 * @param {string} entryText Text description of todo
	 * @param {boolean} isCompleted Whether todo is completed
	 */
	function createTodoEntry(entryText, isCompleted) {
		// Provides unique ID for created entry
		entriesCreatedCount++;

		filterMethod = document.querySelector('input[name="todo-filter"]:checked').value;

		const listEntry = document.createElement('li');
		listEntry.id = `todo-list-item${entriesCreatedCount}`;
		listEntry.classList.add('todo-list-entry');
		if ((filterMethod === 'active' && isCompleted) ||
			(filterMethod === 'completed' && !isCompleted)) {
			listEntry.classList.add('hidden');
		}
		listEntry.setAttribute('data-completed', isCompleted);
		listEntry.setAttribute('draggable', true);
		listEntry.addEventListener('dragstart', dragStart);
		listEntry.addEventListener('dragend', dragEnd);
		listEntry.addEventListener('dragenter', dragEnter);
		listEntry.addEventListener('dragover', dragOver);
		listEntry.addEventListener('drop', dragDrop);

		const listEntryCheckbox = document.createElement('input');
		listEntryCheckbox.setAttribute('type', 'checkbox');
		listEntryCheckbox.setAttribute('name', 'todo-entry');
		listEntryCheckbox.id = `todo-entry${entriesCreatedCount}`;
		listEntryCheckbox.className = 'todo-list-entry-checkbox';
		listEntryCheckbox.checked = isCompleted;
		listEntryCheckbox.addEventListener('click', setCompleted);
		listEntry.appendChild(listEntryCheckbox);

		const listEntryLabel = document.createElement('label');
		listEntryLabel.setAttribute('for', `todo-entry${entriesCreatedCount}`);
		listEntryLabel.className = 'todo-list-entry-label';
		listEntryLabel.innerText = entryText;
		listEntry.appendChild(listEntryLabel);

		const listEntryButton = document.createElement('button');
		listEntryButton.className = 'button-delete';
		listEntryButton.addEventListener('click', deleteEntry);
		listEntry.appendChild(listEntryButton);

		const listEntryImage = document.createElement('img');
		listEntryImage.src = 'images/icon-cross.svg';
		listEntryImage.alt = 'Delete todo';
		listEntryImage.width = '18';
		listEntryImage.height = '18';
		listEntryButton.appendChild(listEntryImage);
		listEntry.appendChild(listEntryButton);

		todoList.appendChild(listEntry);

		if (!isCompleted) {
			entriesActiveCount++;
			updateEntriesActiveCount();
		}

		saveData();

		updateList();
	}

	/**
	 * Processes key presses while entering a new todo entry
	 * @param {Event} e Key press event data
	 */
	function onKeyUp(e) {
		if (e.key === 'Enter' && e.target.value.trim().length > 0) {
			// Is new todo entry completed?
			const isCompleted = e.target.parentNode.querySelector('#todo-entry-new').checked;
			// Generate new todo entry
			createTodoEntry(e.target.value.trim(), isCompleted);
			// Clear input field for new entry
			e.target.value = '';
		}
	}

	/**
	 * Checks for saved todo data and initializes list
	 */
	function initTodoList() {
		// Track visible entries to determine if "No entries" message needs to be shown
		let entriesVisible = 0;

		//localStorage.clear(); // For debugging purposes
		const todoEntries = localStorage.getItem('todo-list');
		if (todoEntries !== null) {
			const todoEntriesParsed = JSON.parse(todoEntries);
			todoEntriesParsed.forEach((todoEntry) => {
				createTodoEntry(todoEntry[0], todoEntry[1]);
				entriesVisible++;
			});
		}

		if (!entriesVisible) {
			showNoEntries();
		}
	}

	document.querySelector('#todo-new').addEventListener('keyup', onKeyUp);
	document.querySelector('.button-clear-completed').addEventListener('click', clearCompleted);
	document.querySelectorAll('input[name="todo-filter"]').forEach((filterOption) => {
		filterOption.addEventListener('click', setFilterMethod);
	});
	document.querySelector('.main').addEventListener('dragenter', dragEnter);

	initTodoList();
})();