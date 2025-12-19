export const users = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    email: "admin@newsportal.com",
    role: "admin",
    createdAt: new Date("2025-09-01"),
  },
];

let userIdCounter = 2;

export const createUser = (username, email, password) => {
  const newUser = {
    id: userIdCounter++,
    username,
    email,
    password,
    role: "user",
    createdAt: new Date(),
  };
  users.push(newUser);
  return newUser;
};

export const findUserByUsername = (username) => {
  return users.find((u) => u.username === username);
};

export const findUserByEmail = (email) => {
  return users.find((u) => u.email === email);
};

export const deleteUser = (id) => {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
};

export default {
  users,
  createUser,
  findUserByUsername,
  findUserByEmail,
  deleteUser,
};
