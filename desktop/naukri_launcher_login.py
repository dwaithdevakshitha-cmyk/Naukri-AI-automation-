from pywinauto import Application, Desktop
import time
import subprocess

EMAIL = "jobs.dwaith@gmail.com"
PASSWORD = "Dwaith@1234"

EXE_PATH = r"C:\Users\HP\AppData\Local\Programs\Naukri Launcher\Naukri Launcher.exe"

try:
    print("STEP 1: Checking for existing Naukri Launcher...")
    # Optional: Kill existing to ensure clean state with debug port
    subprocess.call("taskkill /IM \"Naukri Launcher.exe\" /F", shell=True)
    time.sleep(2)

    print("STEP 2: Launching Naukri Launcher with Debugging...")
    subprocess.Popen([
        EXE_PATH,
        "--remote-debugging-port=9222",
        "--log-level=3",
        "--disable-gpu"
    ])
except Exception as e:
    print(f"Failed to launch: {e}")
    pass

time.sleep(12)

print("STEP 2: Finding Naukri window")

desktop = Desktop(backend="uia")
target = None

for w in desktop.windows():
    title = w.window_text()
    if "naukri" in title.lower():
        target = w
        break

if not target:
    raise RuntimeError("Naukri window not found")

print("STEP 3: Connecting to window")

app = Application(backend="uia").connect(handle=target.handle)
window = app.window(handle=target.handle)
window.set_focus()
time.sleep(25)

print("STEP 4: Login")

email_box = window.child_window(control_type="Edit", found_index=0)
email_box.wait("ready", timeout=10)
email_box.set_focus()
email_box.set_text(EMAIL)

password_box = window.child_window(control_type="Edit", found_index=1)
password_box.wait("ready", timeout=10)
password_box.set_focus()
password_box.set_text(PASSWORD)

login_btn = window.child_window(control_type="Button", found_index=0)
login_btn.wait("enabled", timeout=10)
login_btn.click_input()

print("LOGIN_SENT")

time.sleep(10)

# -------- HANDLE "SKIP FOR NOW" POPUP --------

print("STEP 5: Checking for 'Skip for now'")

desktop = Desktop(backend="uia")
time.sleep(5)

for win in desktop.windows():
    title = win.window_text().lower()
    if "action" in title or "update" in title:
        win.set_focus()
        time.sleep(1)

        for child in win.descendants():
            try:
                txt = child.window_text().strip().lower()
                if txt == "skip for now":
                    child.click_input()
                    print("SKIP_CLICKED")
                    break
            except Exception:
                pass

print("DONE")
