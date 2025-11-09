#!/usr/bin/env python3
import re

# Files to update
files = [
    '/home/luthfi/codesmart/src/pages/admin/modules-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/assignments-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/reports-sidebar.html',
]

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
        });"""

for file_path in files:
    print(f"\n{'='*70}")
    print(f"Updating {file_path.split('/')[-1]}...")
    print('='*70)

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if event listener already exists
    if 'notificationBellBtn' in content and 'addEventListener' in content:
        print("✓ Event listener already exists, skipping...")
        continue

    # Find the last </script> before </body>
    # Add event listener before </script>
    pattern = r'(    </script>\s*</body>)'
    replacement = event_listener_code + r'\n\1'

    if re.search(pattern, content):
        content = re.sub(pattern, replacement, content, count=1)
        print("✓ Added notification bell event listener")

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"✓ Successfully updated {file_path.split('/')[-1]}")
    else:
        print(f"✗ Pattern not found in {file_path.split('/')[-1]}")

print("\n" + "="*70)
print("✅ Done!")
print("="*70)
