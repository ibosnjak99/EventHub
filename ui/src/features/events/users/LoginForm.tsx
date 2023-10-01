import { ErrorMessage, Form, Formik } from 'formik'
import CustomTextInput from '../../../app/common/form/CustomTextInput'
import { Button, Header, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store'
import * as Yup from 'yup'

export default observer(function LoginForm() {
    const { userStore } = useStore()
    return (
        <Formik
            initialValues={{ email: '', password: '', error: null }}
            onSubmit={ (values, {setErrors}) => userStore.login(values).catch(error =>
                setErrors({error: 'Invalid email or password'}))}
                validationSchema={Yup.object({
                    email: Yup.string().required(),
                    password: Yup.string().required()
                })}
        >
            {({handleSubmit, isSubmitting, errors, dirty, isValid}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Login to EventHub' color='blue' align='center' />
                    <CustomTextInput placeholder='Email' name='email' />
                    <CustomTextInput placeholder='Password' name='password' type='password' />
                    <ErrorMessage
                        name='error'
                        render={() =>
                            <Label 
                                style={{ marginBottom: 10 }} 
                                basic
                                color='red'
                                content={errors.error}
                            />
                        }
                    />
                    <Button disabled={!isValid || !dirty} loading={isSubmitting} color='blue' content='Login' type='submit' fluid />
                </Form>
            )}
        </Formik>
    )
})