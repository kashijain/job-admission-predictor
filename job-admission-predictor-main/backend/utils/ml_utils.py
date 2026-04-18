from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def is_duplicate_complaint(new_complaint_text, existing_complaints_texts, threshold=0.8):
    """
    Checks if a new complaint is a duplicate of existing complaints
    using TF-IDF and Cosine Similarity.
    """
    if not existing_complaints_texts:
        return False
        
    vectorizer = TfidfVectorizer(stop_words='english')
    all_texts = existing_complaints_texts + [new_complaint_text]
    
    try:
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        
        # Calculate cosine similarity between the new complaint and all others
        cosine_similarities = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1]).flatten()
        
        if len(cosine_similarities) > 0 and max(cosine_similarities) >= threshold:
            return True
            
        return False
    except Exception as e:
        # In case of empty vocabulary or malformed text
        return False
