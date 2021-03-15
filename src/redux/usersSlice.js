import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
  },
  reducers: {
    addUser(state, action) {
      state.users.push(action.payload);
    },
    updateUser(state, action) {
      const {
        id,
        username,
        phone,
        email,
        country,
        location,
        photo,
        breif,
      } = action.payload;
      const existingUser = state.users.find((user) => user.id === id);
      if (existingUser) {
        existingUser.username = username;
        existingUser.phone = phone;
        existingUser.email = email;
        existingUser.country = country;
        existingUser.location = location;
        existingUser.photo = photo;
        existingUser.breif = breif;
      }
    },
    deleteUser(state, action) {
      const { id } = action.payload;
      const existingUser = state.users.find((user) => user.id === id);
      if (existingUser) {
        state.users = state.users.filter((user) => user.id !== id);
      }
    },
  },
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;

export default usersSlice.reducer;
