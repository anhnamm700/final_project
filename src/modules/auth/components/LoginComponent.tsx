import React, { useState } from 'react';
import { useFormik, Formik, Form, Field } from 'formik';
// import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'

import './Login.css';
import ButtonComponent from 'modules/components/ButtonComponent';
import { ILoginParams } from 'models/auth';

interface Props {
  onLogin: (values: any) => void
}


const LoginComponent = (props: Props) => {
    const { onLogin } = props;
    const [values, setValues] = useState<ILoginParams>({ email: '', password: '', rememberMe: false });


    const onSubmitLogin = (e: any) => {
        e.preventDefault();
        onLogin(values);
    }

    function validateEmail(value: any) {
        let error;
        if (!value) {
          error = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          error = 'Invalid email address';
        } else {
            error = '';
        }
        return error;
      }
      
      function validatePassword(value: any) {
        let error;
        if (!value) {
          error = 'Password is required';
        } else {
            error = '';
        }
        return error;
      }

    return (
        <Formik
            initialValues={{
                email: '',
                password: ''
            }}

            onSubmit={(values, actions) => {
                // console.log({ values, actions });
                // alert(JSON.stringify(values, null, 2));
                actions.setSubmitting(false);

                onLogin(values);
            }}
     >
       {({ errors, touched, isValidating, values, handleChange }) => (
         <Form className="form">
           <Field 
                name="email" 
                validate={validateEmail} 
                value={values.email} 
                onChange={handleChange} 
                placeholder="Email" 
                className="input"
                type="text"
            />
           {errors.email && touched.email && <div className='error'>{errors.email}</div>}
 
           <Field 
                name="password" 
                validate={validatePassword} 
                value={values.password} 
                onChange={handleChange} 
                placeholder="Password" 
                className="input"
                type="password"
            />
           {errors.password && touched.password && <div className='error'>{errors.password}</div>}

           <ButtonComponent
                variant='primary'
                size='m'
                value='Đăng nhập'
                icon={<FontAwesomeIcon icon={faRightToBracket}/>}
                type='submit'
            /> 
         </Form>
       )}
     </Formik>

    );
}

export default LoginComponent;