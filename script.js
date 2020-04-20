const classNames = {
  TODO_ITEM: 'todo-container',
  TODO_CHECKBOX: 'todo-checkbox',
  TODO_DELETE: 'todo-delete',
  TODO_COMPLETED: 'completed-todo'
}

const list = document.getElementById('todo-list')
const listChild = list.children
const insert = document.getElementById('todo-input')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')
const errorMesg = document.getElementById('error')
const addBtn = document.getElementById('add-btn')
const newTodoBtn = document.getElementById('new-todo')
const inputField = document.getElementById('input-field')
const storage = "TODO"
const data = localStorage.getItem(storage)
const arrData = []
var dataList
var id
var countTodo
var unchecked
var flag

function newTodo () {
  if(data){
    dataList = JSON.parse(data)
    id = dataList[dataList.length - 1].id
    loadList(dataList, addTodo)
  }else{
    dataList = []
    id = 0
  }
  bindEvents()
  updateInnerHtml(itemCountSpan,countTodo)
  updateInnerHtml(uncheckedCountSpan,unchecked)
}

function loadList(array, fn){
  unchecked = 0
  countTodo = 0
  array.forEach(function (element){
    if(element.delete == false){
      fn(element.id, element.todo, element.done, element.delete)
      if(element.done == false){
        unchecked++
      }
      countTodo++
    }
  })
}

function updateInnerHtml (item, value){
  item.innerHTML = value
}

function pushStorage(storageType, array) {
  storageType.setItem(storage, JSON.stringify(array))
}

function addTodo(todoId, todoValue, doneStatus, delStatus) {
  errorMesg.style.display = "none"
  if(todoValue === ""){
    flag = false
    error()
  } else {
    flag = true
    buildTodo(todoId, todoValue, doneStatus)
    arrData.push({
      id: todoId,
      todo: todoValue,
      done: doneStatus,
      delete: delStatus
    })
    id++
    pushStorage(localStorage,arrData)
    todoValue = ""
    searchTodo()
  }
}

function  buildTodo (todoId, inputValue, doneStatus) {
    let listItem, checkboxTodo, deleteBtn

    listItem = document.createElement('li')
    listItem.setAttribute('id',todoId)
    
    checkboxTodo = document.createElement('input')
    checkboxTodo.setAttribute('type','checkbox')
    checkboxTodo.setAttribute('class',classNames.TODO_CHECKBOX)
    checkboxTodo.setAttribute('id',todoId)
    
    if(doneStatus == true){
      listItem.setAttribute('class',classNames.TODO_COMPLETED)
      checkboxTodo.checked = true;
    } else {
      listItem.setAttribute('class',classNames.TODO_ITEM)
      checkboxTodo.checked = false;
    }

    textNodeValue = document.createTextNode(inputValue)

    deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('class',classNames.TODO_DELETE)
    deleteBtn.setAttribute('id',todoId)
    updateInnerHtml(deleteBtn,"X")

    listItem.appendChild(checkboxTodo)
    listItem.appendChild(textNodeValue)
    listItem.appendChild(deleteBtn)
    listTodo(listItem)
}

function listTodo(item) {
  list.appendChild(item)
}

function error() {
    errorMesg.style.display = "block"
    updateInnerHtml(errorMesg,"Task cannot be empty")
}

function enter(event) {
    if(event.keyCode == 13 || event.which == 13) {
      addTodo(id, insert.value, false, false)
      if(flag == true){
        countTodo++
        unchecked++
        updateInnerHtml(itemCountSpan,countTodo)
        updateInnerHtml(uncheckedCountSpan,unchecked)
        insert.value = ""
      }
    }
}

function bindEvents() {
    addBtn.onclick = () => { 
      addTodo(id, insert.value, false, false)
      if(flag == true){
        countTodo++
        unchecked++
        updateInnerHtml(itemCountSpan,countTodo)
        updateInnerHtml(uncheckedCountSpan,unchecked)
        insert.value = ""
      } 
    }
    insert.onkeypress = enter.bind(this)
}


  
function searchTodo() {
    let todoItem, todoCheckbox, todoDelete, todoIds
    for (let i = 0; i < listChild.length; ++i) {
      todoItem = listChild[i]
      todoCheckbox = todoItem.getElementsByTagName('input')[0]
      todoDelete = todoItem.getElementsByTagName('button')[0]
      todoIds = todoCheckbox.id
      todoCheckbox.onclick = completeTodo.bind(this, todoItem, todoCheckbox, todoIds)
      todoDelete.onclick = deleteTodo.bind(this, i, todoIds)
    }
}

function deleteTodo(index, id) {
    listChild[index].remove()
    arrData.forEach((elem) => {
      if(elem.id == id){
        elem.delete = true
        if(elem.done == false){
          unchecked--
        }
      }
    })
    pushStorage(localStorage,arrData)
    countTodo--
    updateInnerHtml(itemCountSpan,countTodo)
    updateInnerHtml(uncheckedCountSpan,unchecked)
    searchTodo()
}

function completeTodo(item, check, id) {
    if(check.checked){
      item.className = classNames.TODO_COMPLETED
      check.checked = true
      arrData.forEach((elem) => {
        if(elem.id == id){
          elem.done = true
          pushStorage(localStorage,arrData)
          unchecked--
          updateInnerHtml(uncheckedCountSpan,unchecked)
        }
      })
    }else{
      incompleteTodo(item, check, id)
    }
}

function incompleteTodo(item, check, id) {
    item.className = classNames.TODO_ITEM
    check.checked == false
    arrData.forEach((elem) => {
      if(elem.id == id){
        elem.done = false
        pushStorage(localStorage,arrData)
        unchecked++
        updateInnerHtml(uncheckedCountSpan,unchecked)
      }
    })
}

