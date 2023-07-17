import {
  useEffect, useState, useCallback, useMemo, useDeferredValue,
} from 'react';
import toast from '../../utils/toast';
import ContactsService from '../../services/ContactsService';

export default function useHome() {
  const [contacts, setContacts] = useState([]);
  const [orderBy, setOrderBy] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [contactBeingDeleted, setContactBeingDeleted] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredContacts = useMemo(() => contacts.filter((contact) => (
    contact.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
  )), [contacts, deferredSearchTerm]);

  const loadeContacts = useCallback(async (signal) => {
    try {
      setIsLoading(true);

      const contactsList = await ContactsService.listContacts(orderBy, signal);

      setHasError(false);

      setContacts(contactsList);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      setHasError(true);
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, [orderBy]);

  useEffect(() => {
    const controller = new AbortController();

    loadeContacts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadeContacts]);

  const handleToogleOrderBy = useCallback(() => {
    setOrderBy(
      (prevState) => (prevState === 'asc' ? 'desc' : 'asc'),
    );
  }, []);

  function handleChangeSearchTerm(event) {
    const { value } = event.target;

    setSearchTerm(value);
  }

  function handleTryAgain() {
    loadeContacts();
  }

  const handleDeleteContact = useCallback((contact) => {
    setContactBeingDeleted(contact);
    setIsDeleteModalVisible(true);
  }, []);

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const handleConfirmDeleteContact = async () => {
    try {
      setIsLoadingDelete(true);

      await ContactsService.deleteContact(contactBeingDeleted.id);

      setContacts((prevState) => prevState.filter(
        (contact) => contact.id !== contactBeingDeleted.id,
      ));

      handleCloseDeleteModal();

      toast({
        type: 'success',
        text: 'Contato deletado com sucesso.',
      });
    } catch {
      toast({
        type: 'danger',
        text: 'Ocorreu um erro ao deletar um contato.',
      });
    } finally {
      setIsLoadingDelete(false);
    }
  };

  return {
    isLoading,
    isLoadingDelete,
    isDeleteModalVisible,
    contactBeingDeleted,
    handleCloseDeleteModal,
    handleConfirmDeleteContact,
    contacts,
    handleChangeSearchTerm,
    hasError,
    filteredContacts,
    handleTryAgain,
    searchTerm,
    orderBy,
    handleToogleOrderBy,
    handleDeleteContact,
  };
}
