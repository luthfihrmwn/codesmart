# Discussion Forum - Modern Upgrade & Reply System

## Objectives

1. ✅ **Modern UI Design** - Lebih clean, card-based, dengan gradients
2. ✅ **Chat-Like Reply System** - Assessor bisa reply ke diskusi seperti chat room
3. ✅ **Real-time Feel** - Smooth animations, instant feedback
4. ✅ **Better UX** - Easier to read, navigate, and interact

## Current Issues

1. **No Reply System for Assessor** - Assessor tidak bisa membalas diskusi
2. **Basic UI** - Tampilan kurang modern
3. **No Threading** - Tidak ada visual hierarchy untuk replies
4. **Static Feel** - Kurang interaktif

## New Features to Add

### 1. Chat-Like Reply Interface

```
┌────────────────────────────────────────────────┐
│ Discussion: Array methods: map, filter, reduce │
│ By: hasan  │  19/11/2025  │  16 replies       │
├────────────────────────────────────────────────┤
│                                                │
│  💬 hasan (Student) - 19/11/2025 10:30        │
│  ┌──────────────────────────────────────────┐ │
│  │ Bisa tolong jelaskan cara kerja map,    │ │
│  │ filter, dan reduce? Saya masih bingung  │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│    └─ 💬 azzahra (Assessor) - 19/11 11:00    │
│       ┌────────────────────────────────────┐  │
│       │ Tentu! Map digunakan untuk...      │  │
│       └────────────────────────────────────┘  │
│                                                │
│  💬 hasan (Student) - 19/11/2025 11:15        │
│  ┌──────────────────────────────────────────┐ │
│  │ Oh begitu! Jadi map itu...               │ │
│  └──────────────────────────────────────────┘ │
│                                                │
├────────────────────────────────────────────────┤
│  💬 Reply as Assessor:                         │
│  ┌──────────────────────────────────────────┐ │
│  │ Type your reply here...                  │ │
│  └──────────────────────────────────────────┘ │
│  [📎 Attach] [😊 Emoji]  [Send Reply ➤]      │
└────────────────────────────────────────────────┘
```

### 2. Modern Card Design

**Before:**
```
┌────────────────────────────────────┐
│ Array methods: map, filter, reduce │
│ hasan  |  19/11/2025  |  16 replies│
└────────────────────────────────────┘
```

**After:**
```
┌─────────────────────────────────────────────┐
│  💬  Array methods: map, filter, reduce    │
│                                             │
│  Bisa tolong jelaskan cara kerja map...    │
│                                             │
│  👤 hasan    📅 19/11/2025    💬 16 replies│
│  👁️ 45 views    🔴 ACTIVE                  │
└─────────────────────────────────────────────┘
```

### 3. Reply Input Area

```html
<div class="reply-input-section">
    <div class="reply-input-header">
        <img src="assessor-avatar.jpg" class="reply-avatar">
        <span class="reply-as">Replying as <strong>Assessor</strong></span>
    </div>

    <div class="reply-input-container">
        <textarea
            id="replyContent"
            placeholder="Type your reply here... (Markdown supported)"
            rows="4"
        ></textarea>

        <div class="reply-input-toolbar">
            <button class="toolbar-btn" onclick="insertMarkdown('**', '**')">
                <i class='bx bx-bold'></i> Bold
            </button>
            <button class="toolbar-btn" onclick="insertMarkdown('*', '*')">
                <i class='bx bx-italic'></i> Italic
            </button>
            <button class="toolbar-btn" onclick="insertMarkdown('```\n', '\n```')">
                <i class='bx bx-code'></i> Code
            </button>
            <button class="toolbar-btn" onclick="attachFile()">
                <i class='bx bx-paperclip'></i> Attach
            </button>
        </div>
    </div>

    <div class="reply-input-actions">
        <button class="btn-cancel" onclick="cancelReply()">
            Cancel
        </button>
        <button class="btn-send-reply" onclick="sendReply()">
            <i class='bx bx-send'></i> Send Reply
        </button>
    </div>
</div>
```

### 4. Thread Visualization

```css
.reply-thread {
    margin-left: 4rem;
    border-left: 3px solid #e5e7eb;
    padding-left: 2rem;
    position: relative;
}

.reply-thread::before {
    content: '';
    position: absolute;
    left: -3px;
    top: 0;
    width: 3px;
    height: 30px;
    background: linear-gradient(180deg, #667eea 0%, transparent 100%);
}

.reply-item {
    background: #f9fafb;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    border-left: 3px solid #667eea;
}

.reply-item.assessor-reply {
    background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%);
    border-left: 3px solid #764ba2;
}
```

## Implementation Steps

### Step 1: Update Discussion Detail Modal

Add reply section to the modal:

```javascript
function viewDiscussionDetail(discussionId) {
    // ... existing code to fetch discussion ...

    const modalContent = `
        <div class="discussion-detail-modal">
            <div class="discussion-header">
                <h2>${discussion.title}</h2>
                <div class="discussion-meta">
                    <span class="author">
                        <i class='bx bx-user'></i> ${discussion.author}
                    </span>
                    <span class="date">
                        <i class='bx bx-calendar'></i> ${discussion.created_at}
                    </span>
                    <span class="views">
                        <i class='bx bx-show'></i> ${discussion.view_count} views
                    </span>
                </div>
            </div>

            <div class="discussion-content">
                ${discussion.content}
            </div>

            <div class="replies-section">
                <h3>
                    <i class='bx bx-message-rounded-dots'></i>
                    ${discussion.reply_count} Replies
                </h3>

                <div class="replies-list" id="repliesList">
                    ${renderReplies(discussion.replies)}
                </div>

                <!-- Reply Input Area -->
                <div class="reply-input-section">
                    ${renderReplyInput()}
                </div>
            </div>
        </div>
    `;

    modalService.show('Discussion Detail', modalContent);
}
```

### Step 2: Add Reply Rendering Function

```javascript
function renderReplies(replies) {
    if (!replies || replies.length === 0) {
        return `
            <div class="no-replies">
                <i class='bx bx-message-x'></i>
                <p>No replies yet. Be the first to reply!</p>
            </div>
        `;
    }

    return replies.map(reply => `
        <div class="reply-item ${reply.user_role === 'assessor' ? 'assessor-reply' : ''}">
            <div class="reply-header">
                <div class="reply-author">
                    <img src="${reply.user_avatar || '/src/assets/default-avatar.png'}"
                         class="reply-avatar">
                    <div class="reply-author-info">
                        <strong>${reply.user_name}</strong>
                        <span class="reply-role ${reply.user_role}">
                            ${reply.user_role === 'assessor' ? '🎓 Assessor' : '👨‍🎓 Student'}
                        </span>
                    </div>
                </div>
                <span class="reply-date">
                    <i class='bx bx-time'></i> ${formatDate(reply.created_at)}
                </span>
            </div>
            <div class="reply-content">
                ${renderMarkdown(reply.content)}
            </div>
            <div class="reply-actions">
                <button class="reply-action-btn" onclick="likeReply(${reply.id})">
                    <i class='bx bx-like'></i> ${reply.likes || 0}
                </button>
                ${reply.user_id === currentUserId ? `
                    <button class="reply-action-btn" onclick="editReply(${reply.id})">
                        <i class='bx bx-edit'></i> Edit
                    </button>
                    <button class="reply-action-btn danger" onclick="deleteReply(${reply.id})">
                        <i class='bx bx-trash'></i> Delete
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}
```

### Step 3: Add Send Reply Function

```javascript
async function sendReply() {
    const content = document.getElementById('replyContent').value.trim();

    if (!content) {
        showNotification('Please enter a reply', 'warning');
        return;
    }

    try {
        showLoading('Sending reply...');

        const response = await apiService.addDiscussionReply(currentDiscussionId, {
            content: content
        });

        if (response.success) {
            showNotification('Reply sent successfully!', 'success');

            // Clear input
            document.getElementById('replyContent').value = '';

            // Reload replies
            await loadDiscussionReplies(currentDiscussionId);
        } else {
            showNotification(response.message || 'Failed to send reply', 'error');
        }
    } catch (error) {
        console.error('Error sending reply:', error);
        showNotification('Failed to send reply', 'error');
    } finally {
        hideLoading();
    }
}
```

### Step 4: Update CSS for Modern Look

```css
/* Modern Discussion Cards */
.discussion-item {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 5px solid transparent;
    position: relative;
    overflow: hidden;
}

.discussion-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s;
}

.discussion-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.25);
    border-left-color: #667eea;
}

.discussion-item:hover::before {
    transform: scaleX(1);
}

/* Reply Input Section */
.reply-input-section {
    background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
    padding: 2rem;
    border-radius: 16px;
    border: 2px solid #e5e7eb;
    margin-top: 2rem;
}

.reply-input-container textarea {
    width: 100%;
    padding: 1.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1.4rem;
    font-family: inherit;
    resize: vertical;
    transition: all 0.3s;
}

.reply-input-container textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.btn-send-reply {
    padding: 1.2rem 3rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.4rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    transition: all 0.3s;
}

.btn-send-reply:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* Assessor Reply Highlight */
.reply-item.assessor-reply {
    background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%);
    border-left: 4px solid #764ba2;
}

.reply-item.assessor-reply .reply-role {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 1.2rem;
}
```

## API Endpoints Needed

### 1. Get Discussion Replies
```
GET /api/v1/discussions/:id/replies
Response: {
    success: true,
    data: {
        replies: [
            {
                id: 1,
                discussion_id: 5,
                user_id: 6,
                user_name: "azzahra",
                user_role: "assessor",
                content: "Great question! Let me explain...",
                created_at: "2025-12-02T10:30:00Z",
                likes: 5
            }
        ]
    }
}
```

### 2. Add Reply
```
POST /api/v1/discussions/:id/replies
Body: {
    content: "Your reply here..."
}
Response: {
    success: true,
    data: {
        reply: { id, discussion_id, user_id, content, created_at }
    }
}
```

### 3. Update Reply
```
PUT /api/v1/discussions/:id/replies/:replyId
Body: {
    content: "Updated content..."
}
```

### 4. Delete Reply
```
DELETE /api/v1/discussions/:id/replies/:replyId
```

## Benefits

1. ✅ **Better Engagement** - Assessor dapat berkomunikasi langsung dengan students
2. ✅ **Threading** - Visual hierarchy membuat conversation mudah diikuti
3. ✅ **Modern UX** - Smooth animations, instant feedback
4. ✅ **Professional Look** - Clean, card-based design dengan purple gradients
5. ✅ **Real-time Feel** - Chat-like interface yang familiar
6. ✅ **Markdown Support** - Rich text formatting untuk code examples

## Next Steps

1. Implement reply system in backend (discussionController.js)
2. Update frontend discussions-sidebar.html
3. Add CSS for modern design
4. Test reply functionality
5. Add real-time updates (optional: WebSocket or polling)
