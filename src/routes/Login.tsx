function Login() {
  return (
    <div>
      <form className="splunk-login">
        <h1 className="splunk-login-title">Splunk Login</h1>
        <label htmlFor="username">
          Username
          <input type="text" placeholder="Username" id="username" />
        </label>

        <label htmlFor="password">
          Password
          <input type="password" placeholder="Password" id="password" />
        </label>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
