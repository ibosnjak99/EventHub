import { ErrorMessage, Form, Formik } from 'formik'
import CustomTextInput from '../../../app/common/form/CustomTextInput'
import { Button, Header, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store'

export default observer(function LoginForm() {
    const { userStore } = useStore()

    return (
        <Formik
            initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) =>
                userStore.login(values).catch(error =>
                    setErrors({ error: 'Invalid email or password' })
                )
            }
        >
            {({ handleSubmit, isSubmitting, errors, values }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Login to EventHub' color='blue' textAlign='center' />
                    <CustomTextInput placeholder='Email' name='email' />
                    <CustomTextInput placeholder='Password' name='password' type='password' />
                    <ErrorMessage
                        name='error'
                        render={() => (
                            <Label
                                style={{ marginBottom: 10 }}
                                basic
                                color='red'
                                content={errors.error}
                            />
                        )}
                    />
                    <Button
                        disabled={!(values.email && values.password)}
                        loading={isSubmitting}
                        color='blue'
                        content='Login'
                        type='submit'
                        fluid
                    />
                </Form>
            )}
        </Formik>
    )
})
