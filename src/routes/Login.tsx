import { login } from "../api/auth";
import { useState, useRef } from "react";

function Login() {
  const [dataToPost, setDataToPost] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState({
    username: false,
    password: false,
  });
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const validate = (
    fieldName: string,
    fieldValue: string | undefined,
    rule: string
  ) => {
    if (rule === "required") {
      if (!fieldValue || fieldValue.trim().length === 0) {
        setError({ ...error, [fieldName]: true });
        return false;
      }
    }
    setError({ ...error, [fieldName]: false });
    return true;
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    validate("username", username, "required");
    validate("password", password, "required");

    if (error.username || error.password) {
      return;
    }

    const response = await login(dataToPost);

    console.log(response);
  };

  return (
    <div>
      <form className="splunk-login" onSubmit={onLogin}>
        <h1 className="splunk-login-title">Splunk Login</h1>
        <label htmlFor="username">
          Username
          <input
            type="text"
            placeholder="Username"
            id="username"
            name="username"
            onChange={(e) =>
              setDataToPost({ ...dataToPost, username: e.target.value })
            }
            ref={usernameRef}
            onBlur={() =>
              validate("username", usernameRef.current?.value, "required")
            }
          />
          {error.username && (
            <p className="error-message">Username is required</p>
          )}
        </label>

        <label htmlFor="password">
          Password
          <input
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            onChange={(e) =>
              setDataToPost({ ...dataToPost, password: e.target.value })
            }
            ref={passwordRef}
            onBlur={() =>
              validate("password", passwordRef.current?.value, "required")
            }
          />
          {error.password && (
            <p className="error-message">Password is required</p>
          )}
        </label>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
