const showHideTasks = document.querySelector('#show-hide-tasks')
const taskList = document.querySelector('#task-list')
const taskForm = document.querySelector('#task-form')
const deleteAllTasks = document.querySelector('#delete-all-tasks')

const addButton = document.querySelector('#add-button')
const saveButton = document.querySelector('#save-button')
const cancelButton = document.querySelector('#cancel-button')

const nameInput = document.querySelector('#task-name')
const descriptionInput = document.querySelector('#task-description')
const dateInput = document.querySelector('#task-date')
const urgentLabel = document.querySelector('#urgent-label')
const urgentCheckbox = document.querySelector('#urgent-checkbox')
const categoryInput = document.querySelector('#task-category')

const groceriesFields = document.querySelector('#groceries-fields')
const billsFields = document.querySelector('#bills-fields')
const choresFields = document.querySelector('#chores-fields')
const workFields = document.querySelector('#work-fields')

const extraFields = [groceriesFields, billsFields, choresFields, workFields]

const groceryItemInput = document.querySelector('#grocery-item-input')
const groceryItemButton = document.querySelector('#grocery-item-button')
const groceryList = document.querySelector('#grocery-list')
const groceriesBudget = document.querySelector('#groceries-budget')
const billPayTo = document.querySelector('#bill-pay-to')
const billAmount = document.querySelector('#bill-amount')
const choreTime = document.querySelector('#chore-time')
const choreLocation = document.querySelector('#chore-location')
const workClient = document.querySelector('#work-client')
const workTypeInput = document.querySelector('#work-type')

const monthNames = [
	'jan',
	'feb',
	'mar',
	'apr',
	'may',
	'jun',
	'jul',
	'aug',
	'sep',
	'oct',
	'nov',
	'dec',
]

const getTasksFromLocalStorage = () => {
	try {
		const tasks = JSON.parse(localStorage.getItem('tasks'))

		if (!tasks) return []

		return tasks
	} catch (err) {
		return []
	}
}

class Task {
	constructor(options) {
		this.id = ''
		this.name = ''
		this.description = ''
		this.date = new Date().toLocaleDateString('en-CA')
		this.urgent = false
		this.category = ''
		this.order = null

		if (options) Object.assign(this, options)
	}
}

class GroceriesTask extends Task {
	constructor(options, extraOptions) {
		super(options)

		this.category = 'groceries'
		this.list = []
		this.budget = ''

		if (extraOptions) Object.assign(this, extraOptions)
	}
}

class BillsTask extends Task {
	constructor(options, extraOptions) {
		super(options)

		this.category = 'bills'
		this.payTo = ''
		this.amount = ''

		if (extraOptions) Object.assign(this, extraOptions)
	}
}

class ChoresTask extends Task {
	constructor(options, extraOptions) {
		super(options)

		this.category = 'chores'
		this.estimatedTime = ''
		this.location = ''

		if (extraOptions) Object.assign(this, extraOptions)
	}
}

class WorkTask extends Task {
	constructor(options, extraOptions) {
		super(options)

		this.category = 'work'
		this.client = ''
		this.workType = ''

		if (extraOptions) Object.assign(this, extraOptions)
	}
}

const state = {
	tasks: getTasksFromLocalStorage(),
	newTask: new Task(),
	newOrder: null,
	showForm: false,
	showTasks: true,
	expanded: null,
}

const saveTasksToLocalStorage = () => {
	localStorage.setItem('tasks', JSON.stringify(state.tasks))
}

const uniqueTaskId = () => {
	let i = 0
	const ids = state.tasks.map((task) => task.id)

	while (ids.includes(`${i}`)) i++

	return `${i}`
}

const uniqueGroceryItemId = () => {
	let i = 0

	while (state.newTask.list.find((task) => task.id === `${i}`)) i++

	return `${i}`
}

const renderGroceryList = () => {
	const {
		newTask: { list },
	} = state

	groceryList.innerHTML = ''

	list.forEach((groceryItem) => {
		const span = document.createElement('span')
		span.classList.add('grocery-list-item')
		span.textContent = groceryItem.value

		const i = document.createElement('i')
		i.classList.add('fa', 'fa-times')
		span.appendChild(i)
		span.addEventListener('click', () => {
			state.newTask.list = state.newTask.list.filter(
				(item) => item.id !== groceryItem.id
			)

			renderGroceryList()
		})

		groceryList.appendChild(span)
	})
}

const renderExtraFields = () => {
	extraFields.forEach((element) => {
		element.style.display = 'none'
	})

	if (state.newTask instanceof GroceriesTask) {
		const {
			newTask: { budget },
		} = state

		groceryItemInput.value = ''
		renderGroceryList()
		groceriesBudget.value = budget
		groceriesFields.style.display = 'block'
	}

	if (state.newTask instanceof BillsTask) {
		const {
			newTask: { payTo, amount },
		} = state

		billPayTo.value = payTo
		billAmount.value = amount
		billsFields.style.display = 'block'
	}

	if (state.newTask instanceof ChoresTask) {
		const {
			newTask: { estimatedTime, location },
		} = state

		choreTime.value = estimatedTime
		choreLocation.value = location
		choresFields.style.display = 'block'
	}

	if (state.newTask instanceof WorkTask) {
		const {
			newTask: { client, workType },
		} = state

		workClient.value = client
		workTypeInput.value = workType
		workFields.style.display = 'block'
	}
}

const renderForm = () => {
	if (state.showForm) {
		const { name, description, date, category } = state.newTask

		nameInput.value = name
		descriptionInput.value = description
		dateInput.value = date
		renderCheckbox()
		categoryInput.value = category

		taskForm.style.display = 'block'
		addButton.style.display = 'none'
	} else {
		taskForm.style.display = 'none'
		addButton.style.display = 'flex'
	}

	renderExtraFields()
}

const toggleForm = (e, task) => {
	state.showForm = !state.showForm
	state.newTask = task || new Task()
	renderForm()
}

groceryItemButton.addEventListener('click', () => {
	state.newTask.list.push({
		id: uniqueGroceryItemId(),
		value: groceryItemInput.value,
	})

	groceryItemInput.value = ''

	renderGroceryList()
})
groceriesBudget.addEventListener('input', (e) => {
	state.newTask.budget = e.target.value
})

billPayTo.addEventListener('input', (e) => {
	state.newTask.payTo = e.target.value
})
billAmount.addEventListener('input', (e) => {
	state.newTask.amount = e.target.value
})

choreTime.addEventListener('input', (e) => {
	state.newTask.estimatedTime = e.target.value
})
choreLocation.addEventListener('input', (e) => {
	state.newTask.location = e.target.value
})

workClient.addEventListener('input', (e) => {
	state.newTask.client = e.target.value
})
workTypeInput.addEventListener('input', (e) => {
	state.newTask.workType = e.target.value
})

nameInput.addEventListener('input', (e) => {
	state.newTask.name = e.target.value
})

descriptionInput.addEventListener('input', (e) => {
	state.newTask.description = e.target.value
})

dateInput.addEventListener('input', (e) => {
	state.newTask.date = e.target.value
})

const renderCheckbox = () => {
	if (state.newTask.urgent) {
		urgentCheckbox.classList.remove('fa-square')
		urgentCheckbox.classList.add('fa-check-square')
	} else {
		urgentCheckbox.classList.remove('fa-check-square')
		urgentCheckbox.classList.add('fa-square')
	}
}
const handleCheckbox = () => {
	state.newTask.urgent = !state.newTask.urgent

	renderCheckbox()
}
urgentLabel.addEventListener('click', handleCheckbox)

categoryInput.addEventListener('input', (e) => {
	switch (e.target.value) {
		case 'groceries': {
			state.newTask = new GroceriesTask(state.newTask)
			break
		}
		case 'bills': {
			state.newTask = new BillsTask(state.newTask)
			break
		}
		case 'chores': {
			state.newTask = new ChoresTask(state.newTask)
			break
		}
		case 'work': {
			state.newTask = new WorkTask(state.newTask)
			break
		}
		default: {
			state.newTask = new Task(state.newTask)
		}
	}

	renderExtraFields()
})

const moveTask = (position, newPosition) => {
	if ((!position || !newPosition) && position !== 0 && newPosition !== 0)
		return

	if (position === newPosition) return

	const array = [...state.tasks]
		.sort((a, b) => a.order - b.order)
		.map((t, index) => ({ ...t, order: index }))

	const obj = array.find((t) => t.order === position)

	const half1 = array.filter((t) => t.order !== position)
	const half2 = half1.splice(newPosition).filter((t) => t.order !== position)

	const newArray = [...half1, obj, ...half2].map((t, index) => ({
		...t,
		order: index,
	}))

	state.tasks = [...newArray]

	saveTasksToLocalStorage()
	renderTasks()
}

const clearDropper = () => {
	taskList.querySelectorAll('.dropper').forEach((el) => el.remove())
}

const renderDropper = (index) => {
	clearDropper()

	const dropper = document.createElement('div')
	dropper.classList.add('dropper')

	const dropperIcon = document.createElement('i')
	dropperIcon.classList.add('fas', 'fa-chevron-down')

	dropper.appendChild(dropperIcon)

	taskList.insertBefore(dropper, taskList.children[index])
}

const renderTasks = () => {
	state.tasks = state.tasks.sort((a, b) =>
		a.order < b.order ? -1 : a.order > b.order ? 1 : 0
	)

	const { tasks } = state

	if (!tasks.length) {
		showHideTasks.style.display = 'none'
		deleteAllTasks.style.display = 'none'
		return (taskList.textContent = 'no tasks yet!')
	} else {
		showHideTasks.style.display = 'block'
		deleteAllTasks.style.display = 'block'
	}

	const children = []

	tasks.forEach((task) => {
		const { urgent, id, description, category, name } = task
		const taskElement = document.createElement('div')
		taskElement.classList.add('task')
		taskElement.setAttribute('draggable', true)

		let _self
		let _order

		taskElement.addEventListener('dragover', function (e) {
			if (this !== e.target) return
			if (_self) return

			const x = e.layerX
			const width = e.currentTarget.offsetWidth
			const center = Math.floor(width / 2)
			const delta = Math.abs(center - x)
			const ratio = delta / width

			if (ratio < 0.1) return

			if (x < center) state.newOrder = task.order
			if (x > center) state.newOrder = task.order + 1

			renderDropper(state.newOrder)
		})

		taskElement.addEventListener('dragstart', (e) => {
			e.dataTransfer.effectAllowed = 'move'
			e.dataTransfer.setData('text/plain', null)
			_self = task.id
			_order = task.order
		})

		taskElement.addEventListener('dragend', () => {
			console.log(_order, state.newOrder)
			moveTask(_order, state.newOrder)
			clearDropper()
		})

		if (urgent) taskElement.classList.add('urgent')
		if (state.expanded === id) taskElement.classList.add('expanded')

		const taskTop = taskElement.appendChild(document.createElement('div'))
		taskTop.classList.add('task-top')

		const taskTitle = taskTop.appendChild(document.createElement('h3'))
		taskTitle.textContent = name

		if (description) {
			const taskDesc = taskTop.appendChild(document.createElement('p'))
			taskDesc.classList.add('task-description')
			taskDesc.textContent = description
		}

		if (category) {
			const taskCat = taskTop.appendChild(document.createElement('span'))
			taskCat.classList.add('task-category')
			taskCat.textContent = category

			const taskCatWatermark = taskElement.appendChild(
				document.createElement('i')
			)

			const classNames = ['task-category-watermark']

			switch (category) {
				case 'groceries': {
					classNames.push('fas', 'fa-shopping-cart')
					break
				}

				case 'bills': {
					classNames.push('fas', 'fa-file-invoice')
					break
				}

				case 'work': {
					classNames.push('fas', 'fa-briefcase')
					break
				}

				case 'chores': {
					classNames.push('fas', 'fa-broom')
					break
				}

				default: {
					classNames.push('fa', 'fa-question-circle')
				}
			}

			taskCatWatermark.classList.add(...classNames)
		}

		const taskBottom = taskElement.appendChild(
			document.createElement('div')
		)
		taskBottom.classList.add('task-bottom')

		const taskDate = taskBottom.appendChild(document.createElement('p'))
		taskDate.classList.add('task-date')

		const dateArr = task.date.split(/[- :]/)
		const dateObj = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], 23, 59)
		taskDate.innerHTML = `<span>${
			monthNames[dateObj.getMonth()]
		}</span><span>${dateObj.getDate().toString().padStart(2, '0')}</span>`

		const taskTools = taskBottom.appendChild(document.createElement('div'))
		taskTools.classList.add('task-tools')

		const editIcon = taskTools.appendChild(document.createElement('i'))
		editIcon.classList.add('fa', 'fa-pencil')
		editIcon.addEventListener('click', (e) => {
			e.stopPropagation()
			toggleForm(e, task)
		})

		const viewIcon = taskTools.appendChild(document.createElement('i'))
		viewIcon.classList.add('fas', 'fa-eye')

		const trashIcon = taskTools.appendChild(document.createElement('i'))
		trashIcon.classList.add('fas', 'fa-trash-alt')
		trashIcon.addEventListener('click', (e) => {
			e.stopPropagation()

			state.tasks = state.tasks.filter((item) => item.id !== task.id)

			saveTasksToLocalStorage()
			renderTasks()
		})

		taskElement.addEventListener('click', () => {
			if (state.expanded !== task.id) state.expanded = task.id
			else state.expanded = null

			renderTasks()
		})

		children.push(taskElement)
	})

	taskList.replaceChildren(...children)
}

showHideTasks.addEventListener('click', () => {
	state.showTasks = !state.showTasks
	if (state.showTasks) {
		showHideTasks.textContent = 'hide tasks'
		taskList.style.display = 'flex'
	} else {
		showHideTasks.textContent = 'show tasks'
		taskList.style.display = 'none'
	}
})

deleteAllTasks.addEventListener('click', () => {
	state.tasks = []
	localStorage.removeItem('tasks')
	renderTasks()
})

const handleSubmit = (e) => {
	e.preventDefault()

	console.log(state.newTask)

	if (!state.newTask.id) {
		state.newTask.id = uniqueTaskId()
		state.newTask.order = state.tasks.length
		state.tasks.push(state.newTask)

		console.log('no ID')
	} else {
		const index = state.tasks.findIndex(
			(task) => task.id === state.newTask.id
		)

		if (index === -1) {
			console.log('not found')
			state.tasks.push(state.newTask)
		} else {
			console.log('found')
			state.tasks[index] = state.newTask
		}
	}

	saveTasksToLocalStorage()
	toggleForm()
	renderTasks()
}

addButton.addEventListener('click', toggleForm)
cancelButton.addEventListener('click', toggleForm)
saveButton.addEventListener('click', handleSubmit)

taskForm.addEventListener('submit', (e) => {
	e.preventDefault()
})

const renderAll = () => {
	renderForm()
	renderTasks()
}

renderAll()
