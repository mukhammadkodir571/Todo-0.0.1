const elForm = document.querySelector(".todo__form");
const elInput = document.querySelector(".todo__input");
const elList = document.querySelector(".todo__list");
const elTodoTemplate = document.querySelector(".todo__template").content;
const elCount = document.querySelector(".todo__count");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

let lastId = Math.max(...todos.map(todo => todo.id), 0);

const saveTodos = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const handleTodoClick = (event) =>{
  const target =event.target;

  if(target.classList.contains('delete__btn')){
    onDelete(event);
  } else if(target.classList.contains('edit__btn')){
    onEdit(event);
  } else if(target.classList.contains('todo__checkbox')){
    onToggleCompleted(event);
  }
}


const onDelete = evt => {
  const idToDelete = +evt.target.dataset.id;
  todos = todos.filter(todo => todo.id !== idToDelete);
  lastId=todos.length ? Math.max(...todos.map(todo => todo.id)) : 0;
  saveTodos();
  const elTodoItem =evt.target.closest('.todo__item');
  if(elTodoItem) elTodoItem.remove();
  elCount.textContent = todos.length;
//Instead of calling onRenderTodos() again, we can just remove the todo item from the DOM.
// Why is this better?
// No need to re-render the whole list of todos, just remove the todo item from the DOM.
// Faster performance, especially when we have a lot of todos.
//   onRenderTodos();
};

const onEdit = evt => {
  const idToEdit = +evt.target.dataset.id;
  const editedTodo = todos.find(todo => todo.id === idToEdit);

  if(!editedTodo) return;
  elInput.value = editedTodo.title;
  elInput.dataset.editingId = idToEdit;
  elInput.focus();
//   todos = todos.filter(todo => todo.id !== idToEdit);
//   saveTodos();
//   onRenderTodos();
};

const onToggleCompleted = evt => {
  const idToToggle = +evt.target.dataset.id;
  const toggledTodo = todos.find(todo => todo.id === idToToggle);
  if (!toggledTodo) return;
  toggledTodo.isCompleted = !toggledTodo.isCompleted;
  saveTodos();
  const elTodoText = evt.target
    .closest(".todo__item")
    .querySelector(".todo__text");

  if (toggledTodo.isCompleted) {
    elTodoText.classList.add("line-through", "text-gray-500", "opacity-70");
  } else {
    elTodoText.classList.remove("line-through", "text-gray-500", "opacity-70");
  }
};

const onRenderTodos = () => {
  elList.innerHTML = "";
  elCount.textContent = todos.length;
  todos.forEach(todo => {
    let elTodo = elTodoTemplate.cloneNode(true);
    let elTodoText = elTodo.querySelector(".todo__text");
    let elCheckbox = elTodo.querySelector(".todo__checkbox");

    let elDeleteBtn = elTodo.querySelector(".delete__btn");
    let elEditBtn = elTodo.querySelector(".edit__btn");

    // elDeleteBtn.addEventListener("click", onDelete);
    // elEditBtn.addEventListener("click", onEdit);
    // elCheckbox.addEventListener("change", onToggleCompleted);

    elTodoText.textContent = todo.title;
    elCheckbox.checked = todo.isCompleted;

    if (todo.isCompleted) {
      elTodoText.classList.add("line-through", "text-gray-500", "opacity-70");
    } else {
      elTodoText.classList.remove(
        "line-through",
        "text-gray-500",
        "opacity-70"
      );
    }

    elDeleteBtn.dataset.id = todo.id;
    elEditBtn.dataset.id = todo.id;
    elCheckbox.dataset.id = todo.id;
    elList.appendChild(elTodo);
    // const elLi = document.createElement('li');
    // const elBtnWrapper = document.createElement('div');
    // const elDeleteBtn = document.createElement('button');
    // const elEditBtn = document.createElement('button');

    // elLi.className = 'todo__item bg-gray-800 p-3 rounded flex justify-between items-center ';
    // elDeleteBtn.className = 'bg-red-500 hover:bg-red-600 bg-red-500 shadow-lg shadow-red-500/50 text-white font-bold pl-3 pr-3 pt-1 pb-1 rounded';
    // elEditBtn.className = 'bg-green-500 hover:bg-green-600 bg-green-500 shadow-lg shadow-green-500/50 text-white font-bold pl-3 pr-3 pt-1 pb-1 rounded';
    // elBtnWrapper.className ='flex items-center gap-4'
    // elDeleteBtn.textContent = 'Delete';
    // elEditBtn.textContent = 'Edit';
    // elDeleteBtn.addEventListener('click', onDelete);
    // elEditBtn.addEventListener('click', onEdit);
    // elLi.innerHTML =`

    // <div class="flex justify-between">
    //   <div class="flex items-center gap-2">
    //     <input type="checkbox" class="todo__checkbox w-6 h-6" />
    //   <p class="text-white font-mono font-bold text-2xl">${todo.title}</p>
    //   </div>
    // </div>

    // `
    // elBtnWrapper.append(elEditBtn, elDeleteBtn);
    // elLi.append(elBtnWrapper);
    
  });
};

const onSubmit = (e) => {
  e.preventDefault();

  const inputValue = elInput.value.trim();
  if (inputValue === "") return;

  const editingId = elInput.dataset.editingId;

  if(editingId){
    const todoToEdit = todos.find(todo => todo.id === +editingId);
    if(todoToEdit) todoToEdit.title = inputValue;

    delete elInput.dataset.editingId;
  } else{
    const newTodo = {
        id: ++lastId,
        title: inputValue,
        isCompleted: false,
      };
      todos.unshift(newTodo);
  }
  saveTodos();
  elInput.value = "";
  elInput.focus();
  onRenderTodos();
};
onRenderTodos(todos);
elForm.addEventListener("submit", onSubmit);
elList.addEventListener("click", handleTodoClick);
