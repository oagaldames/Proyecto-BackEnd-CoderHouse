import UsersDao from "../dao/dbManagers/users.manager.js";

const usersDao = new UsersDao();

const getUsers = async () => {
  const result = await usersDao.getUsers();
  return result;
};

const getUserById = async (id) => {
  const result = await usersDao.getUserById(id);
  return result;
};

const createUser = async (user) => {
  const result = await usersDao.createUser(user);
  return result;
};

export { getUsers, getUserById, createUser };
