# Book Catalog Website

## Introduction to the Backend API

My Backend API uses Render's free tier service for hosting. An important note when using free tier plans is that the servers will automatically go into "sleep" mode after about 30 minutes of inactivity. When a new request comes in, the server will "wake up," and this process can take approximately 30 seconds.

My website is deployed and can be accessed at [https://book-catalog-psi.vercel.app/](https://book-catalog-psi.vercel.app/).

### Benefits and Limitations of the Free Tier

- **Benefits**:

  - Cost-effective hosting solution.
  - Suitable for small projects or testing purposes.

- **Limitations**:
  - Initial response time might be slow due to the server needing time to wake up after sleeping.
  - Not suitable for applications that require immediate and continuous response times.

We hope you have

## Features

1. **Store Data Using Firestore and Firestore SDK**

   - Utilize Firestore as the database to store and manage book data efficiently.

2. **Main Page**

   - Display a list of all books on the main page for easy viewing.

3. **Book Grouping and Sorting**

   - Books are grouped by their publication year.
   - Groups are sorted in descending order (newer books come first).
   - Books within each group are sorted alphabetically.

4. **Add and Delete Books**

   - Users can add new books to the list.
   - Users can delete books from the list.

5. **Book Recommendation System**

   - Recommend a good book to the user based on the following criteria:
     - The book should be published at least 3 years ago or earlier.
     - From all qualifying books, select the ones with the highest rating.
     - If there are multiple books with the highest rating, pick one at random.

6. **Additional Features**
   - ISBN Validation: Ensure the ISBN is valid before adding a book.
   - Change Grouping Criteria: Users can change the grouping criteria to group books by rating or author.
   - Book Editing: Users can edit the details of existing books.

## Summary

This system provides a comprehensive solution for managing a book collection with advanced features such as Firestore integration, dynamic book grouping, and a recommendation system based on publication year and rating. Users have full control over adding, deleting, and editing books, with additional functionalities to validate ISBNs and customize the grouping criteria.

## Set up Backend

```bash
cd backend
```

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firestore: Provide Firestore credentials and setup database rules.

Change your configure Firebase to **_.env_**

### 3. Start the backend server

```bash
npm start
```

## APIs

### Get all books

- GET `api/v1/books`

### Post a new book

- POST `api/v1/books`

### Post sample data

- POST `api/v1/add-sample-data`

### Edit a book

- PUT `api/v1/books/:id`

### Delete a book

- DELETE `api/v1/books/:id`

## Set up Frontend

```bash
cd frontend
```

### 1. Install dependencies

```bash
npm install
```

### 2. Start the frontend

```bash
npm run dev
```
