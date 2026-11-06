import { memo, useCallback, useEffect, useState } from "react";
import { adminApi } from "../api";

const inputCls =
  "w-full rounded-xl border-2 border-black bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-200";

const Label = ({ children }) => (
  <label className="mb-1.5 block text-xs font-black uppercase">{children}</label>
);

const btn = "rounded-full px-5 py-2.5 text-xs font-bold uppercase transition disabled:opacity-50";
const btnDark = `${btn} bg-black text-white hover:bg-orange-600`;
const btnLight = `${btn} border-2 border-black hover:bg-black hover:text-white`;

const errorText = (err) => {
  const d = err.response?.data;
  if (!d) return "Server se connect nahi ho paya.";
  if (typeof d === "string") return "Server error aaya.";
  if (d.detail) return d.detail;
  return Object.entries(d)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
    .join(" · ");
};

/* ------------------------------- Login ------------------------------- */

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await adminApi.post("/login/", { username, password });
      localStorage.setItem("admin_token", data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.status === 400 ? "Username ya password galat hai." : errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8eb] px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-3xl border-2 border-black bg-white p-7 shadow-[8px_8px_0_0_#000]"
      >
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          Admin<span className="text-orange-600">✳</span>
        </h1>
        <div>
          <Label>Username</Label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" className={inputCls} />
        </div>
        <div>
          <Label>Password</Label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className={inputCls} />
        </div>
        {error && (
          <p role="alert" className="rounded-xl border-2 border-black bg-red-200 px-3 py-2 text-sm font-bold">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy || !username || !password} className={`${btnDark} w-full py-3`}>
          {busy ? "Ruko..." : "Login"}
        </button>
      </form>
    </div>
  );
};

/* ------------------------------- Posts ------------------------------- */

const emptyPost = { id: null, title: "", slug: "", excerpt: "", content: "", cover: "", tags: "", is_published: true };

const Posts = ({ onLogout }) => {
      const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleErr = useCallback(
    (err, fallback) => {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("admin_token");
        return onLogout();
      }
      flash("err", `${fallback} ${errorText(err)}`);
    },
    [onLogout]
  );

const load = useCallback(async () => {
  try {
    const { data } = await adminApi.get("/posts/");
    const list = Array.isArray(data) ? data : data?.results;
    setPosts(Array.isArray(list) ? list : []);
  } catch (err) {
    handleErr(err, "Posts load nahi hue.");
  } finally {
    setLoading(false);
  }
}, [handleErr]);

useEffect(() => {
  let ignore = false;

  const fetchPosts = async () => {
    try {
      const { data } = await adminApi.get("/posts/");

      const list = Array.isArray(data) ? data : data?.results;

      if (!ignore) {
        setPosts(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      if (!ignore) {
        handleErr(err, "Posts load nahi hue.");
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  fetchPosts();

  return () => {
    ignore = true;
  };
}, [handleErr]);;

  const openEdit = (p) =>
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug || "",
      excerpt: p.excerpt || "",
      content: p.content || "",
      cover: p.cover || "",
      tags: (p.tags || []).join(", "),
      is_published: p.is_published,
    });

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return flash("err", "Title zaroori hai.");
    if (!form.content.trim()) return flash("err", "Content khali hai.");

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt,
      content: form.content,
      cover: form.cover.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      is_published: form.is_published,
    };
    if (form.slug.trim()) payload.slug = form.slug.trim();

    setSaving(true);
    try {
      if (form.id) await adminApi.put(`/posts/${form.id}/`, payload);
      else await adminApi.post("/posts/", payload);
      flash("ok", form.id ? "Post update ho gaya." : "Post add ho gaya!");
      setForm(null);
      await load();
    } catch (err) {
      handleErr(err, "Save nahi hua.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`"${p.title}" delete kar dein?`)) return;
    try {
      await adminApi.delete(`/posts/${p.id}/`);
      flash("ok", "Post delete ho gaya.");
      await load();
    } catch (err) {
      handleErr(err, "Delete nahi hua.");
    }
  };

  const togglePublished = async (p) => {
    try {
      await adminApi.patch(`/posts/${p.id}/`, { is_published: !p.is_published });
      await load();
    } catch (err) {
      handleErr(err, "Update nahi hua.");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#fff8eb] text-black">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter sm:text-5xl">
            Blog <span className="text-orange-600">posts</span>
            <span className="text-orange-600">✳</span>
          </h1>
          <div className="flex gap-3">
            <button type="button" onClick={() => setForm({ ...emptyPost })} className={btnDark}>
              + Naya post
            </button>
            <button type="button" onClick={logout} className={btnLight}>
              Logout
            </button>
          </div>
        </header>

        {msg && (
          <p
            role="status"
            className={`mt-6 rounded-xl border-2 border-black px-4 py-3 text-sm font-bold ${
              msg.type === "ok" ? "bg-green-200" : "bg-red-200"
            }`}
          >
            {msg.text}
          </p>
        )}

        {form && (
          <form
            onSubmit={save}
            className="mt-8 space-y-5 rounded-3xl border-2 border-black bg-white p-5 shadow-[8px_8px_0_0_#000] sm:p-7"
          >
            <h2 className="text-xl font-black uppercase tracking-tighter">
              {form.id ? "Post edit karo" : "Naya post"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Title</Label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
              </div>
              <div>
                <Label>Slug (optional)</Label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="khali = auto" className={inputCls} />
              </div>
            </div>

            <div>
              <Label>Excerpt (chhota summary)</Label>
              <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputCls} />
            </div>

            <div>
              <Label>Content</Label>
              <textarea rows={12} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={`${inputCls} font-mono`} />
              <p className="mt-1.5 text-xs text-black/60">
                "# Heading", "## Subheading", "- list" (# ke baad space zaroor). Blank line = naya paragraph.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Cover image URL</Label>
                <input value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} className={inputCls} />
              </div>
              <div>
                <Label>Tags (comma se)</Label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="python, django" className={inputCls} />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                className="h-5 w-5 accent-orange-600"
              />
              Publish karo (blog page pe dikhao)
            </label>

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={saving} className={btnDark}>
                {saving ? "Saving..." : form.id ? "Update" : "Add post"}
              </button>
              <button type="button" onClick={() => setForm(null)} className={btnLight}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <section className="mt-10">
          {loading ? (
            <p className="text-sm text-black/60">Load ho raha hai...</p>
          ) : posts.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-black p-6 text-sm text-black/60">
              Abhi koi post nahi hai. "+ Naya post" se pehla likho.
            </p>
          ) : (
            <ul className="space-y-3">
              {posts.map((p) => (
                
                <li
                  key={p.id}
                  className={`flex flex-wrap items-center gap-3 rounded-2xl border-2 border-black bg-white p-4 ${
                    p.is_published ? "" : "opacity-70"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-black uppercase tracking-tighter">{p.title}</p>
                    <p className="text-xs font-bold text-orange-600">{p.is_published ? "Published" : "Draft"}</p>
                  </div>
                  <div className="flex gap-4 text-xs font-bold uppercase">
                    <button type="button" onClick={() => togglePublished(p)} className="underline underline-offset-4 hover:text-orange-600">
                      {p.is_published ? "Unpublish" : "Publish"}
                    </button>
                    <button type="button" onClick={() => openEdit(p)} className="underline underline-offset-4 hover:text-orange-600">
                      Edit
                    </button>
                    <button type="button" onClick={() => remove(p)} className="underline underline-offset-4 hover:text-red-600">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

/* -------------------------------- Page -------------------------------- */

const AdminPost = () => {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("admin_token"));
  return authed ? <Posts onLogout={() => setAuthed(false)} /> : <Login onLogin={() => setAuthed(true)} />;
};

export default memo(AdminPost);