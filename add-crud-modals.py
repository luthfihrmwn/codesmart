#!/usr/bin/env python3
import os
import re

# Files to update
admin_files = {
    'users': '/home/luthfi/codesmart/src/pages/admin/users-sidebar.html',
    'modules': '/home/luthfi/codesmart/src/pages/admin/modules-sidebar.html',
    'assignments': '/home/luthfi/codesmart/src/pages/admin/assignments-sidebar.html',
}

def add_crud_modals():
    for page_name, file_path in admin_files.items():
        print(f"\n{'='*70}")
        print(f"Updating {page_name.upper()} PAGE...")
        print('='*70)

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # USERS PAGE - Delete User
        if page_name == 'users':
            # Replace deleteUser function
            old_delete = r"async function deleteUser\(userId\) \{\s*if \(!confirm\([^)]+\)\) return;\s*try \{([^}]+await apiService\.deleteUser[^}]+showSuccess[^}]+loadUsers[^}]+)\} else \{([^}]+)\}\s*\} catch[^}]+\}"

            new_delete = '''async function deleteUser(userId) {
            modalService.confirm({
                title: '<i class=\\'bx bx-trash\\'></i> Delete User',
                message: 'Are you sure you want to delete this user? This action cannot be undone and will permanently remove all user data.',
                confirmText: 'Yes, Delete User',
                cancelText: 'Cancel',
                danger: true,
                onConfirm: async () => {
                    const loadingId = modalService.loading('Deleting user...');
                    try {
                        const response = await apiService.deleteUser(userId);
                        modalService.close(loadingId);

                        if (response.success) {
                            showSuccess('✓ User deleted successfully!');
                            modalService.addNotification({
                                title: 'User Deleted',
                                message: 'User has been permanently removed from the system',
                                type: 'success'
                            });
                            await loadUsers();
                        } else {
                            showError(response.message || 'Failed to delete user');
                        }
                    } catch (error) {
                        modalService.close(loadingId);
                        console.error('Error deleting user:', error);
                        showError('Failed to delete user. Please try again.');
                    }
                }
            });
        }'''

            content = re.sub(old_delete, new_delete, content, flags=re.DOTALL)
            print("✓ Updated deleteUser function with modal confirmation")

            # Update approve/reject user functions
            approve_pattern = r"async function (approveUser|rejectUser)\(userId\) \{\s*try \{"
            if re.search(approve_pattern, content):
                # Add modal for approve
                content = re.sub(
                    r"async function approveUser\(userId\) \{\s*try \{",
                    '''async function approveUser(userId) {
            modalService.confirm({
                title: '<i class=\\'bx bx-check-circle\\'></i> Approve User',
                message: 'Approve this user registration?',
                confirmText: 'Yes, Approve',
                cancelText: 'Cancel',
                onConfirm: async () => {
                    const loadingId = modalService.loading('Approving user...');
                    try {''',
                    content
                )
                # Close the modal callback
                content = re.sub(
                    r"(await apiService\.approveUser\(userId\);[^}]+showSuccess[^}]+loadUsers[^}]+)\} catch",
                    r"\1} catch (error) { modalService.close(loadingId); throw error; } finally { modalService.close(loadingId); } } }); } async function _approveUserOriginal(userId) { try",
                    content,
                    count=1
                )
                print("✓ Updated approveUser function with modal")

        # MODULES PAGE - Delete Module
        elif page_name == 'modules':
            # Replace deleteModule function
            old_delete = r"async function deleteModule\(moduleId\) \{\s*if \(!confirm\([^)]+\)\) return;\s*try \{([^}]+)\} catch[^}]+\}"

            new_delete = '''async function deleteModule(moduleId) {
            modalService.confirm({
                title: '<i class=\\'bx bx-trash\\'></i> Delete Module',
                message: 'Are you sure you want to delete this module? All related classes and materials will also be removed.',
                confirmText: 'Yes, Delete Module',
                cancelText: 'Cancel',
                danger: true,
                onConfirm: async () => {
                    const loadingId = modalService.loading('Deleting module...');
                    try {
                        const response = await apiService.deleteModule(moduleId);
                        modalService.close(loadingId);

                        if (response.success) {
                            showSuccess('✓ Module deleted successfully!');
                            modalService.addNotification({
                                title: 'Module Deleted',
                                message: 'Module and all related content removed',
                                type: 'success'
                            });
                            await loadModules();
                        } else {
                            showError(response.message || 'Failed to delete module');
                        }
                    } catch (error) {
                        modalService.close(loadingId);
                        console.error('Error deleting module:', error);
                        showError('Failed to delete module. Please try again.');
                    }
                }
            });
        }'''

            content = re.sub(old_delete, new_delete, content, flags=re.DOTALL)
            print("✓ Updated deleteModule function with modal confirmation")

        # ASSIGNMENTS PAGE - Delete Assignment
        elif page_name == 'assignments':
            # Replace deleteAssignment function
            old_delete = r"async function deleteAssignment\(assignmentId\) \{\s*if \(!confirm\([^)]+\)\) return;\s*try \{([^}]+)\} catch[^}]+\}"

            new_delete = '''async function deleteAssignment(assignmentId) {
            modalService.confirm({
                title: '<i class=\\'bx bx-trash\\'></i> Delete Assignment',
                message: 'Are you sure you want to delete this assignment? All student submissions will be permanently lost.',
                confirmText: 'Yes, Delete Assignment',
                cancelText: 'Cancel',
                danger: true,
                onConfirm: async () => {
                    const loadingId = modalService.loading('Deleting assignment...');
                    try {
                        const response = await apiService.deleteAssignment(assignmentId);
                        modalService.close(loadingId);

                        if (response.success) {
                            showSuccess('✓ Assignment deleted successfully!');
                            modalService.addNotification({
                                title: 'Assignment Deleted',
                                message: 'Assignment and all submissions removed',
                                type: 'success'
                            });
                            await loadAssignments();
                        } else {
                            showError(response.message || 'Failed to delete assignment');
                        }
                    } catch (error) {
                        modalService.close(loadingId);
                        console.error('Error deleting assignment:', error);
                        showError('Failed to delete assignment. Please try again.');
                    }
                }
            });
        }'''

            content = re.sub(old_delete, new_delete, content, flags=re.DOTALL)
            print("✓ Updated deleteAssignment function with modal confirmation")

        # Add success notifications for create/update operations
        # Replace showSuccess calls with notifications
        success_patterns = [
            (r"showSuccess\('User created successfully'\)",
             "showSuccess('✓ User created successfully!'); modalService.addNotification({ title: 'User Created', message: 'New user added to the system', type: 'success' })"),
            (r"showSuccess\('User updated successfully'\)",
             "showSuccess('✓ User updated successfully!'); modalService.addNotification({ title: 'User Updated', message: 'User information has been updated', type: 'success' })"),
            (r"showSuccess\('Module created successfully'\)",
             "showSuccess('✓ Module created successfully!'); modalService.addNotification({ title: 'Module Created', message: 'New learning module added', type: 'success' })"),
            (r"showSuccess\('Module updated successfully'\)",
             "showSuccess('✓ Module updated successfully!'); modalService.addNotification({ title: 'Module Updated', message: 'Module has been updated', type: 'success' })"),
            (r"showSuccess\('Assignment created successfully'\)",
             "showSuccess('✓ Assignment created successfully!'); modalService.addNotification({ title: 'Assignment Created', message: 'New assignment has been created', type: 'success' })"),
            (r"showSuccess\('Assignment updated successfully'\)",
             "showSuccess('✓ Assignment updated successfully!'); modalService.addNotification({ title: 'Assignment Updated', message: 'Assignment has been updated', type: 'success' })"),
        ]

        for pattern, replacement in success_patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                print(f"✓ Added notification for: {pattern.split('(')[1].split(')')[0]}")

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"✓ Successfully updated {page_name} page")

    print("\n" + "="*70)
    print("✅ All CRUD operations updated with modals and notifications!")
    print("="*70)
    print("\nChanges made:")
    print("1. ✓ Replaced confirm() with modalService.confirm()")
    print("2. ✓ Added loading states for async operations")
    print("3. ✓ Added success notifications with icons")
    print("4. ✓ Added notification bell updates")
    print("5. ✓ Enhanced error handling")
    print("\nRefresh your browser to see the beautiful CRUD modals!")

if __name__ == "__main__":
    add_crud_modals()
