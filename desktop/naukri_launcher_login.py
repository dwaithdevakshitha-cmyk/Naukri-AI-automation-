from pywinauto import Application, Desktop
from pywinauto.keyboard import send_keys
import time
import subprocess

EMAIL = "jobs.dwaith@gmail.com"
PASSWORD = "Dwaith@1234"

exe_path = r"C:\Program Files\Naukri Launcher\Naukri Launcher.exe"

print("STEP 1: Launching / Ensuring Naukri Launcher")

try:
    print("STEP 0: Killing stale instances...")
    subprocess.call("taskkill /IM \"Naukri Launcher.exe\" /F", shell=True)
    time.sleep(2)
    
    print("STEP 1: Launching with Remote Debugging & Error Suppression...")
    subprocess.Popen([
        exe_path, 
        "--remote-debugging-port=9222", 
        "--log-level=3",
        "--disable-gpu",
        "--disable-software-rasterizer"
    ])
except Exception as e:
    print(f"Launch failed: {e}")

time.sleep(12)

print("STEP 2: Finding Naukri window")

desktop = Desktop(backend="uia")
target = None

for w in desktop.windows():
    title = w.window_text()
    print("WINDOW:", title)
    if "naukri" in title.lower():
        target = w
        break

if not target:
    raise RuntimeError("Naukri window not found")

app = Application(backend="uia").connect(handle=target.handle)
window = app.window(handle=target.handle)
window.set_focus()
time.sleep(1)

print("STEP 3: Login")

email_box = window.child_window(control_type="Edit", found_index=0)
email_box.wait("ready", timeout=10)
email_box.set_text(EMAIL)

password_box = window.child_window(control_type="Edit", found_index=1)
password_box.wait("ready", timeout=10)
password_box.set_text(PASSWORD)

login_btn = window.child_window(control_type="Button", found_index=0)
login_btn.click_input()

print("LOGIN SENT")

# --------------------------------------------------
# HANDLE "UPDATE EMAIL" POPUP
# --------------------------------------------------

print("STEP 4: Waiting for 'Skip for now' popup")

def bypass_skip_popup(launcher_dlg):
    print("Searching for 'Skip for now'...")
    # 1. We search for ANY control type with this title to be safe
    # We use 'click_input' because it simulates a real hardware mouse click
    try:
        # We find the element regardless of whether it's 'Text', 'Static', or 'Hyperlink'
        target = launcher_dlg.child_window(title="Skip for now")
        
        if target.exists(timeout=5):
            print("Element found! Attempting hardware click...")
            # set_focus brings it to front; click_input moves the actual mouse
            target.set_focus()
            target.click_input()
            print("Skip successful.")
            return True
        else:
            print("Skip text not found. It might have already been clicked.")
            return False
    except Exception as e:
        print(f"Bypass failed: {e}")
        return False

bypass_skip_popup(window)

print("PY_LOGIN_FLOW_DONE")
