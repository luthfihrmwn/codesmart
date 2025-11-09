#!/usr/bin/env python3
import os
import re

# Files to update
files = [
    '/home/luthfi/codesmart/src/pages/admin/assignments-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/dashboard-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/modules-sidebar.html',
    '/home/luthfi/codesmart/src/pages/admin/reports-sidebar.html',
]

for file_path in files:
    print(f"Updating {os.path.basename(file_path)}...")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add notification CSS if not present
    if 'notification.css' not in content:
        content = content.replace(
            '<link rel="stylesheet" href="../../css/admin-sidebar.css">',
            '<link rel="stylesheet" href="../../css/admin-sidebar.css">\n    <link rel="stylesheet" href="../../css/notification.css">'
        )
        print(f"  - Added notification.css")

    # Add notification service script if not present
    if 'notification-service.js' not in content:
        content = re.sub(
            r'(<script src="/src/js/api-service.js"></script>)',
            r'\1\n    <script src="/src/js/notification-service.js"></script>',
            content
        )
        print(f"  - Added notification-service.js")

    # Remove old showSuccess and showError functions
    content = re.sub(
        r'\s*function showSuccess\(message\) \{[^}]+\}\s*',
        '\n',
        content,
        flags=re.DOTALL
    )
    content = re.sub(
        r'\s*function showError\(message\) \{[^}]+\}\s*',
        '\n',
        content,
        flags=re.DOTALL
    )

    # Update confirm dialogs to use notification service
    content = re.sub(
        r"if \(confirm\('Are you sure you want to logout\?'\)\) \{\s*authService\.logout\(\);\s*\}",
        """notificationService.confirm(
                'Are you sure you want to logout?',
                () => {
                    authService.logout();
                }
            );""",
        content,
        flags=re.DOTALL
    )

    content = re.sub(
        r"if \(confirm\('Are you sure you want to delete this ([^']+)\?'\)\) \{\s*delete([A-Z][a-z]+)\(([^)]+)\);\s*\}",
        r"""notificationService.confirm(
                'Are you sure you want to delete this \1?',
                () => {
                    delete\2(\3);
                }
            );""",
        content,
        flags=re.DOTALL
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  ✓ Updated successfully\n")

print("All files updated!")
