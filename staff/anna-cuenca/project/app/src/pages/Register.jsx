

import { Button, Link, Form, Field, Container } from '../library'
import logic from '../logic'


import { useContext } from '../hooks'

function Register(props) {
    console.log('Register')

    const context = useContext()

    function handleSubmit(event) {
        event.preventDefault()

        const nameInput = event.target.querySelector('#name-input')
        const emailInput = event.target.querySelector('#email-input')
        const passwordInput = event.target.querySelector('#password-input')
        const robotInput = event.target.querySelector('#robot-input')

        const name = nameInput.value
        const email = emailInput.value
        const password = passwordInput.value
        const robot = robotInput.value

        // console.log(name, email, password)

        try {
            logic.registerUser(name, email, password, robot)
                .then(() => props.onSuccess())
                .catch(error => context.handleError(error))

        } catch (error) {
            //alert(error.message)

            context.handleError(error)
        }
    }

    function handleLoginClick(event) {
        event.preventDefault()

        // console.log('login click')
        props.onLoginClick()
    }

    return <div className="custom-background"> <Container>
        <h1>Register</h1>

        <Form onSubmit={handleSubmit}>
            <Field id="name-input">Name</Field>
            <Field id="email-input" type="email">E-mail</Field>
            <Field id="password-input" type="password">Password</Field>
            <Field id="robot-input" type="text">Robot Model</Field>

            <Button type="submit">Register</Button>
        </Form>

        <Link onClick={handleLoginClick}>Login</Link>
    </Container>
    </div>
}



export default Register