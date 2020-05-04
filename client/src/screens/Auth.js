/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import {
  Redirect,
  useLocation
} from 'react-router-dom';
import {
  Formik, Field, Form, ErrorMessage
} from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import Layout from '../components/layout';
import useActions from '../hooks/useActions';
import { logIn, authSelector } from '../redux/ducks/auth';

export default function Auth() {
  const location = useLocation();

  const [logInApi] = useActions([logIn]);

  const login = (credentials) => {
    logInApi({
      credentials
    });
  };
  const authToken = !!useSelector(authSelector);
  if (authToken) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { from: location }
        }}
      />
    );
  }
  return (
    <Layout>
      <Formik
        initialValues={{
          login: '',
          password: '',
          acceptTerms: false
        }}
        validationSchema={Yup.object().shape({
          login: Yup.string()
            .required('Login is required'),
          password: Yup.string()
            .min(5, 'Password must be at least 5 characters')
            .required('Password is required'),
          acceptTerms: Yup.bool()
            .oneOf([true], 'Accept Ts & Cs is required')
        })}
        onSubmit={(fields) => login(fields)}
      >
        {({ errors, touched }) => (
          <Form>
            <div>
              <div className="form-group col-5">
                <label htmlFor="login">Login</label>
                <Field name="login" type="text" className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`} />
                <ErrorMessage name="login" className="invalid-feedback" component="div" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="password">Password</label>
                <Field name="password" type="password" className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`} />
                <ErrorMessage name="password" component="div" className="invalid-feedback" />
              </div>
            </div>
            <div className="form-group form-check">
              <Field type="checkbox" name="acceptTerms" className={`form-check-input ${errors.acceptTerms && touched.acceptTerms ? ' is-invalid' : ''}`} />
              <label htmlFor="acceptTerms" className="form-check-label">Accept Terms & Conditions</label>
              <ErrorMessage name="acceptTerms" component="div" className="invalid-feedback" />
            </div>
            <div className="form-group">
              <button type="submit">LogIn</button>
              <button type="reset">Reset</button>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
