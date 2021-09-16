import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../components/Loading'
import Message from '../components/message'
import { listUsers,deleteUser} from '../context/user_context'
import {FaCheck,FaEdit,FaTrashAlt} from 'react-icons/fa'
function UserListScreen({ history }) {

    const dispatch = useDispatch()

    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete


    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers())
        } else {
            history.push('/login')
        }

    }, [dispatch, history, successDelete, userInfo])


    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(id))
        }
    }

    return (
        <div>
            <h1>Users</h1>
            {loading
                ? (<Loading />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>PRODUCT MANAGER</th>
                                    <th>SALES MANAGER</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                         <td>{user.email}</td>
                                         <td>{user.isAdmin && !user.isSalesManager? (
                                            <FaCheck></FaCheck>
                                        ):<i></i>}</td>
                                         <td>{user.isAdmin && user.isSalesManager ? (
                                            <FaCheck></FaCheck>
                                        ):<i></i>}</td>

                                        <td>
                                            <LinkContainer to={`/admin/user/${user.id}/edit`}>
                                                <Button variant='light' className='btn-sm'>
                                                    <FaEdit></FaEdit>
                                                </Button>
                                            </LinkContainer>

                                            <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user.id)}>
                                                <FaTrashAlt></FaTrashAlt>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
        </div>
    )
}

export default UserListScreen