
# Blog Post API Usage

## Endpoint

```
POST https://juwbamkqkawyibcvllvo.supabase.co/functions/v1/blog-post-api
```

## Headers

```
Content-Type: application/json
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1d2JhbWtxa2F3eWliY3ZsbHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDUxMDIsImV4cCI6MjA1NzI4MTEwMn0.uqwyR5lwp8JXa7qAZu6nZcCEdaoKOxX0XxQls2vg7Fk
```

The `apikey` header is required for authorization when calling the function.

## Request Body

```json
{
  "title": "Your Blog Post Title",
  "content": "Full blog post content with HTML formatting if needed...",
  "excerpt": "A short summary of the blog post",
  "category": "Category Name",
  "image": "https://example.com/image.jpg",
  "tags": ["tag1", "tag2", "tag3"],
  "author": "Author Name",
  "status": "published"  // or "draft"
}
```

### Required Fields
- title
- content
- excerpt
- category
- author

### Optional Fields
- image (defaults to a placeholder if not provided)
- image_url (alternative to image, will be used if both are provided)
- tags (defaults to empty array if not provided)
- status (defaults to "published" if not provided)
- featured (defaults to false if not provided)
- date (defaults to current date if not provided)
- slug (generated from title if not provided)

## Response

### Success (201 Created)

```json
{
  "success": true,
  "message": "Blog post created successfully",
  "id": "uuid-of-created-post",
  "slug": "generated-slug",
  "url": "/blog/generated-slug",
  "fullUrl": "https://automatizalo.co/blog/generated-slug"
}
```

### Error (400 Bad Request / 500 Internal Server Error)

```json
{
  "error": "Error message describing what went wrong"
}
```

## Notes

- The API automatically translates the content to Spanish and French using Google Translate API
- Translations are saved in the database and can be accessed through the blog post page
- Read time is automatically calculated based on the content length
- The API accepts both object and array inputs (if an array is passed, the first item will be used)

```
