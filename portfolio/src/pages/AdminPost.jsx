import { memo, useCallback, useEffect, useState } from "react";
import { adminApi } from "../api";

/* Har section type ke liye kaunse fields dikhane hain */
const TYPES = {
  text: { label: "Text block", hasItems: false },
  cards: {
    label: "Cards (projects, certificates...)",
    hasItems: true,
    fields: ["title", "text", "tags", "link"],
    names: { title: "Card title", text: "Description", tags: "Tags (comma se)", link: "Link (optional)" },
  },
  tags: {
    label: "Tag groups (skills jaisa)",
    hasItems: true,
    fields: ["title", "tags"],
    names: { title: "Group name", tags: "Items (comma se)" },
  },
  links: {
    label: "Links (contact jaisa)",
    hasItems: true,
    fields: ["title", "text", "link"],
    names: { title: "Label", text: "Value", link: "URL" },
  },
};

const emptyItem = { title: "", text: "", tags: "", link: "" };
const emptyForm = { id: null, title: "", section_type: "text", body: "", is_visible: true, items: [] };

const inputCls =
  "w-full rounded-xl border-2 border-black bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-200";

const Label = ({ children }) => (
  <label className="mb-1.5 block text-xs font-black uppercase">{children}</label>
);

const errorText = (err) => {
  const d = err.response?.data;
  if (!d) return "Server se connect nahi ho paya.";
  if (typeof d === "string") return "Server error aaya.";
  if (d.detail) return d.detail;
  // DRF field errors: { field: ["msg"] }
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
      const { data } = await adminApi.post("/auth/login/", { username, password });
      localStorage.setItem("admin_token", data.token);
      onLogin();
    } catch (err) {
      setError(
        err.response?.status === 400
          ? "Username ya password galat hai."
          : err.response?.status === 429
          ? "Bahut zyada attempts. Thodi der baad try karo."
          : errorText(err)
      );
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
        <h1 className="text-3xl font-black uppercase leading-[0.9] tracking-tighter">
          Admin<span className="text-orange-600">✳</span>
        </h1>
        <div>
          <Label>Username</Label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className={inputCls}
          />
        </div>
        <div>
          <Label>Password</Label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className={inputCls}
          />
        </div>
        {error && (
          <p role="alert" className="rounded-xl border-2 border-black bg-red-200 px-3 py-2 text-sm font-bold">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !username || !password}
          className="w-full rounded-full bg-black px-6 py-3 text-xs font-bold uppercase text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          {busy ? "Ruko..." : "Login"}
        </button>
      </form>
    </div>
  );
};

/* ------------------------------- Posts panel ------------------------------- */

const emptyPost = {
  id: null, title: "", slug: "", excerpt: "", content: "",
  cover: "", tags: "", is_published: true,
};

const PostsPanel = ({ onLogout }) => {
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
        onLogout();
        return;
      }
      flash("err", fallback ? `${fallback} ${errorText(err)}` : errorText(err));
    },
    [onLogout]
  );

  const load = useCallback(async () => {
    try {
      const { data } = await adminApi.get("/posts/");
      setPosts(data.results ?? data);
    } catch (err) {
      handleErr(err, "Posts load nahi hue.");
    } finally {
      setLoading(false);
    }
  }, [handleErr]);

  useEffect(() => {
    load();
  }, [load]);

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
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      is_published: form.is_published,
    };
    if (form.slug.trim()) payload.slug = form.slug.trim();
    if (form.cover.trim()) payload.cover = form.cover.trim();

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

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter sm:text-5xl">
          Blog <span className="text-orange-600">posts</span>
          <span className="text-orange-600">✳</span>
        </h1>
        <button
          type="button"
          onClick={() => setForm({ ...emptyPost })}
          className="rounded-full bg-black px-5 py-2.5 text-xs font-bold uppercase text-white transition hover:bg-orange-600"
        >
          + Naya post
        </button>
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
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <Label>Slug (optional)</Label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="khali chhodo to auto"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <Label>Excerpt (chhota summary)</Label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <Label># Heading, ## Subheading, - list; blank line = naya paragraph</Label>
            <textarea
              rows={12}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={inputCls}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Cover image URL (optional)</Label>
              <input
                value={form.cover}
                onChange={(e) => setForm({ ...form, cover: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <Label>Tags (comma se)</Label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className={inputCls}
              />
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
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-black px-6 py-3 text-xs font-bold uppercase text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : form.id ? "Update" : "Add post"}
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="rounded-full border-2 border-black px-6 py-3 text-xs font-bold uppercase transition hover:bg-black hover:text-white"
            >
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
                  p.is_published ? "" : "opacity-60"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-black uppercase tracking-tighter">{p.title}</p>
                  <p className="text-xs font-bold text-orange-600">
                    {p.is_published ? "Published" : "Draft"}
                  </p>
                </div>
                <div className="flex gap-4 text-xs font-bold uppercase">
                  <button type="button" onClick={() => togglePublished(p)}
                    className="underline underline-offset-4 transition hover:text-orange-600">
                    {p.is_published ? "Unpublish" : "Publish"}
                  </button>
                  <button type="button" onClick={() => openEdit(p)}
                    className="underline underline-offset-4 transition hover:text-orange-600">
                    Edit
                  </button>
                  <button type="button" onClick={() => remove(p)}
                    className="underline underline-offset-4 transition hover:text-red-600">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

/* ------------------------------ Item editor ------------------------------ */

const ItemsEditor = ({ type, items, onChange }) => {
  const cfg = TYPES[type];
  const update = (i, field, value) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));

  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i} className="rounded-2xl border-2 border-black bg-[#fff8eb] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {cfg.fields.map((f) => (
              <div key={f} className={f === "text" ? "sm:col-span-2" : ""}>
                <Label>{cfg.names[f]}</Label>
                {f === "text" ? (
                  <textarea
                    rows={2}
                    value={it[f]}
                    onChange={(e) => update(i, f, e.target.value)}
                    className={inputCls}
                  />
                ) : (
                  <input
                    value={it[f]}
                    onChange={(e) => update(i, f, e.target.value)}
                    className={inputCls}
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="mt-3 text-xs font-bold uppercase underline underline-offset-4 transition hover:text-red-600"
          >
            Ye item hatao
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { ...emptyItem }])}
        className="rounded-full border-2 border-dashed border-black px-5 py-2 text-xs font-bold uppercase transition hover:bg-black hover:text-white"
      >
        + Item add karo
      </button>
    </div>
  );
};

/* -------------------------------- Dashboard -------------------------------- */

const Dashboard = ({ onLogout }) => {
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState(null); // null = form band
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null); // { type, text }

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  // Token expire/invalid ho to logout
  const handleErr = useCallback(
    (err, fallback) => {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("admin_token");
        onLogout();
        return;
      }
      flash("err", fallback ? `${fallback} ${errorText(err)}` : errorText(err));
    },
    [onLogout]
  );

  const load = useCallback(async () => {
    try {
      const { data } = await adminApi.get("/sections/");
      setSections(data.results ?? data);
    } catch (err) {
      handleErr(err, "Sections load nahi hue.");
    } finally {
      setLoading(false);
    }
  }, [handleErr]);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => setForm({ ...emptyForm });

  const openEdit = (s) =>
    setForm({
      id: s.id,
      title: s.title,
      section_type: s.section_type,
      body: s.body,
      is_visible: s.is_visible,
      items: s.items.map((it) => ({ ...emptyItem, ...it, tags: (it.tags || []).join(", ") })),
    });

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return flash("err", "Title zaroori hai.");
    if (form.section_type === "text" && !form.body.trim())
      return flash("err", "Text block ka content khali hai.");

    const payload = {
      title: form.title.trim(),
      section_type: form.section_type,
      is_visible: form.is_visible,
      body: form.section_type === "text" ? form.body : "",
      items: TYPES[form.section_type].hasItems
        ? form.items
            .filter((it) => it.title.trim() || it.text.trim())
            .map((it) => ({
              title: it.title,
              text: it.text,
              link: it.link,
              tags: it.tags.split(",").map((t) => t.trim()).filter(Boolean),
            }))
        : [],
    };

    setSaving(true);
    try {
      if (form.id) await adminApi.put(`/sections/${form.id}/`, payload);
      else await adminApi.post("/sections/", payload);
      flash("ok", form.id ? "Section update ho gaya." : "Section add ho gaya!");
      setForm(null);
      await load();
    } catch (err) {
      handleErr(err, "Save nahi hua.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s) => {
    if (!window.confirm(`"${s.title}" delete kar dein?`)) return;
    try {
      await adminApi.delete(`/sections/${s.id}/`);
      flash("ok", "Section delete ho gaya.");
      await load();
    } catch (err) {
      handleErr(err, "Delete nahi hua.");
    }
  };

  const toggleVisible = async (s) => {
    try {
      await adminApi.patch(`/sections/${s.id}/`, { is_visible: !s.is_visible });
      await load();
    } catch (err) {
      handleErr(err, "Update nahi hua.");
    }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next); // turant dikhao
    try {
      await adminApi.post("/sections/reorder/", { ids: next.map((s) => s.id) });
    } catch (err) {
      handleErr(err, "Order save nahi hua.");
      load();
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
            Home <span className="text-orange-600">sections</span>
            <span className="text-orange-600">✳</span>
          </h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={openNew}
              className="rounded-full bg-black px-5 py-2.5 text-xs font-bold uppercase text-white transition hover:bg-orange-600"
            >
              + Naya section
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

        {/* Form */}
        {form && (
          <form
            onSubmit={save}
            className="mt-8 space-y-5 rounded-3xl border-2 border-black bg-white p-5 shadow-[8px_8px_0_0_#000] sm:p-7"
          >
            <h2 className="text-xl font-black uppercase tracking-tighter">
              {form.id ? "Section edit karo" : "Naya section"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Title</Label>
                <input
                  value={form.title}
                  maxLength={120}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <Label>Type</Label>
                <select
                  value={form.section_type}
                  onChange={(e) => setForm({ ...form, section_type: e.target.value, items: [] })}
                  className={inputCls}
                >
                  {Object.entries(TYPES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {form.section_type === "text" ? (
              <div>
                <Label>Content (blank line = naya paragraph)</Label>
                <textarea
                  rows={8}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className={inputCls}
                />
              </div>
            ) : (
              <ItemsEditor
                type={form.section_type}
                items={form.items}
                onChange={(items) => setForm({ ...form, items })}
              />
            )}

            <label className="flex cursor-pointer items-center gap-3 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                className="h-5 w-5 accent-orange-600"
              />
              Home page par dikhao
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-black px-6 py-3 text-xs font-bold uppercase text-white transition hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : form.id ? "Update" : "Add section"}
              </button>
              <button
                type="button"
                onClick={() => setForm(null)}
                className="rounded-full border-2 border-black px-6 py-3 text-xs font-bold uppercase transition hover:bg-black hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* List */}
        <section className="mt-10">
          {loading ? (
            <p className="text-sm text-black/60">Load ho raha hai...</p>
          ) : sections.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-black p-6 text-sm text-black/60">
              Abhi koi extra section nahi hai. "+ Naya section" se pehla banao.
            </p>
          ) : (
            <ul className="space-y-3">
              {sections.map((s, i) => (
                <li
                  key={s.id}
                  className={`flex flex-wrap items-center gap-3 rounded-2xl border-2 border-black bg-white p-4 ${
                    s.is_visible ? "" : "opacity-60"
                  }`}
                >
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Upar le jao"
                      className="px-2 text-sm font-black leading-none transition hover:text-orange-600 disabled:opacity-25"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === sections.length - 1}
                      aria-label="Neeche le jao"
                      className="px-2 text-sm font-black leading-none transition hover:text-orange-600 disabled:opacity-25"
                    >
                      ▼
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-black uppercase tracking-tighter">
                      {s.title}
                    </p>
                    <p className="text-xs font-bold text-orange-600">
                      {TYPES[s.section_type]?.label ?? s.section_type}
                      {!s.is_visible && " · hidden"}
                    </p>
                  </div>

                  <div className="flex gap-4 text-xs font-bold uppercase">
                    <button
                      type="button"
                      onClick={() => toggleVisible(s)}
                      className="underline underline-offset-4 transition hover:text-orange-600"
                    >
                      {s.is_visible ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(s)}
                      className="underline underline-offset-4 transition hover:text-orange-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(s)}
                      className="underline underline-offset-4 transition hover:text-red-600"
                    >
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

/* --------------------------------- Page --------------------------------- */

const Admin = () => {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("admin_token"));
  const [tab, setTab] = useState("posts");

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const logout = () => {
    localStorage.removeItem("admin_token");
    setAuthed(false);
  };

  return (
    <div className="min-h-screen bg-[#fff8eb] text-black">
      <nav className="border-b-2 border-black bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
          {[["posts", "Posts"], ["sections", "Sections"]].map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`rounded-full border-2 border-black px-5 py-2 text-xs font-bold uppercase transition ${
                tab === k ? "bg-black text-white" : "hover:bg-orange-600 hover:text-white"
              }`}
            >
              {l}
            </button>
          ))}
          <button
            type="button"
            onClick={logout}
            className="ml-auto rounded-full border-2 border-black px-5 py-2 text-xs font-bold uppercase transition hover:bg-black hover:text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      {tab === "posts" ? (
        <PostsPanel onLogout={() => setAuthed(false)} />
      ) : (
        <Dashboard onLogout={() => setAuthed(false)} />
      )}
    </div>
  );
};

export default memo(Admin);
