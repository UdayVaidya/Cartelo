import { useState, useRef } from "react";
import { gsap } from "gsap";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import GoogleButton from "./GoogleButton";
import { useAuth } from "../../hooks/useAuth";
import ErrorPage from "./ErrorPage";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({
    fullName: "", email: "", contact: "", password: "", confirmPassword: "", role: "buyer",
  });
  const [showPass, setShowPass] = useState(false);
  const formRef = useRef(null);
  const {handleRegister,loading,error} = useAuth();
  const navigate = useNavigate();

  const shakeForm = () => {
    gsap.fromTo(formRef.current, { x: -10 }, { x: 0, duration: 0.45, ease: "elastic.out(1, 0.3)" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { shakeForm(); return; }
    
    // Call handleRegister without a try-catch, as useAuth handles errors internally
    const success = await handleRegister({
      email: form.email,
      contact: form.contact,
      password: form.password,
      fullName: form.fullName,
      isSeller: form.role === "seller"
    });

    if(success){
      navigate("/");
    }
  };

  if(loading){
    return <div>Loading...</div>
  }

  if(error){
    return <ErrorPage error={error} onRetry={() => window.location.reload()} />
  }

  const strength = Math.min(4, [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(form.password)).length);
  const strengthColors = ["", "#ba1a1a", "#f59e0b", "#0039b5", "#16a34a"];
  const strengthLabels = ["", "Weak", "Fair", "Strong", "Excellent"];

  return (
    <form ref={formRef} onSubmit={handleSubmit} id="register-form" noValidate className="flex flex-col gap-0 w-full">

      <div className="mb-5">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-[#f5c518] mb-2" style={{ fontFamily: "Inter" }}>
          New account
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#f0f0f0]" style={{ fontFamily: "Manrope" }}>
          Join the Marketplace.
        </h1>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4 mb-6">
        <InputField id="reg-name" label="Full Name" type="text" value={form.fullName}
          onChange={(v) => setForm((p) => ({ ...p, fullName: v }))} />

        <InputField id="reg-email" label="Email address" type="email" value={form.email}
          onChange={(v) => setForm((p) => ({ ...p, email: v }))} />

        <InputField id="reg-contact" label="Phone / Contact" type="tel" value={form.contact}
          onChange={(v) => setForm((p) => ({ ...p, contact: v }))} />

        {/* Role */}
        <div>
          <p className="text-[0.6875rem] uppercase tracking-[0.15em] text-[#666] mb-2" style={{ fontFamily: "Inter" }}>
            I am a…
          </p>
          <div className="flex gap-3">
            {["buyer", "seller"].map((r) => (
              <button
                key={r}
                type="button"
                id={`role-${r}`}
                onClick={() => setForm((p) => ({ ...p, role: r }))}
                className={`flex-1 py-2 text-sm font-semibold border transition-colors duration-150 ${
                  form.role === r
                    ? "bg-[#f5c518] text-black border-[#f5c518]"
                    : "bg-transparent text-[#f0f0f0] border-[#2a2a2a] hover:border-[#f5c518]"
                }`}
                style={{ fontFamily: "Inter", borderRadius: "0.25rem" }}
              >
                {r === "buyer" ? "Buyer" : "Seller"}
              </button>
            ))}
          </div>
        </div>

        {/* Passwords — stack on mobile, side-by-side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <InputField id="reg-pass" label="Password" type={showPass ? "text" : "password"}
              value={form.password} onChange={(v) => setForm((p) => ({ ...p, password: v }))} />
            <button type="button" onClick={() => setShowPass(s => !s)}
              className="mt-1 text-[0.6875rem] text-[#666] hover:text-[#f5c518] transition-colors" style={{ fontFamily: "Inter" }}>
              {showPass ? "Hide password" : "Show password"}
            </button>
          </div>
          <InputField id="reg-confirm" label="Confirm password" type={showPass ? "text" : "password"}
            value={form.confirmPassword} onChange={(v) => setForm((p) => ({ ...p, confirmPassword: v }))} />
        </div>

        {/* Strength bar */}
        {form.password && (
          <div className="flex items-center gap-3">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-0.5 flex-1 transition-all duration-300"
                  style={{ background: n <= strength ? strengthColors[strength] : "#2a2a2a" }} />
              ))}
            </div>
            <span className="text-[0.6875rem] font-semibold w-16 text-right"
              style={{ color: strengthColors[strength], fontFamily: "Inter" }}>
              {strengthLabels[strength]}
            </span>
          </div>
        )}
      </div>

      <SubmitButton label="Create Account" />

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-[#2a2a2a]" />
        <span className="text-[0.6875rem] uppercase tracking-widest text-[#666]" style={{ fontFamily: "Inter" }}>or</span>
        <div className="flex-1 h-px bg-[#2a2a2a]" />
      </div>

      <GoogleButton />

      <p className="text-center text-md text-[#666] mt-4" style={{ fontFamily: "Inter" }}>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-[#f5c518] font-semibold hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
}
