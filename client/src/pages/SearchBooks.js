import React, { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';
import { useLazyQuery, useMutation } from '@apollo/client';
import { SEARCH_BOOKS } from '../utils/queries';
import { SAVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [getBooks, { loading, data }] = useLazyQuery(SEARCH_BOOKS);
  const [saveBook, { error }] = useMutation(SAVE_BOOK);

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      await getBooks({ variables: { title: searchInput } });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (data) {
      const bookData = data.books.map((book) => ({
        bookId: book.id,
        authors: book.authors || ['No author to display'],
        title: book.title,
        description: book.description,
        image: book.image || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    }
  }, [data]);

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBook({
        variables: { bookData: bookToSave },
        update(cache) {
          const { me } = cache.readQuery({ query: QUERY_ME });
          cache.writeQuery({
            query: QUERY_ME,
            data: { me: { ...me, savedBooks: [...me.savedBooks, bookToSave] } }
          });
        }
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* ... */}
    </>
  );
};

export default SearchBooks;
