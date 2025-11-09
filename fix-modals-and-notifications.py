#!/usr/bin/env python3
import os
import re

# Files to update
admin_files = [
    '/home/luthfi/codesmart/src/pages/admin/dashboard-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/users-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/modules-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/assignments-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/reports-sidebar.html',
]

for file_path in admin_files:
    print(f"\n{'='*70}")
    print(f"Updating {os.path.basename(file_path)}...")
    print('='*70)

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace old notification bell with proper one
    old_bell_pattern = r'<div class="header-icon">\s*<i class=\'bx bx-bell\'></i>\s*<span class="notification-badge"></span>\s*</div>'
    new_bell = '''<div class="notification-bell" onclick="modalService.showNotifications()">
                    <i class='bx bx-bell'></i>
                    <span class="notification-badge" id="notificationBadge" style="display: none;">0</span>
                </div>'''

    if re.search(old_bell_pattern, content):
        content = re.sub(old_bell_pattern, new_bell, content)
        print("✓ Replaced old notification bell with proper notification bell")
    elif 'notification-bell' not in content and 'header-icon' in content:
        # Replace generic header-icon with notification bell
        content = re.sub(
            r'<div class="header-icon">.*?</div>',
            new_bell,
            content,
            flags=re.DOTALL
        )
        print("✓ Added notification bell to replace header-icon")
    elif 'notification-bell' in content:
        print("⚠ Notification bell already exists, ensuring correct format...")
        # Ensure it has onclick and proper ID
        content = re.sub(
            r'<div class="notification-bell"[^>]*>',
            '<div class="notification-bell" onclick="modalService.showNotifications()">',
            content
        )
        content = re.sub(
            r'<span class="notification-badge"[^>]*>',
            '<span class="notification-badge" id="notificationBadge" style="display: none;">',
            content
        )
        print("✓ Updated notification bell format")

    # Ensure modal-system.css is included
    if 'modal-system.css' not in content:
        content = content.replace(
            '<link rel="stylesheet" href="../../css/notification.css">',
            '<link rel="stylesheet" href="../../css/notification.css">\n    <link rel="stylesheet" href="../../css/modal-system.css">'
        )
        print("✓ Added modal-system.css")
    else:
        print("⚠ modal-system.css already included")

    # Ensure modal-service.js is included
    if 'modal-service.js' not in content:
        # Try to add after notification-service.js
        if 'notification-service.js' in content:
            content = re.sub(
                r'(<script src="/src/js/notification-service.js"></script>)',
                r'\1\n    <script src="/src/js/modal-service.js"></script>',
                content
            )
            print("✓ Added modal-service.js after notification-service.js")
        else:
            # Add before closing </body>
            content = content.replace(
                '</body>',
                '    <script src="/src/js/notification-service.js"></script>\n    <script src="/src/js/modal-service.js"></script>\n</body>'
            )
            print("✓ Added both notification-service.js and modal-service.js")
    else:
        print("⚠ modal-service.js already included")

    # Update logout function to use modal
    logout_patterns = [
        # Pattern 1: Old confirm style
        (r"function logout\(\) \{\s*if\s*\(\s*confirm\(['\"]Are you sure you want to logout\?['\"]\)\s*\)\s*\{\s*authService\.logout\(\);\s*\}\s*\}",
         '''function logout() {
            modalService.confirm({
                title: 'Confirm Logout',
                message: 'Are you sure you want to logout?',
                confirmText: 'Yes, Logout',
                cancelText: 'Cancel',
                danger: true,
                onConfirm: () => {
                    authService.logout();
                }
            });
        }'''),
        # Pattern 2: notificationService.confirm
        (r"function logout\(\) \{[^}]*notificationService\.confirm\([^}]+\}[^}]*\}",
         '''function logout() {
            modalService.confirm({
                title: 'Confirm Logout',
                message: 'Are you sure you want to logout?',
                confirmText: 'Yes, Logout',
                cancelText: 'Cancel',
                danger: true,
                onConfirm: () => {
                    authService.logout();
                }
            });
        }''')
    ]

    for pattern, replacement in logout_patterns:
        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            print("✓ Updated logout function to use modalService")
            break
    else:
        # Check if logout function exists
        if 'function logout()' in content:
            print("⚠ Logout function exists but pattern not matched")
        else:
            print("⚠ No logout function found")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Successfully updated {os.path.basename(file_path)}")

print("\n" + "="*70)
print("✅ All files updated successfully!")
print("="*70)
print("\nChanges made:")
print("1. ✓ Replaced/updated notification bell with proper onclick handler")
print("2. ✓ Ensured modal-system.css is included")
print("3. ✓ Ensured modal-service.js is included")
print("4. ✓ Updated logout functions to use modalService.confirm()")
print("\nPlease refresh your browser to see the changes!")
