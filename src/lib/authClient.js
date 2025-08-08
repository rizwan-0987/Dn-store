

const USERS_KEY = "auth.users.v1";
const SESSION_KEY = "auth.session.v1";

const authEvents = new EventTarget();
function emitAuthChange() {
    try {
        localStorage.setItem("auth.ping", String(Date.now()));
    } catch { }
    authEvents.dispatchEvent(new Event("change"));
}

function delay(ms = 600) {
    return new Promise((res) => setTimeout(res, ms));
}

function loadUsers() {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSession(user) {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function validateEmail(email) {
    return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(String(email || "").trim());
}

function validatePassword(pw) {
    return String(pw || "").length >= 6;
}

function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

export async function signup({ name, email, password }) {
    await delay();
    const cleanEmail = normalizeEmail(email);
    if (!validateEmail(cleanEmail)) throw new Error("Invalid email address");
    if (!validatePassword(password)) throw new Error("Password must be at least 6 characters");

    const users = loadUsers();
    const exists = users.find((u) => u.email === cleanEmail);
    if (exists) throw new Error("An account with this email already exists");

    const user = {
        id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
        name: String(name || "").trim() || cleanEmail.split("@")[0],
        email: cleanEmail,
        pw: btoa(String(password)),
        createdAt: Date.now(),
    };
    users.push(user);
    saveUsers(users);

    const sessionUser = { id: user.id, name: user.name, email: user.email };
    saveSession(sessionUser);
    emitAuthChange();
    return sessionUser;
}

export async function login({ email, password }) {
    await delay();
    const cleanEmail = normalizeEmail(email);
    const users = loadUsers();
    const found = users.find((u) => u.email === cleanEmail);
    if (!found) throw new Error("No account found with this email");
    const ok = found.pw === btoa(String(password));
    if (!ok) throw new Error("Incorrect password");

    const sessionUser = { id: found.id, name: found.name, email: found.email };
    saveSession(sessionUser);
    emitAuthChange();
    return sessionUser;
}

export function logout() {
    saveSession(null);
    emitAuthChange();
}

export function onAuthChange(cb) {
    if (typeof cb !== "function") return () => { };
    const handler = () => cb(getCurrentUser());
    authEvents.addEventListener("change", handler);
    const storageHandler = (e) => {
        if (e.key === SESSION_KEY || e.key === "auth.ping") handler();
    };
    window.addEventListener("storage", storageHandler);
    queueMicrotask(handler);
    return () => {
        authEvents.removeEventListener("change", handler);
        window.removeEventListener("storage", storageHandler);
    };
}


export function makeLoginHandler({ onSuccess, onError, setPending } = {}) {
    return async function handleLogin(e) {
        e.preventDefault();
        try {
            setPending?.(true);
            const fd = new FormData(e.currentTarget);
            const email = fd.get("email");
            const password = fd.get("password");
            const user = await login({ email, password });
            onSuccess?.(user);
        } catch (err) {
            onError?.(err?.message || "Login failed");
        } finally {
            setPending?.(false);
        }
    };
}

export function makeSignupHandler({ onSuccess, onError, setPending } = {}) {
    return async function handleSignup(e) {
        e.preventDefault();
        try {
            setPending?.(true);
            const fd = new FormData(e.currentTarget);
            const name = fd.get("name");
            const email = fd.get("email");
            const password = fd.get("password");
            const confirm = fd.get("confirm");
            if (password !== confirm) throw new Error("Passwords do not match");
            const user = await signup({ name, email, password });
            onSuccess?.(user);
        } catch (err) {
            onError?.(err?.message || "Sign up failed");
        } finally {
            setPending?.(false);
        }
    };
}
export async function oauthLogin(provider, profile = {}) {
    await delay();
    const email = normalizeEmail(
        profile.email || `${provider}_${Date.now()}@example.test`
    );
    const name = profile.name || provider[0].toUpperCase() + provider.slice(1) + " User";

    let users = loadUsers();
    let user = users.find(u => u.email === email);
    if (!user) {
        user = {
            id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
            name,
            email,
            pw: null,
            createdAt: Date.now(),
            provider,
        };
        users.push(user);
        saveUsers(users);
    }
    const sessionUser = { id: user.id, name: user.name, email: user.email, provider };
    saveSession(sessionUser);
    emitAuthChange();
    return sessionUser;
}

