class UserService {
  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.username : null; // Retourne le username ou null
  }
}

export default new UserService();
