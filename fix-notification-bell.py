#!/usr/bin/env python3
import re

# Files to update (excluding users and dashboard yang sudah diperbaiki)
files = [
    '/home/luthfi/codesmart/src/pages/admin/modules-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/assignments-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/reports-sidebar.html',
]

for file_path in files:
    print(f"\n{'='*70}")
    print(f"Updating {file_path.split('/')[-1]}...")
    print('='*70)

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix notification bell - remove onclick, add id
    old_bell = r'<div class="notification-bell" onclick="modalService\.showNotifications\(\)">'
    new_bell = '<div class="notification-bell" id="notificationBellBtn">'

    if re.search(old_bell, content):
        content = re.sub(old_bell, new_bell, content)
        print("✓ Fixed notification bell HTML")

    # 2. Add event listener before closing </script>
    event_listener_code = """
        // Notification bell click handler
        document.addEventListener('DOMContentLoaded', function() {
            const notificationBell = document.getElementById('notificationBellBtn');
            if (notificationBell) {
                notificationBell.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof modalService !== 'undefined' && modalService.showNotifications) {
                        modalService.showNotifications();
                    }
                });
            }
        });
    </script>"""

    # Find the last </script> tag and add event listener before it
    if '</script>' in content and 'notificationBellBtn' not in content:
        # Find last </script>
        last_script_pos = content.rfind('    </script>')
        if last_script_pos != -1:
            content = content[:last_script_pos] + event_listener_code + '\n</body>\n</html>'
            # Remove duplicate closing tags if any
            content = re.sub(r'</body>\s*</html>\s*</body>\s*</html>', '</body>\n</html>', content)
            print("✓ Added notification bell event listener")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Successfully updated {file_path.split('/')[-1]}")

print("\n" + "="*70)
print("✅ All files updated with notification bell fixes!")
print("="*70)
