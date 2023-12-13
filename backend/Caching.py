from cachetools import TTLCache

# Create a cache with a maximum size of 10 documents and a 60-second expiration time
document_cache = TTLCache(maxsize=10, ttl=60)

def get_document(document_id):
    if document_id in document_cache:
        return document_cache[document_id]
    else:
        # Fetch document from database
        document = ...
        document_cache[document_id] = document
        return document

# Update document in cache after editing
def update_document(document_id, content):
    # Update document in database
    ...
    document_cache[document_id] = content
