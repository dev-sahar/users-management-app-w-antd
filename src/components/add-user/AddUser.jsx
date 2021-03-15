import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  message,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { useHistory, useParams } from 'react-router-dom';

import { fetchCountries } from '../../axios/axios';
import { addUser, updateUser } from '../../redux/usersSlice';

import CurrentLocation from './CurrentLocation';

const AddUser = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const user = useSelector((state) =>
    state.users.users.find((user) => user.id === params.id)
  );

  const [userInfo, setUserInfo] = useState({
    username: '',
    phone: '',
    email: '',
    country: '',
    location: '',
    photo: '',
    breif: '',
  });

  const { username, phone, email, country, location, photo, breif } = userInfo;

  const { Option } = Select;
  const [form] = Form.useForm();

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  };

  useEffect(() => {
    let isMounted = true;
    if (params && user && isMounted) {
      setIsEditing(true);
      setUserInfo({
        username: user.username,
        phone: user.phone,
        email: user.email,
        country: user.country,
        location: user.location,
        photo: user.photo || '',
        breif: user.breif || '',
      });

      form.setFieldsValue({
        username: user.username,
        phone: user.phone,
        email: user.email,
        country: user.country,
        location: user.location,
        photo: user.photo || '',
        breif: user.breif || '',
      });
    } else {
      setIsEditing(false);
    }

    return () => {
      isMounted = false;
    };
  }, [form, params, user]);

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchedCountries = async () => {
      const countries = await fetchCountries();
      if (isMounted) setCountries(countries);
    };
    fetchedCountries();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setUserInfo((userInfoObj) => ({ ...userInfoObj, [name]: value }));
  };

  const handleClick = (values) => {
    const { username, phone, email, country, location, photo, breif } = values;
    if (!isEditing) {
      dispatch(
        addUser({
          id: uuid(),
          username,
          phone,
          email,
          country,
          location,
          photo: photo || '',
          breif: breif || '',
        })
      );
    } else {
      const { id } = params;
      dispatch(
        updateUser({
          id,
          username,
          phone,
          email,
          country,
          location,
          photo: photo || '',
          breif: breif || '',
        })
      );
    }

    setIsEditing(false);
    history.push('/');
  };

  const getLocationInfo = (childData) => {
    setUserInfo((userInfoObj) => ({ ...userInfoObj, location: childData }));
    form.setFieldsValue({ location: childData });
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const [loading, setLoading] = useState(false);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setUserInfo((userInfoObj) => ({ ...userInfoObj, photo: imageUrl }));
        form.setFieldsValue({
          photo: imageUrl,
        });
        setLoading(false);
      });
    }
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  return (
    <div>
      <div className='row'>
        <h2>{!isEditing ? `Add user` : `Edit user`}</h2>
      </div>

      <Form {...layout} form={form} name='users-form' onFinish={handleClick}>
        {/* Username */}
        <Form.Item
          name='username'
          value={username}
          label='Username'
          rules={[
            {
              required: true,
              message: 'Username is required',
            },
            {
              min: 8,
              max: 8,
              message: 'Username must be 8 characters long',
            },
            {
              pattern: /^[a-zA-Z_-]+$/,
              message: 'Usename should not contain spaces or numbers',
            },
          ]}
          onChange={handleChange}
        >
          <Input />
        </Form.Item>
        {/* Phone Number */}
        <Form.Item
          name='phone'
          value={phone}
          label='Phone Number'
          rules={[
            {
              required: true,
              message: 'Phone number is required',
            },
            {
              type: 'number',
              message: 'Please enter a valid number',
            },
            {
              pattern: /^\d{10}$/,
              message: 'Please enter a 10 digit number!',
            },
          ]}
          onChange={handleChange}
        >
          <InputNumber
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
        {/* Email */}
        <Form.Item
          name='email'
          value={email}
          label='Email'
          rules={[
            {
              required: true,
              message: 'Email is required',
            },
            {
              type: 'email',
              message: 'Please enter a valid email address',
            },
          ]}
          onChange={handleChange}
        >
          <Input />
        </Form.Item>
        {/* Country */}
        <Form.Item
          name='country'
          value={country}
          label='Country'
          rules={[{ required: true, message: 'Country is required' }]}
          onChange={handleChange}
        >
          <Select placeholder='Select a country' allowClear>
            {countries.map((country, index) => (
              <Option key={index} value={country}>
                {country}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* Location */}
        <Form.Item
          name='location'
          value={location}
          label='Location'
          rules={[
            {
              required: true,
              message: 'Location is required',
            },
          ]}
          //dependencies={['country']}
        >
          <CurrentLocation
            country={form.getFieldValue('country')}
            getLocationInfo={getLocationInfo}
          />
        </Form.Item>
        {/* Photo */}
        <Form.Item name='photo' valuePropName={photo} label='Photo'>
          <Upload
            name='avatar'
            listType='picture-card'
            className='avatar-uploader'
            showUploadList={false}
            maxCount={1}
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            customRequest={dummyRequest}
          >
            {photo ? (
              <img src={photo} alt='avatar' style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        {/* Breif */}
        <Form.Item
          name='breif'
          value={breif}
          label='Breif'
          rules={[
            {
              min: 10,
              max: 100,
              message: 'Breif must be between 10 and 100 characters',
            },
          ]}
          onChange={handleChange}
        >
          <Input.TextArea />
        </Form.Item>
        {/* Save Button */}
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Button type='primary' htmlType='submit'>
            {!isEditing ? `Add user` : `Save user`}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddUser;
