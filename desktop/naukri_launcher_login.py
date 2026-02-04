from pywinauto import Application, Desktop
import time
import subprocess

EMAIL = "jobs.dwaith@gmail.com"
PASSWORD = "Dwaith@1234"

exe_path = r"C:\Program Files\Naukri Launcher\Naukri Launcher.exe"

print("STEP 1: Ensuring launcher is running")

try:
    subprocess.Popen([exe_path, "--remote-debugging-port=9222"])
except Exception:
    pass

time.sleep(10)

print("STEP 2: Locating Naukri window")

windows = Desktop(backend="uia").windows()
target_wrapper = None

for w in windows:
    title = w.window_text()
    print("WINDOW:", title)
    if "naukri" in title.lower():
        target_wrapper = w
        break

if not target_wrapper:
    raise RuntimeError("Naukri window not found")

print("STEP 3: Connecting via handle")

app = Application(backend="uia").connect(handle=target_wrapper.handle)
window = app.window(handle=target_wrapper.handle)

window.set_focus()
time.sleep(1)

print("STEP 4: Printing control identifiers (CORRECT METHOD)")
window.print_control_identifiers()

print("STEP 5: Attempting login via found_index")

try:
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

    print("[SUCCESS] Login attempt sent")

except Exception as e:
    print("[ERROR] Login failed:", e)

# input("DONE. Press Enter to exit...")
print("LOGIN_SUCCESS")