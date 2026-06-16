import localforage from 'localforage';

// Configure localforage to use IndexedDB
localforage.config({
  name: 'AcademyApp',
  storeName: 'books'
});

export const getBooks = async () => {
  try {
    const res = await fetch('/api/books');
    const json = await res.json();
    if (json.success) {
      // Map MongoDB _id to id for frontend compatibility
      return json.data.map(b => ({ ...b, id: b._id, url: `/uploads/${b.fileName}` }));
    }
    return [];
  } catch (error) {
    console.error('Error getting books:', error);
    return [];
  }
};

export const saveBook = async (bookData) => {
  try {
    const formData = new FormData();
    formData.append('title', bookData.title);
    formData.append('author', bookData.author);
    formData.append('file', bookData.fileBlob);

    const res = await fetch('/api/books', {
      method: 'POST',
      body: formData
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  } catch (error) {
    console.error('Error saving book:', error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return true;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
