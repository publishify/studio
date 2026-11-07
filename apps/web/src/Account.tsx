import { Cloud, CloudOff, Copy, HardDrive, KeyRound, LifeBuoy, LogOut, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { connectDrive, disconnectDrive, driveSync, useDrive } from "./drive";
import { type Key, type Lang, t } from "./i18n";
import { useStore } from "./store";
import { api, refreshAccount, syncAll } from "./sync";

type Mode = "home" | "create" | "recover" | "code";

const statusKey: Record<string, Key> = { off: "syncOff", idle: "syncIdle", syncing: "syncing", error: "syncError", offline: "syncOffline" };

export function AccountDialog({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const { account, sync } = useStore();
  const [mode, setMode] = useState<Mode>("home");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [fresh, setFresh] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const guard = async (fn: () => Promise<void>) => {
    setBusy(true);
    setMsg("");
    try {
      await fn();
    } catch (e) {
      const n = e instanceof Error ? e.name : "";
      if (n === "NotAllowedError" || n === "AbortError") setMsg("");
      else if (!window.PublicKeyCredential) setMsg(t(lang, "passkeyUnsupported"));
      else setMsg(t(lang, "failed"));
    } finally {
      setBusy(false);
    }
  };

  const create = () =>
    guard(async () => {
      const { startRegistration } = await import("@simplewebauthn/browser");
      const o = await api<Parameters<typeof startRegistration>[0]["optionsJSON"]>("/auth/register/options", { body: { name: name.trim() } });
      if (o.status !== 200) throw new Error("options");
      const response = await startRegistration({ optionsJSON: o.data });
      const v = await api<{ recoveryCode: string }>("/auth/register/verify", { body: { response } });
      if (v.status !== 200) throw new Error("verify");
      setFresh(v.data.recoveryCode);
      setMode("code");
      await refreshAccount();
    });

  const login = () =>
    guard(async () => {
      const { startAuthentication } = await import("@simplewebauthn/browser");
      const o = await api<Parameters<typeof startAuthentication>[0]["optionsJSON"]>("/auth/login/options", { body: {} });
      if (o.status !== 200) throw new Error("options");
      const response = await startAuthentication({ optionsJSON: o.data });
      const v = await api("/auth/login/verify", { body: { response } });
      if (v.status !== 200) throw new Error("verify");
      await refreshAccount();
      onClose();
    });

  const recover = () =>
    guard(async () => {
      const v = await api<{ recoveryCode: string }>("/auth/recover", { body: { code } });
      if (v.status === 429) { setMsg(t(lang, "tooMany")); return; }
      if (v.status !== 200) { setMsg(t(lang, "wrongCode")); return; }
      setFresh(v.data.recoveryCode);
      setMode("code");
      await refreshAccount();
    });

  const addPasskey = () =>
    guard(async () => {
      const { startRegistration } = await import("@simplewebauthn/browser");
      const o = await api<Parameters<typeof startRegistration>[0]["optionsJSON"]>("/auth/passkey/options", { body: {} });
      if (o.status !== 200) throw new Error("options");
      const response = await startRegistration({ optionsJSON: o.data });
      const v = await api("/auth/passkey/verify", { body: { response } });
      if (v.status !== 200) throw new Error("verify");
      setMsg(t(lang, "passkeyAdded"));
    });

  const logout = async () => {
    await api("/auth/logout", { body: {} });
    useStore.getState().setAccount(null);
    onClose();
  };

  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && mode !== "code" && onClose()}>
      <div className="modal" role="dialog" aria-label={t(lang, "account")}>
        <div className="modal-head">
          <h2>{mode === "code" ? t(lang, "recoveryTitle") : t(lang, "account")}</h2>
          {mode !== "code" && <button className="icon" onClick={onClose} aria-label={t(lang, "close")}><X /></button>}
        </div>

        {mode === "code" && (
          <>
            <p className="muted">{t(lang, "recoveryText")}</p>
            <div className="codebox">{fresh}</div>
            <button className="btn" onClick={() => { void navigator.clipboard?.writeText(fresh); setCopied(true); }}><Copy size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {copied ? t(lang, "copied") : t(lang, "copy")}</button>
            <label className="check"><input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} /> {t(lang, "recoverySaved")}</label>
            <button className="btn primary" disabled={!saved} onClick={onClose}>{t(lang, "close")}</button>
          </>
        )}

        {mode !== "code" && account && (
          <>
            <div className="card">
              <div className="kv"><span>{account.name}</span><span className={`dot ${sync.status}`}>{t(lang, statusKey[sync.status] ?? "syncIdle")}</span></div>
              {sync.last && <div className="muted">{t(lang, "lastSync")}: {new Date(sync.last).toLocaleTimeString(lang)}</div>}
            </div>
            <button className="btn" disabled={busy} onClick={() => void syncAll()}><RefreshCw size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "syncNow")}</button>
            <button className="btn" disabled={busy} onClick={() => void addPasskey()}><KeyRound size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "addPasskey")}</button>
            <button className="btn" onClick={() => void logout()}><LogOut size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "signOut")}</button>
          </>
        )}

        {mode === "home" && <DriveSection lang={lang} />}

        {mode === "home" && !account && (
          <>
            <p className="muted">{t(lang, "accountIntro")}</p>
            <button className="btn primary" disabled={busy} onClick={() => void login()}><KeyRound size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "signIn")}</button>
            <button className="btn" onClick={() => setMode("create")}><Cloud size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "createAccount")}</button>
            <button className="btn" onClick={() => setMode("recover")}><LifeBuoy size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "recoverWith")}</button>
          </>
        )}
        {mode === "create" && !account && (
          <>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder={t(lang, "yourName")} maxLength={60} />
            <button className="btn primary" disabled={busy} onClick={() => void create()}>{t(lang, "createAccount")}</button>
            <button className="btn" onClick={() => setMode("home")}>←</button>
          </>
        )}
        {mode === "recover" && !account && (
          <>
            <input className="field mono" value={code} onChange={(e) => setCode(e.target.value)} placeholder="XXXXX-XXXXX-XXXXX-XXXXX" maxLength={40} />
            <button className="btn primary" disabled={busy || code.trim().length < 10} onClick={() => void recover()}>{t(lang, "recoverWith")}</button>
            <button className="btn" onClick={() => setMode("home")}>←</button>
          </>
        )}
        {msg && <p className="muted" role="alert">{msg}</p>}
      </div>
    </div>
  );
}

function DriveSection({ lang }: { lang: Lang }) {
  const { status, email, last } = useDrive();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const connect = async () => {
    setBusy(true);
    setMsg("");
    try { await connectDrive(); } catch { setMsg(t(lang, "driveFail")); } finally { setBusy(false); }
  };
  const on = status !== "off";
  const label = status === "needs-auth" ? t(lang, "driveNeedsAuth") : status === "syncing" ? t(lang, "syncing") : status === "error" ? t(lang, "syncError") : status === "offline" ? t(lang, "syncOffline") : t(lang, "syncIdle");
  return (
    <div className="card">
      <div className="kv"><span><HardDrive size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "driveTitle")}</span><span className={`dot ${status === "needs-auth" ? "error" : status}`}>{on ? label : t(lang, "driveOff")}</span></div>
      {!on && <p className="muted">{t(lang, "driveIntro")}</p>}
      {on && email && <div className="muted">{email}</div>}
      {on && last && <div className="muted">{t(lang, "lastSync")}: {new Date(last).toLocaleTimeString(lang)}</div>}
      {!on && <button className="btn primary" disabled={busy} onClick={() => void connect()}>{t(lang, "driveConnect")}</button>}
      {status === "needs-auth" && <button className="btn primary" disabled={busy} onClick={() => void connect()}>{t(lang, "driveReconnect")}</button>}
      {on && status !== "needs-auth" && <button className="btn" onClick={() => void driveSync()}><RefreshCw size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "driveSyncNow")}</button>}
      {on && <button className="btn" onClick={() => disconnectDrive()}>{t(lang, "driveDisconnect")}</button>}
      {on && <p className="muted">{t(lang, "driveKept")}</p>}
      {msg && <p className="muted" role="alert">{msg}</p>}
    </div>
  );
}

export function AccountIcon({ status, signedIn }: { status: string; signedIn: boolean }) {
  if (!signedIn) return <CloudOff />;
  return status === "syncing" ? <RefreshCw className="spin" /> : <Cloud />;
}
