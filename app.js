// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: Handles UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
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

        list.appendChild(row)
    }

    static deleteBook(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, className) {
        const alert = document.createElement('div')
        alert.className = `alert mt-4 alert-${className}`
        alert.appendChild(document.createTextNode(message))

        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(alert, form)

        //Vanish after 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearFields() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }
}
//Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }
    static addBook(book) {
        const books = Store.getBooks()

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books))
    }
    static removeBook(isbn) {
        const books = Store.getBooks()

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books))

    }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (event) => {
    //Prevent Submit
    event.preventDefault()

    //Get form values
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    //Validate Fields
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in the fields', 'danger')
    } else {
        //Instantiate Book
        const book = new Book(title, author, isbn)

        //Add Book to UI
        UI.addBookToList(book)

        //Add book to LocalStorage
        Store.addBook(book)

        //Display confirmation
        UI.showAlert('Book added to the list', 'success')

        //Clear fields
        UI.clearFields()
    }
})

//Event: Remove a Book from UI
document.querySelector('#book-list').addEventListener('click', event => {
    UI.deleteBook(event.target)

    //delete Book from LocalStorage
    const isbn = event.target.parentElement.previousElementSibling.textContent
    Store.removeBook(isbn)

    //Delete confirmation
    UI.showAlert('Book deleted', 'info')
})
