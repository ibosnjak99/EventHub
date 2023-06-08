import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, FormField, Header, Label, Modal } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { v4 as uuid } from 'uuid';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import CustomTextInput from '../../../app/common/form/CustomTextInput';
import CustomTextArea from '../../../app/common/form/CustomTextArea';
import CustomSelectInput from '../../../app/common/form/CustomSelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import CustomDateInput from '../../../app/common/form/CustomDateInput';
import { Event } from '../../../app/models/event';

export default observer (function EventsForm() {
    const {eventStore} = useStore()
    const {selectedEvent, closeModal, createEvent, updateEvent, loading} = eventStore

    const initialState = selectedEvent ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: '',
    }

    const validationSchema = Yup.object({
      title: Yup.string().required('The title is required'),
      description: Yup.string().required('The description is required'),
      category: Yup.string().required('The category is required'),
      date: Yup.string().required('The date is required'),
      city: Yup.string().required('The city is required'),
      venue: Yup.string().required('The venue is required'),
    })

    function handleFormSubmit(event: Event) {
      if (event.id.length === 0) {
        let newEvent = {
          ...event,
          id: uuid()
        };
        createEvent(newEvent)
      }
      else {
        updateEvent(event)
      }
    }

    return (
      <>
        <Formik 
          validationSchema={validationSchema} 
          initialValues={initialState} 
          onSubmit={values => handleFormSubmit(values)}
        >
          {({ handleSubmit, isValid, dirty, isSubmitting }) => (
            <Modal open={true} onClose={closeModal} style={{ maxWidth: '800px' }}>
              <Modal.Header>Event</Modal.Header>
              <Modal.Content style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                  <CustomTextInput placeholder='Title' name='title' />
                  <CustomTextArea rows={4} placeholder='Description' name='description' />
                  <CustomSelectInput options={categoryOptions} placeholder='Category' name='category' />
                  <CustomDateInput placeholderText='Date' name='date' showTimeSelect timeCaption='time' dateFormat='MMMM d, yyyy hh:mm aa'/>
                  <CustomTextInput placeholder='City' name='city' />
                  <CustomTextInput placeholder='Venue' name='venue' />
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button.Group widths='2'>
                  <Button onClick={closeModal} color='red' content='Cancel' />
                  <Button disabled={isSubmitting || !dirty || !isValid} loading={loading} onClick={() => handleSubmit()} color='green' content='Submit' />
                </Button.Group>
              </Modal.Actions>
            </Modal>
          )}
        </Formik>
      </>
    );
  })