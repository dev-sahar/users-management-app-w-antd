import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { deleteUser } from '../../redux/usersSlice';

const UsersList = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.users);

  const [dataSource, setDataSource] = useState(users);
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    e.preventDefault();
    const currValue = e.target.value;
    setValue(currValue);
    const filteredData = users.filter((user) =>
      user.username.toLowerCase().includes(currValue.toLowerCase())
    );
    setDataSource(filteredData);
  };

  const handleDelete = (record) => {
    const id = record.id;
    if (window.confirm('Are you sure you want to delete user?')) {
      dispatch(deleteUser({ id }));
    } else {
      return;
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) setDataSource(users);
    return () => {
      isMounted = false;
    };
  }, [users]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size='middle'>
          <Button onClick={() => handleDelete(record)}>Delete</Button>
          <Link to={`/edit-user/${record.id}`}>
            <Button>Edit</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row type='flex' gutter={12} style={{ margin: 20 }}>
        <Col flex='70%'>
          <Input
            placeholder='Search Username'
            value={value}
            onChange={handleChange}
          />
        </Col>
        <Col flex='auto'>
          <Link to='/add-user'>
            <Button className='button-primary'>Add user</Button>
          </Link>
        </Col>
      </Row>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
};

export default UsersList;
