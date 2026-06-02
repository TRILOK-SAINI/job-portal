import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const { user, checkAuth } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  useEffect(() => {
    if (!user) return;

    if (user.role === "employer") {
      navigate("/employer");
    } else {
      navigate("/candidate");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isLogin) {
        await axios.post(
          `${API}/auth/login`,
          {
            email: formData.email,
            password: formData.password,
          },
          {
            withCredentials: true,
          }
        );

        const loggedInUser = await checkAuth();

        if (loggedInUser?.role === "employer") {
          navigate("/employer");
        } else {
          navigate("/candidate");
        }
      } else {
        await axios.post(`${API}/auth/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        alert("Account created successfully");

        setIsLogin(true);

        setFormData({
          name: "",
          email: "",
          password: "",
          role: "candidate",
        });
      }
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-md p-6 rounded-xl shadow-lg"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Create Account"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border"
              >
                <option value="candidate">
                  Candidate
                </option>

                <option value="employer">
                  Employer
                </option>
              </select>
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg text-white"
            style={{
              background: "var(--primary)",
            }}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            onClick={() =>
              setIsLogin(!isLogin)
            }
            className="font-medium"
            style={{
              color: "var(--primary)",
            }}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}