from pywinauto import Application, Desktop
import time
import subprocess
import sys

# Ensure UTF-8 output for Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')

EMAIL = "jobs.dwaith@gmail.com"
PASSWORD = "Dwaith@1234"
EXE_PATH = r"C:\Users\HP\AppData\Local\Programs\Naukri Launcher\Naukri Launcher.exe"

def bypass_skip_popup(win):
    """
    🎯 High-Speed Hyperlink Clicker:
    Specifically targets the 'Skip for now' hyperlink.
    """
    try:
        # Connect to the window to get a WindowSpecification which has child_window
        win_spec = Desktop(backend="uia").window(handle=win.handle)
        target = win_spec.child_window(title="Skip for now")
        
        if target.exists(timeout=2):
            print("STATUS: Hyperlink found! Clicking...")
            win.set_focus()
            target.click_input()
            print("STATUS: Skip successful.")
            return True
        return False
    except Exception as e:
        return False

def handle_skip_for_now():
    """
    🎯 The 'Fast-Response' Popup Scanner:
    Monitors all Naukri-related windows to catch the 'Action required' popup.
    """
    print("STATUS: Starting high-frequency popup monitor...")
    desktop = Desktop(backend="uia")
    # Timeout set to 60 seconds to catch late popups
    timeout = 60
    start = time.time()

    while time.time() - start < timeout:
        for win in desktop.windows():
            try:
                title = win.window_text().lower()
                # Matches 'Naukri Launcher', 'Action required', or 'Update'
                if "naukri" in title or "update" in title or "action" in title:
                    # Attempt the high-speed bypass
                    if bypass_skip_popup(win):
                        return True
                    
                    # Fallback recursive search if direct targeting fails
                    for child in win.descendants():
                        try:
                            if child.window_text().strip().lower() == "skip for now":
                                print("STATUS: Found 'Skip for now' via deep-scan. Clicking...")
                                child.click_input()
                                return True
                        except: pass
            except: pass
        time.sleep(1) # High frequency polling
    
    print("STATUS: No popup detected within timeout.")
    return False

# Main Automation Flow
try:
    print("STEP 1: Cleaning previous instances...")
    subprocess.call("taskkill /IM \"Naukri Launcher.exe\" /F", shell=True, stderr=subprocess.DEVNULL)
    time.sleep(2)

    print("STEP 2: Starting Launcher...")
    subprocess.Popen([EXE_PATH, "--remote-debugging-port=9222", "--disable-gpu"])
except Exception as e:
    print(f"FAILED TO START: {e}")

time.sleep(12)

print("STEP 3: Finding main window...")
desktop = Desktop(backend="uia")
target = None
for _ in range(5):
    for w in desktop.windows():
        if "naukri" in w.window_text().lower():
            target = w
            break
    if target: break
    time.sleep(2)

if target:
    try:
        print("STEP 4: Connecting to UI...")
        app = Application(backend="uia").connect(handle=target.handle)
        window = app.window(handle=target.handle)
        window.set_focus()
        
        # Immediate Login attempt
        try:
            email_field = window.child_window(control_type="Edit", found_index=0)
            if email_field.exists(timeout=5):
                print("STATUS: Filling login...")
                email_field.set_focus()
                email_field.set_text(EMAIL)
                window.child_window(control_type="Edit", found_index=1).set_text(PASSWORD)
                window.child_window(control_type="Button", found_index=0).click_input()
                print("STATUS: Login clicked.")
                time.sleep(8)
        except:
            print("STATUS: Landing page skipped (already logged in).")

        print("STEP 5: Clearing Post-Login Blockers...")
        handle_skip_for_now()

    except Exception as e:
        print(f"WIN ERROR: {e}")

print("FINISH: Startup sequence ready.")
