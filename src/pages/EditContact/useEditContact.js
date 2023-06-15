import { useEffect, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import ContactsService from '../../services/ContactsService';

import useSafeAsyncAction from '../../hooks/useSafeAsyncAction';

import toast from '../../utils/toast';

export default function useEditContact() {
  const [isLoading, setIsLoading] = useState(true);
  const [contactName, setContactName] = useState('');

  const contactFormRef = useRef(null);

  const { id } = useParams();
  const history = useHistory();
  const safeAsyncAction = useSafeAsyncAction();

  useEffect(() => {
    async function loadContact() {
      try {
        const contact = await ContactsService.getContactById(id);

        safeAsyncAction(() => {
          contactFormRef.current.setFielsValues(contact);
          setIsLoading(false);
          setContactName(contact.name);
        });
      } catch (error) {
        safeAsyncAction(() => {
          history.push('/');
          toast({
            type: 'danger',
            text: 'Contato não encontrado',
          });
        });
      }
    }
    loadContact();
  }, [id, history, safeAsyncAction]);

  const handleSubmit = async (contact) => {
    try {
      const contactData = await ContactsService.updateContact({ id, contact });

      setContactName(contactData.name);
      toast({
        type: 'success',
        text: 'Contato editado com sucesso!',
        duration: 5000,
      });
    } catch {
      toast({
        type: 'danger',
        text: 'Ocorreu um erro ao editar um contato!',
      });
    }
  };

  return {
    isLoading,
    contactName,
    contactFormRef,
    handleSubmit,
  };
}
