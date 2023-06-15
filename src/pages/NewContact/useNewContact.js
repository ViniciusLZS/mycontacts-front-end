import { useRef } from 'react';

import toast from '../../utils/toast';

import ContactsService from '../../services/ContactsService';

export default function useNewContact() {
  const contactFormRef = useRef(null);

  const handleSubmit = async (contact) => {
    try {
      await ContactsService.createContact(contact);

      contactFormRef.current.resetFields();

      toast({
        type: 'success',
        text: 'Contato cadastrado com sucesso!',
        duration: 5000,
      });
    } catch {
      toast({
        type: 'danger',
        text: 'Ocorreu um erro ao cadastrar um contato!',
      });
    }
  };

  return {
    contactFormRef,
    handleSubmit,
  };
}
