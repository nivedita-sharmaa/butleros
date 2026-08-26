import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConciergeBell, Mail, Lock, Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://hatbox-scanner-subscribe.ngrok-free.dev/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");
      navigate("/dashboard");
      console.log("Login response:", data);
    } catch (error) {
      console.log("Login error:", error);
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const isError = message && message !== "Login successful!";

  return (
    <div className="fixed inset-0 bg-[#f7f8fa] flex items-center justify-center p-5 font-['Inter']">
      <div className="w-full max-w-[1050px] bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden grid lg:grid-cols-2">
        {/* Left panel — brand / ambience */}
        <div className="hidden lg:flex p-10 bg-ink text-white relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between w-full">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent to-indigo-400 grid place-items-center">
                  <ConciergeBell className="w-5 h-5" />
                </div>
                <div>
                  <b className="text-xl">ButlerOS</b>
                  <div className="text-xs text-slate-400">Service Operations</div>
                </div>
              </div>

              <span className="inline-flex px-3 py-1.5 rounded-full bg-white/10 text-cyan-300 text-xs font-bold">
                SMART SERVICE DESK
              </span>
              <h1 className="text-5xl font-black tracking-tight mt-5 leading-tight">
                Every request.
                <br />
                Handled beautifully.
              </h1>
              <p className="text-slate-400 mt-5 max-w-md">
                Coordinate employees, managers and butlers with real-time service requests,
                alerts and task tracking.
              </p>
            </div>

            <p className="text-xs text-slate-500">Admin · Manager · Employee · Butler</p>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="p-7 md:p-10">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-accent text-white grid place-items-center">
              <ConciergeBell className="w-5 h-5" />
            </div>
            <b className="text-xl text-ink">ButlerOS</b>
          </div>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest font-bold text-violet-600">
              Welcome back
            </p>
            <h2 className="text-3xl font-black mt-2 text-ink">Sign in to your workspace</h2>
            <p className="text-sm text-slate-400 mt-2">
              Use your registered email and password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500">Email address</label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-violet-400 transition-colors text-ink"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-violet-400 transition-colors text-ink"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-3.5"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-ink text-white font-bold shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-transform"
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>

            {message && (
              <p
                className={`text-center text-sm font-semibold ${
                  isError ? "text-red-500" : "text-emerald-500"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;