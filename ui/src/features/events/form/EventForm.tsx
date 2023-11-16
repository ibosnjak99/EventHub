import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import { observer } from 'mobx-react-lite'
import { v4 as uuid } from 'uuid'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import CustomTextInput from '../../../app/common/form/CustomTextInput'
import CustomTextArea from '../../../app/common/form/CustomTextArea'
import CustomSelectInput from '../../../app/common/form/CustomSelectInput'
import { categoryOptions } from '../../../app/common/options/categoryOptions'
import CustomDateInput from '../../../app/common/form/CustomDateInput'
import { EventFormValues } from '../../../app/models/event'
import CustomCityAutocomplete from '../../../app/common/form/CustomCityAutoComplete'

export default observer (function EventsForm() {
  const { eventStore } = useStore()
  const { closeModal, createEvent, updateEvent, selectedEvent} = eventStore

    const event = selectedEvent ? new EventFormValues(selectedEvent) : new EventFormValues()
  
    const validationSchema = Yup.object({
      title: Yup.string().required('The title is required'),
      description: Yup.string().required('The description is required'),
      category: Yup.string().required('The category is required'),
      date: Yup.string().required('The date is required'),
      city: Yup.string().required('The city is required'),
      venue: Yup.string().required('The venue is required'),
      price: Yup.number()
        .nullable()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .typeError('Price must be a number or leave empty if it is free')
    })
    

    function handleFormSubmit(event: EventFormValues) {
      if (!event.id) {
        let newEvent = {
          ...event,
          id: uuid()
        }
        createEvent(newEvent)
        closeModal()
      }
      else {
        updateEvent(event)
        closeModal()
      }
    }    

    return (
      <>
        <Formik 
          validationSchema={validationSchema} 
          enableReinitialize
          initialValues={event} 
          onSubmit={values => handleFormSubmit(values)}
        >
          {({ handleSubmit, isValid, dirty, isSubmitting }) => (
            <Modal open={true} onClose={closeModal}>
              <Modal.Header>Event</Modal.Header>
              <Modal.Content >
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                  <CustomTextInput label='Title' name='title' />
                  <CustomTextArea rows={4} label='Description' name='description' />
                  <CustomSelectInput options={categoryOptions} label='Category' name='category' />
                  <CustomDateInput disablePast placeholderText='Date' name='date' showTimeSelect timeCaption='time' dateFormat='MMMM d, yyyy hh:mm aa'/>
                  <CustomCityAutocomplete label='City' name='city' />
                  <CustomTextInput label='Venue' name='venue' />
                  <CustomTextInput label='Price (in €)' name='price' placeholder='Leave empty if there is no entrance fee' />
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button.Group widths='2'>
                  <Button onClick={closeModal} color='red' content='Cancel' />
                  <Button 
                    disabled={isSubmitting || !dirty || !isValid} 
                    loading={isSubmitting} 
                    onClick={() => handleSubmit()} 
                    color='green' 
                    content='Submit' 
                  />
                </Button.Group>
              </Modal.Actions>
            </Modal>
          )}
        </Formik>
      </>
    )
  })