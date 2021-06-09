//Book class: Represents Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI class: Handles UI tasks
class UI {
    static displayBooks() {

        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `

        list.appendChild(row);
    }

    //targets element to delete
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    //Alerts
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //Eliminate alert 
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    //Clears input fields
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}
//Store class: Handles storage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent submit
    e.preventDefault();
    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validation
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Fill the fields bruh', 'danger');
    } else {

        //Instantiate
        const book = new Book(title, author, isbn);

        //Add book to storage
        Store.addBook(book);

        //Add book to UI
        UI.addBookToList(book);

        //Succesfully added
        UI.showAlert('Book Added', 'success');

        //Clear fields
        UI.clearFields();
    }
});

//Event: Remove book
document.querySelector('#book-list').addEventListener('click', (e) => {
    //Remove book from UI
    UI.deleteBook(e.target);

    //Remove book from storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Succesfully removed
    UI.showAlert('Book Removed', 'success');
});