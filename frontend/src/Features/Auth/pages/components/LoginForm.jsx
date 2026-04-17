import { useState, useRef } from "react";
import { gsap } from "gsap";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import GoogleButton from "./GoogleButton";
import { useAuth } from "../../hooks/useAuth";
import ErrorPage from "./ErrorPage";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const formRef = useRef(null);
  const {handleLogin,loading,error} = useAuth();
  const navigate = useNavigate();

  const shakeForm = () => {
    gsap.fromTo(formRef.current, { x: -10 }, { x: 0, duration: 0.45, ease: "elastic.out(1, 0.3)" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { shakeForm(); return; }
    const success = await handleLogin(form);
    if (success) {
      navigate("/dashboard");
    }
  };

  if(loading){
    return <div>Loading...</div>
  }

  if(error){
    return <ErrorPage error={error} onRetry={() => window.location.reload()} />
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} id="login-form" noValidate className="flex flex-col gap-0 w-full">

      {/* Header */}
      <div className="mb-10">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-[#f5c518] mb-3" style={{ fontFamily: "Inter" }}>
          Welcome back
        </p>
        <h1 className="text-4xl font-bold leading-tight text-[#f0f0f0]" style={{ fontFamily: "Manrope" }}>
          Sign in to<br />your account.
        </h1>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-7 mb-8">
        <InputField
          id="login-email"
          label="Email address"
          type="email"
          value={form.email}
          onChange={(v) => setForm((p) => ({ ...p, email: v }))}
        />
        <InputField
          id="login-password"
          label="Password"
          type={showPass ? "text" : "password"}
          value={form.password}
          onChange={(v) => setForm((p) => ({ ...p, password: v }))}
          endAction={
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="text-xs text-[#666] hover:text-[#f5c518] transition-colors"
              style={{ fontFamily: "Inter" }}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          }
        />
      </div>

      {/* Forgot */}
      <div className="flex justify-end mb-8">
        <a href="#" className="text-xs text-[#666] hover:text-[#f5c518] transition-colors" style={{ fontFamily: "Inter" }}>
          Forgot password?
        </a>
      </div>

      <SubmitButton label="Sign In" />

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#2a2a2a]" />
        <span className="text-[0.6875rem] uppercase tracking-widest text-[#666]" style={{ fontFamily: "Inter" }}>or</span>
        <div className="flex-1 h-px bg-[#2a2a2a]" />
      </div>

      <GoogleButton />

      {/* Switch */}
      <p className="text-center text-xs text-[#666] mt-6" style={{ fontFamily: "Inter" }}>
        No account?{" "}
        <button type="button" onClick={onSwitch} className="text-[#f5c518] font-semibold hover:underline">
          Create one
        </button>
      </p>
    </form>
  );
}
