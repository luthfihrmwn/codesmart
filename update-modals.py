#!/usr/bin/env python3
import os
import re

# Files to update
admin_files = [
    '/home/luthfi/codesmart/src/pages/admin/users-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/assignments-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/dashboard-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/modules-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/reports-sidebar.html',
]

for file_path in admin_files:
    print(f"\n{'='*60}")
    print(f"Updating {os.path.basename(file_path)}...")
    print('='*60)

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add modal CSS if not present
    if 'modal-system.css' not in content:
        content = content.replace(
            '<link rel="stylesheet" href="../../css/notification.css">',
            '<link rel="stylesheet" href="../../css/notification.css">\n    <link rel="stylesheet" href="../../css/modal-system.css">'
        )
        print("✓ Added modal-system.css")

    # Add modal service script if not present
    if 'modal-service.js' not in content:
        content = re.sub(
            r'(<script src="/src/js/notification-service.js"></script>)',
            r'\1\n    <script src="/src/js/modal-service.js"></script>',
            content
        )
        print("✓ Added modal-service.js")

    # Add notification bell to header if not present
    if 'notification-bell' not in content:
        # Find user dropdown in header
        header_pattern = r'(<div class="user-dropdown">.*?</div>)\s*</div>\s*</div>\s*</header>'

        def add_notification_bell(match):
            user_dropdown = match.group(1)
            return f'''<div class="notification-bell" onclick="modalService.showNotifications()">
                        <i class='bx bx-bell'></i>
                        <span class="notification-badge" id="notificationBadge" style="display: none;">0</span>
                    </div>
                    {user_dropdown}
                </div>
            </div>
        </header>'''

        content = re.sub(header_pattern, add_notification_bell, content, flags=re.DOTALL)
        print("✓ Added notification bell to header")

    # Update logout function to use modal
    content = re.sub(
        r"function logout\(\) \{\s*notificationService\.confirm\([^}]+\}\s*\);?\s*\}",
        '''function logout() {
            modalService.confirm({
                title: 'Logout',
                message: 'Are you sure you want to logout?',
                confirmText: 'Logout',
                danger: true,
                onConfirm: () => {
                    authService.logout();
                }
            });
        }''',
        content,
        flags=re.DOTALL
    )
    print("✓ Updated logout function to use modal")

    # Replace direct alert() calls with modalService.alert()
    content = re.sub(
        r"alert\('([^']+)'\)",
        r"modalService.alert({ title: 'Alert', message: '\1', type: 'info' })",
        content
    )

    # Replace direct confirm() calls with modalService.confirm()
    content = re.sub(
        r"if\s*\(\s*confirm\('([^']+)'\)\s*\)\s*\{([^}]+)\}",
        r"modalService.confirm({ message: '\1', onConfirm: () => {\2} })",
        content,
        flags=re.DOTALL
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Successfully updated {os.path.basename(file_path)}")

print("\n" + "="*60)
print("All files updated successfully!")
print("="*60)
