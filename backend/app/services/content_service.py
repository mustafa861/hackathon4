import json
import os
from typing import List, Dict, Any, Optional
from app.schemas.schemas import ChapterContent

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_course_content() -> List[Dict[str, Any]]:
    course_file = os.path.join(DATA_DIR, "courses", "ai_agent_development.json")
    if os.path.exists(course_file):
        with open(course_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def load_quiz_data() -> List[Dict[str, Any]]:
    quiz_file = os.path.join(DATA_DIR, "quizzes", "ai_agent_development.json")
    if os.path.exists(quiz_file):
        with open(quiz_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def load_skill(skill_name: str) -> Optional[str]:
    skill_file = os.path.join(DATA_DIR, "skills", f"{skill_name}.md")
    if os.path.exists(skill_file):
        with open(skill_file, 'r', encoding='utf-8') as f:
            return f.read()
    return None

def load_all_skills() -> Dict[str, str]:
    skills_dir = os.path.join(DATA_DIR, "skills")
    skills = {}
    if os.path.exists(skills_dir):
        for filename in os.listdir(skills_dir):
            if filename.endswith('.md'):
                skill_name = filename[:-3]
                skills[skill_name] = load_skill(skill_name)
    return skills
