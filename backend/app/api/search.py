from fastapi import APIRouter, Depends, Query
from typing import List
from app.schemas.schemas import SearchResponse
from app.services.content_service import load_course_content

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/", response_model=SearchResponse)
async def search_content(q: str = Query(..., min_length=1)):
    chapters = load_course_content()
    results = []
    query_lower = q.lower()
    
    for chapter in chapters:
        chapter_matches = []
        
        if query_lower in chapter["title"].lower() or query_lower in chapter.get("description", "").lower():
            chapter_matches.append({
                "type": "chapter_metadata",
                "chapter_id": chapter["chapter_id"],
                "title": chapter["title"],
                "match": "Title/Description"
            })
        
        for section in chapter.get("content", []):
            if query_lower in section.get("text", "").lower():
                text = section.get("text", "")
                idx = text.lower().find(query_lower)
                start = max(0, idx - 100)
                end = min(len(text), idx + len(q) + 100)
                context = text[start:end]
                
                chapter_matches.append({
                    "type": "content",
                    "chapter_id": chapter["chapter_id"],
                    "section": section.get("section", ""),
                    "context": context,
                    "match": "Content"
                })
            
            for kp in section.get("key_points", []):
                if query_lower in kp.lower():
                    chapter_matches.append({
                        "type": "key_point",
                        "chapter_id": chapter["chapter_id"],
                        "section": section.get("section", ""),
                        "key_point": kp,
                        "match": "Key Point"
                    })
        
        if chapter_matches:
            results.extend(chapter_matches)
    
    return SearchResponse(query=q, results=results, total_results=len(results))
