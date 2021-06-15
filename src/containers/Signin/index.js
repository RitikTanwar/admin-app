import React,{useEffect, useState} from 'react'
import {Form,Button, Container, Row, Col } from 'react-bootstrap'
import Layout from '../../components/Layout'
import Input from '../../components/UI/Input/Input'
import {login} from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

const Signin=(props)=> {

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const auth=useSelector(state=>state.auth);

    const dispatch=useDispatch();
    const userLogin=(e)=>{
        e.preventDefault()
        const user={
            email,password
        }
        dispatch(login(user));
    }
    if(auth.authenticate){
        return <Redirect to="/" />
    }
    return (
        <Layout>
            <Container>
                <Row style={{marginTop:'50px'}}>
                    <Col md={{span:4,offset:4 }}>
                        <Form onSubmit={userLogin}>
                            <Input 
                                label="Email"
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e)=>{setEmail(e.target.value)}}
                                errorMsg="We'll never share your email with anyone else."
                            />
                            <Input 
                                label="Password"
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e)=>{setPassword(e.target.value)}}
                            />
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Layout>
    )
}

export default Signin
