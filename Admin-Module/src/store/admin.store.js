import { useSyncExternalStore } from "react";

let state = { isAuthenticated: false, isChecking: true, user: null };
const listeners = new Set();
function update(values) { state = { ...state, ...values }; listeners.forEach((listener) => listener()); }
const actions = { loginInfo(user) { update({ isAuthenticated: true, isChecking: false, user }); }, logOut() { update({ isAuthenticated: false, isChecking: false, user: null }); }, setChecking(value) { update({ isChecking: value }); } };
export default function adminStore() { return { ...useSyncExternalStore((listener) => { listeners.add(listener); return () => listeners.delete(listener); }, () => state), ...actions }; }
