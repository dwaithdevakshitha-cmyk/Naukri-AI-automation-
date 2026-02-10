import sys
import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from pywinauto import Application, Desktop
from pywinauto.keyboard import send_keys
from langchain.tools import tool

# Force terminal to support encoding
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')

@tool
def trigger_naukri_navigation(input_str: str):
    """
    Executes the physical click sequence to go from the 
    Naukri Home Page to the 'Search Resume' form.
    """
    if navigate_to_search_page():
        return "Successfully navigated to the Search Resume page."
    else:
        return "Failed to navigate. Ensure the browser is in the foreground."

def handle_skip_for_now():
    """
    🎯 Robust popup bypass using deep descendant scan.
    Bypasses the 'Skip for now' hyperlink directly.
    """
    print("STATUS: Scanning all windows for 'Skip for now' popups...")
    desktop = Desktop(backend="uia")
    timeout = 10 
    start = time.time()

    while time.time() - start < timeout:
        for win in desktop.windows():
            try:
                title = win.window_text().lower()
                if "update" in title or "action required" in title or "naukri launcher" in title:
                    for child in win.descendants():
                        try:
                            # Search in Name and Text properties
                            name = (child.element_info.name or "").lower()
                            text = (child.window_text() or "").lower()
                            
                            if "skip for now" in name or "skip for now" in text:
                                print(f"STATUS: Popup found inside '{win.window_text()}'. Clicking...")
                                win.set_focus()
                                child.click_input()
                                print("✅ Skip successful.")
                                return True
                        except: pass
            except: pass
        time.sleep(1)
    return False

def navigate_to_search_page():
    """
    🎯 The 100% Universal Navigation Code (Hyperlink Optimized):
    Searches the window for 'Resdex' and 'Search Resume' objects,
    specifically targeting them as Hyperlinks if the general search misses.
    """
    try:
        print("🔍 Connecting to Chrome for aggressive physical navigation...")
        app = Application(backend="uia").connect(title_re=".*recruit.naukri.com.*", timeout=10)
        browser = app.window(title_re=".*recruit.naukri.com.*")
        browser.set_focus()
        time.sleep(1)

        # 2. Find 'Resdex'
        print("🔍 Searching for Resdex (Universal + Hyperlink)...")
        # Try universal first
        resdex = browser.child_window(title="Resdex", enabled_only=True, visible_only=True)
        
        if not resdex.exists():
            print("🔍 universal search missed, trying explicitly as Hyperlink...")
            resdex = browser.child_window(title="Resdex", control_type="Hyperlink", visible_only=True)

        if resdex.exists():
            resdex.click_input() 
            print("✅ Resdex Clicked")
        else:
            print("❌ Could not find Resdex text/link. Try maximizing the window.")
            return False

        time.sleep(1) # Wait for dropdown

        # 3. Find 'Search Resume'
        print("🔍 Searching for Search Resume (Universal + Hyperlink)...")
        search_opt = browser.child_window(title="Search Resume", enabled_only=True, visible_only=True)
        
        if not search_opt.exists():
            print("🔍 Initial search missed, trying explicitly as Hyperlink...")
            search_opt = browser.child_window(title="Search Resume", control_type="Hyperlink")

        if search_opt.exists():
            search_opt.click_input()
            print("✅ Successfully navigated to Search Page.")
            return True
        else:
            # Plan B: Try to find by partial name/regex
            print("🔍 Attempting Plan B (Regex search) for Search Resume...")
            search_opt = browser.child_window(title_re=".*Search Resume.*")
            if search_opt.exists():
                search_opt.click_input()
                print("✅ Successfully navigated via Regex match.")
                return True
            else:
                print("❌ Could not find 'Search Resume' even as a hyperlink.")
                return False

    except Exception as e:
        print(f"❌ Aggressive Navigation Error: {e}")
        return False

@tool
def trigger_naukri_navigation(input_str: str):
    """
    Executes the 100% universal click sequence to go from 
    Naukri Home to 'Search Resume' form.
    """
    if navigate_to_search_page():
        return "Aggressive navigation successful."
    else:
        return "Aggressive navigation failed."
def run_automation_flow(jd_data=None):
    """
    🚀 Main flow after extraction:
    1. Clear any popups.
    2. Switch to the previous tab (Naukri) using shortcut.
    3. Navigate to Search Page physically.
    4. Inject JD data using Selenium.
    """
    # 1. Clear popups
    handle_skip_for_now()

    # 2. Switch Tab Immediately
    print("🤖 Extraction complete. Triggering Ctrl+Shift+Tab...")
    send_keys('^+{TAB}')
    time.sleep(2)

    # 3. Connection and Page Check
    chrome_options = Options()
    chrome_options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
    
    try:
        print("STATUS: Connecting to Chrome for final injection...")
        driver_path = ChromeDriverManager(driver_version="130.0.6723.44").install()
        service = Service(driver_path)
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # Ensure we are on the correct tab
        for handle in driver.window_handles:
            driver.switch_to.window(handle)
            if "recruit.naukri.com" in driver.current_url or "resdex" in driver.current_url:
                break

        current_url = driver.current_url.lower()
        
        # 4. Physical Navigation (Only if not already on Search page)
        if "search/advanced" not in current_url and "resdex/search" not in current_url:
            print("🚀 Not on Search page. Running aggressive physical navigation...")
            if not navigate_to_search_page():
                print("⚠ Physical navigation failed. Forcing URL jump...")
                driver.get("https://resdex.naukri.com/v2/search/advanced")
                time.sleep(3)
        else:
            print("🎯 Already on Search page. Skipping physical navigation.")

        # 5. Selenium Data Injection
        if jd_data:
            print("🚀 Injecting intelligence...")
            time.sleep(2) # Wait for page elements to be ready

            # Skills
            if 'skills' in jd_data and jd_data['skills']:
                try:
                    field = driver.find_element(By.ID, "anyKeywords")
                    field.clear()
                    field.send_keys(", ".join(jd_data['skills']))
                    print("✅ Skills injected.")
                except: pass
            
            # Location
            if 'location' in jd_data and jd_data['location']:
                try:
                    loc_field = driver.find_element(By.ID, "location")
                    loc_field.clear()
                    loc_field.send_keys(jd_data['location'])
                    print("✅ Location injected.")
                except: pass

        print("STATUS: Automation sequence finished.")

    except Exception as e:
        print(f"❌ Selenium Error: {e}")

if __name__ == "__main__":
    jd_data = None
    if len(sys.argv) > 1:
        try:
            jd_data = json.loads(sys.argv[1])
        except:
            pass
    run_automation_flow(jd_data)
