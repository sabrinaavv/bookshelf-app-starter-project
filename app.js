const STORAGE_KEY = 'BOOKSHELF_APP';
let books = [];

// Periksa apakah browser mendukung localStorage
function isStorageExist() {
    return typeof(Storage) !== 'undefined';
}

// Simpan data ke localStorage
function saveData() {
    if (isStorageExist()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
}

// Ambil data dari localStorage
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    
    if (serializedData) {
        books = JSON.parse(serializedData);
    }
}

function addBook(title, author, year, isComplete) {
    const book = {
        id: +new Date(),
        title,
        author,
        year: parseInt(year),
        isComplete
    };

    books.push(book);
    saveData();
    renderBookList();
}

function renderBookList() {
    const incompleteBookList = document.getElementById('incomplete-book-list-ul');
    const completeBookList = document.getElementById('complete-book-list-ul');

    // Bersihkan daftar buku sebelumnya
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    // Render buku
    books.forEach(book => {
        const bookElement = createBookElement(book);
        
        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    });
}

function createBookElement(book) {
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-item');
    bookContainer.setAttribute('data-bookid', book.id);
    bookContainer.setAttribute('data-testid', 'bookItem');  // Menambahkan data-testid="bookItem"

    bookContainer.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>  <!-- Menambahkan data-testid="bookItemTitle" -->
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>  <!-- Menambahkan data-testid="bookItemAuthor" -->
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>  <!-- Menambahkan data-testid="bookItemYear" -->
        <div class="book-actions">
            <button onclick="toggleBookStatus(${book.id})" data-testid="bookItemIsCompleteButton">  <!-- Menambahkan data-testid="bookItemIsCompleteButton" -->
                ${book.isComplete ? 'Belum Selesai Dibaca' : 'Selesai Dibaca'}
            </button>
            <button onclick="deleteBook(${book.id})" data-testid="bookItemDeleteButton">Hapus Buku</button>  <!-- Menambahkan data-testid="bookItemDeleteButton" -->
        </div>
    `;

    return bookContainer;
}


function toggleBookStatus(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    
    if (bookIndex !== -1) {
        books[bookIndex].isComplete = !books[bookIndex].isComplete;
        saveData();
        renderBookList();
    }
}

function deleteBook(bookId) {
    books = books.filter(book => book.id !== bookId);
    saveData();
    renderBookList();
}

// Event listener untuk form tambah buku
document.getElementById('add-book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const year = document.getElementById('book-year').value;
    const isComplete = document.getElementById('book-read').checked;

    addBook(title, author, year, isComplete);

    // Reset form
    e.target.reset();
});

// Muat data saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    if (isStorageExist()) {
        loadDataFromStorage();
    }
    renderBookList();
});

// Fungsi untuk menangani pencarian
function searchBooks(searchTitle) {
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle.toLowerCase()));
    renderSearchResult(filteredBooks);
}

// Fungsi untuk merender hasil pencarian
function renderSearchResult(filteredBooks) {
    const incompleteBookList = document.getElementById('incomplete-book-list-ul');
    const completeBookList = document.getElementById('complete-book-list-ul');

    // Bersihkan daftar buku sebelumnya
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    // Render buku yang sesuai dengan hasil pencarian
    filteredBooks.forEach(book => {
        const bookElement = createBookElement(book);
        
        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    });
}

// Event listener untuk form pencarian buku
document.getElementById('search-book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTitle = document.getElementById('search-title').value;
    searchBooks(searchTitle);
});

// Event listener untuk reset form pencarian
document.getElementById('search-book-form').addEventListener('reset', (e) => {
    renderBookList();  // Reset hasil pencarian dengan menampilkan semua buku
});
